import type { ComputedRef, InjectionKey } from 'vue'

export type LogViewLineType = 'text' | 'folder' | 'framework-version' | 'success'

export type LogViewLineLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogViewLine {
  id: string
  time: string
  /** Shape of the line; a warning is a `text` line with `level: 'warn'`. */
  type: LogViewLineType
  message: string
  folderType?: string
  size?: string
  gzipSize?: string
  suffix?: string
  level?: LogViewLineLevel
}

/** How one step of a run ended, or where it stands. */
export type LogViewStepStatus = 'done' | 'running' | 'failed' | 'skipped' | 'pending'

/** Which view LogView.Steps shows: one collapsible log per step, or every line in one log. */
export type LogViewStepsView = 'phased' | 'complete'

/** One step of a run shown by LogView.Steps. */
export interface LogViewStep {
  /** Stable step key; v-model:open-step holds it. */
  key: string
  /** Step name. */
  title: string
  /** One-line summary, or the reason a failed step stopped. */
  description?: string
  /** How the step ended, or where it stands. */
  status: LogViewStepStatus
  /** Time label, such as 4s. */
  duration?: string
  /** The step's own log lines. */
  lines: LogViewLine[]
}

export interface LogViewContext {
  testId: ComputedRef<string>
  lines: ComputedRef<LogViewLine[]>
  filteredLines: ComputedRef<LogViewLine[]>
  search: ComputedRef<string>
  levels: ComputedRef<LogViewLineLevel[]>
  level: ComputedRef<LogViewLineLevel | ''>
  levelCounts: ComputedRef<Record<LogViewLineLevel, number>>
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
  toggleLevel: (level: LogViewLineLevel) => void
  emitCopy: (event: MouseEvent, value: string) => void
}

export const LogViewInjectionKey: InjectionKey<LogViewContext> = Symbol('LogView')

export const lineLevel = (line: LogViewLine): LogViewLineLevel | undefined => line.level
