export const LOCALE_PREFIXES = ['pt-BR', 'es'] as const

export type PrefixLocale = (typeof LOCALE_PREFIXES)[number]

const PREFIX = new RegExp(`^/(${LOCALE_PREFIXES.join('|')})(?=/|$)`)

export function splitLocalePath(path: string): { locale: PrefixLocale | null; path: string } {
  const match = path.match(PREFIX)
  if (!match) return { locale: null, path }
  return { locale: match[1] as PrefixLocale, path: path.slice(match[0].length) || '/' }
}

export function localePath(path: string, locale: string): string {
  const bare = splitLocalePath(path).path
  if (!(LOCALE_PREFIXES as readonly string[]).includes(locale)) return bare
  return bare === '/' ? `/${locale}` : `/${locale}${bare}`
}

export function localizedRoutes(routes: string[]): string[] {
  return routes
    .filter((route) => !route.startsWith('/frame') && route !== '/404')
    .flatMap((route) => LOCALE_PREFIXES.map((locale) => localePath(route, locale)))
}
