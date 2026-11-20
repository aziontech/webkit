<script setup>
  import NumberInput from '@aziontech/webkit/number-input'
  import { ref } from 'vue'

  const value = ref(1)
</script>

<template>
  <div class="w-full max-w-80">
    <NumberInput
      v-model="value"
      :min="0"
      :max="100"
      :step="1"
      placeholder="Quantity"
    />
  </div>
</template>
