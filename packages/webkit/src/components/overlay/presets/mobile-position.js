/**
 * Responsive overlay positioning — mobile-first bottom sheet below `md` (768px),
 * matching `tokens/primitives/breakpoints.js`.
 */
/** Fluid full-width bottom sheet on mobile; height follows content up to 80vh. */
export const overlayMobileFluidClasses = ['max-md:w-full', 'max-md:h-fit', 'max-md:max-h-[80vh]']
export const dialogShellPositionClasses = [
  'max-md:items-end max-md:justify-center max-md:p-0',
  'md:items-center md:justify-center md:p-spacing-elements-md'
]
export const dialogPanelPositionClasses = [...overlayMobileFluidClasses, 'max-md:overflow-y-auto']
export const dialogPanelShapeClasses = [
  'max-md:rounded-b-[var(--shape-flat)] max-md:rounded-t-[var(--shape-card)]',
  ...overlayMobileFluidClasses
]
export const drawerShellPositionClasses = [
  'max-md:inset-x-0 max-md:bottom-0 max-md:top-auto',
  'max-md:justify-center',
  ...overlayMobileFluidClasses,
  'md:inset-y-0 md:h-full md:min-h-full md:w-auto'
]
export const drawerPanelPositionClasses = [
  ...overlayMobileFluidClasses,
  'max-md:max-w-none',
  'max-md:overflow-y-auto',
  'max-md:rounded-b-[var(--shape-flat)] max-md:rounded-t-[var(--shape-card)]',
  'md:h-full md:min-h-0 md:max-h-full'
]
