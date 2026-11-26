import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { build, modelProps } from '../../scripts/build-catalog.mjs'
import { exportTarget } from '../../scripts/lib/exports.mjs'

const exportsMap = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf-8')
).exports

test('modelProps reads every defineModel of a root, named and default', () => {
  const menu = modelProps(exportTarget(exportsMap['./sidebar-menu']))
  assert.deepEqual(
    menu.map((m) => [m.name, m.type]),
    [
      ['path', 'string[]'],
      ['openKeys', 'string[]']
    ]
  )
  assert.match(menu[0].doc, /v-model:path/)

  const section = modelProps(exportTarget(exportsMap['./settings-group']))
  assert.deepEqual(section, [
    {
      name: 'open',
      type: 'boolean',
      default: 'false',
      required: 'false',
      doc: 'Two-way value (`v-model:open`).'
    }
  ])

  const command = modelProps(exportTarget(exportsMap['./command']))
  assert.equal(command.find((m) => m.name === 'open')?.default, 'undefined')
})

test('the catalog lists v-model values as props, so ui view shows them', async () => {
  const { imports } = await build()
  const find = (name) => imports[name]
  for (const [name, model] of [
    ['sidebar-menu', 'path'],
    ['sidebar-menu', 'openKeys'],
    ['settings-group', 'open'],
    ['sidebar', 'open'],
    ['tree', 'selectedKey'],
    ['tree', 'selectedKeys']
  ]) {
    const entry = find(name)
    assert.ok(entry, `${name} is in the catalog`)
    assert.ok(
      entry.props.some((prop) => prop.name === model),
      `${name} lists ${model} among its props`
    )
  }
})
