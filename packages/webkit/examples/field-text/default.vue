<script setup>
  import { ref } from 'vue'
  import FieldText from '@aziontech/webkit/field-text'

  const email = ref('')
</script>

<template>
  <FieldText
    v-model="email"
    label="Email"
    placeholder="you@example.com"
    helper-text="We'll never share your email."
  />
</template>
