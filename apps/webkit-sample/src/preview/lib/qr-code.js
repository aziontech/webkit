// THE QR ENCODER — a URL in, a matrix of modules out.
//
// The deck's one rule is that `data/deck.js` holds the content and nothing else, so a slide
// that shows a QR code has to DERIVE it from the URL on the slide. A pre-baked image would
// break that: change the link in the deck data and the code beside it would still point at
// the old one, silently, and the only way to notice is to scan it from the back of a room.
//
// Hence ~200 lines of ISO/IEC 18004 rather than a dependency. Byte mode only (a URL is bytes),
// versions 1-10 (v10 at level Q holds 213 bytes — an order of magnitude more URL than a slide
// should carry), and the encoder picks the smallest version that fits. `encode` returns a
// square array of booleans, `true` for a dark module; drawing it is the layout's job.
//
// Verified two ways — see the note at the bottom of this file before editing anything here.

/** Error-correction levels, in the order the format-information field numbers them. */
const EC_LEVELS = { L: 0, M: 1, Q: 2, H: 3 }

// EC codewords PER BLOCK and the number of blocks, indexed [level][version]. Versions 1-10 of
// ISO/IEC 18004 Tables 13-22. Everything else — total codewords, data codewords, the split
// between short and long blocks — is derived, so these two tables are the only transcription.
const EC_CODEWORDS_PER_BLOCK = {
  L: [7, 10, 15, 20, 26, 18, 20, 24, 30, 18],
  M: [10, 16, 26, 18, 24, 16, 18, 22, 22, 26],
  Q: [13, 22, 18, 26, 18, 24, 18, 22, 20, 24],
  H: [17, 28, 22, 16, 22, 28, 26, 26, 24, 28]
}

const EC_BLOCKS = {
  L: [1, 1, 1, 1, 1, 2, 2, 2, 2, 4],
  M: [1, 1, 1, 2, 2, 4, 4, 4, 5, 5],
  Q: [1, 1, 2, 2, 4, 4, 6, 6, 8, 8],
  H: [1, 1, 2, 4, 4, 4, 5, 6, 8, 8]
}

const MAX_VERSION = 10

/** Modules per side. */
const sizeOf = (version) => version * 4 + 17

// Data modules the symbol has before EC: the whole area, less the function patterns. The
// closed form is the standard one — the finders, separators, timing and format areas are a
// constant, the alignment patterns scale with the version's alignment grid.
const rawDataModules = (version) => {
  let result = (16 * version + 128) * version + 64
  if (version >= 2) {
    const alignCount = Math.floor(version / 7) + 2
    result -= (25 * alignCount - 10) * alignCount - 55
    if (version >= 7) result -= 36
  }
  return result
}

/** Total codewords (data + EC) a version holds. The leftover bits are the remainder bits. */
const totalCodewords = (version) => Math.floor(rawDataModules(version) / 8)

/** Data codewords available at a version and level, EC subtracted. */
const dataCodewords = (version, level) =>
  totalCodewords(version) -
  EC_CODEWORDS_PER_BLOCK[level][version - 1] * EC_BLOCKS[level][version - 1]

/** Centres of the alignment patterns, both axes, for a version. Empty at version 1. */
const alignmentPositions = (version) => {
  if (version === 1) return []
  const count = Math.floor(version / 7) + 2
  const step = Math.ceil((version * 4 + 4) / (count * 2 - 2)) * 2
  const positions = [6]
  for (let pos = sizeOf(version) - 7; positions.length < count; pos -= step)
    positions.splice(1, 0, pos)
  return positions
}

// ── GF(256) ─────────────────────────────────────────────────────────────────────────
//
// Reed-Solomon runs over the field with the primitive polynomial 0x11D. Multiplication is
// the schoolbook shift-and-reduce rather than log tables: a slide's worth of codewords is a
// few thousand products, and the direct form has no table to get wrong.

const gfMultiply = (a, b) => {
  let result = 0
  for (let i = 7; i >= 0; i -= 1) {
    result = (result << 1) ^ ((result >>> 7) * 0x11d)
    result ^= ((b >>> i) & 1) * a
  }
  return result & 0xff
}

