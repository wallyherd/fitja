-- ==========================================
-- ESTRUTURA COMPLETA FITJÁ (SOCIALLY & PHYSICALLY READY)
-- ==========================================

-- 1. EXTENSÕES E TIPOS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE subscription_tier AS ENUM ('free', 'premium', 'pro_plus');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'coach', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE goal_type AS ENUM ('weight_loss', 'muscle_gain', 'maintenance', 'habit_building');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. TABELA DE PERFIS (Estrutura Final Consolidada)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text NOT NULL,
  first_name text,
  full_name text,
  role user_role DEFAULT 'user',
  tier subscription_tier DEFAULT 'free',
  is_premium boolean DEFAULT false,
  onboarding_completed boolean DEFAULT false,
  
  -- Dados de Onboarding
  primary_goal text,
  fitness_level text,
  workout_frequency text,
  main_struggle text,
  daily_water_goal_ml integer DEFAULT 2000,
  daily_routine_type text,
  hardest_time text,
  coaching_preference text,

  -- Gamificação e Assinatura
  current_streak integer DEFAULT 0,
  last_check_in date,
  subscription_status text DEFAULT 'none',
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_end_date timestamp with time zone,
  
  -- Preferências
  preferences jsonb DEFAULT '{"theme": "light", "units": "metric", "notifications": true}'::jsonb,
  
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Campos adicionais para Perfil e Saúde (Fix de atualização de perfil)
  whatsapp text,
  avatar_url text,
  height numeric,
  weight numeric,
  age integer,
  gender text,
  activity_level text
);


ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. TABELA DE PLANOS
CREATE TABLE IF NOT EXISTS public.active_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  price_monthly numeric(10,2),
  price_yearly numeric(10,2),
  stripe_price_id text UNIQUE,
  is_active boolean DEFAULT true
);

ALTER TABLE public.active_plans ENABLE ROW LEVEL SECURITY;

-- 4. TABELA DE LOGS DIÁRIOS
CREATE TABLE IF NOT EXISTS public.daily_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  water_ml integer DEFAULT 0,
  workout_done boolean DEFAULT false,
  meals_logged integer DEFAULT 0,
  points numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_daily_log_per_user UNIQUE (user_id, date)
);

ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

-- 5. REFEIÇÕES E ITENS
CREATE TABLE IF NOT EXISTS public.meals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  name text NOT NULL,
  observation text,
  total_calories integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.meal_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_id uuid REFERENCES public.meals(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  amount numeric NOT NULL,
  unit text NOT NULL,
  calories integer DEFAULT 0
);

ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_items ENABLE ROW LEVEL SECURITY;

-- 6. TREINOS
CREATE TABLE IF NOT EXISTS public.workouts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL, 
  time time NOT NULL, 
  type text NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 0,
  intensity text NOT NULL DEFAULT 'Moderado',
  calories_burned integer DEFAULT 0,
  observation text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

-- 7. HIDRATAÇÃO
CREATE TABLE IF NOT EXISTS public.water_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  amount_ml integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;

-- 8. CONQUISTAS (Achievements)
CREATE TABLE IF NOT EXISTS public.achievements_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_slug text NOT NULL,
  earned_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, badge_slug)
);

ALTER TABLE public.achievements_log ENABLE ROW LEVEL SECURITY;

-- 9. SOPHIA (IA Chat)
CREATE TABLE IF NOT EXISTS public.sophia_chats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  last_interaction timestamp with time zone DEFAULT now(),
  behavior_flags jsonb DEFAULT '{"urgency": "low", "tone": "friendly"}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.sophia_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id uuid REFERENCES public.sophia_chats(id) ON DELETE CASCADE NOT NULL,
  sender text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.sophia_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sophia_messages ENABLE ROW LEVEL SECURITY;

-- 10. TELEMETRIA E EVENTOS
CREATE TABLE IF NOT EXISTS public.app_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  event_name text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.app_events ENABLE ROW LEVEL SECURITY;

