<script setup>
  import Checkbox from '@aziontech/webkit/checkbox'
  import { ref } from 'vue'

  const checked = ref(false)
</script>

<template>
  <Checkbox
    v-model="checked"
    binary
    input-id="webkit-checkbox"
    aria-label="Toggle option"
  />
</template>
