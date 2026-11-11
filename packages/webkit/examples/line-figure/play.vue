<script setup>
  import LineFigure from '@aziontech/webkit/line-figure'
  import { ref } from 'vue'

  const reading = ref('')
</script>

<template>
  <div class="flex max-w-(--container-sm) flex-col gap-(--spacing-sm)">
    <LineFigure
      name="lb-rotor"
      play
      :intensity="0.8"
      @read="reading = $event"
    />
    <p
      class="m-0 text-body-sm text-(--text-muted)"
      aria-live="polite"
    >
      {{ reading }}
    </p>
  </div>
</template>
