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

    // Build the matching query
    let query = supabase
      .from('gynecologists')
      .select('*')
      .eq('accepts_new_patients', true);

    // Filter by gender preference
    if (preferences.genderPreference && preferences.genderPreference !== 'no-preference') {
      query = query.eq('gender', preferences.genderPreference);
    }

    // Filter by practice type
    if (preferences.practiceType && preferences.practiceType !== 'no-preference') {
      query = query.eq('practice_type', preferences.practiceType);
    }

    // Filter by language
    if (preferences.language && preferences.language !== 'no-preference' && preferences.language !== 'other') {
      query = query.contains('languages', [preferences.language]);
    }

    // Filter by specialties (consultation reason)
    if (preferences.consultationReason && preferences.consultationReason !== 'other') {
      query = query.contains('specialties', [preferences.consultationReason]);
    }

    // Get all matching gynecologists
    const { data: gynecologists, error: queryError } = await query;

    if (queryError) {
      console.error('Error querying gynecologists:', queryError);
      throw queryError;
    }

    console.log(`Found ${gynecologists?.length || 0} matching gynecologists`);

    // Score and rank the results
    const scoredResults = (gynecologists || []).map((gyno: any) => {
      let score = 0;

      // Base score from rating
      score += (gyno.rating || 0) * 20;

      // Bonus for availability match
      if (preferences.availability && Array.isArray(preferences.availability)) {
        const matchingSlots = preferences.availability.filter((slot: string) =>
          gyno.availability.includes(slot)
        );
        score += matchingSlots.length * 10;
      }

      // Bonus for specialty match with special conditions
      if (preferences.specialConditions && Array.isArray(preferences.specialConditions)) {
        const matchingConditions = preferences.specialConditions.filter((condition: string) =>
          gyno.specialties.includes(condition)
        );
        score += matchingConditions.length * 15;
      }

      // Bonus for experience
      score += Math.min(gyno.years_experience, 25) * 0.5;

      // Comfort level consideration (prefer higher rated doctors for higher sensitivity)
      if (preferences.sensitivity === 'very-sensitive') {
        score += (gyno.rating - 4.5) * 30;
      }

      return {
        ...gyno,
        match_score: Math.round(score * 10) / 10,
      };
    });

    // Sort by match score descending and take top 5
    const topMatches = scoredResults
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 5);

    console.log('Top matches:', topMatches.map(m => ({ name: m.name, score: m.match_score })));

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
