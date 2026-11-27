<script setup>
  import AppHeader from '@aziontech/ui/app-header'
  import AppLayout from '@aziontech/ui/app-layout'
  import Command from '@aziontech/ui/command'
  import HelpPanel from '@aziontech/ui/help-panel'
  import IconButton from '@aziontech/ui/icon-button'
  import PageHeader from '@aziontech/ui/page-header'
  import SearchTrigger from '@aziontech/ui/search-trigger'
  import SidebarMenuGroup from '@aziontech/ui/sidebar-menu-group'
  import SidebarMenuItem from '@aziontech/ui/sidebar-menu-item'
  import SidebarMenuRoot from '@aziontech/ui/sidebar-menu-root'
  import Sidebar from '@aziontech/ui/sidebar-root'
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
                icon="az az-home"
                href="#"
                active
              />
              <SidebarMenuItem
                label="Services"
                icon="az az-applications"
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
          description="Applications and functions running in this account."
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
