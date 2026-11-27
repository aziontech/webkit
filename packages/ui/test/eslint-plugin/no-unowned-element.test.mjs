import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { RuleTester } from 'eslint'
import * as vueParser from 'vue-eslint-parser'

const rule = (await import('../../src/eslint-plugin/rules/no-unowned-element.js')).default
const owners = JSON.parse(
  readFileSync(new URL('../../src/eslint-plugin/owners.json', import.meta.url), 'utf8')
)
const pkg = fileURLToPath(new URL('../../', import.meta.url))

const vue = new RuleTester({
  languageOptions: { parser: vueParser, ecmaVersion: 2022, sourceType: 'module' }
})

const at = (path) => `${pkg}${path}`
const sfc = (body, filename = '/app/src/views/page.vue', options = []) => ({
  code: `<template>${body}</template>`,
  filename,
  options
})
const owned = (body, path) => sfc(body, at(path), [{ owners: true }])
const bad = (body, messageId, count = 1, filename, options) => ({
  ...sfc(body, filename, options),
  errors: Array.from({ length: count }, () => ({ messageId }))
})

test('no-unowned-element: consumer files (no owners)', () => {
  vue.run('no-unowned-element', rule, {
    valid: [
      sfc('<Button label="Save" />'),
      sfc('<IconButton icon="az az-x" aria-label="Close" />'),
      sfc('<p>Read the <a href="/terms" class="text-link">terms</a>.</p>'),
      sfc('<svg><a href="#x"><circle r="2" /></a></svg>'),
      sfc('<Table><Table.Row /></Table>'),
      sfc('<div role="region" class="animate-fade-in" />'),
      sfc('<span class="animate-pulse-settle" />')
    ],
    invalid: [
      bad('<button type="button">Save</button>', 'element'),
      bad('<a href="/docs">Docs</a>', 'element'),
      bad('<input type="text" />', 'element'),
      bad('<table><tr><td>1</td></tr></table>', 'element', 3),
      bad('<hr />', 'element'),
      bad('<kbd>K</kbd>', 'element'),
      bad("<component :is=\"href ? 'a' : 'button'\" />", 'element', 2),
      bad('<div role="dialog" />', 'role'),
      bad("<div :role=\"multi ? 'checkbox' : 'radio'\" />", 'role'),
      bad('<span class="size-2 animate-spin" />', 'className'),
      bad('<span class="data-[live]:animate-pulse" />', 'className'),
      bad('<span :class="[open && \'motion-safe:animate-pulse\']" />', 'className'),
      bad('<button>x</button>', 'element', 1, at('src/components/action/button/button.vue'))
    ]
  })
})

test('no-unowned-element: Azion UI files with owners', () => {
  vue.run('no-unowned-element', rule, {
    valid: [
      owned('<button type="button" />', 'src/components/action/button/button.vue'),
      owned('<button role="tab" />', 'src/components/navigation/tabs/tabs-trigger.vue'),
      owned('<a href="/a">A</a>', 'src/components/navigation/link/link.vue'),
      owned('<svg class="animate-spin" />', 'src/components/feedback/spinner/spinner.vue'),
      owned('<div role="dialog" />', 'src/components/overlay/dialog/dialog-content.vue')
    ],
    invalid: [
      bad('<button type="button" />', 'element', 1, at('src/components/content/card/card.vue'), [
        { owners: true }
      ]),
      bad('<a href="/a">A</a>', 'element', 1, at('blocks/view/view-table/view-table.vue'), [
        { owners: true }
      ]),
      bad('<div role="menu" />', 'role', 1, at('examples/card/default.vue'), [{ owners: true }]),
      bad(
        '<span class="animate-spin" />',
        'className',
        1,
        at('src/components/content/card/card.vue'),
        [{ owners: true }]
      )
    ]
  })
})

test('no-unowned-element: script class constants', () => {
  const ts = new RuleTester({ languageOptions: { ecmaVersion: 2022, sourceType: 'module' } })
  ts.run('no-unowned-element', rule, {
    valid: [{ code: "const C = 'animate-shimmer'", filename: '/app/a.ts' }],
    invalid: [
      {
        code: "const C = 'pointer-events-none animate-spin'",
        filename: '/app/a.ts',
        errors: [{ messageId: 'className' }]
      }
    ]
  })
})

test('owners.json: every owner exists and carries a reason', () => {
  const groups = [owners.elements, owners.roles, owners.classes]
  for (const group of groups) {
    for (const [key, entry] of Object.entries(group)) {
      assert.ok(entry.use, `${key} names the component to use`)
      for (const [path, reason] of Object.entries(entry.owners)) {
        assert.ok(reason.trim().length > 10, `${key} owner ${path} has a reason`)
        assert.ok(existsSync(`${pkg}${path}`), `${key} owner ${path} exists`)
      }
    }
  }
})
