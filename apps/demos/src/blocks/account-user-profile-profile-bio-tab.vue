<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import LanguageSelect from '@aziontech/webkit/language-select'
  import PhoneInput from '@aziontech/webkit/phone-input'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import Textarea from '@aziontech/webkit/textarea'
  import { computed } from 'vue'

  import { TIMEZONE_OPTIONS, type UserProfileData } from './account-user-profile.user-profile-model'
  import ProfileSelect from './account-user-profile-profile-select.vue'

  const form = defineModel<UserProfileData>('form', { required: true })

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
            <Input
              v-model="form.firstName"
              size="large"
              class="w-full"
              aria-label="First name"
              autocomplete="given-name"
            />
          </SettingsRow>
          <SettingsRow title="Last name">
            <Input
              v-model="form.lastName"
              size="large"
              class="w-full"
              aria-label="Last name"
              autocomplete="family-name"
            />
          </SettingsRow>
          <SettingsRow
            title="Handle"
            description="Used for mentions and in your profile link."
          >
            <Input
              v-model="form.handle"
              size="large"
              class="w-full"
              aria-label="Handle"
            />
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
            <Input
              v-model="form.email"
              type="email"
              size="large"
              class="w-full"
              aria-label="Email"
              autocomplete="email"
            />
          </SettingsRow>
          <SettingsRow
            title="Phone number"
            description="With the country code."
          >
            <PhoneInput
              v-model="form.phoneDigits"
              v-model:country="form.phoneCountry"
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
              autocomplete="url"
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
