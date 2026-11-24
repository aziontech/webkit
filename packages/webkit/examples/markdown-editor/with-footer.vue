<script setup>
  import Button from '@aziontech/webkit/button'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import MarkdownEditor from '@aziontech/webkit/markdown-editor'
  import { ref } from 'vue'

  const reply = ref('')
  const people = [
    { value: 'jane.doe', label: 'Jane Doe', description: 'jane.doe@example.com' },
    { value: 'sam.lee', label: 'Sam Lee', description: 'sam.lee@example.com' }
  ]
</script>

<template>
  <Field class="w-full max-w-(--container-md)">
    <Field.Label>Reply to Acme Inc.</Field.Label>
    <MarkdownEditor
      v-model="reply"
      placeholder="Write a reply"
      :mentions="people"
    >
      <template #footer>
        <IconButton
          icon="az az-paperclip"
          aria-label="Attach files"
          variant="ghost"
          size="medium"
        />
        <Button
          label="Send reply"
          size="medium"
          class="ms-auto"
        />
      </template>
    </MarkdownEditor>
  </Field>
</template>
