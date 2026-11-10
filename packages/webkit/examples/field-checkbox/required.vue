<script setup>
  import FieldCheckbox from '@aziontech/webkit/field-checkbox'
  import { ref } from 'vue'

  const checked = ref(false)
</script>

<template>
  <FieldCheckbox
    v-model="checked"
    label="I agree to the terms"
    description="Required to continue."
    required
  />
</template>
