// `.env` parsing, shared by the two ways the Add Environment Variable drawer
// accepts a whole file at once: the footer's Import (a picked file) and pasting
// the file's contents straight into a Key input.
//
// Deliberately small and forgiving — it reads what a developer actually has in a
// `.env`: `KEY=value`, `export KEY=value`, quoted values, `#` comments, blank
// lines. Anything it cannot read as a pair is skipped rather than guessed at, so
// a stray line never becomes a variable named after half a sentence.
//
// Not a dotenv implementation: no variable expansion (`$OTHER`), no multi-line
// values. Those are file-format features the console's create form has no way to
// round-trip, and silently half-supporting them would be worse than skipping.

// An environment variable name: letters, digits and underscore, never leading
// with a digit (the shell cannot export those). Keys that fail this are skipped
// so the form is never seeded with a value the field itself would reject.
const KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/

/**
 * Strip the quotes a `.env` uses to protect spaces, and drop the trailing
 * comment an unquoted value may carry.
 *
 * @param {string} raw
 * @returns {string}
 */
function readValue(raw) {
  const value = raw.trim()

  const quote = value[0]
  if ((quote === '"' || quote === "'") && value.length > 1 && value.at(-1) === quote) {
    const inner = value.slice(1, -1)
    // Only double quotes carry escapes in a `.env`; single quotes are literal.
    return quote === '"' ? inner.replace(/\\n/g, '\n').replace(/\\"/g, '"') : inner
  }

  // Unquoted: ` #` starts a comment (a bare `#` inside a token does not — an
  // URL fragment or a colour literal is a value, not a comment).
  const comment = value.search(/\s+#/)
  return comment === -1 ? value : value.slice(0, comment).trim()
}

/**
 * Every `KEY=value` pair in a `.env` file's contents, in file order.
 *
 * @param {string} text Raw file contents (or pasted text).
 * @returns {{ key: string, value: string }[]} Empty when nothing parses — the
 *   caller uses that to fall back to a plain paste instead of expanding rows.
 */
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
