import type { ComputedRef, InjectionKey, ShallowRef } from 'vue'

/** How a sub reveals its children: expanded in place, or as a pushed level. */
export type MenuSubKind = 'inline' | 'drill'

/** Direction of the last drill-stack change; drives which level slide plays. */
export type MenuMotion = 'push' | 'pop' | 'none'

/** A single row of the data-driven navigation tree. */
export type MenuNode = {
  /** Stable identity of the row; also the entry this row contributes to the drill stack. */
  id: string
  /** Visible row text. */
  label: string
  /** Leading glyph class. */
  icon?: string
  /** Destination URL; renders the row as an anchor when set. */
  href?: string
  /** Link target when `href` is set. */
  target?: '_self' | '_blank'
  /** Short text rendered in the row's trailing badge. */
  tagValue?: string
  /** Blocks activation of the row. */
  disabled?: boolean
  /** Whether `children` expand in place or replace the menu. */
  kind?: MenuSubKind
  /** Initial state of an inline row that owns children. */
  defaultOpen?: boolean
  /** Nested rows; a row with children renders as a sub instead of a leaf. */
  children?: MenuNode[]
  /**
   * Sections of a drilled level. A pushed level is a menu, so it is described by the very
   * same shape the root takes — which is what makes a second-level nav the same anatomy as
   * the first, groups and labels included. `kind: 'drill'` only (an inline row is a list,
   * not a level) and it takes precedence over `children`.
   */
  groups?: MenuGroupNode[]
}

/**
 * A section of the data-driven navigation tree. A section separates rows under a title; it
 * does not fold them — folding belongs to a condensed row, which has a chevron and a rail
 * to say which rows it owns.
 */
export type MenuGroupNode = {
  /** Header text; omit for an unlabeled block. */
  label?: string
  /** Rows of the section. */
  items: MenuNode[]
}

/** One entry of the drill stack. */
export interface MenuLevel {
  /** Id of the sub that owns the level — its `MenuNode.id` in data-driven mode. */
  id: string
  /** Label of the trigger that pushed the level; names the level and the Back row. */
  label: string
}

export interface MenuContext {
  /** Drill stack, outermost first. Empty at the root level. */
  levels: ComputedRef<MenuLevel[]>
  /** Direction of the last stack change; back to `none` once the slide has finished. */
  motion: ComputedRef<MenuMotion>
  /**
   * Whether a level already on the stack at first render plays its entrance. Mirrors the root's
   * `enterOnMount`, because only the consumer can tell a restored stack that was just *entered*
   * from one the reader was already inside (both remount the host and restore the same stack).
   */
  enterOnMount: ComputedRef<boolean>
  /** Element a pushed drill level teleports into, so it escapes the hidden root level. */
  levelHost: ShallowRef<globalThis.HTMLElement | null>
  /** Whether `id` is the deepest level on the stack — the one the user is looking at. */
  isCurrentLevel: (id: string) => boolean
  /** Whether `id` must stay in the DOM: on the stack, or sliding out after a pop. */
  isLevelMounted: (id: string) => boolean
  /** Pushes a drill level; `trigger` is refocused when that level is popped. */
  push: (level: MenuLevel, trigger: globalThis.HTMLElement | null) => void
  /**
   * Announces a drill sub's label and trigger element to the root as soon as its trigger
   * registers — independently of any push. A stack seeded from `v-model:path` (a consumer
   * persisting it across a remount, which is the only way a level survives a navigation) never
   * ran a push, so without this the level it restores has no label for `Menu.Back` to show and
   * no element to return focus to.
   */
  registerLevel: (id: string, label: string, trigger: globalThis.HTMLElement | null) => void
  /** Pops the deepest level and restores focus to the trigger that pushed it. */
  pop: () => void
  /** Registers the Back row so a push can move focus to it. */
  setBackElement: (el: globalThis.HTMLElement | null) => void
  /**
   * Anchor inside the CURRENT drill level that `Menu.Back` renders into. Back heads the
   * level, so it lives in the level's own box: it then slides with it and — crucially —
   * occupies no space in the root's flow, so popping cannot shift the menu it returns to.
   */
  backHost: ShallowRef<globalThis.HTMLElement | null>
  /** Registers that anchor; only the level that is current may claim it. */
  setBackHost: (el: globalThis.HTMLElement | null) => void
  /** Whether the inline sub with this id is expanded. */
  isExpanded: (id: string) => boolean
  /** Expands or collapses the inline sub with this id. */
  setExpanded: (id: string, open: boolean) => void
  /** Seeds a sub's initial state from its `defaultOpen`, once per id. */
  registerExpandable: (id: string, defaultOpen: boolean) => void
}

export const MenuInjectionKey: InjectionKey<MenuContext> = Symbol('Menu')

export interface MenuSubContext {
  /** Stable id of this sub — its `MenuNode.id` in data-driven mode, generated otherwise. */
  id: string
  /** Nesting depth: 0 directly inside a group, one more per ancestor sub. */
  level: number
  /** Id of the trigger button, for the content's `aria-labelledby`. */
  triggerId: string
  /** Id of the content list, for the trigger's `aria-controls`. */
  contentId: string
  /** Whether the children are revealed; follows the drill stack when `kind` is `drill`. */
  open: ComputedRef<boolean>
  /** How the children are revealed, taken from the registered trigger. */
  kind: ComputedRef<MenuSubKind>
  /** Visible label of the registered trigger. */
  label: ComputedRef<string>
  /** Registers the trigger's kind, label and element so the sub can drive both modes. */
  registerTrigger: (kind: MenuSubKind, label: string, el: globalThis.HTMLElement | null) => void
  /** Toggles the inline disclosure. */
  toggle: () => void
  /** Sets the inline disclosure state explicitly, for the arrow keys. */
  setOpen: (value: boolean) => void
  /** Pushes this sub onto the root's drill stack. */
  push: () => void
}

export const MenuSubInjectionKey: InjectionKey<MenuSubContext> = Symbol('MenuSub')
