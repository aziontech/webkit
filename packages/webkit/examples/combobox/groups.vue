<script setup>
  import Combobox from '@aziontech/webkit/combobox'
  import Field from '@aziontech/webkit/field'
  import { ref } from 'vue'

  const header = ref('')

  const options = [
    { value: 'X-Request-Id', group: 'Recent' },
    { value: 'X-Tenant', group: 'Recent' },
    { value: 'Cache-Control', group: 'Standard' },
    { value: 'Content-Type', group: 'Standard' },
    { value: 'Authorization', group: 'Standard', disabled: true, description: 'Managed' }
  ]
</script>

<template>
  <Field class="max-w-(--container-xs)">
    <Field.Label>Request header</Field.Label>
    <Combobox
      v-model="header"
      :options="options"
      placeholder="Header name"
    />
  </Field>
</template>
