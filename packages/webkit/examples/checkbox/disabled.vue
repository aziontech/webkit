<script setup>
  import Checkbox from '@aziontech/webkit/checkbox'
  import Field from '@aziontech/webkit/field'
  import { ref } from 'vue'

  const backups = ref(true)
  const dedicatedIp = ref(false)
</script>

<template>
  <Field.Group class="max-w-(--container-xs)">
    <Field
      orientation="horizontal"
      disabled
    >
      <Checkbox v-model="backups" />
      <Field.Content>
        <Field.Label>Daily backups</Field.Label>
        <Field.Description>Always on for this plan.</Field.Description>
      </Field.Content>
    </Field>
    <Field
      orientation="horizontal"
      disabled
    >
      <Checkbox v-model="dedicatedIp" />
      <Field.Content>
        <Field.Label>Dedicated IP</Field.Label>
        <Field.Description>Available on the Enterprise plan.</Field.Description>
      </Field.Content>
    </Field>
  </Field.Group>
</template>
