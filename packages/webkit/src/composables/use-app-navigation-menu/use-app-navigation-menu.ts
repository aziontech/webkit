import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  readonly,
  type Ref,
  ref,
  toValue,
  watch
} from 'vue'

import type { SidebarMenuGroupNode } from '../../components/navigation/sidebar-menu/injection-key'
import {
  type AppNavGroup,
  type AppNavItem,
  matchActiveId,
  navLeaves,
  type NavPaletteGroup,
  navPaletteGroups,
  navTrail,
  toMenuGroups,
  type UseAppNavigationReturn
} from '../use-app-navigation'

type ActivationEvent = globalThis.MouseEvent | globalThis.KeyboardEvent

export interface AppNavigationMenuEmit {
  (name: 'navigate', event: ActivationEvent, item: AppNavItem): void
  (name: 'search-select', event: ActivationEvent, value: string | number): void
}

export interface UseAppNavigationMenuOptions {
  navigation: MaybeRefOrGetter<AppNavGroup[]>
  activeId: MaybeRefOrGetter<string>
  menuPath: Ref<string[]>
  menuExpanded: Ref<string[]>
  searchOpen: Ref<boolean>
  valuePrefix: string
  emit: AppNavigationMenuEmit
}

export interface UseAppNavigationMenuReturn {
  query: Readonly<Ref<string>>
  leaves: ComputedRef<Map<string, AppNavItem>>
  currentId: ComputedRef<string>
  menuGroups: ComputedRef<SidebarMenuGroupNode[]>
  paletteGroups: ComputedRef<NavPaletteGroup[]>
  activate: (event: ActivationEvent, item: AppNavItem) => void
  onPaletteSelect: (event: ActivationEvent, value: string | number) => void
  onQuery: (value: unknown) => void
  openSearch: () => void
}

export function useAppNavigationMenu(
  { currentPath, hrefOf, follow }: UseAppNavigationReturn,
  options: UseAppNavigationMenuOptions
): UseAppNavigationMenuReturn {
  const { menuPath, menuExpanded, searchOpen, valuePrefix, emit } = options
  const navigation = () => toValue(options.navigation)

  const query = ref('')

  const leaves = computed(
    () =>
      new Map(
        navLeaves(navigation().flatMap((group) => group.items)).map((item) => [item.id, item])
      )
  )

  const currentId = computed(
    () => toValue(options.activeId) || matchActiveId(navigation(), currentPath.value, hrefOf)
  )

  const menuGroups = computed(() => toMenuGroups(navigation(), hrefOf))

  const paletteGroups = computed(() => navPaletteGroups(navigation()))

  watch(
    currentId,
    (id) => {
      const ancestors = navTrail(navigation(), id).slice(0, -1)
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

  const activate = (event: ActivationEvent, item: AppNavItem) => {
    emit('navigate', event, item)
    follow(event, item)
  }

  const onPaletteSelect = (event: ActivationEvent, value: string | number) => {
    const key = String(value)
    if (key.startsWith(valuePrefix)) {
      const item = leaves.value.get(key.slice(valuePrefix.length))
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

  return {
    query: readonly(query),
    leaves,
    currentId,
    menuGroups,
    paletteGroups,
    activate,
    onPaletteSelect,
    onQuery,
    openSearch
  }
}
