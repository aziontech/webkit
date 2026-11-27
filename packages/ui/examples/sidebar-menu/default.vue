<script setup>
  import SidebarMenuGroup from '@aziontech/ui/sidebar-menu-group'
  import SidebarMenuItem from '@aziontech/ui/sidebar-menu-item'
  import SidebarMenuRoot from '@aziontech/ui/sidebar-menu-root'
</script>

<template>
  <div class="w-[264px] overflow-hidden">
    <SidebarMenuRoot aria-label="Console navigation">
      <SidebarMenuGroup label="User agents">
        <SidebarMenuItem
          label="End User"
          icon="az az-user"
          href="/end-user"
          active
        />
        <SidebarMenuItem
          label="Web Browser"
          icon="az az-domains"
          href="/web-browser"
        />
        <SidebarMenuItem
          label="Device Groups"
          icon="az az-mobile"
          href="/device-groups"
        />
      </SidebarMenuGroup>
      <SidebarMenuGroup label="Azion platform">
        <SidebarMenuItem
          label="Applications"
          icon="az az-layout-grid"
          href="/applications"
        />
        <SidebarMenuItem
          label="Firewall"
          icon="az az-shield"
          href="/firewall"
          tag-value="Beta"
        />
        <SidebarMenuItem
          label="Real-Time Metrics"
          icon="az az-chart-bar"
          href="/metrics"
        />
      </SidebarMenuGroup>
    </SidebarMenuRoot>
  </div>
</template>
