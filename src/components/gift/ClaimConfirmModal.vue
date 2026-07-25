<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { getGiftClaimLimit, isStoreGift, type GiftItem } from '@/data/gifts';
import { claimGift } from '@/services/gift-claims.service';

const props = defineProps<{
  gift: GiftItem | null;
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
  claimed: [gift: GiftItem];
  alreadyClaimed: [gift: GiftItem];
}>();

const guestName = ref<string>('');
const isSubmitting = ref<boolean>(false);
const errorMessage = ref<string>('');

const giftName = computed((): string => {
  return props.gift?.name ?? 'Presente';
});

const storeUrl = computed((): string => {
  return props.gift?.storeUrl?.trim() ?? '';
});

const hasStoreSuggestion = computed((): boolean => {
  return props.gift != null && isStoreGift(props.gift) && storeUrl.value !== '';
});

const trimmedGuestName = computed((): string => {
  return guestName.value.trim();
});

const canReserve = computed((): boolean => {
  return trimmedGuestName.value.length > 0 && !isSubmitting.value;
});

const reserveLabel = computed((): string => {
  return isSubmitting.value ? 'Reservando…' : 'Reservar este presente';
});

function resetForm(): void {
  guestName.value = '';
  errorMessage.value = '';
  isSubmitting.value = false;
}

function closeModal(): void {
  emit('close');
}

async function reserveGift(): Promise<void> {
  if (!props.gift || isSubmitting.value) {
    return;
  }
  if (trimmedGuestName.value.length === 0) {
    errorMessage.value = 'Conte pra gente quem está reservando.';
    return;
  }
  isSubmitting.value = true;
  errorMessage.value = '';
  const result = await claimGift({
    giftId: props.gift.id,
    claimLimit: getGiftClaimLimit(props.gift),
    guestName: trimmedGuestName.value,
  });
  isSubmitting.value = false;
  if (result === 'claimed') {
    emit('claimed', props.gift);
    return;
  }
  if (result === 'already_claimed') {
    emit('alreadyClaimed', props.gift);
    return;
  }
  errorMessage.value =
    'Não foi possível reservar agora. Tente de novo em instantes.';
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && props.open) {
    closeModal();
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetForm();
    }
  },
);

watch(guestName, () => {
  errorMessage.value = '';
});

onMounted(() => {
  document.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open && gift"
      class="gift-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="claim-modal-title"
    >
      <button
        type="button"
        class="gift-modal__backdrop"
        aria-label="Fechar"
        @click="closeModal"
      />
      <div class="gift-modal__panel">
        <button
          type="button"
          class="gift-modal__close"
          aria-label="Fechar"
          @click="closeModal"
        >
          <span aria-hidden="true">×</span>
        </button>

        <p class="gift-modal__eyebrow">Gostou deste presente?</p>
        <h2 id="claim-modal-title" class="gift-modal__title">{{ giftName }}</h2>
        <p class="gift-modal__copy">
          Deixe seu nome e reserve para nós. Assim o presente sai da lista e
          ninguém escolhe o mesmo item.
        </p>

        <input
          id="claim-guest-name"
          v-model="guestName"
          class="gift-modal__input"
          type="text"
          maxlength="120"
          autocomplete="name"
          required
          aria-required="true"
          aria-label="Quem está nos presenteando?"
          placeholder="Quem está nos presenteando?"
          @keyup.enter="reserveGift"
        />

        <p v-if="errorMessage" class="gift-modal__error" role="alert">
          {{ errorMessage }}
        </p>

        <div class="gift-modal__actions">
          <button
            type="button"
            class="gift-modal__primary"
            :disabled="!canReserve"
            @click="reserveGift"
          >
            {{ reserveLabel }}
          </button>
        </div>

        <div v-if="hasStoreSuggestion" class="gift-modal__suggestion">
          <p class="gift-modal__suggestion-text">
            Não sabe onde encontrar? Separamos uma sugestão de loja.
          </p>
          <a
            class="gift-modal__suggestion-link"
            :href="storeUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver sugestão de loja
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <button
          type="button"
          class="gift-modal__dismiss"
          :disabled="isSubmitting"
          @click="closeModal"
        >
          Voltar à lista
        </button>
      </div>
    </div>
  </Teleport>
</template>
