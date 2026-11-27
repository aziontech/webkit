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

const noRawIdInput = (await import('../../src/eslint-plugin/rules/no-raw-id-input.js')).default

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
