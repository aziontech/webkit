import { curve, duration } from '@aziontech/theme/animations'

/**
 * Sidebar rail motion presets — values read only from `animate.js` (`duration`, `curve`).
 *
 * Collapsing is per-phase, open-vs-close motion, which DESIGN.md § Motion routes through a
 * presets module rather than the catalogued `animate-*` keyframes: those are fixed-direction
 * entrances with baked-in timing, they cannot express an enter/leave pair off one boolean, and
 * none of them animates a width. The timing therefore lives here as an inline `transition`;
 * the width / transform / opacity are inline values because a gesture writes them frame by
 * frame — they are continuous, not variants, so they cannot be `data-*` classes.
 */

export type SidebarMotionPhase = 'enter' | 'leave'

/** Rail phases mapped to `duration` / `curve` primitives from animate.js. */
export const sidebarMotion: Record<SidebarMotionPhase, { duration: string; curve: string }> = {
  enter: { duration: duration['moderate-02'], curve: curve['expressive-entrance'] },
  leave: { duration: duration['moderate-02'], curve: curve['expressive-exit'] }
}

/**
 * The rail's own transition. Width, transform and opacity share one timing so the slide and
 * the morph of whatever sits beside the rail stay locked together.
 *
 * `null` means *do not transition*: a drag has to track the pointer frame for frame, and an
 * eased width would lag behind the cursor and read as a broken handle. Reduced motion takes
 * the same path — the rail is simply where it lands.
 */
export function getSidebarRailTransition(options: {
  phase: SidebarMotionPhase
  animated: boolean
}): string | undefined {
  if (!options.animated) return 'none'
  const token = sidebarMotion[options.phase]
  const timing = `${token.duration} ${token.curve}`
  return `width ${timing}, transform ${timing}, opacity ${timing}`
}
