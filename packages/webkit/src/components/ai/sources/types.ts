/** One source a response drew on; its 1-based position is the number its inline citations show. */
export interface AiSource {
  /** Title of the page or document, shown as the link text. */
  title: string
  /** Where the source lives; external links open in a new tab. */
  href?: string
  /** One line on what the source is (the site, the section), shown under the title. */
  description?: string
}

export function sourceAnchor(anchor: string, index: number): string {
  return `${anchor}-source-${index}`
}
