<script setup>
  import FieldTextarea from '@aziontech/webkit/field-textarea'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <FieldTextarea
    v-model="value"
    label="Message"
    placeholder="Write your message"
    helper-text="Up to 500 characters."
  />
</template>
