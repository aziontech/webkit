<script setup lang="ts">
  import SidebarMenuGroup from '@aziontech/webkit/sidebar-menu-group'
  import SidebarMenuItem from '@aziontech/webkit/sidebar-menu-item'
  import SidebarMenuRoot from '@aziontech/webkit/sidebar-menu-root'
  import { computed, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'

  import { messages } from '../lib/i18n'
  import { blockGroups, componentGroups, foundationGroups } from '../lib/nav'

  const route = useRoute()

  const groups = computed(() => {
    if (route.path.startsWith('/components')) return componentGroups()
    if (route.path.startsWith('/blocks')) return blockGroups()
    const t = messages.value
    return foundationGroups({
      start: t.start,
      home: t.homeNav,
      gettingStarted: t.gettingStarted,
      foundations: t.foundations,
      assets: t.assets,
      brand: t.brand,
      illustrations: t.illustrations,
      icons: t.icons
    })
  })

  const mounted = ref(false)
  onMounted(() => {
    mounted.value = true
  })

  const current = computed(() => {
    const path = route.path.replace(/\/$/, '') || '/'
    if (path !== '/assets') return path
    return `${path}${(mounted.value && route.hash) || '#brand'}`
  })
</script>

<template>
  <SidebarMenuRoot role="presentation">
    <SidebarMenuGroup
      v-for="group in groups"
      :key="group.label"
      :label="group.label"
    >
      <SidebarMenuItem
        v-for="item in group.items"
        :key="item.to"
        :label="item.label"
        :href="item.to"
        :active="current === item.to"
      />
    </SidebarMenuGroup>
  </SidebarMenuRoot>
</template>
