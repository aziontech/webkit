<script setup>
  import Input from '@aziontech/webkit/input'
  import Label from '@aziontech/webkit/label'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <div class="flex w-full max-w-(--container-xs) flex-col gap-(--spacing-xs)">
    <Label
      for="label-default-field"
      label="Label"
    />
    <Input
      id="label-default-field"
      v-model="value"
    />
  </div>
</template>
