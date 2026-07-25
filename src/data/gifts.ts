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
 * Use `claimLimit` to allow more than one reservation (defaults to 1).
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
  /** Maximum reservations when `limited` is true. Defaults to 1. */
  readonly claimLimit?: number;
}

/**
 * Static gift list for the wedding site.
 *
 * Gifts with a fixed price are ordered from the lowest to the highest value.
 * Gifts with the same price are kept together.
 * Gifts without a fixed price are displayed at the end.
 */
export const gifts: readonly GiftItem[] = [
  // R$ 50
  {
    id: 'docinho-depois-de-uma-dr',
    name: 'Patrocine um Docinho Depois de uma DR',
    description:
      'Casamento se resolve conversando, e um docinho sempre cai bem.',
    image: 'assets/gifts/chocolates.jpg',
    fulfillment: 'pix',
    price: 50,
  },

  // R$ 52
  {
    id: 'suborno-oficial-gatos',
    name: 'Suborno para os Gatos',
    description:
      'Sachês e brinquedinhos para conquistar os verdadeiros donos da casa.',
    image: 'assets/gifts/gato.png',
    fulfillment: 'pix',
    price: 52,
  },

  // R$ 55
  {
    id: 'mais-uma-plantinha',
    name: 'Mais uma Plantinha para a Casa',
    description:
      'Ajude a noiva a comprar mais uma plantinha para encher a casa de verde.',
    image: 'assets/gifts/plantas.jpg',
    fulfillment: 'pix',
    price: 55,
  },

  // R$ 83
  {
    id: 'cobertor-razao-noiva',
    name: 'Cobertor para a Noiva Estar Sempre Coberta de Razão',
    description:
      'Na prática ela sempre está, o cobertor só é um mimo.',
    image: 'assets/gifts/gato-cobreta.jpg',
    fulfillment: 'pix',
    price: 83,
  },

  // R$ 107
  {
    id: 'capacete-noivo-tpm',
    name: 'Capacete para o Noivo se Defender da Noiva de TPM',
    description: 'Equipamento de proteção oficial.',
    image: 'assets/gifts/gato-capacete.jpeg',
    fulfillment: 'pix',
    price: 107,
  },

  // R$ 157
  {
    id: 'fundo-emergencial-ifood',
    name: 'Fundo Emergencial do iFood',
    description:
      'Para aqueles dias em que o amor existe, mas a vontade de cozinhar não.',
    image: 'assets/gifts/pizza.png',
    fulfillment: 'pix',
    price: 157,
  },

  // R$ 313
  {
    id: 'cota-razao-noivo-1',
    name: 'Cota para Ajudar o Noivo a Ter Razão',
    description: 'Resultados não garantidos.',
    image: 'assets/gifts/aqui-diz-que-vc-ta-errado.jpg',
    fulfillment: 'pix',
    price: 313,
    limited: true,
  },

  // R$ 451
  {
    id: 'cafeteira',
    name: 'Cafeteira',
    description: 'Pra garantir um café gostoso quando vier nos visitar.',
    image: 'assets/gifts/coffee-maker.jpg',
    fulfillment: 'store',
    price: 451,
    storeUrl:
      'https://www.mercadolivre.com.br/cafeteira-nespresso-vertuo-pop-preto-classico/p/MLB22857429?pdp_filters=item_id%3AMLB4609583543&attributes=COLOR%3AMLB22857429%2CVOLTAGE%3AMLB22857429&matt_tool=38524122#origin=share&sid=share&wid=MLB4609583543&action=copy',
    limited: true,
  },

  // R$ 503
  {
    id: 'aspirador-de-po',
    name: 'Aspirador de Pó',
    description: 'Para deixar a casa limpa no dia a dia.',
    image: 'assets/gifts/vacuum.jpg',
    fulfillment: 'store',
    price: 503,
    storeUrl: 'https://shopee.com.br/product/359168917/22892958100',
    limited: true,
    claimLimit: 1,
  },

  // R$ 1.207
  {
    id: 'robo-aspirador',
    name: 'Robô Aspirador',
    description: 'Para manter a casa limpa... Ou pelo menos tentar.',
    image: 'assets/gifts/robot-vacuum.jpg',
    fulfillment: 'store',
    price: 1207,
    storeUrl: 'https://shopee.com.br/loibrasil/42565175368',
    limited: true,
    claimLimit: 1,
  },

  // Presentes físicos (loja)
  {
    id: 'kit-roupa-cama',
    name: 'Jogo de Cama Casal',
    description: 'Jogo de cama para o novo lar.',
    image: 'assets/gifts/jogo-cama.jpg',
    fulfillment: 'store',
    storeUrl:
      'https://www.mercadolivre.com.br/jogo-de-cama-casal-buddemeyer-cotton-essential-cor-bege-002/p/MLB61179364?pdp_filters=item_id%3AMLB6167864036&attributes=COLOR%3AMLB61179364&matt_tool=38524122#origin=share&sid=share&wid=MLB6167864036&action=copy',
    limited: true,
    claimLimit: 2,
  },
  {
    id: 'kit-toalhas',
    name: 'Jogo de Toalhas',
    description: 'Toalhas macias para o dia a dia.',
    image: 'assets/gifts/jogo-toalhas.jpg',
    fulfillment: 'store',
    storeUrl:
      'https://www.mercadolivre.com.br/jogo-de-toalhas-buddemeyer-brisa-banho-branco-5-pecas/p/MLB29596516?product_trigger_id=MLB29402281&pdp_filters=official_store:2946&applied_product_filters=MLB29401172&picker=true',
    limited: true,
  },
  {
    id: 'cobredom',
    name: 'Cobredom Casal Cinza',
    description: 'Para noites aconchegantes o ano todo.',
    image: 'assets/gifts/cobredom-cinza.jpg',
    fulfillment: 'store',
    storeUrl: 'https://shopee.com.br/enxovintao/23494815662',
    limited: true,
  },
  {
    id: 'multiprocessador',
    name: 'Multiprocessador',
    description: 'Aliado na cozinha para facilitar o preparo das refeições.',
    image: 'assets/gifts/multiprocessador.jpg',
    fulfillment: 'store',
    storeUrl: 'https://shopee.com.br/casas_bahia_oficial/58206310295',
    limited: true,
  },
  {
    id: 'manta-sofa',
    name: 'Manta para o Sofá',
    description: 'Conforto extra para os momentos de descanso.',
    image: 'assets/gifts/bedding.jpg',
    fulfillment: 'store',
    limited: true,
  },
  {
    id: 'ferro-vapor',
    name: 'Ferro de Vapor',
    description: 'Para manter as roupas sempre em ordem.',
    image: 'assets/gifts/ferro-vapor.jpg',
    fulfillment: 'store',
    storeUrl: 'https://shopee.com.br/loibrasil/40104446304',
    limited: true,
  },
  {
    id: 'mixer',
    name: 'Mixer',
    description: 'Prático para o dia a dia na cozinha.',
    image: 'assets/gifts/mixer.jpg',
    fulfillment: 'store',
    storeUrl: 'https://shopee.com.br/dmv5.comercial/57612116481',
    limited: true,
  },
  {
    id: 'arranhador-gatos',
    name: 'Arranhador para Gatos — OIP1154',
    description: 'Árvore de gatos para brincar e afiar as unhas.',
    image: 'assets/gifts/arranhador-gatos.jpg',
    fulfillment: 'store',
    storeUrl: 'https://shopee.com.br/cocozone2023/21197730331',
    limited: true,
  },

  // Valor livre
  {
    id: 'o-que-seu-coracao-mandar',
    name: 'O Que Seu Coração Mandar',
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
 * Returns the maximum number of reservations for a limited gift.
 */
export function getGiftClaimLimit(gift: GiftItem): number {
  if (!isLimitedGift(gift)) {
    return 0;
  }
  if (typeof gift.claimLimit === 'number' && gift.claimLimit > 0) {
    return gift.claimLimit;
  }
  return 1;
}

/**
 * Returns whether a limited gift has reached its reservation limit.
 */
export function isGiftClaimExhausted(
  gift: GiftItem,
  claimCount: number,
): boolean {
  if (!isLimitedGift(gift)) {
    return false;
  }
  return claimCount >= getGiftClaimLimit(gift);
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
