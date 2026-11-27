<script setup lang="ts">
  import AccountOnboardingForm from '../account-onboarding-form.vue'
</script>

<template>
  <AccountOnboardingForm
    :step="1"
    :default-values="{ fullName: 'Jane Doe', organizationName: 'Acme Inc.' }"
  />
</template>
