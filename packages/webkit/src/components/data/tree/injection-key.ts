import type { InjectionKey, Ref } from 'vue'

export interface TreeContext {
  /** Resolved root data-testid; parts derive from it. */
  testId: Readonly<Ref<string>>
  /** Mirrors the root selectable prop. */
  selectable: Readonly<Ref<boolean>>
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
