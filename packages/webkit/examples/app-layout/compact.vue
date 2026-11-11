<script setup>
  import AppLayout from '@aziontech/webkit/app-layout'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelpPanel from '@aziontech/webkit/help-panel'
  import IconButton from '@aziontech/webkit/icon-button'
  import Menu from '@aziontech/webkit/menu'
  import MenuGroup from '@aziontech/webkit/menu-group'
  import MenuItem from '@aziontech/webkit/menu-item'
  import PageHeader from '@aziontech/webkit/page-header'
  import Sidebar from '@aziontech/webkit/sidebar'
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
          <Menu role="presentation">
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
              @click="toggleTools"
            />
          </GlobalHeader.Right>
        </GlobalHeader>
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
