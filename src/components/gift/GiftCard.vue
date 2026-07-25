<script setup lang="ts">
import { computed } from 'vue';
import type { GiftItem } from '@/data/gifts';
import {
  formatGiftPrice,
  hasGiftPrice,
  hasStoreUrl,
  isLimitedGift,
  isPixGift,
  isStoreGift,
  resolveGiftImage,
} from '@/data/gifts';

const props = defineProps<{
  gift: GiftItem;
}>();

const emit = defineEmits<{
  present: [gift: GiftItem];
}>();

const isPresentDisabled = computed((): boolean => {
  return (
    isStoreGift(props.gift) &&
    !hasStoreUrl(props.gift) &&
    !isLimitedGift(props.gift)
  );
});

function handlePresent(): void {
  if (isPresentDisabled.value) {
    return;
  }
  if (isLimitedGift(props.gift)) {
    emit('present', props.gift);
    return;
  }
  if (isPixGift(props.gift)) {
    emit('present', props.gift);
  }
}
</script>

<template>
  <article class="gift-card" :class="{ 'gift-card--disabled': isPresentDisabled }">
    <div class="gift-card__media">
      <img
        class="gift-card__image"
        :src="resolveGiftImage(gift.image)"
        :alt="gift.name"
        loading="lazy"
        width="400"
        height="400"
      />
    </div>
    <div class="gift-card__body">
      <h3 class="gift-card__name">{{ gift.name }}</h3>
      <p class="gift-card__description">{{ gift.description }}</p>
      <p
        v-if="hasGiftPrice(gift)"
        class="gift-card__price"
      >
        {{ formatGiftPrice(gift.price) }}
      </p>
      <p
        v-else-if="isPixGift(gift)"
        class="gift-card__price gift-card__price--open"
      >
        Você escolhe
      </p>
      <a
        v-else-if="isStoreGift(gift) && hasStoreUrl(gift)"
        class="gift-card__price gift-card__price--store"
        :href="gift.storeUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        Ver na loja
      </a>
      <button
        type="button"
        class="gift-card__cta"
        :disabled="isPresentDisabled"
        @click="handlePresent"
      >
        {{ isPresentDisabled ? 'Em breve' : 'Presentar' }}
      </button>
    </div>
  </article>
</template>
