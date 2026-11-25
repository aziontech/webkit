<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import PasswordInput from '@aziontech/webkit/password-input'
  import PasswordRequirements from '@aziontech/webkit/password-requirements-root'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import Timestamp from '@aziontech/webkit/timestamp'

  import type { UserProfileSecurityForm, UserProfileSecurityPolicy } from '../user-profile-model'

  export interface ProfileSecurityTabProps {
    /** The security state and the organization's policy. */
    policy: UserProfileSecurityPolicy
  }

  defineProps<ProfileSecurityTabProps>()

  const form = defineModel<UserProfileSecurityForm>('form', { required: true })

  const emit = defineEmits<{
    'manage-tokens': [event: MouseEvent]
  }>()
</script>

<template>
  <div class="flex flex-col">
    <SettingsGroup
      label="Password"
      :hint="
        policy.ssoManaged
          ? 'Your organization signs you in through its identity provider.'
          : 'Change the password you sign in to the Azion console with.'
      "
      anchor="password"
    >
      <div class="flex flex-col gap-(--layout-group-gap)">
        <Alert
          v-if="policy.ssoManaged"
          severity="info"
          :title="`Managed by ${policy.ssoProvider}`"
          label="Your password is set and reset in your organization's identity provider (SSO and SCIM), so it can't be changed here."
        />
        <Card :padded="false">
          <Item.List>
            <SettingsRow title="Current password">
              <PasswordInput
                v-model="form.currentPassword"
                autocomplete="current-password"
                :disabled="policy.ssoManaged"
                aria-label="Current password"
              />
            </SettingsRow>
            <SettingsRow
              title="New password"
              description="Use one you don't use anywhere else."
            >
              <div class="flex w-full flex-col gap-(--spacing-xs)">
                <PasswordInput
                  v-model="form.newPassword"
                  autocomplete="new-password"
                  :disabled="policy.ssoManaged"
                  aria-label="New password"
                />
                <PasswordRequirements
                  v-if="!policy.ssoManaged"
                  :value="form.newPassword"
                />
              </div>
            </SettingsRow>
            <SettingsRow title="Confirm new password">
              <PasswordInput
                v-model="form.confirmPassword"
                autocomplete="new-password"
                :disabled="policy.ssoManaged"
                aria-label="Confirm new password"
              />
            </SettingsRow>
          </Item.List>
        </Card>
      </div>
    </SettingsGroup>

    <SettingsGroup
      label="Sign-in and access"
      hint="Protect how you sign in and how tools reach your account."
      anchor="access"
    >
      <Card :padded="false">
        <Item.List>
          <SettingsRow
            title="Multi-factor authentication"
            :description="
              policy.mfaEnforced
                ? 'Your organization requires it, so it stays on.'
                : 'Ask for a code from an authenticator app every time you sign in.'
            "
            variant="compact"
          >
            <template #title>
              <span class="flex flex-wrap items-center gap-(--spacing-xs)">
                <span>Multi-factor authentication</span>
                <Tag
                  v-if="policy.mfaEnforced"
                  label="Required by your organization"
                  severity="warning"
                />
              </span>
            </template>
            <Switch
              v-model="form.mfaEnabled"
              :disabled="policy.mfaEnforced"
              aria-label="Multi-factor authentication"
            />
          </SettingsRow>
          <SettingsRow
            title="Personal tokens"
            variant="compact"
          >
            <template #description>
              {{ policy.activeTokensCount }} active. Last used
              <Timestamp :value="policy.lastTokenUsedAt" />
              from {{ policy.lastTokenClient }}.
            </template>
            <Button
              type="button"
              label="Manage tokens"
              variant="outline"
              size="small"
              @click="emit('manage-tokens', $event)"
            />
          </SettingsRow>
        </Item.List>
      </Card>
    </SettingsGroup>
  </div>
</template>
