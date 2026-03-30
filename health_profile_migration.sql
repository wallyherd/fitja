-- Atualização do Perfil de Saúde (IMC + Dados Físicos)
-- Adiciona campos necessários para cálculo de IMC e perfil completo

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS height numeric; -- Altura em cm
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS weight numeric; -- Peso em kg
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS age integer;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS activity_level text; -- sedentary, light, moderate, intense
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp text;

-- Comentários para documentação
COMMENT ON COLUMN public.profiles.height IS 'Altura em centímetros';
COMMENT ON COLUMN public.profiles.weight IS 'Peso em quilogramas';
COMMENT ON COLUMN public.profiles.activity_level IS 'Nível de atividade física do usuário';
COMMENT ON COLUMN public.profiles.whatsapp IS 'Número de telefone WhatsApp do usuário';
