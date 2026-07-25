<script setup lang="ts">
const oliveSrc = `${import.meta.env.BASE_URL}assets/oliveira.png`;

interface FaqItem {
  readonly question: string;
  readonly answerLines: readonly string[];
}

const faqItems: readonly FaqItem[] = [
  {
    question: 'Qual é a data?',
    answerLines: ['15 de Agosto de 2026, Sábado.'],
  },
  {
    question: 'Que horas começa?',
    answerLines: [
      'A cerimônia começará pontualmente às 17:00, então sugerimos chegar às 16:30. Enquanto aguardamos o início, serviremos as entradas.',
    ],
  },
  {
    question: 'Onde será o casamento?',
    answerLines: [
      'A Casa Eventos.',
      'Av. Jorge Wrede, 37 — Nova Caieiras, Caieiras - SP, 07700-000',
    ],
  },
  {
    question: 'Haverá uma recepção?',
    answerLines: [
      'Sim. A recepção acontecerá no mesmo local, logo após a cerimônia.',
      'Bebidas e jantar serão servidos.',
    ],
  },
  {
    question: 'O que devo vestir?',
    answerLines: ['Traje social, por gentileza.'],
  },
  {
    question: 'Há estacionamento?',
    answerLines: [
      'Sim. Os convidados podem estacionar nas ruas do condomínio, próximo ao local.',
    ],
  },
] as const;
</script>

<template>
  <section class="faq" aria-label="Perguntas frequentes">
    <div class="faq__inner">
      <div class="faq__branch faq__branch--left" aria-hidden="true">
        <img :src="oliveSrc" alt="" class="faq__branch-image" />
      </div>

      <div class="faq__content">
        <h2 class="faq__title">Suas perguntas, respondidas</h2>

        <div v-for="item in faqItems" :key="item.question" class="faq__item">
          <h3 class="faq__question">{{ item.question }}</h3>
          <p class="faq__answer">
            <template v-for="(line, index) in item.answerLines" :key="index">
              <br v-if="index > 0" />
              {{ line }}
            </template>
          </p>
        </div>
      </div>

      <div class="faq__branch faq__branch--right" aria-hidden="true">
        <img :src="oliveSrc" alt="" class="faq__branch-image" />
      </div>
    </div>
  </section>
</template>
