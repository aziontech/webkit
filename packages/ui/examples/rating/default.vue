<script setup>
  import Rating from '@aziontech/ui/rating'
  import { ref } from 'vue'

  const score = ref(0)
</script>

<template>
  <div class="flex items-center gap-(--spacing-sm)">
    <Rating
      v-model="score"
      name="satisfaction"
      aria-label="Rate this conversation"
      clearable
    />
    <span
      class="text-body-sm text-(--text-muted)"
      aria-live="polite"
      >{{ score ? `${score} of 5` : 'No score yet' }}</span
    >
  </div>
</template>
