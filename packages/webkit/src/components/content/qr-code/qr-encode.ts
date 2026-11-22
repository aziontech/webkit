import {
  ECC_BLOCKS,
  ECC_CODEWORDS,
  FORMAT_BITS,
  MASKS,
  type QrCodeErrorCorrection
} from './qr-code-data'

export type { QrCodeErrorCorrection } from './qr-code-data'

const rawDataModules = (version: number): number => {
  let result = (16 * version + 128) * version + 64
  if (version >= 2) {
    const align = Math.floor(version / 7) + 2
    result -= (25 * align - 10) * align - 55
    if (version >= 7) result -= 36
  }
  return result
}

const dataCodewords = (version: number, ecl: QrCodeErrorCorrection): number =>
  Math.floor(rawDataModules(version) / 8) - ECC_CODEWORDS[ecl][version] * ECC_BLOCKS[ecl][version]

const gfMultiply = (x: number, y: number): number => {
  let z = 0
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d)
    z ^= ((y >>> i) & 1) * x
  }
  return z
}

const rsDivisor = (degree: number): number[] => {
  const result = new Array<number>(degree).fill(0)
  result[degree - 1] = 1
  let root = 1
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      result[j] = gfMultiply(result[j], root)
      if (j + 1 < degree) result[j] ^= result[j + 1]
    }
    root = gfMultiply(root, 0x02)
  }
  return result
}

const rsRemainder = (data: number[], divisor: number[]): number[] => {
  const result = divisor.map(() => 0)
  for (const byte of data) {
    const factor = byte ^ (result.shift() as number)
    result.push(0)
    divisor.forEach((coefficient, i) => {
      result[i] ^= gfMultiply(coefficient, factor)
    })
  }
  return result
}

const alignmentPositions = (version: number): number[] => {
  if (version === 1) return []
  const count = Math.floor(version / 7) + 2
  const size = version * 4 + 17
  const step = version === 32 ? 26 : Math.ceil((version * 4 + 4) / (count * 2 - 2)) * 2
  const result = [6]
  for (let pos = size - 7; result.length < count; pos -= step) result.splice(1, 0, pos)
  return result
}

const encodeData = (
  bytes: Uint8Array,
  ecl: QrCodeErrorCorrection
): { version: number; data: number[] } => {
  let version = 1
  for (; version <= 40; version++) {
    const countBits = version < 10 ? 8 : 16
    if (
      bytes.length < 2 ** countBits &&
      4 + countBits + bytes.length * 8 <= dataCodewords(version, ecl) * 8
    )
      break
  }
  if (version > 40) throw new RangeError('QR code: the value is too long to encode')
  const bits: number[] = []
  const push = (value: number, length: number): void => {
    for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1)
  }
  push(0b0100, 4)
  push(bytes.length, version < 10 ? 8 : 16)
  for (const byte of bytes) push(byte, 8)
  const capacity = dataCodewords(version, ecl) * 8
  push(0, Math.min(4, capacity - bits.length))
  push(0, (8 - (bits.length % 8)) % 8)
  for (let pad = 0xec; bits.length < capacity; pad ^= 0xec ^ 0x11) push(pad, 8)
  const data: number[] = []
  for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(''), 2))
  return { version, data }
}

const interleave = (data: number[], version: number, ecl: QrCodeErrorCorrection): number[] => {
  const blockCount = ECC_BLOCKS[ecl][version]
  const eccLength = ECC_CODEWORDS[ecl][version]
  const raw = Math.floor(rawDataModules(version) / 8)
  const shortBlocks = blockCount - (raw % blockCount)
  const shortLength = Math.floor(raw / blockCount)
  const divisor = rsDivisor(eccLength)
  const blocks: number[][] = []
  for (let i = 0, k = 0; i < blockCount; i++) {
    const chunk = data.slice(k, k + shortLength - eccLength + (i < shortBlocks ? 0 : 1))
    k += chunk.length
    const ecc = rsRemainder(chunk, divisor)
    if (i < shortBlocks) chunk.push(0)
    blocks.push(chunk.concat(ecc))
  }
  const result: number[] = []
  for (let i = 0; i < blocks[0].length; i++) {
    blocks.forEach((block, j) => {
      if (i !== shortLength - eccLength || j >= shortBlocks) result.push(block[i])
    })
  }
  return result
}

const FINDER = [true, false, true, true, true, false, true]

const linePenalty = (line: boolean[], size: number): number => {
  let score = 0
  let run = 1
  for (let i = 1; i <= size; i++) {
    if (i < size && line[i] === line[i - 1]) {
      run++
      continue
    }
    if (run >= 5) score += run - 2
    run = 1
  }
  for (let i = 0; i + 7 <= size; i++) {
    if (!FINDER.every((value, k) => line[i + k] === value)) continue
    const before = [1, 2, 3, 4].every((k) => !line[i - k])
    const after = [7, 8, 9, 10].every((k) => !line[i + k])
    if (before || after) score += 40
  }
  return score
}

