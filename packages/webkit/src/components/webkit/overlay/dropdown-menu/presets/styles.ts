import { cn } from '../../../../../utils/cn'

export const dropdownMenuContentClasses = [
  'z-[1100] min-w-[12rem] overflow-hidden',
  'rounded-[var(--shape-elements)] border border-[var(--border-default)]',
  'bg-[var(--bg-surface)] p-spacing-elements-xxs shadow-[var(--shadow-md)]',
  'outline-none'
] as const

export const dropdownMenuGroupClasses = [
  'flex h-7 items-center px-[var(--spacing-elements-xs)] py-[var(--spacing-elements-xxs)]',
  'text-overline-xs uppercase text-[var(--text-muted)]'
] as const

const dropdownMenuItemSharedClasses = [
  'relative flex w-full min-h-8 cursor-pointer items-center gap-spacing-elements-xs',
  'rounded-[var(--shape-elements)] px-[var(--spacing-elements-xs)] text-left text-label-md',
  'text-[var(--text-default)] outline-none transition-colors motion-reduce:transition-none',
  'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]',
  "before:bg-[var(--bg-hover)] before:opacity-0 before:transition-opacity before:content-['']",
  'hover:before:opacity-100 focus-visible:before:opacity-100',
  'focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]',
  'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]'
] as const

export function getDropdownMenuItemClasses(options: {
  selected?: boolean
  disabled?: boolean
  extra?: string
}) {
  return cn(
    dropdownMenuItemSharedClasses,
    options.selected && 'bg-[var(--bg-surface-raised)] before:opacity-0 hover:before:opacity-0',
    options.disabled &&
      'pointer-events-none cursor-not-allowed text-[var(--text-disabled)] before:opacity-0 hover:before:opacity-0',
    options.extra
  )
}

export const dropdownMenuSeparatorClasses = [
  'my-[var(--spacing-elements-xxs)] h-px w-full shrink-0 bg-[var(--border-muted)]'
] as const
