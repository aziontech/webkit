import assert from 'node:assert/strict'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

import { BLOCK_THUMBNAIL, blockThumbnailFile } from '../src/lib/block-thumbnails.ts'

const HERE = dirname(fileURLToPath(import.meta.url))
const PUBLIC = resolve(HERE, '../public')
const CATALOG = resolve(HERE, '../../../packages/webkit/catalog.json')
const MAX_BYTES = 24 * 1024

const ids = Object.keys(JSON.parse(readFileSync(CATALOG, 'utf8')).blocks)

const webpSize = (file: string) => {
  const bytes = readFileSync(file)
  assert.equal(bytes.subarray(0, 4).toString('latin1'), 'RIFF', `${file} is not a webp file`)
  assert.equal(bytes.subarray(8, 12).toString('latin1'), 'WEBP', `${file} is not a webp file`)
  const chunk = bytes.subarray(12, 16).toString('latin1')
  if (chunk === 'VP8 ') {
    return { width: bytes.readUInt16LE(26) & 0x3fff, height: bytes.readUInt16LE(28) & 0x3fff }
  }
  if (chunk === 'VP8L') {
    const bits = bytes.readUInt32LE(21)
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
  }
  return { width: bytes.readUIntLE(24, 3) + 1, height: bytes.readUIntLE(27, 3) + 1 }
}

test('every block in the catalog has a small static thumbnail in both themes', () => {
  const problems: string[] = []
  for (const id of ids) {
    for (const theme of ['light', 'dark'] as const) {
      const file = join(PUBLIC, blockThumbnailFile(id, theme))
      if (!existsSync(file)) {
        problems.push(`${id} (${theme}): missing; run node apps/docs/scripts/generate-block-thumbnails.mjs`)
        continue
      }
      if (statSync(file).size > MAX_BYTES) problems.push(`${id} (${theme}): over ${MAX_BYTES} bytes`)
      const { width, height } = webpSize(file)
      if (width !== BLOCK_THUMBNAIL.width || height !== BLOCK_THUMBNAIL.height) {
        problems.push(`${id} (${theme}): ${width}x${height}`)
      }
    }
  }
  assert.deepEqual(problems, [])
})
