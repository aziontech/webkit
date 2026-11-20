const MAX_CELLS = 25_000_000

function splitLines(text) {
  const lines = String(text).split('\n')
  if (lines.length && lines[lines.length - 1] === '') lines.pop()
  return lines
}

function middleOps(a, b) {
  const n = a.length
  const m = b.length
  if (!n) return b.map((line) => ({ t: '+', line }))
  if (!m) return a.map((line) => ({ t: '-', line }))
  if (n * m > MAX_CELLS) {
    return [...a.map((line) => ({ t: '-', line })), ...b.map((line) => ({ t: '+', line }))]
  }
  const width = m + 1
  const table = new Uint32Array((n + 1) * width)
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      table[i * width + j] =
        a[i] === b[j]
          ? table[(i + 1) * width + j + 1] + 1
          : Math.max(table[(i + 1) * width + j], table[i * width + j + 1])
    }
  }
  const ops = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push({ t: ' ', line: a[i] })
      i++
      j++
    } else if (table[(i + 1) * width + j] >= table[i * width + j + 1]) {
      ops.push({ t: '-', line: a[i++] })
    } else {
      ops.push({ t: '+', line: b[j++] })
    }
  }
  while (i < n) ops.push({ t: '-', line: a[i++] })
  while (j < m) ops.push({ t: '+', line: b[j++] })
  return ops
}

export function lineDiff(oldText, newText) {
  const a = splitLines(oldText)
  const b = splitLines(newText)
  let start = 0
  while (start < a.length && start < b.length && a[start] === b[start]) start++
  let endA = a.length
  let endB = b.length
  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
    endA--
    endB--
  }
  return [
    ...a.slice(0, start).map((line) => ({ t: ' ', line })),
    ...middleOps(a.slice(start, endA), b.slice(start, endB)),
    ...a.slice(endA).map((line) => ({ t: ' ', line }))
  ]
}

function range(start, count) {
  if (count === 0) return `${start - 1},0`
  return count === 1 ? `${start}` : `${start},${count}`
}

export function unifiedDiff(
  oldText,
  newText,
  { oldLabel = 'a', newLabel = 'b', context = 3 } = {}
) {
  const ops = lineDiff(oldText, newText)
  const changed = ops.map((op, index) => (op.t === ' ' ? -1 : index)).filter((x) => x >= 0)
  if (!changed.length) return ''

  const groups = []
  for (const index of changed) {
    const last = groups[groups.length - 1]
    if (last && index - last.end <= context * 2 + 1) last.end = index
    else groups.push({ start: index, end: index })
  }

  const oldLine = new Array(ops.length + 1)
  const newLine = new Array(ops.length + 1)
  let o = 1
  let n = 1
  for (let k = 0; k < ops.length; k++) {
    oldLine[k] = o
    newLine[k] = n
    if (ops[k].t !== '+') o++
    if (ops[k].t !== '-') n++
  }
  oldLine[ops.length] = o
  newLine[ops.length] = n

  const out = [`--- ${oldLabel}`, `+++ ${newLabel}`]
  for (const group of groups) {
    const from = Math.max(0, group.start - context)
    const to = Math.min(ops.length, group.end + context + 1)
    const slice = ops.slice(from, to)
    const oldCount = slice.filter((op) => op.t !== '+').length
    const newCount = slice.filter((op) => op.t !== '-').length
    out.push(
      `@@ -${range(oldLine[from], oldCount)} +${range(newLine[from], newCount)} @@`,
      ...slice.map((op) => `${op.t}${op.line}`)
    )
  }
  return `${out.join('\n')}\n`
}

export function diffStats(patch) {
  let added = 0
  let removed = 0
  for (const line of patch.split('\n')) {
    if (line.startsWith('+++') || line.startsWith('---')) continue
    if (line.startsWith('+')) added++
    else if (line.startsWith('-')) removed++
  }
  return { added, removed }
}

export function colorize(patch) {
  return patch
    .split('\n')
    .map((line) => {
      if (line.startsWith('+++') || line.startsWith('---')) return `\x1b[1m${line}\x1b[0m`
      if (line.startsWith('@@')) return `\x1b[36m${line}\x1b[0m`
      if (line.startsWith('+')) return `\x1b[32m${line}\x1b[0m`
      if (line.startsWith('-')) return `\x1b[31m${line}\x1b[0m`
      return line
    })
    .join('\n')
}
