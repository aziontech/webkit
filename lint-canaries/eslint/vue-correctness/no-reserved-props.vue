<script setup lang="ts">
  // CANARY — must keep failing vue/no-reserved-props (Vue 3).
  // `key` and `ref` are consumed by Vue and never reach the component.
  defineProps({
    key: { type: String, default: '' },
    ref: { type: Object, default: null }
  })
</script>

<template>
  <span>reserved props canary</span>
</template>
