import test from 'node:test'
import { RuleTester } from 'eslint'
import * as vueParser from 'vue-eslint-parser'

const preferValueControl = (await import('../../src/eslint-plugin/rules/prefer-value-control.js'))
  .default

const vue = new RuleTester({
  languageOptions: { parser: vueParser, ecmaVersion: 2022, sourceType: 'module' }
})

const sfc = (body) => ({ code: `<template>${body}</template>`, filename: 'a.vue' })
const flagged = (body, messageId) => ({ ...sfc(body), errors: [{ messageId }] })

test('prefer-value-control', () => {
  vue.run('prefer-value-control', preferValueControl, {
    valid: [
      sfc('<Input v-model="form.name" name="name" />'),
      sfc('<Input v-model="form.email" type="email" placeholder="m@example.com" />'),
      sfc('<Input v-model="card.expiry" placeholder="MM / YY" autocomplete="cc-exp" />'),
      sfc('<Input v-model="form.domain" placeholder="example.com" />'),
      sfc('<Input v-model="form.version" placeholder="1.2.3" />'),
      sfc('<Input :type="kind" v-model="value" />'),
      sfc('<NumberInput v-model="form.ttl" :min="0" />'),
      sfc('<DatePicker v-model="form.expiresAt" show-time />'),
      sfc('<Pagination.Button type="number">2</Pagination.Button>'),
      sfc('<input type="number" />')
    ],
    invalid: [
      flagged('<Input v-model="form.ttl" type="number" />', 'number'),
      flagged('<InputGroup.Input v-model="form.amount" type="number" />', 'number'),
      flagged('<Input v-model="form.due" type="date" />', 'date'),
      flagged('<Input v-model="form.at" type="datetime-local" />', 'dateTime'),
      flagged('<Input v-model="form.phone" type="tel" />', 'phone'),
      flagged('<Input v-model="form.secret" type="password" />', 'secret'),
      flagged('<Input v-model="form.due" placeholder="YYYY-MM-DD" />', 'date'),
      flagged('<Input v-model="form.due" placeholder="2026-12-31" />', 'date'),
      flagged('<Input v-model="form.at" placeholder="2026-12-31T00:00:00Z" />', 'dateTime'),
      flagged('<Input v-model="form.at" placeholder="ISO 8601" />', 'dateTime'),
      flagged('<Input v-model="form.at" placeholder="HH:mm" />', 'dateTime')
    ]
  })
})
