<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
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
import { observeReveal } from '@/lib/reveal-on-scroll';

const REVEAL_STEP_MS = 70;
const REVEAL_MAX_STEPS = 5;

const props = withDefaults(
  defineProps<{
    gift: GiftItem;
    index: number;
    reserved?: boolean;
  }>(),
  { reserved: false },
);

const emit = defineEmits<{
  present: [gift: GiftItem];
}>();

const root = ref<HTMLElement | null>(null);
const isRevealed = ref<boolean>(false);
let stopReveal: (() => void) | null = null;

const isUnavailable = computed((): boolean => {
  return (
    isStoreGift(props.gift) &&
    !hasStoreUrl(props.gift) &&
    !isLimitedGift(props.gift)
  );
});

const isPresentDisabled = computed((): boolean => {
  return isUnavailable.value || props.reserved;
});

const ctaLabel = computed((): string => {
  if (isUnavailable.value) {
    return 'Em breve';
  }
  return isStoreGift(props.gift) ? 'Reservar' : 'Presentar';
});

const revealStyle = computed((): string => {
  const step = Math.min(props.index, REVEAL_MAX_STEPS);
  return `--reveal-delay: ${step * REVEAL_STEP_MS}ms`;
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

function markRevealed(): void {
  isRevealed.value = true;
}

onMounted(() => {
  if (root.value === null) {
    return;
  }
  stopReveal = observeReveal(root.value, markRevealed);
});

onBeforeUnmount(() => {
  stopReveal?.();
});
</script>

<template>
  <article
    ref="root"
    class="gift-card"
    :class="{
      'is-disabled': isUnavailable,
      'is-reserved': reserved,
      'is-revealed': isRevealed,
    }"
    :style="revealStyle"
  >
    <div class="gift-card__frame">
      <img
        class="gift-card__image"
        :src="resolveGiftImage(gift.image)"
        :alt="gift.name"
        loading="lazy"
        width="400"
        height="420"
      />
      <span v-if="reserved" class="gift-card__seal">Reservado</span>
    </div>

    <div class="gift-card__body">
      <h3 class="gift-card__name">{{ gift.name }}</h3>
      <p class="gift-card__description">{{ gift.description }}</p>

      <p v-if="hasGiftPrice(gift)" class="gift-card__price">
        {{ formatGiftPrice(gift.price) }}
      </p>
      <p
        v-else-if="isPixGift(gift)"
        class="gift-card__price gift-card__price--open"
      >
        Você escolhe
      </p>

      <div
        v-if="!reserved || (isStoreGift(gift) && hasStoreUrl(gift))"
        class="gift-card__actions"
      >
        <a
          v-if="isStoreGift(gift) && hasStoreUrl(gift)"
          class="gift-card__store-link"
          :href="gift.storeUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver na loja
          <span class="gift-card__store-arrow" aria-hidden="true">↗</span>
        </a>
        <button
          v-if="!reserved"
          type="button"
          class="gift-card__cta"
          :disabled="isPresentDisabled"
          @click="handlePresent"
        >
          {{ ctaLabel }}
        </button>
      </div>
    </div>
  </article>
</template>
