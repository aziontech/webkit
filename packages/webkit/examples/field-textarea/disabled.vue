<script setup>
  import FieldTextarea from '@aziontech/webkit/field-textarea'
  import { ref } from 'vue'

  const value = ref('This message is locked.')
</script>

<template>
  <FieldTextarea
    v-model="value"
    label="Alert"
    helper-text="This field is locked."
    disabled
  />
</template>
