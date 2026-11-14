<script setup lang="ts">
  import {
    Comment,
    computed,
    Fragment,
    type FunctionalComponent,
    h,
    isVNode,
    nextTick,
    onScopeDispose,
    provide,
    readonly,
    ref,
    shallowRef,
    Text,
    useAttrs,
    type VNode,
    watch
  } from 'vue'

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
  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import { cn } from '../../../utils/cn'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import SearchTrigger from '../../actions/search-trigger/search-trigger.vue'
  import Avatar from '../../content/avatar/avatar.vue'
  import Brand from '../../content/brand/brand.vue'
  import Breadcrumb from '../../navigation/breadcrumb/breadcrumb.vue'
  import BreadcrumbList from '../../navigation/breadcrumb/breadcrumb-list.vue'
  import BreadcrumbSeparator from '../../navigation/breadcrumb/breadcrumb-separator.vue'
  import BreadcrumbItem from '../../navigation/breadcrumb-item/breadcrumb-item.vue'
  import DropdownMenu from '../../navigation/dropdown-menu/dropdown-menu.vue'
  import DropdownMenuTrigger from '../../navigation/dropdown-menu/dropdown-menu-trigger/dropdown-menu-trigger.vue'
  import type { DropdownMenuOptionValue } from '../../navigation/dropdown-menu/injection-key'
  import type { MenuNode } from '../../navigation/menu/injection-key'
  import Menu from '../../navigation/menu/menu.vue'
  import MenuBack from '../../navigation/menu/menu-back/menu-back.vue'
  import Command from '../../overlay/command/command.vue'
  import CommandEmpty from '../../overlay/command/command-empty/command-empty.vue'
  import CommandGroup from '../../overlay/command/command-group/command-group.vue'
  import CommandInput from '../../overlay/command/command-input/command-input.vue'
  import CommandItem from '../../overlay/command/command-item/command-item.vue'
  import CommandList from '../../overlay/command/command-list/command-list.vue'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'
  import AppLayout from '../app-layout/app-layout.vue'
  import GlobalHeader from '../global-header/global-header.vue'
  import GlobalHeaderLeft from '../global-header/global-header-left.vue'
  import GlobalHeaderMiddle from '../global-header/global-header-middle.vue'
  import GlobalHeaderRight from '../global-header/global-header-right.vue'
  import Sidebar from '../sidebar/sidebar.vue'
  import {
    ConsoleLayoutInjectionKey,
    type ConsoleLayoutTrail,
    ConsoleLayoutTrailsKey
  } from './injection-key'

  defineOptions({
    name: 'ConsoleLayout',
    inheritAttrs: false
  })

  /** One row of the console navigation; an in-app `href` is followed with the app's router. */
  export type ConsoleLayoutNavItem = AppNavItem

  /** A titled section of the console navigation. */
  export type ConsoleLayoutNavGroup = AppNavGroup

  /** One segment of the header trail; the last one is the current page. */
  export type ConsoleLayoutCrumb = {
    /** Visible segment text. */
    label: string
    /** Where the segment leads; an in-app path is followed with the app's router. */
    href?: string
  }

  /** The signed-in account. */
  export type ConsoleLayoutAccount = {
    /** Display name, shown in the rail and used for the avatar initials. */
    name: string
    /** Email, shown under the name in the account menu. */
    email?: string
    /** Avatar image URL. */
    src?: string
  }

  interface Props {
    /** The navigation tree: groups of rows, each with an id, a label and an `href`. */
    navigation?: ConsoleLayoutNavGroup[]
    /** Id of the current row. Empty matches the current route against each row's `href`. */
    activeId?: string
    /** The trail shown in the header on wide layouts; the last one is the current page. */
    breadcrumbs?: ConsoleLayoutCrumb[]
    /** Where the brand mark links. */
    home?: string
    /** The signed-in account, shown at the foot of the rail and as the header avatar. */
    account?: ConsoleLayoutAccount
    /** Accessible name of the navigation landmark. Empty uses the locale catalog (`Main navigation`). */
    ariaLabel?: string
    /** Placeholder of the palette's input. Empty uses the locale catalog (`Search pages and commands`). */
    searchPlaceholder?: string
    /** Title of the tools region (help, notifications). Empty uses the AppLayout catalog (`Help`). */
    toolsLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    navigation: () => [],
    activeId: '',
    breadcrumbs: () => [],
    home: '/',
    account: undefined,
    ariaLabel: '',
    searchPlaceholder: '',
    toolsLabel: ''
  })

  const emit = defineEmits<{
    /** A navigation row or a palette page was chosen; the layout then follows its `href`. */
    navigate: [event: globalThis.MouseEvent | globalThis.KeyboardEvent, item: ConsoleLayoutNavItem]
    /** A palette item from the `search` slot was chosen. */
    'search-select': [
      event: globalThis.MouseEvent | globalThis.KeyboardEvent,
      value: string | number
    ]
    /** An option of the `account-menu` slot was chosen, by pointer or keyboard. */
    'account-select': [
      event: globalThis.MouseEvent | globalThis.KeyboardEvent,
      value: DropdownMenuOptionValue
    ]
  }>()

  /** Whether the search palette is open. Use with `v-model:search-open`. */
  const searchOpen = defineModel<boolean>('searchOpen', { default: false })

  /** Whether the tools region is open. Use with `v-model:tools-open`. */
  const toolsOpen = defineModel<boolean>('toolsOpen', { default: false })

  /** Whether the navigation rail is expanded on wide layouts; false collapses it. Use with `v-model:navigation-expanded`. */
  const navigationExpanded = defineModel<boolean>('navigationExpanded', { default: true })

  defineSlots<{
    /** The page body, rendered inside the layout's main landmark. */
    default(): unknown
    /** The app's header actions; render them icon-only while compact. */
    actions(props: { compact: boolean; toggleTools: () => void }): unknown
    /** Content at the start of the header, before the breadcrumbs. */
    'header-start'(props: { compact: boolean }): unknown
    /** A composed trail that replaces the one built from the breadcrumbs prop. */
    breadcrumbs(): unknown
    /** Flash messages above the page. */
    notifications(): unknown
    /** The tools region's body. */
    tools(): unknown
    /** Extra palette groups listed before the navigation pages. */
    search(props: { query: string }): unknown
    /** Groups of the account menu. */
    'account-menu'(): unknown
  }>()

  const { currentPath, hrefOf, follow } = useAppNavigation()

  provide(ConsoleLayoutInjectionKey, {
    openSearch: () => {
      searchOpen.value = true
    },
    closeSearch: () => {
      searchOpen.value = false
    },
    searchOpen: readonly(searchOpen)
  })

  const trails = shallowRef<ConsoleLayoutTrail[]>([])

  provide(ConsoleLayoutTrailsKey, {
    add: (trail) => {
      trails.value = [...trails.value.filter((entry) => entry !== trail), trail]
    },
    remove: (trail) => {
      trails.value = trails.value.filter((entry) => entry !== trail)
    }
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ consoleLayout: en.consoleLayout })

  const query = ref('')
  const railWidth = ref<number | null>(null)
  const railCollapsed = computed({
    get: () => !navigationExpanded.value,
    set: (value: boolean) => {
      navigationExpanded.value = !value
    }
  })
  const menuPath = ref<string[]>([])
  const menuExpanded = ref<string[]>([])
  const navEl = ref<globalThis.HTMLElement | null>(null)
  const mainEl = ref<globalThis.HTMLElement | null>(null)
  const dev = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV === true

  const NAV_VALUE = 'console-layout:nav:'

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'layout-console-layout'
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

  const accountTriggerLabel = computed(() => {
    const initials = props.account?.name.trim().slice(0, 2).toUpperCase() ?? ''
    return props.account?.src || !initials
      ? t('consoleLayout.accountMenu')
      : t('consoleLayout.accountMenuFor', { initials })
  })

  const menuGroups = computed(() => toMenuGroups(props.navigation, hrefOf))

  const paletteGroups = computed(() => navPaletteGroups(props.navigation))

  const pageTrail = computed(() => trails.value[trails.value.length - 1] ?? null)

  const activeCrumbs = computed(() =>
    pageTrail.value ? pageTrail.value.items() : props.breadcrumbs
  )

  const crumbItems = computed(() =>
    activeCrumbs.value.map((crumb) => {
      const href = hrefOf(crumb)
      return href ? { label: crumb.label, href } : { label: crumb.label }
    })
  )

  const pageControl = computed(() => Boolean(pageTrail.value?.hasControl()))

  const pageKey = ref(0)

  const controlNodes = (children: unknown): VNode[] =>
    (Array.isArray(children) ? children : [children]).flatMap((child) => {
      if (!isVNode(child) || child.type === Comment || child.type === Text) return []
      if (child.type === Fragment) return controlNodes(child.children)
      return [child]
    })

  const PageCrumbControls: FunctionalComponent = () =>
    controlNodes(pageTrail.value?.control()).flatMap((node, index) => [
      ...(index ? [h(BreadcrumbSeparator, { key: `separator-${index}` })] : []),
      h('li', { key: `control-${index}`, class: 'inline-flex min-w-0 items-center' }, [node])
    ])

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

  watch([currentId, navEl], () => revealActive(), { flush: 'post' })

  watch(currentPath, (_next, previous) => {
    if (previous) pageKey.value += 1
  })

  watch(searchOpen, () => {
    query.value = ''
  })

  if (dev) {
    const warnedRoutes = new Set<string>()
    let pageObserver: globalThis.MutationObserver | null = null

    const routeOf = (href: string | null | undefined): string | null => {
      if (!href || href.startsWith('#') || !globalThis.location) return null
      try {
        const url = new globalThis.URL(href, globalThis.location.href)
        if (url.origin !== globalThis.location.origin) return null
        const path = url.pathname
        return path.length > 1 ? path.replace(/\/+$/, '') : path
      } catch {
        return null
      }
    }

    const navigationRoutes = (): Map<string, string> => {
      const routes = new Map<string, string>()
      const walk = (items: ConsoleLayoutNavItem[]) => {
        for (const item of items) {
          const route = routeOf(hrefOf(item))
          if (route && !routes.has(route)) routes.set(route, item.label)
          if (item.groups && menuPath.value.includes(item.id))
            walk(item.groups.flatMap((group) => group.items))
          if (item.children) walk(item.children)
        }
      }
      walk(props.navigation.flatMap((group) => group.items))
      return routes
    }

    const warnDuplicateDestinations = () => {
      const root = mainEl.value
      const route = currentPath.value || globalThis.location?.pathname || ''
      if (!root || warnedRoutes.has(route)) return
      const menus = [...root.querySelectorAll('[data-testid$="__levels"]')]
        .map((levels) => levels.parentElement)
        .filter((menu): menu is globalThis.HTMLElement => Boolean(menu))
      if (!menus.length) return
      const routes = navigationRoutes()
      const pairs: string[] = []
      for (const menu of menus) {
        for (const link of menu.querySelectorAll('a[href]')) {
          const target = routeOf(link.getAttribute('href'))
          const navLabel = target ? routes.get(target) : undefined
          if (!target || navLabel === undefined) continue
          const label = (
            link.querySelector('[data-testid$="__label"]')?.textContent ??
            link.textContent ??
            ''
          ).trim()
          pairs.push(`"${label}" (page Menu) and "${navLabel}" (navigation) both lead to ${target}`)
        }
      }
      if (!pairs.length) return
      warnedRoutes.add(route)
      console.warn(
        `[webkit] <ConsoleLayout>: on route "${route}" a Menu in the page body repeats the layout navigation: ${[...new Set(pairs)].join('; ')}. A destination appears once per screen: reach these pages through the resource (block platform/detail/sectioned-resource) or drop the duplicate rows (rule webkit-navigation-levels, rule 2).`
      )
    }

    watch(
      mainEl,
      (el) => {
        pageObserver?.disconnect()
        pageObserver = null
        if (!el || typeof globalThis.MutationObserver === 'undefined') return
        pageObserver = new globalThis.MutationObserver(() => warnDuplicateDestinations())
        pageObserver.observe(el, { childList: true, subtree: true })
        void nextTick(warnDuplicateDestinations)
      },
      { flush: 'post' }
    )
    watch(currentPath, () => void nextTick(warnDuplicateDestinations), { flush: 'post' })
    onScopeDispose(() => pageObserver?.disconnect())
  }

  const railScroller = (from: globalThis.HTMLElement): globalThis.HTMLElement | null => {
    const limit = from.closest('nav')
    let node = from.parentElement
    while (node && limit?.contains(node)) {
      const { overflowY } = globalThis.getComputedStyle(node)
      if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight)
        return node
      node = node.parentElement
    }
    return null
  }

  const revealActive = () => {
    const root = navEl.value
    const entry = root?.querySelector<globalThis.HTMLElement>('[aria-current="page"]')
    const scroller = root && entry ? railScroller(root) : null
    if (!entry || !scroller) return
    const style = globalThis.getComputedStyle(scroller)
    const padStart = Number.parseFloat(style.scrollPaddingTop) || 0
    const padEnd = Number.parseFloat(style.scrollPaddingBottom) || 0
    const box = scroller.getBoundingClientRect()
    const rect = entry.getBoundingClientRect()
    const delta =
      rect.top < box.top + padStart
        ? rect.top - box.top - padStart
        : rect.bottom > box.bottom - padEnd
          ? rect.bottom - box.bottom + padEnd
          : 0
    if (delta) scroller.scrollTo({ top: scroller.scrollTop + delta, behavior: 'instant' })
  }

  const onAccountSelect = (
    event: globalThis.MouseEvent | globalThis.KeyboardEvent,
    value: DropdownMenuOptionValue
  ) => {
    emit('account-select', event, value)
  }

  const activate = (
    event: globalThis.MouseEvent | globalThis.KeyboardEvent,
    item: ConsoleLayoutNavItem
  ) => {
    emit('navigate', event, item)
    follow(event, item)
  }

  const onMenuNavigate = (
    event: globalThis.MouseEvent,
    node: MenuNode,
    closeNavigation: () => void
  ) => {
    const item = leaves.value.get(node.id)
    if (!item || node.groups || node.children) return
    activate(event, item)
    closeNavigation()
  }

  const onCrumbNavigate = (event: globalThis.MouseEvent, href: string) => {
    const crumb = activeCrumbs.value.find((entry) => hrefOf(entry) === href)
    if (crumb) follow(event, crumb)
  }

  const onPageCrumbClick = (event: globalThis.MouseEvent, crumb: ConsoleLayoutCrumb) => {
    if (hrefOf(crumb)) follow(event, crumb)
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

  const onQuery = (value: unknown) => {
    query.value = typeof value === 'string' ? value : ''
  }

  const openSearch = () => {
    searchOpen.value = true
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :class="
      cn('h-dvh [--sidebar-width:var(--container-2xs)]', attrs['class'] as string | undefined)
    "
  >
    <AppLayout
      v-model:tools-open="toolsOpen"
      :navigation-label="ariaLabel || t('consoleLayout.navigation')"
      :tools-label="toolsLabel"
    >
      <template #navigation="{ drawer, closeNavigation }">
        <Sidebar
          v-model:width="railWidth"
          v-model:collapsed="railCollapsed"
          :resizable="!drawer"
          :collapsible="!drawer"
          :aria-label="ariaLabel || t('consoleLayout.navigation')"
          :data-testid="`${testId}__navigation`"
        >
          <template #header>
            <div
              class="-m-(--spacing-md) flex h-14 shrink-0 items-center border-b border-(--border-default) px-(--spacing-md)"
            >
              <a
                :href="home"
                :aria-label="t('consoleLayout.home')"
                class="flex h-6 w-fit items-center rounded-(--shape-button) px-(--spacing-xs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
              >
                <Brand
                  kind="default"
                  size="small"
                />
              </a>
            </div>
          </template>

          <div
            ref="navEl"
            class="-mt-(--spacing-xxs) pt-(--layout-boundary-start)"
          >
            <Menu
              v-model:path="menuPath"
              v-model:expanded="menuExpanded"
              :groups="menuGroups"
              :active-id="currentId"
              role="presentation"
              @navigate="(event, node) => onMenuNavigate(event, node, closeNavigation)"
            >
              <MenuBack />
            </Menu>
          </div>

          <template
            v-if="account"
            #footer
          >
            <div
              :data-testid="`${testId}__account`"
              class="flex min-w-0 items-center gap-(--spacing-xs)"
            >
              <Avatar
                :src="account.src"
                :label="account.name"
                :alt="account.name"
                size="small"
                kind="square"
              />
              <span
                dir="auto"
                class="min-w-0 flex-1 truncate text-label-sm text-(--text-default)"
                >{{ account.name }}</span
              >
              <DropdownMenu
                v-if="$slots['account-menu']"
                placement="top-end"
                @select="onAccountSelect"
              >
                <DropdownMenuTrigger>
                  <Tooltip :text="t('consoleLayout.accountMenu')">
                    <IconButton
                      icon="pi pi-ellipsis-v"
                      :ariaLabel="t('consoleLayout.accountMenu')"
                      kind="outlined"
                      size="small"
                    />
                  </Tooltip>
                </DropdownMenuTrigger>
                <slot name="account-menu" />
              </DropdownMenu>
            </div>
          </template>
        </Sidebar>
      </template>

      <template #header="{ compact, openNavigation, toggleTools }">
        <div class="@container">
          <GlobalHeader :data-testid="`${testId}__header`">
            <GlobalHeaderLeft>
              <div class="flex min-w-0 items-center justify-start gap-(--spacing-xs)">
                <template v-if="compact">
                  <Tooltip
                    :text="t('consoleLayout.openNavigation')"
                    placement="bottom"
                  >
                    <IconButton
                      icon="pi pi-bars"
                      :ariaLabel="t('consoleLayout.openNavigation')"
                      kind="outlined"
                      size="medium"
                      @click="openNavigation"
                    />
                  </Tooltip>
                  <a
                    :href="home"
                    :aria-label="t('consoleLayout.home')"
                    class="flex h-6 w-fit shrink-0 items-center @max-xs:hidden rounded-(--shape-button) px-(--spacing-xxs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                  >
                    <Brand
                      kind="default"
                      size="small"
                    />
                  </a>
                </template>
                <slot
                  name="header-start"
                  :compact="compact"
                />
                <div
                  v-if="!compact && pageControl"
                  class="-ms-(--spacing-xs) flex w-fit min-w-0 shrink"
                >
                  <Breadcrumb class="w-full">
                    <BreadcrumbList>
                      <template
                        v-for="(crumb, index) in activeCrumbs"
                        :key="`${crumb.label}-${index}`"
                      >
                        <li class="inline-flex items-center">
                          <BreadcrumbItem
                            :label="crumb.label"
                            :href="hrefOf(crumb) ?? '#'"
                            @click="(event) => onPageCrumbClick(event, crumb)"
                          />
                        </li>
                        <BreadcrumbSeparator />
                      </template>
                      <PageCrumbControls />
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
                <div
                  v-else-if="!compact && !pageTrail && $slots['breadcrumbs']"
                  class="-ms-(--spacing-xs) flex w-fit min-w-0 shrink"
                >
                  <slot name="breadcrumbs" />
                </div>
                <div
                  v-else-if="!compact && crumbItems.length"
                  class="-ms-(--spacing-xs) flex w-fit min-w-0 shrink"
                >
                  <Breadcrumb
                    :items="crumbItems"
                    class="w-full"
                    @navigate="onCrumbNavigate"
                  />
                </div>
              </div>
            </GlobalHeaderLeft>
            <GlobalHeaderMiddle />
            <GlobalHeaderRight>
              <SearchTrigger
                collapsible
                :data-testid="`${testId}__search`"
                @open="openSearch"
              />
              <slot
                name="actions"
                :compact="compact"
                :toggle-tools="toggleTools"
              />
              <DropdownMenu
                v-if="account && $slots['account-menu']"
                placement="bottom-end"
                @select="onAccountSelect"
              >
                <DropdownMenuTrigger>
                  <button
                    type="button"
                    :aria-label="accountTriggerLabel"
                    class="rounded-(--shape-button) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
                  >
                    <Avatar
                      :src="account.src"
                      :label="account.name"
                      size="medium"
                      kind="square"
                    />
                  </button>
                </DropdownMenuTrigger>
                <slot name="account-menu" />
              </DropdownMenu>
              <Avatar
                v-else-if="account"
                :src="account.src"
                :label="account.name"
                :alt="account.name"
                size="medium"
                kind="square"
              />
            </GlobalHeaderRight>
          </GlobalHeader>
        </div>
      </template>

      <template
        v-if="$slots['notifications']"
        #notifications
      >
        <slot name="notifications" />
      </template>

      <template
        v-if="$slots['tools']"
        #tools
      >
        <slot name="tools" />
      </template>

      <main
        ref="mainEl"
        :key="pageKey"
        :data-testid="`${testId}__main`"
        class="flex min-h-full min-w-0 flex-col animate-page-enter has-[>[data-layout-fill]]:h-full has-[>[data-layout-fill]]:overflow-hidden motion-reduce:animate-none [&>[data-layout-fill]]:h-auto [&>[data-layout-fill]]:min-h-0 [&>[data-layout-fill]]:flex-1"
      >
        <slot />
      </main>
    </AppLayout>

    <Command
      v-model:open="searchOpen"
      @select="onPaletteSelect"
    >
      <CommandInput
        :placeholder="searchPlaceholder || t('consoleLayout.searchPlaceholder')"
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
          :heading="group.heading || t('consoleLayout.pages')"
        >
          <CommandItem
            v-for="item in group.items"
            :key="item.id"
            :value="NAV_VALUE + item.id"
          >
            <template
              v-if="item.icon"
              #prefix
            >
              <i
                :class="item.icon"
                aria-hidden="true"
              />
            </template>
            {{ item.label }}
          </CommandItem>
        </CommandGroup>
        <CommandEmpty>{{ t('consoleLayout.searchEmpty') }}</CommandEmpty>
      </CommandList>
    </Command>
  </div>
</template>
