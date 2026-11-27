<script setup>
  import Field from '@aziontech/ui/field'
  import Input from '@aziontech/ui/input'
  import { ref } from 'vue'

  const name = ref('')
  const region = ref('')
  const description = ref('')
</script>

<template>
  <div class="flex w-full max-w-(--container-xs) flex-col items-stretch gap-(--spacing-md)">
    <Field>
      <Field.Label>Name</Field.Label>
      <Input
        v-model="name"
        size="small"
      />
    </Field>
    <Field>
      <Field.Label>Region</Field.Label>
      <Input
        v-model="region"
        size="medium"
      />
    </Field>
    <Field>
      <Field.Label>Description</Field.Label>
      <Input
        v-model="description"
        size="large"
      />
    </Field>
  </div>
</template>
