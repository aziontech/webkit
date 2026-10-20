import { onScopeDispose, reactive, toValue, watchEffect } from 'vue'

const registry = reactive({})

export function useTabDirty(tab, state, handlers = {}) {
  watchEffect(() => {
    registry[tab] = {
      dirty: Boolean(toValue(state.dirty)),
      saving: Boolean(toValue(state.saving)),
      label: handlers.label ?? '',
      save: handlers.save,
      discard: handlers.discard
    }
  })

  onScopeDispose(() => {
    delete registry[tab]
  })
}

export function isTabDirty(tab) {
  return Boolean(registry[tab]?.dirty)
}

export function tabCommit(tab) {
  return registry[tab] ?? null
}
