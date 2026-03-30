# Guia de Deploy Vercel: FitJá PWA

Para colocar o seu app online e acessível em qualquer celular (PWA), siga os passos abaixo:

## 1. Login e Link
No terminal do seu projeto, rode o comando para logar e vincular sua conta:
```bash
npx vercel login
npx vercel link
```
Siga as instruções para criar um novo projeto chamado `fitja-app`.

## 2. Configuração de Variáveis (Essencial)
Acesse o painel da Vercel em seu projeto → Settings → Environment Variables. Adicione as chaves que estão no seu `.env.local`:

| Chave | Valor (Exemplo) |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Sua URL do Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sua Chave Anon |
| `GOOGLE_AI_API_KEY` | Sua Chave da Google AI |
| `STRIPE_SECRET_KEY` | sk_test_... |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | pk_test_... |
| `NEXT_PUBLIC_SITE_URL` | https://seu-app.vercel.app |

## 3. Deploy Final
Rode o comando:
```bash
npx vercel --prod
```

---

> [!TIP]
> **Dica PWA**: Assim que o deploy terminar, abra a URL no seu celular (Safari no iPhone ou Chrome no Android). Vá em **"Adicionar à Tela de Início"** para instalar o FitJá como um aplicativo nativo!
