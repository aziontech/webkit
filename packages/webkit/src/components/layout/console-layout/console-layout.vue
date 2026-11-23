<script setup lang="ts">
  import { computed, provide, proxyRefs, readonly, ref, shallowRef, useAttrs, watch } from 'vue'

  import {
    type AppNavGroup,
    type AppNavItem,
    useAppNavigation
  } from '../../../composables/use-app-navigation'
  import { useAppNavigationMenu } from '../../../composables/use-app-navigation-menu'
  import { useShortcuts } from '../../../composables/use-shortcuts'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { cn } from '../../../utils/cn'
  import { initials } from '../../../utils/initials'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import SearchTrigger from '../../action/search-trigger/search-trigger.vue'
  import Avatar from '../../content/avatar/avatar.vue'
  import Brand from '../../content/brand/brand.vue'
  import type { BreadcrumbItemData } from '../../navigation/breadcrumb/breadcrumb.vue'
  import DropdownMenu from '../../navigation/dropdown-menu/dropdown-menu.vue'
  import DropdownMenuTrigger from '../../navigation/dropdown-menu/dropdown-menu-trigger/dropdown-menu-trigger.vue'
  import type { DropdownMenuItemValue } from '../../navigation/dropdown-menu/injection-key'
  import type { SidebarMenuNode } from '../../navigation/sidebar-menu/injection-key'
  import SidebarMenu from '../../navigation/sidebar-menu/sidebar-menu.vue'
  import SidebarMenuBack from '../../navigation/sidebar-menu/sidebar-menu-back/sidebar-menu-back.vue'
  import ShortcutsDialog from '../../overlay/shortcuts-dialog/shortcuts-dialog.vue'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'
  import AppHeader from '../app-header/app-header.vue'
  import AppHeaderAccount from '../app-header/app-header-account.vue'
  import AppHeaderBrand from '../app-header/app-header-brand.vue'
  import AppHeaderCenter from '../app-header/app-header-center.vue'
  import AppHeaderEnd from '../app-header/app-header-end.vue'
  import AppHeaderStart from '../app-header/app-header-start.vue'
  import AppLayout from '../app-layout/app-layout.vue'
  import Sidebar from '../sidebar/sidebar.vue'
  import { useConsoleLayoutNavAudit } from './composables/use-console-layout-nav-audit'
  import {
    ConsoleLayoutInjectionKey,
    type ConsoleLayoutTrail,
    ConsoleLayoutTrailsInjectionKey
  } from './injection-key'
  import { revealActive } from './lib/reveal-active'
  import ConsoleLayoutHeaderStart from './parts/console-layout-header-start.vue'
  import ConsoleLayoutPalette from './parts/console-layout-palette.vue'

  defineOptions({
    name: 'ConsoleLayout',
    inheritAttrs: false
  })

  export type { BreadcrumbItemData }

  /** One row of the console navigation; an in-app `href` is followed with the app's router. */
  export type ConsoleLayoutNavItem = AppNavItem

  /** A titled section of the console navigation. */
  export type ConsoleLayoutNavGroup = AppNavGroup

  /** The signed-in account. */
  export type ConsoleLayoutAccount = {
    /** Display name, shown in the rail and used for the avatar initials. */
    name: string
    /** Email, shown under the name in the account menu. */
    email?: string
    /** Avatar image URL. */
    src?: string
  }

  export interface ConsoleLayoutProps {
    /** The navigation tree: groups of rows, each with an id, a label and an `href`. */
    navigation?: ConsoleLayoutNavGroup[]
    /** Id of the current row. Empty matches the current route against each row's `href`. */
    activeId?: string
    /** The trail shown in the header on wide layouts; the last one is the current page. */
    breadcrumbs?: BreadcrumbItemData[]
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

  const props = withDefaults(defineProps<ConsoleLayoutProps>(), {
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
      value: DropdownMenuItemValue
    ]
  }>()

  /** Whether the search palette is open. Use with `v-model:search-open`. */
  const searchOpen = defineModel<boolean>('searchOpen', { default: false })

  /** Whether the tools region is open. Use with `v-model:tools-open`. */
  const toolsOpen = defineModel<boolean>('toolsOpen', { default: false })

  /** Whether the navigation rail is shown on wide layouts; false collapses it. Use with `v-model:navigation-open`. */
  const navigationOpen = defineModel<boolean>('navigationOpen', { default: true })

  defineSlots<{
    /** The page body, rendered inside the layout's main landmark. */
    default(): unknown
    /** The app's header actions; render them icon-only while compact. */
    actions(props: { compact: boolean; toggleTools: () => void }): unknown
    /** Content at the start of the header, before the breadcrumbs. */
    'header-leading'(props: { compact: boolean }): unknown
    /** Content in the rail under the wordmark, above the navigation; compact is true in the compact drawer. */
    'sidebar-header'(props: { compact: boolean }): unknown
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

  provide(ConsoleLayoutTrailsInjectionKey, {
    add: (trail) => {
      trails.value = [...trails.value.filter((entry) => entry !== trail), trail]
    },
    remove: (trail) => {
      trails.value = trails.value.filter((entry) => entry !== trail)
    }
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ consoleLayout: en.consoleLayout })

  useShortcuts({ keys: 'meta+k', label: () => t('consoleLayout.searchShortcut') })

  const railWidth = ref<number | null>(null)
  const menuPath = ref<string[]>([])
  const menuExpanded = ref<string[]>([])
  const navEl = ref<globalThis.HTMLElement | null>(null)
  const mainEl = ref<globalThis.HTMLElement | null>(null)
  const dev = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV === true

  const NAV_VALUE = 'console-layout:nav:'

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'console-layout')

  const appNavigation = useAppNavigation()
  const { currentPath, hrefOf, follow } = appNavigation

  const appMenu = proxyRefs(
    useAppNavigationMenu(appNavigation, {
      navigation: () => props.navigation,
      activeId: () => props.activeId,
      menuPath,
      menuExpanded,
      searchOpen,
      valuePrefix: NAV_VALUE,
      emit
    })
  )

  const accountTriggerLabel = computed(() => {
    const short = initials(props.account?.name ?? '')
    return props.account?.src || !short
      ? t('consoleLayout.accountMenu')
      : t('consoleLayout.accountMenuFor', { initials: short })
  })

  const pageTrail = computed(() => trails.value[trails.value.length - 1] ?? null)

  const pageKey = ref(0)

  watch([() => appMenu.currentId, navEl], () => revealActive(navEl.value), { flush: 'post' })

  watch(currentPath, (_next, previous) => {
    if (previous) pageKey.value += 1
  })

  if (dev) useConsoleLayoutNavAudit(mainEl, currentPath, () => props.navigation, menuPath, hrefOf)

  const onMenuNavigate = (
    event: globalThis.MouseEvent,
    node: SidebarMenuNode,
    closeNavigation: () => void
  ) => {
    const item = appMenu.leaves.get(node.id)
    if (!item || node.groups || node.children) return
    appMenu.activate(event, item)
    closeNavigation()
  }

  const MAIN_CLASS =
    'flex min-h-full min-w-0 flex-col animate-page-enter ' +
    'has-[>[data-layout-fill]]:h-full has-[>[data-layout-fill]]:overflow-hidden ' +
    'motion-reduce:animate-none ' +
    '[&>[data-layout-fill]]:h-auto [&>[data-layout-fill]]:min-h-0 [&>[data-layout-fill]]:flex-1'
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
      :navigation-aria-label="ariaLabel || t('consoleLayout.navigation')"
      :tools-label="toolsLabel"
    >
      <template #navigation="{ drawer, closeNavigation }">
        <Sidebar
          v-model:width="railWidth"
          v-model:open="navigationOpen"
          :resizable="!drawer"
          :collapsible="!drawer"
          :shortcut="!drawer"
          :aria-label="ariaLabel || t('consoleLayout.navigation')"
          :data-testid="`${testId}__navigation`"
        >
          <template #header>
            <div class="-m-(--spacing-md) flex flex-col">
              <div
                class="flex h-14 shrink-0 items-center border-b border-(--border-default) px-(--spacing-md)"
              >
                <AppHeaderBrand
                  :href="home"
                  :aria-label="t('consoleLayout.home')"
                  class="px-(--spacing-xs)"
                >
                  <Brand
                    variant="default"
                    size="small"
                  />
                </AppHeaderBrand>
              </div>
              <div
                v-if="$slots['sidebar-header']"
                :data-testid="`${testId}__sidebar-header`"
                class="p-(--spacing-md) empty:hidden"
              >
                <slot
                  name="sidebar-header"
                  :compact="drawer"
                />
              </div>
            </div>
          </template>

          <div
            ref="navEl"
            class="-mt-(--spacing-2xs) pt-(--layout-boundary-start)"
          >
            <SidebarMenu
              v-model:path="menuPath"
              v-model:open-keys="menuExpanded"
              :groups="appMenu.menuGroups"
              :active-id="appMenu.currentId"
              role="presentation"
              @navigate="(event, node) => onMenuNavigate(event, node, closeNavigation)"
            >
              <SidebarMenuBack />
            </SidebarMenu>
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
                variant="square"
              />
              <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-default)"
                ><bdi>{{ account.name }}</bdi></span
              >
              <DropdownMenu
                v-if="$slots['account-menu']"
                side="top"
                align="end"
                @select="(event, value) => emit('account-select', event, value)"
              >
                <DropdownMenuTrigger>
                  <Tooltip :content="t('consoleLayout.accountMenu')">
                    <IconButton
                      icon="az az-ellipsis-vertical"
                      :ariaLabel="t('consoleLayout.accountMenu')"
                      variant="outline"
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
          <AppHeader :data-testid="`${testId}__header`">
            <AppHeaderStart>
              <ConsoleLayoutHeaderStart
                :compact="compact"
                :home="home"
                :home-label="t('consoleLayout.home')"
                :open-navigation-label="t('consoleLayout.openNavigation')"
                :trail="pageTrail"
                :breadcrumbs="breadcrumbs"
                :href-of="hrefOf"
                :follow="follow"
                :layout-test-id="testId"
                @open-navigation="openNavigation"
              >
                <template #header-leading>
                  <slot
                    name="header-leading"
                    :compact="compact"
                  />
                </template>
                <template
                  v-if="$slots['breadcrumbs']"
                  #breadcrumbs
                >
                  <slot name="breadcrumbs" />
                </template>
              </ConsoleLayoutHeaderStart>
            </AppHeaderStart>
            <AppHeaderCenter />
            <AppHeaderEnd>
              <SearchTrigger
                collapsible
                :data-testid="`${testId}__search`"
                @open="appMenu.openSearch"
              />
              <slot
                name="actions"
                :compact="compact"
                :toggle-tools="toggleTools"
              />
              <DropdownMenu
                v-if="account && $slots['account-menu']"
                side="bottom"
                align="end"
                @select="(event, value) => emit('account-select', event, value)"
              >
                <DropdownMenuTrigger>
                  <AppHeaderAccount
                    :src="account.src"
                    :name="account.name"
                    :aria-label="accountTriggerLabel"
                  />
                </DropdownMenuTrigger>
                <slot name="account-menu" />
              </DropdownMenu>
              <Avatar
                v-else-if="account"
                :src="account.src"
                :label="account.name"
                :alt="account.name"
                size="medium"
                variant="square"
              />
            </AppHeaderEnd>
          </AppHeader>
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
        :class="MAIN_CLASS"
      >
        <slot />
      </main>
    </AppLayout>

    <ConsoleLayoutPalette
      v-model:open="searchOpen"
      :placeholder="searchPlaceholder || t('consoleLayout.searchPlaceholder')"
      :pages-label="t('consoleLayout.pages')"
      :no-match-label="t('consoleLayout.noMatch')"
      :groups="appMenu.paletteGroups"
      :value-prefix="NAV_VALUE"
      @select="appMenu.onPaletteSelect"
      @query="appMenu.onQuery"
    >
      <template #search>
        <slot
          name="search"
          :query="appMenu.query"
        />
      </template>
    </ConsoleLayoutPalette>
    <ShortcutsDialog :data-testid="`${testId}__shortcuts`" />
  </div>
</template>
