-- Etapa 10 - Motor de Regras de Negócio SQL (Streaks, Metas e Expiração)

-- 1. FUNÇÃO: CALCULAR PROGRESSO DIÁRIO (Trigger ativado em log de Comida, Treino ou Água)
CREATE OR REPLACE FUNCTION public.calculate_daily_progress()
RETURNS TRIGGER AS $$
DECLARE
  v_score NUMERIC := 0;
  v_user_id UUID;
  v_date DATE;
  v_water_goal NUMERIC;
  v_current_water NUMERIC;
  v_has_food BOOLEAN;
  v_has_workout BOOLEAN;
BEGIN
  -- Determinar User e Data (Independente da tabela que disparou)
  v_user_id := COALESCE(NEW.user_id, OLD.user_id);
  v_date := COALESCE(NEW.date, CURRENT_DATE);

  -- Pegar meta de água do perfil
  SELECT daily_water_goal_ml INTO v_water_goal FROM public.profiles WHERE id = v_user_id;
  
  -- Verificar Logs Reais
  SELECT (water_ml >= COALESCE(v_water_goal, 2500)), workout_done, meals_logged 
  INTO v_current_water, v_has_workout, v_has_food
  FROM public.daily_logs WHERE user_id = v_user_id AND date = v_date;
  
  -- Cálculo de Terços (100% = 33.33 + 33.33 + 33.34)
  IF v_has_food THEN v_score := v_score + 33.33; END IF;
  IF v_current_water THEN v_score := v_score + 33.33; END IF;
  IF v_has_workout THEN v_score := v_score + 33.34; END IF;

  UPDATE public.daily_logs SET points = v_score 
  WHERE user_id = v_user_id AND date = v_date;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. FUNÇÃO: GERENCIAMENTO DE STREAK (Aumenta ao fechar 100%, zera se falhar 24h)
CREATE OR REPLACE FUNCTION public.manage_user_streak()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o progresso atingiu 100%, incrementa o streak se ainda não foi incrementado hoje
  IF NEW.points >= 100 AND (OLD.points < 100 OR OLD.points IS NULL) THEN
    UPDATE public.profiles 
    SET current_streak = current_streak + 1,
        last_check_in = CURRENT_DATE
    WHERE id = NEW.user_id AND (last_check_in IS NULL OR last_check_in < CURRENT_DATE);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. TRIGGER: SINCRONIZAÇÃO AUTOMÁTICA DE STREAK
CREATE TRIGGER trg_manage_streak
AFTER UPDATE OF points ON public.daily_logs
FOR EACH ROW
EXECUTE FUNCTION public.manage_user_streak();

-- 4. FUNÇÃO: TRATAMENTO DE EXPIRAÇÃO PREMIUM (Manutenção Automática)
CREATE OR REPLACE FUNCTION public.check_premium_expiration()
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET subscription_status = 'none'
  WHERE subscription_status = 'active' 
    AND subscription_end_date < NOW();
END;
$$ LANGUAGE plpgsql;

-- 5. TRIGGER DE CONQUISTAS (Achievement Engine)
CREATE OR REPLACE FUNCTION public.unlock_basic_achievements()
RETURNS TRIGGER AS $$
BEGIN
  -- Primeira Água (Apenas 1 vez)
  IF TG_TABLE_NAME = 'water_logs' THEN
    INSERT INTO public.achievements_log (user_id, badge_slug)
    VALUES (NEW.user_id, 'first_water')
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Primeiro Treino
  IF TG_TABLE_NAME = 'workouts' THEN
    INSERT INTO public.achievements_log (user_id, badge_slug)
    VALUES (NEW.user_id, 'first_workout')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_unlock_water_achievement AFTER INSERT ON public.water_logs FOR EACH ROW EXECUTE FUNCTION public.unlock_basic_achievements();
CREATE TRIGGER trg_unlock_workout_achievement AFTER INSERT ON public.workouts FOR EACH ROW EXECUTE FUNCTION public.unlock_basic_achievements();
