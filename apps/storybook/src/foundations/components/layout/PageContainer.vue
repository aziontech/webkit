<script setup>
/**
 * PageContainer - Standard page wrapper with max-width and padding
 * Used as the root element for all foundation documentation pages
 */
defineProps({
  maxWidth: {
    type: String,
    default: '1000px'
  }
})
</script>

<template>
  <div
    class="font-sans py-10 px-10"
    :style="{ maxWidth }"
  >
    <slot />
  </div>
</template>
