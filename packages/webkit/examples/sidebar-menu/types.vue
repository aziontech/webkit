<script setup>
  import SidebarMenuBack from '@aziontech/webkit/sidebar-menu-back'
  import SidebarMenuGroup from '@aziontech/webkit/sidebar-menu-group'
  import SidebarMenuItem from '@aziontech/webkit/sidebar-menu-item'
  import SidebarMenuRoot from '@aziontech/webkit/sidebar-menu-root'
  import SidebarMenuSub from '@aziontech/webkit/sidebar-menu-sub'
  import SidebarMenuSubContent from '@aziontech/webkit/sidebar-menu-sub-content'
  import SidebarMenuSubTrigger from '@aziontech/webkit/sidebar-menu-sub-trigger'
</script>

<template>
  <div class="flex flex-wrap items-start gap-(--spacing-md)">
    <div class="w-[264px] overflow-hidden">
      <SidebarMenuRoot aria-label="Expands in place">
        <SidebarMenuGroup label="Expands in place">
          <SidebarMenuSub default-open>
            <SidebarMenuSubTrigger
              label="Getting started"
              type="inline"
            />
            <SidebarMenuSubContent>
              <SidebarMenuItem
                label="Installation"
                icon=""
                href="/docs/install"
              />
              <SidebarMenuItem
                label="Quick start"
                icon=""
                href="/docs/quick-start"
              />
            </SidebarMenuSubContent>
          </SidebarMenuSub>
        </SidebarMenuGroup>
      </SidebarMenuRoot>
    </div>
    <div class="w-[264px] overflow-hidden">
      <SidebarMenuRoot aria-label="Replaces the menu">
        <SidebarMenuBack />
        <SidebarMenuGroup label="Replaces the menu">
          <SidebarMenuSub>
            <SidebarMenuSubTrigger
              label="Settings"
              type="drill"
              icon="ai ai-settings"
            />
            <SidebarMenuSubContent>
              <SidebarMenuItem
                label="General"
                icon=""
                href="/settings/general"
              />
              <SidebarMenuItem
                label="Members"
                icon=""
                href="/settings/members"
              />
            </SidebarMenuSubContent>
          </SidebarMenuSub>
        </SidebarMenuGroup>
      </SidebarMenuRoot>
    </div>
  </div>
</template>
