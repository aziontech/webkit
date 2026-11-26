<script setup>
  import Button from '@aziontech/webkit/button'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
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
  <Field
    :invalid="invalid"
    class="w-full max-w-80"
  >
    <Field.Label>Email</Field.Label>
    <div class="flex items-start gap-(--spacing-xs)">
      <Input
        type="email"
        autocomplete="email"
        :spellcheck="false"
        placeholder="you@example.com"
        :model-value="value"
        @update:model-value="onUpdate"
      />
      <Button
        label="Submit"
        size="medium"
        @click="validate"
      />
    </div>
    <Field.Error v-if="invalid">Enter an email address like you@example.com.</Field.Error>
  </Field>
</template>
