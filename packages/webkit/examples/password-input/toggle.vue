<script setup>
  import PasswordInput from '@aziontech/webkit/password-input'
  import { ref } from 'vue'

  const withToggle = ref('')
  const withoutToggle = ref('')
</script>

<template>
  <div class="flex flex-col items-stretch gap-4 w-[280px]">
    <PasswordInput
      v-model="withToggle"
      :toggleable="true"
      placeholder="Toggleable (default)"
    />
    <PasswordInput
      v-model="withoutToggle"
      :toggleable="false"
      placeholder="No toggle"
    />
  </div>
</template>
