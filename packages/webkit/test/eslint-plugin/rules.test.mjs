import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { RuleTester } from 'eslint'
import * as vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

// Point every rule's catalog loader at the fixture (version-locked, deterministic).
process.env.WEBKIT_CATALOG_PATH = fileURLToPath(new URL('./fixtures/catalog.json', import.meta.url))

const validImportPath = (await import('../../src/eslint-plugin/rules/valid-import-path.js')).default
const noDeepInternalImport = (
  await import('../../src/eslint-plugin/rules/no-deep-internal-import.js')
).default
const noBarrelImport = (await import('../../src/eslint-plugin/rules/no-barrel-import.js')).default
const noWholeIconSetImport = (
  await import('../../src/eslint-plugin/rules/no-whole-icon-set-import.js')
).default
const noHardcodedColor = (await import('../../src/eslint-plugin/rules/no-hardcoded-color.js'))
  .default
const preferTreeShakeableRoot = (
  await import('../../src/eslint-plugin/rules/prefer-tree-shakeable-root.js')
).default
const noDeprecatedComponent = (
  await import('../../src/eslint-plugin/rules/no-deprecated-component.js')
).default
const preferWebkitComponent = (
  await import('../../src/eslint-plugin/rules/prefer-webkit-component.js')
).default
const noStyleOverride = (await import('../../src/eslint-plugin/rules/no-style-override.js')).default
const preferDefineModel = (await import('../../src/eslint-plugin/rules/prefer-define-model.js'))
  .default
const authoringStandards = (await import('../../src/eslint-plugin/rules/authoring-standards.js'))
  .default

const js = new RuleTester({ languageOptions: { ecmaVersion: 2022, sourceType: 'module' } })
const vue = new RuleTester({
  languageOptions: { parser: vueParser, ecmaVersion: 2022, sourceType: 'module' }
})
// SFC + TypeScript <script setup lang="ts"> — mirrors eslint.config.js (vue parser nesting the TS parser).
const vueTs = new RuleTester({
  languageOptions: {
    parser: vueParser,
    parserOptions: { parser: tsParser },
    ecmaVersion: 2022,
    sourceType: 'module'
  }
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
      {
        code: "import X from '@aziontech/webkit/src/components/x'",
        output: null,
        errors: [{ messageId: 'deep' }]
      },
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
      {
        code: "import { Button } from '@aziontech/webkit'",
        errors: [{ messageId: 'barrel', suggestions: 1 }]
      },
      {
        code: "import { Button, Chip } from '@aziontech/webkit'",
        errors: [{ messageId: 'barrel', suggestions: 1 }]
      },
      // the guessed subpath (nonexistent) is not a published export → barrel still
      // reported, but NO split suggestion is offered (would emit an invalid import)
      {
        code: "import { Nonexistent } from '@aziontech/webkit'",
        errors: [{ messageId: 'barrel', suggestions: 0 }]
      },
      { code: "import * as WK from '@aziontech/webkit'", errors: [{ messageId: 'namespace' }] },
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
      {
        code: "import Icons from '@aziontech/icons'",
        options: [{ allowedFiles: ['icon-registry'] }],
        filename: 'src/icon-registry.js'
      }
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
      {
        code: '<template><div class="text-[#fff]">x</div></template>',
        filename: 'a.vue',
        errors: [{ messageId: 'token' }]
      },
      {
        code: '<template><div class="text-red-500">x</div></template>',
        filename: 'b.vue',
        errors: [{ messageId: 'token' }]
      }
    ]
  })
})

