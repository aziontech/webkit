<script setup>
  import Button from '@aziontech/webkit/button'
  import FieldPassword from '@aziontech/webkit/field-password'
  import { ref } from 'vue'

  const value = ref('')
  const missing = ref(false)
  const loading = ref(false)

  const onSubmit = () => {
    if (loading.value) return
    missing.value = false
    loading.value = true
    setTimeout(() => {
      loading.value = false
      missing.value = !value.value
    }, 1200)
  }

  const onUpdate = (next) => {
    value.value = next
    if (next) missing.value = false
  }
</script>

<template>
  <div class="flex flex-col gap-4 w-[320px]">
    <FieldPassword
      label="Password"
      placeholder="Enter your password"
      autocomplete="new-password"
      :model-value="value"
      @update:model-value="onUpdate"
      :required="missing"
      :disabled="loading"
      :helper-text="missing ? 'This field is required.' : 'At least 8 characters.'"
    />
    <Button
      label="Submit"
      size="medium"
      :loading="loading"
      @click="onSubmit"
    />
  </div>
</template>
