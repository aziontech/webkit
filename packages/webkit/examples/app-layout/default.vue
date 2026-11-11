<script setup>
  import Alert from '@aziontech/webkit/alert'
  import AppLayout from '@aziontech/webkit/app-layout'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelpPanel from '@aziontech/webkit/help-panel'
  import IconButton from '@aziontech/webkit/icon-button'
  import KeyValuePairs from '@aziontech/webkit/key-value-pairs'
  import Link from '@aziontech/webkit/link'
  import Menu from '@aziontech/webkit/menu'
  import MenuGroup from '@aziontech/webkit/menu-group'
  import MenuItem from '@aziontech/webkit/menu-item'
  import PageHeader from '@aziontech/webkit/page-header'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { ref } from 'vue'

  const toolsOpen = ref(true)
  const splitPanelOpen = ref(true)
  const notice = ref(true)

  const crumbs = [{ label: 'Services', href: '#' }, { label: 'web-app-prod' }]
</script>

<template>
  <div class="h-dvh">
    <AppLayout
      v-model:tools-open="toolsOpen"
      v-model:split-panel-open="splitPanelOpen"
      split-panel-title="web-app-prod"
      tools-label="Help: Services"
    >
      <template #navigation="{ drawer }">
        <Sidebar
          aria-label="Main navigation"
          :resizable="!drawer"
          :collapsible="!drawer"
        >
          <Menu role="presentation">
            <MenuGroup>
              <MenuItem
                label="Home"
                icon="ai ai-home"
                href="#"
              />
              <MenuItem
                label="Services"
                icon="ai ai-edge-application"
                href="#"
                selected
              />
              <MenuItem
                label="Variables"
                icon="ai ai-variables"
                href="#"
              />
            </MenuGroup>
          </Menu>
        </Sidebar>
      </template>

      <template #header="{ compact, openNavigation, toggleTools }">
        <GlobalHeader aria-label="Console">
          <GlobalHeader.Left class="justify-start!">
            <IconButton
              v-if="compact"
              icon="pi pi-bars"
              aria-label="Open navigation"
              kind="outlined"
              size="medium"
              @click="openNavigation"
            />
          </GlobalHeader.Left>
          <GlobalHeader.Middle />
          <GlobalHeader.Right>
            <IconButton
              icon="pi pi-question-circle"
              aria-label="Help"
              kind="outlined"
              size="medium"
              :aria-pressed="toolsOpen"
              @click="toggleTools"
            />
          </GlobalHeader.Right>
        </GlobalHeader>
      </template>

      <template #notifications>
        <Alert
          v-if="notice"
          severity="info"
          closable
          @close="notice = false"
        >
          Scheduled maintenance on Nov 20 from 02:00 to 03:00 UTC. Services keep serving traffic.
        </Alert>
      </template>

      <template #breadcrumbs>
        <Breadcrumb :items="crumbs" />
      </template>

      <main class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
        <PageHeader
          title="web-app-prod"
          description="The service that answers shop.example.com."
        />
        <div class="flex flex-wrap gap-(--spacing-xs)">
          <Button
            label="Show details"
            kind="outlined"
            size="medium"
            @click="splitPanelOpen = true"
          />
        </div>
      </main>

      <template #split-panel>
        <KeyValuePairs aria-label="Service details">
          <KeyValuePairs.Item label="Status">
            <StatusIndicator
              severity="success"
              label="Active"
            />
          </KeyValuePairs.Item>
          <KeyValuePairs.Item label="Domain">shop.example.com</KeyValuePairs.Item>
          <KeyValuePairs.Item label="Last deploy">Nov 10, 2026, 14:32</KeyValuePairs.Item>
        </KeyValuePairs>
      </template>

      <template #tools>
        <HelpPanel aria-label="Help: Services">
          <HelpPanel.Header
            title="Services"
            description="Where your domains meet the code that answers them."
          />
          <HelpPanel.Section title="What is a service?">
            <p>A service binds one or more domains to the code and rules that answer them.</p>
          </HelpPanel.Section>
          <HelpPanel.Links>
            <Link
              label="Services documentation"
              href="https://example.com/docs"
              target="_blank"
            />
          </HelpPanel.Links>
        </HelpPanel>
      </template>
    </AppLayout>
  </div>
</template>
