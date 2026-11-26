<script setup>
  import Rating from '@aziontech/webkit/rating'
</script>

<template>
  <div class="flex flex-col items-start gap-(--spacing-md)">
    <Rating
      :model-value="4"
      size="small"
      aria-label="Small rating"
    />
    <Rating
      :model-value="4"
      size="medium"
      aria-label="Medium rating"
    />
    <Rating
      :model-value="4"
      size="large"
      aria-label="Large rating"
    />
  </div>
</template>
