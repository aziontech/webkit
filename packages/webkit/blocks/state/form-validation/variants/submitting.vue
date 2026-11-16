<script setup lang="ts">
  import FormValidation from '../form-validation.vue'
  import { sampleValues } from '../sample'
</script>

<template>
  <FormValidation
    :default-values="sampleValues"
    default-submitted
    submitting
  />
</template>
