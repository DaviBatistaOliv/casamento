<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import ClaimConfirmModal from '@/components/gift/ClaimConfirmModal.vue';
import GiftCard from '@/components/gift/GiftCard.vue';
import GiftsFooter from '@/components/gift/GiftsFooter.vue';
import OpenHeartSection from '@/components/gift/OpenHeartSection.vue';
import PixModal from '@/components/gift/PixModal.vue';
import { isSupabaseConfigured } from '@/config/supabase';
import {
  gifts,
  isGiftClaimExhausted,
  isLimitedGift,
  isPixGift,
  isStoreGift,
  openHeartGift,
  type GiftItem,
} from '@/data/gifts';
import { listGiftClaimCounts } from '@/services/gift-claims.service';

const selectedPixGift = ref<GiftItem | null>(null);
const isPixModalOpen = ref<boolean>(false);
const selectedClaimGift = ref<GiftItem | null>(null);
const isClaimModalOpen = ref<boolean>(false);
const claimCounts = ref<ReadonlyMap<string, number>>(new Map());
const isLoadingClaims = ref<boolean>(false);
const hasClaimsError = ref<boolean>(false);
const statusMessage = ref<string>('');

const visibleGifts = computed((): GiftItem[] => {
  return gifts.filter((gift) => {
    return !(hasClaimsError.value && isLimitedGift(gift));
  });
});

const reservedGiftIds = computed((): ReadonlySet<string> => {
  const reserved = new Set<string>();
  for (const gift of gifts) {
    const claimCount = claimCounts.value.get(gift.id) ?? 0;
    if (isGiftClaimExhausted(gift, claimCount)) {
      reserved.add(gift.id);
    }
  }
  return reserved;
});

const storeGifts = computed((): GiftItem[] => {
  return visibleGifts.value.filter((gift) => isStoreGift(gift));
});

const pixGifts = computed((): GiftItem[] => {
  return visibleGifts.value.filter((gift) => isPixGift(gift));
});

function isGiftReserved(gift: GiftItem): boolean {
  return reservedGiftIds.value.has(gift.id);
}

const hasLimitedGifts = computed((): boolean => {
  return gifts.some((gift) => isLimitedGift(gift));
});

async function loadClaimedGifts(): Promise<void> {
  if (!hasLimitedGifts.value) {
    return;
  }
  if (!isSupabaseConfigured()) {
    hasClaimsError.value = true;
    statusMessage.value =
      'Alguns itens da lista estão indisponíveis no momento. As demais ideias continuam aqui.';
    return;
  }
  isLoadingClaims.value = true;
  hasClaimsError.value = false;
  statusMessage.value = '';
  try {
    claimCounts.value = await listGiftClaimCounts();
  } catch {
    hasClaimsError.value = true;
    statusMessage.value =
      'Não foi possível verificar os itens já escolhidos. As ideias via contribuição continuam disponíveis.';
  } finally {
    isLoadingClaims.value = false;
  }
}

function openPresentFlow(gift: GiftItem): void {
  if (isGiftReserved(gift)) {
    return;
  }
  statusMessage.value = hasClaimsError.value
    ? statusMessage.value
    : '';
  if (isLimitedGift(gift)) {
    selectedClaimGift.value = gift;
    isClaimModalOpen.value = true;
    return;
  }
  if (!isPixGift(gift)) {
    return;
  }
  selectedPixGift.value = gift;
  isPixModalOpen.value = true;
}

function closePixModal(): void {
  isPixModalOpen.value = false;
}

function closeClaimModal(): void {
  isClaimModalOpen.value = false;
}

function incrementClaimCount(gift: GiftItem): void {
  const nextCounts = new Map(claimCounts.value);
  nextCounts.set(gift.id, (nextCounts.get(gift.id) ?? 0) + 1);
  claimCounts.value = nextCounts;
}

