<script setup>
  import FieldInputGroup from '@aziontech/webkit/field-input-group'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <FieldInputGroup
    v-model="value"
    label="Website"
    model-value="not a domain"
    helper-text="Enter a valid domain (letters, digits, hyphens)."
    invalid
  >
    <template #left>https://</template>
    <template #right>.com</template>
  </FieldInputGroup>
</template>
