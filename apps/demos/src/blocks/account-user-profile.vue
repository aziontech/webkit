<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Kbd from '@aziontech/webkit/kbd'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Tabs from '@aziontech/webkit/tabs'
  import { computed, ref, watch } from 'vue'

  import {
    sampleNotifications,
    samplePreferences,
    sampleProfile,
    sampleSecurityPolicy,
    sampleYears
  } from './account-user-profile.sample'
  import type {
    UserProfileData,
    UserProfileNotificationSettings,
    UserProfilePreferences,
    UserProfileSavePayload,
    UserProfileSecurityForm,
    UserProfileSecurityPolicy,
    UserProfileTab,
    UserProfileYearActivity
  } from './account-user-profile.user-profile-model'
  import ProfileBioTab from './account-user-profile-profile-bio-tab.vue'
  import ProfileHeader from './account-user-profile-profile-header.vue'
  import ProfileNotificationsTab from './account-user-profile-profile-notifications-tab.vue'
  import ProfileOverview from './account-user-profile-profile-overview.vue'
  import ProfilePreferencesTab from './account-user-profile-profile-preferences-tab.vue'
  import ProfileSecurityTab from './account-user-profile-profile-security-tab.vue'

  export interface UserProfileProps {
    /** Identity, contact and visibility data. Left out, the sample profile renders. */
    profile?: UserProfileData
    /** Every year of activity, newest first. Left out, the sample years render. */
    years?: UserProfileYearActivity[]
    /** Security state and the organization's SSO, SCIM and multi-factor policy. */
    securityPolicy?: UserProfileSecurityPolicy
    /** Notification routing, digests and alerts. */
    notifications?: UserProfileNotificationSettings
    /** Theme and keyboard shortcut preferences. */
    preferences?: UserProfilePreferences
    /** The profile is loading. */
    loading?: boolean
    /** Load failure; replaces the page with a danger Alert and Retry. */
    error?: string
  }

  const props = withDefaults(defineProps<UserProfileProps>(), {
    profile: () => sampleProfile,
    years: undefined,
    securityPolicy: () => sampleSecurityPolicy,
    notifications: () => sampleNotifications,
    preferences: () => samplePreferences,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    save: [payload: UserProfileSavePayload]
    retry: [event: MouseEvent]
    'upload-avatar': [event: MouseEvent]
    'remove-avatar': [event: MouseEvent]
    'manage-tokens': [event: MouseEvent]
    'view-watched': [event: MouseEvent]
  }>()

  const activeTab = defineModel<UserProfileTab>('activeTab', { default: 'overview' })
  const selectedYear = defineModel<number>('selectedYear', { default: 2026 })

  const years = computed(() => props.years ?? (props.loading ? [] : sampleYears))

  const securityBaseline = (): UserProfileSecurityForm => ({
    mfaEnabled: props.securityPolicy.mfaEnabled,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const profileForm = ref<UserProfileData>({ ...props.profile })
  const notificationForm = ref<UserProfileNotificationSettings>({ ...props.notifications })
  const preferencesForm = ref<UserProfilePreferences>({ ...props.preferences })
  const securityForm = ref<UserProfileSecurityForm>(securityBaseline())

  const snapshot = (): UserProfileSavePayload => ({
    profile: { ...profileForm.value },
    notifications: { ...notificationForm.value },
    preferences: { ...preferencesForm.value },
    security: { ...securityForm.value }
  })

  const dirty = computed(
    () =>
      JSON.stringify(snapshot()) !==
      JSON.stringify({
        profile: props.profile,
        notifications: props.notifications,
        preferences: props.preferences,
        security: securityBaseline()
      })
  )

  function discard() {
    profileForm.value = { ...props.profile }
    notificationForm.value = { ...props.notifications }
    preferencesForm.value = { ...props.preferences }
    securityForm.value = securityBaseline()
  }

  watch(
    () => [props.profile, props.notifications, props.preferences, props.securityPolicy],
    discard
  )

  function save() {
    emit('save', snapshot())
  }
</script>

<template>
  <Alert
    v-if="error && !loading"
    severity="danger"
    title="Your profile didn't load"
    :label="error"
    action-label="Retry"
    @action="emit('retry', $event)"
  />
  <div
    v-else
    class="flex w-full flex-col gap-(--layout-group-gap)"
  >
    <ProfileHeader
      :profile="profile"
      :loading="loading"
      @edit="activeTab = 'profile'"
    />

    <PageTabs v-model="activeTab">
      <Tabs.Trigger
        value="overview"
        label="Overview"
      />
      <Tabs.Trigger
        value="profile"
        label="Profile and bio"
      />
      <Tabs.Trigger
        value="security"
        label="Security and access"
      />
      <Tabs.Trigger
        value="notifications"
        label="Notifications"
      />
      <Tabs.Trigger
        value="preferences"
        label="Preferences"
      />
    </PageTabs>

    <ProfileOverview
      v-if="activeTab === 'overview'"
      v-model:selected-year="selectedYear"
      :years="years"
      :loading="loading"
    />
    <ProfileBioTab
      v-else-if="activeTab === 'profile'"
      v-model:form="profileForm"
      @upload-avatar="emit('upload-avatar', $event)"
      @remove-avatar="emit('remove-avatar', $event)"
    />
    <ProfileSecurityTab
      v-else-if="activeTab === 'security'"
      v-model:form="securityForm"
      :policy="securityPolicy"
      @manage-tokens="emit('manage-tokens', $event)"
    />
    <ProfileNotificationsTab
      v-else-if="activeTab === 'notifications'"
      v-model:form="notificationForm"
      :emails="profile.alternateEmails"
      @view-watched="emit('view-watched', $event)"
    />
    <ProfilePreferencesTab
      v-else
      v-model:form="preferencesForm"
    />

    <SaveBar
      v-if="dirty"
      @save="save"
    >
      You have unsaved changes.
      <template #actions>
        <Button
          type="button"
          label="Discard"
          variant="outline"
          size="medium"
          @click="discard"
        />
        <Button
          type="button"
          variant="primary"
          size="medium"
          :aria-keyshortcuts="preferencesForm.keyboardShortcuts ? 'Meta+S Control+S' : undefined"
          @click="save"
        >
          Save changes
          <span
            v-if="preferencesForm.keyboardShortcuts"
            class="inline-flex pointer-coarse:hidden"
          >
            <Kbd
              meta
              size="small"
              aria-hidden="true"
              >S</Kbd
            >
          </span>
        </Button>
      </template>
    </SaveBar>
  </div>
</template>
