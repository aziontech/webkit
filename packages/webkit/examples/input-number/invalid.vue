<script setup>
  import InputNumber from '@aziontech/webkit/input-number'
  import { ref } from 'vue'

  const value = ref(99)
</script>

<template>
  <div class="w-[20rem]">
    <InputNumber
      v-model="value"
      invalid
      required
    />
  </div>
</template>
