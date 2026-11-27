import test from 'node:test'
import { RuleTester } from 'eslint'
import * as vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

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

const MENU = "import SidebarMenu from '@aziontech/ui/sidebar-menu'"
const PAGE_TABS = "import PageTabs from '@aziontech/ui/page-tabs'"
const PAGE_HEADER = "import PageHeader from '@aziontech/ui/page-header'"

test('no-page-navigation-menu', () => {
  vue.run('no-page-navigation-menu', rule, {
    valid: [
      { code: sfc(MENU), filename: 'src/components/AppSidebar.vue' },
      { code: sfc(PAGE_TABS), filename: 'src/views/PolicyView.vue' },
      {
        code: sfc(
          `${MENU}\n${PAGE_HEADER}\nimport Sidebar from '@aziontech/ui/sidebar'`,
          '<div><Sidebar><SidebarMenu><SidebarMenu.Item label="Home" /></SidebarMenu></Sidebar><PageHeader /></div>'
        ),
        filename: 'examples/app-layout/default.vue'
      },
      {
        code: sfc(
          `import SidebarMenuRoot from '@aziontech/ui/sidebar-menu-root'\nimport ConsoleLayout from '@aziontech/ui/console-layout'`,
          '<console-layout><template #rail><sidebar-menu-root /></template></console-layout>'
        ),
        filename: 'src/views/ShellView.vue'
      },
      { code: sfc(MENU, '<div />'), filename: 'src/views/Unused.vue' },
      {
        code: sfc("import SidebarMenu from '@aziontech/ui/sidebar-menu-button-like'"),
        filename: 'src/views/a.vue'
      },
      { code: sfc("import SidebarMenu from 'other/menu'"), filename: 'src/views/a.vue' }
    ],
    invalid: [
      {
        code: sfc(
          `${MENU}\n${PAGE_HEADER}\nimport Sidebar from '@aziontech/ui/sidebar'`,
          '<div><Sidebar /><PageHeader /><SidebarMenu><SidebarMenu.Item label="Rules" /></SidebarMenu></div>'
        ),
        filename: 'src/components/PolicyBody.vue',
        errors: [{ messageId: 'pageMenu', data: { source: '@aziontech/ui/sidebar-menu' }, line: 6 }]
      },
      {
        code: sfc(MENU, '<SidebarMenu />'),
        filename: 'src/views/PolicyView.vue',
        errors: [{ messageId: 'pageMenu', data: { source: '@aziontech/ui/sidebar-menu' } }]
      },
      {
        code: sfc(
          "import SidebarMenuRoot from '@aziontech/ui/sidebar-menu-root'",
          '<sidebar-menu-root />'
        ),
        filename: 'src/pages/policy/[id].vue',
        errors: [{ messageId: 'pageMenu' }]
      },
      {
        code: sfc(
          `${PAGE_TABS}\nimport SidebarMenuItem from '@aziontech/ui/sidebar-menu-item'\n${MENU}`,
          '<div><SidebarMenuItem label="Rules" /></div>'
        ),
        filename: 'src/components/PolicyBody.vue',
        errors: [{ messageId: 'pageMenu', data: { source: '@aziontech/ui/sidebar-menu-item' } }]
      },
      {
        code: sfc(`${MENU}\n${PAGE_HEADER}`, '<SidebarMenu />'),
        filename: 'src/components/PolicyBody.vue',
        errors: [{ messageId: 'pageMenu' }]
      },
      {
        code: sfc(`${MENU}\n${PAGE_TABS}`, '<div><PageTabs /><SidebarMenu /></div>'),
        filename: 'packages/ui/blocks/detail/detail-resource/detail-resource.vue',
        errors: [{ messageId: 'pageMenu' }]
      },
      {
        code: sfc(`/* azion-ui-local-navigation */\n${MENU}`, '<SidebarMenu />'),
        filename: 'C:\\app\\src\\views\\PolicyView.vue',
        errors: [{ messageId: 'pageMenu' }]
      },
      {
        code: sfc(MENU, '<!-- azion-ui-local-navigation --><SidebarMenu />'),
        filename: 'src/pages/policy.vue',
        errors: [{ messageId: 'pageMenu' }]
      }
    ]
  })

  js.run('no-page-navigation-menu', rule, {
    valid: [{ code: MENU, filename: 'src/router/navigation.ts' }],
    invalid: [
      {
        code: `${PAGE_HEADER}\nimport SidebarMenuGroup from '@aziontech/ui/sidebar-menu-group'`,
        filename: 'src/components/body.js',
        errors: [{ messageId: 'pageMenu' }]
      }
    ]
  })
})
