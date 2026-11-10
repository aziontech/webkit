<script setup>
  import { ref } from 'vue'
  import FieldText from '@aziontech/webkit/field-text'

  const email = ref('not-an-email')
</script>

<template>
  <FieldText
    v-model="email"
    label="Email"
    placeholder="you@example.com"
    helper-text="Enter a valid email address."
    invalid
  />
</template>
