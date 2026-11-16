<script setup lang="ts">
  import OnboardingForm from '../onboarding-form.vue'
</script>

<template>
  <OnboardingForm
    :step="1"
    :default-values="{ fullName: 'Jane Doe', organizationName: 'Acme Inc.' }"
  />
</template>
