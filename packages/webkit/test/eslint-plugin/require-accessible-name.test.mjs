import test from 'node:test'
import { RuleTester } from 'eslint'
import * as vueParser from 'vue-eslint-parser'

const requireAccessibleName = (
  await import('../../src/eslint-plugin/rules/require-accessible-name.js')
).default

const vue = new RuleTester({
  languageOptions: { parser: vueParser, ecmaVersion: 2022, sourceType: 'module' }
})

const sfc = (body) => ({ code: `<template>${body}</template>`, filename: 'a.vue' })
const missing = (body, component = 'IconButton') => ({
  ...sfc(body),
  errors: [{ messageId: 'missing', data: { component } }]
})

test('require-accessible-name', () => {
  vue.run('require-accessible-name', requireAccessibleName, {
    valid: [
      sfc('<IconButton icon="ai ai-trash" aria-label="Delete domain" />'),
      sfc('<IconButton icon="ai ai-eye" :aria-label="label" />'),
      sfc('<IconButton icon="ai ai-eye" v-bind:aria-label="label" />'),
      sfc('<IconButton icon="ai ai-times" ariaLabel="Close" />'),
      sfc('<IconButton icon="ai ai-times" :ariaLabel="label" />'),
      sfc('<icon-button icon="ai ai-times" aria-label="Close" />'),
      sfc('<IconButton icon="ai ai-times" aria-labelledby="panel-title" />'),
      sfc('<IconButton icon="ai ai-times" :aria-labelledby="titleId" />'),
      sfc('<IconButton v-bind="closeButton" />'),
      sfc('<ButtonGroup aria-label="Text alignment"><Button label="Left" /></ButtonGroup>'),
      sfc('<Button icon="ai ai-plus" label="Add" />'),
      sfc('<button type="button">Plain</button>')
    ],
    invalid: [
      missing('<IconButton icon="ai ai-trash" />'),
      missing('<IconButton icon="ai ai-trash" aria-label="" />'),
      missing('<icon-button icon="ai ai-trash" kind="transparent" />'),
      missing('<IconButton icon="ai ai-trash" :title="label" />'),
      missing('<ButtonGroup><Button label="Left" /></ButtonGroup>', 'ButtonGroup')
    ]
  })
})
