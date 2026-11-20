<script setup>
  import CodeEditor from '@aziontech/webkit/code-editor'
  import { ref } from 'vue'

  const code = ref(`export default async function handler(request) {
  const response = await fetch(request)
  const headers = new Headers(response.headers)
  headers.set('Cache-Control', 'public, max-age=300')
  return new Response(response.body, { status: response.status, headers })
}
`)
</script>

<template>
  <div
    class="flex h-72 flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default)"
  >
    <CodeEditor
      v-model="code"
      :bordered="false"
      language="javascript"
      pad-line-numbers
      fill
      aria-label="Function code"
    >
      <template #toolbar>
        <span class="min-w-0 flex-1 truncate text-label-code-sm text-(--text-default)"
          >handler.js</span
        >
        <span class="shrink-0 text-body-xs text-(--text-muted)">JavaScript</span>
      </template>
    </CodeEditor>
  </div>
</template>
