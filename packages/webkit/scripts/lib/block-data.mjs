export const COPY_RATIO = 0.9
export const FORK_RATIO = 0.6
const FORK_MIN_LINES = 60
const RECORD_LIMIT = 3

export function scriptOf(sfc) {
  return [...String(sfc).matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => m[1])
    .join('\n')
}

export function sharedLineRatio(base, other) {
  const a = String(base)
    .split('\n')
    .map((l) => l.trim())
  const b = String(other)
    .split('\n')
    .map((l) => l.trim())
  if (!b.length) return 0
  const ids = new Map()
  const code = (line) => {
    if (!ids.has(line)) ids.set(line, ids.size + 1)
    return ids.get(line)
  }
  const x = Int32Array.from(a, code)
  const y = Int32Array.from(b, code)
  let prev = new Int32Array(y.length + 1)
  let next = new Int32Array(y.length + 1)
  for (let i = 1; i <= x.length; i++) {
    for (let j = 1; j <= y.length; j++) {
      next[j] = x[i - 1] === y[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], next[j - 1])
    }
    ;[prev, next] = [next, prev]
  }
  return prev[y.length] / y.length
}

export function inlineRecords(sfc) {
  const script = scriptOf(sfc)
  const records = script.match(/\{\s*id\s*:/g)?.length ?? 0
  return records >= RECORD_LIMIT || /\bDate\.UTC\s*\(/.test(script)
}

export function dataContractKeys(id, block) {
  const keys = []
  const script = scriptOf(block.sfc)
  if (!/\bdefineProps\s*</.test(script)) keys.push(`${id}:no-props`)
  if (inlineRecords(block.sfc)) keys.push(`${id}:inline-records`)
  for (const variant of block.variants || []) {
    if (sharedLineRatio(block.sfc, variant.sfc) >= COPY_RATIO)
      keys.push(`${id}:variant-copy:${variant.name}`)
    else if (
      String(variant.sfc).split('\n').length >= FORK_MIN_LINES &&
      sharedLineRatio(variant.sfc, block.sfc) >= FORK_RATIO
    )
      keys.push(`${id}:variant-fork:${variant.name}`)
  }
  return keys
}

export function checkDataContract(blocks, baseline = []) {
  const allowed = new Set(baseline)
  const keys = Object.entries(blocks).flatMap(([id, block]) => dataContractKeys(id, block))
  const found = new Set(keys)
  return {
    keys,
    introduced: keys.filter((key) => !allowed.has(key)),
    fixed: [...allowed].filter((key) => !found.has(key))
  }
}
