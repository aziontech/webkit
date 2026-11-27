<script setup>
  import Field from '@aziontech/ui/field'
  import Textarea from '@aziontech/ui/textarea'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <Field>
      <Field.Label>Vertical (default)</Field.Label>
      <Textarea
        v-model="value"
        resize="vertical"
      />
    </Field>
    <Field>
      <Field.Label>Horizontal</Field.Label>
      <Textarea
        v-model="value"
        resize="horizontal"
      />
    </Field>
    <Field>
      <Field.Label>Both</Field.Label>
      <Textarea
        v-model="value"
        resize="both"
      />
    </Field>
    <Field>
      <Field.Label>None</Field.Label>
      <Textarea
        v-model="value"
        resize="none"
      />
    </Field>
  </div>
</template>
