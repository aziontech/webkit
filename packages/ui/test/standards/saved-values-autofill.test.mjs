import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const BLOCKS = join(dirname(fileURLToPath(import.meta.url)), '../../blocks')

const SIGN_IN_TOKENS = new Set([
  'username',
  'email',
  'name',
  'given-name',
  'family-name',
  'nickname',
  'url'
])

const blockDirs = () =>
  readdirSync(BLOCKS).flatMap((group) =>
    readdirSync(join(BLOCKS, group), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(BLOCKS, group, entry.name))
  )

const sources = (dir) =>
  readdirSync(dir, { recursive: true })
    .map(String)
    .filter((file) => file.endsWith('.vue') && !file.startsWith('variants'))
    .map((file) => ({ file: join(dir, file), text: readFileSync(join(dir, file), 'utf8') }))

test('a block that edits saved values never invites a password manager to sign in', () => {
  const found = []
  for (const dir of blockDirs()) {
    const files = sources(dir)
    if (!files.some(({ text }) => /<SaveBar\b/.test(text))) continue
    for (const { file, text } of files) {
      for (const tag of text.matchAll(/<(Input|InputGroup\.Input|InputGroupInput)\b[^>]*>/g)) {
        const token = tag[0].match(/autocomplete="([^"]*)"/)?.[1]
        if (token && SIGN_IN_TOKENS.has(token)) {
          found.push(`${relative(BLOCKS, file)}: autocomplete="${token}"`)
        }
      }
    }
  }
  assert.deepEqual(found, [], 'Use autocomplete="off" on a saved name, email or link field')
})
