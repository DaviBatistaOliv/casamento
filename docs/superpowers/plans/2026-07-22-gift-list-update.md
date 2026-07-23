# Gift List Update Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox syntax.

**Goal:** Replace the gifts catalog with the new 18-item list, Pix-without-amount support, and disabled store CTAs until links exist.

**Architecture:** Static data in `src/data/gifts.ts`; card/modal consume `fulfillment` + optional `price`; Pix BR Code omits field 54 when amount is absent.

**Tech Stack:** Vue 3, TypeScript, existing `qrcode` Pix helper, static assets under `public/assets/gifts/`.

## Global Constraints

- Portuguese copy for guest-facing UI.
- One export per file where already the pattern; keep helpers colocated in `gifts.ts`.
- No new dependencies.
- Do not commit unless asked.

---

### Task 1: Pix optional amount

**Files:** `src/lib/pix-brcode.ts`, `src/components/gift/PixModal.vue`

- [ ] Make `amount` optional in `buildStaticPixPayload` / `createPixCharge`; omit TLV `54` when absent.
- [ ] Allow PixModal to load when `price` is undefined; adjust helper copy.

### Task 2: Gift data + images

**Files:** `src/data/gifts.ts`, `public/assets/gifts/*`

- [ ] Extend `GiftItem` with `description` and `fulfillment`.
- [ ] Replace catalog with 18 items.
- [ ] Download stock images where possible; fallback to couple photos.

### Task 3: GiftCard + styles

**Files:** `src/components/gift/GiftCard.vue`, `src/styles/main.css`

- [ ] Show description; “Você escolhe” when no price on Pix; disable CTA for store without URL.
- [ ] Style description + disabled CTA.

### Task 4: GiftsView copy

**Files:** `src/views/GiftsView.vue`

- [ ] Open Pix for open-amount gifts; keep claim flow for future limited items.
- [ ] Soften subtitle toward Pix + upcoming store links.
