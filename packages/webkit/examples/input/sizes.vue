<script setup>
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import { ref } from 'vue'

  const small = ref('')
  const medium = ref('')
  const large = ref('')
</script>

<template>
  <div class="flex w-full max-w-(--container-xs) flex-col items-stretch gap-(--spacing-md)">
    <Field>
      <Field.Label>Small (28px)</Field.Label>
      <Input
        v-model="small"
        size="small"
      />
    </Field>
    <Field>
      <Field.Label>Medium (32px)</Field.Label>
      <Input
        v-model="medium"
        size="medium"
      />
    </Field>
    <Field>
      <Field.Label>Large (40px)</Field.Label>
      <Input
        v-model="large"
        size="large"
      />
    </Field>
  </div>
</template>
