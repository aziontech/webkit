<script setup>
  import PasswordInput from '@aziontech/webkit/password-input'
  import { ref } from 'vue'

  const token = ref('azn_7Kq0lO1Il9xR4vT2mW8pZ3')
</script>

<template>
  <div class="flex w-full max-w-(--container-xs) flex-col gap-(--spacing-xs)">
    <label
      for="password-input-monospace-token"
      class="text-label-sm text-(--text-default)"
    >
      Personal token
    </label>
    <PasswordInput
      id="password-input-monospace-token"
      v-model="token"
      autocomplete="off"
      :spellcheck="false"
      monospace
    />
  </div>
</template>
