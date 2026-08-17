// WHICH TAB HOLDS UNSAVED WORK.
//
// A tabbed detail page has one commit surface per tab — Main Settings commits the
// application record, Rules Engine commits the order its rules run in — and they are
// genuinely different commits, so they keep their own bars. What they cannot keep is
// their own SECRET: the bars sit in the same place at the bottom of the page, so an
// edit pending on the tab you are not looking at is invisible, and the Discard under
// your cursor belongs to something else.
//
// This is the registry that fixes that. A tab reports whether it is dirty and how to
// resolve it; the shell reads the whole map, marks the tabs that hold work, and asks
// before letting the reader leave one.
//
// WHY A MODULE-LEVEL REGISTRY AND NOT PROPS. The shell holds a ref to the ACTIVE view
// only — the others are alive inside `<KeepAlive>` but unreachable — so a tab that is
// off screen has no way to answer "do you have unsaved work". Registering into a
// module the shell also reads is what gives the deactivated tabs a voice. The entry is
// removed when the component's scope is disposed, which for a KeepAlive'd view is a
// real unmount, not a tab switch — exactly the lifetime the state should have.
import { onScopeDispose, reactive, toValue, watchEffect } from 'vue'

/** `{ [tabValue]: { dirty, saving, label, save, discard } }` */
const registry = reactive({})

/**
 * Registers the calling view's commit state under its tab id.
 *
 * @param {string} tab      the tab's `value`, the same id the shell routes on
 * @param {object} state    `{ dirty, saving }` — refs, getters or plain values
 * @param {object} handlers `{ label, save, discard }` — how the shell resolves it
 */
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

/** Whether that tab is holding work the reader has not committed. */
export function isTabDirty(tab) {
  return Boolean(registry[tab]?.dirty)
}

/** The tab's entry, for a shell that needs to resolve it (save / discard / name it). */
export function tabCommit(tab) {
  return registry[tab] ?? null
}
