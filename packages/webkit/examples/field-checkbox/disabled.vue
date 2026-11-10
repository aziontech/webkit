<script setup>
  import FieldCheckbox from '@aziontech/webkit/field-checkbox'
  import { ref } from 'vue'

  const checked = ref(true)
</script>

<template>
  <FieldCheckbox
    v-model="checked"
    label="Switch label"
    description="Switch description"
    helper-text="Helper Text"
    disabled
  />
</template>
