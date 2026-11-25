export const BOX_CLASS =
  'group/prompt-input-box relative flex w-full cursor-text flex-col gap-(--spacing-2xs) rounded-(--shape-card) border border-(--border-input) ' +
  'bg-[color-mix(in_srgb,var(--bg-surface-raised)_88%,transparent)] p-(--spacing-xs) shadow-(--shadow-lg) backdrop-blur-md transition-colors ' +
  'duration-fast-02 ease-productive-entrance motion-reduce:transition-none ' +
  '[&:not(:focus-within):not([data-disabled])]:hover:border-(--border-strong) ' +
  'focus-within:outline-none focus-within:ring-2 focus-within:ring-(--ring-color) focus-within:ring-offset-2 focus-within:ring-offset-(--bg-canvas) ' +
  'data-[invalid]:border-(--danger-border) ' +
  'data-[disabled]:bg-(--bg-disabled)'

export const DROP_CLASS =
  'pointer-events-none absolute inset-0 z-2 flex items-center justify-center rounded-[inherit] border-2 border-dashed border-(--border-selected) bg-(--bg-surface) text-label-md ' +
  "text-(--text-default) before:absolute before:inset-0 before:rounded-[inherit] before:bg-(--bg-selected) before:content-['']"

export const TEXTAREA_CLASS =
  'min-w-40 flex-1 basis-0 resize-none bg-transparent px-(--spacing-xs) py-(--spacing-xs) text-body-md text-(--text-default) ' +
  'placeholder:text-(--text-muted) outline-none disabled:cursor-not-allowed disabled:text-(--text-disabled) ' +
  'group-data-[multiline]/prompt-input-box:order-first group-data-[multiline]/prompt-input-box:basis-full'
