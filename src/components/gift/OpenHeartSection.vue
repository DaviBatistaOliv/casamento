<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { getPixConfig } from '@/config/pix';
import type { GiftItem } from '@/data/gifts';
import { createPixCharge } from '@/lib/pix-brcode';
import { observeReveal } from '@/lib/reveal-on-scroll';

const props = defineProps<{
  gift: GiftItem;
}>();

const root = ref<HTMLElement | null>(null);
let stopReveal: (() => void) | null = null;

const pixConfig = getPixConfig();
const payload = ref<string>('');
const qrCodeBase64 = ref<string>('');
const isLoading = ref<boolean>(false);
const hasError = ref<boolean>(false);
const copyLabel = ref<string>('Copiar código Pix');

async function loadPixCharge(): Promise<void> {
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

onMounted(() => {
  if (root.value !== null) {
    stopReveal = observeReveal(root.value);
  }
  void loadPixCharge();
});

onBeforeUnmount(() => {
  stopReveal?.();
});
</script>

<template>
  <section
    ref="root"
    class="open-heart"
    aria-labelledby="open-heart-heading"
  >
    <div class="open-heart__inner">
      <h2 id="open-heart-heading" class="open-heart__title">
        {{ gift.name }}
      </h2>

      <div class="open-heart__body">
        <p class="open-heart__description">{{ gift.description }}</p>

        <div class="open-heart__pix">
          <div v-if="!pixConfig.isConfigured" class="open-heart__notice">
            <p>Em breve você poderá presentear por aqui.</p>
          </div>

          <div v-else-if="isLoading" class="open-heart__notice">
            <p>Preparando o QR Code…</p>
          </div>

          <div v-else-if="hasError" class="open-heart__notice">
            <p>
              Não conseguimos gerar o código agora. Tente novamente em
              instantes.
            </p>
          </div>

          <template v-else>
            <div class="open-heart__qr-stage">
              <span class="open-heart__corner open-heart__corner--tl" aria-hidden="true" />
              <span class="open-heart__corner open-heart__corner--tr" aria-hidden="true" />
              <span class="open-heart__corner open-heart__corner--bl" aria-hidden="true" />
              <span class="open-heart__corner open-heart__corner--br" aria-hidden="true" />
              <img
                v-if="qrCodeBase64"
                class="open-heart__qr"
                :src="qrCodeBase64"
                alt="QR Code Pix"
                width="320"
                height="320"
              />
            </div>

            <button
              type="button"
              class="open-heart__action"
              :disabled="!payload"
              @click="copyPayload"
            >
              {{ copyLabel }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
