/**
 * Mobile-first bottom sheet below the md breakpoint (768px). Height caps use dvh,
 * not vh: mobile vh assumes retracted toolbars, so a vh sheet ends under the URL bar.
 */
export const overlayMobileFluidClasses = ['max-md:w-full', 'max-md:h-fit', 'max-md:max-h-[80dvh]']
export const dialogShellPositionClasses = [
  'max-md:items-end max-md:justify-center max-md:p-0',
  'md:items-center md:justify-center md:p-(--spacing-md)'
]
/**
 * The motion wrapper only positions and animates — no cap, no scroll — so the panel
 * alone bounds the sheet and its body alone scrolls; a cap here could never fire.
 */
export const dialogPanelPositionClasses = ['max-md:w-full']
export const dialogPanelShapeClasses = [
  'max-md:rounded-b-(--shape-flat) max-md:rounded-t-(--shape-card)',
  // Below `md` the sheet is fluid and hugs its content up to the cap.
  'max-md:w-full max-md:h-fit',
  /*
   * One cap at every width — unbounded from md up, a tall body grew the modal past
   * the screen (measured 771px in a 720px viewport) with nothing scrolling; the
   * body scrolls only when the panel is bounded. dvh excludes mobile toolbars.
   */
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
