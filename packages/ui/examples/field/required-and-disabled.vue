<script setup>
  import Field from '@aziontech/ui/field'
  import Input from '@aziontech/ui/input'
  import { ref } from 'vue'

  const name = ref('')
  const region = ref('us-east-1')
</script>

<template>
  <div class="flex max-w-(--container-xs) flex-col gap-(--spacing-md)">
    <Field required>
      <Field.Label hint="The name appears in the console and in the application's default domain.">
        Application name
      </Field.Label>
      <Input
        v-model="name"
        placeholder="my-application"
      />
      <Field.Description>Lowercase letters, numbers and hyphens.</Field.Description>
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
