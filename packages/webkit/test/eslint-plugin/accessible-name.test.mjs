import test from 'node:test'
import { RuleTester } from 'eslint'
import * as vueParser from 'vue-eslint-parser'

const accessibleName = (await import('../../src/eslint-plugin/rules/accessible-name.js')).default

const vue = new RuleTester({
  languageOptions: { parser: vueParser, ecmaVersion: 2022, sourceType: 'module' }
})

const sfc = (body) => ({ code: `<template>${body}</template>`, filename: 'a.vue' })
const missing = (body, component = 'IconButton') => ({
  ...sfc(body),
  errors: [{ messageId: 'missing', data: { component } }]
})

test('accessible-name', () => {
  vue.run('accessible-name', accessibleName, {
    valid: [
      sfc('<IconButton icon="pi pi-trash" aria-label="Delete domain" />'),
      sfc('<IconButton icon="pi pi-eye" :aria-label="label" />'),
      sfc('<IconButton icon="pi pi-eye" v-bind:aria-label="label" />'),
      sfc('<IconButton icon="pi pi-times" ariaLabel="Close" />'),
      sfc('<IconButton icon="pi pi-times" :ariaLabel="label" />'),
      sfc('<icon-button icon="pi pi-times" aria-label="Close" />'),
      sfc('<IconButton icon="pi pi-times" aria-labelledby="panel-title" />'),
      sfc('<IconButton icon="pi pi-times" :aria-labelledby="titleId" />'),
      sfc('<IconButton v-bind="closeButton" />'),
      sfc('<ButtonGroup aria-label="Text alignment"><Button label="Left" /></ButtonGroup>'),
      sfc('<Button icon="pi pi-plus" label="Add" />'),
      sfc('<button type="button">Plain</button>')
    ],
    invalid: [
      missing('<IconButton icon="pi pi-trash" />'),
      missing('<IconButton icon="pi pi-trash" aria-label="" />'),
      missing('<icon-button icon="pi pi-trash" kind="transparent" />'),
      missing('<IconButton icon="pi pi-trash" :title="label" />'),
      missing('<ButtonGroup><Button label="Left" /></ButtonGroup>', 'ButtonGroup')
    ]
  })
})
