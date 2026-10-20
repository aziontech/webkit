const KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/

function readValue(raw) {
  const value = raw.trim()

  const quote = value[0]
  if ((quote === '"' || quote === "'") && value.length > 1 && value.at(-1) === quote) {
    const inner = value.slice(1, -1)
    return quote === '"' ? inner.replace(/\\n/g, '\n').replace(/\\"/g, '"') : inner
  }

  const comment = value.search(/\s+#/)
  return comment === -1 ? value : value.slice(0, comment).trim()
}

export function parseDotenv(text) {
  if (typeof text !== 'string') return []

  const pairs = []

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const declaration = line.startsWith('export ') ? line.slice('export '.length).trim() : line

    const separator = declaration.indexOf('=')
    if (separator < 1) continue

    const key = declaration.slice(0, separator).trim()
    if (!KEY_PATTERN.test(key)) continue

    pairs.push({ key, value: readValue(declaration.slice(separator + 1)) })
  }

  return pairs
}
