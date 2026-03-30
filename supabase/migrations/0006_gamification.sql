-- Etapa 9: Tabela de Troféus (Achievements) focada em Retenção
CREATE TABLE public.achievements_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_slug text NOT NULL,
  earned_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, badge_slug) -- Garante que o usuário ganhe o card apenas 1 vez!
);

CREATE INDEX achievements_log_idx ON public.achievements_log (user_id);

ALTER TABLE public.achievements_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Access own achievements"
  ON public.achievements_log FOR ALL
  USING ( auth.uid() = user_id )
  WITH CHECK ( auth.uid() = user_id );

-- (Opção Avançada para o MVP) Atualizações Automáticas de Streak ao abrir a Dashboard
-- Serão computadas na camada de Servidor do NextJS ao invés de usar Cronjob pra evitar custos de Nuvem Inativos!
