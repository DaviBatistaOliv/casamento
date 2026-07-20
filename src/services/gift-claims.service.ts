import { z } from 'zod';
import { getSupabaseClient, isSupabaseConfigured } from '@/config/supabase';

const giftClaimRowSchema = z.object({
  gift_id: z.string().min(1),
  claimed_at: z.string().optional(),
  guest_name: z.string().nullable().optional(),
});

const claimGiftInputSchema = z.object({
  giftId: z.string().min(1),
  guestName: z.string().trim().min(1).max(120).optional(),
});

export type ClaimGiftInput = z.infer<typeof claimGiftInputSchema>;

export type ClaimGiftResult = 'claimed' | 'already_claimed' | 'error';

const POSTGRES_UNIQUE_VIOLATION = '23505';

/**
 * Lists gift IDs that have already been claimed.
 */
export async function listClaimedGiftIds(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured.');
  }
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('gift_claims')
    .select('gift_id');
  if (error) {
    throw new Error(`Failed to list gift claims: ${error.message}`);
  }
  const rows = z.array(giftClaimRowSchema).parse(data ?? []);
  return rows.map((row) => row.gift_id);
}

/**
 * Claims a limited gift. Primary key on gift_id enforces a single claim.
 */
export async function claimGift(input: ClaimGiftInput): Promise<ClaimGiftResult> {
  if (!isSupabaseConfigured()) {
    return 'error';
  }
  const parsedInput = claimGiftInputSchema.safeParse(input);
  if (!parsedInput.success) {
    return 'error';
  }
  const supabase = getSupabaseClient();
  const { error } = await supabase.from('gift_claims').insert({
    gift_id: parsedInput.data.giftId,
    guest_name: parsedInput.data.guestName ?? null,
  });
  if (!error) {
    return 'claimed';
  }
  if (error.code === POSTGRES_UNIQUE_VIOLATION) {
    return 'already_claimed';
  }
  return 'error';
}
