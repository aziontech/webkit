<script setup>
  import CodeEditor from '@aziontech/webkit/code-editor'
  import Field from '@aziontech/webkit/field'
  import { ref } from 'vue'

  const loadMonaco = async () => {
    const [{ default: EditorWorker }, { default: JsonWorker }, { default: TsWorker }] =
      await Promise.all([
        import('monaco-editor/editor/editor.worker?worker'),
        import('monaco-editor/languages/features/json/json.worker?worker'),
        import('monaco-editor/languages/features/typescript/ts.worker?worker')
      ])
    globalThis.MonacoEnvironment = {
      getWorker: (_id, label) => {
        if (label === 'json') return new JsonWorker()
        if (label === 'typescript' || label === 'javascript') return new TsWorker()
        return new EditorWorker()
      }
    }
    return import('monaco-editor')
  }

  const handler = ref(`async function handleRequest(request) {
  const token = request.headers.get('authorization')
  if (!token) return new Response('Unauthorized', { status: 401 })
  return fetch(request)
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})
`)

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
    <CodeEditor
      v-model="handler"
      :loader="loadMonaco"
      language="javascript"
      path="handler.js"
      pad-line-numbers
      height="12rem"
      aria-label="Function code"
    />
  </div>
</template>
