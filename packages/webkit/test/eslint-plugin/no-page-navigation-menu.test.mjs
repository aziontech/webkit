import assert from 'node:assert/strict'
import test from 'node:test'
import { RuleTester } from 'eslint'
import * as vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

import { findComments } from '../../src/eslint-plugin/lib/comment-scan.js'

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

const MENU = "import SidebarMenu from '@aziontech/webkit/sidebar-menu'"
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
        code: sfc(
          `${MENU}\n${PAGE_HEADER}\nimport Sidebar from '@aziontech/webkit/sidebar'`,
          '<div><Sidebar><SidebarMenu><SidebarMenu.Item label="Home" /></SidebarMenu></Sidebar><PageHeader /></div>'
        ),
        filename: 'examples/app-layout/default.vue'
      },
      {
        code: sfc(
          `import SidebarMenuRoot from '@aziontech/webkit/sidebar-menu-root'\nimport ConsoleLayout from '@aziontech/webkit/console-layout'`,
          '<console-layout><template #rail><sidebar-menu-root /></template></console-layout>'
        ),
        filename: 'src/views/ShellView.vue'
      },
      { code: sfc(MENU, '<div />'), filename: 'src/views/Unused.vue' },
      {
        code: sfc("import SidebarMenu from '@aziontech/webkit/sidebar-menu-button-like'"),
        filename: 'src/views/a.vue'
      },
      { code: sfc("import SidebarMenu from 'other/menu'"), filename: 'src/views/a.vue' }
    ],
    invalid: [
      {
        code: sfc(
          `${MENU}\n${PAGE_HEADER}\nimport Sidebar from '@aziontech/webkit/sidebar'`,
          '<div><Sidebar /><PageHeader /><SidebarMenu><SidebarMenu.Item label="Rules" /></SidebarMenu></div>'
        ),
        filename: 'src/components/PolicyBody.vue',
        errors: [
          { messageId: 'pageMenu', data: { source: '@aziontech/webkit/sidebar-menu' }, line: 6 }
        ]
      },
      {
        code: sfc(MENU, '<SidebarMenu />'),
        filename: 'src/views/PolicyView.vue',
        errors: [{ messageId: 'pageMenu', data: { source: '@aziontech/webkit/sidebar-menu' } }]
      },
      {
        code: sfc(
          "import SidebarMenuRoot from '@aziontech/webkit/sidebar-menu-root'",
          '<sidebar-menu-root />'
        ),
        filename: 'src/pages/policy/[id].vue',
        errors: [{ messageId: 'pageMenu' }]
      },
      {
        code: sfc(
          `${PAGE_TABS}\nimport SidebarMenuItem from '@aziontech/webkit/sidebar-menu-item'\n${MENU}`,
          '<div><SidebarMenuItem label="Rules" /></div>'
        ),
        filename: 'src/components/PolicyBody.vue',
        errors: [{ messageId: 'pageMenu', data: { source: '@aziontech/webkit/sidebar-menu-item' } }]
      },
      {
        code: sfc(`${MENU}\n${PAGE_HEADER}`, '<SidebarMenu />'),
        filename: 'src/components/PolicyBody.vue',
        errors: [{ messageId: 'pageMenu' }]
      },
      {
        code: sfc(`// webkit-local-navigation\n${MENU}`, '<SidebarMenu />'),
        filename: 'C:\\app\\src\\views\\PolicyView.vue',
        errors: [{ messageId: 'pageMenu' }]
      }
    ]
  })

  js.run('no-page-navigation-menu', rule, {
    valid: [{ code: MENU, filename: 'src/router/navigation.ts' }],
    invalid: [
      {
        code: `${PAGE_HEADER}\nimport SidebarMenuGroup from '@aziontech/webkit/sidebar-menu-group'`,
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
