import type { InjectionKey, Ref } from 'vue'

export interface TreeContext {
  /** Resolved root data-testid; parts derive from it. */
  testId: Readonly<Ref<string>>
  /** Whether rows carry actions, so the tree renders the treegrid pattern. */
  grid: Readonly<Ref<boolean>>
  /** Whether selection is on, single or multiple. */
  selectable: Readonly<Ref<boolean>>
  /** Mirrors the root editable prop. */
  editable: Readonly<Ref<boolean>>
  /** Id of the node whose rename field is open; empty when none is. */
  renamingId: Readonly<Ref<string>>
  /** Accessible text of the loading row of a lazy node. */
  loadingLabel: Readonly<Ref<string>>
  /** Accessible name of the rename field of a node with this label. */
  renameLabel: (label: string) => string
  /** Submits the rename field of the node with this id. */
  commitRename: (event: KeyboardEvent | FocusEvent, id: string, value: string) => void
  /** Closes the rename field of the node with this id without renaming. */
  cancelRename: (id: string) => void
  /** Id of the treeitem that holds the roving tab stop. */
  tabStop: Readonly<Ref<string>>
  /** Whether the parent with this id is expanded. */
  isExpanded: (id: string) => boolean
  /** Whether the node with this id is the selected one. */
  isSelected: (id: string) => boolean
  /** Expands or collapses the parent with this id. */
  toggle: (id: string) => void
  /** Moves DOM focus to the treeitem with this id. */
  focusItem: (id: string) => void
}

export const TreeInjectionKey: InjectionKey<TreeContext> = Symbol('Tree')
