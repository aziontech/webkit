import assert from 'node:assert/strict'
import test from 'node:test'

import { appliesToBuiltInStrings, scanBuiltInStrings } from '../../scripts/lib/built-in-strings.mjs'

const sfc = (script, template) =>
  `<script setup lang="ts">\n${script}\n</script>\n\n<template>\n${template}\n</template>\n`

test('applies to component SFCs only', () => {
  assert.equal(appliesToBuiltInStrings('packages/webkit/src/components/data/x/x.vue'), true)
  assert.equal(appliesToBuiltInStrings('packages/webkit/blocks/a/b.vue'), false)
  assert.equal(appliesToBuiltInStrings('packages/webkit/src/components/data/x/x.ts'), false)
})

test('flags literal UI attributes and English prop defaults', () => {
  const found = scanBuiltInStrings(
    sfc(
      "  const props = withDefaults(defineProps<Props>(), {\n    ariaLabel: 'Close',\n    kind: 'primary'\n  })",
      '  <button aria-label="Close" title="Remove item" />\n  <Input placeholder="Search" />\n  <IconButton ariaLabel="Refresh" copied-label="Link copied" />'
    )
  )
  assert.deepEqual(found.sort(), [
    'hardcoded-default-string',
    'hardcoded-ui-string',
    'hardcoded-ui-string',
    'hardcoded-ui-string',
    'hardcoded-ui-string',
    'hardcoded-ui-string'
  ])
})

test('passes catalog reads, bound props, empty defaults, brand names and non-text attributes', () => {
  const found = scanBuiltInStrings(
    sfc(
      "  const props = withDefaults(defineProps<Props>(), {\n    ariaLabel: '',\n    size: 'medium'\n  })",
      '  <button :aria-label="ariaLabel || t(\'dialog.close\')" kind="outlined" icon="pi pi-times" />\n  <a aria-label="Azion" />\n  <Input placeholder="00:00" />'
    )
  )
  assert.deepEqual(found, [])
})