/** The generator polynomial of degree `degree`, as coefficients without the leading 1. */
const generatorPolynomial = (degree) => {
  const result = new Uint8Array(degree)
  result[degree - 1] = 1
  let root = 1
  for (let i = 0; i < degree; i += 1) {
    for (let j = 0; j < degree; j += 1) {
      result[j] = gfMultiply(result[j], root)
      if (j + 1 < degree) result[j] ^= result[j + 1]
    }
    root = gfMultiply(root, 0x02)
  }
  return result
}

/** The EC codewords for one block. */
const remainder = (data, degree) => {
  const generator = generatorPolynomial(degree)
  const result = new Uint8Array(degree)
  for (const byte of data) {
    const factor = byte ^ result[0]
    result.copyWithin(0, 1)
    result[degree - 1] = 0
    for (let i = 0; i < degree; i += 1) result[i] ^= gfMultiply(generator[i], factor)
  }
  return result
}

// ── The bitstream ───────────────────────────────────────────────────────────────────

/** Byte-mode segment: the mode indicator, the length, the bytes, then the standard padding. */
const bitstream = (bytes, version, level) => {
  const bits = []
  const push = (value, length) => {
    for (let i = length - 1; i >= 0; i -= 1) bits.push((value >>> i) & 1)
  }

  // The character-count field is 8 bits below version 10 and 16 bits from 10 up.
  push(0b0100, 4)
  push(bytes.length, version < 10 ? 8 : 16)
  for (const byte of bytes) push(byte, 8)

  const capacity = dataCodewords(version, level) * 8
  // Terminator, then pad to a byte boundary, then the two alternating pad codewords.
  push(0, Math.min(4, capacity - bits.length))
  push(0, (8 - (bits.length % 8)) % 8)
  for (let pad = 0xec; bits.length < capacity; pad ^= 0xec ^ 0x11) push(pad, 8)

  const codewords = new Uint8Array(bits.length / 8)
  for (let i = 0; i < bits.length; i += 1) codewords[i >>> 3] |= bits[i] << (7 - (i & 7))
  return codewords
}

/** Interleave the data and EC blocks into the final codeword sequence. */
const interleave = (data, version, level) => {
  const blockCount = EC_BLOCKS[level][version - 1]
  const ecLength = EC_CODEWORDS_PER_BLOCK[level][version - 1]
  const shortLength = Math.floor(data.length / blockCount)
  // The last `data.length % blockCount` blocks carry one extra data codeword each.
  const shortCount = blockCount - (data.length % blockCount)

  const blocks = []
  for (let i = 0, offset = 0; i < blockCount; i += 1) {
    const length = shortLength + (i < shortCount ? 0 : 1)
    const block = data.slice(offset, offset + length)
    blocks.push({ data: block, ec: remainder(block, ecLength) })
    offset += length
  }

  const result = []
  for (let i = 0; i < shortLength + 1; i += 1) {
    for (const block of blocks) if (i < block.data.length) result.push(block.data[i])
  }
  for (let i = 0; i < ecLength; i += 1) for (const block of blocks) result.push(block.ec[i])
  return result
}

// ── The symbol ──────────────────────────────────────────────────────────────────────

/** A blank grid plus a parallel grid marking which modules a function pattern owns. */
const blank = (size) => ({
  modules: Array.from({ length: size }, () => new Array(size).fill(false)),
  reserved: Array.from({ length: size }, () => new Array(size).fill(false))
})

const setFunction = (grid, x, y, dark) => {
  grid.modules[y][x] = dark
  grid.reserved[y][x] = true
}

const drawFinder = (grid, size, cx, cy) => {
  // The 7x7 finder plus its separator: one pass over the 9x9 neighbourhood, clipped to the
  // symbol, so the separator needs no second loop.
  for (let dy = -4; dy <= 4; dy += 1) {
    for (let dx = -4; dx <= 4; dx += 1) {
      const x = cx + dx
      const y = cy + dy
      if (x < 0 || x >= size || y < 0 || y >= size) continue
      const ring = Math.max(Math.abs(dx), Math.abs(dy))
      setFunction(grid, x, y, ring !== 2 && ring !== 4)
    }
  }
}

