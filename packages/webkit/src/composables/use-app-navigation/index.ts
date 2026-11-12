import {
  computed,
  getCurrentInstance,
  onMounted,
  onScopeDispose,
  readonly,
  type Ref,
  ref
} from 'vue'

import type {
  MenuGroupNode,
  MenuNode,
  MenuSubKind
} from '../../components/navigation/menu/injection-key'

/** An in-app route: a path string or a router location object, resolved by the app's router. */
export type AppRouteTarget = string | Record<string, unknown>

/** One row of a layout's navigation tree. */
export interface AppNavItem {
  /** Stable identity of the row; the active row is matched by it. */
  id: string
  /** Visible row text. */
  label: string
  /** Leading glyph class. */
  icon?: string
  /** A plain URL; the row is an anchor to it. */
  href?: string
  /** An in-app route; followed with the app's router when one is installed, otherwise used as the URL. */
  to?: AppRouteTarget
  /** Link target when the row is an anchor. */
  target?: '_self' | '_blank'
  /** Short text in the row's trailing badge (`Preview`). */
  tagValue?: string
  /** Blocks activation of the row. */
  disabled?: boolean
  /** Whether the children expand in place or replace the menu. */
  kind?: MenuSubKind
  /** Initial state of an inline row that owns children. */
  defaultOpen?: boolean
  /** Nested rows. */
  children?: AppNavItem[]
  /** Sections of a drilled level; drill only, wins over children. */
  groups?: AppNavGroup[]
}

/** A titled section of the navigation tree. */
export interface AppNavGroup {
  /** Header text; omit for an unlabeled block. */
  label?: string
  /** Rows of the section. */
  items: AppNavItem[]
}

/** A link with a plain URL or an in-app route. */
export interface AppLinkTarget {
  /** A plain URL. */
  href?: string
  /** An in-app route. */
  to?: AppRouteTarget
}

interface AppRouter {
  push: (to: AppRouteTarget) => unknown
  resolve: (to: AppRouteTarget) => { href: string }
  currentRoute: Ref<{ path: string }>
}

export interface UseAppNavigationReturn {
  currentPath: Readonly<Ref<string>>
  hrefOf: (link: AppLinkTarget) => string | undefined
  follow: (event: Event, link: AppLinkTarget) => void
}

const isRouter = (value: unknown): value is AppRouter =>
  typeof value === 'object' &&
  value !== null &&
  'push' in value &&
  'resolve' in value &&
  'currentRoute' in value

