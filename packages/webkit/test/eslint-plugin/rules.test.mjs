import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { RuleTester } from 'eslint'
import * as vueParser from 'vue-eslint-parser'

// Point every rule's catalog loader at the fixture (version-locked, deterministic).
process.env.WEBKIT_CATALOG_PATH = fileURLToPath(new URL('./fixtures/catalog.json', import.meta.url))

const { _resetCatalogCache } = await import('../../src/eslint-plugin/catalog.js')
const validImportPath = (await import('../../src/eslint-plugin/rules/valid-import-path.js')).default
const noDeepInternalImport = (await import('../../src/eslint-plugin/rules/no-deep-internal-import.js')).default
const noBarrelImport = (await import('../../src/eslint-plugin/rules/no-barrel-import.js')).default
const noWholeIconSetImport = (await import('../../src/eslint-plugin/rules/no-whole-icon-set-import.js')).default
const noHardcodedColor = (await import('../../src/eslint-plugin/rules/no-hardcoded-color.js')).default
const preferTreeShakeableRoot = (await import('../../src/eslint-plugin/rules/prefer-tree-shakeable-root.js')).default

const js = new RuleTester({ languageOptions: { ecmaVersion: 2022, sourceType: 'module' } })
const vue = new RuleTester({
  languageOptions: { parser: vueParser, ecmaVersion: 2022, sourceType: 'module' }
})

test('valid-import-path', () => {
  js.run('valid-import-path', validImportPath, {
    valid: [
      "import Button from '@aziontech/webkit/button'",
      "import Table from '@aziontech/webkit/table'",
      "import X from 'some-other-lib'",
      // deep / src are deferred to no-deep-internal-import:
      "import X from '@aziontech/webkit/table/internal'",
      "import X from '@aziontech/webkit/src/components/x'"
    ],
    invalid: [
      // exactly one close subpath → autofix rewrites it (fixer emits double quotes)
      {
        code: "import X from '@aziontech/webkit/buton'",
        output: 'import X from "@aziontech/webkit/button"',
        errors: [{ messageId: 'unknown', suggestions: 1 }]
      },
      // two candidates (chip, chips) → ambiguous → suggestions only, NO autofix
      {
        code: "import X from '@aziontech/webkit/chp'",
        output: null,
        errors: [{ messageId: 'unknown', suggestions: 2 }]
      }
    ]
  })
})

test('no-deep-internal-import', () => {
  js.run('no-deep-internal-import', noDeepInternalImport, {
    valid: [
      "import Button from '@aziontech/webkit/button'",
      // unknown-but-not-deep is valid-import-path's job:
      "import X from '@aziontech/webkit/buton'"
    ],
    invalid: [
      // /src/ deep import: reported, no published ancestor → no autofix
      { code: "import X from '@aziontech/webkit/src/components/x'", output: null, errors: [{ messageId: 'deep' }] },
      // deeper-than-published: nearest published ancestor is a single value → autofix
      {
        code: "import X from '@aziontech/webkit/table/internal'",
        output: 'import X from "@aziontech/webkit/table"',
        errors: [{ messageId: 'deep', suggestions: 1 }]
      }
    ]
  })
})

test('no-barrel-import', () => {
  js.run('no-barrel-import', noBarrelImport, {
    valid: [
      "import Button from '@aziontech/webkit/button'",
      "import Table from '@aziontech/webkit/table'"
    ],
    invalid: [
      { code: "import { Button } from '@aziontech/webkit'", errors: [{ messageId: 'barrel', suggestions: 1 }] },
      { code: "import { Button, Chip } from '@aziontech/webkit'", errors: [{ messageId: 'barrel', suggestions: 1 }] },
      // the guessed subpath (nonexistent) is not a published export → barrel still
      // reported, but NO split suggestion is offered (would emit an invalid import)
      { code: "import { Nonexistent } from '@aziontech/webkit'", errors: [{ messageId: 'barrel', suggestions: 0 }] },
      { code: "import * as WK from '@aziontech/webkit'", errors: [{ messageId: 'namespace' }] },
      // the dev channel is a bare barrel too
      { code: "import { Button } from '@aziontech/webkit.dev'", errors: [{ messageId: 'barrel', suggestions: 1 }] },
      // export-from re-exports, and dynamic import(), are barrels as well
      { code: "export { Button } from '@aziontech/webkit'", errors: [{ messageId: 'barrel' }] },
      { code: "export * from '@aziontech/webkit'", errors: [{ messageId: 'namespace' }] },
      { code: "const p = import('@aziontech/webkit')", errors: [{ messageId: 'namespace' }] }
    ]
  })
})

