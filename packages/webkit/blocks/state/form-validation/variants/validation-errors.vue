<script setup lang="ts">
  import FormValidation from '../form-validation.vue'
</script>

<template>
  <FormValidation
    :default-values="{ key: 'api token' }"
    default-submitted
  />
</template>
