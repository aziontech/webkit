<script setup lang="ts">
  import { computed, onMounted, onScopeDispose, ref, useAttrs, watch } from 'vue'

  import {
    type AppNavGroup,
    type AppNavItem,
    matchActiveId,
    navLeaves,
    navPaletteGroups,
    navTrail,
    toMenuGroups,
    useAppNavigation
  } from '../../../composables/use-app-navigation'
  import { type HeadingNavItem, provideHeadingNav } from '../../../composables/use-heading-nav'
  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import SearchTrigger from '../../actions/search-trigger/search-trigger.vue'
  import Brand from '../../content/brand/brand.vue'
  import GlobalHeader from '../../layout/global-header/global-header.vue'
  import GlobalHeaderBrand from '../../layout/global-header/global-header-brand.vue'
  import GlobalHeaderLeft from '../../layout/global-header/global-header-left.vue'
  import GlobalHeaderRight from '../../layout/global-header/global-header-right.vue'
  import ScrollArea from '../../layout/scroll-area/scroll-area.vue'
  import Sidebar from '../../layout/sidebar/sidebar.vue'
  import type { MenuNode } from '../../navigation/menu/injection-key'
  import Menu from '../../navigation/menu/menu.vue'
  import MenuBack from '../../navigation/menu/menu-back/menu-back.vue'
  import NavigationMenuItem from '../../navigation/navigation-menu/navigation-menu-item.vue'
  import NavigationMenuLink from '../../navigation/navigation-menu/navigation-menu-link.vue'
  import NavigationMenuList from '../../navigation/navigation-menu/navigation-menu-list.vue'
  import NavigationMenu from '../../navigation/navigation-menu/navigation-menu-root.vue'
  import Command from '../../overlay/command/command.vue'
  import CommandEmpty from '../../overlay/command/command-empty/command-empty.vue'
  import CommandGroup from '../../overlay/command/command-group/command-group.vue'
  import CommandInput from '../../overlay/command/command-input/command-input.vue'
  import CommandItem from '../../overlay/command/command-item/command-item.vue'
  import CommandList from '../../overlay/command/command-list/command-list.vue'
  import Drawer from '../../overlay/drawer/drawer.vue'
  import DrawerClose from '../../overlay/drawer/drawer-close.vue'
  import DrawerContent from '../../overlay/drawer/drawer-content.vue'
  import DrawerOverlay from '../../overlay/drawer/drawer-overlay.vue'
  import DrawerPortal from '../../overlay/drawer/drawer-portal.vue'
  import DrawerTitle from '../../overlay/drawer/drawer-title.vue'
  import PanelFooter from '../../overlay/panel/panel-footer.vue'
  import PanelHeader from '../../overlay/panel/panel-header.vue'
  import DocOnThisPage, {
    type DocTocGroup,
    type DocTocItem
  } from '../doc-on-this-page/doc-on-this-page.vue'

  defineOptions({
    name: 'DocLayout',
    inheritAttrs: false
  })

  /** One row of the docs tree; an in-app `href` is followed with the app's router. */
  export type DocLayoutNavItem = AppNavItem

  /** A titled section of the docs tree. */
  export type DocLayoutNavGroup = AppNavGroup

  /** One link of the header's section bar. */
  export type DocLayoutSection = {
    /** Visible text. */
    label: string
    /** Where the segment leads; an in-app path is followed with the app's router. */
    href?: string
  }

  interface Props {
    /** The docs tree: groups of rows, each with an id, a label and an `href`. */
    navigation?: DocLayoutNavGroup[]
    /** Id of the current row. Empty matches the current route against each row's `href`. */
    activeId?: string
    /** The header's section links, shown from `lg`. */
    sections?: DocLayoutSection[]
    /** Where the Azion Docs mark links. */
    home?: string
    /** The article's headings for the On this page rail; the rail is not rendered when empty. */
    outline?: DocTocItem[]
    /** Complementary link groups under the outline. */
    outlineGroups?: DocTocGroup[]
    /** Accessible name of the navigation landmark. Empty uses the locale catalog (`Documentation`). */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    navigation: () => [],
    activeId: '',
    sections: () => [],
    home: '/',
    outline: () => [],
    outlineGroups: () => [],
    ariaLabel: ''
  })

  const emit = defineEmits<{
    /** A navigation row or a palette page was chosen; the layout then follows its `href`. */
    navigate: [event: globalThis.MouseEvent | globalThis.KeyboardEvent, item: DocLayoutNavItem]
    /** A palette item from the `search` slot was chosen. */
    'search-select': [
      event: globalThis.MouseEvent | globalThis.KeyboardEvent,
      value: string | number
    ]
  }>()

  /** Whether the search palette is open. Use with `v-model:search-open`. */
  const searchOpen = defineModel<boolean>('searchOpen', { default: false })

  const slots = defineSlots<{
    /** The article, rendered inside the layout's main landmark. */
    default(): unknown
    /** The header's end actions after the search. */
    actions(): unknown
    /** The foot of the navigation rail and of the drawer. */
    'navigation-footer'(): unknown
    /** Content under the outline in the end rail. */
    aside(): unknown
    /** The footer under the article. */
    footer(): unknown
    /** Extra palette groups listed before the navigation pages. */
    search(props: { query: string }): unknown
  }>()

  const { currentPath, hrefOf, follow } = useAppNavigation()

  const attrs = useAttrs()
  const { t } = useTranslate({ docLayout: en.docLayout })

  const query = ref('')
  const drawerOpen = ref(false)
  const menuExpanded = ref<string[]>([])
  const menuPath = ref<string[]>([])
  const headingId = ref('')
  const header = ref<globalThis.HTMLElement | null>(null)

  const NAV_VALUE = 'doc-layout:nav:'

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'documentation-doc-layout'
  )

  const leaves = computed(
    () =>
      new Map(
        navLeaves(props.navigation.flatMap((group) => group.items)).map((item) => [item.id, item])
      )
  )

  const currentId = computed(
    () => props.activeId || matchActiveId(props.navigation, currentPath.value, hrefOf)
  )

  const menuGroups = computed(() => toMenuGroups(props.navigation, hrefOf))

  const paletteGroups = computed(() => navPaletteGroups(props.navigation))

  const sectionLinks = computed(() =>
    props.sections.map((section) => ({ ...section, url: hrefOf(section) ?? '#' }))
  )

  const hasEndRail = () => props.outline.length > 0 || Boolean(slots.aside)

  const activeHeading = computed(() => headingId.value || props.outline[0]?.id || '')

  watch(
    currentId,
    (id) => {
      const ancestors = navTrail(props.navigation, id).slice(0, -1)
      menuPath.value = ancestors
        .filter((item) => item.groups || item.kind === 'drill')
        .map((item) => item.id)
      const inline = ancestors
        .filter((item) => item.children && !item.groups && item.kind !== 'drill')
        .map((item) => item.id)
      menuExpanded.value = [...new Set([...menuExpanded.value, ...inline])]
    },
    { immediate: true }
  )

  watch(searchOpen, () => {
    query.value = ''
  })

  watch(
    () => props.outline,
    () => {
      headingId.value = ''
    }
  )

  const headerOffset = () => header.value?.getBoundingClientRect().height ?? 0

  let frame = 0

  const readHeading = () => {
    frame = 0
    const line = headerOffset() + 8
    let current = ''
    for (const item of props.outline) {
      const el = globalThis.document?.getElementById(item.id)
      if (!el) continue
      if (el.getBoundingClientRect().top <= line) current = item.id
      else break
    }
    headingId.value = current
  }

  const onScroll = () => {
    if (!frame) frame = globalThis.requestAnimationFrame(readHeading)
  }

  onMounted(() => {
    readHeading()
    globalThis.addEventListener('scroll', onScroll, { passive: true })
  })

  onScopeDispose(() => {
    globalThis.removeEventListener?.('scroll', onScroll)
    if (frame) globalThis.cancelAnimationFrame(frame)
  })

  const jumpTo = (event: globalThis.MouseEvent, item: HeadingNavItem) => {
    const el = globalThis.document?.getElementById(item.id)
    if (!el) return
    event.preventDefault()
    const reduce = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const top = el.getBoundingClientRect().top + globalThis.scrollY - headerOffset() - 16
    globalThis.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
    globalThis.history?.replaceState(globalThis.history.state, '', `#${item.id}`)
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
    el.focus({ preventScroll: true })
    headingId.value = item.id
  }

  provideHeadingNav(jumpTo)

  const activate = (
    event: globalThis.MouseEvent | globalThis.KeyboardEvent,
    item: DocLayoutNavItem
  ) => {
    emit('navigate', event, item)
    follow(event, item)
  }

  const onMenuNavigate = (event: globalThis.MouseEvent, node: MenuNode) => {
    const item = leaves.value.get(node.id)
    if (!item || node.groups || node.children) return
    activate(event, item)
    drawerOpen.value = false
  }

  const onSection = (event: globalThis.MouseEvent, section: DocLayoutSection) => {
    follow(event, section)
  }

  const onQuery = (value: unknown) => {
    query.value = typeof value === 'string' ? value : ''
  }

  const openSearch = () => {
    searchOpen.value = true
  }

  const onPaletteSelect = (
    event: globalThis.MouseEvent | globalThis.KeyboardEvent,
    value: string | number
  ) => {
    const key = String(value)
    if (key.startsWith(NAV_VALUE)) {
      const item = leaves.value.get(key.slice(NAV_VALUE.length))
      if (item) activate(event, item)
      return
    }
    emit('search-select', event, value)
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex min-h-dvh w-full min-w-0 flex-col bg-(--bg-canvas) text-(--text-default)"
  >
    <div
      ref="header"
      class="@container sticky top-0 z-30 w-full"
    >
      <GlobalHeader :data-testid="`${testId}__header`">
        <GlobalHeaderLeft>
          <div class="flex min-w-0 items-center justify-start gap-(--spacing-xs)">
            <IconButton
              v-if="navigation.length"
              icon="pi pi-bars"
              kind="outlined"
              size="medium"
              :ariaLabel="t('docLayout.openNavigation')"
              class="shrink-0 lg:hidden"
              @click="drawerOpen = true"
            />
            <GlobalHeaderBrand>
              <a
                :href="home"
                :aria-label="t('docLayout.home')"
                class="inline-flex w-fit items-center gap-(--spacing-xs) rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
              >
                <Brand
                  kind="default"
                  size="small"
                />
                <span
                  aria-hidden="true"
                  class="rounded-(--shape-elements) border border-(--border-muted) px-(--spacing-xxs) text-overline-sm text-(--text-muted)"
                  >{{ t('docLayout.badge') }}</span
                >
              </a>
            </GlobalHeaderBrand>
            <NavigationMenu
              v-if="sectionLinks.length"
              :aria-label="t('docLayout.sections')"
              class="ms-(--spacing-xs) hidden shrink-0 lg:flex"
            >
              <NavigationMenuList>
                <NavigationMenuItem
                  v-for="section in sectionLinks"
                  :key="section.label"
                >
                  <NavigationMenuLink
                    :href="section.url"
                    @click="(event: globalThis.MouseEvent) => onSection(event, section)"
                    >{{ section.label }}</NavigationMenuLink
                  >
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </GlobalHeaderLeft>
        <GlobalHeaderRight>
          <SearchTrigger
            collapsible
            :label="t('docLayout.search')"
            :data-testid="`${testId}__search`"
            @open="openSearch"
          />
          <slot name="actions" />
        </GlobalHeaderRight>
      </GlobalHeader>
    </div>

    <div class="flex min-w-0 flex-1">
      <div
        v-if="navigation.length || $slots['navigation-footer']"
        class="hidden w-(--container-2xs) shrink-0 lg:block"
      >
        <div
          class="sticky top-(--layout-header-height) flex h-[calc(100dvh-var(--layout-header-height))]"
        >
          <Sidebar
            :aria-label="ariaLabel || t('docLayout.navigation')"
            :data-testid="`${testId}__navigation`"
            class="w-full"
          >
            <Menu
              v-model:path="menuPath"
              v-model:expanded="menuExpanded"
              :groups="menuGroups"
              :active-id="currentId"
              role="presentation"
              @navigate="onMenuNavigate"
            >
              <MenuBack />
            </Menu>
            <template
              v-if="$slots['navigation-footer']"
              #footer
            >
              <slot name="navigation-footer" />
            </template>
          </Sidebar>
        </div>
      </div>

      <div class="flex min-w-0 flex-1 flex-col">
        <main
          :data-testid="`${testId}__main`"
          class="flex min-w-0 flex-1 flex-col"
        >
          <slot />
        </main>
        <slot name="footer" />
      </div>

      <aside
        v-if="hasEndRail()"
        :data-testid="`${testId}__aside`"
        class="hidden w-(--container-3xs) shrink-0 border-s border-(--border-default) xl:block"
      >
        <div
          class="sticky top-(--layout-header-height) flex max-h-[calc(100dvh-var(--layout-header-height))] flex-col gap-(--spacing-lg) overflow-y-auto px-(--spacing-md) pt-(--spacing-md) pb-(--spacing-lg)"
        >
          <DocOnThisPage
            v-if="outline.length"
            :items="outline"
            :groups="outlineGroups"
            :active-id="activeHeading"
            @select="jumpTo"
          />
          <slot name="aside" />
        </div>
      </aside>
    </div>

    <Drawer
      v-if="navigation.length"
      v-model:open="drawerOpen"
      side="left"
      size="small"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <PanelHeader class="w-full">
            <DrawerTitle>{{ ariaLabel || t('docLayout.navigation') }}</DrawerTitle>
            <DrawerClose />
          </PanelHeader>
          <ScrollArea class="min-h-0 w-full min-w-0 flex-1">
            <Menu
              v-model:path="menuPath"
              v-model:expanded="menuExpanded"
              :groups="menuGroups"
              :active-id="currentId"
              :aria-label="ariaLabel || t('docLayout.navigation')"
              class="w-full p-(--spacing-md)"
              @navigate="onMenuNavigate"
            >
              <MenuBack />
            </Menu>
          </ScrollArea>
          <PanelFooter
            v-if="$slots['navigation-footer']"
            class="w-full px-(--spacing-md)"
          >
            <slot name="navigation-footer" />
          </PanelFooter>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>

    <Command
      v-model:open="searchOpen"
      @select="onPaletteSelect"
    >
      <CommandInput
        :placeholder="t('docLayout.search')"
        @update:model-value="onQuery"
      />
      <CommandList>
        <slot
          name="search"
          :query="query"
        />
        <CommandGroup
          v-for="group in paletteGroups"
          :key="group.key"
          :heading="group.heading || t('docLayout.pages')"
        >
          <CommandItem
            v-for="item in group.items"
            :key="item.id"
            :value="NAV_VALUE + item.id"
          >
            {{ item.label }}
          </CommandItem>
        </CommandGroup>
        <CommandEmpty>{{ t('docLayout.searchEmpty') }}</CommandEmpty>
      </CommandList>
    </Command>
  </div>
</template>
