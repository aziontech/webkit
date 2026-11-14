<script setup>
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import { ref } from 'vue'

  const name = ref('')
  const region = ref('us-east-1')
</script>

<template>
  <div class="flex max-w-(--container-xs) flex-col gap-(--spacing-md)">
    <Field required>
      <Field.Label hint="Lowercase letters, numbers and hyphens.">Application name</Field.Label>
      <Input
        v-model="name"
        placeholder="my-application"
      />
    </Field>
    <Field disabled>
      <Field.Label>Region</Field.Label>
      <Input v-model="region" />
      <Field.Description
        >The region cannot change after the application is created.</Field.Description
      >
    </Field>
  </div>
</template>
