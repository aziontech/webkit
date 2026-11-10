<script setup>
  import FieldRadio from '@aziontech/webkit/field-radio'
  import { ref } from 'vue'

  const selected = ref('option1')
</script>

<template>
  <FieldRadio
    v-model="selected"
    name="field-radio-disabled"
    value="option1"
    label="Switch label"
    description="Switch description"
    helper-text="Helper Text"
    disabled
  />
</template>
