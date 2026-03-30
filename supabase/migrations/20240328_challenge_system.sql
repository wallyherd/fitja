
-- 1. DESAFAFIS TABLE
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  prizes JSONB,
  rules TEXT,
  policy TEXT,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PARTICIPANTS (Must be Premium to join)
CREATE TABLE IF NOT EXISTS public.challenge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  checkin_streak INTEGER DEFAULT 0,
  last_checkin_date DATE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

-- 3. ACTIVITY FEED & LOGS
CREATE TABLE IF NOT EXISTS public.challenge_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES public.challenge_participants(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'photo', 'meal', 'checkin'
  points INTEGER DEFAULT 0,
  content TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PERMISSIONS & POLICIES (RLS)
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_activities ENABLE ROW LEVEL SECURITY;

-- Everyone can view active challenges
CREATE POLICY "Public challenges are viewable by everyone" ON public.challenges
FOR SELECT USING (true);

-- Only premium can join (Logic checks in app/actions)
CREATE POLICY "Users can view their own participation" ON public.challenge_participants
FOR SELECT USING (auth.uid() = user_id);

-- Everyone can see the ranking
CREATE POLICY "Rankings are public" ON public.challenge_participants
FOR SELECT USING (true);

-- Everyone can see activities (the feed)
CREATE POLICY "Activities are public" ON public.challenge_activities
FOR SELECT USING (true);

-- Only participants can post
CREATE POLICY "Only participants can post activities" ON public.challenge_activities
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.challenge_participants 
    WHERE id = participant_id AND user_id = auth.uid()
  )
);

-- Initial Challenge Setup (Seca Tudo 21D)
INSERT INTO public.challenges (name, description, end_date, prizes, rules, policy)
VALUES (
  'Seca Tudo 21D', 
  'Derreta gordura e ganhe massa em 21 dias de foco total.', 
  NOW() + INTERVAL '21 days',
  '[{"rank": 1, "prize": "Combo 30und Marmita Fitness + Kit de Suplementos"}, {"rank": 2, "prize": "Combo 14und Marmita Fitness + Suplemento"}, {"rank": 3, "prize": "Combo 7und Marmita Fitness"}]',
  'Postar foto no feed, registrar refeições e check-in diário.',
  'O desafio terá equipe para verificar atividades. Riscos pessoais são de responsabilidade do usuário. Ilegalidades causam cancelamento.'
);
