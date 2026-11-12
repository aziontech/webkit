import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { build, modelProps } from '../../scripts/build-catalog.mjs'

const exportsMap = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf-8'))
  .exports

test('modelProps reads every defineModel of a root, named and default', () => {
  const menu = modelProps(exportsMap['./menu'])
  assert.deepEqual(
    menu.map((m) => [m.name, m.type]),
    [
      ['path', 'string[]'],
      ['expanded', 'string[]']
    ]
  )
  assert.match(menu[0].doc, /v-model:path/)

  const section = modelProps(exportsMap['./settings-section'])
  assert.deepEqual(section, [
    {
      name: 'open',
      type: 'boolean',
      default: 'false',
      required: 'false',
      doc: 'Two-way value (`v-model:open`).'
    }
  ])
})

test('the catalog lists v-model values as props, so webkit view shows them', async () => {
  const { imports } = await build()
  const find = (name) => imports[name]
  for (const [name, model] of [
    ['menu', 'path'],
    ['menu', 'expanded'],
    ['settings-section', 'open'],
    ['sidebar', 'collapsed'],
    ['tree', 'selected']
  ]) {
    const entry = find(name)
    assert.ok(entry, `${name} is in the catalog`)
    assert.ok(
      entry.props.some((prop) => prop.name === model),
      `${name} lists ${model} among its props`
    )
  }
})
