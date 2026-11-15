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
