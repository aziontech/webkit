export const ROOT_CLASS =
  'flex w-full flex-col overflow-hidden rounded-(--shape-control) border-(length:--border-width-default) border-solid border-(--border-default) bg-(--bg-surface) text-body-sm ' +
  'text-(--text-default)'

export const SELECT_ALL_CLASS =
  'relative flex min-h-10 shrink-0 items-center bg-(--bg-surface-raised) px-(--spacing-sm) text-label-sm text-(--text-muted) outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) ' +
  'data-[frozen]:sticky data-[frozen]:z-1 ' +
  'pointer-coarse:min-h-11'

export const RESIZE_HANDLE_CLASS =
  'absolute inset-y-0 -end-3 z-1 w-6 cursor-col-resize touch-none after:absolute after:inset-y-2 after:start-1/2 after:w-px after:bg-(--border-default) focus-visible:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-(--ring-color) pointer-coarse:-end-[1.375rem] pointer-coarse:w-11'

export const CELL_CLASS =
  'relative flex min-h-10 shrink-0 cursor-default items-center bg-(--bg-surface) px-(--spacing-sm) outline-none transition-colors duration-150 ease-out ' +
  'group-hover/row:bg-(--bg-canvas) ' +
  'group-data-[state=selected]/row:bg-(--bg-selected) ' +
  'data-[selected]:bg-(--bg-selected) ' +
  'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) ' +
  'data-[frozen]:sticky data-[frozen]:z-1 ' +
  'data-[editing]:p-0 ' +
  'motion-reduce:transition-none pointer-coarse:min-h-11'

export const SELECT_EDITOR_CLASS =
  'size-full min-h-10 rounded-(--shape-control) border-none bg-(--bg-surface) px-(--spacing-sm) text-body-sm ' +
  'pointer-coarse:text-body-md text-(--text-default) outline-none ring-2 ring-inset ring-(--ring-color) ' +
  'pointer-coarse:min-h-11'

export const INPUT_EDITOR_CLASS =
  'size-full min-h-10 rounded-(--shape-control) border-none bg-(--bg-surface) px-(--spacing-sm) text-start text-body-sm ' +
  'pointer-coarse:text-body-md text-(--text-default) outline-none ring-2 ring-inset ring-(--ring-color) ' +
  'data-[align=end]:text-end ' +
  'data-[invalid]:ring-(--danger-border) ' +
  'pointer-coarse:min-h-11'

export const ERROR_CLASS =
  'absolute start-0 top-full z-3 mt-(--spacing-2xs) whitespace-nowrap rounded-(--shape-control) border-(length:--border-width-default) border-solid border-(--danger-border) ' +
  'bg-(--bg-surface) px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-default)'

export const FADE_START_CLASS =
  'pointer-events-none absolute inset-y-0 start-0 z-20 hidden bg-gradient-to-l from-transparent to-(--bg-surface) ' +
  'group-data-[overflow-start]/scroll:block ' +
  'rtl:bg-gradient-to-r forced-colors:forced-color-adjust-none forced-colors:to-[Canvas]'

export const FADE_END_CLASS =
  'pointer-events-none absolute inset-y-0 end-0 z-20 hidden bg-gradient-to-r from-transparent to-(--bg-surface) to-[min(1.5rem,100%)] ' +
  'group-data-[overflow-end]/scroll:block ' +
  'rtl:bg-gradient-to-l forced-colors:forced-color-adjust-none forced-colors:to-[Canvas]'
