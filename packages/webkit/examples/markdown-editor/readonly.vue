<script setup>
  import Field from '@aziontech/webkit/field'
  import MarkdownEditor from '@aziontech/webkit/markdown-editor'
  import { ref } from 'vue'

  const note = ref(
    [
      'Hi **Jane**, the purge finished at _10:42 UTC_.',
      '',
      '- Cache cleared for `app.example.com`',
      '- Logs are in [the dashboard](https://example.com/logs)',
      '',
      '1. Reload the page',
      '2. Reply here if the error is back',
      '',
      '> The old certificate is no longer served.'
    ].join('\n')
  )
</script>

<template>
  <Field class="w-full max-w-(--container-md)">
    <Field.Label>Internal note</Field.Label>
    <MarkdownEditor
      v-model="note"
      readonly
    />
    <Field.Description>Notes are locked once the ticket is closed.</Field.Description>
  </Field>
</template>
