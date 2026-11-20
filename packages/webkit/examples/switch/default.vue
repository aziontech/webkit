<script setup>
  import Switch from '@aziontech/webkit/switch'
  import { ref } from 'vue'

  const modelValue = ref(false)
</script>

<template>
  <Switch
    v-model="modelValue"
    aria-label="Toggle setting"
  />
</template>
