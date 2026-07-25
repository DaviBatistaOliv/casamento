<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import ClaimConfirmModal from '@/components/gift/ClaimConfirmModal.vue';
import GiftCard from '@/components/gift/GiftCard.vue';
import PixModal from '@/components/gift/PixModal.vue';
import { isSupabaseConfigured } from '@/config/supabase';
import {
  gifts,
  isGiftClaimExhausted,
  isLimitedGift,
  isPixGift,
  isStoreGift,
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

const availableGifts = computed((): GiftItem[] => {
  return gifts.filter((gift) => {
    if (hasClaimsError.value && isLimitedGift(gift)) {
      return false;
    }
    const claimCount = claimCounts.value.get(gift.id) ?? 0;
    if (isGiftClaimExhausted(gift, claimCount)) {
      return false;
    }
    return true;
  });
});

const storeGifts = computed((): GiftItem[] => {
  return availableGifts.value.filter((gift) => isStoreGift(gift));
});

const pixGifts = computed((): GiftItem[] => {
  return availableGifts.value.filter((gift) => isPixGift(gift));
});

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

function handleClaimed(gift: GiftItem): void {
  incrementClaimCount(gift);
  closeClaimModal();
  if (gift.price != null && !gift.storeUrl) {
    selectedPixGift.value = gift;
    isPixModalOpen.value = true;
  }
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
    <header class="gifts-page__header">
      <RouterLink class="gifts-page__back" :to="{ name: 'invite' }">
        ← Voltar ao convite
      </RouterLink>
      <p class="gifts-page__eyebrow">Lista de presentes</p>
      <h1 class="gifts-page__title">Mari &amp; Davi</h1>
      <div class="gifts-page__ornament" aria-hidden="true" />
      <p class="gifts-page__subtitle">
        Se quiser nos presentear, reunimos algumas ideias com carinho.
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
      v-if="!isLoadingClaims && availableGifts.length === 0"
      class="gifts-page__empty"
    >
      Nenhum presente disponível no momento.
    </p>

    <section
      v-if="storeGifts.length > 0"
      class="gifts-page__section"
      aria-labelledby="gifts-store-heading"
    >
      <header class="gifts-page__section-header">
        <h2 id="gifts-store-heading" class="gifts-page__section-title">
          🏡 Para o nosso novo lar
        </h2>
        <p class="gifts-page__section-copy">
          Escolha um presente para fazer parte do nosso novo lar.
        </p>
      </header>
      <div class="gifts-page__grid">
        <GiftCard
          v-for="gift in storeGifts"
          :key="gift.id"
          :gift="gift"
          @present="openPresentFlow"
        />
      </div>
    </section>

    <section
      v-if="pixGifts.length > 0"
      class="gifts-page__section"
      aria-labelledby="gifts-pix-heading"
    >
      <header class="gifts-page__section-header">
        <h2 id="gifts-pix-heading" class="gifts-page__section-title">
          🎉 Para entrar na brincadeira
        </h2>
        <p class="gifts-page__section-copy">
          Ideias divertidas para quem prefere contribuir via Pix.
        </p>
      </header>
      <div class="gifts-page__grid">
        <GiftCard
          v-for="gift in pixGifts"
          :key="gift.id"
          :gift="gift"
          @present="openPresentFlow"
        />
      </div>
    </section>

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
