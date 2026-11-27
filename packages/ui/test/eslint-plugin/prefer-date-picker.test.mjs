import test from 'node:test'
import { RuleTester } from 'eslint'
import * as vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

const vue = new RuleTester({
  languageOptions: {
    parser: vueParser,
    parserOptions: { parser: tsParser },
    ecmaVersion: 2022,
    sourceType: 'module'
  }
})

const sfc = (template) =>
  `<script setup lang="ts">\nimport { reactive } from 'vue'\nconst form = reactive({})\n</script>\n<template>${template}</template>\n`

const preferDatePicker = (await import('../../src/eslint-plugin/rules/prefer-date-picker.js'))
  .default

test('prefer-date-picker', () => {
  vue.run('prefer-date-picker', preferDatePicker, {
    valid: [
      { code: sfc('<DatePickerRoot v-model="form.expires_at" show-time />') },
      { code: sfc('<DateRangePicker v-model="form.period" />') },
      { code: sfc('<Input v-model="form.name" placeholder="my-application" />') },
      { code: sfc('<Input v-model="form.runtime" />') },
      { code: sfc('<Input v-model="form.timezone" />') },
      { code: sfc('<Input v-model="form.format" />') },
      { code: sfc('<NumberInput v-model="form.timeout" />') },
      { code: sfc('<input type="number" name="retention_time" />') },
      { code: sfc('<Input v-model="form.created_at" readonly />') },
      {
        code: sfc(
          '<Field><Field.Label>Update channel</Field.Label><Input v-model="form.channel" /></Field>'
        )
      },
      {
        code: sfc(
          '<Field><Field.Label>Time zone</Field.Label><Input v-model="form.zone" /></Field>'
        )
      },
      {
        code: sfc(
          '<Field><Field.Label>Expiration date</Field.Label><Input v-model="card.expiry" placeholder="MM / YY" autocomplete="cc-exp" /></Field>'
        )
      },
      // An Input with a native date type or a date format in its placeholder is
      // prefer-value-control's error: one finding per field, not two.
      { code: sfc('<Input v-model="form.expires_at" type="datetime-local" />') },
      { code: sfc('<Input v-model="form.when" placeholder="2026-01-31T00:00:00Z" />') },
      { code: sfc('<InputGroup.Input v-model="form.due_date" placeholder="YYYY-MM-DD" />') }
    ],
    invalid: [
      {
        code: sfc('<Input v-model="form.expires_at" />'),
        errors: [
          { messageId: 'preferDatePicker', data: { tag: 'Input', evidence: "'expires_at'" } }
        ]
      },
      {
        code: sfc('<Input v-model="form.reviewAt" />'),
        errors: [{ messageId: 'preferDatePicker', data: { tag: 'Input', evidence: "'reviewAt'" } }]
      },
      {
        code: sfc('<Input v-model="form.startDate" />'),
        errors: [{ messageId: 'preferDatePicker' }]
      },
      {
        code: sfc('<input name="period_start_time" />'),
        errors: [
          { messageId: 'preferDatePicker', data: { tag: 'input', evidence: "'period_start_time'" } }
        ]
      },
      {
        code: sfc('<Textarea v-model="form.when" placeholder="2026-01-31T00:00:00Z" />'),
        errors: [
          {
            messageId: 'preferDatePicker',
            data: { tag: 'Textarea', evidence: 'placeholder "2026-01-31T00:00:00Z"' }
          }
        ]
      },
      {
        code: sfc('<input v-model="form.when" placeholder="ISO 8601 (UTC)" />'),
        errors: [{ messageId: 'preferDatePicker' }]
      },
      {
        code: sfc('<Input v-model="form.when" :placeholder="\'YYYY-MM-DD\'" />'),
        errors: [{ messageId: 'preferDatePicker' }]
      },
      {
        code: sfc(
          '<Field><Field.Label>Expires at</Field.Label><Input v-model="form.when" /></Field>'
        ),
        errors: [
          { messageId: 'preferDatePicker', data: { tag: 'Input', evidence: 'label "Expires at"' } }
        ]
      },
      {
        code: sfc('<Input v-model="form.when" aria-label="Start date" />'),
        errors: [{ messageId: 'preferDatePicker' }]
      },
      {
        code: sfc('<input type="datetime-local" v-model="form.when" />'),
        errors: [
          {
            messageId: 'preferDatePicker',
            data: { tag: 'input', evidence: 'type="datetime-local"' }
          }
        ]
      },
      {
        code: sfc('<InputGroup><InputGroup.Input v-model="form.effective_at" /></InputGroup>'),
        errors: [
          {
            messageId: 'preferDatePicker',
            data: { tag: 'InputGroup.Input', evidence: "'effective_at'" }
          }
        ]
      }
    ]
  })
})
