<script setup>
  // The featured success cases as one horizontal stack (Figma 13224:203120): one card
  // open, the others collapsed to a strip. Hover or focus opens a card; leaving the stack
  // returns to the first. Below `lg` the stack is a column and every card is open.
  import { ref } from 'vue'

  const props = defineProps({
    // FEATURED_CASES entries: { key, client, brand: { base, glow, ink? }, description, href }.
    cases: {
      type: Array,
      required: true
    }
  })

  const active = ref(0)
  const reset = () => {
    active.value = 0
  }
  const onFocusOut = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) reset()
  }

  // The design's 948px art plate: the brand fill with two glow ellipses, top-left and
  // bottom-right. Collapsed cards show its centre crop, as the Figma frames do.
  const plate = (brand) => ({
    background: [
      `radial-gradient(480px circle at 102px 0, ${brand.glow}, transparent 70%)`,
      `radial-gradient(480px circle at 809px 447px, ${brand.glow}, transparent 70%)`,
      brand.base
    ].join(', ')
  })
</script>

<template>
  <div
    class="flex flex-col gap-px bg-(--border-default) lg:h-126 lg:flex-row"
    @mouseleave="reset"
    @focusout="onFocusOut"
  >
    <a
      v-for="(story, index) in props.cases"
      :key="story.key"
      :href="story.href"
      target="_blank"
      rel="noopener"
      :data-active="index === active || null"
      :data-ink="story.brand.ink"
      class="group/card relative isolate flex min-h-80 min-w-0 flex-col justify-end gap-(--spacing-lg) overflow-hidden p-(--spacing-lg) transition-[flex-grow] duration-moderate-02 ease-productive-entrance focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none lg:min-h-0 lg:grow lg:basis-0 lg:data-[active]:grow-[5.7]"
      :style="{ backgroundColor: story.brand.base }"
      @mouseenter="active = index"
      @focus="active = index"
    >
      <div
        aria-hidden="true"
        class="absolute inset-y-0 left-1/2 -z-10 w-237 -translate-x-1/2"
        :style="plate(story.brand)"
      />

      <img
        :src="story.client.logo || story.client.logoLight"
        :alt="story.client.name"
        decoding="async"
        class="my-auto h-10 w-auto max-w-[70%] self-center object-contain lg:absolute lg:left-1/2 lg:top-1/2 lg:my-0 lg:-translate-x-1/2 lg:-translate-y-1/2 brightness-0 invert group-data-[ink=dark]/card:invert-0 transition-[height] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none lg:group-data-[active]/card:h-20"
      />

      <p
        class="m-0 max-w-160 text-balance text-heading-sm text-(--color-base-white) group-data-[ink=dark]/card:text-(--color-base-black) transition-opacity duration-moderate-02 ease-productive-entrance motion-reduce:transition-none lg:w-160 lg:opacity-0 lg:group-data-[active]/card:opacity-100"
      >
        {{ story.description }}
      </p>
    </a>
  </div>
</template>
