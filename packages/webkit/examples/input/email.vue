<script setup>
  import Input from '@aziontech/webkit/input'
  import Button from '@aziontech/webkit/button'
  import { ref } from 'vue'

  const value = ref('')
  const invalid = ref(false)

  const onUpdate = (next) => {
    value.value = next
    if (invalid.value) invalid.value = false
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const validate = () => {
    invalid.value = !EMAIL_RE.test(value.value.trim())
  }
</script>

<template>
  <div class="flex items-start gap-2 w-[320px]">
    <Input
      type="email"
      autocomplete="email"
      :spellcheck="false"
      placeholder="you@example.com"
      :model-value="value"
      :invalid="invalid"
      @update:model-value="onUpdate"
    />
    <Button
      label="Submit"
      size="medium"
      @click="validate"
    />
  </div>
</template>
