import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all patients
    const { data: patients, error: patientsError } = await supabase
      .from('questionnaire_responses')
      .select('*');

    if (patientsError) throw patientsError;

    // Get all gynecologists
    const { data: gynecologists, error: gynosError } = await supabase
      .from('gynecologists')
      .select('*')
      .eq('accepts_new_patients', true);

    if (gynosError) throw gynosError;

    console.log(`Analyzing ${patients?.length} patients against ${gynecologists?.length} gynecologists`);

    // Calculate best match score for each patient
    const patientBestScores = (patients || []).map((patient: any) => {
      const preferences = patient.preferences;
      
      let bestScore = 0;

      (gynecologists || []).forEach((gyno: any) => {
        let score = 0;
        let maxScore = 0;

        // Gender preference (20 points)
        maxScore += 20;
        if (preferences.genderPreference && preferences.genderPreference !== 'no-preference') {
          if (gyno.gender === preferences.genderPreference) {
            score += 20;
          }
        } else {
          score += 20;
        }

        // Practice type (20 points)
        maxScore += 20;
        if (preferences.practiceType && preferences.practiceType !== 'no-preference') {
          if (gyno.practice_type === preferences.practiceType) {
            score += 20;
          }
        } else {
          score += 20;
        }

        // Language (15 points)
        maxScore += 15;
        if (preferences.language && preferences.language !== 'no-preference' && preferences.language !== 'other') {
          if (gyno.languages.includes(preferences.language)) {
            score += 15;
          }
        } else {
          score += 15;
        }

        // Consultation reason/specialty (20 points)
        maxScore += 20;
        if (preferences.consultationReason && preferences.consultationReason !== 'other') {
          if (gyno.specialties.includes(preferences.consultationReason)) {
            score += 20;
          }
        } else {
          score += 20;
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
          score += 10;
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
          score += 10;
        }

        // Doctor rating (5 points max)
        maxScore += 5;
        score += (gyno.rating || 0);

        // Calculate compatibility percentage
        const compatibilityPercentage = Math.round((score / maxScore) * 100);

        if (compatibilityPercentage > bestScore) {
          bestScore = compatibilityPercentage;
        }
      });

      return {
        patientId: patient.id,
        patientName: patient.general_info.name,
        bestMatchScore: bestScore,
      };
    });

    // Sort by best match score
    patientBestScores.sort((a, b) => b.bestMatchScore - a.bestMatchScore);

    // Calculate distribution at different thresholds
    const thresholds = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
    const distribution = thresholds.map(threshold => {
      const matchedPatients = patientBestScores.filter(p => p.bestMatchScore >= threshold);
      return {
        threshold: threshold + '%',
        matchedPatients: matchedPatients.length,
        matchRate: ((matchedPatients.length / patientBestScores.length) * 100).toFixed(1) + '%',
      };
    });

    // Find threshold for ~50% match rate
    const totalPatients = patientBestScores.length;
    const targetMatches = Math.ceil(totalPatients * 0.5);
    const medianScore = patientBestScores[targetMatches - 1]?.bestMatchScore || 0;

    console.log('Analysis complete');
    console.log(`Median score (50th percentile): ${medianScore}%`);

    return new Response(
      JSON.stringify({
        totalPatients: patientBestScores.length,
        totalGynecologists: gynecologists?.length,
        medianScore,
        thresholdFor50Percent: medianScore,
        distribution,
        sampleBestScores: patientBestScores.slice(0, 10),
        worstScores: patientBestScores.slice(-10),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in analyze-compatibility function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An unknown error occurred' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
