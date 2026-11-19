<script setup>
  import Alert from '@aziontech/webkit/alert'
  import AppHeader from '@aziontech/webkit/app-header'
  import AppLayout from '@aziontech/webkit/app-layout'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Command from '@aziontech/webkit/command'
  import HelpPanel from '@aziontech/webkit/help-panel'
  import IconButton from '@aziontech/webkit/icon-button'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import SidebarMenuGroup from '@aziontech/webkit/sidebar-menu-group'
  import SidebarMenuItem from '@aziontech/webkit/sidebar-menu-item'
  import SidebarMenuRoot from '@aziontech/webkit/sidebar-menu-root'
  import Sidebar from '@aziontech/webkit/sidebar-root'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { ref } from 'vue'

  const toolsOpen = ref(false)
  const splitPanelOpen = ref(true)
  const notice = ref(true)

  const crumbs = [{ label: 'Services', href: '#' }, { label: 'web-app-prod' }]
  const searchOpen = ref(false)
  const searchPages = ['Applications', 'Workloads', 'Functions', 'Firewall']
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
          <SidebarMenuRoot role="presentation">
            <SidebarMenuGroup>
              <SidebarMenuItem
                label="Home"
                icon="az az-home"
                href="#"
              />
              <SidebarMenuItem
                label="Services"
                icon="az az-applications"
                href="#"
                active
              />
              <SidebarMenuItem
                label="Variables"
                icon="az az-variables"
                href="#"
              />
            </SidebarMenuGroup>
          </SidebarMenuRoot>
        </Sidebar>
      </template>

      <template #header="{ compact, openNavigation, toggleTools }">
        <div class="@container w-full">
          <AppHeader aria-label="Console">
            <AppHeader.Start>
              <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
                <IconButton
                  v-if="compact"
                  icon="az az-menu"
                  aria-label="Open navigation"
                  variant="outline"
                  size="medium"
                  @click="openNavigation"
                />
              </div>
            </AppHeader.Start>
            <AppHeader.Center />
            <AppHeader.End>
              <SearchTrigger
                collapsible
                @open="searchOpen = true"
              />
              <IconButton
                icon="az az-circle-help"
                aria-label="Help"
                variant="outline"
                size="medium"
                :aria-pressed="toolsOpen"
                @click="toggleTools"
              />
            </AppHeader.End>
          </AppHeader>
          <Command v-model:open="searchOpen">
            <Command.Input placeholder="Search the console" />
            <Command.List>
              <Command.Empty>No page matches your search.</Command.Empty>
              <Command.Group label="Pages">
                <Command.Item
                  v-for="page in searchPages"
                  :key="page"
                  :value="page"
                  >{{ page }}</Command.Item
                >
              </Command.Group>
            </Command.List>
          </Command>
        </div>
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
            variant="outline"
            size="medium"
            @click="splitPanelOpen = true"
          />
        </div>
      </main>

      <template #split-panel>
        <KeyValueList aria-label="Service details">
          <KeyValueList.Item label="Status">
            <StatusIndicator
              severity="success"
              label="Active"
            />
          </KeyValueList.Item>
          <KeyValueList.Item label="Domain">shop.example.com</KeyValueList.Item>
          <KeyValueList.Item label="Last deploy">Nov 10, 2026, 14:32</KeyValueList.Item>
        </KeyValueList>
      </template>

      <template #tools>
        <HelpPanel aria-label="Help: Services">
          <HelpPanel.Header
            title="Services"
            description="Where your domains meet the code that answers them."
          />
          <HelpPanel.Group label="What is a service?">
            <p>A service binds one or more domains to the code and rules that answer them.</p>
          </HelpPanel.Group>
          <HelpPanel.Footer>
            <Link
              label="Services documentation"
              href="https://example.com/docs"
              target="_blank"
            />
          </HelpPanel.Footer>
        </HelpPanel>
      </template>
    </AppLayout>
  </div>
</template>
