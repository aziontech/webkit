<script setup>
  import { ref } from 'vue'
  import Checkbox from '@aziontech/webkit/checkbox'
  import Field from '@aziontech/webkit/field'
  import Switch from '@aziontech/webkit/switch'

  const backups = ref(true)
  const waf = ref(false)
</script>

<template>
  <Field.Group class="max-w-(--container-xs)">
    <Field.Label>
      <Field orientation="horizontal">
        <Checkbox
          v-model="backups"
          binary
        />
        <Field.Content>
          <Field.Title>Daily backups</Field.Title>
          <Field.Description>Keep seven days of snapshots.</Field.Description>
        </Field.Content>
      </Field>
    </Field.Label>
    <Field.Label>
      <Field orientation="horizontal">
        <Switch v-model="waf" />
        <Field.Content>
          <Field.Title>Web Application Firewall</Field.Title>
          <Field.Description>Block common attacks before they reach the origin.</Field.Description>
        </Field.Content>
      </Field>
    </Field.Label>
    <Field.Label>
      <Field
        orientation="horizontal"
        disabled
      >
        <Checkbox binary />
        <Field.Content>
          <Field.Title>Dedicated IP</Field.Title>
          <Field.Description>Available on the Enterprise plan.</Field.Description>
        </Field.Content>
      </Field>
    </Field.Label>
  </Field.Group>
</template>
