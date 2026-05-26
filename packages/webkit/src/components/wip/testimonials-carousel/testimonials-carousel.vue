<script setup>
  import Carousel from 'primevue/carousel'
  import { computed } from 'vue'

  const AUTOPLAY_INTERVAL_MS = 10000

  const props = defineProps({
    testimonials: {
      type: Array,
      required: true,
      validator: (value) => value.length > 0
    },
    subtitle: {
      type: String,
      default: 'Trusted by market leaders across banking, e-commerce, tech, and other industries.'
    },
    autoplayInterval: {
      type: Number,
      default: AUTOPLAY_INTERVAL_MS
    },
    circular: {
      type: Boolean,
      default: false
    },
    showNavigators: {
      type: Boolean,
      default: false
    },
    showIndicators: {
      type: Boolean,
      default: false
    },
    quoted: {
      type: Boolean,
      default: true
    }
  })

  const carouselOptions = computed(() => ({
    numVisible: 1,
    circular: props.circular,
    showNavigators: props.showNavigators,
    showIndicators: props.showIndicators,
    autoplayInterval: props.autoplayInterval
  }))
</script>

<template>
  <div class="flex flex-col gap-16 md:max-w-[672px]">
    <p class="text-color-secondary text-center">
      {{ subtitle }}
    </p>

    <Carousel
      :value="testimonials"
      v-bind="carouselOptions"
    >
      <template #item="{ data }">
        <div class="flex flex-col gap-2">
          <div class="text-xl md:text-3xl font-medium text-center">
            <q v-if="quoted">{{ data.testimonial }}</q>
            <span v-else>{{ data.testimonial }}</span>
          </div>
          <p class="text-color-secondary text-center">{{ data.name }}, {{ data.position }}</p>
        </div>

        <div
          v-if="data.logo"
          class="flex justify-center mt-16"
        >
          <component :is="data.logo" />
        </div>
      </template>
    </Carousel>
  </div>
</template>
