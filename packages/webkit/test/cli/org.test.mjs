import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { detectOwner, isInternalOrg, parseRemoteUrl, readGitRemotes } from '../../src/cli/org.js'

function makeRepo({ config, pkg } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'webkit-org-'))
  if (config !== undefined) {
    mkdirSync(join(dir, '.git'))
    writeFileSync(join(dir, '.git/config'), config)
  }
  if (pkg !== undefined) writeFileSync(join(dir, 'package.json'), JSON.stringify(pkg, null, 2))
  return dir
}

const withRepo = (opts, fn) => {
  const dir = makeRepo(opts)
  try {
    fn(dir)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

const remote = (name, url) => `[remote "${name}"]\n\turl = ${url}\n\tfetch = +refs/heads/*\n`

test('parseRemoteUrl understands every remote form git writes', () => {
  assert.deepEqual(parseRemoteUrl('git@github.com:aziontech/webkit.git'), {
    host: 'github.com',
    owner: 'aziontech',
    repo: 'webkit'
  })
  assert.deepEqual(parseRemoteUrl('https://github.com/aziontech/webkit'), {
    host: 'github.com',
    owner: 'aziontech',
    repo: 'webkit'
  })
  assert.deepEqual(parseRemoteUrl('ssh://git@github.com:22/AzionCorp/app.git'), {
    host: 'github.com',
    owner: 'AzionCorp',
    repo: 'app'
  })
  // A user in the https URL must not be mistaken for the owner.
  assert.equal(parseRemoteUrl('https://token@github.com/foo/bar.git').owner, 'foo')
})

test('parseRemoteUrl returns null when the URL carries no owner', () => {
  for (const url of [
    '/srv/repo.git',
    '../sibling',
    'file:///srv/repo.git',
    'git@github.com:repo.git',
    '',
    'not a url'
  ]) {
    assert.equal(parseRemoteUrl(url), null, `expected null for ${JSON.stringify(url)}`)
  }
})

test('isInternalOrg matches the Azion orgs, case-insensitively, and nothing else', () => {
  for (const owner of ['aziontech', 'AzionCorp', 'AZIONTECH']) {
    assert.equal(isInternalOrg(owner), true, owner)
  }
  // A lookalike owner is NOT internal — the check is exact, not a substring.
  for (const owner of ['azion', 'aziontech-labs', 'my-aziontech', 'isaquebock', undefined]) {
    assert.equal(isInternalOrg(owner), false, String(owner))
  }
})

test('readGitRemotes parses every remote, ignoring other sections and comments', () => {
  const config = `[core]\n\tbare = false\n# a comment\n${remote('origin', 'git@github.com:a/b.git')}[branch "main"]\n\tremote = origin\n${remote('upstream', 'https://github.com/c/d.git')}`
  withRepo({ config }, (dir) => {
    assert.deepEqual(readGitRemotes(dir), [
      { remote: 'origin', url: 'git@github.com:a/b.git' },
      { remote: 'upstream', url: 'https://github.com/c/d.git' }
    ])
  })
})

test('detectOwner reads the owner from origin', () => {
  withRepo({ config: remote('origin', 'git@github.com:aziontech/console.git') }, (dir) => {
    const owner = detectOwner(dir)
    assert.equal(owner.owner, 'aziontech')
    assert.equal(owner.repo, 'console')
    assert.equal(owner.internal, true)
    assert.match(owner.source, /origin/)
  })
})

test('detectOwner prefers an internal org on ANY remote — a fork keeps its org', () => {
  // origin is the contributor's personal fork; upstream is the org. The repo is an
  // Azion repo either way, so the internal owner wins over origin.
  const config =
    remote('origin', 'https://github.com/isaquebock/console.git') +
    remote('upstream', 'git@github.com:AzionCorp/console.git')
  withRepo({ config }, (dir) => {
    const owner = detectOwner(dir)
    assert.equal(owner.owner, 'AzionCorp')
    assert.equal(owner.internal, true)
    assert.match(owner.source, /upstream/)
  })
})

test('detectOwner reports a non-Azion owner as external', () => {
  withRepo({ config: remote('origin', 'git@github.com:someone/poc.git') }, (dir) => {
    assert.deepEqual(
      { owner: detectOwner(dir).owner, internal: detectOwner(dir).internal },
      { owner: 'someone', internal: false }
    )
  })
})

test('detectOwner falls back to package.json#repository when there is no remote', () => {
  withRepo({ pkg: { name: 'x', repository: 'git+https://github.com/aziontech/x.git' } }, (dir) => {
    const owner = detectOwner(dir)
    assert.equal(owner.owner, 'aziontech')
    assert.equal(owner.source, 'package.json#repository')
    assert.equal(owner.internal, true)
  })
  // The npm shorthand forms count too.
  withRepo(
    { pkg: { name: 'x', repository: { type: 'git', url: 'github:AzionCorp/y' } } },
    (dir) => {
      assert.equal(detectOwner(dir).owner, 'AzionCorp')
    }
  )
})

test('detectOwner returns null for a repo with nothing to go on', () => {
  withRepo({ pkg: { name: 'local-only' } }, (dir) => {
    assert.equal(detectOwner(dir), null)
  })
  // A git repo whose only remote is a local path yields no owner either.
  withRepo({ config: remote('origin', '/srv/git/thing.git') }, (dir) => {
    assert.equal(detectOwner(dir), null)
  })
})

test('detectOwner follows a `gitdir:` pointer (worktree / submodule)', () => {
  const real = makeRepo({ config: remote('origin', 'git@github.com:aziontech/webkit.git') })
  const linked = mkdtempSync(join(tmpdir(), 'webkit-org-link-'))
  try {
    writeFileSync(join(linked, '.git'), `gitdir: ${join(real, '.git')}\n`)
    assert.equal(detectOwner(linked).owner, 'aziontech')
  } finally {
    rmSync(real, { recursive: true, force: true })
    rmSync(linked, { recursive: true, force: true })
  }
})

test('detectOwner follows `commondir` — a linked worktree sees the shared remotes', () => {
  // A worktree's own gitdir has no `config`: remotes live in the main repo's .git,
  // named by a `commondir` pointer. Without following it, every worktree looks
  // remote-less and the inference silently stops working for anyone using them.
  const main = makeRepo({ config: remote('origin', 'git@github.com:aziontech/webkit.git') })
  const worktree = mkdtempSync(join(tmpdir(), 'webkit-org-wt-'))
  try {
    const gitdir = join(main, '.git/worktrees/feature')
    mkdirSync(gitdir, { recursive: true })
    writeFileSync(join(gitdir, 'commondir'), '../..\n')
    writeFileSync(join(worktree, '.git'), `gitdir: ${gitdir}\n`)
    const owner = detectOwner(worktree)
    assert.equal(owner?.owner, 'aziontech')
    assert.equal(owner.internal, true)
  } finally {
    rmSync(main, { recursive: true, force: true })
    rmSync(worktree, { recursive: true, force: true })
  }
})
