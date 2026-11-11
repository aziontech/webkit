import type { ComputedRef, InjectionKey } from 'vue'

/** One step of a tutorial task: what the reader does at one place on the page. */
export interface TutorialStep {
  /** The step's title, shown in the hotspot popover and in the panel's step list. */
  title: string
  /** The step's instructions, shown in the hotspot popover. */
  content: string
  /** The `hotspotId` of the `Hotspot` placed beside the control this step is about. */
  hotspotId: string
}

/** One task of a tutorial: an ordered group of steps with one outcome. */
export interface TutorialTask {
  /** What the reader does, in their words. */
  title: string
  /** The task's steps, in order. */
  steps: TutorialStep[]
}

/** One tutorial the panel lists and the reader can run. */
export interface Tutorial {
  /** Stable identifier, the value of `v-model:active` while this tutorial runs. */
  id: string
  /** The tutorial's name. */
  title: string
  /** One line on what the reader will have done at the end. */
  description?: string
  /** The owner marks the tutorial done (from what the product recorded); the list shows it as completed. */
  completed?: boolean
  /** The tasks, in order. */
  tasks: TutorialTask[]
}

/** A step of the running tutorial with its position, flattened across tasks. */
export interface TutorialFlatStep extends TutorialStep {
  /** 0-based position across every task of the running tutorial. */
  index: number
  /** 0-based position of the task that holds the step. */
  taskIndex: number
}

export interface TutorialContext {
  /** Every tutorial the provider holds. */
  tutorials: ComputedRef<Tutorial[]>
  /** The running tutorial, or null when none runs. */
  active: ComputedRef<Tutorial | null>
  /** The running tutorial's steps, flattened across tasks. */
  steps: ComputedRef<TutorialFlatStep[]>
  /** 0-based index of the current step; equals the step count once the tutorial is finished. */
  step: ComputedRef<number>
  /** True once the reader finished the running tutorial. */
  finished: ComputedRef<boolean>
  /** True while the reader has closed the current step's popover without leaving the tutorial. */
  dismissed: ComputedRef<boolean>
  /** Increments on every move the reader makes, so the step that opens can take focus. */
  focusRequest: ComputedRef<number>
  /** Starts (or restarts) a tutorial from its first step. */
  start: (id: string) => void
  /** Leaves the running tutorial. */
  exit: () => void
  /** Moves to a step of the running tutorial and reopens it. */
  goTo: (index: number) => void
  /** Moves to the next step, or finishes the tutorial on the last one. */
  next: () => void
  /** Moves to the previous step. */
  previous: () => void
  /** Closes the current step's popover; its hotspot stays and reopens it. */
  dismiss: () => void
  /** Records that a `Hotspot` with this id is on the page. */
  registerHotspot: (id: string) => void
  /** Removes a hotspot recorded by `registerHotspot`. */
  unregisterHotspot: (id: string) => void
  /** True when a `Hotspot` with this id is on the page. */
  hasHotspot: (id: string) => boolean
}

export const TutorialInjectionKey: InjectionKey<TutorialContext> = Symbol('TutorialPanelProvider')
