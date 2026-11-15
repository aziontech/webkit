<script setup>
  import SidebarMenuGroup from '@aziontech/webkit/sidebar-menu-group'
  import SidebarMenuItem from '@aziontech/webkit/sidebar-menu-item'
  import SidebarMenuRoot from '@aziontech/webkit/sidebar-menu-root'
  import SidebarMenuSub from '@aziontech/webkit/sidebar-menu-sub'
  import SidebarMenuSubContent from '@aziontech/webkit/sidebar-menu-sub-content'
  import SidebarMenuSubTrigger from '@aziontech/webkit/sidebar-menu-sub-trigger'
</script>

<template>
  <div class="w-[264px] overflow-hidden">
    <SidebarMenuRoot aria-label="Console navigation">
      <SidebarMenuGroup label="Azion platform">
        <SidebarMenuItem
          label="Applications"
          icon="ai ai-th-large"
          href="/applications"
        />
        <SidebarMenuItem
          label="Real-Time Purge"
          icon="ai ai-refresh"
          disabled
        />
        <SidebarMenuSub>
          <SidebarMenuSubTrigger
            label="Settings"
            kind="inline"
            disabled
          />
          <SidebarMenuSubContent>
            <SidebarMenuItem
              label="General"
              icon=""
              href="/settings/general"
            />
          </SidebarMenuSubContent>
        </SidebarMenuSub>
      </SidebarMenuGroup>
    </SidebarMenuRoot>
  </div>
</template>
