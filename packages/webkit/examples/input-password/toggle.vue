<script setup>
  import InputPassword from '@aziontech/webkit/input-password'
  import { ref } from 'vue'

  const withToggle = ref('')
  const withoutToggle = ref('')
</script>

<template>
  <div class="flex flex-col items-stretch gap-4 w-[280px]">
    <InputPassword
      v-model="withToggle"
      :toggleable="true"
      placeholder="Toggleable (default)"
    />
    <InputPassword
      v-model="withoutToggle"
      :toggleable="false"
      placeholder="No toggle"
    />
  </div>
</template>
