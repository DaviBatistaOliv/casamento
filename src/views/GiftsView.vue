<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import ClaimConfirmModal from '@/components/gift/ClaimConfirmModal.vue';
import GiftCard from '@/components/gift/GiftCard.vue';
import PixModal from '@/components/gift/PixModal.vue';
import { isSupabaseConfigured } from '@/config/supabase';
import { gifts, isLimitedGift, type GiftItem } from '@/data/gifts';
import { listClaimedGiftIds } from '@/services/gift-claims.service';

const selectedPixGift = ref<GiftItem | null>(null);
const isPixModalOpen = ref<boolean>(false);
const selectedClaimGift = ref<GiftItem | null>(null);
const isClaimModalOpen = ref<boolean>(false);
const claimedIds = ref<Set<string>>(new Set());
const isLoadingClaims = ref<boolean>(false);
const hasClaimsError = ref<boolean>(false);
const statusMessage = ref<string>('');

const availableGifts = computed((): GiftItem[] => {
  return gifts.filter((gift) => {
    if (claimedIds.value.has(gift.id)) {
      return false;
    }
    if (hasClaimsError.value && isLimitedGift(gift)) {
      return false;
    }
    return true;
  });
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
      'Itens limitados indisponíveis no momento. Configure o Supabase para liberar a reserva.';
    return;
  }
  isLoadingClaims.value = true;
  hasClaimsError.value = false;
  statusMessage.value = '';
  try {
    const ids = await listClaimedGiftIds();
    claimedIds.value = new Set(ids);
  } catch {
    hasClaimsError.value = true;
    statusMessage.value =
      'Não foi possível carregar a disponibilidade dos itens limitados. Os demais presentes via Pix continuam disponíveis.';
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
  if (gift.price == null) {
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

function removeGiftFromList(gift: GiftItem): void {
  const nextIds = new Set(claimedIds.value);
  nextIds.add(gift.id);
  claimedIds.value = nextIds;
}

function handleClaimed(gift: GiftItem): void {
  removeGiftFromList(gift);
  closeClaimModal();
  if (gift.price != null && !gift.storeUrl) {
    selectedPixGift.value = gift;
    isPixModalOpen.value = true;
  }
}

function handleAlreadyClaimed(gift: GiftItem): void {
  removeGiftFromList(gift);
  closeClaimModal();
  statusMessage.value = `"${gift.name}" já foi reservado por alguém querido. Obrigado mesmo assim.`;
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
      <p class="gifts-page__subtitle">
        Escolha um presente na loja ou contribua via Pix. Sua generosidade significa muito para nós.
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

    <section class="gifts-page__grid" aria-label="Presentes">
      <p v-if="!isLoadingClaims && availableGifts.length === 0" class="gifts-page__empty">
        Nenhum presente disponível no momento.
      </p>
      <GiftCard
        v-for="gift in availableGifts"
        :key="gift.id"
        :gift="gift"
        @present="openPresentFlow"
      />
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
