-- Add is_active column to gynecologists table
ALTER TABLE public.gynecologists 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Add is_active column to questionnaire_responses table
ALTER TABLE public.questionnaire_responses 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Update existing records to be active by default
UPDATE public.gynecologists SET is_active = true WHERE is_active IS NULL;
UPDATE public.questionnaire_responses SET is_active = true WHERE is_active IS NULL;