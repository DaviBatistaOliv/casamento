<script setup lang="ts">
const vineSrc = `${import.meta.env.BASE_URL}assets/videira.png`;
const videoSrc = `${import.meta.env.BASE_URL}assets/4f4db084-4e34-4f99-a069-4e5222116bd5.MP4`;
</script>

<template>
  <section class="verse" aria-label="Versículo">
    <div class="verse__inner">
      <div class="verse__left">
        <div class="verse__text-wrap">
          <img :src="vineSrc" alt="" class="verse__vine" />
          <blockquote class="verse__text">
            <p class="verse__quote">
              A tua mulher será como videira frutífera em tua casa, e teus filhos como ramos de
              oliveira ao redor da tua mesa.
            </p>
            <cite class="verse__cite">Salmos 128:3</cite>
          </blockquote>
        </div>
      </div>
      <div class="verse__right">
        <div class="verse__photo-wrap">
          <div class="verse__photo-frame">
            <video
              class="verse__photo"
              :src="videoSrc"
              width="400"
              height="500"
              autoplay
              loop
              muted
              playsinline
              aria-label="Vídeo de Davi e Mariana"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
