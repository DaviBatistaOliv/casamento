/**
 * Wedding gift item shown on the gifts page.
 * Use `storeUrl` for store redirects, or `price` for Pix contributions.
 */
export interface GiftItem {
  readonly id: string;
  readonly name: string;
  readonly image: string;
  readonly price?: number;
  readonly storeUrl?: string;
}

/**
 * Static gift list for the MVP. Replace images, prices and links as needed.
 */
export const gifts: readonly GiftItem[] = [
  {
    id: 'aspirador-de-po',
    name: 'Aspirador de Pó',
    image: 'assets/Imagem 800x793.png',
    storeUrl: 'https://shopee.com.br/loibrasil/22892958100',
  },
  {
    id: 'jantar-romantico',
    name: 'Jantar romântico',
    image: 'assets/polaroid.png',
    price: 250,
  },
  {
    id: 'noite-hotel',
    name: 'Uma noite de hotel',
    image: 'assets/davi-mari-1.png',
    price: 400,
  },
  {
    id: 'passeio-cidade',
    name: 'Passeio pela cidade',
    image: 'assets/casal-desenho.png',
    price: 150,
  },
  {
    id: 'cafe-da-manha',
    name: 'Café da manhã especial',
    image: 'assets/a-casa-bp.jpeg',
    price: 120,
  },
  {
    id: 'experiencia-vinho',
    name: 'Experiência com vinhos',
    image: 'assets/Imagem 800x793.png',
    price: 300,
  },
  {
    id: 'contribuicao-lua-de-mel',
    name: 'Contribuição para a lua de mel',
    image: 'assets/polaroide-casal.jpeg',
    price: 200,
  },
] as const;

/**
 * Resolves a gift image path against the Vite base URL.
 */
export function resolveGiftImage(imagePath: string): string {
  const normalizedPath = imagePath.replace(/^\//, '');
  return `${import.meta.env.BASE_URL}${normalizedPath}`;
}

/**
 * Formats a BRL currency value for display.
 */
export function formatGiftPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

/**
 * Returns whether the gift redirects to an external store.
 */
export function isStoreGift(gift: GiftItem): boolean {
  return Boolean(gift.storeUrl);
}
