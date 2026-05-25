/**
 * Shared bottom-sheet motion (mobile `max-md`) — same transform pattern as Drawer.
 * Timing comes from `drawer/presets/transitions.ts` (`slow-*` + expressive curves).
 */
export const bottomSheetPanelStateClasses = [
  'max-md:data-[state=closed]:translate-y-full',
  'max-md:data-[state=open]:translate-y-0',
  'max-md:translate-x-0'
]
export const bottomSheetPanelMotionClasses = [
  'motion-reduce:transition-none',
  'motion-reduce:transform-none'
]
