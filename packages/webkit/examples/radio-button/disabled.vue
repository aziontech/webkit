<script setup>
  import RadioButton from '@aziontech/webkit/radio-button'
  import { ref } from 'vue'

  const selected = ref('a')
</script>

<template>
  <fieldset class="flex items-center gap-(--spacing-4) border-0 p-0 m-0">
    <RadioButton
      v-model="selected"
      name="webkit-radio-disabled"
      value="a"
      disabled
      input-id="webkit-radio-disabled-a"
      aria-label="Disabled selected"
    />
    <RadioButton
      v-model="selected"
      name="webkit-radio-disabled"
      value="b"
      disabled
      input-id="webkit-radio-disabled-b"
      aria-label="Disabled unselected"
    />
  </fieldset>
</template>
