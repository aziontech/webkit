export type CodeBlockLineChange = {
  line: number
  change: 'added' | 'removed'
}

export type CodeBlockLineState = 'default' | 'added' | 'removed' | 'highlighted'

export const buildLineChangeMap = (
  lineChanges: CodeBlockLineChange[] | undefined
): Map<number, CodeBlockLineChange['change']> => {
  const map = new Map<number, CodeBlockLineChange['change']>()

  for (const entry of lineChanges ?? []) {
    map.set(entry.line, entry.change)
  }

  return map
}

export const resolveLineState = (
  lineNumber: number,
  changeMap: Map<number, CodeBlockLineChange['change']>,
  highlightedLine?: number
): CodeBlockLineState => {
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

export const getDiffMarker = (lineState: CodeBlockLineState): string => {
  if (lineState === 'added') {
    return '+'
  }

  if (lineState === 'removed') {
    return '-'
  }

  return ''
}
