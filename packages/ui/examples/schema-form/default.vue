<script setup>
  import SchemaForm from '@aziontech/ui/schema-form'
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

  const args = ref({ greeting: 'Hello from the edge', timeout: 3000, debug: false })
</script>

<template>
  <SchemaForm
    v-model="args"
    class="w-full max-w-(--container-sm)"
    :schema="schema"
  />
</template>