const drawFunctionPatterns = (grid, version, size) => {
  drawFinder(grid, size, 3, 3)
  drawFinder(grid, size, size - 4, 3)
  drawFinder(grid, size, 3, size - 4)

  for (let i = 8; i < size - 8; i += 1) {
    setFunction(grid, i, 6, i % 2 === 0)
    setFunction(grid, 6, i, i % 2 === 0)
  }

  const positions = alignmentPositions(version)
  for (const cy of positions) {
    for (const cx of positions) {
      // The three corners are the finders' — an alignment pattern never overlaps one.
      const corner =
        (cx === 6 && cy === 6) || (cx === 6 && cy === size - 7) || (cx === size - 7 && cy === 6)
      if (corner) continue
      for (let dy = -2; dy <= 2; dy += 1) {
        for (let dx = -2; dx <= 2; dx += 1) {
          setFunction(grid, cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1)
        }
      }
    }
  }

  // The format-information areas are reserved now and written once the mask is chosen; the
  // dark module beside the bottom-left finder is fixed.
  for (let i = 0; i <= 8; i += 1) {
    if (i !== 6) {
      setFunction(grid, i, 8, false)
      setFunction(grid, 8, i, false)
    }
  }
  for (let i = 0; i < 8; i += 1) {
    setFunction(grid, size - 1 - i, 8, false)
    setFunction(grid, 8, size - 1 - i, false)
  }
  setFunction(grid, 8, size - 8, true)

  // Version information (two 3x6 blocks) exists from version 7 up.
  if (version >= 7) {
    let value = version
    for (let i = 0; i < 12; i += 1) value = (value << 1) ^ ((value >>> 11) * 0x1f25)
    const bits = (version << 12) | value
    for (let i = 0; i < 18; i += 1) {
      const bit = ((bits >>> i) & 1) === 1
      const a = size - 11 + (i % 3)
      const b = Math.floor(i / 3)
      setFunction(grid, a, b, bit)
      setFunction(grid, b, a, bit)
    }
  }
}

/** Write the 15-bit format information for a level and mask into both of its copies. */
const drawFormatInfo = (grid, size, level, mask) => {
  // The format field numbers the levels L=01 M=00 Q=11 H=10 — not in the order they are
  // named, which is `ordinal ^ 1`. Then the three mask bits.
  const data = (((EC_LEVELS[level] ^ 1) << 3) | mask) & 0b11111
  let value = data
  for (let i = 0; i < 10; i += 1) value = (value << 1) ^ ((value >>> 9) * 0x537)
  const bits = ((data << 10) | value) ^ 0b101010000010010

  for (let i = 0; i <= 5; i += 1) setFunction(grid, 8, i, ((bits >>> i) & 1) === 1)
  setFunction(grid, 8, 7, ((bits >>> 6) & 1) === 1)
  setFunction(grid, 8, 8, ((bits >>> 7) & 1) === 1)
  setFunction(grid, 7, 8, ((bits >>> 8) & 1) === 1)
  for (let i = 9; i < 15; i += 1) setFunction(grid, 14 - i, 8, ((bits >>> i) & 1) === 1)

  for (let i = 0; i < 8; i += 1) setFunction(grid, size - 1 - i, 8, ((bits >>> i) & 1) === 1)
  for (let i = 8; i < 15; i += 1) setFunction(grid, 8, size - 15 + i, ((bits >>> i) & 1) === 1)
}

/** The zigzag walk: two-module columns, right to left, skipping the timing column. */
const drawCodewords = (grid, size, codewords) => {
  let index = 0
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5
    for (let vertical = 0; vertical < size; vertical += 1) {
      for (let column = 0; column < 2; column += 1) {
        const x = right - column
        const upward = ((right + 1) & 2) === 0
        const y = upward ? size - 1 - vertical : vertical
        if (grid.reserved[y][x]) continue
        // Past the last codeword the walk is on the remainder bits, which stay light.
        if (index < codewords.length * 8) {
          grid.modules[y][x] = ((codewords[index >>> 3] >>> (7 - (index & 7))) & 1) === 1
        }
        index += 1
      }
    }
  }
}

