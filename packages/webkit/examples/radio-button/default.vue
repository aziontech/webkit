<script setup>
  import RadioButton from '@aziontech/webkit/radio-button'
  import { ref } from 'vue'

  const selected = ref('')
</script>

<template>
  <RadioButton
    v-model="selected"
    name="webkit-radio"
    value="a"
    input-id="webkit-radio-a"
    aria-label="Option A"
  />
</template>
