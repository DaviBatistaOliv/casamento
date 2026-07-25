/**
 * Pix receiver configuration loaded from Vite environment variables.
 */
export interface PixConfig {
  readonly key: string;
  readonly name: string;
  readonly city: string;
  readonly isConfigured: boolean;
}

/**
 * Reads and normalizes Pix settings from the environment.
 */
export function getPixConfig(): PixConfig {
  const key = (import.meta.env.VITE_PIX_KEY ?? '').trim();
  const name = (import.meta.env.VITE_PIX_NAME ?? '').trim() || 'Recebedor';
  const city = (import.meta.env.VITE_PIX_CITY ?? '').trim() || 'Cidade';
  return {
    key,
    name,
    city,
    isConfigured: key.length > 0,
  };
}

/**
 * Masks a Pix key for display (keeps start and end characters).
 */
export function maskPixKey(key: string): string {
  if (key.length <= 8) {
    return '••••••••';
  }
  const start = key.slice(0, 4);
  const end = key.slice(-4);
  return `${start}••••${end}`;
}
