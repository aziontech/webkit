import { type ComputedRef, nextTick, type Ref } from 'vue'

import { phaseLabel, pinnedCount, type RuleListControl, type RuleListDraft } from '../lib/rule-list'
import type { RuleListPhase, RuleListRule } from '../view-rule-list.vue'

/** Moving rules within their phase, and what each move says. */
export interface UseRuleListReorderReturn {
  /** How many locked rules lead the phase. */
  pinned: (phase: RuleListPhase) => number
  /** The rule at this index can move one step this way. */
  canMove: (phase: RuleListPhase, index: number, direction: number) => boolean
  /** Why the rule cannot move, or nothing. */
  lockReason: (phase: RuleListPhase, item: RuleListRule) => string
  /** The zero-based position of the rule in its phase. */
  position: (phase: RuleListPhase, item: RuleListRule) => number
  /** Moves a rule to a position. */
  moveTo: (phase: RuleListPhase, from: number, to: number, control?: RuleListControl) => void
  /** Moves a rule one step. */
  step: (phase: RuleListPhase, index: number, direction: number, control?: RuleListControl) => void
  /** Takes the order the table was dragged into. */
  reorderRows: (phase: RuleListPhase, next: RuleListRule[]) => void
  /** Whether the table lets a row be dragged. */
  reorderable: (phase: RuleListPhase) => (row: RuleListRule) => boolean
}

const lockText = {
  locked: 'The default rule runs first and stays first.',
  searching: 'Clear the search to change the order rules run in.',
  saving: 'Wait for the save to finish.',
  alone: 'There is no other rule in this phase to move it past.'
}

const focusControl = (listEl: Ref<HTMLElement | null>, id: string, control: RuleListControl) =>
  nextTick(() => {
    const row = listEl.value?.querySelector(`[data-rule-id="${id}"]`)
    const target = row?.querySelector<HTMLButtonElement>(`[data-control="${control}"]`)
    const usable =
      target && !target.disabled
        ? target
        : (row?.querySelector<HTMLElement>('[data-control]:not(:disabled)') ??
          row?.closest('[data-reorder-row]')?.querySelector<HTMLElement>('[data-reorder-handle]'))
    usable?.focus({ preventScroll: false })
  })

export function useRuleListReorder(
  draft: RuleListDraft,
  searching: ComputedRef<boolean>,
  saving: ComputedRef<boolean>,
  listEl: Ref<HTMLElement | null>,
  announce: (text: string) => void
): UseRuleListReorderReturn {
  const pinned = (phase: RuleListPhase) => pinnedCount(draft[phase])
  const canReorder = (phase: RuleListPhase) =>
    !searching.value && !saving.value && draft[phase].length - pinned(phase) > 1
  const canMove = (phase: RuleListPhase, index: number, direction: number) => {
    if (!canReorder(phase) || index < pinned(phase)) return false
    const to = index + direction
    return to >= pinned(phase) && to < draft[phase].length
  }
  const lockReason = (phase: RuleListPhase, item: RuleListRule) => {
    if (item.locked) return lockText.locked
    if (searching.value) return lockText.searching
    if (saving.value) return lockText.saving
    if (!canReorder(phase)) return lockText.alone
    return ''
  }

  const moveTo = (phase: RuleListPhase, from: number, to: number, control?: RuleListControl) => {
    const list = draft[phase]
    const head = pinned(phase)
    const target = Math.min(Math.max(to, head), list.length - 1)
    if (from < head || target === from || !canReorder(phase)) return
    const [moved] = list.splice(from, 1)
    list.splice(target, 0, moved)
    announce(
      `${moved.name} moved to position ${target + 1} of ${list.length} in the ${phaseLabel(phase)} phase.`
    )
    if (control) focusControl(listEl, moved.id, control)
  }
  const step = (
    phase: RuleListPhase,
    index: number,
    direction: number,
    control?: RuleListControl
  ) => {
    if (!canMove(phase, index, direction)) return
    moveTo(phase, index, index + direction, control)
  }
  const position = (phase: RuleListPhase, item: RuleListRule) => draft[phase].indexOf(item)

  return {
    pinned,
    canMove,
    lockReason,
    position,
    moveTo,
    step,
    reorderRows: (phase, next) => {
      if (searching.value) return
      draft[phase] = next
    },
    reorderable: (phase) => (row) => !lockReason(phase, row)
  }
}
