<script setup>
  import FieldInputGroup from '@aziontech/webkit/field-input-group'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <FieldInputGroup
    v-model="value"
    label="Website"
    placeholder="mysite"
    helper-text="Enter the domain without the scheme."
  >
    <template #left>https://</template>
    <template #right>.com</template>
  </FieldInputGroup>
</template>
