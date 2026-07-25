<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import type { GiftItem } from '@/data/gifts';
import { formatGiftPrice } from '@/data/gifts';
import { getPixConfig } from '@/config/pix';
import { createPixCharge } from '@/lib/pix-brcode';

const props = defineProps<{
  gift: GiftItem | null;
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const pixConfig = getPixConfig();
const payload = ref<string>('');
const qrCodeBase64 = ref<string>('');
const isLoading = ref<boolean>(false);
const hasError = ref<boolean>(false);
const copyLabel = ref<string>('Copiar código Pix');

const giftName = computed((): string => {
  return props.gift?.name ?? 'Presente';
});

const priceLabel = computed((): string => {
  if (!props.gift || props.gift.price == null) {
    return '';
  }
  return formatGiftPrice(props.gift.price);
});

const isOpenAmount = computed((): boolean => {
  return props.gift != null && props.gift.price == null;
});

async function loadPixCharge(): Promise<void> {
  if (!props.gift || !props.open) {
    return;
  }
  if (!pixConfig.isConfigured) {
    payload.value = '';
    qrCodeBase64.value = '';
    hasError.value = false;
    return;
  }
  isLoading.value = true;
  hasError.value = false;
  copyLabel.value = 'Copiar código Pix';
  try {
    const result = await createPixCharge({
      amount: props.gift.price,
      description: props.gift.name,
    });
    payload.value = result.payload;
    qrCodeBase64.value = result.qrCodeBase64;
  } catch {
    hasError.value = true;
    payload.value = '';
    qrCodeBase64.value = '';
  } finally {
    isLoading.value = false;
  }
}

async function copyPayload(): Promise<void> {
  if (!payload.value) {
    return;
  }
  try {
    await navigator.clipboard.writeText(payload.value);
    copyLabel.value = 'Código copiado!';
    window.setTimeout(() => {
      copyLabel.value = 'Copiar código Pix';
    }, 2000);
  } catch {
    copyLabel.value = 'Não foi possível copiar';
  }
}

function closeModal(): void {
  emit('close');
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && props.open) {
    closeModal();
  }
}

watch(
  () => [props.open, props.gift?.id] as const,
  () => {
    void loadPixCharge();
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
      aria-labelledby="pix-modal-title"
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

        <p class="gift-modal__eyebrow">Presentear via Pix</p>
        <h2 id="pix-modal-title" class="gift-modal__title">{{ giftName }}</h2>
        <p v-if="priceLabel" class="gift-modal__accent">{{ priceLabel }}</p>
        <p v-else-if="isOpenAmount" class="gift-modal__accent">
          Você escolhe o valor
        </p>

        <div v-if="!pixConfig.isConfigured" class="gift-modal__notice">
          <p>Em breve você poderá presentear por aqui.</p>
        </div>

        <div v-else-if="isLoading" class="gift-modal__notice">
          <p>Preparando o QR Code…</p>
        </div>

        <div v-else-if="hasError" class="gift-modal__notice">
          <p>
            Não conseguimos gerar o código agora. Tente novamente em
            instantes.
          </p>
        </div>

        <template v-else>
          <div class="gift-modal__qr-stage">
            <span class="gift-modal__corner gift-modal__corner--tl" aria-hidden="true" />
            <span class="gift-modal__corner gift-modal__corner--tr" aria-hidden="true" />
            <span class="gift-modal__corner gift-modal__corner--bl" aria-hidden="true" />
            <span class="gift-modal__corner gift-modal__corner--br" aria-hidden="true" />
            <img
              v-if="qrCodeBase64"
              class="gift-modal__qr"
              :src="qrCodeBase64"
              alt="QR Code Pix"
              width="240"
              height="240"
            />
          </div>

          <div class="gift-modal__actions">
            <button
              type="button"
              class="gift-modal__primary"
              :disabled="!payload"
              @click="copyPayload"
            >
              {{ copyLabel }}
            </button>
            <button
              type="button"
              class="gift-modal__dismiss"
              @click="closeModal"
            >
              Pronto
            </button>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>
