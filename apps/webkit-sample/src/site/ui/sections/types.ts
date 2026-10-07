import type { ButtonKind, ButtonSize } from '@aziontech/webkit/button'

export interface SiteAction {
  /** Visible label. */
  label: string
  /** Destination: a site route, an in-page hash or an external URL. */
  href: string
  /** Button kind. */
  kind?: ButtonKind
  /** Button size. */
  size?: ButtonSize
  /** Leading glyph, as an icon class. */
  icon?: string
  /** Draws the animated trailing chevron. */
  trailing?: boolean
  /** Opens the destination in a new tab. */
  external?: boolean
}

export interface SiteTopic {
  /** Leading glyph, as an icon class. */
  icon?: string
  /** Topic heading. */
  title: string
  /** One or two sentences under the heading. */
  description: string
  /** Destination when the topic is a link. */
  href?: string
}

export interface SiteLink {
  /** Visible label. */
  label: string
  /** Destination URL or route. */
  href: string
}

export interface SiteFaqItem {
  /** Stable key, also the item's anchor. */
  value: string
  /** The question. */
  question: string
  /** The answer, or the part of it before the link. */
  answer: string
  /** A link continuing the answer. */
  link?: SiteLink
  /** The answer text after the link. */
  answerAfter?: string
  /** A rich answer of paragraphs and bullet lists, each made of text and link segments; replaces answer, link and answerAfter. */
  body?: Array<
    | { type: 'p'; segments: Array<{ text: string; href?: string; external?: boolean }> }
    | { type: 'ul'; items: Array<Array<{ text: string; href?: string; external?: boolean }>> }
  >
}

export interface PageSection {
  /** Registered section name, one per marketing template. */
  section: string
  /** Props forwarded to the section. */
  [prop: string]: unknown
}
