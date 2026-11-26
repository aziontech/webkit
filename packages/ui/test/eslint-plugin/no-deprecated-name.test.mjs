import test from 'node:test'
import { RuleTester } from 'eslint'
import * as vueParser from 'vue-eslint-parser'

const rule = (await import('../../src/eslint-plugin/rules/no-deprecated-name.js')).default
const { loadPackageMap } = await import('../../src/cli/migrate-package.js')
const OLD_PACKAGE = Object.keys(loadPackageMap().packages).find(
  (name) => loadPackageMap().packages[name] === '@aziontech/ui'
)

const vue = new RuleTester({
  languageOptions: { parser: vueParser, ecmaVersion: 2022, sourceType: 'module' }
})

const sfc = (script, template = '') => ({
  code: `<script setup>\n${script}\n</script>\n<template>${template}</template>`,
  filename: 'a.vue'
})
const bad = (script, template, ...messageIds) => ({
  ...sfc(script, template),
  errors: messageIds.map((messageId) => ({ messageId }))
})

test('no-deprecated-name', () => {
  vue.run('no-deprecated-name', rule, {
    valid: [
      sfc("import Pagination from '@aziontech/ui/pagination'", '<Pagination />'),
      sfc("import Alert from '@aziontech/ui/alert'", '<Alert severity="danger" />'),
      sfc(
        "import SeverityTag from '@aziontech/ui/severity-tag'",
        '<SeverityTag severity="high" />'
      ),
      sfc('', '<i class="az az-search" />'),
      sfc('', '<i class="az az-x" />'),
      sfc("import Tag from '@aziontech/ui/tag'", '<Other level="x" /><Tag severity="neutral" />')
    ],
    invalid: [
      bad("import Paginator from '@aziontech/ui/paginator'", '', 'component'),
      bad(
        "import SeverityTag from '@aziontech/ui/severity-tag'",
        '<SeverityTag level="high" />',
        'prop'
      ),
      bad(
        "import SeverityTag from '@aziontech/ui/severity-tag'",
        '<severity-tag :level="x" />',
        'prop'
      ),
      bad("import Alert from '@aziontech/ui/alert'", '<Alert severity="error" />', 'value'),
      bad("import Link from '@aziontech/ui/link'", '<Link show-icon />', 'propRemoved'),
      bad('', '<i class="pi pi-search" />', 'icon'),
      bad('', '<i class="pi pi-amazon" />', 'iconRemoved'),
      bad('', '<i class="ai ai-times" />', 'icon'),
      bad('', '<i class="ai ai-home" />', 'icon'),
      bad('', '<i class="ai-color ai-react" />', 'icon'),
      bad("const icon = 'pi pi-check'", '', 'icon'),
      bad(`import Button from '${OLD_PACKAGE}/button'`, '', 'package'),
      bad(`import { azionUi } from '${OLD_PACKAGE}/vite-plugin'`, '', 'package')
    ]
  })
})
