<script setup>
  import InputNumber from '@aziontech/webkit/input-number'
  import { ref } from 'vue'

  const small = ref(1)
  const medium = ref(10)
  const large = ref(100)
</script>

<template>
  <div class="flex w-[20rem] flex-col gap-(--spacing-md)">
    <InputNumber
      v-model="small"
      size="small"
      :min="0"
      :max="9"
      :step="1"
    />
    <InputNumber
      v-model="medium"
      size="medium"
      :min="0"
      :max="99"
      :step="5"
    />
    <InputNumber
      v-model="large"
      size="large"
      :min="0"
      :max="1000"
      :step="50"
    />
  </div>
</template>
