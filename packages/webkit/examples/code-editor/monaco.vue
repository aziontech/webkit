<script setup>
  import CodeEditor from '@aziontech/webkit/code-editor'
  import Field from '@aziontech/webkit/field'
  import { ref } from 'vue'

  const loadMonaco = async () => {
    const [{ default: EditorWorker }, { default: JsonWorker }] = await Promise.all([
      import('monaco-editor/editor/editor.worker?worker'),
      import('monaco-editor/language/json/json.worker?worker')
    ])
    globalThis.MonacoEnvironment = {
      getWorker: (_id, label) => (label === 'json' ? new JsonWorker() : new EditorWorker())
    }
    return import('monaco-editor')
  }

  const original = `{
  "cache": {
    "ttl": 60,
    "bypass": false
  }
}
`

  const code = ref(`{
  "cache": {
    "ttl": 300,
    "bypass": false,
    "stale": true
  }
}
`)

  const markers = [
    {
      line: 5,
      column: 5,
      endColumn: 12,
      severity: 'warning',
      message: '"stale" serves expired content while the cache revalidates.'
    }
  ]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <Field>
      <Field.Label>Cache settings</Field.Label>
      <CodeEditor
        v-model="code"
        :loader="loadMonaco"
        language="json"
        path="cache.json"
        :markers="markers"
        height="12rem"
      />
    </Field>
    <CodeEditor
      v-model="code"
      :original="original"
      :loader="loadMonaco"
      language="json"
      diff
      height="12rem"
      aria-label="Cache settings, compared with the saved version"
    />
  </div>
</template>
