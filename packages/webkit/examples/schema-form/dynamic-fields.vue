<script setup>
  import SchemaForm from '@aziontech/webkit/schema-form'
  import { ref } from 'vue'

  const origins = [
    { value: 'origin-primary', label: 'origin.example.com', description: 'Primary' },
    { value: 'origin-assets', label: 'assets.example.com', description: 'Static files' },
    { value: 'origin-api', label: 'api.example.com', description: 'API' },
    { value: 'origin-legacy', label: 'legacy.example.org', description: 'Legacy' }
  ]

  const loadOrigins = async (query) => {
    const needle = query.trim().toLowerCase()
    return origins.filter((origin) => origin.label.includes(needle))
  }

  const schema = {
    type: 'object',
    required: ['name', 'origin'],
    properties: {
      name: { type: 'string', title: 'Name', minLength: 3, default: 'acme-store' },
      origin: {
        type: 'string',
        title: 'Origin',
        description: 'Where requests go when the cache misses.'
      },
      cache: { type: 'boolean', title: 'Cache responses', default: true },
      ttl: {
        type: 'integer',
        title: 'Cache TTL (seconds)',
        minimum: 60,
        default: 3600
      },
      rules: {
        type: 'array',
        title: 'Rules',
        description: 'Checked in order; the first rule that matches the path wins.',
        maxItems: 5,
        items: {
          type: 'object',
          title: 'Rule',
          required: ['path', 'behavior'],
          properties: {
            path: { type: 'string', title: 'Path', default: '/' },
            behavior: {
              type: 'string',
              title: 'Behavior',
              enum: ['cache', 'bypass', 'redirect'],
              default: 'cache'
            },
            target: { type: 'string', title: 'Redirect to', format: 'uri' }
          }
        }
      }
    }
  }

  const ui = {
    origin: { options: loadOrigins },
    ttl: { when: (value) => value.cache === true },
    rules: { widget: 'repeat' },
    'rules.*.target': { when: (_value, rule) => rule.behavior === 'redirect' }
  }

  const value = ref({ rules: [{ path: '/images', behavior: 'cache' }] })
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
