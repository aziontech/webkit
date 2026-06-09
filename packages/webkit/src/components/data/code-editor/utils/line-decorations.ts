export type CodeEditorLineChange = {
  line: number
  change: 'added' | 'removed'
}

export type CodeEditorLineState = 'default' | 'added' | 'removed' | 'highlighted'

export const buildLineChangeMap = (
  lineChanges: CodeEditorLineChange[] | undefined
): Map<number, CodeEditorLineChange['change']> => {
  const map = new Map<number, CodeEditorLineChange['change']>()

  for (const entry of lineChanges ?? []) {
    map.set(entry.line, entry.change)
  }

  return map
}

export const resolveLineState = (
  lineNumber: number,
  changeMap: Map<number, CodeEditorLineChange['change']>,
  highlightedLine?: number
): CodeEditorLineState => {
  const change = changeMap.get(lineNumber)

  if (change === 'added') {
    return 'added'
  }

  if (change === 'removed') {
    return 'removed'
  }

  if (highlightedLine === lineNumber) {
    return 'highlighted'
  }

  return 'default'
}

export const getDiffMarker = (lineState: CodeEditorLineState): string => {
  if (lineState === 'added') {
    return '+'
  }

  if (lineState === 'removed') {
    return '-'
  }

  return ''
}
