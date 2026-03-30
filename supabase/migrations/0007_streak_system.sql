-- Etapa 9.5: Motor de Persistencia de Gamificação
ALTER TABLE public.profiles 
  ADD COLUMN current_streak integer DEFAULT 0,
  ADD COLUMN last_check_in date;

-- Index p/ performance em listas de ranking futuro
CREATE INDEX profiles_streak_idx ON public.profiles (current_streak);
