<script setup>
  import Rating from '@aziontech/ui/rating'
  import { ref } from 'vue'

  const score = ref(3)
</script>

<template>
  <Rating
    v-model="score"
    aria-label="Rate this conversation"
    disabled
  />
</template>
