-- Tabela de Copos de Água (Histórico detalhado por minuto/hora)
CREATE TABLE public.water_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  amount_ml integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX water_logs_idx ON public.water_logs (user_id, date);

ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Access own water_logs"
  ON public.water_logs FOR ALL
  USING ( auth.uid() = user_id )
  WITH CHECK ( auth.uid() = user_id );

----------------------------------------------------------
-- TRIGGER DE SUMARIZAÇÃO: WATER_LOGS -> DAILY_LOGS
----------------------------------------------------------
CREATE OR REPLACE FUNCTION sum_daily_water()
RETURNS TRIGGER AS $$
DECLARE
  total_ml integer;
  tgt_user_id uuid;
  tgt_date date;
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    tgt_user_id := NEW.user_id;
    tgt_date := NEW.date;
  ELSIF TG_OP = 'DELETE' THEN
    tgt_user_id := OLD.user_id;
    tgt_date := OLD.date;
  END IF;

  -- Faz a somatória total
  SELECT COALESCE(SUM(amount_ml), 0) INTO total_ml
  FROM public.water_logs
  WHERE user_id = tgt_user_id AND date = tgt_date;

  -- Atualiza o Log Diário Geral para retroalimentar o Ring System
  UPDATE public.daily_logs
  SET water_ml = total_ml
  WHERE user_id = tgt_user_id AND date = tgt_date;

  RETURN NULL; -- AFTER trigger
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_water_changed
  AFTER INSERT OR UPDATE OR DELETE ON public.water_logs
  FOR EACH ROW EXECUTE PROCEDURE sum_daily_water();
