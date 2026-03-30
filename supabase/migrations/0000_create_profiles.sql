-- Cria a tabela de Perfil Público pareada com a tabela de Autenticação do Supabase
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  first_name text,
  is_premium boolean default false,
  onboarding_completed boolean default false,
  
  -- Dados Coletados no Onboarding
  primary_goal text,
  fitness_level text,
  workout_frequency text,
  main_struggle text,
  daily_water_goal_ml integer,
  daily_routine_type text,
  hardest_time text,
  coaching_preference text,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ativa o Row Level Security na tabela publica de perfis
alter table public.profiles enable row level security;

-- Politicas de Leitura e Escrita
create policy "Usuários podem ler o próprio perfil."
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Usuários podem atualizar o próprio perfil."
  on public.profiles for update
  using ( auth.uid() = id );

-- Criação do Trigger Automático (Toda vez que alguém assina, cria a linha no BD)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger disparado no AUTH do Supabase
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
