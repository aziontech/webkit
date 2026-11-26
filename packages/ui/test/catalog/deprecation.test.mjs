import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { loadCatalogFrom } from '../../src/catalog/catalog.js'
import { getComponent, listComponents, searchComponents } from '../../src/catalog/queries.js'

const dir = mkdtempSync(join(tmpdir(), 'webkit-catalog-deprecation-'))
const file = join(dir, 'catalog.json')
writeFileSync(
  file,
  JSON.stringify({
    package: '@aziontech/webkit',
    imports: {
      'old-panel': {
        kind: 'component',
        category: 'layout',
        import: "import OldPanel from '@aziontech/webkit/old-panel'",
        deprecated: true,
        deprecation: 'Use Panel.',
        replacedBy: 'panel'
      },
      'old-panel-header': {
        kind: 'subcomponent',
        parent: 'old-panel',
        attached: false,
        import: "import OldPanelHeader from '@aziontech/webkit/old-panel-header'",
        deprecated: true
      },
      panel: {
        kind: 'component',
        category: 'layout',
        import: "import Panel from '@aziontech/webkit/panel'"
      }
    }
  })
)
const catalog = loadCatalogFrom(file)

test('get_component returns the deprecation of a part, with its note and replacement', () => {
  const result = getComponent(catalog, 'old-panel')
  assert.equal(result.deprecated, true)
  assert.equal(result.deprecation, 'Use Panel.')
  assert.equal(result.replacedBy, 'panel')
})

test('get_component returns deprecated for a sub-component part', () => {
  assert.equal(getComponent(catalog, 'old-panel-header').deprecated, true)
})

test('a current part carries no deprecation keys', () => {
  const result = getComponent(catalog, 'panel')
  assert.equal('deprecated' in result, false)
  assert.equal('replacedBy' in result, false)
})

test('search and list results flag a deprecated part', () => {
  const match = searchComponents(catalog, 'old panel').matches.find((m) => m.name === 'old-panel')
  assert.equal(match?.deprecated, true)
  assert.equal(match?.replacedBy, 'panel')
  const listed = listComponents(catalog).components.find((c) => c.name === 'old-panel')
  assert.equal(listed?.deprecated, true)
})
