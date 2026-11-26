<script setup>
  import Combobox from '@aziontech/webkit/combobox'
  import Field from '@aziontech/webkit/field'
  import { ref } from 'vue'

  const name = ref('API_URL')

  const options = [
    { value: 'API_URL', description: 'Suggested' },
    { value: 'API_TOKEN', description: 'Suggested' },
    { value: 'NODE_ENV', description: 'System' },
    { value: 'LOG_LEVEL' },
    { value: 'CACHE_TTL' }
  ]
</script>

<template>
  <Field class="max-w-(--container-xs)">
    <Field.Label>Variable name</Field.Label>
    <Combobox
      v-model="name"
      :options="options"
      placeholder="Search or type a name"
      clearable
    />
    <Field.Description>Pick a known variable or type a new one.</Field.Description>
  </Field>
</template>