test('no-whole-icon-set-import', () => {
  js.run('no-whole-icon-set-import', noWholeIconSetImport, {
    valid: [
      // The correct usage of the icon font: a side-effect import (no binding).
      "import '@aziontech/icons'",
      { code: "import Icons from '@aziontech/icons'", options: [{ allowedFiles: ['icon-registry'] }], filename: 'src/icon-registry.js' }
    ],
    invalid: [
      { code: "import Icons from '@aziontech/icons'", errors: [{ messageId: 'wholeSet' }] },
      { code: "import * as Icons from '@aziontech/icons'", errors: [{ messageId: 'wholeSet' }] }
    ]
  })
})

test('no-hardcoded-color (script + template)', () => {
  js.run('no-hardcoded-color', noHardcodedColor, {
    valid: [
      "const c = 'var(--primary)'",
      "const c = 'text-body-sm'",
      // short 3-4 digit hex outside a style string is an id/anchor/route, not a color
      "const anchor = '#dad'",
      "const route = '#face'",
      "const hash = '#bad'"
    ],
    invalid: [
      { code: "const c = '#ff0000'", errors: [{ messageId: 'token' }] },
      { code: "const c = 'text-gray-500'", errors: [{ messageId: 'token' }] },
      // short hex IS a color when the string looks like a style value
      { code: "const c = 'color:#fff'", errors: [{ messageId: 'token' }] }
    ]
  })
  vue.run('no-hardcoded-color', noHardcodedColor, {
    valid: [
      { code: '<template><div class="text-body-sm">x</div></template>', filename: 'a.vue' },
      // anchor href that happens to be valid hex must not be flagged
      { code: '<template><a href="#dad">x</a></template>', filename: 'anchor.vue' }
    ],
    invalid: [
      { code: '<template><div class="text-[#fff]">x</div></template>', filename: 'a.vue', errors: [{ messageId: 'token' }] },
      { code: '<template><div class="text-red-500">x</div></template>', filename: 'b.vue', errors: [{ messageId: 'token' }] }
    ]
  })
})

test('resolves the .dev channel package name from the catalog', () => {
  const prev = process.env.WEBKIT_CATALOG_PATH
  process.env.WEBKIT_CATALOG_PATH = fileURLToPath(new URL('./fixtures/catalog.dev.json', import.meta.url))
  _resetCatalogCache()
  try {
    js.run('valid-import-path (dev channel)', validImportPath, {
      valid: ["import Button from '@aziontech/webkit.dev/button'"],
      invalid: [
        {
          code: "import X from '@aziontech/webkit.dev/buton'",
          output: 'import X from "@aziontech/webkit.dev/button"',
          errors: [{ messageId: 'unknown', suggestions: 1 }]
        }
      ]
    })
  } finally {
    process.env.WEBKIT_CATALOG_PATH = prev
    _resetCatalogCache()
  }
})

test('prefer-tree-shakeable-root', () => {
  vue.run('prefer-tree-shakeable-root', preferTreeShakeableRoot, {
    valid: [
      // dot-notation → compound genuinely needed
      { code: "<script setup>import Table from '@aziontech/webkit/table'</script><template><Table><Table.Row/></Table></template>", filename: 'a.vue' },
      // already tree-shakeable root
      { code: "<script setup>import TableRoot from '@aziontech/webkit/table-root'</script><template><TableRoot/></template>", filename: 'b.vue' },
      // non-compound component
      { code: "<script setup>import Button from '@aziontech/webkit/button'</script><template><Button/></template>", filename: 'c.vue' }
    ],
    invalid: [
      {
        code: "<script setup>import Table from '@aziontech/webkit/table'</script><template><Table/></template>",
        filename: 'd.vue',
        errors: [{ messageId: 'preferRoot', suggestions: 1 }]
      }
    ]
  })
})
