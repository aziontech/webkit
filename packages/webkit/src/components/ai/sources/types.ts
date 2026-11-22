/** One source a response drew on; its 1-based position is the number its inline citations carry. */
export interface SourcesItem {
  /** Title of the page or document, shown as the link text. */
  title: string
  /** Where the source lives; external links open in a new tab. A javascript, data or other unsafe URL is dropped and the title shows as plain text. */
  href?: string
  /** One line on what the source is (the site, the section), shown under the title. Empty shows the site of `href`. */
  description?: string
  /** Icon class of the site's mark (`az az-github`), drawn in the Sources pill and the list. Empty draws the site's first letter. */
  icon?: string
}

export function sourceAnchor(anchor: string, index: number): string {
  return `${anchor}-source-${index}`
}

export function sourceSite(item?: SourcesItem): string {
  if (!item?.href || !/^https?:\/\//i.test(item.href)) return ''
  try {
    return new URL(item.href).hostname.replace(/^www\./i, '')
  } catch {
    return ''
  }
}

export function sourceMonogram(item: SourcesItem): string {
  return (sourceSite(item) || item.title).trim().charAt(0).toUpperCase()
}
