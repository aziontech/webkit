import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
const DIR = resolve(ROOT, '.github/workflows')
const files = readdirSync(DIR).filter((f) => f.endsWith('.yml'))

function runBlocks(text) {
  const blocks = []
  const lines = text.split('\n')
  lines.forEach((line, index) => {
    const match = line.match(/^(\s*)(?:- )?run: ?(.*)$/)
    if (!match) return
    const indent = match[1].length
    const body = [match[2]]
    for (let next = index + 1; next < lines.length; next++) {
      const value = lines[next]
      if (value.trim() && value.search(/\S/) <= indent) break
      body.push(value)
    }
    blocks.push({ line: index + 1, body: body.join('\n') })
  })
  return blocks
}

for (const file of files) {
  const text = readFileSync(resolve(DIR, file), 'utf8')
  const blocks = runBlocks(text)

  test(`${file} passes secrets to scripts through env, never inline`, () => {
    for (const { line, body } of blocks) {
      assert.doesNotMatch(
        body,
        /\$\{\{\s*secrets\./,
        `${file}:${line} interpolates a secret into a run script`
      )
    }
  })

  test(`${file} verifies the checksum of every binary it downloads`, () => {
    for (const { line, body } of blocks) {
      if (!/\b(curl|wget)\b/.test(body)) continue
      assert.match(body, /sha256sum -c/, `${file}:${line} downloads without a sha256 check`)
      assert.doesNotMatch(body, /\|\s*(ba|z)?sh\b/, `${file}:${line} pipes a download into a shell`)
    }
  })
}

test('Dependabot opens security updates for the npm dependencies, not version bumps', () => {
  const text = readFileSync(resolve(ROOT, '.github/dependabot.yml'), 'utf8')
  assert.match(
    text,
    /- package-ecosystem: npm\n {4}directory: \/\n[\s\S]*?open-pull-requests-limit: 0/
  )
})

test('SECURITY.md gives a private path that works when private reporting is off', () => {
  const text = readFileSync(resolve(ROOT, 'SECURITY.md'), 'utf8')
  assert.match(text, /Report a vulnerability/)
  assert.match(text, /Security contact\s+request/)
})
