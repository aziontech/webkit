<script setup>
  import FieldTextSwitch from '@aziontech/webkit/field-text-switch'
  import { ref } from 'vue'

  const enabled = ref(true)
  const value = ref('')
</script>

<template>
  <FieldTextSwitch
    v-model="value"
    v-model:enabled="enabled"
    label="Custom domain"
    model-value="mysite.com"
    helper-text="Managed by your account owner."
    disabled
  />
</template>
