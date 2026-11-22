<script setup lang="ts">
  import SidebarMenuGroup from '@aziontech/webkit/sidebar-menu-group'
  import SidebarMenuItem from '@aziontech/webkit/sidebar-menu-item'

  defineProps<{ label: string; items: { label: string; to: string }[]; current: string }>()
</script>

<template>
  <SidebarMenuGroup :label="label">
    <SidebarMenuItem
      v-for="item in items"
      :key="item.to"
      :label="item.label"
      :href="item.to"
      :active="current === item.to"
    />
  </SidebarMenuGroup>
</template>
