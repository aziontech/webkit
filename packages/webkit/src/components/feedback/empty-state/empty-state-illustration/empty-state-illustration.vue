<script setup lang="ts">
  defineOptions({
    name: 'EmptyStateIllustration',
    inheritAttrs: false
  })
</script>

<template>
  <img
    v-bind="$attrs"
    src="./empty-state-illustration.svg"
    alt=""
    aria-hidden="true"
    width="193"
    height="120"
    class="block h-auto w-full"
  />
</template>
