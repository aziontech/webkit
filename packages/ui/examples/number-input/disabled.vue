<script setup>
  import NumberInput from '@aziontech/ui/number-input'
  import { ref } from 'vue'

  const value = ref(42)
</script>

<template>
  <div class="w-full max-w-80">
    <NumberInput
      v-model="value"
      aria-label="Quantity"
      disabled
    />
  </div>
</template>
