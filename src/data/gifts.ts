/**
 * How a gift is fulfilled for the guest.
 */
export type GiftFulfillment = 'store' | 'pix';

/**
 * Wedding gift item shown on the gifts page.
 *
 * Use `fulfillment: 'store'` for store redirects.
 * The CTA remains disabled until `storeUrl` is configured.
 *
 * Use `fulfillment: 'pix'` for Pix contributions.
 * Omit `price` when the guest can choose an open amount.
 *
 * Use `limited: true` to require a Supabase claim before presenting.
 */
export interface GiftItem {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly fulfillment: GiftFulfillment;
  readonly price?: number;
  readonly storeUrl?: string;
  readonly limited?: boolean;
}

/**
 * Static gift list for the wedding site.
 *
 * Gifts with a fixed price are ordered from the lowest to the highest value.
 * Gifts with the same price are kept together.
 * Gifts without a fixed price are displayed at the end.
 */
export const gifts: readonly GiftItem[] = [
  // R$ 15
  {
    id: 'docinho-depois-de-uma-dr',
    name: 'Patrocine um docinho depois de uma DR',
    description:
      'Casamento se resolve conversando, e um docinho sempre cai bem.',
    image: 'assets/gifts/chocolates.jpg',
    fulfillment: 'pix',
    price: 15,
  },

  // R$ 25
  {
    id: 'suborno-oficial-gatos',
    name: 'Suborno para os gatos',
    description:
      'Sachês e brinquedinhos para conquistar os verdadeiros donos da casa.',
    image: 'assets/gifts/gato.png',
    fulfillment: 'pix',
    price: 25,
  },

  // R$ 50
  {
    id: 'mais-uma-plantinha',
    name: 'Mais uma plantinha para a casa',
    description:
      'Ajude a noiva a comprar mais uma plantinha para encher a casa de verde.',
    image: 'assets/gifts/plantas.jpg',
    fulfillment: 'pix',
    price: 50,
  },

  // R$ 80
  {
    id: 'cobertor-razao-noiva',
    name: 'Cobertor para a noiva estar sempre coberta de razão',
    description:
      'Na prática ela sempre está, o cobertor só é um mimo.',
    image: 'assets/gifts/gato-cobreta.jpg',
    fulfillment: 'pix',
    price: 80,
  },

  // R$ 100
  {
    id: 'capacete-noivo-tpm',
    name: 'Capacete para o noivo se defender da noiva de TPM',
    description: 'Equipamento de proteção oficial.',
    image: 'assets/gifts/gato-capacete.jpeg',
    fulfillment: 'pix',
    price: 100,
  },

  // R$ 150
  {
    id: 'fundo-emergencial-ifood',
    name: 'Fundo Emergencial do iFood',
    description:
      'Para aqueles dias em que o amor existe, mas a vontade de cozinhar não.',
    image: 'assets/gifts/pizza.png',
    fulfillment: 'pix',
    price: 150,
  },

  // R$ 300
  {
    id: 'cota-razao-noivo-1',
    name: 'Cota para ajudar o noivo a ter razão',
    description: 'Resultados não garantidos.',
    image: 'assets/gifts/aqui-diz-que-vc-ta-errado.jpg',
    fulfillment: 'pix',
    price: 300,
    limited: true,
  },

  // R$ 450
  {
    id: 'cafeteira',
    name: 'Cafeteira',
    description: 'Pra garantir um café gostoso quando vier nos visitar.',
    image: 'assets/gifts/coffee-maker.jpg',
    fulfillment: 'store',
    price: 450,
    storeUrl:
      'https://www.mercadolivre.com.br/cafeteira-nespresso-vertuo-pop-preto-classico/p/MLB22857429?pdp_filters=item_id%3AMLB4609583543&attributes=COLOR%3AMLB22857429%2CVOLTAGE%3AMLB22857429&matt_tool=38524122#origin=share&sid=share&wid=MLB4609583543&action=copy',
    limited: true,
  },

  // R$ 500
  {
    id: 'aspirador-de-po',
    name: 'Aspirador de Pó',
    description: 'Para deixar a casa limpa no dia a dia.',
    image: 'assets/gifts/vacuum.jpg',
    fulfillment: 'store',
    price: 500,
    storeUrl: 'https://shopee.com.br/loibrasil/22892958100',
    limited: true,
  },

  // R$ 1.200
  {
    id: 'robo-aspirador',
    name: 'Robô Aspirador',
    description: 'Para manter a casa limpa... Ou pelo menos tentar.',
    image: 'assets/gifts/robot-vacuum.jpg',
    fulfillment: 'store',
    price: 1200,
    storeUrl: 'https://shopee.com.br/loibrasil/42565175368',
    limited: true,
  },

  // Presentes físicos ainda não configurados
  {
    id: 'presente-fisico-em-breve-1',
    name: 'Em breve',
    description: 'Novo presente físico sendo preparado.',
    image: 'assets/gifts/cookware.jpg',
    fulfillment: 'store',
  },
  {
    id: 'presente-fisico-em-breve-2',
    name: 'Em breve',
    description: 'Novo presente físico sendo preparado.',
    image: 'assets/gifts/cookware.jpg',
    fulfillment: 'store',
  },
  {
    id: 'presente-fisico-em-breve-3',
    name: 'Em breve',
    description: 'Novo presente físico sendo preparado.',
    image: 'assets/gifts/cookware.jpg',
    fulfillment: 'store',
  },

  // Valor livre
  {
    id: 'o-que-seu-coracao-mandar',
    name: 'O que seu coração mandar',
    description:
      'Sua presença já é o nosso maior presente. Se quiser nos presentear de outra forma, escolha o valor que seu coração mandar.',
    image: 'assets/gifts/heart-gift.jpg',
    fulfillment: 'pix',
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
 * Returns whether the gift is fulfilled via an external store.
 */
export function isStoreGift(gift: GiftItem): boolean {
  return gift.fulfillment === 'store';
}

/**
 * Returns whether the store gift can be opened.
 */
export function hasStoreUrl(gift: GiftItem): boolean {
  return isStoreGift(gift) && Boolean(gift.storeUrl?.trim());
}

/**
 * Returns whether the gift has a fixed price.
 */
export function hasGiftPrice(
  gift: GiftItem,
): gift is GiftItem & { readonly price: number } {
  return typeof gift.price === 'number' && gift.price > 0;
}

/**
 * Returns whether the gift requires a Supabase claim before presenting.
 */
export function isLimitedGift(gift: GiftItem): boolean {
  return gift.limited === true;
}

/**
 * Returns whether the gift opens a Pix contribution flow.
 */
export function isPixGift(gift: GiftItem): boolean {
  return gift.fulfillment === 'pix';
}

/**
 * Returns whether the Pix gift allows the guest to choose the amount.
 */
export function isOpenAmountPixGift(gift: GiftItem): boolean {
  return isPixGift(gift) && !hasGiftPrice(gift);
}
