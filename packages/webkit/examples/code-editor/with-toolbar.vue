<script setup>
  import Button from '@aziontech/webkit/button'
  import CodeEditor from '@aziontech/webkit/code-editor'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, ref } from 'vue'

  const documents = [
    { label: 'Code', value: 'code' },
    { label: 'Arguments', value: 'arguments' }
  ]
  const active = ref('code')
  const files = ref({
    code: `export default function handler(request, args) {
  return new Response(args.greeting)
}
`,
    arguments: `{
  "greeting": "Hello"
}
`
  })
  const value = computed({
    get: () => files.value[active.value],
    set: (next) => {
      files.value[active.value] = next
    }
  })
  const markers = computed(() =>
    active.value === 'arguments' && !value.value.includes('"greeting"')
      ? [{ line: 1, severity: 'error', message: 'Add the greeting argument.' }]
      : []
  )
</script>

<template>
  <CodeEditor
    v-model="value"
    :language="active === 'code' ? 'javascript' : 'json'"
    :markers="markers"
    height="12rem"
    aria-label="Function editor"
  >
    <template #toolbar>
      <ToggleGroup
        v-model="active"
        :options="documents"
        size="small"
        aria-label="Editor document"
      />
      <span class="min-w-0 flex-1 truncate text-body-xs text-(--text-muted)">
        {{ active === 'code' ? 'JavaScript, running on request' : 'Defaults for each instance' }}
      </span>
      <Button
        label="Run"
        kind="secondary"
        size="small"
        icon="pi pi-play"
      />
    </template>
  </CodeEditor>
</template>
