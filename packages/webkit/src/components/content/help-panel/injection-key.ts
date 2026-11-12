import type { ComputedRef, InjectionKey } from 'vue'

/** Where the reader is in a tutorial task, as confirmed by the real UI. */
export type HelpPanelTaskStatus = 'upcoming' | 'current' | 'complete'

export interface HelpPanelTaskHandle {
  /** 1-based position of the task in document order. */
  index: ComputedRef<number>
}

export interface HelpPanelTutorialContext {
  /** Registers a task with a getter for its status and returns its reactive handle. */
  register: (id: symbol, status: () => HelpPanelTaskStatus) => HelpPanelTaskHandle
  /** Hands the task's root element over once mounted, so order is read from the DOM. */
  attach: (id: symbol, el: globalThis.HTMLElement | null) => void
  /** Removes a previously registered task; called by the task on unmount. */
  unregister: (id: symbol) => void
  /** Number of registered tasks. */
  total: ComputedRef<number>
  /** Number of registered tasks whose status is complete. */
  complete: ComputedRef<number>
}

export const HelpPanelTutorialInjectionKey: InjectionKey<HelpPanelTutorialContext> =
  Symbol('HelpPanelTutorial')
