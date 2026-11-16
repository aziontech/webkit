<script setup lang="ts">
  import OnboardingForm from '../onboarding-form.vue'
</script>

<template>
  <OnboardingForm
    :step="2"
    :default-values="{ fullName: 'Jane Doe', organizationName: 'Acme Inc.', plan: 'free' }"
  />
</template>
