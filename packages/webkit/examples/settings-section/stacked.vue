<script setup>
  import Card from '@aziontech/webkit/card'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import { ref } from 'vue'

  const defaultFeatures = [
    {
      key: 'compression',
      title: 'Compression',
      description: 'Compress text responses with gzip or Brotli.'
    },
    { key: 'cache', title: 'Cache', description: 'Customize advanced cache settings.' },
    {
      key: 'image_optimization',
      title: 'Image Optimization',
      description: 'Enable dynamic image resizing and format conversion.'
    }
  ]

  const name = ref('web-app')
  const active = ref(true)
  const features = ref({ compression: true, cache: true, image_optimization: false })
</script>

<template>
  <div class="layout-column-form flex min-w-0 flex-col">
    <SettingsSection
      title="General"
      hint="How this resource is identified, and whether it is serving traffic."
      anchor="general"
    >
      <Card :padded="false">
        <template #content>
          <Item.List>
            <SettingRow
              title="Name"
              description="A unique and descriptive name to identify the resource."
            >
              <Input
                v-model="name"
                size="large"
                class="w-full"
                aria-label="Name"
              />
            </SettingRow>
            <SettingRow
              title="Active"
              description="When disabled, the resource stops serving traffic."
              kind="compact"
            >
              <Switch
                v-model="active"
                aria-label="Active"
              />
            </SettingRow>
          </Item.List>
        </template>
      </Card>
    </SettingsSection>
    <SettingsSection
      title="Features"
      hint="The capabilities this resource runs with, each of which can be toggled here."
      anchor="features"
    >
      <Card :padded="false">
        <template #content>
          <Item.List>
            <SettingRow
              v-for="feature in defaultFeatures"
              :key="feature.key"
              :title="feature.title"
              :description="feature.description"
              kind="compact"
            >
              <Switch
                v-model="features[feature.key]"
                :aria-label="feature.title"
              />
            </SettingRow>
          </Item.List>
        </template>
      </Card>
    </SettingsSection>
  </div>
</template>
