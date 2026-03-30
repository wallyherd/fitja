-- Adiciona a coluna de tracking de constância no Perfil
ALTER TABLE public.profiles ADD COLUMN current_streak integer DEFAULT 0;

-- Criação da tabela principal de Logs Diários para a Dashboard Mestra
CREATE TABLE public.daily_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL, -- ex: '2026-03-28'
  
  -- Progresso Mestre
  water_ml integer DEFAULT 0,
  workout_done boolean DEFAULT false,
  meals_logged integer DEFAULT 0,
  
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Restringe para apenas 1 log por dia por usuário (Prevenção de duplicatas)
  CONSTRAINT unique_daily_log_per_user UNIQUE (user_id, date)
);

-- Ativa o RLS (Row Level Security)
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura: Usuários leem apenas seus próprios dias de progresso
CREATE POLICY "Leitura restrita ao próprio usuário (Logs)"
  ON public.daily_logs FOR SELECT
  USING ( auth.uid() = user_id );

-- Políticas de Inserção
CREATE POLICY "Inserção restrita ao próprio usuário (Logs)"
  ON public.daily_logs FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

-- Políticas de Atualização
CREATE POLICY "Atualização restrita ao próprio usuário (Logs)"
  ON public.daily_logs FOR UPDATE
  USING ( auth.uid() = user_id );
