<script setup>
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import Item from '@aziontech/ui/item'
  import SettingsRow from '@aziontech/ui/settings-row'
  import Switch from '@aziontech/ui/switch'
  import { reactive } from 'vue'

  const form = reactive({ allowSocialLogin: true, enforceMfa: false })
</script>

<template>
  <Card :padded="false">
    <template #default>
      <Item.List>
        <SettingsRow
          title="Allow social login"
          description="Users linked to the account can log in with their social network credentials."
          variant="compact"
        >
          <Switch
            v-model="form.allowSocialLogin"
            aria-label="Allow social login"
          />
        </SettingsRow>
        <SettingsRow
          title="Enforce multi-factor authentication"
          description="MFA is required on login for every user linked to this account."
          variant="compact"
        >
          <Switch
            v-model="form.enforceMfa"
            aria-label="Enforce multi-factor authentication"
          />
        </SettingsRow>
        <SettingsRow
          title="Authenticator devices"
          description="Manage the devices and recovery codes registered for this account."
          variant="compact"
        >
          <Button
            type="button"
            label="Manage"
            variant="outline"
            size="medium"
          />
        </SettingsRow>
      </Item.List>
    </template>
  </Card>
</template>
