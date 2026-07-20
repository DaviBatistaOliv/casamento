<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import type { GiftItem } from '@/data/gifts';
import { formatGiftPrice } from '@/data/gifts';
import { getPixConfig, maskPixKey } from '@/config/pix';
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

const title = computed((): string => {
  return props.gift?.name ?? 'Presente';
});

const priceLabel = computed((): string => {
  if (!props.gift || props.gift.price == null) {
    return '';
  }
  return formatGiftPrice(props.gift.price);
});

const maskedKey = computed((): string => {
  if (!pixConfig.isConfigured) {
    return '';
  }
  return maskPixKey(pixConfig.key);
});

async function loadPixCharge(): Promise<void> {
  if (!props.gift || !props.open || props.gift.price == null) {
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
      class="pix-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pix-modal-title"
    >
      <button
        type="button"
        class="pix-modal__backdrop"
        aria-label="Fechar"
        @click="closeModal"
      />
      <div class="pix-modal__panel">
        <button
          type="button"
          class="pix-modal__close"
          aria-label="Fechar modal"
          @click="closeModal"
        >
          ×
        </button>
        <h2 id="pix-modal-title" class="pix-modal__title">{{ title }}</h2>
        <p class="pix-modal__amount">{{ priceLabel }}</p>

        <div v-if="!pixConfig.isConfigured" class="pix-modal__notice">
          <p>Pix em configuração.</p>
          <p>Em breve você poderá presentear por aqui.</p>
        </div>

        <div v-else-if="isLoading" class="pix-modal__notice">
          <p>Gerando QR Code…</p>
        </div>

        <div v-else-if="hasError" class="pix-modal__notice">
          <p>Não foi possível gerar o Pix. Tente novamente.</p>
        </div>

        <template v-else>
          <img
            v-if="qrCodeBase64"
            class="pix-modal__qr"
            :src="qrCodeBase64"
            alt="QR Code Pix"
            width="220"
            height="220"
          />
          <p v-if="maskedKey" class="pix-modal__key">
            Chave: {{ maskedKey }}
          </p>
          <p class="pix-modal__hint">
            Escaneie o QR Code ou copie o código Pix no app do seu banco.
            O valor já vem preenchido.
          </p>
          <button
            type="button"
            class="pix-modal__copy"
            :disabled="!payload"
            @click="copyPayload"
          >
            {{ copyLabel }}
          </button>
        </template>
      </div>
    </div>
  </Teleport>
</template>
