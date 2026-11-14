import { duration } from '@aziontech/theme/animations'

import { DRAWER_EXIT_MS } from '../../drawer/presets/transitions'

export type DialogMotionState = 'open' | 'closed'

const dialogExitDurationMs = Number.parseInt(duration['moderate-01'], 10)

export const DIALOG_EXIT_MS = Math.max(dialogExitDurationMs + 32, DRAWER_EXIT_MS + 32)
