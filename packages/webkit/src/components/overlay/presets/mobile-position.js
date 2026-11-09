export const overlayMobileFluidClasses = ['max-md:w-full', 'max-md:h-fit', 'max-md:max-h-[80dvh]']
export const dialogShellPositionClasses = [
  'max-md:items-end max-md:justify-center max-md:p-0',
  'md:items-center md:justify-center md:p-(--spacing-md)'
]
export const dialogPanelPositionClasses = ['max-md:w-full']
export const dialogPanelShapeClasses = [
  'max-md:rounded-b-(--shape-flat) max-md:rounded-t-(--shape-card)',
  'max-md:w-full max-md:h-fit',
  'max-h-[80dvh]'
]
export const drawerShellPositionClasses = [
  'max-md:inset-x-0 max-md:bottom-0 max-md:top-auto',
  'max-md:justify-center',
  ...overlayMobileFluidClasses,
  'md:inset-y-0 md:h-full md:min-h-full md:w-full'
]
export const drawerPanelPositionClasses = [
  ...overlayMobileFluidClasses,
  'max-md:max-w-none',
  'max-md:rounded-b-(--shape-flat) max-md:rounded-t-(--shape-card)',
  'md:h-full md:min-h-0 md:max-h-full'
]
