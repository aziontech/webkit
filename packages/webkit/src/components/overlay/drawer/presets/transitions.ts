import { duration } from '@aziontech/theme/animations'

export type DrawerMotionState = 'open' | 'closed'

export const DRAWER_EXIT_MS = Math.max(
  Number.parseInt(duration['slow-01'], 10),
  Number.parseInt(duration['slow-02'], 10)
)
