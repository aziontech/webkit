<script setup>
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import { ref } from 'vue'

  const definition = [
    { key: 'key', label: 'Key', placeholder: 'MY_VARIABLE' },
    { key: 'value', label: 'Value', placeholder: 'my-value' }
  ]

  const draft = ref([])
  const locked = ref([{ key: 'NODE_ENV', value: 'production' }])
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <AttributeEditor
      v-model:items="draft"
      :definition="definition"
      empty-title="No environment variables yet."
      add-button-label="Add variable"
      aria-label="New variables"
    />
    <AttributeEditor
      v-model:items="locked"
      :definition="definition"
      disabled
      add-button-label="Add variable"
      aria-label="Variables managed by the platform"
    />
  </div>
</template>
