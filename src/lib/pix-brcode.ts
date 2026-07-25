import QRCode from 'qrcode';
import { getPixConfig } from '@/config/pix';

/**
 * Result of generating a static Pix charge for a gift.
 */
export interface PixChargeResult {
  readonly payload: string;
  readonly qrCodeBase64: string;
}

/**
 * Builds a TLV field for the Pix EMV payload.
 */
function buildField(id: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return `${id}${length}${value}`;
}

/**
 * Removes accents and non-ASCII characters from Pix payload text.
 */
function sanitizePixText(value: string, maxLength: number): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase()
    .slice(0, maxLength);
}

/**
 * Computes CRC-16/CCITT-FALSE used by Pix BR Code (ID 63).
 */
function computeCrc16(payload: string): string {
  let crc = 0xffff;
  for (let index = 0; index < payload.length; index += 1) {
    crc ^= payload.charCodeAt(index) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Builds a static Pix BR Code payload compatible with Brazilian bank apps.
 *
 * Follows Bacen static QR conventions:
 * - GUI `br.gov.bcb.pix`
 * - Point of initiation `11` (static)
 * - ASCII-only merchant fields
 * - TxId `***` for reusable static charges
 * - Amount (ID 54) omitted when the guest chooses the value
 */
export function buildStaticPixPayload(params: {
  readonly pixKey: string;
  readonly receiverName: string;
  readonly receiverCity: string;
  readonly amount?: number;
  readonly description?: string;
}): string {
  const pixKey = params.pixKey.trim();
  const receiverName = sanitizePixText(params.receiverName, 25);
  const receiverCity = sanitizePixText(params.receiverCity, 15);
  const description = params.description
    ? sanitizePixText(params.description, 50)
    : '';
  if (!pixKey) {
    throw new Error('Pix key is required.');
  }
  if (!receiverName || !receiverCity) {
    throw new Error('Pix receiver name and city are required.');
  }
  const hasAmount = params.amount != null;
  if (hasAmount && (!Number.isFinite(params.amount) || params.amount <= 0)) {
    throw new Error('Pix amount must be a positive number.');
  }
  const merchantAccount = [
    buildField('00', 'br.gov.bcb.pix'),
    buildField('01', pixKey),
    ...(description ? [buildField('02', description)] : []),
  ].join('');
  const additionalData = buildField('62', buildField('05', '***'));
  const amountField =
    hasAmount && params.amount != null
      ? [buildField('54', params.amount.toFixed(2))]
      : [];
  const payloadWithoutCrc = [
    buildField('00', '01'),
    buildField('01', '11'),
    buildField('26', merchantAccount),
    buildField('52', '0000'),
    buildField('53', '986'),
    ...amountField,
    buildField('58', 'BR'),
    buildField('59', receiverName),
    buildField('60', receiverCity),
    additionalData,
    '6304',
  ].join('');
  return `${payloadWithoutCrc}${computeCrc16(payloadWithoutCrc)}`;
}

/**
 * Builds a static Pix BR Code payload and QR image.
 * Omit `amount` to generate a key-only QR (guest enters the value in the bank app).
 */
export async function createPixCharge(params: {
  readonly amount?: number;
  readonly description: string;
}): Promise<PixChargeResult> {
  const config = getPixConfig();
  if (!config.isConfigured) {
    throw new Error('Pix key is not configured.');
  }
  const payload = buildStaticPixPayload({
    pixKey: config.key,
    receiverName: config.name,
    receiverCity: config.city,
    amount: params.amount,
    description: params.description,
  });
  if (/[^\x00-\x7F]/.test(payload)) {
    throw new Error('Generated Pix payload contains invalid non-ASCII characters.');
  }
  const qrCodeBase64 = await QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 320,
  });
  return { payload, qrCodeBase64 };
}
