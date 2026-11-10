<script setup>
  import { ref } from 'vue'
  import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'

  const enabled = ref(false)
</script>

<template>
  <FieldSwitchBlock
    v-model="enabled"
    label="Switch label"
    description="Switch description"
  />
</template>
