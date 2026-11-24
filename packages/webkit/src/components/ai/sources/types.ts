import { cached, intlLocale } from '../../../composables/use-translate'
import { safeHref } from '../../../utils/safe-href'

/** One source a response drew on; its 1-based position is the number its inline citations carry. */
export interface SourcesItem {
  /** Title of the page or document, shown as the link text. */
  title: string
  /** Where the source lives; external links open in a new tab. A javascript, data or other unsafe URL is dropped and the title shows as plain text. */
  href?: string
  /** A snippet of the page or one line on what it is, kept with the source; the source lists draw the site, publisher and date instead. */
  description?: string
  /** Name of the site (`Azion`, `GitHub`), shown on the inline citation and first on the line under the title. Empty shows the host of `href` without `www.`. */
  site?: string
  /** URL of the site's favicon, drawn in a small circle. Empty, unsafe or failing to load draws `icon`, else the site's first letter on a colour of its own. */
  image?: string
  /** Icon class of the site's mark (`az az-github`), drawn when there is no `image`. */
  icon?: string
  /** Organisation behind the page (`Acme Inc.`), shown between the site and the date on the line under the title. */
  publisher?: string
  /** When the page was published, shown as a medium date in the reader's locale after the publisher; a date-only ISO string (`2026-06-16`) reads as that calendar day. */
  publishedAt?: string | number | Date
  /** `false` lists the source under More (searched, not cited in the text); left out, it counts as cited. */
  cited?: boolean
}

const HUES = [1, 2, 3, 5, 6, 7, 8] as const

export type SourcesHue = (typeof HUES)[number]

function sourceHost(item?: SourcesItem): string {
  if (!item?.href || !/^https?:\/\//i.test(item.href)) return ''
  try {
    return new URL(item.href).hostname.replace(/^www\./i, '')
  } catch {
    return ''
  }
}

export function sourceSite(item?: SourcesItem): string {
  return item?.site?.trim() || sourceHost(item)
}

export function sourceName(item?: SourcesItem): string {
  return sourceSite(item) || item?.title.trim() || ''
}

export function sourceMonogram(item: SourcesItem): string {
  return Array.from(sourceName(item))[0]?.toUpperCase() ?? ''
}

export function sourceHue(item: SourcesItem): SourcesHue {
  const key = (sourceHost(item) || sourceName(item)).toLowerCase()
  let hash = 0
  for (const char of key) hash = (hash * 31 + (char.codePointAt(0) ?? 0)) >>> 0
  return HUES[hash % HUES.length] ?? HUES[0]
}

export function sourceImage(item: SourcesItem): string {
  const value = safeHref(item.image)
  return value && !/^mailto:|^tel:/i.test(value) ? value : ''
}

export function sourceCited(item: SourcesItem): boolean {
  return item.cited !== false
}

export interface SourcesPublished {
  date: Date
  calendar: boolean
}

export function sourcePublished(item: SourcesItem): SourcesPublished | null {
  const value = item.publishedAt
  if (value === undefined || value === null || value === '') return null
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return { date, calendar: typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) }
}

export function sourceMeta(item: SourcesItem, locale: string, timeZone?: string): string {
  const published = sourcePublished(item)
  const options: Intl.DateTimeFormatOptions = {
    dateStyle: 'medium',
    timeZone: published?.calendar ? 'UTC' : timeZone
  }
  const date = published
    ? cached(
        'date',
        locale,
        options,
        () => new Intl.DateTimeFormat(intlLocale(locale), options)
      ).format(published.date)
    : ''
  const site = sourceSite(item)
  const publisher = item.publisher?.trim()
  return [site, publisher === site ? '' : publisher, date].filter(Boolean).join(' · ')
}
