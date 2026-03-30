-- ==========================================
-- ESTRUTURA AVANÇADA FITJÁ (FASE 3 - IMPLEMENTAÇÃO ORQUESTRADA)
-- Módulo: database-architect
-- ==========================================

-- 1. EXPANSÃO DE PROFILE PARA METABOLISMO REAL
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_calories integer;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_macros jsonb; -- { carbs_g, protein_g, fat_g }
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dietary_restrictions text[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_meals text[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wake_up_time time;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sleep_time time;

-- 2. PLANOS DE DIETA GERADOS (Módulo de Dieta)
CREATE TABLE IF NOT EXISTS public.diet_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  is_active boolean DEFAULT true,
  target_calories integer NOT NULL,
  target_macros jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.diet_meals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id uuid REFERENCES public.diet_plans(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL, -- Ex: "Café da Manhã", "Pré-Treino"
  time_of_day time,
  total_calories integer,
  total_carbs numeric,
  total_protein numeric,
  total_fat numeric,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.diet_meal_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_id uuid REFERENCES public.diet_meals(id) ON DELETE CASCADE NOT NULL,
  food_name text NOT NULL,
  amount text NOT NULL, -- Ex: "200g", "2 fatias"
  calories integer,
  carbs numeric,
  protein numeric,
  fat numeric
);

ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_meal_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Users access own plans" ON public.diet_plans FOR ALL USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users access own meal plans" ON public.diet_meals FOR ALL USING (EXISTS (SELECT 1 FROM public.diet_plans WHERE id = plan_id AND user_id = auth.uid())); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users access own meal items" ON public.diet_meal_items FOR ALL USING (EXISTS (SELECT 1 FROM public.diet_meals JOIN public.diet_plans ON diet_plans.id = diet_meals.plan_id WHERE diet_meals.id = meal_id AND diet_plans.user_id = auth.uid())); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. TREINOS E SÉRIES AVANÇADAS (Módulo de Treino Híbrido e Execução)
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  level text NOT NULL, -- "Iniciante", "Elite"
  days_per_week integer,
  focus text, -- "Hipertrofia", "Corrida", "Híbrido"
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id uuid REFERENCES public.workout_plans(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  day_of_week integer, -- 0 a 6
  type text NOT NULL, -- "Musculação", "Corrida", "Descanso"
  target_duration integer,
  performed_date date,
  rpe_score integer, -- 1 a 10 (PSE)
  is_completed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.workout_exercises (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid REFERENCES public.workout_sessions(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  sets integer,
  target_reps text, -- Pode ser range "10-12" ou "falha"
  rest_seconds integer DEFAULT 60,
  video_url text,
  obs text
);

CREATE TABLE IF NOT EXISTS public.workout_sets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  exercise_id uuid REFERENCES public.workout_exercises(id) ON DELETE CASCADE NOT NULL,
  set_number integer NOT NULL,
  performed_reps integer,
  performed_weight numeric,
  is_completed boolean DEFAULT false
);

ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Users view own workout plans" ON public.workout_plans FOR ALL USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users view own workout sessions" ON public.workout_sessions FOR ALL USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users access own exercises" ON public.workout_exercises FOR ALL USING (EXISTS (SELECT 1 FROM public.workout_sessions WHERE id = session_id AND user_id = auth.uid())); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Users access own sets" ON public.workout_sets FOR ALL USING (EXISTS (SELECT 1 FROM public.workout_exercises JOIN public.workout_sessions ON workout_sessions.id = workout_exercises.session_id WHERE workout_exercises.id = exercise_id AND workout_sessions.user_id = auth.uid())); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 4. LOG DE VISÃO E FOTOS DE COMIDA (Módulo de Análise)
CREATE TABLE IF NOT EXISTS public.meal_image_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  storage_path text NOT NULL,
  ai_analysis_json jsonb,
  is_verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.meal_image_logs ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "Users access own vision logs" ON public.meal_image_logs FOR ALL USING (auth.uid() = user_id); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- TRIGGER DE ATUALIZAÇAO DE CALORIAS APOS LOG DYNAMICS DA VISÃO -> MEALS (Omitido para manter simples. VAI SER VIA API Next).
