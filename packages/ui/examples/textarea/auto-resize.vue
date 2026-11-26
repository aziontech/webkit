<script setup>
  import Field from '@aziontech/webkit/field'
  import Textarea from '@aziontech/webkit/textarea'
  import { ref } from 'vue'

  const question = ref('')
</script>

<template>
  <Field class="w-full max-w-(--container-md)">
    <Field.Label>Question</Field.Label>
    <Textarea
      v-model="question"
      placeholder="Ask about your deployments"
      auto-resize
      :min-rows="1"
      :max-rows="6"
    />
    <Field.Description>The field grows as you type, up to six lines.</Field.Description>
  </Field>
</template>
