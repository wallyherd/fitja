-- Etapa 10: Estrutura Completa de Dados e Telemetria para SaaS de Alta Performance

-- 1. ENUMS DE ESTADO (Tipos Fortemente Definidos)
CREATE TYPE subscription_tier AS ENUM ('free', 'premium', 'pro_plus');
CREATE TYPE user_role AS ENUM ('user', 'coach', 'admin');
CREATE TYPE goal_type AS ENUM ('weight_loss', 'muscle_gain', 'maintenance', 'habit_building');

-- 2. TABELA DE PLANOS (Para fácil alteração de valores e limites)
CREATE TABLE public.active_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  price_monthly numeric(10,2),
  price_yearly numeric(10,2),
  stripe_price_id text UNIQUE,
  is_active boolean DEFAULT true
);

-- 3. PERFIS (Atualização p/ suportar Roles e Preferências)
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS tier subscription_tier DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{"theme": "light", "units": "metric", "notifications": true}'::jsonb;

-- 4. SOPHIA CHATS (Histórico de Conversas e Memória da IA)
CREATE TABLE public.sophia_chats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  last_interaction timestamp with time zone DEFAULT now(),
  behavior_flags jsonb DEFAULT '{"urgency": "low", "tone": "friendly"}'::jsonb
);

CREATE TABLE public.sophia_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id uuid REFERENCES public.sophia_chats(id) ON DELETE CASCADE NOT NULL,
  sender text NOT NULL, -- 'user' or 'sophia'
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 5. TELEMETRIA E EVENTOS (Captura de comportamento do usuário)
CREATE TABLE public.app_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  event_name text NOT NULL, -- 'opened_camera', 'viewed_premium', 'completed_workout'
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- 6. NOTIFICAÇÕES (Log de envios e leituras)
CREATE TABLE public.notifications_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  type text, -- 'hydration', 'streak_alert', 'achievement'
  read_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- 7. RELATÓRIOS (Snapshots agregados para a IA ler rápido)
CREATE TABLE public.reports_bin (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  data_snapshot jsonb NOT NULL, -- Consolidado da semana
  ai_summary text, -- Resumo gerado pela SophIA
  created_at timestamp with time zone DEFAULT now()
);

-- 8. INDEXAÇÃO PARA ESCALA (Buscas em milissegundos)
CREATE INDEX idx_sophia_msgs_chat ON public.sophia_messages(chat_id);
CREATE INDEX idx_app_events_user ON public.app_events(user_id, event_name);
CREATE INDEX idx_reports_user_period ON public.reports_bin(user_id, period_start);

-- 9. RLS POLICIES (Segurança Total)
ALTER TABLE public.active_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sophia_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sophia_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports_bin ENABLE ROW LEVEL SECURITY;

-- Regra padrão: Apenas o dono lê/escreve seus dados
CREATE POLICY "Users access own sophia_chats" ON public.sophia_chats FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own messages" ON public.sophia_messages FOR ALL USING (EXISTS (SELECT 1 FROM public.sophia_chats WHERE id = chat_id AND user_id = auth.uid()));
CREATE POLICY "Users log own events" ON public.app_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own reports" ON public.reports_bin FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public read active plans" ON public.active_plans FOR SELECT USING (true);