/** The eight mask conditions, by pattern number. */
const MASKS = [
  (x, y) => (x + y) % 2 === 0,
  (_x, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0
]

const applyMask = (grid, size, mask) => {
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!grid.reserved[y][x] && MASKS[mask](x, y)) grid.modules[y][x] = !grid.modules[y][x]
    }
  }
}

// The four penalty rules of the standard (7.8.3, Table 11). The mask with the lowest total
// wins, which is what keeps a symbol from developing large blank fields or finder-lookalikes
// that confuse a reader.
//
// Rule 3 is the one place implementations legitimately disagree: the standard says a
// 1:1:3:1:1 run "preceded OR followed by light area 4 modules wide" scores 40, and it does not
// say what to do when a run has that margin on BOTH sides. Some encoders score it twice. This
// one scores each occurrence once and resumes the scan past it, which is `segno`'s reading —
// deliberately, because that is the implementation this file is verified against, and an
// encoder that agrees with a reference on every module is one that can be re-checked after an
// edit. Both readings produce a scannable symbol; only one of them is testable.
const penalty = (modules, size) => {
  const PATTERN = [true, false, true, true, true, false, true]

  /** Rule 3 over one row or column: 1:1:3:1:1 with four light modules on either side. */
  const finderLookalikes = (line) => {
    let score = 0
    for (let i = 0; i + 7 <= size;) {
      if (!PATTERN.every((v, j) => line[i + j] === v)) {
        i += 1
        continue
      }
      // A clipped margin counts as light: a run against the symbol's edge has nothing on
      // that side, which is what the reference's slice-and-test does at the boundary.
      const before = line.slice(Math.max(i - 4, 0), i)
      const after = line.slice(i + 7, Math.min(i + 11, size))
      if (!before.includes(true) || !after.includes(true)) {
        score += 40
        i += 7
      } else {
        // No margin either side: the next possible match starts inside this run, at the
        // second of its three dark modules.
        i += 4
      }
    }
    return score
  }

  let score = 0
  let dark = 0

  for (let a = 0; a < size; a += 1) {
    const row = modules[a]
    const column = modules.map((line) => line[a])

    for (const line of [row, column]) {
      // Rule 1: runs of five or more same-coloured modules.
      let run = 1
      for (let i = 1; i <= size; i += 1) {
        if (i < size && line[i] === line[i - 1]) run += 1
        else {
          if (run >= 5) score += run - 2
          run = 1
        }
      }
      score += finderLookalikes(line)
    }

    for (const module of row) if (module) dark += 1
  }

  // Rule 2: every 2x2 block of one colour.
  for (let y = 0; y < size - 1; y += 1) {
    for (let x = 0; x < size - 1; x += 1) {
      const v = modules[y][x]
      if (v === modules[y][x + 1] && v === modules[y + 1][x] && v === modules[y + 1][x + 1]) {
        score += 3
      }
    }
  }

  // Rule 4: how far the dark ratio strays from 50%, in whole 5% steps.
  return score + 10 * Math.floor(Math.abs(dark * 20 - size * size * 10) / (size * size))
}

/**
 * Encode `text` as a QR symbol.
 *
 * @param {string} text The payload. UTF-8 encoded, byte mode.
 * @param {{ level?: 'L'|'M'|'Q'|'H', minVersion?: number }} [options]
 *   `level` is the error correction; `Q` (25%) is the default because a slide is read off a
 *   projection at an angle, across a room, sometimes with a head in front of it.
 *   `minVersion` floors the version, which is how a short URL still gets a dense-looking code.
 * @returns {{ size: number, version: number, level: string, modules: boolean[][] }}
 */
