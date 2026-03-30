-- SQL para Criar o Bucket 'avatars' e configurar as Políticas de Segurança (RLS)
-- Use este script no Painel SQL Editor do seu Supabase

-- 1. Inserir bucket na tabela de storage se no existir
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Poltica: Permitir que QUALQUER UM veja as fotos (Pblico)
CREATE POLICY "Public Read" ON storage.objects
FOR SELECT TO public USING (bucket_id = 'avatars');

-- 3. Poltica: Permitir que o prprio usurio faa UPLOAD e DELETE de sua foto
CREATE POLICY "Auth Upload Own Avatar" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Auth Update Own Avatar" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Auth Delete Own Avatar" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
