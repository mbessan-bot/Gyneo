import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { preferences, generalInfo } = await req.json();
    console.log('Matching request received:', { preferences, generalInfo });

    // Store the questionnaire response with active status
    const sessionId = crypto.randomUUID();
    const { error: insertError } = await supabase
      .from('questionnaire_responses')
      .insert({
        session_id: sessionId,
        general_info: generalInfo,
        preferences: preferences,
        is_active: true,
      });

    if (insertError) {
      console.error('Error storing questionnaire response:', insertError);
    }

    // Check if patient is active (in real implementation, this would check existing record)
    const isPatientActive = true; // New submissions are active by default
    
    if (!isPatientActive) {
      console.log('Patient is not active, returning empty results');
      return new Response(
        JSON.stringify({ matches: [], sessionId, reason: 'Patient not active' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Get all ACTIVE gynecologists that accept new patients
    const { data: gynecologists, error: queryError } = await supabase
      .from('gynecologists')
      .select('*')
      .eq('accepts_new_patients', true)
      .eq('is_active', true);

    if (queryError) {
      console.error('Error querying gynecologists:', queryError);
      throw queryError;
    }

    console.log(`Found ${gynecologists?.length || 0} active gynecologists`);

    // NON-NEGOTIABLE: Filter by language first if patient has a language preference
    let languageFilteredGynecologists = gynecologists || [];
    if (preferences.language && preferences.language !== 'no-preference' && preferences.language !== 'other') {
      languageFilteredGynecologists = languageFilteredGynecologists.filter((gyno: any) => 
        gyno.languages.includes(preferences.language)
      );
      console.log(`After language filter (${preferences.language}): ${languageFilteredGynecologists.length} gynecologists`);
      
      if (languageFilteredGynecologists.length === 0) {
        console.log('No gynecologists found matching language requirement');
        return new Response(
          JSON.stringify({ 
            matches: [], 
            sessionId, 
            reason: `No gynecologists available who speak ${preferences.language}` 
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }
    }

    // Calculate compatibility scores with percentage-based matching
    const scoredResults = (languageFilteredGynecologists || []).map((gyno: any) => {
      let score = 0;
      let maxScore = 0;

      // Gender preference (20 points)
      maxScore += 20;
      if (preferences.genderPreference && preferences.genderPreference !== 'no-preference') {
        if (gyno.gender === preferences.genderPreference) {
          score += 20;
        }
      } else {
        score += 20; // Full points if no preference
      }

      // Practice type (20 points)
      maxScore += 20;
      if (preferences.practiceType && preferences.practiceType !== 'no-preference') {
        if (gyno.practice_type === preferences.practiceType) {
          score += 20;
        }
      } else {
        score += 20; // Full points if no preference
      }

      // Language (15 points) - Already filtered, so always award full points if specified
      maxScore += 15;
      if (preferences.language && preferences.language !== 'no-preference' && preferences.language !== 'other') {
        // If we got here, language already matches (hard filter applied)
        score += 15;
      } else {
        score += 15; // Full points if no preference or other
      }

      // Consultation reason/specialty (20 points)
      maxScore += 20;
      if (preferences.consultationReason && preferences.consultationReason !== 'other') {
        if (gyno.specialties.includes(preferences.consultationReason)) {
          score += 20;
        }
      } else {
        score += 20; // Full points if other
      }

      // Availability match (10 points)
      maxScore += 10;
      if (preferences.availability && Array.isArray(preferences.availability) && preferences.availability.length > 0) {
        const matchingSlots = preferences.availability.filter((slot: string) =>
          gyno.availability.includes(slot)
        );
        const availabilityScore = (matchingSlots.length / preferences.availability.length) * 10;
        score += availabilityScore;
      } else {
        score += 10; // Full points if no availability preference
      }

      // Special conditions (10 points)
      maxScore += 10;
      if (preferences.specialConditions && Array.isArray(preferences.specialConditions) && preferences.specialConditions.length > 0) {
        const matchingConditions = preferences.specialConditions.filter((condition: string) =>
          gyno.specialties.includes(condition)
        );
        const conditionsScore = (matchingConditions.length / preferences.specialConditions.length) * 10;
        score += conditionsScore;
      } else {
        score += 10; // Full points if no special conditions
      }

      // Doctor rating (5 points max, based on 5-star scale)
      maxScore += 5;
      score += (gyno.rating || 0);

      // Calculate compatibility percentage
      const compatibilityPercentage = Math.round((score / maxScore) * 100);

      return {
        ...gyno,
        match_score: compatibilityPercentage,
      };
    });

    // Determine format based on patient preferences specificity
    // Format A: Patient has specific strong preferences (stricter filtering)
    // Format B: Patient has flexible preferences (more lenient filtering)
    const hasStrongPreferences = 
      (preferences.genderPreference && preferences.genderPreference !== 'no-preference') ||
      (preferences.practiceType && preferences.practiceType !== 'no-preference') ||
      (preferences.consultationReason && preferences.consultationReason !== 'other') ||
      (preferences.specialConditions && preferences.specialConditions.length > 0);

    const matchFormat = hasStrongPreferences ? 'A' : 'B';
    console.log(`Using matching format: ${matchFormat}`);

    // Multi-stage filtering based on format
    let qualifiedMatches;
    
    if (matchFormat === 'A') {
      // Format A: Stricter filtering with higher thresholds
      // Stage 1: Filter for 75%+ matches
      const stage1Matches = scoredResults.filter(gyno => gyno.match_score >= 75);
      
      if (stage1Matches.length >= 5) {
        qualifiedMatches = stage1Matches;
        console.log(`Format A - Stage 1: Found ${stage1Matches.length} matches at 75%+`);
      } else {
        // Stage 2: Lower threshold to 65%
        qualifiedMatches = scoredResults.filter(gyno => gyno.match_score >= 65);
        console.log(`Format A - Stage 2: Found ${qualifiedMatches.length} matches at 65%+`);
      }
    } else {
      // Format B: More lenient filtering
      // Stage 1: Filter for 65%+ matches
      const stage1Matches = scoredResults.filter(gyno => gyno.match_score >= 65);
      
      if (stage1Matches.length >= 5) {
        qualifiedMatches = stage1Matches;
        console.log(`Format B - Stage 1: Found ${stage1Matches.length} matches at 65%+`);
      } else {
        // Stage 2: Lower threshold to 55%
        qualifiedMatches = scoredResults.filter(gyno => gyno.match_score >= 55);
        console.log(`Format B - Stage 2: Found ${qualifiedMatches.length} matches at 55%+`);
      }
    }

    // Sort by match score descending
    qualifiedMatches.sort((a, b) => b.match_score - a.match_score);

    // Shuffle matches within same score groups to provide variety
    const shuffledMatches: any[] = [];
    let currentScore = -1;
    let currentGroup: any[] = [];

    for (const match of qualifiedMatches) {
      if (match.match_score !== currentScore) {
        // Shuffle the previous group and add to results
        if (currentGroup.length > 0) {
          const shuffledGroup = currentGroup.sort(() => Math.random() - 0.5);
          shuffledMatches.push(...shuffledGroup);
        }
        currentScore = match.match_score;
        currentGroup = [match];
      } else {
        currentGroup.push(match);
      }
    }
    
    // Don't forget the last group
    if (currentGroup.length > 0) {
      const shuffledGroup = currentGroup.sort(() => Math.random() - 0.5);
      shuffledMatches.push(...shuffledGroup);
    }

    // Best match filter: Take top 5 matches
    const topMatches = shuffledMatches.slice(0, 5);

    console.log(`Final matches returned: ${topMatches.length}`);
    console.log('Top matches:', topMatches.map(m => ({ name: m.name, compatibility: m.match_score + '%' })));

    return new Response(
      JSON.stringify({ matches: topMatches, sessionId }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in match-gynecologist function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An unknown error occurred' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
