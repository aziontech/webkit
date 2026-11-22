<script setup lang="ts">
  import SidebarMenuRoot from '@aziontech/webkit/sidebar-menu-root'
  import { computed, defineAsyncComponent, hydrateOnIdle, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'

  import { messages } from '../lib/i18n'
  import { blockGroups, componentGroups, foundationGroups } from '../lib/nav'

  const SideNavGroup = defineAsyncComponent({
    loader: () => import('./side-nav-group.vue'),
    hydrate: hydrateOnIdle()
  })

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
    <SideNavGroup
      v-for="group in groups"
      :key="group.label"
      :label="group.label"
      :items="group.items"
      :current="current"
    />
  </SidebarMenuRoot>
</template>
