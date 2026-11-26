import { type ComputedRef, onScopeDispose, reactive, watch } from 'vue'

import type { SchemaFormOptionState } from '../injection-key'
import type { SchemaFormNode } from '../schema'

export interface UseSchemaFormOptionsReturn {
  optionStates: Map<string, SchemaFormOptionState>
  searchOptions: (node: SchemaFormNode, query: string) => void
}

async function loadInto(state: SchemaFormOptionState, node: SchemaFormNode, query: string) {
  if (!node.load) return
  state.request += 1
  const request = state.request
  state.loading = true
  state.failed = false
  try {
    const list = await node.load(query)
    if (state.request === request) state.options = Array.isArray(list) ? list : []
  } catch {
    if (state.request === request) {
      state.options = []
      state.failed = true
    }
  } finally {
    if (state.request === request) state.loading = false
  }
}

export function useSchemaFormOptions(
  leaves: ComputedRef<SchemaFormNode[]>
): UseSchemaFormOptionsReturn {
  const optionStates = reactive(new Map<string, SchemaFormOptionState>())
  const searchTimers = new Map<string, ReturnType<typeof setTimeout>>()

  const loadOptions = (node: SchemaFormNode, query: string) => {
    if (!node.load) return
    if (!optionStates.has(node.path))
      optionStates.set(node.path, { options: [], loading: false, failed: false, request: 0 })
    return loadInto(optionStates.get(node.path) as SchemaFormOptionState, node, query)
  }

  const searchOptions = (node: SchemaFormNode, query: string) => {
    clearTimeout(searchTimers.get(node.path))
    searchTimers.set(
      node.path,
      setTimeout(() => {
        searchTimers.delete(node.path)
        void loadOptions(node, query)
      }, 250)
    )
  }

  watch(
    leaves,
    (list) => {
      for (const node of list) {
        if (node.load && !optionStates.has(node.path)) void loadOptions(node, '')
      }
    },
    { immediate: true }
  )

  onScopeDispose(() => {
    for (const timer of searchTimers.values()) clearTimeout(timer)
    searchTimers.clear()
  })

  return { optionStates, searchOptions }
}
