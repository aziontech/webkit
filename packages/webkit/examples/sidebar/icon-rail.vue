<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import MenuBack from '@aziontech/webkit/menu-back'
  import MenuGroup from '@aziontech/webkit/menu-group'
  import MenuItem from '@aziontech/webkit/menu-item'
  import Menu from '@aziontech/webkit/menu-root'
  import MenuSub from '@aziontech/webkit/menu-sub'
  import MenuSubContent from '@aziontech/webkit/menu-sub-content'
  import MenuSubTrigger from '@aziontech/webkit/menu-sub-trigger'
  import Sidebar from '@aziontech/webkit/sidebar'
  import SidebarFooter from '@aziontech/webkit/sidebar-footer'
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
        <Menu role="presentation">
          <MenuBack />
          <MenuGroup>
            <MenuItem
              label="Home"
              icon="ai ai-home"
              href="/"
              selected
            />
            <MenuItem
              label="Marketplace"
              icon="ai ai-marketplace"
              href="/marketplace"
            />
          </MenuGroup>
          <MenuGroup label="Build">
            <MenuItem
              label="Applications"
              icon="ai ai-edge-application"
              href="/applications"
            />
            <MenuItem
              label="Variables"
              icon="ai ai-variables"
              href="/variables"
            />
          </MenuGroup>
          <MenuGroup label="Store">
            <MenuItem
              label="Object Storage"
              icon="ai ai-edge-storage"
              href="/object-storage"
            />
            <MenuItem
              label="SQL Database"
              icon="ai ai-edge-sql"
              href="/sql-database"
              tag-value="Preview"
              tag-severity="primary"
            />
          </MenuGroup>
          <MenuGroup label="Account">
            <MenuSub>
              <MenuSubTrigger
                label="Settings"
                icon="pi pi-cog"
                kind="drill"
              />
              <MenuSubContent>
                <MenuGroup label="Organization">
                  <MenuItem
                    label="General"
                    href="/settings/general"
                  />
                  <MenuItem
                    label="Members"
                    href="/settings/members"
                  />
                </MenuGroup>
              </MenuSubContent>
            </MenuSub>
          </MenuGroup>
        </Menu>
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
