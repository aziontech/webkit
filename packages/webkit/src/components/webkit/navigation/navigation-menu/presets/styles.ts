import { cn } from '../../../../../utils/cn'

/** Sliding highlight on root NavigationMenu.List (overridable via CSS variable). */
export const navigationMenuNavSelectorVar =
  '[--webkit-nav-selector:color-mix(in_srgb,var(--bg-hover)_60%,transparent)]'

const triggerSharedClasses = [
  'relative z-[1] inline-flex cursor-pointer items-center',
  'gap-[var(--spacing-2)] rounded-[var(--shape-elements)]',
  'bg-transparent px-[var(--spacing-3)] py-[var(--spacing-2)] no-underline',
  'text-label-md text-[var(--text-default)]',
  'transition-colors motion-reduce:transition-none',
  'hover:text-[var(--text-default)]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]',
  'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]',
  'data-[popup-open]:text-[var(--text-default)]',
  'data-[active]:text-[var(--text-default)]'
]

export function getNavigationMenuTriggerClasses(isLink: boolean, extra?: string) {
  return cn(...triggerSharedClasses, isLink && 'data-[active]:font-medium', extra)
}

export function getNavigationMenuRootClasses(extra?: string) {
  return cn('relative', navigationMenuNavSelectorVar, extra)
}

export const navigationMenuEntryAnchorClasses = [
  'group flex min-h-14 w-full items-start gap-[var(--spacing-2)]',
  'rounded-[var(--shape-elements)] p-[var(--spacing-2)] no-underline',
  'text-[var(--text-default)] transition-colors motion-reduce:transition-none',
  'hover:bg-[var(--bg-hover)]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]',
  'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]'
]

export const navigationMenuEntryIconClasses =
  'mt-0.5 flex size-3.5 shrink-0 items-center justify-center text-[var(--text-default)] [&_i]:text-body-xs'

export const navigationMenuEntryTextClasses = 'flex min-w-0 flex-col'

export const navigationMenuEntryTitleClasses = [
  'text-body-sm leading-none text-[var(--text-default)]',
  'group-hover:text-[var(--text-default)]',
  'data-[featured]:text-[var(--text-link)] data-[featured]:group-hover:text-[var(--text-link)]'
]

export const navigationMenuEntryDescriptionClasses = 'text-body-xs text-[var(--text-muted)]'
