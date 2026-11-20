import test from 'node:test'
import { RuleTester } from 'eslint'
import * as vueParser from 'vue-eslint-parser'

const rule = (await import('../../src/eslint-plugin/rules/no-link-in-sentence.js')).default

const vue = new RuleTester({
  languageOptions: { parser: vueParser, ecmaVersion: 2022, sourceType: 'module' }
})

const sfc = (body) => ({ code: `<template>${body}</template>`, filename: 'a.vue' })
const bad = (body, count = 1) => ({
  ...sfc(body),
  errors: Array.from({ length: count }, () => ({ messageId: 'inSentence' }))
})

test('no-link-in-sentence', () => {
  vue.run('no-link-in-sentence', rule, {
    valid: [
      sfc('<nav><Link href="/docs" label="Docs" /></nav>'),
      sfc('<div><Link href="/a" label="A" /><Link href="/b" label="B" /></div>'),
      sfc('<p>Read the <a href="/terms" class="text-link">terms</a>.</p>'),
      sfc('<label>I accept the <a class="text-link" href="/terms">Terms</a></label>')
    ],
    invalid: [
      bad(
        '<Field.Label for="t">I accept the <Link href="/terms" label="Terms of Service" /> and the <Link href="/privacy" label="Privacy Policy" /></Field.Label>',
        2
      ),
      bad('<p>See {{ count }} <Link href="/docs" label="docs" /></p>'),
      bad('<span>Read <link href="/a" label="more" /></span>')
    ]
  })
})
