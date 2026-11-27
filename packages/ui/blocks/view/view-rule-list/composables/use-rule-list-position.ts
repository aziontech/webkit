import type { DropdownMenuItemValue } from '@aziontech/ui/dropdown-menu'
import { type Ref, ref } from 'vue'

import type { RuleListControl, RuleListDraft } from '../lib/rule-list'
import type { RuleListPhase, RuleListRule } from '../view-rule-list.vue'

/** The typed position of a rule, kept until it is committed. */
export interface UseRuleListPositionReturn {
  /** The value the position field shows. */
  positionValue: (phase: RuleListPhase, item: RuleListRule) => string
  /** Keeps what was typed. */
  onPositionInput: (item: RuleListRule, value: string) => void
  /** Moves the rule to the typed position. */
  commitPosition: (phase: RuleListPhase, item: RuleListRule, refocus: boolean) => void
  /** Forgets what was typed. */
  cancelPosition: () => void
  /** Runs the move the narrow menu picked. */
  onMoveSelect: (phase: RuleListPhase, item: RuleListRule, value: DropdownMenuItemValue) => void
}

/** The moves the position controls run. */
export interface RuleListMoves {
  /** How many locked rules lead the phase. */
  pinned: (phase: RuleListPhase) => number
  /** The zero-based position of the rule in its phase. */
  position: (phase: RuleListPhase, item: RuleListRule) => number
  /** Moves a rule to a position. */
  moveTo: (phase: RuleListPhase, from: number, to: number, control?: RuleListControl) => void
  /** Moves a rule one step. */
  step: (phase: RuleListPhase, index: number, direction: number, control?: RuleListControl) => void
}

export function useRuleListPosition(
  draft: RuleListDraft,
  { pinned, position, moveTo, step }: RuleListMoves
): UseRuleListPositionReturn {
  const typed: Ref<{ value: string; id: string } | null> = ref(null)

  const positionValue = (phase: RuleListPhase, item: RuleListRule) =>
    typed.value?.id === item.id ? typed.value.value : String(position(phase, item) + 1)

  const onPositionInput = (item: RuleListRule, value: string) => {
    typed.value = { value, id: item.id }
  }

  const commitPosition = (phase: RuleListPhase, item: RuleListRule, refocus: boolean) => {
    const entry = typed.value
    typed.value = null
    if (!entry || entry.id !== item.id) return
    const target = Number.parseInt(entry.value, 10)
    if (!Number.isFinite(target)) return
    moveTo(phase, position(phase, item), target - 1, refocus ? 'position' : undefined)
  }

  const onMoveSelect = (phase: RuleListPhase, item: RuleListRule, value: DropdownMenuItemValue) => {
    const from = position(phase, item)
    if (value === 'top') moveTo(phase, from, pinned(phase), 'menu')
    if (value === 'up') step(phase, from, -1, 'menu')
    if (value === 'down') step(phase, from, 1, 'menu')
    if (value === 'bottom') moveTo(phase, from, draft[phase].length - 1, 'menu')
  }

  return {
    onMoveSelect,
    positionValue,
    onPositionInput,
    commitPosition,
    cancelPosition: () => {
      typed.value = null
    }
  }
}
