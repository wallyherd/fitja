-- Etapa 10 - Views de Contexto para SophIA (O Cérebro da IA)

-- 1. VIEW: RESUMO SEMANAL (Simplificado para o Gemini ler rápido)
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

-- 2. VIEW: FLAGS DE COMPORTAMENTO (SophIA Behavioral Engine)
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

-- 3. FUNCTION: REGISTRO DE EVENTOS AUTOMÁTICOS (Audit Trail)
CREATE OR REPLACE FUNCTION public.auto_log_app_event()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.subscription_status = 'active' AND OLD.subscription_status = 'none' THEN
    INSERT INTO public.app_events (user_id, event_name, metadata)
    VALUES (NEW.id, 'upgrade_to_premium', '{"source": "automatic_sync"}'::jsonb);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_event_upgrade AFTER UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.auto_log_app_event();

-- 4. CRON: LIMPEZA DE LOGS ANTIGOS (Manutenção de Performance - Supabase Cron)
-- SELECT cron.schedule('check-premium-expiry', '0 0 * * *', 'SELECT public.check_premium_expiration()');
