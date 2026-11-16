<script setup lang="ts">
  import FormValidation from '../form-validation.vue'
  import { sampleValues } from '../sample'
</script>

<template>
  <FormValidation
    :default-values="{ ...sampleValues, key: 'API_TOKEN' }"
    default-submitted
    taken-key="API_TOKEN"
  />
</template>
