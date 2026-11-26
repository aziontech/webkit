<script setup>
  import Button from '@aziontech/ui/button'
  import Drawer from '@aziontech/ui/drawer'
  import HelpPanel from '@aziontech/ui/help-panel'
  import IconButton from '@aziontech/ui/icon-button'
  import Link from '@aziontech/ui/link'
  import Subheader from '@aziontech/ui/subheader'
  import { ref } from 'vue'

  const helpOpen = ref(false)
</script>

<template>
  <Subheader
    title="Domains"
    description="The hostnames this application answers on."
  >
    <template #info>
      <IconButton
        icon="az az-circle-help"
        aria-label="Help: Domains"
        variant="ghost"
        size="small"
        @click="helpOpen = true"
      />
    </template>
    <template #actions>
      <Button
        label="Add domain"
        variant="outline"
        size="medium"
        icon="az az-plus"
      />
    </template>
  </Subheader>
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
        <HelpPanel aria-label="Help: Domains">
          <HelpPanel.Header
            title="Domains"
            description="Each domain points at this application through a CNAME record."
          />
          <HelpPanel.Group label="How long does a new domain take?">
            <p>Traffic reaches the application once the DNS change has propagated.</p>
          </HelpPanel.Group>
          <HelpPanel.Footer>
            <Link
              label="Domains documentation"
              href="https://www.azion.com/en/documentation/"
              target="_blank"
            />
          </HelpPanel.Footer>
        </HelpPanel>
      </Drawer.Body>
    </Drawer.Content>
  </Drawer>
</template>
