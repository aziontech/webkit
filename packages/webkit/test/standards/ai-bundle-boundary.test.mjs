import assert from 'node:assert/strict'
import { existsSync, lstatSync, readdirSync, readFileSync, readlinkSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')

const scopeOf = (file) => readFileSync(file, 'utf8').match(/^scope:\s*(\S+)/m)?.[1] ?? null

const skillFiles = (dir) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => join(dir, e.name, 'SKILL.md'))
        .filter((f) => existsSync(f))
    : []

test('every consumer skill at the repo root is scope: general', () => {
  const wrong = skillFiles(join(REPO, 'skills')).filter((f) => scopeOf(f) !== 'general')
  assert.deepEqual(
    wrong,
    [],
    'skills/ ships to projects; WebKit-development skills go in contributing/skills/'
  )
})

test('every contributor skill in contributing/skills is scope: webkit', () => {
  const wrong = skillFiles(join(REPO, 'contributing/skills')).filter(
    (f) => scopeOf(f) !== null && scopeOf(f) !== 'webkit'
  )
  assert.deepEqual(wrong, [], 'contributing/skills/ never ships; a general skill belongs in skills/')
})

test('the WebKit-development review gate stays out of the consumer bundle', () => {
  assert.equal(existsSync(join(REPO, 'skills/webkit-ui-craft')), false)
  assert.equal(existsSync(join(REPO, 'contributing/skills/ui-craft/SKILL.md')), true)
})

test('development docs never ship in the npm package', () => {
  const shipped = readdirSync(join(REPO, 'packages/webkit/docs'))
  for (const dev of [
    'DOC_LINTS.md',
    'PROCESS.md',
    'GOVERNANCE_IMPLEMENTATION.md',
    'ESLINT_DEPENDENCIES_GUIDE.md'
  ]) {
    assert.equal(
      shipped.includes(dev),
      false,
      `${dev} is a contributor doc: keep it in contributing/docs/`
    )
  }
})

test('the MCP server ships in @aziontech/webkit-mcp, never inside @aziontech/webkit', () => {
  const webkit = JSON.parse(readFileSync(join(REPO, 'packages/webkit/package.json'), 'utf8'))
  const mcp = JSON.parse(readFileSync(join(REPO, 'packages/webkit-mcp/package.json'), 'utf8'))
  assert.deepEqual(Object.keys(webkit.bin), ['webkit'])
  for (const dep of ['@modelcontextprotocol/sdk', 'zod']) {
    assert.equal(webkit.dependencies?.[dep], undefined, `${dep} belongs to @aziontech/webkit-mcp`)
    assert.ok(mcp.dependencies[dep], `@aziontech/webkit-mcp must depend on ${dep}`)
  }
  assert.equal(existsSync(join(REPO, 'packages/webkit/src/mcp')), false)
  assert.equal(mcp.name, '@aziontech/webkit-mcp')
  assert.equal(mcp.bin['webkit-mcp'], './src/server.js')
  assert.ok(mcp.dependencies['@aziontech/webkit'])
  assert.equal(webkit.exports['./catalog-queries'].default, './src/catalog/index.js')
})

test('.claude/ is only the Claude Code adapter: settings.json and links into contributing/', () => {
  const tracked = ['settings.json', 'AGENTS.md', 'agents', 'commands', 'rules', 'skills']
  const ignored = new Set(['settings.local.json', 'launch.json', 'worktrees'])
  const dir = join(REPO, '.claude')
  const stray = readdirSync(dir).filter((name) => !tracked.includes(name) && !ignored.has(name))
  const versioned = stray.filter((name) => !lstatSync(join(dir, name)).isDirectory())
  assert.deepEqual(versioned, [], 'contributor files live in contributing/, never in .claude/')
  for (const name of tracked.filter((n) => n !== 'settings.json')) {
    const path = join(dir, name)
    assert.equal(lstatSync(path).isSymbolicLink(), true, `.claude/${name} must be a link`)
    assert.equal(readlinkSync(path), `../contributing/${name}`)
  }
})
