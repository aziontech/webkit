<script setup lang="ts">
  defineOptions({ name: 'IllustrationLayers', inheritAttrs: false })
</script>

<template>
  <img
    v-bind="$attrs"
    src="./empty.svg"
    class="mb-5"
    alt="Empty Illustration"
  />
</template>
