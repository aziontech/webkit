<script setup>
  import FieldTextSwitch from '@aziontech/webkit/field-text-switch'
  import { ref } from 'vue'

  const enabled = ref(false)
  const value = ref('')
</script>

<template>
  <FieldTextSwitch
    v-model="value"
    v-model:enabled="enabled"
    label="Custom domain"
    placeholder="mysite.com"
    helper-text="Toggle the switch to enable this field."
  />
</template>
