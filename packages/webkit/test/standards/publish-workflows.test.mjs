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

const release = read('release-package.yml')
const jobOf = (text, name) => {
  const start = text.indexOf(`\n  ${name}:\n`)
  const next = text.slice(start + 1).search(/\n  [a-z][a-z-]*:\n/)
  return next === -1 ? text.slice(start) : text.slice(start, start + 1 + next)
}

for (const file of files) {
  const pkg = file.replace(/^publish-/, '').replace(/\.yml$/, '')
  const text = read(file)

  test(`${file} publishes through the shared release workflow`, () => {
    assert.match(text, /uses: \.\/\.github\/workflows\/release-package\.yml[ \n]/)
    assert.ok(text.includes(`package: '@aziontech/${pkg}'`))
  })

  test(`${file} runs only from main or its own release tag`, () => {
    assert.ok(text.includes("github.ref == 'refs/heads/main'"))
    assert.ok(text.includes(`startsWith(github.ref, 'refs/tags/@aziontech/${pkg}@')`))
    assert.ok(text.includes(`startsWith(github.event.release.tag_name, '@aziontech/${pkg}@')`))
    assert.doesNotMatch(text, /if: github\.event_name == 'workflow_dispatch' \|\|/)
  })

  test(`${file} grants only what the release workflow needs`, () => {
    assert.match(text, /^permissions: \{\}$/m)
    assert.equal(text.match(/id-token: write/g)?.length, 1)
    assert.equal(text.match(/contents: write/g)?.length, 1)
  })
}

test('release-package.yml publishes only through the npm environment', () => {
  assert.match(jobOf(release, 'release'), /\n {4}environment:\n {6}name: npm\n/)
})

test('release-package.yml refuses a tag that is not on main', () => {
  assert.ok(release.includes('git merge-base --is-ancestor "$TAG_COMMIT" refs/remotes/origin/main'))
  assert.match(release, /fetch-depth: 0/)
})

test('release-package.yml gates the tarball before it is signed and published', () => {
  const job = jobOf(release, 'release')
  const at = (needle) => {
    const index = job.indexOf(needle)
    assert.notEqual(index, -1, needle)
    return index
  }
  assert.ok(at('syft scan') < at('--fail-on high'))
  assert.ok(at('--fail-on high') < at('cosign sign-blob'))
  assert.ok(at('cosign sign-blob') < at('npm publish "$TARBALL" --provenance'))
})

test('release-package.yml keeps least privilege per job', () => {
  assert.match(release, /^permissions: \{\}$/m)
  const build = jobOf(release, 'release')
  const attach = jobOf(release, 'attach')
  assert.match(build, /permissions:\n {6}contents: read\n {6}id-token: write\n/)
  assert.match(attach, /permissions:\n {6}contents: write\n {4}steps:/)
  assert.doesNotMatch(attach, /pnpm|npm install|checkout/)
})

for (const file of [...files, 'release-package.yml']) {
  test(`${file} pins every action to a commit`, () => {
    for (const [, ref] of read(file).matchAll(/uses: [^@\s]+@(\S+)/g)) {
      assert.match(ref, /^[0-9a-f]{40}$/)
    }
  })
}

test('release-please dispatches publish workflows from main', () => {
  assert.ok(read('release-please.yml').includes('gh workflow run "$workflow" --ref main'))
})
