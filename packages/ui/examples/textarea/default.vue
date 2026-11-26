<script setup>
  import Field from '@aziontech/ui/field'
  import Textarea from '@aziontech/ui/textarea'
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
