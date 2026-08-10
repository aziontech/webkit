import { curve, duration } from '@aziontech/theme/animations'

/** Sidebar rail motion presets — values read only from `animate.js` (`duration`, `curve`). */

export type SidebarMotionPhase = 'enter' | 'leave'

export const sidebarMotion: Record<SidebarMotionPhase, { duration: string; curve: string }> = {
  enter: { duration: duration['moderate-02'], curve: curve['expressive-entrance'] },
  leave: { duration: duration['moderate-02'], curve: curve['expressive-exit'] }
}

export function getSidebarRailTransition(options: {
  phase: SidebarMotionPhase
  animated: boolean
}): string | undefined {
  if (!options.animated) return 'none'
  const token = sidebarMotion[options.phase]
  const timing = `${token.duration} ${token.curve}`
  return `width ${timing}, transform ${timing}, opacity ${timing}`
}
