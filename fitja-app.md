# FitJá - Plano de Construção do Projeto

**Project Type:** WEB (Mobile-First PWA com Next.js e Supabase)

## 0. Resumo Executivo e Sucesso
**Visão:** FitJá é o app definitivo para ajudar usuários comuns a manter constância na saúde (alimentação, água, treino).
**Objetivos:**
- Reter os usuários combinando interface fluida ("humana, moderna, viciante") com sistema freemium R$9/mês ou R$69/anual.
- Trabalhar orquestradamente com a assistente virtual "SophIA - Coach FitJá" atuante no WhatsApp.
**Tech Stack:** `Next.js 14 (App Router) + Tailwind v4 + Supabase + Stripe`.

---

## 1. Arquitetura Geral do Sistema
- **Frontend App:** Interface "Mobile-first" Next.js, com UX focada em `glassmorphism`, transições orgânicas (Framer Motion) e paletas em `Dark/Light Mode` impecáveis.
- **Backend / BaaS:** Supabase encapsulando o banco PostgreSQL. Isso garante "Realtime sync" para casos onde a SophIA atualiza os dados no WhatsApp e o app reflita automaticamente.
- **Micro-serviços / Webhooks:** Edge Functions para gerenciar Webhooks do Stripe (assinatura) e chamadas da IA (SophIA).

## 2. Rotas do App (Next.js App Router)
- `/(marketing)/` -> Landing page premium.
- `/(auth)/login` e `/(auth)/cadastro` -> Entrada suave.
- `/onboarding` -> Fluxo interativo e humano para coletar metas.
- `/app/dashboard` -> Painel principal, constância e resumo diário.
- `/app/treino`, `/app/alimentacao`, `/app/agua` -> Módulos transacionais.
- `/app/dashboard/relatorios` -> Relatórios avançados (Premium).
- `/app/perfil` e `/app/assinatura` -> Gestão Freemium/Paywall.
- `/admin` -> Painel administrativo simplificado para editar valores de planos.

## 3. Módulos Principais
1. **Identidade e Progresso Diário:** Gráficos circulares de Ring de Atividades.
2. **Registro de Refeição e Água:** Sistema rápido, cliques mínimos, sem formulários longos.
3. **Gamificação (Streak/Conquistas):** Contabilizador in-app (x dias contínuos).
4. **Área Premium:** Bloqueio inteligente (hard/soft paywalls) para relatórios refinados e dicas ativas da IA.

## 4. Estrutura de Componentes Reutilizáveis (`/components/ui/`)
- `CardGlass`: Para dashboards com blur escuro e overlays de luz.
- `RingProgress`: Animação vetorial que preenche a meta diária de kcal ou água.
- `PaywallModal`: Pop-up persuasivo para o upgrade.
- `StreakBadge`: Ícones que contam os acertos consecutivos.

## 5. Entidades do Banco de Dados (Supabase/PostgreSQL)
- `users`: id, email, role, stripe_customer_id, is_premium, streak_days.
- `daily_metrics`: id, user_id, date, water_ml, calories_in, calories_out.
- `achievements`: id, user_id, badge_name, unlocked_at.
- `subscriptions`: user_id, plan_type (anual/mensal), status, expires_at.
- `ai_logs`: id, user_id, conversation_context (Para memória da SophIA).

## 6. Fluxo de Onboarding
- **Etapa 1:** Nome e como se sente atualmente (baixo energia? foco em definir?).
- **Etapa 2:** Confirmação da meta calórica/água com explicação rápida (sem jargões científicos chatos).
- **Etapa 3:** Tela "A SophIA está analisando seus dados", finalizando em CTA de assinatura premium imediata (oferta relâmpago), com opção de bypass "iniciar versão free".

## 7. Fluxo de Uso Diário
1. O usuário abre o app ou PWA de manhã → Vê os arcos vazios de hidratação e refeição.
2. Em 3 cliques, ele adiciona o treino feito. O App confetes/som agradável aparecem.
3. Se esquecer, recebe a notificação da SophIA (Push ou WhatsApp) à tarde.

