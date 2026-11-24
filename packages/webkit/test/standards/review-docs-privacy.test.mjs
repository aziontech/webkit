import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const PKG = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const REVIEWS = join(PKG, 'docs/reviews')
const ROLE_MAILBOXES = new Set(['dpo', 'privacy', 'support', 'security', 'sales'])
const TEXT = /\.(md|json|txt|mjs|ts|vue|html|csv|tsv|yml)$/

const files = readdirSync(REVIEWS, { recursive: true })
  .map((file) => join(REVIEWS, String(file)))
  .filter((file) => TEXT.test(file) && statSync(file).isFile())

test('the review docs hold no personal company address and no build-host path', () => {
  const found = []
  for (const file of files) {
    const text = readFileSync(file, 'utf8')
    for (const [, local] of text.matchAll(/\b([\w.%+-]+)@azion\.com\b/g))
      if (!ROLE_MAILBOXES.has(local)) found.push(`${relative(PKG, file)}: ${local}@azion.com`)
    for (const [path] of text.matchAll(
      /(?<![\w.:])\/(?:data\/claude|root|home\/[a-z][\w-]*)\/[^\s'"`)]*/g
    ))
      found.push(`${relative(PKG, file)}: ${path}`)
  }
  assert.deepEqual(found, [])
})
