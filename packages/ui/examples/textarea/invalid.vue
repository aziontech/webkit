<script setup>
  import Field from '@aziontech/webkit/field'
  import Textarea from '@aziontech/webkit/textarea'
  import { ref } from 'vue'

  const value = ref('Assets')
</script>

<template>
  <Field
    invalid
    class="w-full max-w-(--container-xs)"
  >
    <Field.Label>Description</Field.Label>
    <Textarea v-model="value" />
    <Field.Error>Use at least 20 characters so your team can tell this workload apart.</Field.Error>
  </Field>
</template>