## 8. Fluxo de Monetização
- Paywall transparente com "Lock icons" nos relatórios avançados ou na análise de dieta detalhada.
- Clique → Abre `Stripe Checkout`.
- Após sucesso → Webhook via Edge Function mapeia `is_premium = true` no `users`. Redireciona com fireworks.

## 9. Fluxo de Integração com SophIA
- O usuário aciona o bot do WhatsApp, ou o próprio app oferece um botão nativo.
- SophIA pergunta, "Comeu aquela pizza?". Se sim, a IA dispara uma requisição POST na API do app.
- A API (Supabase) atualiza a `daily_metrics`.
- O app, monitorando o realtime supabase socket, atualiza a barra calorífica da UI ao vivo sem F5.

## 10. Organização entre Frontend, Backend e Banco
```bash
/fitja
  /src
    /app           # Rotas da web e Layouts
    /components    # Componentes e fragmentos da UI
    /lib           # Utilitários, Supabase client
    /actions       # Server Actions do Next.js (Segurança)
    /styles        # Tailwind v4 globals
  /supabase        # Arquivos de schema, rls e types do banco
  ...
```

## 11. Sistema de Permissões (Row Level Security)
- **Roles base**: `FREE_USER`, `PREMIUM_USER`, `ADMIN`.
- *RLS no Supabase*: O usuário pode ler e escrever apenas os dados do próprio `user_id`. Modificar status de assinatura (is_premium) só será possível através da chave do servidor no Webhook do Stripe ou `ADMIN`.

## 12. Estratégia de Escalabilidade
- Inicialmente *Serverless* com Next.js (Vercel) + BaaS (Supabase), permitindo 0 a milhões de requisições com auto-scale.
- CDN cache para todos assets da UI.
- Arquitetura "API Route / Edge" permite que as requisições da IA SophIA sejam separadas da carga de renderização do front-end.

---

## 📋 Task Breakdown (Para Fase 4)

### P0 - Fundação e Database
- [ ] **Task 1: Scaffold Next.js + Tailwind** (`frontend-specialist`). INPUT: repo vazio. OUTPUT: Next.js + globals.css configurados. VERIFY: `npm run build` passa.
- [ ] **Task 2: Setup Supabase + RLS** (`database-architect`). INPUT: Supabase keys. OUTPUT: Banco com `users`, `daily_metrics` e autenticação com Row Level Security. VERIFY: Insert anônimo bloqueado.

### P1 - Core App & Onboarding
- [ ] **Task 3: Fluxo Auth + Onboarding UI** (`frontend-specialist`).
- [ ] **Task 4: Dashboard Interativo** (`frontend-specialist`). INPUT: Componente Circular Progress. OUTPUT: Tela `/app/dashboard` com mock realtime.

### P2 - Funcionalidades Premium e Pagamentos
- [ ] **Task 5: Integração Checkout Stripe** (`backend-specialist`). INPUT: Chaves Stripe. OUTPUT: Geração link de R$9 ou R$69.
- [ ] **Task 6: Webhook Stripe Auth** (`security-auditor`). INPUT: Assinatura paga. OUTPUT: Webhook atualiza Supabase `is_premium`. VERIFY: Teste de stripe CLI webhook.

### P3 - Gamificação e IA Endpoints
- [ ] **Task 7: Endpoint da SophIA** (`backend-specialist`). INPUT: Payload de chatbot. OUTPUT: Escrita aprovada e atualização realtime.
- [ ] **Task 8: UI Área Premium** (`frontend-specialist`). INPUT: Estado premium. OUTPUT: Desbloqueio das funções avançadas e painel admin.

---

## ✅ PHASE X (Verificação Oobrigatória)
- [ ] Security Scan (RLS verificado e APIs fechadas para CORS da SophIA).
- [ ] UX Audit (Botões Mínimos de Toque 44px).
- [ ] Validação E2E do Fluxo de Pagamento Free -> Premium.
