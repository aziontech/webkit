export type TraceSpanStatus = 'success' | 'error' | 'running'

export interface TraceSpanEvent {
  /** Milliseconds from the start of the trace. */
  at: number
  /** What happened at that moment. */
  name: string
}

/** Visible window of the run clock: start and end in milliseconds. */
export type TraceRange = [number, number]

/** How the spans are drawn: tree and bars, bars in lanes, or the tree with times as text. */
export type TraceView = 'waterfall' | 'timeline' | 'tree'

export interface TraceSpan {
  /** Stable key of the span. */
  id: string
  /** The span this one ran inside. Unset or unknown makes it a root span. */
  parentId?: string
  /** What the span measured. */
  name: string
  /** The service or kind that ran it, printed after the name. */
  service?: string
  /** Icon class shown before the name. */
  icon?: string
  /** Milliseconds from the start of the trace. */
  start: number
  /** Milliseconds the span lasted. */
  duration: number
  /** Outcome of the span. Unset reads as success. */
  status?: TraceSpanStatus
  /** One line about the outcome, shown in the details of a failed span. */
  message?: string
  /** Extra facts listed in the details. */
  attributes?: Record<string, string | number>
  /** Moments inside the span, drawn as markers on its bar and listed in the details. */
  events?: TraceSpanEvent[]
}

export type TracePlaced = {
  span: TraceSpan
  status: TraceSpanStatus
  root: boolean
  offset: number
  width: number
  wide: boolean
  flip: boolean
  outside: boolean
  marks: { key: string; at: number }[]
  critical: boolean
  path: { key: string; offset: number; width: number }[]
}

export type TraceLane = { key: string; depth: number; items: TracePlaced[] }

export type TraceRow = TracePlaced & {
  depth: number
  parentId: string | null
  hasChildren: boolean
  expanded: boolean
  posinset: number
  setsize: number
}

export type TraceEdge = 'start' | 'end'

export type TraceDrag = { mode: 'draw' | 'pan' | TraceEdge; anchor: number; origin: TraceRange }
