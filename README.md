# Casamento — Mari & Davi

Site do convite de casamento (Vue 3 + Vite) com lista de presentes via Pix e reserva de itens limitados no Supabase.

## Desenvolvimento

```bash
cp .env.example .env
npm install
npm run dev
```

Abra `http://localhost:5173/casamento/`.

## Lista de presentes

Edite `src/data/gifts.ts`:

- Presente via **Pix**: informe `price` (número em reais).
- Presente via **loja**: informe `storeUrl` (ex.: Shopee).
- Presente **limitado** (1 por casamento): `limited: true` — exige confirmação e claim no Supabase; some da lista após confirmar.
- `image` aponta para um arquivo em `public/assets/`.

### Variáveis Pix

Configure no `.env` (ou Secrets do GitHub Actions):

- `VITE_PIX_KEY` — chave Pix (EVP, e-mail, telefone `+55…`, CPF ou CNPJ)
- `VITE_PIX_NAME` — nome do recebedor (até 25 caracteres no QR)
- `VITE_PIX_CITY` — cidade (até 15 caracteres no QR)

Exemplo:

```env
VITE_PIX_KEY=39208a51-ee70-4202-bef4-fb5109773d09
VITE_PIX_NAME=Davi Batista de Moura Oliveira
VITE_PIX_CITY=Barueri
```

Depois de alterar o `.env`, reinicie o `npm run dev`.

### Supabase (reserva de presentes)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **SQL Editor**, execute o script [`supabase/schema.sql`](supabase/schema.sql).
3. Em **Project Settings → API**, copie URL e `anon` key para o `.env`:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

4. Para reabrir um item claimed, apague a linha em **Table Editor → gift_claims**.

No GitHub Actions, cadastre também `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` como Secrets.

## Build

```bash
npm run build
```

A saída fica em `dist/` (inclui `404.html` para deep links no GitHub Pages).

## Publicar no GitHub Pages

O workflow em `.github/workflows/static.yml` faz build e publica `dist/` a cada push em `master`.

1. Em **Settings → Pages**, use **GitHub Actions** como source.
2. Cadastre Secrets: `VITE_PIX_KEY`, `VITE_PIX_NAME`, `VITE_PIX_CITY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.
3. Site: `https://davibatistaoliv.github.io/casamento/`
4. Lista de presentes: `https://davibatistaoliv.github.io/casamento/presentes`

## Estrutura

- `src/views/InviteView.vue` — convite
- `src/views/GiftsView.vue` — lista de presentes
- `src/data/gifts.ts` — itens da lista (edite aqui)
- `src/services/gift-claims.service.ts` — claims no Supabase
- `supabase/schema.sql` — tabela e RLS
- `public/assets/` — imagens e vídeos
