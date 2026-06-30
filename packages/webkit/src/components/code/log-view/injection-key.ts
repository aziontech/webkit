import type { ComputedRef, InjectionKey } from 'vue'

export type LogViewLineType = 'text' | 'folder' | 'framework-version' | 'success' | 'warning'

export interface LogViewLine {
  id: string
  time: string
  type: LogViewLineType
  message: string
  folderType?: string
  size?: string
  gzipSize?: string
  suffix?: string
}

export interface LogViewContext {
  testId: string
  lines: ComputedRef<LogViewLine[]>
  filteredLines: ComputedRef<LogViewLine[]>
  search: ComputedRef<string>
  warningsOnly: ComputedRef<boolean>
  disabled: ComputedRef<boolean>
  showCopy: ComputedRef<boolean>
  searchPlaceholder: ComputedRef<string>
  warningCount: ComputedRef<number>
  lineCountLabel: ComputedRef<string>
  warningTagLabel: ComputedRef<string>
  canCopy: ComputedRef<boolean>
  setSearch: (value: string) => void
  toggleWarningsOnly: () => void
  copyLogs: () => Promise<boolean>
}

export const LogViewInjectionKey: InjectionKey<LogViewContext> = Symbol('LogViewContext')
