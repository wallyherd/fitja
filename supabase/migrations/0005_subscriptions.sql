-- Etapa 8: Adicionar controle de assinatura aos Perfis existentes e novos

ALTER TABLE public.profiles 
  ADD COLUMN subscription_status text DEFAULT 'none',
  ADD COLUMN stripe_customer_id text,
  ADD COLUMN stripe_subscription_id text,
  ADD COLUMN subscription_end_date timestamp with time zone;

-- Criar um index na assinatura para consultas rapidas no middleware/server-components
CREATE INDEX profiles_subscription_status_idx ON public.profiles (subscription_status);
