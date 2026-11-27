<script setup lang="ts">
  import { toast } from '@aziontech/ui/toast'
  import { ref } from 'vue'

  import {
    sampleNotifications,
    samplePreferences,
    sampleProfile,
    sampleSecurityPolicy
  } from '../blocks/account-user-profile.sample'
  import type {
    UserProfileData,
    UserProfileNotificationSettings,
    UserProfilePreferences,
    UserProfileSavePayload,
    UserProfileSecurityPolicy,
    UserProfileTab
  } from '../blocks/account-user-profile.user-profile-model'
  import AccountUserProfile from '../blocks/account-user-profile.vue'
  import { account } from '../lib/navigation'
  import { settings } from '../lib/settings'

  const [firstName = '', ...rest] = account.name.split(' ')
  const handle = account.email.split('@')[0] ?? ''
  const profile = ref<UserProfileData>({
    ...sampleProfile,
    firstName,
    lastName: rest.join(' '),
    handle,
    email: account.email,
    alternateEmails: [account.email, 'ops@example.com']
  })
  const notifications = ref<UserProfileNotificationSettings>({ ...sampleNotifications })
  const preferences = ref<UserProfilePreferences>({ ...samplePreferences, theme: settings.theme })
  const securityPolicy = ref<UserProfileSecurityPolicy>({ ...sampleSecurityPolicy })
  const activeTab = ref<UserProfileTab>('overview')

  const onSave = (payload: UserProfileSavePayload) => {
    profile.value = { ...payload.profile }
    notifications.value = { ...payload.notifications }
    preferences.value = { ...payload.preferences }
    settings.theme = payload.preferences.theme
    account.name = `${payload.profile.firstName} ${payload.profile.lastName}`.trim()
    account.email = payload.profile.email.trim()
    toast.success('Your profile was saved.', { closable: true })
  }

  const onChangePassword = () => {
    toast.success('Your password was changed.', { closable: true })
  }

  const onMfaChange = (enabled: boolean) => {
    securityPolicy.value = { ...securityPolicy.value, mfaEnabled: enabled }
    toast.success(
      enabled ? 'Multi-factor authentication is on.' : 'Multi-factor authentication is off.',
      { closable: true }
    )
  }
</script>

<template>
  <AccountUserProfile
    v-model:active-tab="activeTab"
    :profile="profile"
    :notifications="notifications"
    :preferences="preferences"
    :security-policy="securityPolicy"
    @save="onSave"
    @change-password="onChangePassword"
    @mfa-change="onMfaChange"
  />
</template>
