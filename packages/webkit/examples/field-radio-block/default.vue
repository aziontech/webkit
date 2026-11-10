<script setup>
  import { ref } from 'vue'
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'

  const selected = ref('plan-a')
</script>

<template>
  <FieldRadioBlock
    v-model="selected"
    name="plan"
    value="plan-a"
    label="Standard plan"
    description="Up to 5 projects and 10 GB storage."
  />
</template>
