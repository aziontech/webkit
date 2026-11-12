<script setup>
  import NumberInput from '@aziontech/webkit/number-input'
  import { ref } from 'vue'

  const value = ref(1)
</script>

<template>
  <div class="w-[20rem]">
    <NumberInput
      v-model="value"
      :min="0"
      :max="100"
      :step="1"
      placeholder="Quantity"
    />
  </div>
</template>
