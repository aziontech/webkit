<script setup>
  import Textarea from '@aziontech/webkit/textarea'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <Textarea
    v-model="value"
    placeholder="Write your message"
  />
</template>
