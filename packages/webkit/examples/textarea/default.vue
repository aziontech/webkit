<script setup>
  import Field from '@aziontech/webkit/field'
  import Textarea from '@aziontech/webkit/textarea'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <Field class="w-full max-w-(--container-xs)">
    <Field.Label>Message</Field.Label>
    <Textarea
      v-model="value"
      placeholder="Write your message"
    />
  </Field>
</template>
