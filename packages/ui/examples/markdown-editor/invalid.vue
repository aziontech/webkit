<script setup>
  import Field from '@aziontech/ui/field'
  import MarkdownEditor from '@aziontech/ui/markdown-editor'
  import { ref } from 'vue'

  const reply = ref('')
</script>

<template>
  <Field
    invalid
    required
    class="w-full max-w-(--container-md)"
  >
    <Field.Label>Reply</Field.Label>
    <MarkdownEditor
      v-model="reply"
      placeholder="Write a reply"
      invalid
    />
    <Field.Error>Write a reply before sending.</Field.Error>
  </Field>
</template>
