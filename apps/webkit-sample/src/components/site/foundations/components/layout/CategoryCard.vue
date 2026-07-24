<script setup>
  /**
   * CategoryCard - Link card for navigating between token categories
   * Used in the Colors overview for Background/Text/Border navigation.
   * Storybook's addon-links navigation is stubbed here (the sample app has no
   * Storybook manager); the card falls back to an in-page anchor jump.
   */
  const props = defineProps({
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
    storyId: {
      type: String,
      required: true
    }
  })

  function handleNavigate() {
    // No Storybook manager here — jump to the matching in-page section anchor.
    if (typeof document !== 'undefined') {
      document.getElementById(props.storyId)?.scrollIntoView({ behavior: 'smooth' })
    }
  }
</script>

<template>
  <button
    @click="handleNavigate"
    class="block w-full text-left p-5 border border-default rounded-lg cursor-pointer transition-colors duration-150 hover:border-primary bg-transparent"
  >
    <p class="text-overline-xs text-muted m-0 mb-1.5">{{ overline }}</p>
    <p class="text-heading-md text-default m-0 mb-2">{{ title }}</p>
    <p class="text-body-xs text-muted m-0 leading-relaxed">{{ description }}</p>
    <p class="text-body-xs text-muted m-0 mt-2 font-code">{{ tokens }}</p>
  </button>
</template>
