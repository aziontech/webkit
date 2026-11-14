<script setup lang="ts">
  import MenuGroup from '@aziontech/webkit/menu-group'
  import MenuItem from '@aziontech/webkit/menu-item'
  import MenuRoot from '@aziontech/webkit/menu-root'
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
      lineFigures: t.lineFigures,
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
  <MenuRoot role="presentation">
    <MenuGroup
      v-for="group in groups"
      :key="group.label"
      :label="group.label"
    >
      <MenuItem
        v-for="item in group.items"
        :key="item.to"
        :label="item.label"
        :href="item.to"
        :selected="current === item.to"
      />
    </MenuGroup>
  </MenuRoot>
</template>
