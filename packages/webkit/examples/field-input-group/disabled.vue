<script setup>
  import FieldInputGroup from '@aziontech/webkit/field-input-group'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <FieldInputGroup
    v-model="value"
    label="Website"
    model-value="mysite"
    helper-text="Managed by your DNS provider."
    disabled
  >
    <template #left>https://</template>
    <template #right>.com</template>
  </FieldInputGroup>
</template>
