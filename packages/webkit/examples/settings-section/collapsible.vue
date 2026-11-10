<script setup>
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import { ref } from 'vue'

  const open = ref(false)
  const active = ref(true)
</script>

<template>
  <div class="layout-column-form flex min-w-0 flex-col">
    <SettingsSection
      v-model:open="open"
      title="Advanced"
      icon="pi pi-cog"
      collapsible
    >
      <Card :padded="false">
        <template #content>
          <Item.List>
            <SettingRow
              title="Active"
              description="Inactive teams keep their permissions but can't be assigned."
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
  </div>
</template>
