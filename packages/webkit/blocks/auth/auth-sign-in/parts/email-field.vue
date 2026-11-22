<script setup lang="ts">
  import Field from '@aziontech/webkit/field'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'

  export interface EmailFieldProps {
    /** The id of the input, also the stem of its error id. */
    id: string
    /** The form name of the input. */
    name: string
    /** The field label. */
    label: string
    /** The autocomplete hint. */
    autocomplete: string
    /** The validation message; empty shows none. */
    error?: string
  }

  withDefaults(defineProps<EmailFieldProps>(), { error: '' })

  const email = defineModel<string>({ default: '' })
</script>

<template>
  <Field
    required
    :invalid="!!error"
  >
    <Field.Label :for="id">{{ label }}</Field.Label>
    <Input
      :id="id"
      v-model="email"
      type="email"
      :name="name"
      size="large"
      :autocomplete="autocomplete"
      class="w-full"
      placeholder="m@example.com"
      required
      :invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
    />
    <FieldError
      v-if="error"
      :id="`${id}-error`"
      >{{ error }}</FieldError
    >
  </Field>
</template>
