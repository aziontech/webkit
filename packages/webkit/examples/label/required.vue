<script setup>
  import Input from '@aziontech/webkit/input'
  import Label from '@aziontech/webkit/label'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <div class="flex w-full max-w-(--container-xs) flex-col gap-(--spacing-xs)">
    <Label
      for="label-required-field"
      label="Label"
      required
    />
    <Input
      id="label-required-field"
      v-model="value"
    />
  </div>
</template>
