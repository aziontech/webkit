import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
const DIR = resolve(ROOT, '.github/workflows')
const files = readdirSync(DIR).filter((f) => /^publish-.+\.yml$/.test(f))
const read = (f) => readFileSync(resolve(DIR, f), 'utf8')

test('every package has a publish workflow', () => {
  assert.deepEqual(files.sort(), [
    'publish-icons.yml',
    'publish-theme.yml',
    'publish-webkit-mcp.yml',
    'publish-webkit.yml'
  ])
})

for (const file of files) {
  const pkg = file.replace(/^publish-/, '').replace(/\.yml$/, '')
  const text = read(file)

  test(`${file} publishes only through the npm environment`, () => {
    assert.match(text, /\n {4}environment:\n {6}name: npm\n/)
  })

  test(`${file} runs only from main or its own release tag`, () => {
    assert.ok(text.includes("github.ref == 'refs/heads/main'"))
    assert.ok(text.includes(`startsWith(github.ref, 'refs/tags/@aziontech/${pkg}@')`))
    assert.ok(text.includes(`startsWith(github.event.release.tag_name, '@aziontech/${pkg}@')`))
    assert.doesNotMatch(text, /if: github\.event_name == 'workflow_dispatch' \|\|/)
  })

  test(`${file} refuses a tag that is not on main`, () => {
    assert.ok(text.includes('git merge-base --is-ancestor "$TAG_COMMIT" refs/remotes/origin/main'))
    assert.match(text, /fetch-depth: 0/)
  })

  test(`${file} keeps least privilege`, () => {
    assert.match(text, /^permissions: \{\}$/m)
    assert.equal(text.match(/id-token: write/g)?.length, 1)
    assert.doesNotMatch(text, /contents: write/)
  })

  test(`${file} pins every action to a commit`, () => {
    for (const [, ref] of text.matchAll(/uses: [^@\s]+@(\S+)/g)) {
      assert.match(ref, /^[0-9a-f]{40}$/)
    }
  })
}

test('release-please dispatches publish workflows from main', () => {
  assert.ok(read('release-please.yml').includes('gh workflow run "$workflow" --ref main'))
})
