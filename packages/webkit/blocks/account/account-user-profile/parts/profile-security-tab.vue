<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import FieldError from '@aziontech/webkit/field-error'
  import Item from '@aziontech/webkit/item'
  import PasswordInput from '@aziontech/webkit/password-input'
  import { DEFAULT_PASSWORD_REQUIREMENTS } from '@aziontech/webkit/password-requirements'
  import PasswordRequirements from '@aziontech/webkit/password-requirements-root'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import Timestamp from '@aziontech/webkit/timestamp'
  import { computed, ref, useId, watch } from 'vue'

  import type {
    UserProfilePasswordChange,
    UserProfileSecurityForm,
    UserProfileSecurityPolicy
  } from '../user-profile-model'

  export interface ProfileSecurityTabProps {
    /** The security state and the organization's policy. */
    policy: UserProfileSecurityPolicy
  }

  const props = defineProps<ProfileSecurityTabProps>()

  const form = defineModel<UserProfileSecurityForm>('form', { required: true })

  const emit = defineEmits<{
    'manage-tokens': [event: MouseEvent]
    'change-password': [event: MouseEvent, change: UserProfilePasswordChange]
    'mfa-change': [enabled: boolean]
  }>()

  const currentErrorId = useId()
  const newErrorId = useId()
  const confirmErrorId = useId()

  const submitted = ref(false)
  const confirmingMfaOff = ref(false)

  const currentError = computed(() =>
    submitted.value && !form.value.currentPassword ? 'Enter your current password.' : ''
  )
  const newError = computed(() =>
    submitted.value &&
    !DEFAULT_PASSWORD_REQUIREMENTS.every((rule) => rule.test.test(form.value.newPassword))
      ? 'Meet every requirement above.'
      : ''
  )
  const confirmError = computed(() =>
    submitted.value && form.value.confirmPassword !== form.value.newPassword
      ? "The passwords don't match."
      : ''
  )

  const mfaOn = ref(props.policy.mfaEnabled)
  watch(
    () => props.policy.mfaEnabled,
    (enabled) => {
      mfaOn.value = enabled
    }
  )

  const mfaEnabled = computed({
    get: () => mfaOn.value,
    set: (enabled: boolean) => {
      if (enabled) setMfa(true)
      else confirmingMfaOff.value = true
    }
  })

  function setMfa(enabled: boolean) {
    mfaOn.value = enabled
    confirmingMfaOff.value = false
    emit('mfa-change', enabled)
  }

  function changePassword(event: MouseEvent) {
    submitted.value = true
    if (currentError.value || newError.value || confirmError.value) return
    emit('change-password', event, {
      currentPassword: form.value.currentPassword,
      newPassword: form.value.newPassword
    })
    form.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    submitted.value = false
  }
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
              <div class="flex w-full flex-col gap-(--spacing-2xs)">
                <PasswordInput
                  v-model="form.currentPassword"
                  autocomplete="current-password"
                  :disabled="policy.ssoManaged"
                  :invalid="Boolean(currentError)"
                  :aria-describedby="currentError ? currentErrorId : undefined"
                  aria-label="Current password"
                />
                <FieldError
                  v-if="currentError"
                  :id="currentErrorId"
                  >{{ currentError }}</FieldError
                >
              </div>
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
                  :invalid="Boolean(newError)"
                  :aria-describedby="newError ? newErrorId : undefined"
                  aria-label="New password"
                />
                <PasswordRequirements
                  v-if="!policy.ssoManaged"
                  :value="form.newPassword"
                />
                <FieldError
                  v-if="newError"
                  :id="newErrorId"
                  >{{ newError }}</FieldError
                >
              </div>
            </SettingsRow>
            <SettingsRow title="Confirm new password">
              <div class="flex w-full flex-col gap-(--spacing-2xs)">
                <PasswordInput
                  v-model="form.confirmPassword"
                  autocomplete="new-password"
                  :disabled="policy.ssoManaged"
                  :invalid="Boolean(confirmError)"
                  :aria-describedby="confirmError ? confirmErrorId : undefined"
                  aria-label="Confirm new password"
                />
                <FieldError
                  v-if="confirmError"
                  :id="confirmErrorId"
                  >{{ confirmError }}</FieldError
                >
              </div>
            </SettingsRow>
          </Item.List>
        </Card>
        <div
          v-if="!policy.ssoManaged"
          class="flex justify-end"
        >
          <Button
            type="button"
            label="Change password"
            variant="secondary"
            size="medium"
            @click="changePassword"
          />
        </div>
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
              v-model="mfaEnabled"
              :disabled="policy.mfaEnforced"
              aria-label="Multi-factor authentication"
            />
            <ConfirmDialog
              v-model:open="confirmingMfaOff"
              title="Turn off multi-factor authentication?"
              description="You'll sign in with your password alone, and anyone who learns it can get into your account."
              confirm-label="Turn off"
              @confirm="setMfa(false)"
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
