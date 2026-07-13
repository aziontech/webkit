<script lang="ts">
  // CANARY — must keep failing vue/no-arrow-functions-in-watch.
  // An arrow function in the options-API watch object has no `this`.
  export default {
    name: 'CanaryArrowWatch',
    props: {
      modelValue: { type: String, default: '' }
    },
    watch: {
      modelValue: (value: string) => {
        console.warn('modelValue changed', value)
      }
    }
  }
</script>

<template>
  <span>{{ modelValue }}</span>
</template>
