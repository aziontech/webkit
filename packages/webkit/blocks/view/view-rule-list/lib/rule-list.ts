import type { TableColumn } from '@aziontech/webkit/data-table'

import type { RuleListEdit, RuleListPhase, RuleListRule } from '../view-rule-list.vue'

/** A phase and its label. */
export interface RuleListPhaseOption {
  /** The phase. */
  value: RuleListPhase
  /** Its label. */
  label: string
}

/** The saved order and status of every rule. */
export interface RuleListSnapshot {
  /** Rule ids per phase, in run order. */
  order: Record<string, string[]>
  /** Whether each rule runs, by id. */
  active: Record<string, boolean>
}

/** One line of the review dialog. */
export interface RuleListChangeLine {
  /** Stable key. */
  key: string
  /** The rule's name. */
  name: string
  /** What changed. */
  text: string
}

/** The changes of one phase. */
export interface RuleListPhaseChanges extends RuleListPhaseOption {
  /** Its lines. */
  items: RuleListChangeLine[]
}

/** The rules of every phase, as edited. */
export type RuleListDraft = Record<RuleListPhase, RuleListRule[]>

/** The control that moved a rule, to focus it again. */
export type RuleListControl = 'up' | 'down' | 'position' | 'menu'

export const ALL_PHASES: RuleListPhaseOption[] = [
  { value: 'request', label: 'Request' },
  { value: 'response', label: 'Response' }
]

export const phaseLabel = (phase: RuleListPhase) =>
  ALL_PHASES.find((item) => item.value === phase)?.label ?? phase

export const snapshotOf = (
  draft: RuleListDraft,
  phases: RuleListPhaseOption[]
): RuleListSnapshot => ({
  order: Object.fromEntries(phases.map(({ value }) => [value, draft[value].map((r) => r.id)])),
  active: Object.fromEntries(
    phases.flatMap(({ value }) => draft[value].map((r) => [r.id, r.active]))
  )
})

export const applyEdits = (draft: RuleListDraft, edits: RuleListEdit[]) => {
  for (const edit of edits) {
    const list = draft[edit.phase]
    const from = list.findIndex((item) => item.id === edit.id)
    if (from < 0) continue
    if (edit.to !== undefined) list.splice(edit.to, 0, ...list.splice(from, 1))
    if (edit.active !== undefined)
      list[list.findIndex((item) => item.id === edit.id)].active = edit.active
  }
}

const keepOrder = (draft: RuleListDraft, phase: RuleListPhase, order: string[]) => {
  const rank = (id: string) => {
    const at = order.indexOf(id)
    return at < 0 ? order.length : at
  }
  draft[phase] = [...draft[phase]].sort((a, b) => rank(a.id) - rank(b.id))
}

export const keepUnsaved = (
  draft: RuleListDraft,
  before: RuleListSnapshot,
  savedBefore: RuleListSnapshot,
  savedNow: RuleListSnapshot
) => {
  for (const { value } of ALL_PHASES) {
    const order = before.order[value] ?? []
    if (order.join() !== (savedBefore.order[value] ?? []).join()) keepOrder(draft, value, order)
    for (const item of draft[value]) {
      const local = before.active[item.id]
      const changedHere = local !== undefined && local !== savedBefore.active[item.id]
      if (changedHere && savedNow.active[item.id] === savedBefore.active[item.id])
        item.active = local
    }
  }
}

const changeLines = (
  item: RuleListRule,
  index: number,
  phase: RuleListPhase,
  saved: RuleListSnapshot
) => {
  const lines: RuleListChangeLine[] = []
  const before = saved.order[phase].indexOf(item.id)
  if (before !== index) {
    lines.push({
      key: `${item.id}-order`,
      name: item.name,
      text: `moves from position ${before + 1} to ${index + 1}`
    })
  }
  if (saved.active[item.id] !== item.active) {
    lines.push({
      key: `${item.id}-status`,
      name: item.name,
      text: item.active ? 'is turned on' : 'is turned off'
    })
  }
  return lines
}

export const changesOf = (
  draft: RuleListDraft,
  saved: RuleListSnapshot,
  phases: RuleListPhaseOption[]
): RuleListPhaseChanges[] =>
  phases
    .map((phase) => ({
      ...phase,
      items: draft[phase.value].flatMap((item, index) =>
        changeLines(item, index, phase.value, saved)
      )
    }))
    .filter((phase) => phase.items.length)

export const pinnedCount = (list: RuleListRule[]) => {
  let count = 0
  while (count < list.length && list[count].locked) count += 1
  return count
}

export const matchesSearch = (item: RuleListRule, search: string) => {
  const term = search.trim().toLowerCase()
  if (!term) return true
  return [item.name, item.description, item.author].some((field) =>
    field.toLowerCase().includes(term)
  )
}

const nameColumn: TableColumn = {
  accessorKey: 'name',
  header: 'Name',
  principal: true,
  hideable: false
}
const descriptionColumn: TableColumn = {
  accessorKey: 'description',
  header: 'Description',
  grow: 3
}
const modifiedColumn: TableColumn = { accessorKey: 'modified', header: 'Last modified', grow: 2 }
const statusColumn: TableColumn = { id: 'status', header: 'Status' }
const moveColumn: TableColumn = { id: 'move', header: 'Position', hideable: false }

export const ruleColumns = (narrow: boolean): TableColumn[] =>
  narrow
    ? [
        nameColumn,
        { ...statusColumn, width: 64, frozen: 'end' },
        { ...moveColumn, header: 'Move', width: 56, align: 'center', frozen: 'end' }
      ]
    : [
        { ...moveColumn, width: 168 },
        nameColumn,
        descriptionColumn,
        { ...statusColumn, width: 152 },
        modifiedColumn
      ]

export const pageDescription = (subject: string) =>
  subject === 'firewall'
    ? 'Rules run top to bottom on every request this firewall sees, until one of them refuses it. Turn a rule off to skip it without losing its place.'
    : 'Rules run top to bottom within each phase, so their order is their behavior. Turn a rule off to skip it without losing its place.'
