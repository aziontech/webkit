<script setup>
  import AppLayout from '@aziontech/webkit/app-layout'
  import Avatar from '@aziontech/webkit/avatar'
  import IconButton from '@aziontech/webkit/icon-button'
  import SidebarFooter from '@aziontech/webkit/sidebar-footer'
  import SidebarMenuBack from '@aziontech/webkit/sidebar-menu-back'
  import SidebarMenuGroup from '@aziontech/webkit/sidebar-menu-group'
  import SidebarMenuItem from '@aziontech/webkit/sidebar-menu-item'
  import SidebarMenu from '@aziontech/webkit/sidebar-menu-root'
  import SidebarMenuSub from '@aziontech/webkit/sidebar-menu-sub'
  import SidebarMenuSubContent from '@aziontech/webkit/sidebar-menu-sub-content'
  import SidebarMenuSubTrigger from '@aziontech/webkit/sidebar-menu-sub-trigger'
  import Sidebar from '@aziontech/webkit/sidebar-root'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <AppLayout class="h-screen">
    <template #navigation="{ drawer }">
      <Sidebar
        :open="drawer || open"
        @update:open="open = $event"
        :collapsible="drawer ? false : 'icon'"
        :shortcut="!drawer"
        aria-label="Console"
      >
        <SidebarMenu role="presentation">
          <SidebarMenuBack />
          <SidebarMenuGroup>
            <SidebarMenuItem
              label="Home"
              icon="az az-home"
              href="/"
              active
            />
            <SidebarMenuItem
              label="Marketplace"
              icon="az az-marketplace"
              href="/marketplace"
            />
          </SidebarMenuGroup>
          <SidebarMenuGroup label="Build">
            <SidebarMenuItem
              label="Applications"
              icon="az az-applications"
              href="/applications"
            />
            <SidebarMenuItem
              label="Variables"
              icon="az az-variables"
              href="/variables"
            />
          </SidebarMenuGroup>
          <SidebarMenuGroup label="Store">
            <SidebarMenuItem
              label="Object Storage"
              icon="az az-object-storage"
              href="/object-storage"
            />
            <SidebarMenuItem
              label="SQL Database"
              icon="az az-sql-database"
              href="/sql-database"
              tag-value="Preview"
              tag-variant="primary"
            />
          </SidebarMenuGroup>
          <SidebarMenuGroup label="Account">
            <SidebarMenuSub>
              <SidebarMenuSubTrigger
                label="Settings"
                icon="az az-settings"
                type="drill"
              />
              <SidebarMenuSubContent>
                <SidebarMenuGroup label="Organization">
                  <SidebarMenuItem
                    label="General"
                    href="/settings/general"
                  />
                  <SidebarMenuItem
                    label="Members"
                    href="/settings/members"
                  />
                </SidebarMenuGroup>
              </SidebarMenuSubContent>
            </SidebarMenuSub>
          </SidebarMenuGroup>
        </SidebarMenu>
        <template #footer="{ rail }">
          <SidebarFooter>
            <div class="flex items-center gap-(--spacing-xs)">
              <Avatar
                variant="square"
                size="small"
                label="JD"
                alt="Jane Doe"
              />
              <span
                v-if="!rail"
                class="min-w-0 flex-1 truncate text-label-sm text-(--text-default)"
                >Jane Doe</span
              >
            </div>
          </SidebarFooter>
        </template>
      </Sidebar>
    </template>

    <template #header="{ compact, openNavigation }">
      <div
        v-if="compact"
        class="flex h-14 shrink-0 items-center border-b border-(--border-default) px-(--spacing-md)"
      >
        <IconButton
          icon="az az-menu"
          aria-label="Open navigation"
          variant="outline"
          size="medium"
          @click="openNavigation"
        />
      </div>
    </template>

    <main class="min-w-0 p-(--spacing-lg)">
      <p class="text-body-sm text-(--text-muted)">
        Press Ctrl+B (Cmd+B on macOS) to switch between the icon rail and the full sidebar.
      </p>
    </main>
  </AppLayout>
</template>
