<script setup>
  import Button from '@aziontech/webkit/button'
  import Hero from '@aziontech/webkit/hero'
  import Illustration from '@aziontech/webkit/illustration'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'

  import { HERO_ART_CLASS, heroArt } from '../data/hero-art.js'

  const props = defineProps({
    /** The opening band: eyebrow, title, description, the art beside them (a registered Illustration name, or an asset src with its width and height; either way its name must have bounds in hero-art.js) and, optionally, the client marks the carousel runs; without marks the hero has no carousel. */
    hero: { type: Object, required: true }
  })

  const hasCarousel = computed(() => Boolean(props.hero.carouselMarks?.length))

  const router = useRouter()
  const goSignup = () => router.push('/signup')
</script>

<template>
  <Hero
    max-width="5xl"
    kind="screen"
    media-align="end"
    :carousel="hasCarousel"
    carousel-label="Trusted by mission-critical workloads"
    :carousel-marks="hero.carouselMarks ?? []"
    offset="3.5rem"
  >
    <Hero.Title
      max-width="xl"
      :eyebrow="hero.eyebrow"
      eyebrow-prefix="//"
      :title="hero.title"
      :description="hero.description"
    >
      <template #actions>
        <Button
          label="Start Free"
          kind="secondary"
          size="large"
          @click="goSignup"
        />
        <Button
          label="Talk to a Specialist"
          kind="outlined"
          size="large"
          href="#contact"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
        />
      </template>
    </Hero.Title>

    <template #media>
      <img
        v-if="hero.art.src"
        :src="hero.art.src"
        :alt="hero.art.alt"
        :width="hero.art.width"
        :height="hero.art.height"
        :data-orientation="hero.art.height > hero.art.width ? 'portrait' : null"
        decoding="async"
        class="block h-auto w-full max-md:data-[orientation=portrait]:mx-auto max-md:data-[orientation=portrait]:w-1/2"
        :class="HERO_ART_CLASS"
        :style="heroArt(hero.art.name)"
      />
      <Illustration
        v-else
        :name="hero.art.name"
        :aria-label="hero.art.alt"
        :class="HERO_ART_CLASS"
        :style="heroArt(hero.art.name)"
      />
    </template>
  </Hero>
</template>
