-- Adicionar campo WhatsApp ao perfil
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp text;
