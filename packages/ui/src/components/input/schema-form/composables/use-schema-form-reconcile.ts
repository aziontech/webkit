import { type ComputedRef, watch } from 'vue'

import { expand, getAt, leavesOf, type SchemaFormNode, type SchemaFormUi, setAt } from '../schema'

type FormValue = Record<string, unknown>

const PASSES = 5

function reconcileValue(
  nodes: SchemaFormNode[],
  value: FormValue,
  ui: Record<string, SchemaFormUi>,
  stash: Map<string, unknown>,
  known: Set<string>
): { next: FormValue; leaves: SchemaFormNode[] } {
  let next = value
  let leaves: SchemaFormNode[] = []
  for (let pass = 0; pass < PASSES; pass += 1) {
    const view = expand(nodes, next, ui)
    let changed = false
    for (const path of view.hidden) {
      const held = getAt(next, path)
      if (held === undefined) continue
      stash.set(path, held)
      next = setAt(next, path, undefined)
      changed = true
    }
    leaves = leavesOf(view.nodes)
    for (const leaf of leaves) {
      if (known.has(leaf.path)) continue
      known.add(leaf.path)
      if (getAt(next, leaf.path) !== undefined) continue
      const restored = stash.get(leaf.path)
      stash.delete(leaf.path)
      const seed = restored ?? leaf.schema.default
      if (seed === undefined) continue
      next = setAt(next, leaf.path, restored ?? structuredClone(seed))
      changed = true
    }
    if (!changed) break
  }
  return { next, leaves }
}

export function useSchemaFormReconcile(
  nodes: ComputedRef<SchemaFormNode[]>,
  value: ComputedRef<FormValue>,
  ui: () => Record<string, SchemaFormUi>,
  commit: (next: FormValue) => void
): void {
  const stash = new Map<string, unknown>()
  let seen = new Set<string>()

  const reconcile = () => {
    const { next, leaves } = reconcileValue(nodes.value, value.value, ui(), stash, new Set(seen))
    seen = new Set(leaves.map((leaf) => leaf.path))
    if (next !== value.value) commit(next)
  }

  watch(
    nodes,
    () => {
      seen = new Set()
      reconcile()
    },
    { immediate: true }
  )

  watch(value, reconcile, { deep: true })
}
