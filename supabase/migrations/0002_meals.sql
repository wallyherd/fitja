-- 1. Criação da Tabela Pai: Refeições (Meals)
CREATE TABLE public.meals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL, -- ex: '2026-03-28'
  time time NOT NULL, -- ex: '12:30:00'
  name text NOT NULL, -- ex: 'Café da Manhã'
  observation text,
  total_calories integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Criação da Tabela Filha: Itens Alimentares (Meal Items)
CREATE TABLE public.meal_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_id uuid REFERENCES public.meals(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL, -- ex: 'Arroz Branco'
  amount numeric NOT NULL, -- ex: 100
  unit text NOT NULL, -- ex: 'g' ou 'colheres'
  calories integer DEFAULT 0
);

-- INDEX para performance na busca diária
CREATE INDEX meals_user_date_idx ON public.meals (user_id, date);

-- Habilita RLS
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_items ENABLE ROW LEVEL SECURITY;

-- Políticas de Refeições
CREATE POLICY "Acesso completo aos proprios meals"
  ON public.meals FOR ALL
  USING ( auth.uid() = user_id )
  WITH CHECK ( auth.uid() = user_id );

-- Políticas de Itens. Itens pertencem a uma refeição, a refeição pertence a um user.
-- Para simplificar o MVP com RLS focado, permitimos aos usuários acessar itens das SUAS refeições.
CREATE POLICY "Acesso a itens das proprias refeicoes"
  ON public.meal_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.meals
      WHERE meals.id = meal_items.meal_id
      AND meals.user_id = auth.uid()
    )
  );

-- TRIGGER DE SINCRONIZAÇÃO COM A DASHBOARD
-- Quando o usuário salva uma refeição (ou exclui), atualizamos a Daily Logs

CREATE OR REPLACE FUNCTION sync_meals_logged()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Garante que o log existe ou tenta atualizar
    UPDATE public.daily_logs
    SET meals_logged = meals_logged + 1
    WHERE user_id = NEW.user_id AND date = NEW.date;
    
    -- Observação: se ele tiver pulado direto pra tela de Comida, o Log Diário pode não existir hoje.
    -- O nosso front-end (getOrCreateDailyLog) normalmente já cria, 
    -- mas idealmente se ele registrar só comida, o Server Action criaria.
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.daily_logs
    SET meals_logged = GREATEST(0, meals_logged - 1)
    WHERE user_id = OLD.user_id AND date = OLD.date;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_meal_created_deleted
  AFTER INSERT OR DELETE ON public.meals
  FOR EACH ROW EXECUTE PROCEDURE sync_meals_logged();
