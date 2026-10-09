<script setup lang="ts">
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Menu from '@aziontech/webkit/menu'
  import type { MenuGroupNode, MenuNode } from '@aziontech/webkit/menu'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

  import { useSiteLink } from '../../composables/use-site-link'
  import type { SiteLink, SiteNavMenu } from './types'

  defineOptions({ name: 'SiteNav' })

  interface Props {
    /** Destination of the brand mark. */
    home?: string
    /** The mega-menus, each a panel of columns of linked groups. */
    menus: SiteNavMenu[]
    /** The bar entries that open no panel. */
    links?: SiteLink[]
    /** The contact action: a text button on the bar, a row in the sheet. */
    contact: SiteLink
    /** The sign-in action: on the bar, and in the sheet's footer. */
    login: SiteLink
    /** The call to action, the one action the bar keeps at every width. */
    cta: SiteLink
  }

  const props = withDefaults(defineProps<Props>(), {
    home: '/site',
    links: () => []
  })

  const { follow } = useSiteLink()

  const slug = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  const navGroups = computed<MenuGroupNode[]>(() => [
    {
      items: [
        ...props.menus.map((menu) => {
          const groups = menu.columns.flat()
          return {
            id: menu.value,
            label: menu.label,
            kind: 'drill' as const,
            groups: groups.map((group) => ({
              label: groups.length > 1 ? group.label : undefined,
              items: group.items.map((item) => ({
                id: [menu.value, slug(item.label)].join('-'),
                label: item.label,
                href: item.href || '#'
              }))
            }))
          }
        }),
        ...props.links.map((link) => ({
          id: slug(link.label),
          label: link.label,
          href: link.href
        })),
        { id: 'contact', label: props.contact.label, href: props.contact.href }
      ]
    }
  ])

  const navOpen = ref(false)
  const navPath = ref<string[]>([])
  const navPanel = ref<{ $el?: globalThis.HTMLElement } | null>(null)

  watch(navOpen, (open) => {
    if (!open) {
      navPath.value = []
      return
    }
    globalThis.requestAnimationFrame(() => navPanel.value?.$el?.focus?.())
  })

  const onNavigate = (event: globalThis.MouseEvent, node: MenuNode) => {
    if (node.groups) return
    follow(event, node.href ?? '')
    navOpen.value = false
  }

  const barQuery = globalThis.matchMedia?.('(min-width: 1280px)')
  const onBarQueryChange = (event: globalThis.MediaQueryListEvent) => {
    if (event.matches) navOpen.value = false
  }

  const bar = ref<{ $el?: globalThis.Element | globalThis.CharacterData } | null>(null)
  const columnInset = ref(0)

  const readColumnInset = () => {
    const node = bar.value?.$el
    const el = node instanceof globalThis.Element ? node : (node?.nextElementSibling ?? null)
    if (!el) return
    columnInset.value = Number.parseFloat(globalThis.getComputedStyle(el).paddingLeft) || 0
  }

  onMounted(() => {
    readColumnInset()
    globalThis.addEventListener('resize', readColumnInset, { passive: true })
    barQuery?.addEventListener('change', onBarQueryChange)
  })

  onBeforeUnmount(() => {
    globalThis.removeEventListener('resize', readColumnInset)
    barQuery?.removeEventListener('change', onBarQueryChange)
  })
</script>

