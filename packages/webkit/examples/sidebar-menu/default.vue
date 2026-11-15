<script setup>
  import SidebarMenuGroup from '@aziontech/webkit/sidebar-menu-group'
  import SidebarMenuItem from '@aziontech/webkit/sidebar-menu-item'
  import SidebarMenuRoot from '@aziontech/webkit/sidebar-menu-root'
</script>

<template>
  <div class="w-[264px] overflow-hidden">
    <SidebarMenuRoot aria-label="Console navigation">
      <SidebarMenuGroup label="User agents">
        <SidebarMenuItem
          label="End User"
          icon="pi pi-user"
          href="/end-user"
          selected
        />
        <SidebarMenuItem
          label="Web Browser"
          icon="ai ai-domains"
          href="/web-browser"
        />
        <SidebarMenuItem
          label="Device Groups"
          icon="pi pi-mobile"
          href="/device-groups"
        />
      </SidebarMenuGroup>
      <SidebarMenuGroup label="Azion platform">
        <SidebarMenuItem
          label="Applications"
          icon="pi pi-th-large"
          href="/applications"
        />
        <SidebarMenuItem
          label="Edge Firewall"
          icon="pi pi-shield"
          href="/edge-firewall"
          tag-value="Beta"
        />
        <SidebarMenuItem
          label="Real-Time Metrics"
          icon="pi pi-chart-bar"
          href="/metrics"
        />
      </SidebarMenuGroup>
    </SidebarMenuRoot>
  </div>
</template>
