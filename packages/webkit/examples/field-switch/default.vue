<script setup>
  import FieldSwitch from '@aziontech/webkit/field-switch'
  import { ref } from 'vue'

  const value = ref(false)
</script>

<template>
  <FieldSwitch
    v-model="value"
    label="Switch label"
    description="Switch description"
  />
</template>
