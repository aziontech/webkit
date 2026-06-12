import { cn } from '../../../../utils/cn'

export const dropdownMenuContentClasses = [
  'z-[1100] min-w-[12rem] overflow-hidden',
  'rounded-[var(--shape-button)] border border-[var(--border-default)]',
  'bg-[var(--bg-surface)] p-[var(--spacing-xxs)] shadow-[var(--shadow-md)]',
  'outline-none'
]
export const dropdownMenuGroupClasses = [
  'flex h-7 items-center px-[var(--spacing-xs)] py-[var(--spacing-xxs)]',
  'text-overline-xs text-[var(--text-muted)]'
]
const dropdownMenuItemSharedClasses = [
  'relative flex w-full min-h-8 cursor-pointer items-center gap-[var(--spacing-xs)]',
  'rounded-[var(--shape-button)] px-[var(--spacing-xs)] text-left text-label-md',
  'text-[var(--text-default)] outline-none transition-colors motion-reduce:transition-none',
  'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]',
  "before:bg-[var(--bg-hover)] before:opacity-0 before:transition-opacity before:content-['']",
  'hover:before:opacity-100 focus-visible:before:opacity-100',
  'focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]',
  'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]'
]
export function getDropdownMenuItemClasses(options) {
  return cn(
    dropdownMenuItemSharedClasses,
    options.selected && 'bg-[var(--bg-surface-raised)] before:opacity-0 hover:before:opacity-0',
    options.disabled &&
      'pointer-events-none cursor-not-allowed text-[var(--text-disabled)] before:opacity-0 hover:before:opacity-0',
    options.extra
  )
}
export const dropdownMenuSeparatorClasses = [
  'my-[var(--spacing-xxs)] h-px w-full shrink-0 bg-[var(--border-muted)]'
]
