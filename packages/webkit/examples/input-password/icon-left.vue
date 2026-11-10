<script setup>
  import InputPassword from '@aziontech/webkit/input-password'
  import { ref } from 'vue'

  const password = ref('')
</script>

<template>
  <div class="flex flex-col items-stretch gap-4 w-[280px]">
    <InputPassword
      v-model="password"
      placeholder="Enter your password"
    >
      <template #iconLeft>
        <i class="pi pi-lock" />
      </template>
    </InputPassword>
  </div>
</template>
