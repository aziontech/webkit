export const ROOT_CLASS =
  '@container/table ' +
  'data-[density=compact]:[&_[role=cell]]:min-h-9 data-[density=compact]:[&_[role=cell]]:py-(--spacing-2xs) ' +
  'data-[wrap]:[&_[role=cell]]:whitespace-normal data-[wrap]:[&_[role=cell]_.truncate]:whitespace-normal data-[wrap]:[&_[role=cell]_.truncate]:break-words ' +
  'flex w-full flex-col overflow-hidden rounded-(--shape-control) bg-(--bg-surface) text-(--text-default) text-body-sm ' +
  'data-[bordered]:border-(length:--border-width-default) data-[bordered]:border-solid data-[bordered]:border-(--border-default)'

export const EXPAND_TOGGLE_CLASS =
  'flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-(--shape-button) border-(length:--border-width-default) border-solid border-(--border-default) ' +
  'bg-(--bg-surface) text-(--text-default) transition-colors duration-150 ease-out ' +
  'hover:bg-(--bg-canvas) motion-reduce:transition-none'

export const FADE_START_CLASS =
  'pointer-events-none absolute inset-y-0 start-0 z-5 hidden bg-gradient-to-l from-transparent to-(--bg-surface) ' +
  'group-data-[overflow-start]/scroll:block ' +
  'rtl:bg-gradient-to-r forced-colors:forced-color-adjust-none forced-colors:to-[Canvas]'

export const FADE_END_CLASS =
  'pointer-events-none absolute inset-y-0 end-0 z-5 hidden bg-gradient-to-r from-transparent to-(--bg-surface) to-[min(1.5rem,100%)] ' +
  'group-data-[overflow-end]/scroll:block ' +
  'rtl:bg-gradient-to-l forced-colors:forced-color-adjust-none forced-colors:to-[Canvas]'
