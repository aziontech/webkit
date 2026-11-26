<script setup>
  import Field from '@aziontech/webkit/field'
  import MarkdownEditor from '@aziontech/webkit/markdown-editor'
  import { ref } from 'vue'

  const reply = ref('Thanks for the report, we are looking into it.')
</script>

<template>
  <Field class="w-full max-w-(--container-md)">
    <Field.Label>Reply</Field.Label>
    <MarkdownEditor
      v-model="reply"
      disabled
    />
  </Field>
</template>
