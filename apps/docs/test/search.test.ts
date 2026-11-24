import assert from 'node:assert/strict'
import { test } from 'node:test'

import { matchCommand } from '../../../packages/webkit/src/components/overlay/command/command-match.ts'
import { buildIndex } from '../plugins/content.ts'
import { searchKeywords } from '../src/lib/search.ts'
import { groupLabel, spacedTitle, tokenGroupTitle } from '../src/lib/words.ts'

const { components, blocks } = buildIndex()

const ranked = (query: string) =>
  components
    .map((item) => ({
      name: item.name,
      score: matchCommand(query, item.title, [
        `/components/${item.name}`,
        ...searchKeywords(item.title, item.purpose, item.aliases)
      ]).score
    }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((row) => row.name)

test('a catalog alias reaches its component in the search index', () => {
  const aliases = (name: string) => components.find((item) => item.name === name)?.aliases ?? []
  assert.ok(aliases('dialog').includes('modal'))
  assert.ok(aliases('drawer').includes('sheet'))
  assert.ok(aliases('data-table').includes('datatable'))
})

test('an exact alias ranks above a description that mentions the word', () => {
  assert.equal(ranked('modal')[0], 'dialog')
  assert.equal(ranked('sheet')[0], 'drawer')
  assert.equal(ranked('data table')[0], 'data-table')
  assert.equal(ranked('dialog')[0], 'dialog')
})

test('no search hint carries a benchmark note meant for reviewers', () => {
  const notes = /Cloudscape|AI Elements|shadcn|Supabase|Vercel|benchmark/
  assert.deepEqual(
    components.filter((item) => notes.test(item.purpose)).map((item) => item.name),
    []
  )
})

test('a block title keeps its acronyms', () => {
  const title = (id: string) => blocks.find((block) => block.id === id)?.title
  assert.equal(title('ai/ai-chat'), 'AI Chat')
  assert.equal(title('ai/ai-api-key'), 'AI API Key')
  assert.equal(title('account/account-mfa-settings'), 'Account MFA Settings')
  assert.deepEqual(
    blocks.filter((block) => /\b(Ai|Api|Mfa|Dns|Cli|Waf)\b/.test(block.title)).map((b) => b.id),
    []
  )
})

test('an example name reads as words in its heading and in the page outline', () => {
  assert.equal(spacedTitle('FormSubmit'), 'Form Submit')
  assert.equal(spacedTitle('CompactHeaderWithStickyColumn'), 'Compact Header With Sticky Column')
})

test('a group heading spells words out: Background, AI', () => {
  assert.equal(tokenGroupTitle('bg'), 'Background')
  assert.equal(tokenGroupTitle('text'), 'Text')
  assert.equal(groupLabel('ai'), 'AI')
  assert.equal(groupLabel('top-bar'), 'Top Bar')
})
