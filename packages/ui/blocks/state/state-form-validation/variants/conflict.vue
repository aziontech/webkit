<script setup lang="ts">
  import { sampleValues } from '../sample'
  import StateFormValidation from '../state-form-validation.vue'
</script>

<template>
  <StateFormValidation
    :default-values="{ ...sampleValues, key: 'API_TOKEN' }"
    default-submitted
    taken-key="API_TOKEN"
  />
</template>
