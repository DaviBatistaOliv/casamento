# Casamento

Convite digital + lista de presentes.

Feito em Vue 3 e Vite. Os convidados confirmam presença no convite e, na lista, escolhem um presente — Pix (com QR) ou link de loja. Itens limitados (um por casamento) são reservados no Supabase e somem da lista depois da confirmação.

---

## Subir local

```bash
cp .env.example .env
npm install
npm run dev
```

Abra [http://localhost:5173/casamento/](http://localhost:5173/casamento/).

---

## Lista de presentes

Tudo vive em `src/data/gifts.ts`. Cada item pode ser:

| Campo | Quando usar |
| --- | --- |
| `price` | Presente via Pix (valor em reais) |
| `storeUrl` | Presente via loja (Shopee, etc.) |
| `limited: true` | Só um disponível — exige claim no Supabase |
| `image` | Arquivo em `public/assets/` |

### Pix

No `.env` (e nos Secrets do GitHub Actions):

```env
VITE_PIX_KEY=sua-chave-pix
VITE_PIX_NAME=Nome do recebedor
VITE_PIX_CITY=Cidade
```

- `VITE_PIX_KEY` — EVP, e-mail, telefone (`+55…`), CPF ou CNPJ  
- `VITE_PIX_NAME` — até 25 caracteres no QR  
- `VITE_PIX_CITY` — até 15 caracteres no QR  

Reinicie o `npm run dev` depois de mudar o `.env`.

### Supabase (itens limitados)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, rode [`supabase/schema.sql`](supabase/schema.sql).
3. Em **Project Settings → API**, copie URL e chave `anon` / publishable para o `.env`:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

4. Para liberar de novo um item claimed, apague a linha em **Table Editor → gift_claims**.

No Actions, cadastre os mesmos secrets: `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.

---

## Build e deploy

```bash
npm run build
```

A pasta `dist/` sai pronta (com `404.html` para deep links no GitHub Pages).

O workflow [`.github/workflows/static.yml`](.github/workflows/static.yml) publica a cada push em `master`.

1. **Settings → Pages** → source: **GitHub Actions**
2. Secrets: `VITE_PIX_KEY`, `VITE_PIX_NAME`, `VITE_PIX_CITY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Site: `https://<usuario>.github.io/casamento/`
4. Presentes: `https://<usuario>.github.io/casamento/presentes`

---

## Onde mexer

| Caminho | O quê |
| --- | --- |
| `src/views/InviteView.vue` | Convite |
| `src/views/GiftsView.vue` | Lista de presentes |
| `src/data/gifts.ts` | Itens da lista |
| `src/services/gift-claims.service.ts` | Claims no Supabase |
| `supabase/schema.sql` | Tabela e RLS |
| `public/assets/` | Imagens e vídeos |
