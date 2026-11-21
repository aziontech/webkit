import test from 'node:test'
import { RuleTester } from 'eslint'
import * as vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

const preferDatePicker = (await import('../../src/eslint-plugin/rules/prefer-date-picker.js'))
  .default
const noRawIdInput = (await import('../../src/eslint-plugin/rules/no-raw-id-input.js')).default

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
      }
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
        code: sfc('<Input v-model="form.when" placeholder="2026-01-31T00:00:00Z" />'),
        errors: [
          {
            messageId: 'preferDatePicker',
            data: { tag: 'Input', evidence: 'placeholder "2026-01-31T00:00:00Z"' }
          }
        ]
      },
      {
        code: sfc('<Input v-model="form.when" placeholder="ISO 8601 (UTC)" />'),
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

test('no-raw-id-input', () => {
  vue.run('no-raw-id-input', noRawIdInput, {
    valid: [
      { code: sfc('<Combobox v-model="form.organization_id" :filter="false" />') },
      { code: sfc('<Select v-model="form.team_id"><Select.Trigger /></Select>') },
      { code: sfc('<Input v-model="form.name" placeholder="my_application" />') },
      { code: sfc('<Input v-model="form.id" />') },
      { code: sfc('<Input v-model="form.valid" />') },
      { code: sfc('<Input v-model="form.paid" />') },
      {
        code: sfc(
          '<Field><Field.Label>Client ID</Field.Label><Input v-model="form.clientId" readonly /></Field>'
        )
      },
      {
        code: sfc(
          '<Field><Field.Label>Organization</Field.Label><Combobox v-model="form.org" /></Field>'
        )
      },
      { code: sfc('<input type="hidden" name="account_id" />') },
      { code: sfc('<Input v-model="form.taxId" />') },
      { code: sfc('<Input v-model="form.vat_id" />') },
      { code: sfc('<Input v-model="form.externalId" />') },
      {
        code: sfc(
          '<Field><Field.Label>Client ID</Field.Label><Input v-model="form.oauth" /></Field>'
        )
      },
      { code: sfc('<Field><Field.Label>Tax ID</Field.Label><Input v-model="form.doc" /></Field>') }
    ],
    invalid: [
      {
        code: sfc('<Input v-model="form.organization_id" />'),
        errors: [{ messageId: 'rawId', data: { tag: 'Input', evidence: "'organization_id'" } }]
      },
      {
        code: sfc('<Input v-model="form.assigneeId" />'),
        errors: [{ messageId: 'rawId', data: { tag: 'Input', evidence: "'assigneeId'" } }]
      },
      {
        code: sfc('<Textarea v-model="form.account_ids" />'),
        errors: [{ messageId: 'rawId', data: { tag: 'Textarea', evidence: "'account_ids'" } }]
      },
      {
        code: sfc('<input name="seller_id" />'),
        errors: [{ messageId: 'rawId', data: { tag: 'input', evidence: "'seller_id'" } }]
      },
      {
        code: sfc(
          '<Field><Field.Label>Organization ID</Field.Label><Input v-model="form.org" /></Field>'
        ),
        errors: [
          { messageId: 'rawId', data: { tag: 'Input', evidence: 'label "Organization ID"' } }
        ]
      },
      {
        code: sfc('<Input v-model="form.org" aria-label="Plan ID" />'),
        errors: [{ messageId: 'rawId' }]
      },
      {
        code: sfc('<Input v-model="form.org" placeholder="org_01a1… (32 hex)" />'),
        errors: [
          {
            messageId: 'rawId',
            data: { tag: 'Input', evidence: 'placeholder "org_01a1… (32 hex)"' }
          }
        ]
      },
      {
        code: sfc(
          '<Input v-model="form.ref" placeholder="3f2a9c1e-0b4d-4c8e-9a71-5d6e7f809a1b" />'
        ),
        errors: [{ messageId: 'rawId' }]
      }
    ]
  })
})
