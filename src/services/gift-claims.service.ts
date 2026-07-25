import { z } from 'zod';
import { getSupabaseClient, isSupabaseConfigured } from '@/config/supabase';

const giftClaimRowSchema = z.object({
  gift_id: z.string().min(1),
  claimed_at: z.string().optional(),
  guest_name: z.string().nullable().optional(),
});

const claimGiftInputSchema = z.object({
  giftId: z.string().min(1),
  claimLimit: z.number().int().positive(),
  guestName: z.string().trim().min(1).max(120).optional(),
});

const claimGiftRpcResultSchema = z.enum(['claimed', 'already_claimed', 'error']);

export type ClaimGiftInput = z.infer<typeof claimGiftInputSchema>;

export type ClaimGiftResult = 'claimed' | 'already_claimed' | 'error';

/**
 * Lists how many times each gift ID has already been claimed.
 */
export async function listGiftClaimCounts(): Promise<ReadonlyMap<string, number>> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured.');
  }
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('gift_claims').select('gift_id');
  if (error) {
    throw new Error(`Failed to list gift claims: ${error.message}`);
  }
  const rows = z.array(giftClaimRowSchema).parse(data ?? []);
  const counts = new Map<string, number>();
  for (const row of rows) {
    counts.set(row.gift_id, (counts.get(row.gift_id) ?? 0) + 1);
  }
  return counts;
}

/**
 * Claims a limited gift up to the configured claim limit.
 * Uses the Supabase RPC for an atomic reservation check.
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
  const { data, error } = await supabase.rpc('claim_gift', {
    p_gift_id: parsedInput.data.giftId,
    p_claim_limit: parsedInput.data.claimLimit,
    p_guest_name: parsedInput.data.guestName ?? null,
  });
  if (error) {
    return 'error';
  }
  const parsedResult = claimGiftRpcResultSchema.safeParse(data);
  if (!parsedResult.success) {
    return 'error';
  }
  return parsedResult.data;
}