-- 11. RELATÓRIOS AGREGADOS
CREATE TABLE IF NOT EXISTS public.reports_bin (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  data_snapshot jsonb NOT NULL,
  ai_summary text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.reports_bin ENABLE ROW LEVEL SECURITY;

-- 12. NOTIFICAÇÕES (Sistema de Avisos)
CREATE TABLE IF NOT EXISTS public.notifications_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  type text, -- 'hydration', 'streak_alert', 'achievement', 'news'
  read_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notifications_log ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Users access own notifications" ON public.notifications_log FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users access own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users access own daily_logs" ON public.daily_logs FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users access own meals" ON public.meals FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users access own meal_items" ON public.meal_items FOR ALL USING (EXISTS (SELECT 1 FROM public.meals WHERE id = meal_id AND user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users access own workouts" ON public.workouts FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users access own water_logs" ON public.water_logs FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users access own achievements" ON public.achievements_log FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users access own sophia_chats" ON public.sophia_chats FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users access own messages" ON public.sophia_messages FOR ALL USING (EXISTS (SELECT 1 FROM public.sophia_chats WHERE id = chat_id AND user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users view own reports" ON public.reports_bin FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public read active plans" ON public.active_plans FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ==========================================
-- TRIGGERS E FUNÇÕES DE NEGÓCIO
-- ==========================================

-- A. Criação de Perfil Automático no Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- B. Sincronização de Progresso Diário (Calcula 33/33/34%)
CREATE OR REPLACE FUNCTION public.calculate_daily_progress()
RETURNS TRIGGER AS $$
DECLARE
  v_score NUMERIC := 0;
  v_user_id UUID;
  v_date DATE;
  v_water_goal NUMERIC;
  v_current_water BOOLEAN;
  v_has_food BOOLEAN;
  v_has_workout BOOLEAN;
BEGIN
  v_user_id := COALESCE(NEW.user_id, OLD.user_id);
  v_date := COALESCE(NEW.date, CURRENT_DATE);

  SELECT daily_water_goal_ml INTO v_water_goal FROM public.profiles WHERE id = v_user_id;
  
  SELECT (water_ml >= COALESCE(v_water_goal, 2000)), (workout_done = true), (meals_logged > 0)
  INTO v_current_water, v_has_workout, v_has_food
  FROM public.daily_logs WHERE user_id = v_user_id AND date = v_date;
  
  IF v_has_food THEN v_score := v_score + 33.33; END IF;
  IF v_current_water THEN v_score := v_score + 33.33; END IF;
  IF v_has_workout THEN v_score := v_score + 33.34; END IF;

  UPDATE public.daily_logs SET points = v_score WHERE user_id = v_user_id AND date = v_date;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- C. Gerenciamento de Streak
CREATE OR REPLACE FUNCTION public.manage_user_streak()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.points >= 100 AND (OLD.points < 100 OR OLD.points IS NULL) THEN
    UPDATE public.profiles 
    SET current_streak = current_streak + 1,
        last_check_in = CURRENT_DATE
    WHERE id = NEW.user_id AND (last_check_in IS NULL OR last_check_in < CURRENT_DATE);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_manage_streak ON public.daily_logs;
CREATE TRIGGER trg_manage_streak AFTER UPDATE OF points ON public.daily_logs FOR EACH ROW EXECUTE FUNCTION public.manage_user_streak();

-- D. Sincronização Water -> Daily
CREATE OR REPLACE FUNCTION sum_daily_water()
RETURNS TRIGGER AS $$
DECLARE
  total_ml integer;
  tgt_user_id uuid;
  tgt_date date;
BEGIN
  tgt_user_id := COALESCE(NEW.user_id, OLD.user_id);
  tgt_date := COALESCE(NEW.date, OLD.date);

  SELECT COALESCE(SUM(amount_ml), 0) INTO total_ml FROM public.water_logs WHERE user_id = tgt_user_id AND date = tgt_date;
  
  INSERT INTO public.daily_logs (user_id, date, water_ml) VALUES (tgt_user_id, tgt_date, total_ml)
  ON CONFLICT (user_id, date) DO UPDATE SET water_ml = total_ml;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_water_changed ON public.water_logs;
CREATE TRIGGER on_water_changed AFTER INSERT OR UPDATE OR DELETE ON public.water_logs FOR EACH ROW EXECUTE FUNCTION sum_daily_water();

-- E. Sincronização Workout -> Daily
CREATE OR REPLACE FUNCTION sync_workout_done()
RETURNS TRIGGER AS $$
DECLARE
  workout_exists boolean;
  tgt_user_id uuid;
  tgt_date date;
BEGIN
  tgt_user_id := COALESCE(NEW.user_id, OLD.user_id);
  tgt_date := COALESCE(NEW.date, OLD.date);

  SELECT EXISTS(SELECT 1 FROM public.workouts WHERE user_id = tgt_user_id AND date = tgt_date) INTO workout_exists;
  
  INSERT INTO public.daily_logs (user_id, date, workout_done) VALUES (tgt_user_id, tgt_date, workout_exists)
  ON CONFLICT (user_id, date) DO UPDATE SET workout_done = workout_exists;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_workout_changed ON public.workouts;
CREATE TRIGGER on_workout_changed AFTER INSERT OR UPDATE OR DELETE ON public.workouts FOR EACH ROW EXECUTE FUNCTION sync_workout_done();

-- F. Sincronização Meals -> Daily
CREATE OR REPLACE FUNCTION sync_meals_logged()
RETURNS TRIGGER AS $$
DECLARE
  meal_count integer;
  tgt_user_id uuid;
  tgt_date date;
BEGIN
  tgt_user_id := COALESCE(NEW.user_id, OLD.user_id);
  tgt_date := COALESCE(NEW.date, OLD.date);

  SELECT COUNT(*) INTO meal_count FROM public.meals WHERE user_id = tgt_user_id AND date = tgt_date;
  
  INSERT INTO public.daily_logs (user_id, date, meals_logged) VALUES (tgt_user_id, tgt_date, meal_count)
  ON CONFLICT (user_id, date) DO UPDATE SET meals_logged = meal_count;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_meals_changed ON public.meals;
CREATE TRIGGER on_meals_changed AFTER INSERT OR UPDATE OR DELETE ON public.meals FOR EACH ROW EXECUTE FUNCTION sync_meals_logged();

-- G. Atualizador de Pontuação (Trigger Mestre)
DROP TRIGGER IF EXISTS trg_calc_points ON public.daily_logs;
CREATE TRIGGER trg_calc_points AFTER UPDATE OF water_ml, workout_done, meals_logged ON public.daily_logs FOR EACH ROW EXECUTE FUNCTION public.calculate_daily_progress();

-- 11. VIEWS SOPHIA
CREATE OR REPLACE VIEW public.vw_sophia_weekly_health AS
SELECT 
    user_id,
    COUNT(*) FILTER (WHERE points >= 100) AS perfect_days,
    COUNT(*) FILTER (WHERE workout_done = true) AS total_workouts,
    SUM(water_ml) AS total_water_ml,
    AVG(points) AS avg_score,
    (SELECT full_name FROM public.profiles WHERE id = user_id) as user_name
FROM public.daily_logs
WHERE date >= (CURRENT_DATE - INTERVAL '7 days')
GROUP BY user_id;

CREATE OR REPLACE VIEW public.vw_sophia_behavior_alerts AS
WITH user_data AS (
   SELECT 
     id,
     current_streak,
     last_check_in,
     (SELECT water_ml FROM public.daily_logs WHERE user_id = p.id AND date = CURRENT_DATE) as today_water,
     (SELECT daily_water_goal_ml FROM public.profiles WHERE id = p.id) as water_goal
   FROM public.profiles p
)
SELECT 
   id AS user_id,
   CASE 
      WHEN current_streak >= 7 THEN 'on_fire'
      WHEN current_streak > 0 AND last_check_in < (CURRENT_DATE - INTERVAL '1 day') THEN 'streak_at_risk'
      WHEN COALESCE(today_water,0) < (water_goal * 0.2) AND EXTRACT(HOUR FROM NOW()) > 14 THEN 'dehydration_risk'
      ELSE 'normal'
   END AS current_state
FROM user_data;

-- ==========================================
-- GATILHOS DE NOTIFICAÇÃO (Ofensivas e Alertas)
-- ==========================================

-- 🚀 Ofensiva Mantida (100% Score)
CREATE OR REPLACE FUNCTION public.notify_daily_goal()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.points >= 100 AND (OLD.points < 100 OR OLD.points IS NULL) THEN
    INSERT INTO public.notifications_log (user_id, title, body, type)
    VALUES (NEW.user_id, '🚀 Ofensiva Mantida!', 'Você completou seu checklist diário. Parabéns!', 'streak_alert');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notify_daily_goal ON public.daily_logs;
CREATE TRIGGER trg_notify_daily_goal AFTER UPDATE OF points ON public.daily_logs FOR EACH ROW EXECUTE FUNCTION public.notify_daily_goal();

-- 📢 Enviar Notícia Global (Admin)
CREATE OR REPLACE FUNCTION public.send_global_news(p_title text, p_body text)
RETURNS void AS $$
BEGIN
  INSERT INTO public.notifications_log (user_id, title, body, type)
  SELECT id, p_title, p_body, 'news'
  FROM public.profiles;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
