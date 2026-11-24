export type MarkdownFormat =
  'bold' | 'italic' | 'link' | 'bulleted-list' | 'numbered-list' | 'quote' | 'code'

export interface MarkdownEdit {
  from: number
  to: number
  text: string
  selectStart: number
  selectEnd: number
}

interface Selection {
  value: string
  start: number
  end: number
}

const LINE_PREFIX: Record<'bulleted-list' | 'quote', RegExp> = {
  'bulleted-list': /^[-*+] /,
  quote: /^> ?/
}
const NUMBERED = /^\d+\. /

function wrap({ value, start, end }: Selection, marker: string): MarkdownEdit {
  const size = marker.length
  const selected = value.slice(start, end)
  if (value.slice(start - size, start) === marker && value.slice(end, end + size) === marker)
    return {
      from: start - size,
      to: end + size,
      text: selected,
      selectStart: start - size,
      selectEnd: end - size
    }
  if (selected.length >= size * 2 && selected.startsWith(marker) && selected.endsWith(marker)) {
    const inner = selected.slice(size, -size)
    return {
      from: start,
      to: end,
      text: inner,
      selectStart: start,
      selectEnd: start + inner.length
    }
  }
  return {
    from: start,
    to: end,
    text: `${marker}${selected}${marker}`,
    selectStart: start + size,
    selectEnd: start + size + selected.length
  }
}

function link({ value, start, end }: Selection, placeholder: string): MarkdownEdit {
  const selected = value.slice(start, end)
  const text = `[${selected}](${placeholder})`
  if (!selected) return { from: start, to: end, text, selectStart: start + 1, selectEnd: start + 1 }
  const urlStart = start + selected.length + 3
  return {
    from: start,
    to: end,
    text,
    selectStart: urlStart,
    selectEnd: urlStart + placeholder.length
  }
}

function code(selection: Selection): MarkdownEdit {
  const { value, start, end } = selection
  const selected = value.slice(start, end)
  if (!selected.includes('\n')) return wrap(selection, '`')
  const lead = start > 0 && value[start - 1] !== '\n' ? '\n' : ''
  const open = `${lead}\`\`\`\n`
  return {
    from: start,
    to: end,
    text: `${open}${selected}\n\`\`\``,
    selectStart: start + open.length,
    selectEnd: start + open.length + selected.length
  }
}

function lineRange({ value, start, end }: Selection): [number, number] {
  const from = value.lastIndexOf('\n', start - 1) + 1
  const last = end > start && value[end - 1] === '\n' ? end - 1 : end
  const next = value.indexOf('\n', last)
  return [from, next === -1 ? value.length : next]
}

function prefixLines(selection: Selection, format: MarkdownFormat): MarkdownEdit {
  const [from, to] = lineRange(selection)
  const lines = selection.value.slice(from, to).split('\n')
  const pattern =
    format === 'numbered-list'
      ? NUMBERED
      : format === 'quote'
        ? LINE_PREFIX.quote
        : LINE_PREFIX['bulleted-list']
  const remove = lines.every((line) => pattern.test(line))
  const prefix = (index: number): string =>
    format === 'numbered-list' ? `${index + 1}. ` : format === 'quote' ? '> ' : '- '
  const next = lines.map((line, index) =>
    remove ? line.replace(pattern, '') : `${prefix(index)}${line}`
  )
  const text = next.join('\n')
  if (selection.start === selection.end) {
    const caret = Math.max(from, selection.start + (next[0]!.length - lines[0]!.length))
    return { from, to, text, selectStart: caret, selectEnd: caret }
  }
  return { from, to, text, selectStart: from, selectEnd: from + text.length }
}

export function formatMarkdown(
  selection: Selection,
  format: MarkdownFormat,
  linkPlaceholder: string
): MarkdownEdit {
  if (format === 'bold') return wrap(selection, '**')
  if (format === 'italic') return wrap(selection, '_')
  if (format === 'link') return link(selection, linkPlaceholder)
  if (format === 'code') return code(selection)
  return prefixLines(selection, format)
}

export function applyEdit(field: HTMLTextAreaElement, edit: MarkdownEdit): void {
  field.focus()
  field.setSelectionRange(edit.from, edit.to)
  const inserted =
    edit.text.length > 0 &&
    typeof document.execCommand === 'function' &&
    document.execCommand('insertText', false, edit.text)
  if (!inserted) {
    field.setRangeText(edit.text, edit.from, edit.to, 'end')
    field.dispatchEvent(new Event('input', { bubbles: true }))
  }
  field.setSelectionRange(edit.selectStart, edit.selectEnd)
}
