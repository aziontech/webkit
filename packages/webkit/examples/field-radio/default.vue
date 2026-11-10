<script setup>
  import FieldRadio from '@aziontech/webkit/field-radio'
  import { ref } from 'vue'

  const selected = ref('')
</script>

<template>
  <FieldRadio
    v-model="selected"
    name="field-radio"
    value="option1"
    label="Switch label"
    description="Switch description"
  />
</template>
