export const INDENT = '  '

export interface PlainTextEdit {
  start: number
  end: number
  text: string
  selection: [number, number]
}

export const linesOf = (text: string): string[] => text.split('\n')

export function columnsOf(lines: string[]): number {
  let widest = 1
  for (const line of lines) {
    const width = line.includes('\t') ? line.replace(/\t/g, INDENT).length : line.length
    if (width > widest) widest = width
  }
  return widest + 1
}

export function indentEdit(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  outdent: boolean
): PlainTextEdit {
  const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
  const multiLine = value.slice(selectionStart, selectionEnd).includes('\n')
  if (!outdent && !multiLine) {
    const caret = selectionStart + INDENT.length
    return { start: selectionStart, end: selectionEnd, text: INDENT, selection: [caret, caret] }
  }
  let firstShift = 0
  const changed = value
    .slice(lineStart, selectionEnd)
    .split('\n')
    .map((line, index) => {
      if (!outdent) {
        if (index === 0) firstShift = INDENT.length
        return INDENT + line
      }
      const remove = line.startsWith(INDENT) ? INDENT.length : line.startsWith(' ') ? 1 : 0
      if (index === 0) firstShift = -remove
      return line.slice(remove)
    })
  const text = changed.join('\n')
  const start = Math.max(lineStart, selectionStart + firstShift)
  return {
    start: lineStart,
    end: selectionEnd,
    text,
    selection: [multiLine ? lineStart : start, lineStart + text.length]
  }
}

export function offsetOf(text: string, line: number, column: number): number {
  const lines = linesOf(text)
  const target = Math.min(Math.max(line, 1), lines.length)
  let offset = 0
  for (let i = 0; i < target - 1; i += 1) offset += (lines[i] ?? '').length + 1
  return offset + Math.min(Math.max(column - 1, 0), (lines[target - 1] ?? '').length)
}
