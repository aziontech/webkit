<script setup>
  import Avatar from '@aziontech/webkit/avatar'
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
  <div class="relative flex h-screen min-h-0">
    <div class="flex min-h-0 shrink-0 max-md:hidden">
      <Sidebar
        v-model:open="open"
        collapsible="icon"
        shortcut
        aria-label="Console"
      >
        <SidebarMenu role="presentation">
          <SidebarMenuBack />
          <SidebarMenuGroup>
            <SidebarMenuItem
              label="Home"
              icon="ai ai-home"
              href="/"
              selected
            />
            <SidebarMenuItem
              label="Marketplace"
              icon="ai ai-marketplace"
              href="/marketplace"
            />
          </SidebarMenuGroup>
          <SidebarMenuGroup label="Build">
            <SidebarMenuItem
              label="Applications"
              icon="ai ai-edge-application"
              href="/applications"
            />
            <SidebarMenuItem
              label="Variables"
              icon="ai ai-variables"
              href="/variables"
            />
          </SidebarMenuGroup>
          <SidebarMenuGroup label="Store">
            <SidebarMenuItem
              label="Object Storage"
              icon="ai ai-edge-storage"
              href="/object-storage"
            />
            <SidebarMenuItem
              label="SQL Database"
              icon="ai ai-edge-sql"
              href="/sql-database"
              tag-value="Preview"
              tag-variant="primary"
            />
          </SidebarMenuGroup>
          <SidebarMenuGroup label="Account">
            <SidebarMenuSub>
              <SidebarMenuSubTrigger
                label="Settings"
                icon="ai ai-settings"
                kind="drill"
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
                kind="square"
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
    </div>

    <main class="min-w-0 flex-1 p-(--spacing-lg)">
      <p class="text-body-sm text-(--text-muted)">
        Press Ctrl+B (Cmd+B on macOS) to switch between the icon rail and the full sidebar.
      </p>
    </main>
  </div>
</template>
