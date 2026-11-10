<script setup>
  import { ref } from 'vue'
  import FieldCheckboxBlock from '@aziontech/webkit/field-checkbox-block'

  const checked = ref(false)
</script>

<template>
  <FieldCheckboxBlock
    v-model="checked"
    label="Enable feature"
    description="Turns this feature on for your project."
  />
</template>
