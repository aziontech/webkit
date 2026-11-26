<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import Link from '@aziontech/webkit/link'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { computed } from 'vue'

  import {
    TIMEZONE_OPTIONS,
    type UserProfileData,
    type UserProfileSecurityPolicy,
    type UserProfileTab
  } from './account-user-profile.user-profile-model'

  export interface ProfileAboutProps {
    /** The saved profile. */
    profile: UserProfileData
    /** The security state and the organization's policy. */
    policy: UserProfileSecurityPolicy
    /** The profile is loading. */
    loading: boolean
  }

  const props = defineProps<ProfileAboutProps>()

  const emit = defineEmits<{ 'open-tab': [event: MouseEvent, tab: UserProfileTab] }>()

  const timezone = computed(
    () =>
      TIMEZONE_OPTIONS.find((option) => option.value === props.profile.timezone)?.label ??
      props.profile.timezone
  )
  const website = computed(() => props.profile.websiteUrl.replace(/^https?:\/\//, ''))
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <KeyValueList
      aria-label="About"
      :loading="loading"
    >
      <KeyValueList.Item
        v-if="profile.location"
        label="Location"
        >{{ profile.location }}</KeyValueList.Item
      >
      <KeyValueList.Item label="Time zone">{{ timezone }}</KeyValueList.Item>
      <KeyValueList.Item label="Email">{{ profile.email }}</KeyValueList.Item>
      <KeyValueList.Item
        v-if="profile.websiteUrl"
        label="Website"
      >
        <Link
          :href="profile.websiteUrl"
          :label="website"
          target="_blank"
          inline
        />
      </KeyValueList.Item>
      <KeyValueList.Item
        v-if="profile.memberSince"
        label="On Azion since"
        >{{ profile.memberSince }}</KeyValueList.Item
      >
    </KeyValueList>
    <KeyValueList
      aria-label="Sign-in security"
      :loading="loading"
    >
      <KeyValueList.Item label="Sign-in">
        {{ policy.ssoManaged ? `Single sign-on with ${policy.ssoProvider}` : 'Password' }}
      </KeyValueList.Item>
      <KeyValueList.Item label="Multi-factor authentication">
        <StatusIndicator
          :severity="policy.mfaEnabled ? 'success' : 'warning'"
          :label="policy.mfaEnabled ? 'On' : 'Off'"
        />
      </KeyValueList.Item>
    </KeyValueList>
    <div>
      <Button
        type="button"
        label="Review security"
        variant="outline"
        size="medium"
        @click="emit('open-tab', $event, 'security')"
      />
    </div>
  </div>
</template>
