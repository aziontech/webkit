import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, sep } from 'node:path'

import {
  CLAUDE_TEMPLATES,
  FRAGMENT_END,
  FRAGMENT_START,
  LEGACY_MARKER,
  listBundle,
  spliceFragment
} from '../../src/cli/bundle.js'

function walkMarkdownRelative(dir, base = dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...walkMarkdownRelative(full, base))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.push(
        full
          .slice(base.length + 1)
          .split(sep)
          .join('/')
      )
    }
  }
  return out
}

test('listBundle equals a plain directory walk of rules/, skills/, agents/', () => {
  const expected = []
  for (const sub of ['rules', 'skills', 'agents']) {
    const abs = join(CLAUDE_TEMPLATES, sub)
    for (const rel of walkMarkdownRelative(abs)) {
      expected.push(`${sub}/${rel}`)
    }
  }
  expected.sort()

  const actual = listBundle()
  assert.deepEqual(actual, expected)
})

test('listBundle includes webkit-comments.md (the file the hand-maintained list dropped)', () => {
  const bundle = listBundle()
  assert.ok(bundle.includes('rules/webkit-comments.md'))
})

test('listBundle includes every skill SKILL.md', () => {
  const bundle = listBundle()
  const skillDirs = readdirSync(join(CLAUDE_TEMPLATES, 'skills'), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
  assert.ok(skillDirs.length > 0, 'expected at least one skill directory on disk')
  for (const name of skillDirs) {
    assert.ok(
      bundle.includes(`skills/${name}/SKILL.md`),
      `expected skills/${name}/SKILL.md in the derived bundle`
    )
  }
})

test('listBundle returns sorted POSIX-relative paths', () => {
  const bundle = listBundle()
  const sorted = [...bundle].sort()
  assert.deepEqual(bundle, sorted)
  for (const rel of bundle) {
    assert.ok(!rel.includes('\\'), `path must be POSIX-style: ${rel}`)
    assert.ok(
      rel.startsWith('rules/') || rel.startsWith('skills/') || rel.startsWith('agents/'),
      `unexpected path outside the three bundle dirs: ${rel}`
    )
  }
})

test('listBundle accepts an injected templates dir (for testing exclusions/fixtures)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'webkit-bundle-'))
  try {
    mkdirSync(join(dir, 'rules'), { recursive: true })
    mkdirSync(join(dir, 'skills', 'foo'), { recursive: true })
    mkdirSync(join(dir, 'agents'), { recursive: true })
    writeFileSync(join(dir, 'rules', 'a.md'), '# a')
    writeFileSync(join(dir, 'skills', 'foo', 'SKILL.md'), '# skill')
    writeFileSync(join(dir, 'agents', 'b.md'), '# b')
    writeFileSync(join(dir, 'rules', 'ignored.txt'), 'not markdown')

    const bundle = listBundle(dir)
    assert.deepEqual(bundle, ['agents/b.md', 'rules/a.md', 'skills/foo/SKILL.md'])
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

// --- spliceFragment ------------------------------------------------------------------

function idempotent(source, body) {
  const once = spliceFragment(source, body)
  const twice = spliceFragment(once, body)
  return twice === once
}

test('spliceFragment: empty file gets a fenced block appended, idempotently', () => {
  const result = spliceFragment('', 'BODY')
  assert.equal(result, `${FRAGMENT_START}\nBODY\n${FRAGMENT_END}\n`)
  assert.ok(idempotent('', 'BODY'))
})

test('spliceFragment: existing user content gets the fragment appended after it', () => {
  const source = '# My project\n\nSome notes.\n'
  const result = spliceFragment(source, 'BODY')
  assert.equal(result, `# My project\n\nSome notes.\n\n${FRAGMENT_START}\nBODY\n${FRAGMENT_END}\n`)
  assert.ok(idempotent(source, 'BODY'))
  // Exactly one blank line of separation, no trailing whitespace explosion.
  assert.doesNotMatch(result, /\n{3,}/)
  assert.doesNotMatch(result, /[ \t]+\n/)
})

test('spliceFragment: a legacy single marker is converted to a fenced block', () => {
  const source = `# Proj\n\n${LEGACY_MARKER}\n## @aziontech/webkit design system\nOld body.\n\n## Other section\nuser stuff\n`
  const result = spliceFragment(source, 'NEWBODY')

  assert.ok(!result.includes(LEGACY_MARKER), 'legacy marker must be gone')
  assert.equal(result.split(FRAGMENT_START).length - 1, 1)
  assert.ok(result.includes('NEWBODY'))
  assert.ok(!result.includes('Old body.'))
  assert.ok(result.startsWith('# Proj'))
  assert.ok(
    result.includes('## Other section\nuser stuff'),
    'trailing user section must be preserved'
  )
  assert.ok(idempotent(source, 'NEWBODY'))
})

test('spliceFragment: a duplicated legacy fragment (docs-repo case) is repaired to one block', () => {
  const legacyBody = '## @aziontech/webkit design system\nOld body.\n'
  const source = `# Proj heading\n\n${LEGACY_MARKER}\n${legacyBody}${LEGACY_MARKER}\n${legacyBody}`
  const result = spliceFragment(source, 'NEWBODY')

  assert.equal(result.split(LEGACY_MARKER).length - 1, 0, 'no legacy marker should remain')
  assert.equal(result.split(FRAGMENT_START).length - 1, 1, 'exactly one fenced block should remain')
  assert.ok(result.startsWith('# Proj heading'))
  assert.ok(idempotent(source, 'NEWBODY'))
})

test('spliceFragment: a legacy block does not stop early at its own heading', () => {
  // The fragment's own first heading ("## @aziontech/webkit design system") must not be
  // treated as a foreign section boundary, or the legacy block would be truncated to
  // just the marker line and the real body would leak out as "user content".
  const legacyBody = '## @aziontech/webkit design system\nLine one.\nLine two.\n'
  const source = `${LEGACY_MARKER}\n${legacyBody}`
  const result = spliceFragment(source, 'NEWBODY')
  assert.ok(
    !result.includes('Line one.'),
    'the whole legacy body must be replaced, not just the marker line'
  )
  assert.equal(result, `${FRAGMENT_START}\nNEWBODY\n${FRAGMENT_END}\n`)
})

test('spliceFragment: a legacy block stops at the next foreign heading, preserving it', () => {
  const source = `${LEGACY_MARKER}\n## @aziontech/webkit design system\nOld.\n## User Section\nkeep this\n`
  const result = spliceFragment(source, 'NEWBODY')
  assert.ok(result.includes('## User Section\nkeep this'))
  assert.ok(!result.includes('Old.'))
})

test('spliceFragment: an already-fenced block with an old body is replaced', () => {
  const source = spliceFragment('# Proj\n', 'OLDBODY')
  const result = spliceFragment(source, 'NEWBODY')
  assert.ok(!result.includes('OLDBODY'))
  assert.ok(result.includes('NEWBODY'))
  assert.equal(result.split(FRAGMENT_START).length - 1, 1)
  assert.ok(idempotent(source, 'NEWBODY'))
})

test('spliceFragment: a stray second fenced block collapses to one', () => {
  const base = spliceFragment('', 'BODY')
  const stray = `${base}\n${FRAGMENT_START}\nEXTRA\n${FRAGMENT_END}\n`
  const result = spliceFragment(stray, 'NEWBODY')
  assert.equal(result.split(FRAGMENT_START).length - 1, 1)
  assert.ok(result.includes('NEWBODY'))
  assert.ok(!result.includes('EXTRA'))
  assert.ok(idempotent(stray, 'NEWBODY'))
})

test('spliceFragment is idempotent across every case', () => {
  const legacyBody = '## @aziontech/webkit design system\nOld.\n'
  const cases = [
    ['', 'BODY'],
    ['# Heading\n\nContent.\n', 'BODY'],
    [`${LEGACY_MARKER}\n${legacyBody}`, 'BODY'],
    [`${LEGACY_MARKER}\n${legacyBody}${LEGACY_MARKER}\n${legacyBody}`, 'BODY'],
    [spliceFragment('', 'OLD'), 'NEW']
  ]
  for (const [source, body] of cases) {
    assert.ok(idempotent(source, body), `not idempotent for source: ${JSON.stringify(source)}`)
  }
})
