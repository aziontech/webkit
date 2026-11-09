<script setup lang="ts">
  import {
    type ComponentPublicInstance,
    computed,
    nextTick,
    onMounted,
    onScopeDispose,
    ref,
    useAttrs,
    watch
  } from 'vue'

  import Button from '../../actions/button/button.vue'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import Brand from '../../content/brand/brand.vue'
  import GlobalHeader from '../../layout/global-header/global-header.vue'
  import GlobalHeaderBrand from '../../layout/global-header/global-header-brand.vue'
  import GlobalHeaderLeft from '../../layout/global-header/global-header-left.vue'
  import GlobalHeaderMiddle from '../../layout/global-header/global-header-middle.vue'
  import GlobalHeaderRight from '../../layout/global-header/global-header-right.vue'
  import ScrollArea from '../../layout/scroll-area/scroll-area.vue'
  import type { MenuGroupNode, MenuNode } from '../../navigation/menu/injection-key'
  import Menu from '../../navigation/menu/menu.vue'
  import MenuBack from '../../navigation/menu/menu-back/menu-back.vue'
  import NavigationMenuArrow from '../../navigation/navigation-menu/navigation-menu-arrow.vue'
  import NavigationMenuContent from '../../navigation/navigation-menu/navigation-menu-content.vue'
  import NavigationMenuIcon from '../../navigation/navigation-menu/navigation-menu-icon.vue'
  import NavigationMenuItem from '../../navigation/navigation-menu/navigation-menu-item.vue'
  import NavigationMenuList from '../../navigation/navigation-menu/navigation-menu-list.vue'
  import NavigationMenuPopup from '../../navigation/navigation-menu/navigation-menu-popup.vue'
  import NavigationMenuPortal from '../../navigation/navigation-menu/navigation-menu-portal.vue'
  import NavigationMenuPositioner from '../../navigation/navigation-menu/navigation-menu-positioner.vue'
  import NavigationMenu from '../../navigation/navigation-menu/navigation-menu-root.vue'
  import NavigationMenuTrigger from '../../navigation/navigation-menu/navigation-menu-trigger.vue'
  import NavigationMenuViewport from '../../navigation/navigation-menu/navigation-menu-viewport.vue'
  import Drawer from '../../overlay/drawer/drawer.vue'
  import DrawerClose from '../../overlay/drawer/drawer-close.vue'
  import DrawerContent from '../../overlay/drawer/drawer-content.vue'
  import DrawerOverlay from '../../overlay/drawer/drawer-overlay.vue'
  import DrawerPortal from '../../overlay/drawer/drawer-portal.vue'
  import DrawerTitle from '../../overlay/drawer/drawer-title.vue'
  import PanelFooter from '../../overlay/panel/panel-footer.vue'
  import PanelHeader from '../../overlay/panel/panel-header.vue'

  defineOptions({
    name: 'SiteNav',
    inheritAttrs: false
  })

  /** A link in the bar, the sheet or a panel. */
  export type SiteNavLink = {
    /** Visible label of the link. */
    label: string
    /** Destination of the link. */
    href: string
  }

  /** One entry of a mega-menu panel. */
  export type SiteNavItem = {
    /** Visible label of the entry. */
    label: string
    /** One line under the label. */
    description?: string
    /** Destination of the entry; an entry without it links to `#`. */
    href?: string
    /** Icon class drawn before the label. */
    icon?: string
  }

  /** A labelled group of entries inside a panel column. */
  export type SiteNavGroup = {
    /** Header of the group. */
    label: string
    /** Destination the header links to; a plain header without it. */
    href?: string
    /** The entries of the group, in order. */
    items: SiteNavItem[]
  }

  /** One mega-menu of the bar. */
  export type SiteNavMenu = {
    /** Stable id of the menu. */
    value: string
    /** Label of the menu's trigger. */
    label: string
    /** The panel's columns, each holding one or more groups. */
    columns: SiteNavGroup[][]
  }

  interface Props {
    /** Where the Azion mark links. */
    home?: string
    /** The mega-menus, in bar order; each is `{ value, label, columns }` where `columns` is an array of columns, each holding groups of `{ label, href?, items }` and each item `{ label, description?, href?, icon? }`. */
    menus: SiteNavMenu[]
    /** Bar entries that open no panel, after the menus; each is `{ label, href }`. */
    links?: SiteNavLink[]
    /** Contact link set in the bar from `xl` up and last in the sheet's tree; `{ label, href }`. */
    contact?: SiteNavLink
    /** The sign-up button, filled, in the bar and in the sheet footer; `{ label, href }`. */
    primaryAction?: SiteNavLink
    /** The login button beside it, in the bar and in the sheet footer; `{ label, href }`. */
    secondaryAction?: SiteNavLink
  }

  const props = withDefaults(defineProps<Props>(), {
    home: '/',
    links: () => [],
    contact: undefined,
    primaryAction: undefined,
    secondaryAction: undefined
  })

  const attrs = useAttrs()

  const navOpen = ref(false)
  const navPath = ref<string[]>([])
  const bar = ref<ComponentPublicInstance | null>(null)
  const opener = ref<ComponentPublicInstance | null>(null)
  const columnInset = ref(0)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'sections-site-nav')

  const slug = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  const navGroups = computed<MenuGroupNode[]>(() => {
    const menuNodes: MenuNode[] = props.menus.map((menu) => {
      const groups = menu.columns.flat()
      return {
        id: menu.value,
        label: menu.label,
        kind: 'drill',
        groups: groups.map((group) => ({
          label: groups.length > 1 ? group.label : undefined,
          items: group.items.map((item) => ({
            id: [menu.value, slug(item.label)].join('-'),
            label: item.label,
            href: item.href ?? '#'
          }))
        }))
      }
    })
    const linkNodes: MenuNode[] = props.links.map((link) => ({
      id: slug(link.label),
      label: link.label,
      href: link.href
    }))
    const contactNodes: MenuNode[] = props.contact
      ? [{ id: 'contact', label: props.contact.label, href: props.contact.href }]
      : []
    return [{ items: [...menuNodes, ...linkNodes, ...contactNodes] }]
  })

  watch(navOpen, async (open) => {
    if (open) return
    navPath.value = []
    await nextTick()
    const button = opener.value?.$el as globalThis.HTMLElement | null | undefined
    button?.focus()
  })

  const onNavigate = (_event: globalThis.MouseEvent, node: MenuNode) => {
    if (!node.groups) navOpen.value = false
  }

  const readColumnInset = () => {
    const node = bar.value?.$el as globalThis.Element | globalThis.CharacterData | null | undefined
    const el = node instanceof globalThis.Element ? node : node?.nextElementSibling
    if (el) {
      columnInset.value = Number.parseFloat(globalThis.getComputedStyle(el).paddingLeft) || 0
    }
  }

  onMounted(() => {
    readColumnInset()
    globalThis.addEventListener('resize', readColumnInset, { passive: true })
  })

  onScopeDispose(() => globalThis.removeEventListener('resize', readColumnInset))
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="contents"
  >
    <GlobalHeader
      ref="bar"
      kind="site"
      aria-label="Azion"
      class="sticky top-0 z-40"
    >
      <GlobalHeaderLeft class="justify-start!">
        <IconButton
          ref="opener"
          icon="pi pi-bars"
          kind="outlined"
          size="medium"
          ariaLabel="Open navigation"
          class="shrink-0 xl:hidden"
          @click="navOpen = true"
        />
        <GlobalHeaderBrand>
          <a
            :href="home"
            aria-label="Azion home"
            class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
          >
            <Brand
              kind="default"
              size="small"
            />
          </a>
        </GlobalHeaderBrand>
      </GlobalHeaderLeft>

      <GlobalHeaderMiddle class="justify-start!">
        <NavigationMenu
          aria-label="Azion"
          class="min-w-0"
        >
          <NavigationMenuList class="hidden items-center gap-(--spacing-xxs) xl:flex">
            <NavigationMenuItem
              v-for="menu in menus"
              :key="menu.value"
              :value="menu.value"
            >
              <NavigationMenuTrigger>
                {{ menu.label }}
                <NavigationMenuIcon>
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
                </NavigationMenuIcon>
              </NavigationMenuTrigger>
              <NavigationMenuContent class="w-full">
                <div
                  :data-columns="menu.columns.length"
                  class="grid gap-x-0 gap-y-(--spacing-md) data-[columns=1]:grid-cols-1 data-[columns=2]:grid-cols-2 data-[columns=4]:grid-cols-4 data-[columns=4]:w-[calc(min(var(--layout-measure-site-header),100vw)_-_2*var(--layout-boundary-inline)_-_2*var(--spacing-md)_-_2px)]"
                >
                  <div
                    v-for="(column, index) in menu.columns"
                    :key="index"
                    class="flex flex-col gap-y-(--spacing-md)"
                  >
                    <NavigationMenuList
                      v-for="group in column"
                      :key="group.label"
                      :label="group.label"
                      :href="group.href"
                    >
                      <NavigationMenuItem
                        v-for="item in group.items"
                        :key="item.label"
                        layout="entry"
                        :href="item.href ?? '#'"
                        :description="item.description"
                        close-on-click
                      >
                        <template
                          v-if="item.icon"
                          #icon
                        >
                          <i :class="item.icon" />
                        </template>
                        {{ item.label }}
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem
              v-for="link in links"
              :key="link.label"
            >
              <NavigationMenuTrigger :href="link.href">{{ link.label }}</NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>

          <NavigationMenuPortal>
            <NavigationMenuPositioner
              side="bottom"
              align="start"
              :side-offset="12"
              :collision-padding="{ x: columnInset, y: 8 }"
            >
              <NavigationMenuPopup kind="contrast">
                <NavigationMenuArrow />
                <NavigationMenuViewport />
              </NavigationMenuPopup>
            </NavigationMenuPositioner>
          </NavigationMenuPortal>
        </NavigationMenu>
      </GlobalHeaderMiddle>

      <GlobalHeaderRight>
        <div
          v-if="contact"
          class="hidden xl:flex"
        >
          <Button
            :label="contact.label"
            kind="text"
            size="medium"
            :href="contact.href"
          />
        </div>
        <Button
          v-if="secondaryAction"
          :label="secondaryAction.label"
          kind="secondary"
          size="medium"
          :href="secondaryAction.href"
        />
        <Button
          key="button-2"
          v-if="primaryAction"
          :label="primaryAction.label"
          kind="primary"
          size="medium"
          class="shrink-0"
          :href="primaryAction.href"
        />
        <IconButton
          icon="pi pi-search"
          kind="outlined"
          size="medium"
          ariaLabel="Search"
          class="shrink-0"
        />
      </GlobalHeaderRight>
    </GlobalHeader>

    <Drawer
      v-model:open="navOpen"
      side="left"
      size="small"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
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
              <MenuBack />
            </Menu>
          </ScrollArea>

          <PanelFooter
            v-if="primaryAction || secondaryAction"
            class="w-full flex-col items-stretch px-(--spacing-md)"
          >
            <Button
              v-if="secondaryAction"
              :label="secondaryAction.label"
              kind="outlined"
              size="medium"
              class="w-full"
              :href="secondaryAction.href"
            />
            <Button
              key="button-2"
              v-if="primaryAction"
              :label="primaryAction.label"
              kind="primary"
              size="medium"
              class="w-full"
              :href="primaryAction.href"
            />
          </PanelFooter>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </div>
</template>
