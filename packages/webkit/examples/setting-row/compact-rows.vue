<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import SettingRow from '@aziontech/webkit/setting-row'
  import Switch from '@aziontech/webkit/switch'
  import { reactive } from 'vue'

  const form = reactive({ allowSocialLogin: true, enforceMfa: false })
</script>

<template>
  <Card :padded="false">
    <template #content>
      <Item.List>
        <SettingRow
          title="Allow social login"
          description="Users linked to the account can log in with their social network credentials."
          kind="compact"
        >
          <Switch
            v-model="form.allowSocialLogin"
            aria-label="Allow social login"
          />
        </SettingRow>
        <SettingRow
          title="Enforce multi-factor authentication"
          description="MFA is required on login for every user linked to this account."
          kind="compact"
        >
          <Switch
            v-model="form.enforceMfa"
            aria-label="Enforce multi-factor authentication"
          />
        </SettingRow>
        <SettingRow
          title="Authenticator devices"
          description="Manage the devices and recovery codes registered for this account."
          kind="compact"
        >
          <Button
            type="button"
            label="Manage"
            kind="outlined"
            size="medium"
          />
        </SettingRow>
      </Item.List>
    </template>
  </Card>
</template>
