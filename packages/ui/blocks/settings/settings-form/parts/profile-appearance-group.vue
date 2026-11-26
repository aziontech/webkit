<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import Item from '@aziontech/ui/item'
  import Select from '@aziontech/ui/select'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import SettingsRow from '@aziontech/ui/settings-row'
  import { ref } from 'vue'

  import { profileAppearances as appearances, profileFonts as fonts } from '../sample'

  const font = ref('rubik')
  const theme = ref('system')
</script>

<template>
  <SettingsGroup
    label="Appearance"
    hint="Preferences for this browser, applied the moment you change them and not part of Save."
    anchor="appearance"
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            title="Font family"
            description="The primary sans typeface across the console."
          >
            <Select
              v-model="font"
              size="large"
              :display-value="
                (value) => fonts.find((option) => option.value === value)?.label ?? ''
              "
            >
              <Select.Trigger
                class="w-full"
                aria-label="Font family"
              />
              <Select.Content>
                <Select.Item
                  v-for="option in fonts"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Item>
              </Select.Content>
            </Select>
          </SettingsRow>
          <SettingsRow
            title="System appearance"
            description="Follow the operating system, or force a light or dark theme."
          >
            <Select
              v-model="theme"
              size="large"
              :display-value="
                (value) => appearances.find((option) => option.value === value)?.label ?? ''
              "
            >
              <Select.Trigger
                class="w-full"
                aria-label="System appearance"
              />
              <Select.Content>
                <Select.Item
                  v-for="option in appearances"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Item>
              </Select.Content>
            </Select>
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
