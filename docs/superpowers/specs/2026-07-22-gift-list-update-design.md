# Gift list update — design

## Goal

Replace the wedding gift list with the curated 18-item list (real store items + humorous Pix contributions), including descriptions, prices, and images.

## Decisions

- **Real items** (aspirador, air fryer, cafeteira, panelas, louças, cama): `fulfillment: 'store'`, `storeUrl` empty for now, CTA disabled (“Em breve”).
- **Humorous items**: `fulfillment: 'pix'` with fixed `price`.
- **“O que seu coração mandar”**: Pix QR with key only (no amount field in BR Code).
- **Images**: stock photos when a good match exists; otherwise reuse existing couple photos as fallback.
- **Claims / limited**: not used for this list (no active store links yet).

## Data model

```ts
interface GiftItem {
  id: string;
  name: string;
  description: string;
  image: string;
  fulfillment: 'store' | 'pix';
  price?: number;
  storeUrl?: string;
  limited?: boolean;
}
```

## UI

- Card shows image, name (with emoji), description, price or “Você escolhe”, CTA.
- Store without URL: disabled button.
- Pix modal: if no price, copy explains guest enters amount in the bank app.
