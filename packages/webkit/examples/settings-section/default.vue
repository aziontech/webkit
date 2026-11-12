<script setup>
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
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
    <SettingsSection
      title="Appearance"
      hint="Preferences for this browser, applied the moment you change them and not part of Save."
      anchor="appearance"
    >
      <Card :padded="false">
        <template #content>
          <Item.List>
            <SettingRow
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
                  <Select.Option
                    v-for="option in fonts"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </SettingRow>
            <SettingRow
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
                  <Select.Option
                    v-for="option in appearances"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </SettingRow>
          </Item.List>
        </template>
      </Card>
    </SettingsSection>
  </div>
</template>
