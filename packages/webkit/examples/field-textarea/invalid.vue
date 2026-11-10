<script setup>
  import FieldTextarea from '@aziontech/webkit/field-textarea'
  import { ref } from 'vue'

  const value = ref('Text filled')
</script>

<template>
  <FieldTextarea
    v-model="value"
    label="Alert"
    helper-text="This value is not valid."
    invalid
  />
</template>
