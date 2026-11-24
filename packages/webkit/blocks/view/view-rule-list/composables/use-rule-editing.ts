import { toast } from '@aziontech/webkit/toast'
import { computed, type ComputedRef, ref, type WritableComputedRef } from 'vue'

import { type RuleForm, type RuleSeed, seedFor } from '../lib/rule-builder'
import { phaseLabel } from '../lib/rule-list'
import { sampleApplicationRules } from '../sample'
import type { RuleListPhase, RuleListRule } from '../view-rule-list.vue'

/** The rules of the Edit Rule variant and the rule open in the builder. */
export interface UseRuleEditingReturn {
  /** The rules, as saved. */
  rules: ComputedRef<RuleListRule[]>
  /** The order is saving. */
  saving: ComputedRef<boolean>
  /** The builder is open. */
  builderOpen: WritableComputedRef<boolean>
  /** The rule open in the builder, or nothing for a new one. */
  editingRule: ComputedRef<RuleSeed | null>
  /** The phase a new rule starts in. */
  newRulePhase: ComputedRef<RuleListPhase>
  /** Saves the new order after a short delay. */
  onSave: (event: MouseEvent, next: RuleListRule[]) => void
  /** Opens a rule in the builder. */
  openRule: (row: RuleListRule | null) => void
  /** Opens the builder for a new rule. */
  addRule: (phase?: RuleListPhase) => void
  /** Takes what the builder saved. */
  applyRule: (form: RuleForm) => void
}

const updatedRule = (row: RuleListRule, form: RuleForm): RuleListRule => ({
  ...row,
  name: form.name.trim(),
  description: form.description.trim(),
  active: form.active,
  modified: new Date(),
  author: 'You'
})

const createdRule = (id: string, form: RuleForm): RuleListRule => ({
  id,
  name: form.name.trim(),
  description: form.description.trim(),
  phase: form.phase,
  author: 'You',
  modified: new Date(),
  active: form.active,
  locked: false
})

export function useRuleEditing(): UseRuleEditingReturn {
  const rules = ref<RuleListRule[]>(sampleApplicationRules.map((item) => ({ ...item })))
  const saving = ref(false)
  const builderOpen = ref(false)
  const editingRule = ref<RuleSeed | null>(null)
  const editingRow = ref<RuleListRule | null>(null)
  const newRulePhase = ref<RuleListPhase>('request')
  let createdCount = 0

  const openRule = (row: RuleListRule | null) => {
    editingRow.value = row
    editingRule.value = row ? seedFor(row) : null
    builderOpen.value = true
  }

  const applyRule = (form: RuleForm) => {
    const row = editingRow.value
    if (row) {
      const updated = updatedRule(row, form)
      rules.value = rules.value.map((item) => (item.id === row.id ? updated : item))
      toast.success(`${updated.name} saved.`, {
        description: 'The rule runs with its new criteria and behaviors.'
      })
      return
    }
    const created = createdRule(`re-new-${(createdCount += 1)}`, form)
    rules.value = [...rules.value, created]
    toast.success(`${created.name} added.`, {
      description: `It runs last in the ${phaseLabel(form.phase)} phase. Move it to change when it runs.`,
      actions: [{ label: 'Edit', onClick: () => openRule(created) }]
    })
  }

  return {
    rules: computed(() => rules.value),
    saving: computed(() => saving.value),
    builderOpen: computed({
      get: () => builderOpen.value,
      set: (value) => {
        builderOpen.value = value
      }
    }),
    editingRule: computed(() => editingRule.value),
    newRulePhase: computed(() => newRulePhase.value),
    onSave: (_event, next) => {
      if (saving.value) return
      saving.value = true
      setTimeout(() => {
        rules.value = next
        saving.value = false
      }, 900)
    },
    openRule,
    addRule: (phase = 'request') => {
      newRulePhase.value = phase
      openRule(null)
    },
    applyRule
  }
}
