-- Create gynecologists table
CREATE TABLE public.gynecologists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('female', 'male')),
  practice_type TEXT NOT NULL CHECK (practice_type IN ('hospital', 'private', 'clinic')),
  specialties TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{}',
  availability TEXT[] NOT NULL DEFAULT '{}',
  location TEXT NOT NULL,
  rating NUMERIC(3,2) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  years_experience INTEGER NOT NULL CHECK (years_experience >= 0),
  bio TEXT,
  accepts_new_patients BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create questionnaire_responses table for tracking user submissions
CREATE TABLE public.questionnaire_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  general_info JSONB NOT NULL,
  preferences JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.gynecologists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gynecologists (public read access for matching)
CREATE POLICY "Anyone can view gynecologists"
ON public.gynecologists
FOR SELECT
USING (true);

-- RLS Policies for questionnaire_responses (users can insert their own responses)
CREATE POLICY "Anyone can insert questionnaire responses"
ON public.questionnaire_responses
FOR INSERT
WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX idx_gynecologists_gender ON public.gynecologists(gender);
CREATE INDEX idx_gynecologists_practice_type ON public.gynecologists(practice_type);
CREATE INDEX idx_gynecologists_rating ON public.gynecologists(rating DESC);
CREATE INDEX idx_gynecologists_languages ON public.gynecologists USING GIN(languages);
CREATE INDEX idx_gynecologists_specialties ON public.gynecologists USING GIN(specialties);
CREATE INDEX idx_gynecologists_availability ON public.gynecologists USING GIN(availability);

-- Insert sample gynecologists data
INSERT INTO public.gynecologists (name, gender, practice_type, specialties, languages, availability, location, rating, years_experience, bio) VALUES
('Dr. Sarah Mitchell', 'female', 'hospital', ARRAY['routine-checkup', 'pregnancy', 'fertility'], ARRAY['english', 'spanish'], ARRAY['weekday-mornings', 'weekday-afternoons'], 'New York, NY', 4.8, 15, 'Board-certified gynecologist with extensive experience in maternal-fetal medicine.'),
('Dr. Emily Chen', 'female', 'private', ARRAY['routine-checkup', 'menopause', 'hormones'], ARRAY['english', 'mandarin'], ARRAY['weekday-afternoons', 'weekend-mornings'], 'San Francisco, CA', 4.9, 12, 'Specializing in holistic women''s health and hormone therapy.'),
('Dr. Michael Roberts', 'male', 'clinic', ARRAY['pregnancy', 'birth-control', 'sti-screening'], ARRAY['english', 'french'], ARRAY['weekday-mornings', 'weekend-afternoons'], 'Los Angeles, CA', 4.6, 20, 'Compassionate care with focus on reproductive health.'),
('Dr. Jennifer Lopez', 'female', 'hospital', ARRAY['pregnancy', 'high-risk', 'surgery'], ARRAY['english', 'spanish'], ARRAY['weekday-afternoons', 'weekday-evenings'], 'Miami, FL', 4.9, 18, 'Expert in high-risk pregnancies and minimally invasive surgery.'),
('Dr. Amanda Williams', 'female', 'private', ARRAY['routine-checkup', 'pcos', 'fertility'], ARRAY['english'], ARRAY['weekday-mornings', 'weekday-afternoons', 'weekend-mornings'], 'Chicago, IL', 4.7, 10, 'Patient-centered approach to reproductive endocrinology.'),
('Dr. Lisa Thompson', 'female', 'clinic', ARRAY['routine-checkup', 'birth-control', 'menopause'], ARRAY['english', 'arabic'], ARRAY['weekday-evenings', 'weekend-afternoons'], 'Houston, TX', 4.8, 14, 'Dedicated to providing comprehensive gynecological care.'),
('Dr. David Martinez', 'male', 'hospital', ARRAY['pregnancy', 'surgery', 'endometriosis'], ARRAY['english', 'spanish'], ARRAY['weekday-mornings', 'weekday-afternoons'], 'Phoenix, AZ', 4.5, 22, 'Experienced in complex gynecological surgeries.'),
('Dr. Rachel Green', 'female', 'private', ARRAY['routine-checkup', 'hormones', 'menopause'], ARRAY['english', 'french'], ARRAY['weekday-afternoons', 'weekend-mornings'], 'Seattle, WA', 4.9, 16, 'Focusing on midlife women''s health and wellness.');