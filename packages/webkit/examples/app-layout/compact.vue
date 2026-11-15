<script setup>
  import AppHeader from '@aziontech/webkit/app-header'
  import AppLayout from '@aziontech/webkit/app-layout'
  import Command from '@aziontech/webkit/command'
  import HelpPanel from '@aziontech/webkit/help-panel'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import SidebarMenuGroup from '@aziontech/webkit/sidebar-menu-group'
  import SidebarMenuItem from '@aziontech/webkit/sidebar-menu-item'
  import SidebarMenuRoot from '@aziontech/webkit/sidebar-menu-root'
  import Sidebar from '@aziontech/webkit/sidebar-root'
  import { ref } from 'vue'

  const searchOpen = ref(false)
  const searchPages = ['Applications', 'Workloads', 'Functions', 'Firewall']
</script>

<template>
  <div class="mx-auto h-dvh w-full max-w-(--container-xs) border-x border-(--border-default)">
    <AppLayout>
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
                icon="ai ai-home"
                href="#"
                active
              />
              <SidebarMenuItem
                label="Services"
                icon="ai ai-edge-application"
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
                  icon="ai ai-menu"
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
                icon="ai ai-circle-help"
                aria-label="Help"
                variant="outline"
                size="medium"
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

      <main class="p-(--spacing-md)">
        <PageHeader
          title="Home"
          description="On a narrow screen the navigation and the help open as drawers."
        />
      </main>

      <template #tools>
        <HelpPanel aria-label="Help: Home">
          <HelpPanel.Header
            title="Home"
            description="A summary of what is running in this account."
          />
        </HelpPanel>
      </template>
    </AppLayout>
  </div>
</template>
