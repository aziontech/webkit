<script setup lang="ts">
  import Field from '@aziontech/ui/field'
  import PasswordInput, { type PasswordInputAutocomplete } from '@aziontech/ui/password-input'
  import PasswordRequirements from '@aziontech/ui/password-requirements-root'

  export interface PasswordFieldProps {
    /** The id of the input. */
    id: string
    /** The form name of the input. */
    name: string
    /** The field label. */
    label: string
    /** The autocomplete hint. */
    autocomplete: PasswordInputAutocomplete
    /** The input placeholder. */
    placeholder: string
    /** The validation message; empty shows none. */
    error?: string
    /** Lists the password requirements under the input. */
    showRequirements?: boolean
  }

  withDefaults(defineProps<PasswordFieldProps>(), { error: '', showRequirements: false })

  const password = defineModel<string>({ default: '' })
</script>

<template>
  <Field
    required
    :invalid="!!error"
  >
    <Field.Label :for="id">{{ label }}</Field.Label>
    <PasswordInput
      :id="id"
      v-model="password"
      :name="name"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
    />
    <Field.Error v-if="error">{{ error }}</Field.Error>
    <PasswordRequirements
      v-if="showRequirements"
      :value="password"
    />
  </Field>
</template>
