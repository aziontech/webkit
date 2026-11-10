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
    helper-text="Icons in the side slots parallel FieldText's icon story vocabulary."
  >
    <template #left
      ><i
        class="pi pi-globe"
        aria-hidden="true"
    /></template>
    <template #right
      ><i
        class="pi pi-times"
        aria-hidden="true"
    /></template>
  </FieldInputGroup>
</template>
