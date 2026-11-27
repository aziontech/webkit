<script setup lang="ts">
  import AccountUserProfile from '../account-user-profile.vue'
  import { sampleProfile } from '../sample'
  import type { UserProfileData, UserProfileYearActivity } from '../user-profile-model'

  const profile: UserProfileData = { ...sampleProfile, memberSince: '2026' }

  const years: UserProfileYearActivity[] = [
    {
      year: 2026,
      totalContributions: 0,
      contributionsDelta: 0,
      deployments: 0,
      copilotTasks: 0,
      longestStreakDays: 0,
      currentStreakDays: 0,
      items: [],
      months: []
    }
  ]
</script>

<template>
  <AccountUserProfile
    :profile="profile"
    :years="years"
  />
</template>
