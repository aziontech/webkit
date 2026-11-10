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
    placeholder="mysite.com"
    helper-text="Only used while the feature is enabled."
  />
</template>
