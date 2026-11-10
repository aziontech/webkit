<script setup>
  import { ref } from 'vue'
  import FieldCheckboxBlock from '@aziontech/webkit/field-checkbox-block'

  const checked = ref(true)
</script>

<template>
  <FieldCheckboxBlock
    v-model="checked"
    label="Enable feature"
    description="Turns this feature on for your project."
    helper-text="Helper Text"
    disabled
  />
</template>
