<script setup>
  import Checkbox from '@aziontech/webkit/checkbox'
  import { ref } from 'vue'

  const checked = ref(true)
  const unchecked = ref(false)
</script>

<template>
  <div class="flex items-center gap-(--spacing-4)">
    <Checkbox
      v-model="checked"
      binary
      disabled
      input-id="webkit-checkbox-disabled-on"
      aria-label="Disabled checked"
    />
    <Checkbox
      v-model="unchecked"
      binary
      disabled
      input-id="webkit-checkbox-disabled-off"
      aria-label="Disabled unchecked"
    />
  </div>
</template>
