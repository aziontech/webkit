<script setup>
  import { DEFAULT_PASSWORD_REQUIREMENTS } from '@aziontech/webkit/password-requirements'
  import FieldPassword from '@aziontech/webkit/field-password'
  import { ref } from 'vue'

  const password = ref('')
  const localized = ref('')

  const requirements = [
    ...DEFAULT_PASSWORD_REQUIREMENTS.filter((rule) => rule.key !== 'special'),
    { key: 'no-spaces', label: 'No spaces', test: (value) => !/\s/.test(value) }
  ]

  const localizedRequirements = [
    { key: 'length', label: '8-128 caracteres', test: /^.{8,128}$/ },
    { key: 'uppercase', label: 'Letra maiúscula', test: /[A-Z]/ },
    { key: 'number', label: 'Número', test: /\d/ }
  ]
</script>

<template>
  <div class="flex flex-col gap-6 w-[320px]">
    <FieldPassword
      v-model="password"
      label="Built-ins minus one, plus our own"
      placeholder="Type your password"
      autocomplete="new-password"
      :requirements="requirements"
    />
    <FieldPassword
      v-model="localized"
      label="Localized set"
      placeholder="Digite sua senha"
      autocomplete="new-password"
      requirements-title="Deve conter:"
      :requirements="localizedRequirements"
    />
  </div>
</template>
