<script setup lang="ts">
  import Avatar from '@aziontech/ui/avatar'
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import FieldError from '@aziontech/ui/field-error'
  import Input from '@aziontech/ui/input'
  import Item from '@aziontech/ui/item'
  import LanguageSelect from '@aziontech/ui/language-select'
  import PhoneInput from '@aziontech/ui/phone-input'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import SettingsRow from '@aziontech/ui/settings-row'
  import Switch from '@aziontech/ui/switch'
  import Textarea from '@aziontech/ui/textarea'
  import { computed, useId } from 'vue'

  import {
    TIMEZONE_OPTIONS,
    type UserProfileData,
    type UserProfileFieldErrors
  } from './account-user-profile.user-profile-model'
  import ProfileSelect from './account-user-profile-profile-select.vue'

  export interface ProfileBioTabProps {
    /** The error under each field that blocks a save. */
    errors: UserProfileFieldErrors
  }

  defineProps<ProfileBioTabProps>()

  const form = defineModel<UserProfileData>('form', { required: true })

  const errorIds = {
    firstName: useId(),
    lastName: useId(),
    handle: useId(),
    email: useId()
  }

  const emit = defineEmits<{
    'upload-avatar': [event: MouseEvent]
    'remove-avatar': [event: MouseEvent]
  }>()

  const initials = computed(() =>
    `${form.value.firstName.charAt(0)}${form.value.lastName.charAt(0)}`.toUpperCase()
  )
</script>

<template>
  <div class="flex flex-col">
    <SettingsGroup
      label="Personal information"
      hint="Who you are across the Azion console: in headers, activity and team lists."
      anchor="personal-information"
    >
      <Card :padded="false">
        <Item.List>
          <SettingsRow
            title="Profile picture"
            description="A small picture next to your name. Shown at 48 pixels or less."
            variant="compact"
          >
            <div class="flex items-center gap-(--spacing-xs)">
              <Avatar
                :label="initials"
                :alt="`${form.firstName} ${form.lastName}`"
              />
              <Button
                type="button"
                label="Upload"
                variant="outline"
                size="small"
                @click="emit('upload-avatar', $event)"
              />
              <Button
                type="button"
                label="Remove"
                variant="ghost"
                size="small"
                @click="emit('remove-avatar', $event)"
              />
            </div>
          </SettingsRow>
          <SettingsRow title="First name">
            <div class="flex w-full flex-col gap-(--spacing-2xs)">
              <Input
                v-model="form.firstName"
                :invalid="Boolean(errors.firstName)"
                :aria-describedby="errors.firstName ? errorIds.firstName : undefined"
                size="large"
                class="w-full"
                aria-label="First name"
                autocomplete="off"
              />
              <FieldError
                v-if="errors.firstName"
                :id="errorIds.firstName"
                >{{ errors.firstName }}</FieldError
              >
            </div>
          </SettingsRow>
          <SettingsRow title="Last name">
            <div class="flex w-full flex-col gap-(--spacing-2xs)">
              <Input
                v-model="form.lastName"
                :invalid="Boolean(errors.lastName)"
                :aria-describedby="errors.lastName ? errorIds.lastName : undefined"
                size="large"
                class="w-full"
                aria-label="Last name"
                autocomplete="off"
              />
              <FieldError
                v-if="errors.lastName"
                :id="errorIds.lastName"
                >{{ errors.lastName }}</FieldError
              >
            </div>
          </SettingsRow>
          <SettingsRow
            title="Handle"
            description="Used for mentions and in your profile link."
          >
            <div class="flex w-full flex-col gap-(--spacing-2xs)">
              <Input
                v-model="form.handle"
                :invalid="Boolean(errors.handle)"
                :aria-describedby="errors.handle ? errorIds.handle : undefined"
                size="large"
                class="w-full"
                aria-label="Handle"
              />
              <FieldError
                v-if="errors.handle"
                :id="errorIds.handle"
                >{{ errors.handle }}</FieldError
              >
            </div>
          </SettingsRow>
          <SettingsRow
            title="Bio"
            description="A line about what you build on Azion."
            variant="stacked"
          >
            <Textarea
              v-model="form.bio"
              class="w-full"
              aria-label="Bio"
            />
          </SettingsRow>
          <SettingsRow
            title="Time zone"
            description="Times in deployments, activity and audit logs use it."
          >
            <ProfileSelect
              v-model="form.timezone"
              :options="TIMEZONE_OPTIONS"
              aria-label="Time zone"
            />
          </SettingsRow>
          <SettingsRow
            title="Show my local time"
            description="Team members see the time difference from theirs."
            variant="compact"
          >
            <Switch
              v-model="form.displayLocalTime"
              aria-label="Show my local time"
            />
          </SettingsRow>
          <SettingsRow
            title="Language"
            description="The language of the console and of the emails Azion sends you."
          >
            <LanguageSelect
              v-model="form.language"
              size="large"
              class="w-full"
              aria-label="Language"
            />
          </SettingsRow>
        </Item.List>
      </Card>
    </SettingsGroup>

    <SettingsGroup
      label="Contact and links"
      hint="How Azion and your team reach you."
      anchor="contact"
    >
      <Card :padded="false">
        <Item.List>
          <SettingsRow
            title="Email"
            description="For account recovery and notifications."
          >
            <div class="flex w-full flex-col gap-(--spacing-2xs)">
              <Input
                v-model="form.email"
                type="email"
                :invalid="Boolean(errors.email)"
                :aria-describedby="errors.email ? errorIds.email : undefined"
                size="large"
                class="w-full"
                aria-label="Email"
                autocomplete="off"
              />
              <FieldError
                v-if="errors.email"
                :id="errorIds.email"
                >{{ errors.email }}</FieldError
              >
            </div>
          </SettingsRow>
          <SettingsRow
            title="Phone number"
            description="With the country code."
          >
            <PhoneInput
              v-model="form.phoneDigits"
              v-model:country="form.phoneCountry"
              size="large"
              aria-label="Phone number"
            />
          </SettingsRow>
          <SettingsRow
            title="Website or GitHub"
            description="Shown on your profile."
          >
            <Input
              v-model="form.websiteUrl"
              inputmode="url"
              autocomplete="off"
              size="large"
              class="w-full"
              aria-label="Website or GitHub"
            />
          </SettingsRow>
        </Item.List>
      </Card>
    </SettingsGroup>

    <SettingsGroup
      label="Contributions and visibility"
      hint="What other members of your organization see."
      anchor="visibility"
    >
      <Card :padded="false">
        <Item.List>
          <SettingsRow
            title="Private profile"
            description="Hide your contribution graph and history from organization directories."
            variant="compact"
          >
            <Switch
              v-model="form.privateProfile"
              aria-label="Private profile"
            />
          </SettingsRow>
          <SettingsRow
            title="Count private contributions"
            description="Add contributions to private accounts to the graph, without the resource names."
            variant="compact"
          >
            <Switch
              v-model="form.includePrivateContributions"
              aria-label="Count private contributions"
            />
          </SettingsRow>
        </Item.List>
      </Card>
    </SettingsGroup>
  </div>
</template>
