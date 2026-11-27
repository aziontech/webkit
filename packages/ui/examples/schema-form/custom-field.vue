<script setup>
  import RadioGroup from '@aziontech/ui/radio-group-root'
  import SchemaForm from '@aziontech/ui/schema-form'
  import { ref } from 'vue'

  const schema = {
    type: 'object',
    properties: {
      mode: {
        type: 'string',
        title: 'Cache mode',
        enum: ['honor', 'override'],
        default: 'honor'
      },
      ttl: { type: 'integer', title: 'TTL (seconds)', minimum: 0, default: 3600 },
      notes: { type: 'string', title: 'Notes', 'x-multiline': true }
    }
  }

  const ui = { '': { order: ['ttl', 'mode'] }, notes: { placeholder: 'Why this cache policy' } }
  const settings = ref({})
</script>

<template>
  <SchemaForm
    v-model="settings"
    :schema="schema"
    :ui="ui"
    class="max-w-(--container-sm)"
  >
    <template #field:mode="{ value, setValue, disabled }">
      <RadioGroup
        :model-value="value"
        variant="card"
        orientation="horizontal"
        aria-label="Cache mode"
        :options="[
          {
            value: 'honor',
            label: 'Honor origin headers',
            description: 'Cache for as long as the origin says.'
          },
          {
            value: 'override',
            label: 'Override with TTL',
            description: 'Cache for the TTL below, whatever the origin says.'
          }
        ]"
        :disabled="disabled"
        @update:model-value="setValue"
      />
    </template>
  </SchemaForm>
</template>
