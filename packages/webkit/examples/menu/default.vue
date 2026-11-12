<script setup>
  import MenuRoot from '@aziontech/webkit/menu-root'
  import MenuGroup from '@aziontech/webkit/menu-group'
  import MenuItem from '@aziontech/webkit/menu-item'
</script>

<template>
  <div class="w-[264px] overflow-hidden">
    <MenuRoot aria-label="Console navigation">
      <MenuGroup label="User agents">
        <MenuItem
          label="End User"
          icon="pi pi-user"
          href="/end-user"
          selected
        />
        <MenuItem
          label="Web Browser"
          icon="ai ai-domains"
          href="/web-browser"
        />
        <MenuItem
          label="Device Groups"
          icon="pi pi-mobile"
          href="/device-groups"
        />
      </MenuGroup>
      <MenuGroup label="Azion platform">
        <MenuItem
          label="Applications"
          icon="pi pi-th-large"
          href="/applications"
        />
        <MenuItem
          label="Edge Firewall"
          icon="pi pi-shield"
          href="/edge-firewall"
          tag-value="Beta"
        />
        <MenuItem
          label="Real-Time Metrics"
          icon="pi pi-chart-bar"
          href="/metrics"
        />
      </MenuGroup>
    </MenuRoot>
  </div>
</template>
