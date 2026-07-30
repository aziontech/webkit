/**
 * Responsive overlay positioning — mobile-first bottom sheet below `md` (768px),
 * matching `tokens/primitives/breakpoints.js`.
 */
/**
 * Fluid full-width bottom sheet on mobile; height follows content up to 80% of
 * the *visible* viewport.
 *
 * The cap is `dvh`, not `vh`: on mobile browsers `vh` is the largest viewport
 * (toolbars retracted), so an `80vh` sheet can extend under the URL bar and its
 * bottom edge, footer included, sits off-screen with nothing to scroll it back
 * into view. `dvh` tracks the currently visible area instead.
 */
export const overlayMobileFluidClasses = ['max-md:w-full', 'max-md:h-fit', 'max-md:max-h-[80dvh]']
export const dialogShellPositionClasses = [
  'max-md:items-end max-md:justify-center max-md:p-0',
  'md:items-center md:justify-center md:p-[var(--spacing-md)]'
]
/**
 * The motion wrapper only positions and animates: it declares no height cap and
 * no scroll, so the panel below is the single element that bounds the sheet and
 * the panel body is the single element that scrolls. The wrapper used to repeat
 * the same cap plus `overflow-y-auto`, which could never fire — the panel clips
 * itself at the identical height, leaving the wrapper nothing to scroll.
 */
export const dialogPanelPositionClasses = ['max-md:w-full']
export const dialogPanelShapeClasses = [
  'max-md:rounded-b-[var(--shape-flat)] max-md:rounded-t-[var(--shape-card)]',
  ...overlayMobileFluidClasses
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
  'max-md:rounded-b-[var(--shape-flat)] max-md:rounded-t-[var(--shape-card)]',
  'md:h-full md:min-h-0 md:max-h-full'
]
