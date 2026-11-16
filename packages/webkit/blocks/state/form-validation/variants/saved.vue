<script setup lang="ts">
  import FormValidation from '../form-validation.vue'
</script>

<template>
  <FormValidation :saved="{ key: 'API_BASE_URL', environment: 'Production' }" />
</template>
