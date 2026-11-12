<script setup>
  import Field from '@aziontech/webkit/field'
  import Textarea from '@aziontech/webkit/textarea'
  import { ref } from 'vue'

  const zoneFile = ref(
    [
      '$ORIGIN example.com.',
      '@     3600  IN  A      192.0.2.10',
      'www   3600  IN  CNAME  example.com.',
      '@     3600  IN  MX 10  mail.example.com.'
    ].join('\n')
  )
</script>

<template>
  <Field class="w-full max-w-(--container-md)">
    <Field.Label>Zone file</Field.Label>
    <Textarea
      v-model="zoneFile"
      placeholder="Paste a BIND zone file"
      :spellcheck="false"
      monospace
    />
    <Field.Description
      >The records replace the ones in this zone when you import.</Field.Description
    >
  </Field>
</template>
