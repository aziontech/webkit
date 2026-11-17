<script setup>
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import SettingsRow from '@aziontech/webkit/settings-row'
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
      icon="az az-settings"
      collapsible
    >
      <Card :padded="false">
        <template #default>
          <Item.List>
            <SettingsRow
              title="Active"
              description="Inactive teams keep their permissions but can't be assigned."
              variant="compact"
            >
              <Switch
                v-model="active"
                aria-label="Active"
              />
            </SettingsRow>
          </Item.List>
        </template>
      </Card>
    </SettingsSection>
  </div>
</template>
