<script setup>
  import InputNumber from '@aziontech/webkit/input-number'
  import { ref } from 'vue'

  const value = ref(1)
</script>

<template>
  <div class="w-[20rem]">
    <InputNumber
      v-model="value"
      :min="0"
      :max="100"
      :step="1"
      placeholder="Quantity"
    />
  </div>
</template>
