<script setup>
  import FieldCheckbox from '@aziontech/webkit/field-checkbox'
  import { ref } from 'vue'

  const checked = ref(false)
</script>

<template>
  <FieldCheckbox
    v-model="checked"
    label="Switch label"
    description="Switch description"
  />
</template>
