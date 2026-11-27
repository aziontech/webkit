import { computed, type ComputedRef, type MaybeRefOrGetter, ref, toValue, watch } from 'vue'

import {
  ALL_PHASES,
  applyEdits,
  changesOf,
  keepUnsaved,
  type RuleListDraft,
  type RuleListPhaseChanges,
  type RuleListPhaseOption,
  type RuleListSnapshot,
  snapshotOf
} from '../lib/rule-list'
import type { RuleListEdit, RuleListRule } from '../view-rule-list.vue'

/** The saved order of the rules and the edits made since. */
export interface UseRuleListDraftReturn {
  /** The draft differs from the saved order or status. */
  dirty: ComputedRef<boolean>
  /** The changes per phase, for the review dialog. */
  changes: ComputedRef<RuleListPhaseChanges[]>
  /** How many changes there are. */
  changeCount: ComputedRef<number>
  /** Takes the draft as the saved state. */
  markSaved: () => void
  /** Puts the draft back in the saved order and status. */
  discard: () => void
}

export function useRuleListDraft(
  draft: RuleListDraft,
  source: MaybeRefOrGetter<RuleListRule[]>,
  phases: MaybeRefOrGetter<RuleListPhaseOption[]>,
  defaultEdits: MaybeRefOrGetter<RuleListEdit[]>
): UseRuleListDraftReturn {
  const snapshot = () => snapshotOf(draft, toValue(phases))
  const saved = ref<RuleListSnapshot>(snapshot())

  let seeded = false
  watch(
    () => toValue(source),
    (next) => {
      const before = seeded ? snapshot() : null
      const savedBefore = saved.value
      for (const { value } of ALL_PHASES) {
        draft[value] = next.filter((item) => item.phase === value).map((item) => ({ ...item }))
      }
      saved.value = snapshot()
      if (before) keepUnsaved(draft, before, savedBefore, saved.value)
      if (!seeded && next.length) {
        seeded = true
        applyEdits(draft, toValue(defaultEdits))
      }
    },
    { immediate: true }
  )

  const dirty = computed(() => JSON.stringify(snapshot()) !== JSON.stringify(saved.value))
  const changes = computed(() => changesOf(draft, saved.value, toValue(phases)))
  const changeCount = computed(() =>
    changes.value.reduce((sum, phase) => sum + phase.items.length, 0)
  )

  const discard = () => {
    for (const { value } of toValue(phases)) {
      const byId = Object.fromEntries(draft[value].map((item) => [item.id, item]))
      draft[value] = saved.value.order[value].map((id) => byId[id]).filter(Boolean)
      for (const item of draft[value]) item.active = saved.value.active[item.id]
    }
  }

  const markSaved = () => {
    saved.value = snapshot()
  }

  return { dirty, changes, changeCount, markSaved, discard }
}
