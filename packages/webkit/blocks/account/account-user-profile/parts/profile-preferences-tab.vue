<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'

  import type { UserProfilePreferences } from '../user-profile-model'

  const form = defineModel<UserProfilePreferences>('form', { required: true })
</script>

<template>
  <SettingsGroup
    label="Appearance and keyboard"
    hint="How the Azion console looks and responds for you."
    anchor="appearance"
  >
    <Card :padded="false">
      <Item.List>
        <SettingsRow
          title="Theme"
          description="Follow your system, or keep the console light or dark."
          variant="compact"
        >
          <ThemeSwitcher
            v-model="form.theme"
            aria-label="Theme"
          />
        </SettingsRow>
        <SettingsRow
          title="Keyboard shortcuts"
          description="Turn on console shortcuts and show their keys on buttons and menus. Off, the keys are hidden everywhere."
          variant="compact"
        >
          <Switch
            v-model="form.keyboardShortcuts"
            aria-label="Keyboard shortcuts"
          />
        </SettingsRow>
      </Item.List>
    </Card>
  </SettingsGroup>
</template>
