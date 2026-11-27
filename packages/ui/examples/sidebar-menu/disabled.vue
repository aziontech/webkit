<script setup>
  import SidebarMenuGroup from '@aziontech/ui/sidebar-menu-group'
  import SidebarMenuItem from '@aziontech/ui/sidebar-menu-item'
  import SidebarMenuRoot from '@aziontech/ui/sidebar-menu-root'
  import SidebarMenuSub from '@aziontech/ui/sidebar-menu-sub'
  import SidebarMenuSubContent from '@aziontech/ui/sidebar-menu-sub-content'
  import SidebarMenuSubTrigger from '@aziontech/ui/sidebar-menu-sub-trigger'
</script>

<template>
  <div class="w-[264px] overflow-hidden">
    <SidebarMenuRoot aria-label="Console navigation">
      <SidebarMenuGroup label="Azion platform">
        <SidebarMenuItem
          label="Applications"
          icon="az az-layout-grid"
          href="/applications"
        />
        <SidebarMenuItem
          label="Real-Time Purge"
          icon="az az-refresh"
          disabled
        />
        <SidebarMenuSub>
          <SidebarMenuSubTrigger
            label="Settings"
            type="inline"
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
