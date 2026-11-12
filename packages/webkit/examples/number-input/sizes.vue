<script setup>
  import NumberInput from '@aziontech/webkit/number-input'
  import { ref } from 'vue'

  const small = ref(1)
  const medium = ref(10)
  const large = ref(100)
</script>

<template>
  <div class="flex w-[20rem] flex-col gap-(--spacing-md)">
    <NumberInput
      v-model="small"
      size="small"
      aria-label="Quantity, small"
      :min="0"
      :max="9"
      :step="1"
    />
    <NumberInput
      v-model="medium"
      size="medium"
      aria-label="Quantity, medium"
      :min="0"
      :max="99"
      :step="5"
    />
    <NumberInput
      v-model="large"
      size="large"
      aria-label="Quantity, large"
      :min="0"
      :max="1000"
      :step="50"
    />
  </div>
</template>
