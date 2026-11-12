import { test } from 'node:test'
import assert from 'node:assert/strict'

import { rewrite } from '../../scripts/kebab-aria-label.mjs'

test('rewrites camelCase accessible-name attributes to the kebab form in templates only', () => {
  const source = `<script setup lang="ts">
  const props = { ariaLabel: 'kept' }
  const label = 'Close'
</script>

<template>
  <IconButton icon="pi pi-times" ariaLabel="Close" />
  <IconButton icon="pi pi-eye" :ariaLabel="label" />
  <CopyButton v-bind:ariaLabel="label" ariaDescribedby="hint" />
  <Panel ariaLabelledby="title" />
  <IconButton icon="pi pi-check" aria-label="Done" close-aria-label="kept" />
  <ButtonGroup ariaLabel="Alignment" />
</template>
`
  const { output, edits } = rewrite(source)
  assert.equal(edits.length, 6)
  assert.match(output, /<IconButton icon="pi pi-times" aria-label="Close" \/>/)
  assert.match(output, /<IconButton icon="pi pi-eye" :aria-label="label" \/>/)
  assert.match(output, /<CopyButton v-bind:aria-label="label" aria-describedby="hint" \/>/)
  assert.match(output, /<Panel aria-labelledby="title" \/>/)
  assert.match(output, /aria-label="Done" close-aria-label="kept"/)
  assert.match(output, /<ButtonGroup aria-label="Alignment" \/>/)
  assert.match(output, /const props = \{ ariaLabel: 'kept' \}/)
  assert.equal(rewrite(output).edits.length, 0)
})
