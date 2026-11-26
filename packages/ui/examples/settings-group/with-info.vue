<script setup>
  import Card from '@aziontech/ui/card'
  import Drawer from '@aziontech/ui/drawer'
  import HelpPanel from '@aziontech/ui/help-panel'
  import IconButton from '@aziontech/ui/icon-button'
  import Item from '@aziontech/ui/item'
  import Link from '@aziontech/ui/link'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import SettingsRow from '@aziontech/ui/settings-row'
  import Switch from '@aziontech/ui/switch'
  import { ref } from 'vue'

  const open = ref(false)
  const helpOpen = ref(false)
  const http3 = ref(false)
</script>

<template>
  <div class="layout-column-form flex min-w-0 flex-col">
    <SettingsGroup
      v-model:open="open"
      label="Advanced"
      icon="az az-settings"
      collapsible
    >
      <template #info>
        <IconButton
          icon="az az-circle-help"
          aria-label="Help: Advanced"
          variant="ghost"
          size="small"
          @click="helpOpen = true"
        />
      </template>
      <Card :padded="false">
        <template #default>
          <Item.List>
            <SettingsRow
              title="HTTP/3"
              description="Serve over QUIC to the browsers that support it."
              variant="compact"
            >
              <Switch
                v-model="http3"
                aria-label="HTTP/3"
              />
            </SettingsRow>
          </Item.List>
        </template>
      </Card>
    </SettingsGroup>
    <Drawer
      v-model:open="helpOpen"
      :modal="false"
      size="small"
    >
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Help</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <HelpPanel aria-label="Help: Advanced">
            <HelpPanel.Header
              title="Advanced"
              description="Settings whose defaults suit most applications."
            />
            <HelpPanel.Group label="When should I turn on HTTP/3?">
              <p>When most of your visitors are on mobile networks, where QUIC recovers faster.</p>
            </HelpPanel.Group>
            <HelpPanel.Footer>
              <Link
                label="Application settings documentation"
                href="https://www.azion.com/en/documentation/"
                target="_blank"
              />
            </HelpPanel.Footer>
          </HelpPanel>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
  </div>
</template>
