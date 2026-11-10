<script setup>
  import { ref } from 'vue'
  import FieldText from '@aziontech/webkit/field-text'

  const email = ref('')
</script>

<template>
  <FieldText
    v-model="email"
    label="Email"
    type="email"
    autocomplete="username"
    :spellcheck="false"
    name="email"
    placeholder="you@example.com"
  />
</template>
