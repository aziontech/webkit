<script setup lang="ts">
  import StateFormValidation from '../state-form-validation.vue'
</script>

<template>
  <StateFormValidation :saved="{ key: 'API_BASE_URL', environment: 'Production' }" />
</template>
