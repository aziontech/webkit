import { cn } from '../../../../../utils/cn'

/** Sliding highlight on root NavigationMenu.List (overridable via CSS variable). */
export const navigationMenuNavSelectorVar =
  '[--webkit-nav-selector:color-mix(in_srgb,var(--bg-hover)_60%,transparent)]'

const triggerBaseClasses = [
  'relative z-[1] inline-flex cursor-pointer items-center gap-[var(--spacing-2)]',
  'rounded-[var(--shape-elements)] bg-transparent px-[var(--spacing-3)] py-[var(--spacing-2)]',
  'no-underline transition-colors duration-150 ease-in-out motion-reduce:transition-none',
  'text-label-md text-[var(--text-default)]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]',
  'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]'
]

const navigationMenuTriggerStateClasses =
  'data-[popup-open]:text-[var(--text-default)] data-[pressed]:text-[var(--text-default)]'

const navigationMenuLinkStateClasses = 'data-[active]:text-[var(--text-default)]'

export function getNavigationMenuTriggerClasses(isLink: boolean, extra?: string) {
  return cn(
    triggerBaseClasses,
    isLink ? navigationMenuLinkStateClasses : navigationMenuTriggerStateClasses,
    extra
  )
}

export function getNavigationMenuRootClasses(extra?: string) {
  return cn('relative', navigationMenuNavSelectorVar, extra)
}

export const navigationMenuEntryAnchorClasses = [
  'group flex min-h-14 w-full items-start gap-[var(--spacing-2)]',
  'rounded-[var(--shape-elements)] p-[var(--spacing-2)] no-underline',
  'text-[var(--text-default)] transition-colors duration-150 motion-reduce:transition-none',
  'hover:bg-[var(--bg-hover)]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]',
  'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]'
]

export const navigationMenuEntryIconClasses =
  'mt-0.5 flex size-3.5 shrink-0 items-center justify-center text-[var(--text-default)] [&_i]:text-body-xs'

export const navigationMenuEntryTextClasses = 'flex min-w-0 flex-col'

export const navigationMenuEntryTitleClasses = [
  'text-label-md leading-none text-[var(--text-default)]',
  'group-hover:text-[var(--text-default)]',
  'data-[featured]:text-[var(--text-link)] data-[featured]:group-hover:text-[var(--text-link)]'
]

export const navigationMenuEntryDescriptionClasses = 'text-body-xs text-[var(--text-muted)]'

export const navigationMenuListGroupClasses =
  'm-0 flex list-none flex-col gap-[var(--spacing-2)] p-0'

export const navigationMenuListRootClasses = [
  'relative z-[1] m-0 flex list-none items-center gap-[var(--spacing-2)] p-0'
]

export const navigationMenuIconClasses = [
  'inline-flex transition-transform duration-200 motion-reduce:transition-none',
  'data-[open]:rotate-180'
]

export const navigationMenuPopupSurfaceClasses = [
  'relative overflow-hidden rounded-[var(--shape-card)]',
  'border border-solid border-[var(--border-default)]',
  'bg-[var(--bg-surface-raised)] shadow-lg',
  'max-h-[var(--available-height,100vh)]'
]

export const navigationMenuBackdropClasses = [
  'fixed inset-0 z-40',
  'bg-[color-mix(in_srgb,var(--bg-canvas)_20%,transparent)]',
  'transition-opacity duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
  'data-[starting-style]:opacity-0 data-[starting-style]:transition-none',
  'data-[ending-style]:opacity-0'
]

export const navigationMenuArrowClasses = [
  'absolute size-3 rotate-45 border border-solid border-[var(--border-default)]',
  'bg-[var(--bg-surface-raised)]',
  'data-[side=bottom]:-top-1.5 data-[side=bottom]:border-b-0 data-[side=bottom]:border-r-0',
  'data-[side=top]:-bottom-1.5 data-[side=top]:border-l-0 data-[side=top]:border-t-0'
]

export const navigationMenuPositionerLayoutClasses = [
  'fixed z-50 max-h-[var(--available-height,100vh)]',
  'max-w-[min(var(--available-width,100vw),100vw)]'
]

export const navigationMenuContentPaddingClasses = 'p-[var(--spacing-4)]'

export const navigationMenuOverlineClasses = 'mb-[var(--spacing-3)] px-[var(--spacing-3)]'
