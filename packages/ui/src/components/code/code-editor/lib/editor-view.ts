import { diffLines } from '../../../../utils/line-diff'
import type { CodeEditorMarker, CodeEditorMarkerSeverity } from '../code-editor.vue'
import { padLineNumber } from '../monaco'
import type { CodeEditorPaneData } from '../parts/code-editor-pane.vue'
import { linesOf } from './plain-text'

const RANK = { danger: 3, warning: 2, info: 1 }

export function worstSeverityByLine(
  markers: CodeEditorMarker[]
): Map<number, CodeEditorMarkerSeverity> {
  const map = new Map<number, CodeEditorMarkerSeverity>()
  for (const marker of markers) {
    const current = map.get(marker.line)
    if (!current || RANK[marker.severity] > RANK[current]) map.set(marker.line, marker.severity)
  }
  return map
}

export function changesBySide(
  diff: boolean,
  original: string,
  value: string
): { original: Map<number, 'removed'>; modified: Map<number, 'added'> } {
  const removed = new Map<number, 'removed'>()
  const added = new Map<number, 'added'>()
  if (!diff) return { original: removed, modified: added }
  for (const row of diffLines(original, value)) {
    if (row.change === 'removed' && row.oldNumber !== null) removed.set(row.oldNumber, 'removed')
    if (row.change === 'added' && row.newNumber !== null) added.set(row.newNumber, 'added')
  }
  return { original: removed, modified: added }
}

export function editorPanes(
  value: string,
  original: string | null,
  editable: boolean,
  labels: { original: string; modified: string }
): CodeEditorPaneData[] {
  const modified = {
    key: 'modified',
    value,
    editable,
    label: labels.modified,
    lines: linesOf(value),
    main: true
  }
  if (original === null) return [modified]
  return [
    {
      key: 'original',
      value: original,
      editable: false,
      label: labels.original,
      lines: linesOf(original),
      main: false
    },
    modified
  ]
}

export const monacoOptions = (
  readonly: boolean,
  lineNumbers: boolean,
  pad: boolean,
  ariaLabel: string
): Record<string, unknown> => ({
  readOnly: readonly,
  domReadOnly: readonly,
  lineNumbers: lineNumbers ? (pad ? padLineNumber : 'on') : 'off',
  minimap: { enabled: false },
  renderFinalNewline: 'on' as const,
  automaticLayout: true,
  scrollBeyondLastLine: false,
  fontLigatures: false,
  renderLineHighlight: 'all',
  tabFocusMode: true,
  ariaLabel
})

export function withoutKeys(
  attrs: Record<string, unknown>,
  keys: readonly string[]
): Record<string, unknown> {
  const rest: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(attrs)) if (!keys.includes(key)) rest[key] = value
  return rest
}
