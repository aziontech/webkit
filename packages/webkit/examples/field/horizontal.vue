<script setup>
  import { ref } from 'vue'
  import Checkbox from '@aziontech/webkit/checkbox'
  import Field from '@aziontech/webkit/field'
  import Switch from '@aziontech/webkit/switch'

  const terms = ref(false)
  const notifications = ref(true)
</script>

<template>
  <Field.Group class="max-w-(--container-xs)">
    <Field orientation="horizontal">
      <Checkbox
        v-model="terms"
        binary
        name="terms"
      />
      <Field.Content>
        <Field.Label>Accept the terms of service</Field.Label>
        <Field.Description>You can withdraw consent at any time.</Field.Description>
      </Field.Content>
    </Field>
    <Field orientation="horizontal">
      <Switch v-model="notifications" />
      <Field.Content>
        <Field.Label>Email notifications</Field.Label>
        <Field.Description>Deploy results and billing alerts.</Field.Description>
      </Field.Content>
    </Field>
  </Field.Group>
</template>
