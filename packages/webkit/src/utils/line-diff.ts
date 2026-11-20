export type LineDiffChange = 'unchanged' | 'added' | 'removed'

export type LineDiffLine = {
  change: LineDiffChange
  oldNumber: number | null
  newNumber: number | null
}

export type LineDiffSide = {
  change: LineDiffChange
  number: number
}

export type LineDiffPair = {
  left: LineDiffSide | null
  right: LineDiffSide | null
}

const MAX_EDITS = 1000

const intern = (a: string[], b: string[]): [Int32Array, Int32Array] => {
  const ids = new Map<string, number>()
  const encode = (lines: string[]) =>
    Int32Array.from(lines, (line) => {
      let id = ids.get(line)
      if (id === undefined) {
        id = ids.size
        ids.set(line, id)
      }
      return id
    })
  return [encode(a), encode(b)]
}

const myers = (
  a: Int32Array,
  b: Int32Array,
  maxEdits: number
): Array<['=' | '-' | '+', number, number]> | null => {
  const n = a.length
  const m = b.length
  const max = n + m
  const offset = max + 1
  const v = new Int32Array(2 * max + 3)
  const trace: Int32Array[] = []
  let found = -1
  for (let d = 0; d <= Math.min(max, maxEdits); d += 1) {
    trace.push(v.slice(offset - d - 1, offset + d + 2))
    for (let k = -d; k <= d; k += 2) {
      let x =
        k === -d || (k !== d && v[offset + k - 1]! < v[offset + k + 1]!)
          ? v[offset + k + 1]!
          : v[offset + k - 1]! + 1
      let y = x - k
      while (x < n && y < m && a[x] === b[y]) {
        x += 1
        y += 1
      }
      v[offset + k] = x
      if (x >= n && y >= m) {
        found = d
        break
      }
    }
    if (found >= 0) break
  }
  if (found < 0) return null

  const steps: Array<['=' | '-' | '+', number, number]> = []
  let x = n
  let y = m
  for (let d = found; d >= 0; d -= 1) {
    const row = trace[d]!
    const at = (k: number) => row[k + d + 1]!
    const k = x - y
    const prevK = k === -d || (k !== d && at(k - 1) < at(k + 1)) ? k + 1 : k - 1
    const prevX = d === 0 ? 0 : at(prevK)
    const prevY = d === 0 ? 0 : prevX - prevK
    while (x > prevX && y > prevY) {
      steps.push(['=', x - 1, y - 1])
      x -= 1
      y -= 1
    }
    if (d > 0) {
      if (x === prevX) steps.push(['+', x, y - 1])
      else steps.push(['-', x - 1, y])
    }
    x = prevX
    y = prevY
  }
  return steps.reverse()
}

const settle = (lines: LineDiffLine[]): LineDiffLine[] => {
  const out: LineDiffLine[] = []
  let removed: LineDiffLine[] = []
  let added: LineDiffLine[] = []
  const flush = () => {
    out.push(...removed, ...added)
    removed = []
    added = []
  }
  for (const line of lines) {
    if (line.change === 'removed') removed.push(line)
    else if (line.change === 'added') added.push(line)
    else {
      flush()
      out.push(line)
    }
  }
  flush()
  return out
}

export const diffLines = (
  original: string,
  modified: string,
  maxEdits = MAX_EDITS
): LineDiffLine[] => {
  const before = original.split('\n')
  const after = modified.split('\n')
  let head = 0
  while (head < before.length && head < after.length && before[head] === after[head]) head += 1
  let tail = 0
  while (
    tail < before.length - head &&
    tail < after.length - head &&
    before[before.length - 1 - tail] === after[after.length - 1 - tail]
  )
    tail += 1

  const same = (from: number, to: number, shift: number): LineDiffLine[] =>
    Array.from({ length: to - from }, (_, index) => ({
      change: 'unchanged',
      oldNumber: from + index + 1,
      newNumber: from + index + shift + 1
    }))

  const middleBefore = before.slice(head, before.length - tail)
  const middleAfter = after.slice(head, after.length - tail)
  const [a, b] = intern(middleBefore, middleAfter)
  const steps = myers(a, b, maxEdits) ?? [
    ...Array.from(a, (_, index) => ['-', index, 0] as ['-', number, number]),
    ...Array.from(b, (_, index) => ['+', 0, index] as ['+', number, number])
  ]
  const middle: LineDiffLine[] = steps.map(([op, x, y]) => {
    if (op === '-') return { change: 'removed', oldNumber: head + x + 1, newNumber: null }
    if (op === '+') return { change: 'added', oldNumber: null, newNumber: head + y + 1 }
    return { change: 'unchanged', oldNumber: head + x + 1, newNumber: head + y + 1 }
  })

  return [
    ...same(0, head, 0),
    ...settle(middle),
    ...same(before.length - tail, before.length, after.length - before.length)
  ]
}

export const pairDiffLines = (lines: LineDiffLine[]): LineDiffPair[] => {
  const pairs: LineDiffPair[] = []
  let removed: LineDiffSide[] = []
  let added: LineDiffSide[] = []
  const flush = () => {
    for (let index = 0; index < Math.max(removed.length, added.length); index += 1)
      pairs.push({ left: removed[index] ?? null, right: added[index] ?? null })
    removed = []
    added = []
  }
  for (const line of lines) {
    if (line.change === 'removed') removed.push({ change: 'removed', number: line.oldNumber ?? 0 })
    else if (line.change === 'added') added.push({ change: 'added', number: line.newNumber ?? 0 })
    else {
      flush()
      pairs.push({
        left: { change: 'unchanged', number: line.oldNumber ?? 0 },
        right: { change: 'unchanged', number: line.newNumber ?? 0 }
      })
    }
  }
  flush()
  return pairs
}
