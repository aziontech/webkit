import { inject } from 'vue'

import { type BoardContext, BoardInjectionKey } from '../injection-key'

export function useBoardContext(): BoardContext {
  const context = inject(BoardInjectionKey, null)
  if (!context) throw new Error('Board.* sub-components must be used inside <Board>.')
  return context
}
