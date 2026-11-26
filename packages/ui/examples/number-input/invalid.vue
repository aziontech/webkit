<script setup>
  import Field from '@aziontech/ui/field'
  import NumberInput from '@aziontech/ui/number-input'
  import { ref } from 'vue'

  const value = ref(99)
</script>

<template>
  <Field
    invalid
    required
    class="w-full max-w-(--container-xs)"
  >
    <Field.Label>Instances</Field.Label>
    <NumberInput v-model="value" />
    <Field.Error>Use 10 instances or fewer on this plan.</Field.Error>
  </Field>
</template>
