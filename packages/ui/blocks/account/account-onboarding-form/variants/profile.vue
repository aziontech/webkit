<script setup lang="ts">
  import AccountOnboardingForm from '../account-onboarding-form.vue'
</script>

<template>
  <AccountOnboardingForm
    :step="2"
    :default-values="{ fullName: 'Jane Doe', organizationName: 'Acme Inc.', plan: 'free' }"
  />
</template>
