<script setup>
  import FieldPassword from '@aziontech/webkit/field-password'
  import { ref } from 'vue'

  const password = ref('')
  const partial = ref('Abcdefgh1')
</script>

<template>
  <div class="flex flex-col gap-6 w-[320px]">
    <FieldPassword
      v-model="password"
      label="Password"
      placeholder="Type your password"
      autocomplete="new-password"
      requirements
    />
    <FieldPassword
      v-model="partial"
      label="Partially satisfied"
      placeholder="Type your password"
      autocomplete="new-password"
      requirements
    />
  </div>
</template>
