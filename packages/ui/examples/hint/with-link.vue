<script setup>
  import Field from '@aziontech/webkit/field'
  import Hint from '@aziontech/webkit/hint'
  import Input from '@aziontech/webkit/input'
  import { ref } from 'vue'

  const ttl = ref('3600')
</script>

<template>
  <Field class="max-w-(--container-xs)">
    <Field.Label>
      Cache TTL
      <Hint
        content="How many seconds the edge serves the cached copy before it asks the origin again."
        href="https://example.com/docs/cache-settings"
      />
    </Field.Label>
    <Input
      v-model="ttl"
      inputmode="numeric"
    />
    <Field.Description>In seconds.</Field.Description>
  </Field>
</template>
