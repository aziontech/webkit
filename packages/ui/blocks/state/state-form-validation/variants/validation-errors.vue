<script setup lang="ts">
  import StateFormValidation from '../state-form-validation.vue'
</script>

<template>
  <StateFormValidation
    :default-values="{ key: 'api token' }"
    default-submitted
  />
</template>
