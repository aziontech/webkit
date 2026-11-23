import { safeHref } from '../../../utils/safe-href'

/** Where a linked cell of a page section points. */
export interface LinkedCellTarget {
  /** Destination of the cell. */
  href: string
  /** Where the destination opens; `_blank` opens it in a new tab. */
  target?: '_blank' | '_self'
}

/** Attributes that make an anchor a linked cell. */
export interface LinkedCellAttrs {
  /** The safe destination, or nothing when the URL is unsafe. */
  href: string | undefined
  /** Where the destination opens. */
  target: '_blank' | '_self' | undefined
  /** Set whenever the link opens a new tab. */
  rel: string | undefined
  /** The shared hover fill and inset focus ring. */
  class: string
}

const LINKED_CELL_CLASS =
  'relative isolate before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-(--bg-hover) before:opacity-0 ' +
  'before:transition-opacity before:duration-moderate-01 before:ease-productive-entrance hover:before:opacity-100 focus-visible:before:opacity-100 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:before:transition-none'

export function linkedCell(item: LinkedCellTarget): LinkedCellAttrs {
  return {
    href: safeHref(item.href) ?? undefined,
    target: item.target,
    rel: item.target === '_blank' ? 'noopener noreferrer' : undefined,
    class: LINKED_CELL_CLASS
  }
}
