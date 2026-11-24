<script setup>
  import Field from '@aziontech/webkit/field'
  import MarkdownEditor from '@aziontech/webkit/markdown-editor'
  import { ref } from 'vue'

  const reply = ref('')
  const people = [
    { value: 'jane.doe', label: 'Jane Doe', description: 'jane.doe@example.com' },
    { value: 'john.smith', label: 'John Smith', description: 'john.smith@example.com' },
    { value: 'alex.morgan', label: 'Alex Morgan', description: 'alex.morgan@example.com' },
    { value: 'priya.patel', label: 'Priya Patel', description: 'priya.patel@example.com' }
  ]
</script>

<template>
  <Field class="w-full max-w-(--container-md)">
    <Field.Label>Reply</Field.Label>
    <MarkdownEditor
      v-model="reply"
      placeholder="Write a reply. Type @ to mention a teammate."
      :mentions="people"
    />
  </Field>
</template>
