export const ghostLayerClasses = [
  'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]',
  "before:bg-(--bg-hover) before:opacity-0 before:content-['']",
  'before:transition-opacity before:duration-fast-02 before:ease-productive-entrance',
  'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]',
  "after:bg-(--bg-active) after:opacity-0 after:content-['']",
  'after:transition-opacity after:duration-fast-02 after:ease-productive-entrance',
  'hover:before:opacity-100 active:after:opacity-100',
  'motion-reduce:before:transition-none motion-reduce:after:transition-none'
]

export const disabledCursorClasses = [
  'disabled:cursor-not-allowed',
  'data-[disabled]:cursor-not-allowed'
]

export const ghostLayerDisabledHideClasses = [
  'disabled:before:hidden disabled:after:hidden',
  'data-[disabled]:before:hidden data-[disabled]:after:hidden',
  'has-[:disabled]:before:hidden has-[:disabled]:after:hidden',
  'has-[[readonly]]:before:hidden has-[[readonly]]:after:hidden'
]

export const focusSuppressHoverGhostClasses = [
  'focus-within:before:opacity-0',
  'focus-visible:before:opacity-0',
  'has-[:focus-visible]:before:opacity-0'
]

export const focusVisibleRingClasses = [
  'focus-visible:outline-none',
  'focus-visible:ring-2 focus-visible:ring-(--ring-color)',
  'focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)'
]

export const hasFocusVisibleRingClasses = [
  'has-[:focus-visible]:outline-none',
  'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-(--ring-color)',
  'has-[:focus-visible]:ring-offset-1 has-[:focus-visible]:ring-offset-(--bg-canvas)'
]

export const focusWithinRingClasses = [
  'focus-within:outline-none',
  'focus-within:ring-2 focus-within:ring-(--ring-color)',
  'focus-within:ring-offset-1 focus-within:ring-offset-(--bg-canvas)'
]

export const surfaceControlWrapperClasses = [
  'relative inline-flex w-full items-center',
  'rounded-(--shape-button) border border-(--border-default) bg-(--bg-surface)',
  ...ghostLayerClasses,
  ...focusWithinRingClasses,
  ...focusSuppressHoverGhostClasses,
  ...ghostLayerDisabledHideClasses,
  ...disabledCursorClasses
]

export const toggleControlClasses = [
  'relative inline-flex shrink-0 items-center justify-center',
  ...ghostLayerClasses,
  ...hasFocusVisibleRingClasses,
  ...focusSuppressHoverGhostClasses,
  ...ghostLayerDisabledHideClasses,
  ...disabledCursorClasses
]

export const selectableBlockCardClasses = [
  'relative rounded-(--shape-button) border',
  'bg-(--bg-surface) border-(--border-muted)',
  ...ghostLayerClasses,
  ...hasFocusVisibleRingClasses,
  ...focusSuppressHoverGhostClasses,
  ...ghostLayerDisabledHideClasses,
  ...disabledCursorClasses
]

export const listOptionItemClasses = [
  'relative flex w-full cursor-pointer items-center rounded-(--shape-button)',
  'px-(--spacing-xs) py-(--spacing-xs) text-left text-label-md',
  ...ghostLayerClasses,
  ...focusVisibleRingClasses,
  'focus-visible:before:opacity-100',
  ...disabledCursorClasses
]

export const itemRowShellClasses = [
  'group/item relative flex w-full flex-wrap items-center',
  'rounded-(--shape-button) border border-transparent text-body-sm text-(--text-default)',
  'data-[kind=outline]:border-(--border-muted) data-[kind=outline]:bg-(--bg-surface)',
  'data-[kind=muted]:bg-(--bg-hover)',
  'data-[size=medium]:gap-(--spacing-md) [&:not([data-kind=inline])]:data-[size=medium]:p-(--spacing-md)',
  'data-[size=small]:gap-(--spacing-xs) [&:not([data-kind=inline])]:data-[size=small]:px-(--spacing-md) [&:not([data-kind=inline])]:data-[size=small]:py-(--spacing-sm)'
]

export const itemRowClasses = [...itemRowShellClasses]
