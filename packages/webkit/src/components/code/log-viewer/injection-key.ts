import type { ComputedRef, InjectionKey } from 'vue'

export type LogViewerLineType = 'text' | 'folder' | 'framework-version' | 'success'

export type LogViewerLineLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogViewerLine {
  id: string
  time: string
  /** Shape of the line; a warning is a `text` line with `level: 'warn'`. */
  type: LogViewerLineType
  message: string
  folderType?: string
  size?: string
  gzipSize?: string
  suffix?: string
  level?: LogViewerLineLevel
}

/** How one step of a run ended, or where it stands. */
export type LogViewerStepStatus = 'success' | 'running' | 'error' | 'skipped' | 'pending'

/** Which view LogViewer.Steps shows: one collapsible log per step, or every line in one log. */
export type LogViewerStepsView = 'phased' | 'complete'

/** One step of a run shown by LogViewer.Steps. */
export interface LogViewerStep {
  /** Stable step id; v-model:open-step holds it. */
  id: string
  /** Step name. */
  title: string
  /** One-line summary, or the reason a failed step stopped. */
  description?: string
  /** How the step ended, or where it stands. */
  status: LogViewerStepStatus
  /** Time label, such as 4s. */
  duration?: string
  /** The step's own log lines. */
  lines: LogViewerLine[]
}

export interface LogViewerContext {
  testId: ComputedRef<string>
  lines: ComputedRef<LogViewerLine[]>
  filteredLines: ComputedRef<LogViewerLine[]>
  search: ComputedRef<string>
  levels: ComputedRef<LogViewerLineLevel[]>
  level: ComputedRef<LogViewerLineLevel | ''>
  levelCounts: ComputedRef<Record<LogViewerLineLevel, number>>
  disabled: ComputedRef<boolean>
  copyable: ComputedRef<boolean>
  loading: ComputedRef<boolean>
  loadingLabel: ComputedRef<string>
  error: ComputedRef<string>
  searchPlaceholder: ComputedRef<string>
  warningCount: ComputedRef<number>
  lineCountLabel: ComputedRef<string>
  warningTagLabel: ComputedRef<string>
  canCopy: ComputedRef<boolean>
  copyText: ComputedRef<string>
  setSearch: (value: string) => void
  toggleLevel: (level: LogViewerLineLevel) => void
  emitCopy: (event: MouseEvent, value: string) => void
}

export const LogViewerInjectionKey: InjectionKey<LogViewerContext> = Symbol('LogViewer')

export const lineLevel = (line: LogViewerLine): LogViewerLineLevel | undefined => line.level
