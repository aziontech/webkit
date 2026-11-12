<script setup>
  import Textarea from '@aziontech/webkit/textarea'
  import { ref } from 'vue'

  const value = ref('Text Filled')
</script>

<template>
  <Textarea
    v-model="value"
    aria-label="Description"
    invalid
  />
</template>
