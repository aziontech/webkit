<script setup>
  import SchemaForm from '@aziontech/webkit/schema-form'
  import { ref } from 'vue'

  const schema = {
    type: 'object',
    required: ['greeting', 'region'],
    properties: {
      greeting: {
        type: 'string',
        title: 'Greeting',
        description: 'The text the function returns on every request.',
        default: 'Hello from the edge',
        maxLength: 80
      },
      region: {
        type: 'string',
        title: 'Region',
        description: 'Where the function reads its data from.',
        enum: ['sa-east', 'us-east', 'eu-west']
      },
      timeout: {
        type: 'integer',
        title: 'Timeout (ms)',
        description: 'How long the function waits for its origin.',
        minimum: 100,
        maximum: 30000,
        default: 3000
      },
      debug: {
        type: 'boolean',
        title: 'Debug headers',
        description: 'Adds timing headers to every response.',
        default: false
      },
      allowedPaths: {
        type: 'array',
        title: 'Allowed paths',
        description: 'Requests to other paths return 404.',
        items: { type: 'string', pattern: '^/' }
      }
    }
  }

  const args = ref({})
</script>

<template>
  <div class="flex w-full max-w-(--container-sm) flex-col gap-(--spacing-lg)">
    <SchemaForm
      v-model="args"
      :schema="schema"
    />
    <pre
      class="m-0 overflow-auto rounded-(--shape-elements) bg-(--bg-surface) p-(--spacing-sm) font-code text-body-xs text-(--text-muted)"
      >{{ JSON.stringify(args, null, 2) }}</pre>
  </div>
</template>
