<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import GiftCard from '@/components/gift/GiftCard.vue';
import PixModal from '@/components/gift/PixModal.vue';
import { gifts, type GiftItem } from '@/data/gifts';

const selectedGift = ref<GiftItem | null>(null);
const isModalOpen = ref<boolean>(false);

function openPresentModal(gift: GiftItem): void {
  if (gift.storeUrl || gift.price == null) {
    return;
  }
  selectedGift.value = gift;
  isModalOpen.value = true;
}

function closePresentModal(): void {
  isModalOpen.value = false;
}
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
    </header>

    <section class="gifts-page__grid" aria-label="Presentes">
      <GiftCard
        v-for="gift in gifts"
        :key="gift.id"
        :gift="gift"
        @present="openPresentModal"
      />
    </section>

    <PixModal
      :gift="selectedGift"
      :open="isModalOpen"
      @close="closePresentModal"
    />
  </main>
</template>
