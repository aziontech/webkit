<script setup>
  import CodeEditor from '@aziontech/webkit/code-editor'
  import Field from '@aziontech/webkit/field'
  import { ref } from 'vue'

  const code = ref(`export default async function handler(request) {
  const url = new URL(request.url)
  const name = url.searchParams.get('name')
  return new Response(\`Hello, \${name}\`)
}
`)

  const markers = [
    { line: 3, severity: 'warning', message: 'name can be null; give it a default value.' },
    { line: 4, severity: 'info', message: 'Set a Content-Type header on the response.' }
  ]
</script>

<template>
  <Field>
    <Field.Label>Function code</Field.Label>
    <CodeEditor
      v-model="code"
      language="javascript"
      :markers="markers"
      height="14rem"
    />
    <Field.Description>Runs on every request that reaches this function.</Field.Description>
  </Field>
</template>
