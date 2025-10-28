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

    // Store the questionnaire response
    const sessionId = crypto.randomUUID();
    const { error: insertError } = await supabase
      .from('questionnaire_responses')
      .insert({
        session_id: sessionId,
        general_info: generalInfo,
        preferences: preferences,
      });

    if (insertError) {
      console.error('Error storing questionnaire response:', insertError);
    }

    // Get all gynecologists that accept new patients (no strict filtering)
    const { data: gynecologists, error: queryError } = await supabase
      .from('gynecologists')
      .select('*')
      .eq('accepts_new_patients', true);

    if (queryError) {
      console.error('Error querying gynecologists:', queryError);
      throw queryError;
    }

    console.log(`Found ${gynecologists?.length || 0} gynecologists`);

    // Calculate compatibility scores with percentage-based matching
    const scoredResults = (gynecologists || []).map((gyno: any) => {
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

      // Language (15 points)
      maxScore += 15;
      if (preferences.language && preferences.language !== 'no-preference' && preferences.language !== 'other') {
        if (gyno.languages.includes(preferences.language)) {
          score += 15;
        }
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

    // Filter to only matches with 80% or higher compatibility
    const qualifiedMatches = scoredResults.filter(gyno => gyno.match_score >= 80);

    // Sort by match score descending and take top 5
    const topMatches = qualifiedMatches
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 5);

    console.log(`Qualified matches (80%+): ${qualifiedMatches.length}`);
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