export const encode = (text, { level = 'Q', minVersion = 1 } = {}) => {
  const bytes = new TextEncoder().encode(text)

  let version = Math.max(1, minVersion)
  for (; version <= MAX_VERSION; version += 1) {
    // 4 bits of mode, 8 or 16 of length, then the payload.
    const overhead = 4 + (version < 10 ? 8 : 16)
    if (dataCodewords(version, level) * 8 >= overhead + bytes.length * 8) break
  }
  if (version > MAX_VERSION) {
    throw new Error(
      `qr-code: ${bytes.length} bytes exceeds version ${MAX_VERSION} at level ${level}`
    )
  }

  const size = sizeOf(version)
  const codewords = interleave(bitstream(bytes, version, level), version, level)

  let best = null
  for (let mask = 0; mask < 8; mask += 1) {
    const grid = blank(size)
    drawFunctionPatterns(grid, version, size)
    drawCodewords(grid, size, codewords)
    drawFormatInfo(grid, size, level, mask)
    applyMask(grid, size, mask)
    const score = penalty(grid.modules, size)
    if (!best || score < best.score) best = { score, modules: grid.modules }
  }

  return { size, version, level, modules: best.modules }
}

/**
 * The symbol as one SVG path: a `M x y h w v h h -w z` subpath per horizontal run of dark
 * modules, on a 1-unit-per-module grid.
 *
 * A path rather than a rect per module for two reasons. A version-5 symbol is 1,369 modules,
 * roughly 700 of them dark, and 700 nodes is a real cost in a scaled stage and an absurd one
 * in the Figma build the preview feeds. And runs merge: adjacent dark modules in a row become
 * one subpath, so there is no hairline seam between them at fractional scales — the artefact
 * that makes a rect-per-module code fail to scan on a projector.
 */
export const toPath = (modules) => {
  const parts = []
  modules.forEach((row, y) => {
    let start = -1
    for (let x = 0; x <= row.length; x += 1) {
      const dark = x < row.length && row[x]
      if (dark && start < 0) start = x
      if (!dark && start >= 0) {
        parts.push(`M${start} ${y}h${x - start}v1h-${x - start}z`)
        start = -1
      }
    }
  })
  return parts.join('')
}

// ── VERIFICATION ────────────────────────────────────────────────────────────────────
//
// Re-do both of these after any edit here. The failure mode of a wrong QR is a code that
// renders beautifully and scans as nothing — no visual review catches it, and neither does any
// test that only looks at the matrix this file returns.
//
// 1. AGAINST A REFERENCE, MODULE FOR MODULE. 2,064 symbols — nine payloads (ASCII, multi-byte
//    UTF-8, 180 bytes), four EC levels, versions 1-10, each at all eight masks — compared
//    against `segno` 1.6.6 and identical in every module. That covers the bitstream, the
//    Reed-Solomon, the block interleaving, the function and alignment patterns, the version
//    and format information, the placement walk and the masks.
//
//    Two deliberate differences make that comparison a fixed-mask one:
//
//    PADDING. When the stream already ends on a codeword boundary — which byte mode always
//    does — segno appends a whole extra zero byte before the pad codewords, where 7.4.10 asks
//    for none. Both are decodable (it lands after the terminator), and this file does what the
//    standard says. The comparison harness shims segno's version in.
//
//    MASK CHOICE. Everyone scores the eight masks with the same four rules, but segno scores
//    them BEFORE writing the format information and ZXing and Nayuki's qrcodegen score them
//    after; on some payloads that picks a different mask. This file scores after, with the
//    majority. The scoring itself is not in doubt — it reproduces segno's own `mask_scores`
//    exactly, rule by rule, on the same matrices.
//
// 2. THROUGH THE PIXELS, END TO END. The slide is rendered in a browser, the plate is
//    screenshotted, each module is sampled at its centre, and the resulting matrix is read by
//    an independent decoder (format info BCH-checked, mask un-applied, blocks de-interleaved,
//    every Reed-Solomon syndrome asserted zero, segment parsed) — and the URL comes back
//    byte-identical to the one in `deck.js`. This is the only check that covers `toPath`: a
//    run-merging bug there leaves the matrix above perfect and the code on the screen wrong.
//    The same decoder round-trips 340 symbols straight out of `encode`, mask choice included.
