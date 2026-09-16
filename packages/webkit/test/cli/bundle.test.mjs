import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, sep } from 'node:path'

import {
  bodyHash,
  classify,
  CLAUDE_TEMPLATES,
  FRAGMENT_END,
  FRAGMENT_START,
  LEGACY_MARKER,
  listBundle,
  parseMarker,
  spliceFragment,
  stamp,
  stripMarker
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

// --- Provenance marker: stamp / parseMarker / stripMarker / bodyHash / classify -------

const MARKER_RE = /^<!-- webkit-sync source=\S+ version=\S+ sha256=[0-9a-f]{16} -->$/m

test('stamp places the marker on line 1 for a file with no frontmatter', () => {
  const content = 'line one\nline two\n'
  const stamped = stamp(content, { source: 'claude/rules/x.md', version: '5.0.0' })
  const lines = stamped.split('\n')
  assert.match(lines[0], MARKER_RE)
  assert.ok(lines[0].includes('source=claude/rules/x.md'))
  assert.ok(lines[0].includes('version=5.0.0'))
  assert.equal(stamped.slice(lines[0].length + 1), content)
})

test('stamp places the marker right after the closing --- of a frontmatter block', () => {
  const content = '---\nname: webkit-foo\ndescription: bar\n---\n\n# Skill: webkit-foo\nBody.\n'
  const stamped = stamp(content, { source: 'claude/skills/webkit-foo/SKILL.md', version: '5.0.0' })
  const fmEnd = stamped.indexOf('---\n', 4) + 4
  const rest = stamped.slice(fmEnd)
  assert.match(rest.split('\n')[0], MARKER_RE)
  // Frontmatter itself is byte-identical, untouched.
  assert.equal(stamped.slice(0, fmEnd), content.slice(0, content.indexOf('---\n', 4) + 4))
})

test('parseMarker / stripMarker round-trip a stamped file', () => {
  const content = 'Hello.\n'
  const stamped = stamp(content, { source: 'claude/rules/x.md', version: '5.0.0' })
  const marker = parseMarker(stamped)
  assert.equal(marker.source, 'claude/rules/x.md')
  assert.equal(marker.version, '5.0.0')
  assert.match(marker.sha256, /^[0-9a-f]{16}$/)
  assert.equal(stripMarker(stamped), content)
  assert.equal(parseMarker(content), null)
})

test('bodyHash ignores the marker line and normalizes CRLF', () => {
  const content = 'a\nb\n'
  const stamped = stamp(content, { source: 'claude/rules/x.md', version: '5.0.0' })
  assert.equal(bodyHash(stamped), bodyHash(content))
  assert.equal(bodyHash(content), bodyHash(content.replace(/\n/g, '\r\n')))
})

test('stamp is deterministic: stamping twice with the same source/version repeats the hash', () => {
  const content = 'same content\n'
  const a = stamp(content, { source: 'claude/rules/x.md', version: '5.0.0' })
  const b = stamp(stripMarker(a), { source: 'claude/rules/x.md', version: '5.0.0' })
  assert.equal(a, b)
})

test('classify: missing when the consumer file does not exist', () => {
  assert.equal(classify('template body\n', null), 'missing')
})

test('classify: current when consumer is freshly stamped from this exact template', () => {
  const template = 'body\n'
  const consumer = stamp(template, { source: 'claude/rules/x.md', version: '5.0.0' })
  assert.equal(classify(template, consumer), 'current')
})

test('classify: stale when the template changed since the consumer was stamped', () => {
  const oldTemplate = 'body v1\n'
  const consumer = stamp(oldTemplate, { source: 'claude/rules/x.md', version: '5.0.0' })
  const newTemplate = 'body v2\n'
  assert.equal(classify(newTemplate, consumer), 'stale')
})

test('classify: modified when the consumer body was edited after stamping', () => {
  const template = 'body\n'
  const stamped = stamp(template, { source: 'claude/rules/x.md', version: '5.0.0' })
  const edited = `${stamped}extra line\n`
  assert.equal(classify(template, edited), 'modified')
})

test('classify: a tampered marker sha (body untouched) is still reported as modified', () => {
  // There is no way to tell "the body was edited" from "the marker was edited" using
  // content alone — classify treats both as `modified`, the safe (never-overwrite)
  // choice; sync only touches this file again with --force.
  const template = 'body\n'
  const stamped = stamp(template, { source: 'claude/rules/x.md', version: '5.0.0' })
  const tampered = stamped.replace(/sha256=[0-9a-f]{16}/, 'sha256=0000000000000000')
  assert.equal(classify(template, tampered), 'modified')
})

test('classify: unstamped-identical for a byte-identical copy made before sync existed', () => {
  const template = 'body\n'
  assert.equal(classify(template, template), 'unstamped-identical')
})

test('classify: unstamped-different for an unmarked copy that diverged from the template', () => {
  const template = 'body\n'
  assert.equal(classify(template, 'a different body\n'), 'unstamped-different')
})
