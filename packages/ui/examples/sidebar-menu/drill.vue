<script setup>
  import SidebarMenuBack from '@aziontech/ui/sidebar-menu-back'
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
      <SidebarMenuBack />
      <SidebarMenuGroup label="Account">
        <SidebarMenuItem
          label="Overview"
          icon="az az-home"
          href="/overview"
          active
        />
        <SidebarMenuSub>
          <SidebarMenuSubTrigger
            label="Settings"
            type="drill"
            icon="az az-settings"
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
