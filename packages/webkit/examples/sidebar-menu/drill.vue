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
  <div class="w-[264px] overflow-hidden">
    <SidebarMenuRoot aria-label="Console navigation">
      <SidebarMenuBack />
      <SidebarMenuGroup label="Account">
        <SidebarMenuItem
          label="Overview"
          icon="ai ai-home"
          href="/overview"
          active
        />
        <SidebarMenuSub>
          <SidebarMenuSubTrigger
            label="Settings"
            type="drill"
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
            <SidebarMenuItem
              label="Billing"
              icon=""
              href="/settings/billing"
            />
          </SidebarMenuSubContent>
        </SidebarMenuSub>
      </SidebarMenuGroup>
    </SidebarMenuRoot>
  </div>
</template>
