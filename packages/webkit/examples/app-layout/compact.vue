<script setup>
  import AppLayout from '@aziontech/webkit/app-layout'
  import Command from '@aziontech/webkit/command'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelpPanel from '@aziontech/webkit/help-panel'
  import IconButton from '@aziontech/webkit/icon-button'
  import MenuGroup from '@aziontech/webkit/menu-group'
  import MenuItem from '@aziontech/webkit/menu-item'
  import MenuRoot from '@aziontech/webkit/menu-root'
  import PageHeader from '@aziontech/webkit/page-header'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import Sidebar from '@aziontech/webkit/sidebar'
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
          <MenuRoot role="presentation">
            <MenuGroup>
              <MenuItem
                label="Home"
                icon="ai ai-home"
                href="#"
                selected
              />
              <MenuItem
                label="Services"
                icon="ai ai-edge-application"
                href="#"
              />
            </MenuGroup>
          </MenuRoot>
        </Sidebar>
      </template>

      <template #header="{ compact, openNavigation, toggleTools }">
        <div class="@container w-full">
          <GlobalHeader aria-label="Console">
            <GlobalHeader.Left>
              <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
                <IconButton
                  v-if="compact"
                  icon="pi pi-bars"
                  aria-label="Open navigation"
                  kind="outlined"
                  size="medium"
                  @click="openNavigation"
                />
              </div>
            </GlobalHeader.Left>
            <GlobalHeader.Middle />
            <GlobalHeader.Right>
              <SearchTrigger
                collapsible
                @open="searchOpen = true"
              />
              <IconButton
                icon="pi pi-question-circle"
                aria-label="Help"
                kind="outlined"
                size="medium"
                @click="toggleTools"
              />
            </GlobalHeader.Right>
          </GlobalHeader>
          <Command v-model:open="searchOpen">
            <Command.Input placeholder="Search the console" />
            <Command.List>
              <Command.Empty>No page matches your search.</Command.Empty>
              <Command.Group heading="Pages">
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