export function useAppNavigation(): UseAppNavigationReturn {
  const instance = getCurrentInstance()
  const candidate: unknown = instance?.appContext.config.globalProperties['$router']
  const router = isRouter(candidate) ? candidate : null
  const locationPath = ref('')

  const readLocation = () => {
    locationPath.value = globalThis.location?.pathname ?? ''
  }

  if (!router && instance) {
    onMounted(() => {
      readLocation()
      globalThis.addEventListener('popstate', readLocation)
    })
    onScopeDispose(() => globalThis.removeEventListener?.('popstate', readLocation))
  }

  const currentPath = computed(() => (router ? router.currentRoute.value.path : locationPath.value))

  const hrefOf = (link: AppLinkTarget): string | undefined => {
    if (link.href) return link.href
    if (link.to === undefined) return undefined
    if (router) return router.resolve(link.to).href
    return typeof link.to === 'string' ? link.to : undefined
  }

  const follow = (event: Event, link: AppLinkTarget) => {
    const onAnchor =
      event.type === 'click' &&
      event.target instanceof globalThis.Element &&
      Boolean(event.target.closest('a[href]'))
    const newTab =
      event instanceof globalThis.MouseEvent &&
      (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
    if (onAnchor && newTab) return
    if (link.to !== undefined && router) {
      event.preventDefault()
      void router.push(link.to)
      return
    }
    if (onAnchor) return
    const href = hrefOf(link)
    if (href) globalThis.location?.assign(href)
  }

  return { currentPath: readonly(currentPath), hrefOf, follow }
}

export const navLeaves = (items: AppNavItem[]): AppNavItem[] =>
  items.flatMap((item) => {
    if (item.groups) return navLeaves(item.groups.flatMap((group) => group.items))
    if (item.children) return navLeaves(item.children)
    return [item]
  })

export const navTrail = (groups: AppNavGroup[], id: string): AppNavItem[] => {
  const walk = (items: AppNavItem[], trail: AppNavItem[]): AppNavItem[] | null => {
    for (const item of items) {
      if (item.id === id) return [...trail, item]
      const nested = item.groups ? item.groups.flatMap((group) => group.items) : item.children
      if (nested) {
        const found = walk(nested, [...trail, item])
        if (found) return found
      }
    }
    return null
  }
  return (
    walk(
      groups.flatMap((group) => group.items),
      []
    ) ?? []
  )
}

const pathOf = (href: string): string | null => {
  if (!href.startsWith('/') || href.startsWith('//')) return null
  const end = href.search(/[?#]/)
  const path = end === -1 ? href : href.slice(0, end)
  return path.length > 1 ? path.replace(/\/+$/, '') : path
}

export const matchActiveId = (
  groups: AppNavGroup[],
  currentPath: string,
  hrefOf: (link: AppLinkTarget) => string | undefined
): string => {
  const here = pathOf(currentPath)
  if (!here) return ''
  let best = ''
  let bestLength = -1
  for (const item of navLeaves(groups.flatMap((group) => group.items))) {
    const href = hrefOf(item)
    const path = href ? pathOf(href) : null
    if (!path) continue
    const exact = path === here
    const prefix = path !== '/' && here.startsWith(`${path}/`)
    if (!exact && !prefix) continue
    const score = exact ? path.length + 1 : path.length
    if (score > bestLength) {
      best = item.id
      bestLength = score
    }
  }
  return best
}

export const toMenuGroups = (
  groups: AppNavGroup[],
  hrefOf: (link: AppLinkTarget) => string | undefined
): MenuGroupNode[] => {
  const toNode = (item: AppNavItem): MenuNode => {
    const node: MenuNode = { id: item.id, label: item.label }
    if (item.icon) node.icon = item.icon
    if (item.target) node.target = item.target
    if (item.tagValue) node.tagValue = item.tagValue
    if (item.disabled) node.disabled = item.disabled
    if (item.kind) node.kind = item.kind
    if (item.defaultOpen) node.defaultOpen = item.defaultOpen
    if (item.groups) {
      node.groups = item.groups.map((group) => ({
        label: group.label,
        items: group.items.map(toNode)
      }))
    } else if (item.children) {
      node.children = item.children.map(toNode)
    } else {
      const href = hrefOf(item)
      if (href) node.href = href
    }
    return node
  }
  return groups.map((group) => ({ label: group.label, items: group.items.map(toNode) }))
}

export interface NavPaletteGroup {
  key: string
  heading: string
  items: AppNavItem[]
}

export const navPaletteGroups = (groups: AppNavGroup[]): NavPaletteGroup[] =>
  groups.flatMap((group, groupIndex) => {
    const blocks: NavPaletteGroup[] = []
    let run: AppNavItem[] = []
    const flush = () => {
      const items = navLeaves(run).filter((item) => !item.disabled && (item.href || item.to))
      if (items.length) {
        blocks.push({
          key: `group-${groupIndex}-${blocks.length}`,
          heading: group.label ?? '',
          items
        })
      }
      run = []
    }
    for (const item of group.items) {
      if (item.groups || item.children) {
        flush()
        const items = navLeaves([item]).filter((leaf) => !leaf.disabled && (leaf.href || leaf.to))
        if (items.length) blocks.push({ key: `item-${item.id}`, heading: item.label, items })
      } else run.push(item)
    }
    flush()
    return blocks
  })
