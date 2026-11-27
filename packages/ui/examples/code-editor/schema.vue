<script setup>
  import CodeEditor from '@aziontech/ui/code-editor'
  import Field from '@aziontech/ui/field'
  import { computed, ref } from 'vue'

  const loadMonaco = async () => {
    const [{ default: EditorWorker }, { default: JsonWorker }] = await Promise.all([
      import('monaco-editor/editor/editor.worker?worker'),
      import('monaco-editor/languages/features/json/json.worker?worker')
    ])
    globalThis.MonacoEnvironment = {
      getWorker: (_id, label) => (label === 'json' ? new JsonWorker() : new EditorWorker())
    }
    return import('monaco-editor')
  }

  const schema = {
    type: 'object',
    required: ['greeting'],
    additionalProperties: false,
    properties: {
      greeting: { type: 'string', description: 'Text the function answers with.' },
      retries: { type: 'integer', minimum: 0, maximum: 5 }
    }
  }

  const args = ref(`{
  "greeting": "Hello",
  "retries": 8
}
`)

  const problems = ref([])
  const first = computed(() => problems.value[0])
</script>

<template>
  <Field :invalid="Boolean(first)">
    <Field.Label>Default arguments</Field.Label>
    <CodeEditor
      v-model="args"
      :loader="loadMonaco"
      :schema="schema"
      language="json"
      path="arguments.json"
      height="10rem"
      @markers-change="(markers) => (problems = markers)"
    />
    <Field.Description>Each instance starts from these values.</Field.Description>
    <Field.Error v-if="first">Line {{ first.line }}: {{ first.message }}</Field.Error>
  </Field>
</template>
