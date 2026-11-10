<script setup>
  import PasswordInput from '@aziontech/webkit/password-input'
  import { ref } from 'vue'

  const password = ref('')
</script>

<template>
  <div class="flex flex-col items-stretch gap-4 w-[280px]">
    <PasswordInput
      v-model="password"
      placeholder="Enter your password"
    >
      <template #iconLeft>
        <i class="pi pi-lock" />
      </template>
    </PasswordInput>
  </div>
</template>
