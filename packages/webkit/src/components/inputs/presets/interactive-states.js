/**
 * Hover, active, and focus-visible patterns for webkit inputs (DESIGN.md § Interactive states).
 *
 * Spread these into component class groups named like `button.vue`:
 * `sharedClasses`, `disabledClasses`, `rootClasses`, plus state maps (`checkedClasses`, `invalidClasses`, …).
 */

/** Ghost overlay layers — hover on `::before`, active on `::after`. */
export const ghostLayerClasses = [
  'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]',
  "before:bg-[var(--bg-hover)] before:opacity-0 before:content-['']",
  'before:transition-opacity before:duration-fast-02 before:ease-productive-entrance',
  'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]',
  "after:bg-[var(--bg-active)] after:opacity-0 after:content-['']",
  'after:transition-opacity after:duration-fast-02 after:ease-productive-entrance',
  'hover:before:opacity-100 active:after:opacity-100',
  'motion-reduce:before:transition-none motion-reduce:after:transition-none'
]

/** Disabled cursor — matches field-radio-block (`data-[disabled]:cursor-not-allowed`). */
export const disabledCursorClasses = [
  'disabled:cursor-not-allowed',
  'data-[disabled]:cursor-not-allowed'
]

/** Hide ghost layers when the control is not interactive. */
export const ghostLayerDisabledHideClasses = [
  'disabled:before:hidden disabled:after:hidden',
  'data-[disabled]:before:hidden data-[disabled]:after:hidden',
  'has-[:disabled]:before:hidden has-[:disabled]:after:hidden',
  'has-[[readonly]]:before:hidden has-[[readonly]]:after:hidden'
]

/** Suppress hover ghost while focused (keeps active feedback). */
export const focusSuppressHoverGhostClasses = [
  'focus-within:before:opacity-0',
  'focus-visible:before:opacity-0',
  'has-[:focus-visible]:before:opacity-0'
]

/** Focus ring on the element that receives keyboard focus. */
export const focusVisibleRingClasses = [
  'focus-visible:outline-none',
  'focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]',
  'focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg-canvas)]'
]

/** Focus ring when a descendant native control is focused (checkbox, radio). */
export const hasFocusVisibleRingClasses = [
  'has-[:focus-visible]:outline-none',
  'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--ring-color)]',
  'has-[:focus-visible]:ring-offset-1 has-[:focus-visible]:ring-offset-[var(--bg-canvas)]'
]

/** Focus ring for bordered surface wrappers (input-text, dropdown trigger). */
export const focusWithinRingClasses = [
  'focus-within:outline-none',
  'focus-within:ring-2 focus-within:ring-[var(--ring-color)]',
  'focus-within:ring-offset-1 focus-within:ring-offset-[var(--bg-canvas)]'
]

/** Bordered field shell with hover/active ghosts and focus-within ring. */
export const surfaceControlWrapperClasses = [
  'relative inline-flex w-full items-center',
  'rounded-[var(--shape-button)] border border-[var(--border-default)] bg-[var(--bg-surface)]',
  ...ghostLayerClasses,
  ...focusWithinRingClasses,
  ...focusSuppressHoverGhostClasses,
  ...ghostLayerDisabledHideClasses,
  ...disabledCursorClasses
]

/** Small toggle visuals (checkbox, radio) with ghost layers and descendant focus ring. */
export const toggleControlClasses = [
  'relative inline-flex shrink-0 items-center justify-center',
  ...ghostLayerClasses,
  ...hasFocusVisibleRingClasses,
  ...focusSuppressHoverGhostClasses,
  ...ghostLayerDisabledHideClasses,
  ...disabledCursorClasses
]

/** Selectable block card shell (field-*-block). */
export const selectableBlockCardClasses = [
  'relative rounded-[var(--shape-button)] border',
  'bg-[var(--bg-surface)] border-[var(--border-muted)]',
  ...ghostLayerClasses,
  ...hasFocusVisibleRingClasses,
  ...focusSuppressHoverGhostClasses,
  ...ghostLayerDisabledHideClasses,
  ...disabledCursorClasses
]

/** Listbox / menu option row. */
export const listOptionItemClasses = [
  'relative flex w-full cursor-pointer items-center rounded-[var(--shape-button)]',
  'px-[var(--spacing-xs)] py-[var(--spacing-xs)] text-left text-label-md',
  ...ghostLayerClasses,
  ...focusVisibleRingClasses,
  'focus-visible:before:opacity-100',
  ...disabledCursorClasses
]

/** Item row layout and kind/size tokens (wrapper or asChild target). */
export const itemRowShellClasses = [
  'group/item relative flex w-full flex-wrap items-center',
  'rounded-[var(--shape-button)] border border-transparent text-body-sm text-[var(--text-default)]',
  'data-[kind=outline]:border-[var(--border-muted)] data-[kind=outline]:bg-[var(--bg-surface)]',
  'data-[kind=muted]:bg-[var(--bg-hover)]',
  'data-[size=medium]:gap-[var(--spacing-md)] data-[size=medium]:p-[var(--spacing-md)]',
  'data-[size=small]:gap-[var(--spacing-xs)] data-[size=small]:px-[var(--spacing-md)] data-[size=small]:py-[var(--spacing-sm)]'
]

/** Item shell only — no row-level hover/focus; slotted Button/link own interaction. */
export const itemRowClasses = [...itemRowShellClasses]
