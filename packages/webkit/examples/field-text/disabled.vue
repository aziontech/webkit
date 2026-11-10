<script setup>
  import { ref } from 'vue'
  import FieldText from '@aziontech/webkit/field-text'

  const email = ref('locked@example.com')
</script>

<template>
  <FieldText
    v-model="email"
    label="Email"
    placeholder="you@example.com"
    helper-text="This field is locked."
    disabled
  />
</template>
