<script setup>
  import FieldPassword from '@aziontech/webkit/field-password'
  import { ref } from 'vue'

  const withToggle = ref('hunter2')
  const withoutToggle = ref('hunter2')
</script>

<template>
  <div class="flex flex-col gap-6 w-[320px]">
    <FieldPassword
      label="With toggle (default)"
      placeholder="Enter your password"
      helper-text="Click the eye icon to reveal the value."
      :toggleable="true"
      :model-value="withToggle"
      @update:model-value="(v) => (withToggle = v)"
    />
    <FieldPassword
      label="Without toggle"
      placeholder="Enter your password"
      helper-text="Plain password field, no visibility toggle."
      :toggleable="false"
      :model-value="withoutToggle"
      @update:model-value="(v) => (withoutToggle = v)"
    />
  </div>
</template>
