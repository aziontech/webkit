<script setup>
  import Field from '@aziontech/ui/field'
  import Input from '@aziontech/ui/input'
  import { ref } from 'vue'

  const email = ref('')
</script>

<template>
  <Field class="max-w-(--container-xs)">
    <Field.Label>Email</Field.Label>
    <Input
      v-model="email"
      type="email"
      autocomplete="email"
      placeholder="you@example.com"
    />
    <Field.Description>We'll never share your email.</Field.Description>
  </Field>
</template>
