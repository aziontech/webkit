<script setup>
  import SchemaForm from '@aziontech/webkit/schema-form'
  import { ref } from 'vue'

  const schema = {
    type: 'object',
    required: ['name', 'contact', 'endpoint'],
    properties: {
      name: { type: 'string', title: 'Name', minLength: 3 },
      contact: {
        type: 'string',
        title: 'Alert email',
        format: 'email',
        description: 'Receives a message when a delivery fails.'
      },
      endpoint: { type: 'string', title: 'Endpoint', format: 'uri' },
      auth: {
        title: 'Authentication',
        discriminator: { propertyName: 'method' },
        oneOf: [
          {
            title: 'API token',
            required: ['token'],
            properties: {
              method: { const: 'token', title: 'Method' },
              token: { type: 'string', title: 'Token', writeOnly: true }
            }
          },
          {
            title: 'User and password',
            required: ['user'],
            properties: {
              method: { const: 'basic' },
              user: { type: 'string', title: 'User' },
              password: { type: 'string', title: 'Password', writeOnly: true }
            }
          }
        ]
      },
      headers: {
        type: 'object',
        title: 'Headers',
        description: 'Sent with every delivery.',
        additionalProperties: { type: 'string' }
      },
      retries: { type: 'integer', title: 'Retries', minimum: 0, maximum: 10, default: 3 },
      starts: { type: 'string', title: 'Start date', format: 'date' }
    }
  }

  const ui = {
    '': { sections: [{ keys: ['headers', 'retries', 'starts'], collapsed: true }] }
  }

  const value = ref({
    name: 'delivery-hook',
    auth: { method: 'basic', user: 'jane.doe' },
    headers: { 'X-Team': 'platform' }
  })
</script>

<template>
  <div class="flex w-full max-w-(--container-sm) flex-col">
    <SchemaForm
      v-model="value"
      :schema="schema"
      :ui="ui"
    />
  </div>
</template>
