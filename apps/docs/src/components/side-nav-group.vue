<script setup lang="ts">
  import SidebarMenuGroup from '@aziontech/ui/sidebar-menu-group'
  import SidebarMenuItem from '@aziontech/ui/sidebar-menu-item'

  import { messages } from '../lib/i18n'
  import type { NavItem } from '../lib/nav'

  defineProps<{ label: string; items: NavItem[]; current: string }>()

  const t = messages
</script>

<template>
  <SidebarMenuGroup :label="label">
    <SidebarMenuItem
      v-for="item in items"
      :key="item.to"
      :label="item.label"
      :href="item.to"
      :active="current === item.to"
      :tag-value="item.preview ? t.stabilityPreview : ''"
      tag-severity="info"
    />
  </SidebarMenuGroup>
</template>
