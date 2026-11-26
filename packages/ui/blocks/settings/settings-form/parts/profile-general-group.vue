<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import CopyButton from '@aziontech/webkit/copy-button'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'

  import type { ProfileAccountErrors, ProfileAccountForm } from '../sample'

  defineProps<{ saving: boolean }>()
  const form = defineModel<ProfileAccountForm>('form', { required: true })
  const errors = defineModel<ProfileAccountErrors>('errors', { required: true })
</script>

<template>
  <SettingsGroup
    label="General"
    hint="How this account is identified on the platform."
    anchor="general"
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            title="Account name"
            description="What this account is called across the console."
          >
            <div class="flex w-full flex-col gap-(--spacing-xs)">
              <Input
                id="profile-accountName"
                v-model="form.accountName"
                size="large"
                class="w-full"
                aria-label="Account name"
                required
                :invalid="!!errors.accountName"
                :aria-describedby="errors.accountName ? 'profile-accountName-error' : undefined"
                :disabled="saving"
                @update:model-value="errors.accountName = ''"
              />
              <FieldError
                v-if="errors.accountName"
                id="profile-accountName-error"
                >{{ errors.accountName }}</FieldError
              >
            </div>
          </SettingsRow>
          <SettingsRow
            title="Client ID"
            description="Can't be changed. Quote it when opening a support ticket about this account."
          >
            <div
              class="flex w-full min-w-0 items-center gap-(--spacing-2xs)"
              data-testid="profile-general-group__client-id"
            >
              <span
                dir="ltr"
                class="min-w-0 truncate text-label-code-md text-(--text-default)"
                >{{ form.clientId }}</span
              >
              <CopyButton
                :value="form.clientId"
                aria-label="Copy Client ID"
                size="medium"
                variant="ghost"
                class="shrink-0"
              />
            </div>
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