async function handleClaimed(gift: GiftItem): Promise<void> {
  incrementClaimCount(gift);
  closeClaimModal();
  if (!isPixGift(gift)) {
    return;
  }
  await nextTick();
  selectedPixGift.value = gift;
  isPixModalOpen.value = true;
}

function handleAlreadyClaimed(gift: GiftItem): void {
  closeClaimModal();
  statusMessage.value = `"${gift.name}" já atingiu o limite de reservas. Obrigado mesmo assim.`;
  void loadClaimedGifts();
}

onMounted(() => {
  void loadClaimedGifts();
});
</script>

<template>
  <main class="gifts-page">
    <nav class="gifts-page__nav" aria-label="Navegação">
      <RouterLink class="gifts-page__back" :to="{ name: 'invite' }">
        <span class="gifts-page__back-arrow" aria-hidden="true">←</span>
        Voltar ao convite
      </RouterLink>
    </nav>

    <header class="gifts-hero">
      <p class="gifts-hero__eyebrow">
        <span class="gifts-hero__eyebrow-text">Lista de presentes</span>
      </p>
      <h1 class="gifts-hero__title">Mari &amp; Davi</h1>
      <p class="gifts-hero__lead">
        Se quiser nos presentear, reunimos algumas ideias com carinho.
        <br />
        Sua presença já é o que mais importa para nós.
      </p>
      <p v-if="isLoadingClaims" class="gifts-page__status">
        Carregando disponibilidade…
      </p>
      <p
        v-else-if="statusMessage"
        class="gifts-page__status"
        :class="{ 'gifts-page__status--error': hasClaimsError }"
        role="status"
      >
        {{ statusMessage }}
      </p>
    </header>

    <p
      v-if="!isLoadingClaims && visibleGifts.length === 0"
      class="gifts-page__empty"
    >
      Nenhum presente disponível no momento.
    </p>

    <section
      v-if="storeGifts.length > 0"
      class="gifts-section gifts-section--home"
      aria-labelledby="gifts-store-heading"
    >
      <div class="gifts-section__inner">
        <header class="gifts-section__header">
          <span class="gifts-section__glyph" aria-hidden="true">🏡</span>
          <h2 id="gifts-store-heading" class="gifts-section__title">
            Para o nosso lar
          </h2>
          <p class="gifts-section__copy">
            Peças escolhidas a dedo para o começo da nossa casa,
            <br />
            com link direto para a loja.
          </p>
        </header>
        <div class="gifts-section__grid">
          <GiftCard
            v-for="(gift, index) in storeGifts"
            :key="gift.id"
            :gift="gift"
            :index="index"
            :reserved="isGiftReserved(gift)"
            @present="openPresentFlow"
          />
        </div>
      </div>
    </section>

    <section
      v-if="pixGifts.length > 0"
      class="gifts-section gifts-section--play"
      aria-labelledby="gifts-pix-heading"
    >
      <div class="gifts-section__inner">
        <header class="gifts-section__header">
          <span class="gifts-section__glyph" aria-hidden="true">🎉</span>
          <h2 id="gifts-pix-heading" class="gifts-section__title">
            Para entrar na brincadeira
          </h2>
          <p class="gifts-section__copy">
            Ideias inspiradas nas nossas histórias, para quem prefere
            contribuir via Pix.
          </p>
        </header>
        <div class="gifts-section__grid">
          <GiftCard
            v-for="(gift, index) in pixGifts"
            :key="gift.id"
            :gift="gift"
            :index="index"
            :reserved="isGiftReserved(gift)"
            @present="openPresentFlow"
          />
        </div>
      </div>
    </section>

    <OpenHeartSection :gift="openHeartGift" />

    <GiftsFooter />

    <ClaimConfirmModal
      :gift="selectedClaimGift"
      :open="isClaimModalOpen"
      @close="closeClaimModal"
      @claimed="handleClaimed"
      @already-claimed="handleAlreadyClaimed"
    />

    <PixModal
      :gift="selectedPixGift"
      :open="isPixModalOpen"
      @close="closePixModal"
    />
  </main>
</template>
