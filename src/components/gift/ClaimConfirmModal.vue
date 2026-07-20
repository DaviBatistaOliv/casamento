<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import type { GiftItem } from '@/data/gifts';
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

const storeUrl = computed((): string | undefined => {
  return props.gift?.storeUrl;
});

const reserveLabel = computed((): string => {
  return isSubmitting.value ? 'Reservando…' : 'Marcar como reservado';
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
  isSubmitting.value = true;
  errorMessage.value = '';
  const trimmedName = guestName.value.trim();
  const result = await claimGift({
    giftId: props.gift.id,
    guestName: trimmedName.length > 0 ? trimmedName : undefined,
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
    'Não conseguimos reservar este presente agora. Tente novamente em instantes.';
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

        <h2 id="claim-modal-title" class="gift-modal__title">{{ giftName }}</h2>

        <p class="gift-modal__copy">
          Obrigado por celebrar conosco. Depois de ver o presente na loja,
          marque-o como reservado aqui — assim a lista fica organizada e ninguém
          escolhe o mesmo item sem querer.
        </p>

        <a
          v-if="storeUrl"
          class="gift-modal__primary"
          :href="storeUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver presente
        </a>

        <div class="gift-modal__divider" aria-hidden="true" />

        <label class="gift-modal__label" for="claim-guest-name">
          Como gostaria de aparecer?
          <span class="gift-modal__optional">opcional</span>
        </label>
        <input
          id="claim-guest-name"
          v-model="guestName"
          class="gift-modal__input"
          type="text"
          maxlength="120"
          autocomplete="name"
          placeholder="Ex.: João e Maria"
        />

        <p v-if="errorMessage" class="gift-modal__error" role="alert">
          {{ errorMessage }}
        </p>

        <div class="gift-modal__actions">
          <button
            type="button"
            class="gift-modal__secondary"
            :disabled="isSubmitting"
            @click="reserveGift"
          >
            {{ reserveLabel }}
          </button>
          <button
            type="button"
            class="gift-modal__dismiss"
            :disabled="isSubmitting"
            @click="closeModal"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
