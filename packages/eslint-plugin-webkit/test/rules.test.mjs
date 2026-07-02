import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { RuleTester } from 'eslint'
import * as vueParser from 'vue-eslint-parser'

// Point every rule's catalog loader at the fixture (version-locked, deterministic).
process.env.WEBKIT_CATALOG_PATH = fileURLToPath(new URL('./fixtures/catalog.json', import.meta.url))

const validImportPath = (await import('../src/rules/valid-import-path.js')).default
const noDeepInternalImport = (await import('../src/rules/no-deep-internal-import.js')).default
const noBarrelImport = (await import('../src/rules/no-barrel-import.js')).default
const noWholeIconSetImport = (await import('../src/rules/no-whole-icon-set-import.js')).default
const noHardcodedColor = (await import('../src/rules/no-hardcoded-color.js')).default
const preferTreeShakeableRoot = (await import('../src/rules/prefer-tree-shakeable-root.js')).default

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
      { code: "import X from '@aziontech/webkit/buton'", errors: [{ messageId: 'unknown', suggestions: 1 }] },
      { code: "import X from '@aziontech/webkit/chp'", errors: [{ messageId: 'unknown', suggestions: 2 }] }
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
      { code: "import X from '@aziontech/webkit/src/components/x'", errors: [{ messageId: 'deep' }] },
      { code: "import X from '@aziontech/webkit/table/internal'", errors: [{ messageId: 'deep', suggestions: 1 }] }
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
      { code: "import * as WK from '@aziontech/webkit'", errors: [{ messageId: 'namespace' }] }
    ]
  })
})

test('no-whole-icon-set-import', () => {
  js.run('no-whole-icon-set-import', noWholeIconSetImport, {
    valid: [
      "import Chevron from '@aziontech/icons/chevron'",
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
    valid: ["const c = 'var(--primary)'", "const c = 'text-body-sm'"],
    invalid: [
      { code: "const c = '#ff0000'", errors: [{ messageId: 'token' }] },
      { code: "const c = 'text-gray-500'", errors: [{ messageId: 'token' }] }
    ]
  })
  vue.run('no-hardcoded-color', noHardcodedColor, {
    valid: [{ code: '<template><div class="text-body-sm">x</div></template>', filename: 'a.vue' }],
    invalid: [
      { code: '<template><div class="text-[#fff]">x</div></template>', filename: 'a.vue', errors: [{ messageId: 'token' }] },
      { code: '<template><div class="text-red-500">x</div></template>', filename: 'b.vue', errors: [{ messageId: 'token' }] }
    ]
  })
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
