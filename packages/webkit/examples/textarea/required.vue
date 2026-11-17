<script setup>
  import Field from '@aziontech/webkit/field'
  import Textarea from '@aziontech/webkit/textarea'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <Field
    required
    class="w-full max-w-(--container-xs)"
  >
    <Field.Label>Release notes</Field.Label>
    <Textarea v-model="value" />
    <Field.Description>Shown to your team with the deployment.</Field.Description>
  </Field>
</template>
