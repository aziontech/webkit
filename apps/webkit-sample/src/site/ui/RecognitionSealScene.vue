<script setup lang="ts">
  defineOptions({ name: 'RecognitionSealScene' })

  interface Props {
    /** The badge artwork. */
    src: string
    /** What the seal recognizes, as the mark's alternative text. */
    alt: string
  }

  defineProps<Props>()
</script>

<template>
  <div class="flex aspect-592/300 w-full items-center justify-center">
    <img
      :src="src"
      :alt="alt"
      decoding="async"
      class="block h-3/4 w-auto"
    />
  </div>
</template>