test('prefer-tree-shakeable-root', () => {
  vue.run('prefer-tree-shakeable-root', preferTreeShakeableRoot, {
    valid: [
      // dot-notation → compound genuinely needed
      {
        code: "<script setup>import Table from '@aziontech/webkit/table'</script><template><Table><Table.Row/></Table></template>",
        filename: 'a.vue'
      },
      // already tree-shakeable root
      {
        code: "<script setup>import TableRoot from '@aziontech/webkit/table-root'</script><template><TableRoot/></template>",
        filename: 'b.vue'
      },
      // non-compound component
      {
        code: "<script setup>import Button from '@aziontech/webkit/button'</script><template><Button/></template>",
        filename: 'c.vue'
      }
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

test('no-deprecated-component', () => {
  js.run('no-deprecated-component', noDeprecatedComponent, {
    valid: [
      "import Chip from '@aziontech/webkit/chip'",
      "import Button from '@aziontech/webkit/button'",
      "import x from 'some-other-lib'"
    ],
    invalid: [
      // `chips` is marked deprecated (replacedBy: chip) in the fixture catalog
      {
        code: "import X from '@aziontech/webkit/chips'",
        errors: [{ messageId: 'deprecated', suggestions: 1 }]
      }
    ]
  })
})

test('prefer-webkit-component', () => {
  js.run('prefer-webkit-component', preferWebkitComponent, {
    valid: ["import Button from '@aziontech/webkit/button'", "import _ from 'lodash'"],
    invalid: [
      { code: "import { Button } from 'primevue/button'", errors: [{ messageId: 'prefer' }] },
      { code: "import PrimeVue from 'primevue'", errors: [{ messageId: 'prefer' }] }
    ]
  })
})

test('no-style-override', () => {
  const imp = (n, s) => `<script setup>import ${n} from '@aziontech/webkit/${s}'</script>`
  vue.run('no-style-override', noStyleOverride, {
    valid: [
      // no class/style on the webkit tag
      {
        code: `${imp('Button', 'button')}<template><Button kind="primary">Save</Button></template>`,
        filename: 'a.vue'
      },
      // class on a NON-webkit element is fine (consumer's own markup)
      {
        code: `${imp('Button', 'button')}<template><div class="p-4"><Button /></div></template>`,
        filename: 'b.vue'
      },
      // styleSeam component (card-box) is exempt
      {
        code: `${imp('CardBox', 'card-box')}<template><CardBox class="bg-[var(--bg-canvas)]" /></template>`,
        filename: 'c.vue'
      },
      // allow-listed via options (binding name)
      {
        code: `${imp('Button', 'button')}<template><Button class="x" /></template>`,
        filename: 'd.vue',
        options: [{ allow: ['Button'] }]
      },
      // checkStyle:false lets inline style through
      {
        code: `${imp('Button', 'button')}<template><Button style="color:red" /></template>`,
        filename: 'e.vue',
        options: [{ checkStyle: false }]
      }
    ],
    invalid: [
      {
        code: `${imp('Button', 'button')}<template><Button class="p-8">x</Button></template>`,
        filename: 'f.vue',
        errors: [{ messageId: 'override' }]
      },
      {
        code: `${imp('Button', 'button')}<template><Button :class="cls" /></template>`,
        filename: 'g.vue',
        errors: [{ messageId: 'override' }]
      },
      {
        code: `${imp('Button', 'button')}<template><Button style="color:red" /></template>`,
        filename: 'h.vue',
        errors: [{ messageId: 'override' }]
      },
      // dot-notation sub-component of an imported compound
      {
        code: `${imp('Table', 'table')}<template><Table><Table.Row class="x" /></Table></template>`,
        filename: 'i.vue',
        errors: [{ messageId: 'override' }]
      }
    ]
  })
})

test('prefer-define-model', () => {
  const sfc = (script) => `<script setup lang="ts">${script}</script><template><div /></template>`
  vueTs.run('prefer-define-model', preferDefineModel, {
    valid: [
      // already using defineModel — the target pattern
      { code: sfc('const model = defineModel<string>()'), filename: 'a.vue' },
      // modelValue prop but a one-way `change` emit (not update:modelValue) → not the anti-pattern
      {
        code: sfc(
          'interface Props { modelValue?: string } defineProps<Props>(); defineEmits<{ change: [v: string] }>()'
        ),
        filename: 'b.vue'
      },
      // update:modelValue emit but no modelValue prop declared → not the anti-pattern
      {
        code: sfc(
          "defineProps<{ label?: string }>(); defineEmits<{ 'update:modelValue': [v: string] }>()"
        ),
        filename: 'c.vue'
      },
      // no defineEmits at all
      { code: sfc('defineProps<{ modelValue?: string }>()'), filename: 'd.vue' }
    ],
    invalid: [
      // the real-world shape: referenced interface + withDefaults + typed emits
      {
        code: sfc(
          "interface Props { modelValue?: boolean } withDefaults(defineProps<Props>(), { modelValue: false }); defineEmits<{ 'update:modelValue': [value: boolean] }>()"
        ),
        filename: 'e.vue',
        errors: [{ messageId: 'preferModel' }]
      },
      // inline type literals
      {
        code: sfc(
          "defineProps<{ modelValue?: string }>(); defineEmits<{ 'update:modelValue': [v: string] }>()"
        ),
        filename: 'f.vue',
        errors: [{ messageId: 'preferModel' }]
      },
      // runtime forms (object props + array emits)
      {
        code: sfc(
          "defineProps({ modelValue: { type: Boolean } }); defineEmits(['update:modelValue'])"
        ),
        filename: 'g.vue',
        errors: [{ messageId: 'preferModel' }]
      }
    ]
  })
})

test('authoring-standards (shared engine: hook + ratchet + consumer lint)', () => {
  const sfc = (script, template = '<div />') =>
    `<script setup lang="ts">${script}</script><template>${template}</template>`
  vueTs.run('authoring-standards', authoringStandards, {
    valid: [
      { code: sfc('const model = defineModel<string>()'), filename: 'a.vue' },
      {
        code: sfc('defineSlots<{ default(): unknown }>()', '<div><slot /></div>'),
        filename: 'b.vue'
      }
    ],
    invalid: [
      // hand-rolled v-model
      {
        code: sfc(
          "interface Props { modelValue?: boolean } withDefaults(defineProps<Props>(), { modelValue: false }); defineEmits<{ 'update:modelValue': [v: boolean] }>()"
        ),
        filename: 'c.vue',
        errors: [{ messageId: 'manual-v-model' }]
      },
      // runtime defineProps
      {
        code: sfc('defineProps({ kind: String })'),
        filename: 'd.vue',
        errors: [{ messageId: 'runtime-define-props' }]
      },
      // <slot> without defineSlots
      {
        code: sfc('const a = 1', '<div><slot /></div>'),
        filename: 'e.vue',
        errors: [{ messageId: 'slot-without-defineslots' }]
      }
    ]
  })
  js.run('authoring-standards', authoringStandards, {
    valid: [
      // a well-formed composable in .ts
      {
        code: 'export function useOk() { const v = 1; return { v } }',
        filename: 'src/composables/use-ok.ts'
      },
      // @deprecated naming replacement + removal version
      {
        code: '/** @deprecated since 4.2 — use `kind`. Removed in 5.0 */ export const a = 1',
        filename: 'src/x.js'
      }
    ],
    invalid: [
      // composable returning reactive() AND authored as .js → both blocks fire
      {
        code: 'export function useBad() { return reactive({ v: 1 }) }',
        filename: 'src/composables/use-bad.js',
        errors: [{ messageId: 'composable-return-reactive' }, { messageId: 'composable-js' }]
      },
      // bare @deprecated
      {
        code: '/** @deprecated */ export const a = 1',
        filename: 'src/y.js',
        errors: [{ messageId: 'deprecated-without-replacement' }]
      }
    ]
  })
})
