-- Criação da Tabela Pai: Treinos (Workouts)
CREATE TABLE public.workouts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL, 
  time time NOT NULL, 
  type text NOT NULL, -- ex: 'Musculação'
  duration_minutes integer NOT NULL DEFAULT 0,
  intensity text NOT NULL DEFAULT 'Moderado',
  calories_burned integer DEFAULT 0,
  observation text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INDEX para performance na busca de treinos do dia/historico
CREATE INDEX workouts_user_date_idx ON public.workouts (user_id, date);

-- Habilita RLS
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

-- Políticas de Treino
CREATE POLICY "Acesso completo aos proprios treinos"
  ON public.workouts FOR ALL
  USING ( auth.uid() = user_id )
  WITH CHECK ( auth.uid() = user_id );

-- TRIGGER DE SINCRONIZAÇÃO COM O RING "DIA SAUDÁVEL" DA DASHBOARD
CREATE OR REPLACE FUNCTION sync_workout_done()
RETURNS TRIGGER AS $$
DECLARE
  workout_count integer;
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.daily_logs
    SET workout_done = true
    WHERE user_id = NEW.user_id AND date = NEW.date;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Checa se existe mais algum treino daquele dia
    SELECT count(*) INTO workout_count FROM public.workouts WHERE user_id = OLD.user_id AND date = OLD.date;
    IF workout_count = 0 THEN
      UPDATE public.daily_logs SET workout_done = false WHERE user_id = OLD.user_id AND date = OLD.date;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_workout_created_deleted
  AFTER INSERT OR DELETE ON public.workouts
  FOR EACH ROW EXECUTE PROCEDURE sync_workout_done();
