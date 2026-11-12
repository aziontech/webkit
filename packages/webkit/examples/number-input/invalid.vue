<script setup>
  import NumberInput from '@aziontech/webkit/number-input'
  import { ref } from 'vue'

  const value = ref(99)
</script>

<template>
  <div class="w-[20rem]">
    <NumberInput
      v-model="value"
      aria-label="Quantity"
      invalid
      required
    />
  </div>
</template>
