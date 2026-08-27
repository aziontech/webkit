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
/**
 * The entry's box: 12px block / 16px inline padding inside a 1px rule. The rule is transparent —
 * it is there so the box does not resize the day an entry has to show an outline (hover, focus,
 * selection), which is the whole reason a reference design carries a border it does not paint.
 */
export const navigationMenuEntryAnchorClasses = [
  'group flex min-h-14 w-full items-start gap-(--spacing-xs)',
  'rounded-(--shape-button) border border-transparent px-(--spacing-md) py-(--spacing-sm) no-underline',
  'text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none',
  'hover:bg-(--bg-hover)',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)',
  'focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)'
]
/**
 * 16×16 — the system's icon size, the same box `MenuItem` gives a row's glyph, so an entry in a
 * panel and a row in the sidebar carry the same-sized icon. The glyph is sized with it: an icon
 * font draws at its font-size, so a 16px box around a 12px glyph is 16px of air around a small
 * mark. `mt-0.5` optically centres it on the title's first line (21px line box, 16px glyph).
 */
export const navigationMenuEntryIconClasses =
  'mt-0.5 flex size-4 shrink-0 items-center justify-center text-(--text-default) [&_i]:text-body-md'
export const navigationMenuEntryTextClasses = 'flex min-w-0 flex-col'
export const navigationMenuEntryTitleClasses = [
  'text-label-md text-(--text-default)',
  'group-hover:text-(--text-default)',
  'data-[featured]:text-(--text-link) data-[featured]:group-hover:text-(--text-link)'
]
/**
 * 14px, matching the title's `text-label-md` — the pair is one two-line block, and a 12px
 * description under a 14px title made the second line read as a footnote rather than as the
 * entry's own sentence. Weight and colour carry the hierarchy instead of size.
 */
export const navigationMenuEntryDescriptionClasses = 'text-body-sm text-(--text-muted)'
/**
 * NO gap between entries. The rhythm is the entry's own block padding — adding a gap on top of it
 * sets the vertical spacing from two unrelated numbers at once, which is what made the column read
 * as loose: one entry's words sat further from the next than the group's rule sat from the first. With the gap gone, every vertical distance in the column is the
 * same padding, and the hover surfaces stack edge to edge the way menu rows do.
 */
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
/**
 * `kind="contrast"` INVERTS the panel — it does not lighten it. Over a dark canvas the two
 * separators an overlay usually leans on are weak or inert (a backdrop cannot darken black, a
 * shadow on black is invisible), and the fill cannot simply be raised either: the entry copy is
 * `--text-muted` (#808080), which holds 4.66:1 on `--bg-surface-raised` (#141414) and falls to
 * 2.07:1 by ~#4D4D4D, so every fill lighter than ~#181818 is under the 4.5:1 floor. The theme's
 * `--bg-contrast` / `--text-contrast` pair is the way out: in dark a #FAFAFA panel with black ink
 * (title 20.3:1, description 5.7:1), and it flips coherently in light.
 *
 * Inverting a surface means inverting the INK on it, so the variant redefines the tokens this
 * panel's parts paint from instead of restyling any of them. `--bg-surface-raised` and
 * `--border-default` re-colour the popup AND the arrow (both already read those), and
 * `--text-default` / `--text-muted` / `--bg-hover` / `--bg-canvas` (the focus ring's offset)
 * re-ink every entry and group label beneath. No sub-component knows the panel inverted.
 *
 * `--text-muted` is DERIVED, not reused: it is #808080 in both themes, i.e. the 3.95:1 the light
 * theme already lives with, so mixing 60% of the ink into the surface takes it to 5.7:1.
 * `--border-default` is derived for the same reason and must NOT be blanked to the surface colour:
 * it is the panel's rim, but it is also every rule DRAWN INSIDE the panel — the group heading's
 * among them — so hiding the rim that way takes those with it.
 */
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
/**
 * The group heading is an OVERLINE with a rule under it: uppercase `text-overline-xs` in
 * `--text-muted`, then a hairline across the track. The overline scale is what says "this names a
 * set" without competing with the entry titles under it — what made the original heading shout was
 * the `Overline` COMPONENT, which paints brand primary at `text-overline-md` and brings its own
 * padding, not the uppercase itself.
 *
 * The inset is a MARGIN, not padding, and that is the whole trick: it tracks the entry's inline
 * padding, so the words start on the entries' icon column (`--spacing-md` + the 1px rule, exactly
 * where an entry's icon starts) while the box — and therefore the painted bottom edge — stops that
 * far short of the track on each side.
 * The rule spans the column's content instead of the track, so adjacent columns are separated by a
 * real break (twice the inset) instead of the 2px their transparent side borders happen to leave,
 * and it costs the tracks nothing. Only the bottom edge of the 1px rule is painted; the other three keep the
 * entry's box alignment.
 */
export const navigationMenuGroupLabelClasses =
  'flex shrink-0 items-center border border-transparent border-b-(--border-default) mx-(--spacing-md) pb-(--spacing-xs) mb-(--spacing-xs) text-overline-xs text-(--text-muted)'

/**
 * A group label with an `href` of its own — the section's own page, above the entries that lead
 * into parts of it. It stays the same quiet row (a heading first, a link second): the only added
 * affordances are the pointer, the ink lifting to `--text-default` on hover, and the focus ring
 * every interactive part in this package carries. No hover surface — a filled row here would read
 * as one of the entries it labels. It is FLAT — no `--shape-elements` radius: the heading is a
 * line of text with a rule under it, and a rounded box around it would propose a control that is
 * not there (and would round the corners of a focus ring the rule runs straight through).
 */
export const navigationMenuGroupLabelLinkClasses = [
  'cursor-pointer no-underline',
  'transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none',
  'hover:text-(--text-default)',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)',
  'focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)'
]
