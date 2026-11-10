<script setup>
  import Checkbox from '@aziontech/webkit/checkbox'
  import { ref } from 'vue'

  const checked = ref(false)
</script>

<template>
  <Checkbox
    v-model="checked"
    binary
    indeterminate
    input-id="webkit-checkbox-indeterminate"
    aria-label="Toggle option"
  />
</template>
