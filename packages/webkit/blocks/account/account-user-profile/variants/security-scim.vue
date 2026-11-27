<script setup lang="ts">
  import AccountUserProfile from '../account-user-profile.vue'
  import { sampleSecurityPolicy } from '../sample'
  import type { UserProfileSecurityPolicy } from '../user-profile-model'

  const securityPolicy: UserProfileSecurityPolicy = {
    ...sampleSecurityPolicy,
    ssoManaged: true,
    ssoProvider: 'Okta',
    mfaEnabled: true,
    mfaEnforced: true
  }
</script>

<template>
  <AccountUserProfile
    active-tab="security"
    :security-policy="securityPolicy"
  />
</template>
