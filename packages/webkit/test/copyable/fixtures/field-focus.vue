<script setup lang="ts">
  import Input from '@aziontech/webkit/input'
  import PasswordInput from '@aziontech/webkit/password-input'
  import Textarea from '@aziontech/webkit/textarea'
  import { onMounted, ref } from 'vue'

  const name = ref<string>('')
  const notes = ref<string>('')
  const secret = ref<string>('')
  const nameField = ref<InstanceType<typeof Input> | null>(null)
  const notesField = ref<InstanceType<typeof Textarea> | null>(null)
  const secretField = ref<InstanceType<typeof PasswordInput> | null>(null)

  onMounted(() => {
    nameField.value?.focus()
    notesField.value?.focus()
    secretField.value?.focus()
    // @ts-expect-error only focus is exposed
    nameField.value?.select()
  })
</script>

<template>
  <Input
    ref="nameField"
    v-model="name"
    aria-label="Name"
  />
  <Textarea
    ref="notesField"
    v-model="notes"
    aria-label="Notes"
  />
  <PasswordInput
    ref="secretField"
    v-model="secret"
    aria-label="Password"
  />
</template>
