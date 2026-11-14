import assert from 'node:assert/strict'
import test from 'node:test'
import { RuleTester } from 'eslint'
import * as vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

import { findComments } from '../../src/eslint-plugin/comment-scan.js'

const rule = (await import('../../src/eslint-plugin/rules/no-page-navigation-menu.js')).default

const js = new RuleTester({ languageOptions: { ecmaVersion: 2022, sourceType: 'module' } })
const vue = new RuleTester({
  languageOptions: {
    parser: vueParser,
    parserOptions: { parser: tsParser },
    ecmaVersion: 2022,
    sourceType: 'module'
  }
})

const sfc = (script, template = '<div />') =>
  `<script setup lang="ts">\n${script}\n</script>\n<template>${template}</template>\n`

const MENU = "import Menu from '@aziontech/webkit/menu'"
const PAGE_TABS = "import PageTabs from '@aziontech/webkit/page-tabs'"
const PAGE_HEADER = "import PageHeader from '@aziontech/webkit/page-header'"

test('no-page-navigation-menu', () => {
  vue.run('no-page-navigation-menu', rule, {
    valid: [
      { code: sfc(MENU), filename: 'src/components/AppSidebar.vue' },
      { code: sfc(PAGE_TABS), filename: 'src/views/PolicyView.vue' },
      {
        code: sfc(`${MENU}\n${PAGE_TABS}`),
        filename: 'packages/webkit/blocks/platform/detail/sectioned-resource/sectioned-resource.vue'
      },
      {
        code: sfc(`/* webkit-local-navigation */\n${MENU}`),
        filename: 'src/views/PolicyView.vue'
      },
      {
        code: sfc(MENU, '<!-- webkit-local-navigation --><div />'),
        filename: 'src/pages/policy.vue'
      },
      {
        code: sfc(`${MENU}\n${PAGE_HEADER}\nimport Sidebar from '@aziontech/webkit/sidebar'`),
        filename: 'examples/app-layout/default.vue'
      },
      {
        code: sfc("import Menu from '@aziontech/webkit/menu-button-like'"),
        filename: 'src/views/a.vue'
      },
      { code: sfc("import Menu from 'other/menu'"), filename: 'src/views/a.vue' }
    ],
    invalid: [
      {
        code: sfc(MENU),
        filename: 'src/views/PolicyView.vue',
        errors: [{ messageId: 'pageMenu', data: { source: '@aziontech/webkit/menu' } }]
      },
      {
        code: sfc("import MenuRoot from '@aziontech/webkit/menu-root'"),
        filename: 'src/pages/policy/[id].vue',
        errors: [{ messageId: 'pageMenu' }]
      },
      {
        code: sfc(`${PAGE_TABS}\nimport MenuItem from '@aziontech/webkit/menu-item'\n${MENU}`),
        filename: 'src/components/PolicyBody.vue',
        errors: [{ messageId: 'pageMenu', data: { source: '@aziontech/webkit/menu-item' } }]
      },
      {
        code: sfc(`${MENU}\n${PAGE_HEADER}`),
        filename: 'src/components/PolicyBody.vue',
        errors: [{ messageId: 'pageMenu' }]
      },
      {
        code: sfc(`// webkit-local-navigation\n${MENU}`),
        filename: 'C:\\app\\src\\views\\PolicyView.vue',
        errors: [{ messageId: 'pageMenu' }]
      }
    ]
  })

  js.run('no-page-navigation-menu', rule, {
    valid: [{ code: MENU, filename: 'src/router/navigation.ts' }],
    invalid: [
      {
        code: `${PAGE_HEADER}\nimport MenuGroup from '@aziontech/webkit/menu-group'`,
        filename: 'src/components/body.js',
        errors: [{ messageId: 'pageMenu' }]
      }
    ]
  })
})

test('the webkit-local-navigation marker is a tool directive, not a prose comment', () => {
  const text = sfc(
    `/* webkit-local-navigation */\n${MENU}`,
    '<!-- webkit-local-navigation --><div />'
  )
  const kinds = findComments('src/views/a.vue', text).map((c) => c.kind)
  assert.deepEqual(kinds, ['directive', 'directive'])
  const prose = findComments(
    'src/a.ts',
    '/* webkit-local-navigation is used here */\nconst a = 1\n'
  )
  assert.deepEqual(
    prose.map((c) => c.kind),
    ['prose']
  )
})