<template>
  <GlobalHeader
    ref="bar"
    kind="site"
    aria-label="Azion"
    class="sticky top-0 z-40"
  >
    <GlobalHeader.Left class="justify-start!">
      <IconButton
        icon="pi pi-bars"
        kind="outlined"
        size="medium"
        aria-label="Open navigation"
        class="shrink-0 xl:hidden"
        @click="navOpen = true"
      />
      <GlobalHeader.Brand>
        <a
          :href="home"
          aria-label="Azion home"
          class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
          @click="follow($event, home)"
        >
          <Brand
            kind="default"
            size="small"
          />
        </a>
      </GlobalHeader.Brand>
    </GlobalHeader.Left>

    <GlobalHeader.Middle class="justify-start!">
      <NavigationMenu
        aria-label="Azion"
        class="min-w-0"
      >
        <NavigationMenu.List class="hidden items-center gap-(--spacing-xxs) xl:flex">
          <NavigationMenu.Item
            v-for="menu in menus"
            :key="menu.value"
            :value="menu.value"
          >
            <NavigationMenu.Trigger>
              {{ menu.label }}
              <NavigationMenu.Icon>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </NavigationMenu.Icon>
            </NavigationMenu.Trigger>
            <NavigationMenu.Content class="w-full">
              <div
                class="grid gap-x-0 gap-y-(--spacing-md)"
                :class="{
                  'grid-cols-1': menu.columns.length === 1,
                  'grid-cols-2': menu.columns.length === 2,
                  'grid-cols-4 w-[calc(min(var(--layout-measure-site-header),100vw)_-_2*var(--layout-boundary-inline)_-_2*var(--spacing-md)_-_2px)]':
                    menu.columns.length === 4
                }"
              >
                <div
                  v-for="column in menu.columns"
                  :key="column[0].label"
                  class="flex flex-col gap-y-(--spacing-md)"
                >
                  <NavigationMenu.List
                    v-for="group in column"
                    :key="group.label"
                    :label="group.label"
                    :href="group.href"
                  >
                    <NavigationMenu.Item
                      v-for="item in group.items"
                      :key="item.label"
                      layout="entry"
                      :href="item.href || '#'"
                      :description="item.description"
                      close-on-click
                    >
                      {{ item.label }}
                    </NavigationMenu.Item>
                  </NavigationMenu.List>
                </div>
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item
            v-for="link in links"
            :key="link.label"
          >
            <NavigationMenu.Trigger :href="link.href">{{ link.label }}</NavigationMenu.Trigger>
          </NavigationMenu.Item>
        </NavigationMenu.List>

        <NavigationMenu.Portal>
          <NavigationMenu.Positioner
            side="bottom"
            align="start"
            :side-offset="12"
            :collision-padding="{ x: columnInset, y: 8 }"
          >
            <NavigationMenu.Popup kind="contrast">
              <NavigationMenu.Arrow />
              <NavigationMenu.Viewport />
            </NavigationMenu.Popup>
          </NavigationMenu.Positioner>
        </NavigationMenu.Portal>
      </NavigationMenu>
    </GlobalHeader.Middle>

    <GlobalHeader.Right>
      <div class="hidden items-center gap-(--spacing-xs) xl:flex">
        <Button
          :label="contact.label"
          kind="text"
          size="medium"
          :href="contact.href"
          @click="follow($event, contact.href)"
        />
        <Button
          :label="login.label"
          kind="secondary"
          size="medium"
          :href="login.href"
          @click="follow($event, login.href)"
        />
      </div>
      <Button
        :label="cta.label"
        kind="primary"
        size="medium"
        class="shrink-0"
        :href="cta.href"
        @click="follow($event, cta.href)"
      />
      <IconButton
        icon="pi pi-search"
        kind="outlined"
        size="medium"
        aria-label="Search"
        class="shrink-0"
      />
    </GlobalHeader.Right>
  </GlobalHeader>

  <Drawer
    v-model:open="navOpen"
    side="left"
    size="small"
  >
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent ref="navPanel">
        <PanelHeader class="hidden w-full md:flex">
          <DrawerTitle>Menu</DrawerTitle>
          <DrawerClose />
        </PanelHeader>

        <ScrollArea class="min-h-0 w-full min-w-0 flex-1">
          <Menu
            v-model:path="navPath"
            :groups="navGroups"
            aria-label="Azion"
            class="w-full p-(--spacing-md)"
            @navigate="onNavigate"
          >
            <Menu.Back />
          </Menu>
        </ScrollArea>

        <PanelFooter class="w-full px-(--spacing-md)">
          <Button
            :label="login.label"
            kind="secondary"
            size="medium"
            class="w-full"
            :href="login.href"
            @click="follow($event, login.href)"
          />
        </PanelFooter>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
