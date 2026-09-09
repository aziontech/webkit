import { cn } from '../../../../utils/cn'
/** Sliding highlight on root NavigationMenu.List (overridable via CSS variable). */
export const navigationMenuNavSelectorVar =
  '[--webkit-nav-selector:color-mix(in_srgb,var(--bg-hover)_60%,transparent)]'
const triggerBaseClasses = [
  'relative z-1 inline-flex cursor-pointer items-center gap-(--spacing-xs)',
  'rounded-(--shape-button) bg-transparent px-(--spacing-sm) py-(--spacing-xs)',
  'no-underline transition-colors duration-moderate-02 ease-in-out motion-reduce:transition-none',
  'text-label-md text-(--text-default)',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)',
  'focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)'
]
const navigationMenuTriggerStateClasses =
  'data-[popup-open]:text-(--text-default) data-[pressed]:text-(--text-default)'
const navigationMenuLinkStateClasses = 'data-[active]:text-(--text-default)'
export function getNavigationMenuTriggerClasses(isLink, extra) {
  return cn(
    triggerBaseClasses,
    isLink ? navigationMenuLinkStateClasses : navigationMenuTriggerStateClasses,
    extra
  )
}
export function getNavigationMenuRootClasses(extra) {
  return cn('relative', navigationMenuNavSelectorVar, extra)
}
/** The entry's 1px border is transparent — reserved so the box doesn't resize the day it needs to paint an outline (hover, focus, selection). */
export const navigationMenuEntryAnchorClasses = [
  'group flex min-h-14 w-full items-start gap-(--spacing-xs)',
  'rounded-(--shape-button) border border-transparent px-(--spacing-md) py-(--spacing-sm) no-underline',
  'text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none',
  'hover:bg-(--bg-hover)',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)',
  'focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)'
]
/** 16×16 matches `MenuItem`'s row-glyph box; `mt-0.5` optically centres it on the title's 21px line box. */
export const navigationMenuEntryIconClasses =
  'mt-0.5 flex size-4 shrink-0 items-center justify-center text-(--text-default) [&_i]:text-body-md'
export const navigationMenuEntryTextClasses = 'flex min-w-0 flex-col'
export const navigationMenuEntryTitleClasses = [
  'text-label-md text-(--text-default)',
  'group-hover:text-(--text-default)',
  'data-[featured]:text-(--text-link) data-[featured]:group-hover:text-(--text-link)'
]
/** 14px matches the title's `text-label-md` so weight/colour, not size, carries the hierarchy between the two lines. */
export const navigationMenuEntryDescriptionClasses = 'text-body-sm text-(--text-muted)'
/** No gap: spacing comes only from each entry's own padding, so hover surfaces stack edge to edge. */
export const navigationMenuListGroupClasses = 'm-0 flex list-none flex-col p-0'
export const navigationMenuListRootClasses = [
  'relative z-1 m-0 flex list-none items-center gap-(--spacing-xs) p-0'
]
/** Sliding highlight on root NavigationMenu.List (uses `--webkit-nav-selector` from root). */
export const navigationMenuListSelectorClasses =
  'pointer-events-none absolute z-0 rounded-(--shape-button) bg-(--webkit-nav-selector) transition-[left,top,width,height,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none'
export const navigationMenuIconClasses = [
  'inline-flex transition-transform duration-moderate-02 ease-productive-entrance motion-reduce:transition-none',
  'data-[open]:rotate-180'
]
/** `kind="contrast"` INVERTS the panel via `--bg-contrast`/`--text-contrast` — raising `--bg-surface-raised` directly would drop `--text-muted` under the 4.5:1 floor by ~#181818. */
/** Redefines the tokens the panel's parts already paint from (`--bg-surface-raised`, `--border-default`, `--text-default`, `--text-muted`, `--bg-hover`, `--bg-canvas`) instead of restyling any sub-component. */
/** `--text-muted`/`--border-default` are derived (color-mix), not blanked — `--border-default` is also every rule drawn inside the panel, so blanking it would erase those too. */
export const navigationMenuPopupSurfaceClasses = [
  'relative overflow-hidden rounded-(--shape-card)',
  'border border-solid border-(--border-default)',
  'bg-(--bg-surface-raised) shadow-(--shadow-lg)',
  'max-h-[var(--available-height,100vh)]',
  'data-[kind=contrast]:[--bg-surface-raised:var(--bg-contrast)]',
  'data-[kind=contrast]:[--border-default:color-mix(in_srgb,var(--text-contrast)_20%,var(--bg-contrast))]',
  'data-[kind=contrast]:[--text-default:var(--text-contrast)]',
  'data-[kind=contrast]:[--text-muted:color-mix(in_srgb,var(--text-contrast)_60%,var(--bg-contrast))]',
  'data-[kind=contrast]:[--bg-hover:color-mix(in_srgb,var(--text-contrast)_8%,transparent)]',
  'data-[kind=contrast]:[--bg-canvas:var(--bg-contrast)]'
]
export const navigationMenuBackdropClasses = [
  'fixed inset-0 z-40',
  'bg-[color-mix(in_srgb,var(--bg-canvas)_20%,transparent)]',
  'transition-opacity duration-slow-01 ease-productive-entrance motion-reduce:transition-none',
  'data-[starting-style]:opacity-0 data-[starting-style]:transition-none',
  'data-[ending-style]:opacity-0'
]
export const navigationMenuArrowClasses = [
  'absolute size-3 rotate-45 border border-solid border-(--border-default)',
  'bg-(--bg-surface-raised)',
  'data-[side=bottom]:-top-1.5 data-[side=bottom]:border-b-0 data-[side=bottom]:border-r-0',
  'data-[side=top]:-bottom-1.5 data-[side=top]:border-l-0 data-[side=top]:border-t-0'
]
export const navigationMenuPositionerLayoutClasses = [
  'fixed z-50 max-h-[var(--available-height,100vh)]',
  'max-w-[min(var(--available-width,100vw),100vw)]'
]
export const navigationMenuContentPaddingClasses = 'p-(--spacing-md)'
/** OVERLINE style (`text-overline-xs`, `--text-muted`), not the `Overline` component — that one paints brand primary at `text-overline-md` with its own padding. */
/** Inset is a MARGIN (not padding) so the label text aligns to the entries' icon column, while the rule spans the column's own content rather than the shared track. */
export const navigationMenuGroupLabelClasses =
  'flex shrink-0 items-center border border-transparent border-b-(--border-default) mx-(--spacing-md) pb-(--spacing-xs) mb-(--spacing-xs) text-overline-xs text-(--text-muted)'

/** Adds only pointer + hover ink + focus ring on top of the plain heading — no hover fill (would read as an entry) and no radius (a line of text, not a control). */
export const navigationMenuGroupLabelLinkClasses = [
  'cursor-pointer no-underline',
  'transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none',
  'hover:text-(--text-default)',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)',
  'focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)'
]
