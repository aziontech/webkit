import { test } from 'node:test'
import assert from 'node:assert/strict'

import { cleanup, cli, cliJson, makeProject } from './_helpers/cli-project.mjs'

test('search returns blocks, components and examples', () => {
  const dir = makeProject()
  try {
    const r = cliJson(dir, 'search', 'delete', 'confirmation')
    assert.equal(r.code, 0)
    assert.equal(r.json.query, 'delete confirmation')
    assert.equal(r.json.blocks[0].id, 'platform/delete/delete-with-confirmation')
    assert.ok(r.json.components.some((c) => c.name === 'confirm-dialog'))
    const text = cli(dir, 'search', 'button')
    assert.match(text.stdout, /Components \(\d+\)\n {2}button /)
    assert.match(text.stdout, /Examples \([1-9]\d*\)\n {2}button › /)
  } finally {
    cleanup(dir)
  }
})

test('view shows a component API with an example, and a block with guidelines and SFC', () => {
  const dir = makeProject()
  try {
    const comp = cliJson(dir, 'view', 'button')
    assert.equal(comp.json.kind, 'component')
    assert.equal(comp.json.treeShakeableImport, '@aziontech/webkit/button')
    assert.ok(comp.json.example.sfc.includes('<template>'))
    const text = cli(dir, 'view', 'button')
    assert.match(text.stdout, /import Button from '@aziontech\/webkit\/button'/)

    const block = cli(dir, 'view', 'platform/create/create-hub', '--variant', 'Connected')
    assert.equal(block.code, 0, block.stderr)
    assert.match(
      block.stdout,
      /npx @aziontech\/webkit add platform\/create\/create-hub --variant Connected/
    )
    assert.match(block.stdout, /--- guidelines ---/)
    assert.match(block.stdout, /--- Connected\.vue ---\n<script setup/)

    const missing = cli(dir, 'view', 'no-such-thing')
    assert.equal(missing.code, 1)
    assert.match(missing.stderr, /No component or block "no-such-thing"/)
  } finally {
    cleanup(dir)
  }
})
