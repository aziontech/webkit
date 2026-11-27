import { cn } from '../../../../utils/cn'

export const RAIL_MOTION_CLASS =
  'transition-[width,min-width] duration-moderate-02 ease-expressive-entrance ' +
  'has-[>div[data-state=closed]]:ease-productive-exit ' +
  'data-[resizing]:transition-none ' +
  'not-data-[settled]:transition-none ' +
  'motion-reduce:transition-none'

export const NAV_CLASS =
  'flex h-full min-h-0 flex-1 flex-col [--sidebar-menu-item-ring-offset:var(--bg-surface)] [--sidebar-menu-ring-offset:var(--bg-surface)]'

export const INNER_MOTION_CLASS =
  'transition-[translate,opacity] duration-moderate-02 ease-expressive-entrance ' +
  'data-[state=closed]:ease-productive-exit ' +
  'data-[resizing]:transition-none ' +
  'not-data-[settled]:transition-none ' +
  'motion-reduce:transition-none motion-reduce:translate-none'

export const RESIZE_INDICATOR_CLASS =
  'pointer-events-none absolute inset-y-0 end-0 w-(--border-width-2) bg-(--accent) opacity-0 transition-opacity ' +
  'group-hover:opacity-100 group-focus-visible:opacity-100 ' +
  'group-data-[preview]:opacity-100 ' +
  'group-data-[resizing]:opacity-100 ' +
  'motion-reduce:transition-none'

export const EXPAND_CLASS =
  'group absolute inset-y-0 start-0 z-20 w-(--size-6) hover:w-(--size-10) focus-within:w-(--size-10) ' +
  'transition-[width] duration-moderate-02 ease-expressive-exit hover:ease-expressive-entrance focus-within:ease-expressive-entrance motion-reduce:transition-none'

export const EXPAND_HINT_CLASS =
  'pointer-events-none absolute start-full top-1/2 -translate-y-1/2 translate-x-[calc(-1_*_var(--size-10))] ' +
  'rtl:translate-x-(--size-10) ps-(--spacing-2xs) opacity-0 transition-[translate,opacity] duration-moderate-02 ease-expressive-exit ' +
  'group-hover:translate-x-0 rtl:group-hover:translate-x-0 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:ease-expressive-entrance ' +
  'group-focus-within:translate-x-0 rtl:group-focus-within:translate-x-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto ' +
  'group-focus-within:ease-expressive-entrance motion-reduce:transition-none motion-reduce:translate-none'

export const sidebarFooterBandClass = (
  collapsible: boolean,
  rail: boolean,
  hasFooter: boolean
): string | undefined => {
  if (!collapsible) return undefined
  if (rail) {
    return 'flex flex-col items-center gap-(--spacing-xs) border-t border-(--border-muted) px-(--spacing-xs) py-(--spacing-sm)'
  }
  return cn(
    'flex h-14 items-center gap-(--spacing-xs)',
    'border-t border-(--border-muted) px-(--spacing-md)',
    !hasFooter ? 'justify-end' : undefined
  )
}

export const sidebarFooterSlotClass = (collapsible: boolean, rail: boolean): string | undefined => {
  if (!collapsible) return undefined
  return rail ? 'flex min-w-0 justify-center' : 'min-w-0 flex-1'
}

export const sidebarScrollClass = (hasHeader: boolean, rail: boolean): string =>
  cn(
    'flex min-h-0 flex-1 flex-col gap-(--spacing-md) p-(--spacing-md)',
    'scroll-py-(--spacing-2xs)',
    hasHeader ? 'pt-(--spacing-2xs)' : undefined,
    rail ? 'px-(--spacing-xs)' : undefined
  )
