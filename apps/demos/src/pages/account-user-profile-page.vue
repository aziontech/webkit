<script setup lang="ts">
  import { toast } from '@aziontech/webkit/toast'
  import { ref } from 'vue'

  import { sampleProfile } from '../blocks/account-user-profile.sample'
  import type {
    UserProfileData,
    UserProfileSavePayload,
    UserProfileTab
  } from '../blocks/account-user-profile.user-profile-model'
  import AccountUserProfile from '../blocks/account-user-profile.vue'
  import { account } from '../lib/navigation'

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
  const activeTab = ref<UserProfileTab>('overview')

  const onSave = (payload: UserProfileSavePayload) => {
    profile.value = { ...payload.profile }
    account.name = `${payload.profile.firstName} ${payload.profile.lastName}`.trim()
    account.email = payload.profile.email.trim()
    toast.success('Your profile was saved.', { closable: true })
  }
</script>

<template>
  <AccountUserProfile
    v-model:active-tab="activeTab"
    :profile="profile"
    @save="onSave"
  />
</template>
