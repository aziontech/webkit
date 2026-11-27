<script setup>
  import Card from '@aziontech/ui/card'
  import Item from '@aziontech/ui/item'
  import Select from '@aziontech/ui/select'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import SettingsRow from '@aziontech/ui/settings-row'
  import { ref } from 'vue'

  const fonts = [
    { label: 'Rubik (Default)', value: 'rubik' },
    { label: 'Inter', value: 'inter' },
    { label: 'IBM Plex Sans', value: 'ibm-plex-sans' },
    { label: 'Geist', value: 'geist' }
  ]

  const appearances = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' }
  ]

  const font = ref('rubik')
  const theme = ref('system')

  const labelFor = (options) => (value) =>
    options.find((option) => option.value === value)?.label ?? ''
</script>

<template>
  <div class="layout-column-form flex min-w-0 flex-col">
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
              description="The primary sans typeface across the interface."
            >
              <Select
                v-model="font"
                size="large"
                :display-value="labelFor(fonts)"
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
                :display-value="labelFor(appearances)"
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
  </div>
</template>
