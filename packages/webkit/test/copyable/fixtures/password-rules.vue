<script setup lang="ts">
  import PasswordRequirements, {
    DEFAULT_PASSWORD_REQUIREMENTS,
    type PasswordRequirement
  } from '@aziontech/webkit/password-requirements'
  import { computed, ref } from 'vue'

  const password = ref<string>('')
  const valid = computed(() =>
    DEFAULT_PASSWORD_REQUIREMENTS.every((rule) => rule.test.test(password.value))
  )
  const keys = DEFAULT_PASSWORD_REQUIREMENTS.map((rule) => rule.key.toUpperCase())
  const custom: PasswordRequirement[] = [
    ...DEFAULT_PASSWORD_REQUIREMENTS,
    { label: 'No spaces', test: (value) => !value.includes(' ') }
  ]
</script>

<template>
  <PasswordRequirements
    :value="password"
    :requirements="custom"
    :data-valid="valid"
    :data-keys="keys.join(',')"
  />
</template>
