<script setup lang="ts">
import type { GiftItem } from '@/data/gifts';
import { formatGiftPrice, isStoreGift, resolveGiftImage } from '@/data/gifts';

const props = defineProps<{
  gift: GiftItem;
}>();

const emit = defineEmits<{
  present: [gift: GiftItem];
}>();

function handlePresent(): void {
  if (props.gift.storeUrl) {
    window.open(props.gift.storeUrl, '_blank', 'noopener,noreferrer');
    return;
  }
  emit('present', props.gift);
}
</script>

<template>
  <article class="gift-card">
    <div class="gift-card__media">
      <img
        class="gift-card__image"
        :src="resolveGiftImage(gift.image)"
        :alt="gift.name"
        loading="lazy"
        width="400"
        height="300"
      />
    </div>
    <div class="gift-card__body">
      <h2 class="gift-card__name">{{ gift.name }}</h2>
      <p v-if="gift.price != null" class="gift-card__price">
        {{ formatGiftPrice(gift.price) }}
      </p>
      <p v-else-if="isStoreGift(gift)" class="gift-card__price gift-card__price--store">
        Ver na loja
      </p>
      <button
        type="button"
        class="gift-card__cta"
        @click="handlePresent"
      >
        Presentar
      </button>
    </div>
  </article>
</template>
