<template>
  <div class="flex flex-col gap-3">
    <img
      v-if="logoSrc"
      :src="`${logoSrc}?ims=x60`"
      loading="lazy"
      class="max-h-8 w-fit brightness-0 invert mb-4"
      width="auto"
      height="60"
      :alt="logoAlt || source"
    />
    <h3 class="text-base font-sora text-neutral-200">{{ testimonial }}</h3>
    <p class="text-sm font-sora text-neutral-500">{{ source }}</p>
  </div>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    logo: {
      type: [String, Object],
      required: false,
      default: null
    },
    testimonial: {
      type: String,
      required: true
    },
    source: {
      type: String,
      required: true
    }
  })

  const logoSrc = computed(() => {
    if (!props.logo) return ''
    if (typeof props.logo === 'string') {
      return props.logo
    }
    return props.logo?.src || ''
  })

  const logoAlt = computed(() => {
    if (!props.logo) return ''
    if (typeof props.logo === 'object') {
      return props.logo?.alt || ''
    }
    return ''
  })
</script>