const sameBlock = (grid: boolean[][], x: number, y: number): boolean =>
  grid[y][x] === grid[y][x + 1] &&
  grid[y][x] === grid[y + 1][x] &&
  grid[y][x] === grid[y + 1][x + 1]

const penalty = (grid: boolean[][]): number => {
  const size = grid.length
  let score = 0
  for (let i = 0; i < size; i++) {
    score += linePenalty(grid[i], size)
    score += linePenalty(
      grid.map((row) => row[i]),
      size
    )
  }
  let dark = 0
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (grid[y][x]) dark++
      if (x < size - 1 && y < size - 1 && sameBlock(grid, x, y)) score += 3
    }
  }
  const total = size * size
  return score + (Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1) * 10
}

interface QrMatrix {
  size: number
  modules: boolean[][]
  reserved: boolean[][]
  set: (x: number, y: number, dark: boolean) => void
}

const createMatrix = (size: number): QrMatrix => {
  const modules: boolean[][] = Array.from({ length: size }, () =>
    new Array<boolean>(size).fill(false)
  )
  const reserved: boolean[][] = Array.from({ length: size }, () =>
    new Array<boolean>(size).fill(false)
  )
  const set = (x: number, y: number, dark: boolean): void => {
    modules[y][x] = dark
    reserved[y][x] = true
  }
  return { size, modules, reserved, set }
}

const drawFunctionPatterns = ({ size, set }: QrMatrix, version: number): void => {
  for (let i = 0; i < size; i++) {
    set(6, i, i % 2 === 0)
    set(i, 6, i % 2 === 0)
  }
  for (const [cx, cy] of [
    [3, 3],
    [size - 4, 3],
    [3, size - 4]
  ]) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const x = cx + dx
        const y = cy + dy
        const distance = Math.max(Math.abs(dx), Math.abs(dy))
        if (x >= 0 && x < size && y >= 0 && y < size) set(x, y, distance !== 2 && distance !== 4)
      }
    }
  }
  const align = alignmentPositions(version)
  const last = align.length - 1
  align.forEach((ax, i) => {
    align.forEach((ay, j) => {
      if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) return
      for (let dy = -2; dy <= 2; dy++)
        for (let dx = -2; dx <= 2; dx++)
          set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1)
    })
  })
}

const drawFormat = ({ size, set }: QrMatrix, ecl: QrCodeErrorCorrection, mask: number): void => {
  const value = (FORMAT_BITS[ecl] << 3) | mask
  let rem = value
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537)
  const bits = ((value << 10) | rem) ^ 0x5412
  const bit = (i: number): boolean => ((bits >>> i) & 1) !== 0
  for (let i = 0; i <= 5; i++) set(8, i, bit(i))
  set(8, 7, bit(6))
  set(8, 8, bit(7))
  set(7, 8, bit(8))
  for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i))
  for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i))
  for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i))
  set(8, size - 8, true)
}

const drawVersion = ({ size, set }: QrMatrix, version: number): void => {
  let rem = version
  for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25)
  const bits = (version << 12) | rem
  for (let i = 0; i < 18; i++) {
    const dark = ((bits >>> i) & 1) !== 0
    const a = size - 11 + (i % 3)
    const b = Math.floor(i / 3)
    set(a, b, dark)
    set(b, a, dark)
  }
}

const drawCodewords = ({ size, modules, reserved }: QrMatrix, codewords: number[]): void => {
  let index = 0
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5
    for (let vertical = 0; vertical < size; vertical++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j
        const upward = ((right + 1) & 2) === 0
        const y = upward ? size - 1 - vertical : vertical
        if (reserved[y][x] || index >= codewords.length * 8) continue
        modules[y][x] = ((codewords[index >>> 3] >>> (7 - (index & 7))) & 1) !== 0
        index++
      }
    }
  }
}

export function encodeQr(text: string, ecl: QrCodeErrorCorrection = 'M'): boolean[][] {
  const { version, data } = encodeData(new TextEncoder().encode(text), ecl)
  const matrix = createMatrix(version * 4 + 17)
  drawFunctionPatterns(matrix, version)
  drawFormat(matrix, ecl, 0)
  if (version >= 7) drawVersion(matrix, version)
  drawCodewords(matrix, interleave(data, version, ecl))

  const { modules, reserved } = matrix
  let best: boolean[][] = modules
  let bestScore = Infinity
  MASKS.forEach((mask, m) => {
    drawFormat(matrix, ecl, m)
    const candidate = modules.map((row, y) =>
      row.map((dark, x) => (reserved[y][x] ? dark : dark !== mask(x, y)))
    )
    const score = penalty(candidate)
    if (score < bestScore) {
      bestScore = score
      best = candidate
    }
  })
  return best
}
