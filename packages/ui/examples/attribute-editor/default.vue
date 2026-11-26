<script setup>
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import { computed, ref } from 'vue'

  const definition = [
    { key: 'key', label: 'Key', placeholder: 'MY_VARIABLE', required: true },
    { key: 'value', label: 'Value', placeholder: 'my-value' }
  ]

  const items = ref([
    { key: 'API_BASE_URL', value: 'https://api.example.com' },
    { key: 'max uploads', value: '25' }
  ])

  const errors = computed(() =>
    items.value.map((item) => {
      if (!item.key.trim()) return { key: 'Key is required.' }
      if (!/^[A-Z0-9_]+$/.test(item.key))
        return { key: 'Use only uppercase letters, numbers, and underscores.' }
      return undefined
    })
  )
</script>

<template>
  <AttributeEditor
    v-model:items="items"
    :definition="definition"
    :errors="errors"
    :limit="10"
    :min-items="1"
    add-button-label="Add variable"
    remove-button-label="Remove variable"
    aria-label="Environment variables"
  />
</template>
