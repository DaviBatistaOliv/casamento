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
    name: 'Patrocine um docinho depois de uma DR',
    description:
      'Casamento se resolve conversando, e um docinho sempre cai bem.',
    image: 'assets/gifts/chocolates.jpg',
    fulfillment: 'pix',
    price: 50,
  },

  // R$ 83
  {
    id: 'cobertor-razao-noiva',
    name: 'Cobertor para a noiva estar sempre coberta de razão',
    description:
      'Na prática ela sempre está, o cobertor só é um mimo.',
    image: 'assets/gifts/gato-cobreta.jpg',
    fulfillment: 'pix',
    price: 88,
  },

  // R$ 55
  {
    id: 'mais-uma-plantinha',
    name: 'Mais uma plantinha para a casa',
    description:
      'Ajude a noiva a comprar mais uma plantinha para encher a casa de verde.',
    image: 'assets/gifts/plantas.jpg',
    fulfillment: 'pix',
    price: 55,
  },

  // R$ 107
  {
    id: 'capacete-noivo-tpm',
    name: 'Capacete para o noivo se defender da noiva de TPM',
    description: 'Equipamento de proteção oficial!',
    image: 'assets/gifts/gato-capacete.jpg',
    fulfillment: 'pix',
    price: 120,
  },

  // R$ 157
  {
    id: 'fundo-emergencial-ifood',
    name: 'Fundo emergencial do iFood',
    description:
      'Para aqueles dias em que o amor existe, mas a vontade de cozinhar não.',
    image: 'assets/gifts/pizza.png',
    fulfillment: 'pix',
    price: 157,
  },

  // R$ 313
  {
    id: 'cota-razao-noivo-1',
    name: 'Cota para ajudar o noivo a ter razão',
    description: 'Resultados não garantidos.',
    image: 'assets/gifts/aqui-diz-que-vc-ta-errado.jpg',
    fulfillment: 'pix',
    price: 200,
  },

  // R$ 451
  {
    id: 'cafeteira',
    name: 'Cafeteira',
    description: 'Pra garantir um café gostoso quando vier nos visitar.',
    image: 'assets/gifts/coffee-maker.jpg',
    fulfillment: 'store',    
    storeUrl:
      'https://www.mercadolivre.com.br/cafeteira-nespresso-vertuo-pop-preto-classico/p/MLB22857429?pdp_filters=item_id%3AMLB4609583543&attributes=COLOR%3AMLB22857429%2CVOLTAGE%3AMLB22857429&matt_tool=38524122#origin=share&sid=share&wid=MLB4609583543&action=copy',
    limited: true,
  },

  // R$ 503
  {
    id: 'aspirador-de-po',
    name: 'Aspirador de pó',
    description: 'Para deixar a casa limpa no dia a dia.',
    image: 'assets/gifts/vacuum.jpg',
    fulfillment: 'store',    
    storeUrl: 'https://shopee.com.br/product/359168917/22892958100',
    limited: true,
    claimLimit: 1,
  },

  // R$ 1.207
  {
    id: 'robo-aspirador',
    name: 'Robô aspirador',
    description: 'Para manter a casa limpa... Ou pelo menos tentar.',
    image: 'assets/gifts/robot-vacuum.jpg',
    fulfillment: 'store',    
    storeUrl: 'https://shopee.com.br/loibrasil/42565175368',
    limited: true,
    claimLimit: 1,
  },
  
  {
    id: 'jogo-cama-cinza',
    name: 'Jogo de cama casal (cinza)',
    description: 'Nada como uma cama aconchegante.',
    image: 'assets/gifts/jogo-cama-cinza.jpg',
    fulfillment: 'store',
    storeUrl:
      'https://www.mercadolivre.com.br/jogo-de-cama-casal-buddemeyer-cotton-essential-cor-cinza/p/MLB47171293?product_trigger_id=MLB45931504&pdp_filters=item_id%3AMLB6167864036&applied_product_filters=MLB61179364&picker=true&attributes=COLOR%3AMLB61179364&matt_tool=38524122&quantity=1',
    limited: true,
  },
  {
    id: 'kit-toalhas',
    name: 'Jogo de toalhas (Branco)',
    description: 'Toalhas macias para um banho premium.',
    image: 'assets/gifts/jogo-toalhas.jpg',
    fulfillment: 'store',
    storeUrl:
      'https://www.mercadolivre.com.br/jogo-de-toalhas-buddemeyer-brisa-banho-branco-5-pecas/p/MLB29596516?product_trigger_id=MLB29402281&pdp_filters=official_store:2946&applied_product_filters=MLB29401172&picker=true',
    limited: true,
  },
  {
    id: 'jogo-xicaras-cafe-preto',
    name: 'Jogo de xícaras (Preto)',
    description: 'Para o cafezinho ficar ainda mais especial.',
    image: 'assets/gifts/jogo-xicaras-cafe-preto.jpg',
    fulfillment: 'store',
    storeUrl: 'https://shopee.com.br/digitalksm/58251070497',
    limited: true,
  },
  {
    id: 'caixa-ferramentas',
    name: 'Caixa de ferramentas',
    description: 'Para os consertos que o noivo prometeu fazer.',
    image: 'assets/gifts/caixa-ferramentas.jpg',
    fulfillment: 'store',
    storeUrl: 'https://shopee.com.br/alfadomesticos/23198319797',
    limited: true,
  },
  // Presentes físicos (loja)
  {
    id: 'jogo-cama-bege',
    name: 'Jogo de cama casal (bege)',
    description: 'Porque um nunca é o suficiente!',
    image: 'assets/gifts/jogo-cama-bege.jpg',
    fulfillment: 'store',
    storeUrl:
      'https://www.mercadolivre.com.br/jogo-de-cama-casal-buddemeyer-cotton-essential-cor-bege-002/p/MLB61179364?pdp_filters=item_id%3AMLB6167864036&attributes=COLOR%3AMLB61179364&matt_tool=38524122',
    limited: true,
  },
  
  {
    id: 'Coberdrom',
    name: 'Coberdrom casal',
    description: 'Para esquentar os dias frios.',
    image: 'assets/gifts/cobredom-cinza.jpg',
    fulfillment: 'store',
    storeUrl: 'https://shopee.com.br/enxovintao/23494815662',
    limited: true,
  },
  {
    id: 'multiprocessador',
    name: 'Multiprocessador',
    description: 'Um super aliado na cozinha.',
    image: 'assets/gifts/multiprocessador.jpg',
    fulfillment: 'store',
    storeUrl: 'https://shopee.com.br/casas_bahia_oficial/58206310295',
    limited: true,
  },
  {
    id: 'cobertor-casal-bege',
    name: 'Cobertor casal (bege)',
    description: 'Quentinho e aconchegante.',
    image: 'assets/gifts/cobertor-casal-bege.jpg',
    fulfillment: 'store',
    storeUrl:
      'https://shopee.com.br/Cobertor-300-gms-Manta-Queen-Neo-Mares-Canelada-Casal-Quentinha-Toque-Macio-Solteiro-cama-frio-inverno-i.368933768.50711620659?extraParams=%7B%22display_model_id%22%3A341009233980%2C%22model_selection_logic%22%3A3%7D',
    limited: true,
  },
  {
    id: 'ferro-vapor',
    name: 'Ferro de vapor',
    description: 'Chega de roupa amassada!',
    image: 'assets/gifts/ferro-vapor.jpg',
    fulfillment: 'store',
    storeUrl: 'https://shopee.com.br/loibrasil/40104446304',
    limited: true,
  },
  {
    id: 'kit-toalhas-cinza',
    name: 'Jogo de toalhas (Cinza)',
    description: 'Toalhas macias para um banho premium.',
    image: 'assets/gifts/jogo-toalhas-cinza.jpg',
    fulfillment: 'store',
    storeUrl:
      'https://www.mercadolivre.com.br/buddemeyer-banho-brisa-toalha-de-banho-algodao-cor-cinza/p/MLB29355620?pdp_filters=item_id%3AMLB6717197468&attributes=COLOR%3AMLB29355620&matt_tool=38524122#origin=share&sid=share&wid=MLB6717197468&action=copy',
    limited: true,
  },
  {
    id: 'mixer',
    name: 'Mixer',
    description: 'Prático para o dia a dia na cozinha.',
    image: 'assets/gifts/mixer.jpg',
    fulfillment: 'store',
    storeUrl: 'https://www.amazon.com.br/Mixer-Philco-PMX2000-Inox-800W/dp/B0CFM67MPS?source=ps-sl-shoppingads-lpcontext&ref_=fplfs&smid=A1ZZFT5FULY4LN&th=1',
    limited: true,
  },
  {
    id: 'churrasqueira-eletrica',
    name: 'Churrasqueira elétrica',
    description: 'Porque churrasco bom não precisa esperar o fim de semana.',
    image: 'assets/gifts/churrasqueira-arno.jpg',
    fulfillment: 'store',
    storeUrl:
      'https://www.mercadolivre.com.br/churrasqueira-eletrica-arno-gpra-preta/p/MLB15769481?product_trigger_id=MLB15769481&attributes=COLOR%3APreto%2CVOLTAGE%3AMLB15769481&picker=true&quantity=1',
    limited: true,
  },
  {
    id: 'purificador-agua',
    name: 'Purificador de água',
    description: 'Água fresquinha, sempre à mão.',
    image: 'assets/gifts/purificador-agua.jpg',
    fulfillment: 'store',
    storeUrl: 'https://shopee.com.br/efaciloficiall/22392930309',
    limited: true,
  },
  {
    id: 'ambient-light',
    name: 'Ambient light',
    description:
      'Para maratonar nossas séries favoritas com um toque de magia.',
    image: 'assets/gifts/Ambient-light.jpg',
    fulfillment: 'store',
    storeUrl:
      'https://www.mercadolivre.com.br/luz-de-fundo-led-bogast-para-tv-luzes-de-tv-ajustaveis-de-45-m-que-mudam-com-a-tv-para-telas-de-55-a-65-polegadas-e-monitores-de-pc-luz-de-fundo-de-tv-com-sensor-l01pro/p/MLB62884400?pdp_filters=item_id%3AMLB6968368314',
    limited: true,
  },
  {
    id: 'arranhador-gatos',
    name: 'Arranhador para os gatos',
    description: 'A diversão não acaba, e os móveis ficam seguros.',
    image: 'assets/gifts/gato-aranhador.jpg',
    fulfillment: 'store',
    storeUrl:
      'https://shopee.com.br/Arranhador-de-parede-para-gatos-85cm-e-115cm-Arranhadores-Grande.-i.1216182002.58203424927?extraParams=%7B%22display_model_id%22%3A139654621433%2C%22model_selection_logic%22%3A3%7D',
    limited: true,
  },
  {
    id: 'caminha-gato-cinza',
    name: 'Caminha para os gatos (cinza)',
    description: 'Para um ótimo soninho.',
    image: 'assets/gifts/caminha-gato-cinza.jpg',
    fulfillment: 'store',
    storeUrl:
      'https://shopee.com.br/Caminha-Pet-Redonda-Sherpa-Quentinha-Pele-de-Carneiro-Tamanhos-P-M-e-G-Varias-Cores-i.433584919.22398326187?extraParams=%7B%22display_model_id%22%3A209621512510%2C%22model_selection_logic%22%3A3%7D',
    limited: true,
  },
] as const;

/**
 * Featured open-amount Pix section (not listed in the gift grid).
 */
export const openHeartGift: GiftItem = {
  id: 'o-que-seu-coracao-mandar',
  name: 'O que seu coração mandar',
  description:
    'Sua presença já é o nosso maior presente. Se quiser nos presentear de outra forma, escolha o valor que desejar.',
  image: 'assets/gifts/heart-gift.jpg',
  fulfillment: 'pix',
};

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
