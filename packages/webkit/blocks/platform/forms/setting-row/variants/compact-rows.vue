<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'
  import Switch from '@aziontech/webkit/switch'
  import { reactive } from 'vue'

  const form = reactive({ allowSocialLogin: true, enforceMfa: false })
</script>

<template>
  <CardBox :padded="false">
    <template #content>
      <Item.List>
        <Item size="small">
          <Item.Content>
            <Item.Title>Allow social login</Item.Title>
            <Item.Description
              >Users linked to the account can log in with their social network
              credentials.</Item.Description
            >
          </Item.Content>
          <Item.Actions>
            <Switch
              v-model="form.allowSocialLogin"
              aria-label="Allow social login"
            />
          </Item.Actions>
        </Item>
        <Item size="small">
          <Item.Content>
            <Item.Title>Enforce multi-factor authentication</Item.Title>
            <Item.Description
              >MFA is required on login for every user linked to this account.</Item.Description
            >
          </Item.Content>
          <Item.Actions>
            <Switch
              v-model="form.enforceMfa"
              aria-label="Enforce multi-factor authentication"
            />
          </Item.Actions>
        </Item>
        <Item size="small">
          <Item.Content>
            <Item.Title>Authenticator devices</Item.Title>
            <Item.Description
              >Manage the devices and recovery codes registered for this account.</Item.Description
            >
          </Item.Content>
          <Item.Actions>
            <Button
              type="button"
              label="Manage"
              kind="outlined"
              size="medium"
            />
          </Item.Actions>
        </Item>
      </Item.List>
    </template>
  </CardBox>
</template>
