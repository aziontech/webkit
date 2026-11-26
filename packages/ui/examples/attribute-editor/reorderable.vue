<script setup>
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import { ref } from 'vue'

  const definition = [
    { key: 'name', label: 'Header', placeholder: 'X-Request-Id', required: true },
    { key: 'value', label: 'Value', placeholder: '${request_id}' }
  ]

  const items = ref([
    { name: 'X-Forwarded-Host', value: 'app.example.com' },
    { name: 'X-Request-Id', value: '${request_id}' },
    { name: 'Cache-Control', value: 'no-store' }
  ])
</script>

<template>
  <AttributeEditor
    v-model:items="items"
    :definition="definition"
    :min-items="1"
    reorderable
    add-button-label="Add header"
    remove-button-label="Remove header"
    aria-label="Request headers"
  >
    <template #info>
      <p class="m-0 text-body-sm text-(--text-muted)">
        Headers are set top to bottom; a later header overrides an earlier one with the same name.
      </p>
    </template>
  </AttributeEditor>
</template>
