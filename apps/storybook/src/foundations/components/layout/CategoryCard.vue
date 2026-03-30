<script setup>
/**
 * CategoryCard - Link card for navigating between token categories
 * Used in the Colors overview for Background/Text/Border navigation
 */
defineProps({
  overline: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tokens: {
    type: String,
    required: true
  },
  href: {
    type: String,
    required: true
  }
})
</script>

<template>
  <a
    :href="href"
    class="block p-5 border border-default rounded-lg cursor-pointer no-underline transition-colors duration-150 hover:border-primary hover:bg-primary/5"
  >
    <p class="text-overline-xs text-muted m-0 mb-1.5">{{ overline }}</p>
    <p class="text-heading-md text-default m-0 mb-2">{{ title }}</p>
    <p class="text-body-xs text-muted m-0 leading-relaxed">{{ description }}</p>
    <p class="text-body-xs text-muted m-0 mt-2 font-code">{{ tokens }}</p>
  </a>
</template>
