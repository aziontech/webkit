<script setup lang="ts">
  import { computed, onMounted, onScopeDispose, ref, shallowRef, useAttrs, watch } from 'vue'

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
  import {
    type HeadingNavigationItem,
    type HeadingOutlineItem,
    provideHeadingNavigation,
    provideHeadingOutline,
    type RegisterHeading
  } from '../../../composables/use-heading-navigation'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import SearchTrigger from '../../action/search-trigger/search-trigger.vue'
  import Brand from '../../content/brand/brand.vue'
  import AppHeader from '../../layout/app-header/app-header.vue'
  import AppHeaderBrand from '../../layout/app-header/app-header-brand.vue'
  import AppHeaderCenter from '../../layout/app-header/app-header-center.vue'
  import AppHeaderEnd from '../../layout/app-header/app-header-end.vue'
  import AppHeaderStart from '../../layout/app-header/app-header-start.vue'
  import ScrollArea from '../../layout/scroll-area/scroll-area.vue'
  import Sidebar from '../../layout/sidebar/sidebar.vue'
  import NavigationMenu from '../../navigation/navigation-menu/navigation-menu.vue'
  import NavigationMenuItem from '../../navigation/navigation-menu/navigation-menu-item.vue'
  import NavigationMenuLink from '../../navigation/navigation-menu/navigation-menu-link.vue'
  import NavigationMenuList from '../../navigation/navigation-menu/navigation-menu-list.vue'
  import type { SidebarMenuNode } from '../../navigation/sidebar-menu/injection-key'
  import SidebarMenu from '../../navigation/sidebar-menu/sidebar-menu.vue'
  import SidebarMenuBack from '../../navigation/sidebar-menu/sidebar-menu-back/sidebar-menu-back.vue'
  import Command from '../../overlay/command/command.vue'
  import CommandEmpty from '../../overlay/command/command-empty/command-empty.vue'
  import CommandGroup from '../../overlay/command/command-group/command-group.vue'
  import CommandInput from '../../overlay/command/command-input/command-input.vue'
  import CommandItem from '../../overlay/command/command-item/command-item.vue'
  import CommandList from '../../overlay/command/command-list/command-list.vue'
  import Drawer from '../../overlay/drawer/drawer.vue'
  import DrawerContent from '../../overlay/drawer/drawer-content.vue'
  import DrawerTitle from '../../overlay/drawer/drawer-title.vue'
  import PanelFooter from '../../overlay/panel/panel-footer.vue'
  import PanelHeader from '../../overlay/panel/panel-header.vue'
  import DocTableOfContents, {
    type DocTableOfContentsGroup,
    type DocTableOfContentsItem
  } from '../doc-table-of-contents/doc-table-of-contents.vue'

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

  export interface DocLayoutProps {
    /** The docs tree: groups of rows, each with an id, a label and an `href`. */
    navigation?: DocLayoutNavGroup[]
    /** Id of the current row. Empty matches the current route against each row's `href`. */
    activeId?: string
    /** The header's section links, shown from `lg`. */
    sections?: DocLayoutSection[]
    /** Where the Azion Docs mark links. */
    home?: string
    /** Complementary link groups under the outline. */
    outlineGroups?: DocTableOfContentsGroup[]
    /** Accessible name of the navigation landmark. Empty uses the locale catalog (`Documentation`). */
    ariaLabel?: string
    /** Names the top of the docs tree in the rail's Back button when a drill level is open. Empty uses the locale catalog (Docs). */
    rootLabel?: string
  }

  const props = withDefaults(defineProps<DocLayoutProps>(), {
    navigation: () => [],
    activeId: '',
    sections: () => [],
    home: '/',
    outlineGroups: () => [],
    ariaLabel: '',
    rootLabel: ''
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

  /** Whether the navigation rail is open from lg; false collapses it. Use with `v-model:navigation-open`. */
  const navigationOpen = defineModel<boolean>('navigationOpen', { default: true })

  /** The rail width in px after a drag; null uses the natural width. Use with `v-model:navigation-width`. */
  const navigationWidth = defineModel<number | null>('navigationWidth', { default: null })

  defineSlots<{
    /** The article, rendered inside the layout's main landmark. */
    default(): unknown
    /** The header's end actions after the search. */
    actions(): unknown
    /** The foot of the navigation rail and of the drawer. */
    'navigation-footer'(): unknown
    /** Content under the outline in the end rail; shown only on pages with an outline. */
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
  const headerEl = ref<globalThis.HTMLElement | null>(null)

  const NAV_VALUE = 'doc-layout:nav:'

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'doc-layout')

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

  const backLabel = computed(() =>
    menuPath.value.length > 1 ? '' : props.rootLabel || t('docLayout.root')
  )

  type RegisteredHeading = {
    el: () => Element | null
    item: () => HeadingOutlineItem | null
  }

  const headings = shallowRef<RegisteredHeading[]>([])

  const registerHeading: RegisterHeading = (el, item) => {
    const entry = { el, item }
    headings.value = [...headings.value, entry]
    return () => {
      headings.value = headings.value.filter((heading) => heading !== entry)
    }
  }

  provideHeadingOutline(registerHeading)

  const outline = computed<DocTableOfContentsItem[]>(() =>
    headings.value
      .map((heading) => ({ el: heading.el(), item: heading.item() }))
      .filter((heading): heading is { el: Element; item: HeadingOutlineItem } =>
        Boolean(heading.el && heading.item)
      )
      .sort((a, b) => (a.el.compareDocumentPosition(b.el) & 4 ? -1 : 1))
      .map((heading) => heading.item)
  )

  const activeHeading = computed(() => headingId.value || outline.value[0]?.id || '')

  watch(
    currentId,
    (id) => {
      const ancestors = navTrail(props.navigation, id).slice(0, -1)
      menuPath.value = ancestors
        .filter((item) => item.groups || item.type === 'drill')
        .map((item) => item.id)
      const inline = ancestors
        .filter((item) => item.children && !item.groups && item.type !== 'drill')
        .map((item) => item.id)
      menuExpanded.value = [...new Set([...menuExpanded.value, ...inline])]
    },
    { immediate: true }
  )

  watch(searchOpen, () => {
    query.value = ''
  })

  watch(outline, () => {
    headingId.value = ''
    onScroll()
  })

  const headerOffset = () => headerEl.value?.getBoundingClientRect().height ?? 0

  let frame = 0

  const readHeading = () => {
    frame = 0
    const line = headerOffset() + 8
    let current = ''
    for (const item of outline.value) {
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

  const jumpTo = (event: globalThis.MouseEvent, item: HeadingNavigationItem) => {
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

  provideHeadingNavigation(jumpTo)

  const activate = (
    event: globalThis.MouseEvent | globalThis.KeyboardEvent,
    item: DocLayoutNavItem
  ) => {
    emit('navigate', event, item)
    follow(event, item)
  }

  const onMenuNavigate = (event: globalThis.MouseEvent, node: SidebarMenuNode) => {
    const item = leaves.value.get(node.id)
    if (!item || node.groups || node.children) return
    activate(event, item)
    drawerOpen.value = false
  }

  const onSection = (event: globalThis.MouseEvent, section: DocLayoutSection) => {
    follow(event, section)
    drawerOpen.value = false
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
      ref="headerEl"
      class="@container sticky top-0 z-30 w-full"
    >
      <AppHeader :data-testid="`${testId}__header`">
        <AppHeaderStart>
          <div class="flex min-w-0 items-center justify-start gap-(--spacing-xs)">
            <IconButton
              v-if="navigation.length"
              icon="az az-menu"
              variant="outline"
              size="medium"
              :ariaLabel="t('docLayout.openNavigation')"
              class="shrink-0 lg:hidden"
              @click="drawerOpen = true"
            />
            <AppHeaderBrand
              :href="home"
              :aria-label="t('docLayout.home')"
              :label="t('docLayout.badge')"
            >
              <Brand
                variant="default"
                size="small"
              />
            </AppHeaderBrand>
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
        </AppHeaderStart>
        <AppHeaderCenter />
        <AppHeaderEnd>
          <SearchTrigger
            collapsible
            :label="t('docLayout.search')"
            :data-testid="`${testId}__search`"
            @open="openSearch"
          />
          <slot name="actions" />
        </AppHeaderEnd>
      </AppHeader>
    </div>

    <div class="flex min-w-0 flex-1">
      <div
        v-if="navigation.length || $slots['navigation-footer']"
        class="hidden shrink-0 lg:block"
      >
        <div
          class="sticky top-(--layout-header-height) flex h-[calc(100dvh-var(--layout-header-height))]"
        >
          <Sidebar
            v-model:open="navigationOpen"
            v-model:width="navigationWidth"
            resizable
            collapsible
            :aria-label="ariaLabel || t('docLayout.navigation')"
            :collapse-aria-label="t('docLayout.collapseNavigation')"
            :expand-aria-label="t('docLayout.expandNavigation')"
            :resize-aria-label="t('docLayout.resizeNavigation')"
            :data-testid="`${testId}__navigation`"
            class="[--sidebar-width:var(--container-2xs)]"
          >
            <SidebarMenu
              v-model:path="menuPath"
              v-model:open-keys="menuExpanded"
              :groups="menuGroups"
              :active-id="currentId"
              role="presentation"
              @navigate="onMenuNavigate"
            >
              <SidebarMenuBack :label="backLabel" />
            </SidebarMenu>
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
        v-if="outline.length"
        :data-testid="`${testId}__aside`"
        class="hidden w-(--container-3xs) shrink-0 border-s border-(--border-default) xl:block"
      >
        <div
          class="sticky top-(--layout-header-height) flex max-h-[calc(100dvh-var(--layout-header-height))] flex-col gap-(--spacing-lg) overflow-y-auto px-(--spacing-md) pt-(--spacing-md) pb-(--spacing-lg)"
        >
          <DocTableOfContents
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
      side="start"
      size="small"
    >
      <DrawerContent>
        <PanelHeader class="w-full">
          <DrawerTitle>{{ ariaLabel || t('docLayout.navigation') }}</DrawerTitle>
        </PanelHeader>
        <ScrollArea class="min-h-0 w-full min-w-0 flex-1">
          <NavigationMenu
            v-if="sectionLinks.length"
            orientation="vertical"
            :aria-label="t('docLayout.sections')"
            :data-testid="`${testId}__drawer-sections`"
            class="w-full border-b border-(--border-muted) p-(--spacing-md) lg:hidden"
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
          <SidebarMenu
            v-model:path="menuPath"
            v-model:open-keys="menuExpanded"
            :groups="menuGroups"
            :active-id="currentId"
            :aria-label="ariaLabel || t('docLayout.navigation')"
            class="w-full p-(--spacing-md)"
            @navigate="onMenuNavigate"
          >
            <SidebarMenuBack :label="backLabel" />
          </SidebarMenu>
        </ScrollArea>
        <PanelFooter
          v-if="$slots['navigation-footer']"
          class="w-full px-(--spacing-md)"
        >
          <slot name="navigation-footer" />
        </PanelFooter>
      </DrawerContent>
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
          :label="group.heading || t('docLayout.pages')"
        >
          <CommandItem
            v-for="item in group.items"
            :key="item.id"
            :value="NAV_VALUE + item.id"
          >
            {{ item.label }}
          </CommandItem>
        </CommandGroup>
        <CommandEmpty>{{ t('docLayout.noMatch') }}</CommandEmpty>
      </CommandList>
    </Command>
  </div>
</template>
