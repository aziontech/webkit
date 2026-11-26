import { nextTick, onScopeDispose, type Ref, watch } from 'vue'

import type {
  AppLinkTarget,
  AppNavGroup,
  AppNavItem
} from '../../../../composables/use-app-navigation'

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

const navigationRoutes = (
  navigation: AppNavGroup[],
  menuPath: string[],
  hrefOf: (link: AppLinkTarget) => string | undefined
): Map<string, string> => {
  const routes = new Map<string, string>()
  const walk = (items: AppNavItem[]) => {
    for (const item of items) {
      const route = routeOf(hrefOf(item))
      if (route && !routes.has(route)) routes.set(route, item.label)
      if (item.groups && menuPath.includes(item.id))
        walk(item.groups.flatMap((group) => group.items))
      if (item.children) walk(item.children)
    }
  }
  walk(navigation.flatMap((group) => group.items))
  return routes
}

const pageMenus = (root: globalThis.HTMLElement): globalThis.HTMLElement[] =>
  [...root.querySelectorAll('[data-testid$="__levels"]')]
    .map((levels) => levels.parentElement)
    .filter((menu): menu is globalThis.HTMLElement => Boolean(menu))

const linkLabel = (link: Element): string =>
  (link.querySelector('[data-testid$="__label"]')?.textContent ?? link.textContent ?? '').trim()

const duplicatePairs = (menus: globalThis.HTMLElement[], routes: Map<string, string>): string[] => {
  const pairs: string[] = []
  for (const menu of menus) {
    for (const link of menu.querySelectorAll('a[href]')) {
      const target = routeOf(link.getAttribute('href'))
      const navLabel = target ? routes.get(target) : undefined
      if (!target || navLabel === undefined) continue
      pairs.push(
        `"${linkLabel(link)}" (page SidebarMenu) and "${navLabel}" (navigation) both lead to ${target}`
      )
    }
  }
  return pairs
}

export function useConsoleLayoutNavAudit(
  mainEl: Ref<globalThis.HTMLElement | null>,
  currentPath: Readonly<Ref<string>>,
  navigation: () => AppNavGroup[],
  menuPath: Ref<string[]>,
  hrefOf: (link: AppLinkTarget) => string | undefined
): void {
  const warnedRoutes = new Set<string>()
  let pageObserver: globalThis.MutationObserver | null = null

  const warnDuplicateDestinations = () => {
    const root = mainEl.value
    const route = currentPath.value || globalThis.location?.pathname || ''
    if (!root || warnedRoutes.has(route)) return
    const menus = pageMenus(root)
    if (!menus.length) return
    const pairs = duplicatePairs(menus, navigationRoutes(navigation(), menuPath.value, hrefOf))
    if (!pairs.length) return
    warnedRoutes.add(route)
    console.warn(
      `[azion-ui] <ConsoleLayout>: on route "${route}" a SidebarMenu in the page body repeats the layout navigation: ` +
        `${[...new Set(pairs)].join('; ')}. ` +
        'A destination appears once per screen, and a page has only its PageTabs: ' +
        "drop the in-page menu and keep these pages in the rail or in the resource's tabs " +
        '(rule azion-ui-navigation-levels).'
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
