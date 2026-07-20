<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const GOOGLE_FORM_ID = '1FAIpQLSdx7PH8CCIDnaARuw1uqpOTtYRB1fqjjOt4bK7Q_DlmGpeXQw';
const polaroidSrc = `${import.meta.env.BASE_URL}assets/polaroid.png`;

const formHref = computed((): string => {
  return `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/viewform`;
});
</script>

<template>
  <section class="rsvp" id="confirmar" aria-label="Confirmar presença">
    <div class="rsvp__header">
      <h2 class="rsvp__title">Gostaríamos de ter você conosco!</h2>
      <p class="rsvp__subtitle">
        Sua presença é muito especial para nós.
        <br />
        Para confirmar, clique no botão abaixo.
      </p>
    </div>
    <div class="rsvp__inner">
      <div class="rsvp__photo-col">
        <img
          :src="polaroidSrc"
          alt="Davi e Mariana"
          class="rsvp__photo"
          width="400"
          height="320"
        />
      </div>

      <div class="rsvp__content">
        <p class="rsvp__gift">
          <RouterLink class="rsvp__gift-link" :to="{ name: 'gifts' }">
            Ver lista de presentes
          </RouterLink>
        </p>
        <a
          class="rsvp__cta-button"
          :href="formHref"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir formulário de confirmação de presença no Google Forms"
        >
          Confirmar presença
        </a>
      </div>
    </div>
  </section>
</template>
