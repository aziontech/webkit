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
      sfc('<IconButton icon="az az-trash" aria-label="Delete domain" />'),
      sfc('<IconButton icon="az az-eye" :aria-label="label" />'),
      sfc('<IconButton icon="az az-eye" v-bind:aria-label="label" />'),
      sfc('<IconButton icon="az az-x" ariaLabel="Close" />'),
      sfc('<IconButton icon="az az-x" :ariaLabel="label" />'),
      sfc('<icon-button icon="az az-x" aria-label="Close" />'),
      sfc('<IconButton icon="az az-x" aria-labelledby="panel-title" />'),
      sfc('<IconButton icon="az az-x" :aria-labelledby="titleId" />'),
      sfc('<IconButton v-bind="closeButton" />'),
      sfc('<ButtonGroup aria-label="Text alignment"><Button label="Left" /></ButtonGroup>'),
      sfc('<Button icon="az az-plus" label="Add" />'),
      sfc('<button type="button">Plain</button>')
    ],
    invalid: [
      missing('<IconButton icon="az az-trash" />'),
      missing('<IconButton icon="az az-trash" aria-label="" />'),
      missing('<icon-button icon="az az-trash" kind="transparent" />'),
      missing('<IconButton icon="az az-trash" :title="label" />'),
      missing('<ButtonGroup><Button label="Left" /></ButtonGroup>', 'ButtonGroup')
    ]
  })
})
