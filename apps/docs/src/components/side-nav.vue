<script setup lang="ts">
  import SidebarMenuRoot from '@aziontech/webkit/sidebar-menu-root'
  import {
    type ComponentPublicInstance,
    computed,
    defineAsyncComponent,
    hydrateOnIdle,
    nextTick,
    onMounted,
    ref,
    watch
  } from 'vue'
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
      forAi: t.forAi,
      foundations: t.foundations,
      assets: t.assets,
      brand: t.brand,
      illustrations: t.illustrations,
      icons: t.icons
    })
  })

  const mounted = ref(false)
  const rootEl = ref<ComponentPublicInstance | null>(null)

  async function revealActive() {
    await nextTick()
    const root = rootEl.value?.$el as HTMLElement | undefined
    const item = root?.querySelector<HTMLElement>('[aria-current="page"]')
    let box = item?.parentElement ?? null
    while (box && box.scrollHeight <= box.clientHeight) box = box.parentElement
    if (!item || !box) return
    const top = item.getBoundingClientRect().top - box.getBoundingClientRect().top
    if (top < 0 || top + item.offsetHeight > box.clientHeight)
      box.scrollTop += top - box.clientHeight / 2
  }

  onMounted(() => {
    mounted.value = true
    requestAnimationFrame(revealActive)
  })

  const current = computed(() => {
    const path = route.path.replace(/\/$/, '') || '/'
    if (path !== '/assets') return path
    return `${path}${(mounted.value && route.hash) || '#brand'}`
  })

  watch(current, revealActive)
</script>

<template>
  <SidebarMenuRoot
    ref="rootEl"
    role="presentation"
  >
    <SideNavGroup
      v-for="group in groups"
      :key="group.label"
      :label="group.label"
      :items="group.items"
      :current="current"
    />
  </SidebarMenuRoot>
</template>
