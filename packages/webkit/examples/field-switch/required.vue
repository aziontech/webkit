<script setup>
  import FieldSwitch from '@aziontech/webkit/field-switch'
  import { ref } from 'vue'

  const value = ref(false)
</script>

<template>
  <FieldSwitch
    v-model="value"
    label="Enable notifications"
    description="Required to proceed."
    required
  />
</template>
