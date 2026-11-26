import test from 'node:test'
import { RuleTester } from 'eslint'
import * as vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

const rule = (await import('../../src/eslint-plugin/rules/consistent-header-action-size.js'))
  .default

const vue = new RuleTester({
  languageOptions: {
    parser: vueParser,
    parserOptions: { parser: tsParser },
    ecmaVersion: 2022,
    sourceType: 'module'
  }
})

const IMPORTS = [
  "import PageHeader from '@aziontech/webkit/page-header'",
  "import Button from '@aziontech/webkit/button'",
  "import IconButton from '@aziontech/webkit/icon-button'"
].join('\n')

const sfc = (actions, header = 'PageHeader') =>
  `<script setup lang="ts">\n${IMPORTS}\n</script>\n<template><${header} title="Resources"><template #actions>${actions}</template></${header}></template>\n`

test('consistent-header-action-size', () => {
  vue.run('consistent-header-action-size', rule, {
    valid: [
      {
        code: sfc(
          '<Button label="Documentation" variant="outline" size="medium" /><Button label="Create Resource" variant="primary" size="medium" />'
        )
      },
      { code: sfc('<IconButton icon="az az-refresh" aria-label="Refresh" size="medium" />') },
      { code: sfc('<Button label="Create" :size="size" />') },
      {
        code: `<script setup lang="ts">\n${IMPORTS}\n</script>\n<template><div><Button label="Save" size="large" /><PageHeader title="Resources" /></div></template>\n`
      },
      {
        code: `<script setup lang="ts">\nimport Button from '@aziontech/webkit/button'\n</script>\n<template><Card><template #actions><Button label="Save" size="large" /></template></Card></template>\n`
      }
    ],
    invalid: [
      {
        code: sfc(
          '<Button label="Documentation" variant="outline" size="medium" /><Button label="Create Resource" variant="primary" size="large" />'
        ),
        errors: [{ messageId: 'size' }]
      },
      {
        code: sfc('<Button label="Create Resource" variant="primary" />'),
        errors: [{ messageId: 'size' }]
      },
      {
        code: sfc(
          '<div class="flex"><icon-button icon="az az-refresh" aria-label="Refresh" size="small" /></div>',
          'page-header'
        ),
        errors: [{ messageId: 'size' }]
      }
    ]
  })
})
