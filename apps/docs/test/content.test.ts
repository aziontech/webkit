import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

import { scanMarkdown } from '../../../packages/webkit/scripts/lib/docs-markdown.mjs'
import {
  buildComponent,
  buildTokens,
  dropToolingSections,
  firstSentence,
  markdown,
  markdownParts,
  pairWord,
  renderGuidelinesFile,
  SPEC_SECTIONS,
  splitLead,
  stripReviewerNotes
} from '../plugins/content.ts'
import { readBlocks, readCatalog } from '../plugins/paths.ts'
import { usageKey, usageSections } from '../src/lib/token-usage.ts'

const md = await markdown()

test('an HTML comment never reaches the page: own paragraph, inline, multi-line', () => {
  const html = md.render(
    [
      '<!-- prettier-ignore -->',
      '',
      '| a | b |',
      '| - | - |',
      '| 1 | 2 |',
      '',
      'Before <!-- inline note --> after.',
      '',
      'Start <!-- a comment',
      'over two lines --> end.',
      '',
      '<!-- one -->',
      '<!-- two -->'
    ].join('\n')
  )
  assert.doesNotMatch(html, /&lt;!--|--&gt;|prettier-ignore|inline note|two lines|<!--/)
  assert.match(html, /<table tabindex="0">/, 'a table that scrolls must be reachable by keyboard')
  assert.match(html, /Before\s+after\./)
  assert.match(html, /Start\s+end\./)
})

test('a comment inside code stays, because it is the sample', () => {
  const html = md.render(['`<!-- kept -->`', '', '```html', '<!-- also kept -->', '```'].join('\n'))
  assert.match(html, /&lt;!-- kept --&gt;/)
  assert.match(html, /also kept/)
})

test('a task list renders as a plain list, no checkbox and no bracket marker', () => {
  const html = md.render(['- [ ] First check', '- [x] Second check'].join('\n'))
  assert.doesNotMatch(html, /\[ \]|\[x\]|type="checkbox"/)
  assert.match(html, /<li>First check<\/li>/)
  assert.match(html, /<li>Second check<\/li>/)
})

test('Do and Don’t are the only pair words; old pair words stay plain headings', () => {
  assert.deepEqual(pairWord('Do'), { type: 'guidance', side: 'do' })
  assert.deepEqual(pairWord("Don't"), { type: 'guidance', side: 'dont' })
  assert.deepEqual(pairWord('Don’t'), { type: 'guidance', side: 'dont' })
  assert.deepEqual(pairWord('When to use'), { type: 'usage', side: 'do' })
  for (const word of ['Correct', 'Wrong', 'Good', 'Bad', 'Incorrect', 'Do not', 'Never', 'Avoid'])
    assert.equal(pairWord(word), null, word)
})

test('a Do and Don’t heading pair, and a labelled list, become one pair part', () => {
  const headings = markdownParts(md, ['## Do', '', '- a', '', "## Don't", '', '- b'].join('\n'))
  assert.equal(headings.length, 1)
  assert.ok('pair' in headings[0] && headings[0].pair.type === 'guidance')
  const list = markdownParts(md, ["- **Don't:** b", '- **Do:** a'].join('\n'))
  assert.ok('pair' in list[0])
  if ('pair' in list[0]) {
    assert.match(list[0].pair.do, /a/)
    assert.match(list[0].pair.dont, /b/)
  }
})

test('a component page never renders the spec Constraints block written for agents', async () => {
  assert.ok(!SPEC_SECTIONS.some((heading) => /constraints/i.test(heading)))
  const doc = await buildComponent('button')
  assert.ok(!Object.keys(doc.spec).some((heading) => /constraints/i.test(heading)))
  const page = JSON.stringify(doc)
  assert.doesNotMatch(page, /Do not add props beyond the Props table/)
  assert.doesNotMatch(page, /Constraints — DO NOT/)
  assert.ok(doc.bestPractices.length > 0)
})

function patternSources(): string[] {
  const file = new URL('../../../skills/patterns.json', import.meta.url)
  const data = JSON.parse(readFileSync(file, 'utf8')) as { patterns: { skill: string }[] }
  return data.patterns.map((page) => `skills/${page.skill}/SKILL.md`)
}

test('no foundations or patterns page the docs render holds a task list', () => {
  const repo = new URL('../../../', import.meta.url)
  const pages = readFileSync(new URL('apps/docs/src/lib/foundations.ts', repo), 'utf8')
  const findings = [
    ...[...pages.matchAll(/markdown:\s*'([^']+)'/g)].map(([, path]) => path as string),
    ...patternSources()
  ].flatMap((path) =>
    scanMarkdown(readFileSync(new URL(path, repo), 'utf8'), { rendered: true }).map(
      (finding) => `${path}:${finding.line} ${finding.message}`
    )
  )
  assert.deepEqual(findings, [])
})

const REPO_URL = new URL('../../../', import.meta.url)
const PAIR_HEADINGS = new Set(['do', "don't", 'when to use', 'when not to use', 'example'])

function plainText(text: string): string {
  return text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_]/g, '')
    .replace(/[’‘]/g, "'")
    .replace(/[^\p{L}\p{N}' ]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function repeats(source: string): string[] {
  const prose = source.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/^(```|~~~)[\s\S]*?^\1/gm, '')
  const headings = [...prose.matchAll(/^#{1,6}\s+(.+?)\s*#*$/gm)]
    .map(([, text]) => plainText(text ?? ''))
    .filter((text) => text && !PAIR_HEADINGS.has(text))
  const paragraphs = prose
    .split(/\n\s*\n/)
    .filter((block) => !/^\s*(#|\|)/.test(block))
    .map(plainText)
    .filter((text) => text.length >= 40)
  const twice = (list: string[]) => [
    ...new Set(list.filter((item, at) => list.indexOf(item) !== at))
  ]
  return [
    ...twice(headings).map((text) => `heading "${text}" twice`),
    ...twice(paragraphs).map((text) => `paragraph "${text.slice(0, 60)}…" twice`)
  ]
}

function openingWords(text: string, count = 8): string {
  return plainText(text).split(' ').slice(0, count).join(' ')
}

test('no page source the docs render repeats a heading or a paragraph', () => {
  const pages = readFileSync(new URL('apps/docs/src/lib/foundations.ts', REPO_URL), 'utf8')
  const files = [
    ...[...pages.matchAll(/markdown:\s*'([^']+)'/g)].map(([, path]) => path as string),
    ...patternSources(),
    ...readBlocks().map((block) => `packages/webkit/blocks/${block.dir}/guidelines.md`)
  ].filter((path) => existsSync(new URL(path, REPO_URL)))
  const findings = files.flatMap((path) =>
    repeats(readFileSync(new URL(path, REPO_URL), 'utf8')).map((finding) => `${path}: ${finding}`)
  )
  assert.deepEqual(findings, [])
})

test('a block page header carries the guidelines lead, and the body goes on after it', async () => {
  const findings: string[] = []
  for (const block of readBlocks()) {
    const file = fileURLToPath(
      new URL(`packages/webkit/blocks/${block.dir}/guidelines.md`, REPO_URL)
    )
    if (!existsSync(file)) continue
    const doc = await renderGuidelinesFile(file)
    if (!doc.lead) findings.push(`${block.dir}: no lead sentence`)
    const body = doc.intro.replace(/<[^>]+>/g, '')
    if (doc.lead && openingWords(body) === openingWords(doc.lead))
      findings.push(`${block.dir}: the intro repeats the header sentence`)
  }
  assert.deepEqual(findings, [])
})

test('a component page shows the purpose after the header sentence, never both', async () => {
  assert.deepEqual(splitLead('One [link](https://example.com) `x`. Two `a.b` here.'), {
    lead: 'One link x.',
    rest: 'Two `a.b` here.'
  })
  assert.deepEqual(splitLead('Only one sentence'), { lead: 'Only one sentence', rest: '' })
  const long =
    'The composer of a chat: a text area that grows with the prompt, a toolbar under it, files attached by a button, a model picker, dictation and a Submit control that becomes Stop.'
  assert.deepEqual(splitLead(`${long} More.`), {
    lead: 'The composer of a chat.',
    rest: 'A text area that grows with the prompt, a toolbar under it, files attached by a button, a model picker, dictation and a Submit control that becomes Stop. More.'
  })
  const doc = await buildComponent('button')
  const lead = firstSentence(String(readCatalog().imports.button?.purpose ?? ''))
  assert.ok(lead)
  assert.doesNotMatch(doc.purposeRest, new RegExp(lead.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
})

test('no example on a component page is named like an API heading of that page', () => {
  const API = new Set(['props', 'events', 'slots', 'subcomponents', 'api', 'examples'])
  const examples = readdirSync(new URL('packages/webkit/examples/', REPO_URL))
  const findings = examples.flatMap((dir) => {
    const file = new URL(`packages/webkit/examples/${dir}/examples.json`, REPO_URL)
    if (!existsSync(file)) return []
    const data = JSON.parse(readFileSync(file, 'utf8')) as { examples: { name: string }[] }
    return data.examples
      .filter((example) => API.has(plainText(example.name)))
      .map((example) => `${dir}: example "${example.name}"`)
  })
  assert.deepEqual(findings, [])
})

test('the sidebar lists every page once', () => {
  const nav = readFileSync(new URL('apps/docs/src/lib/nav.ts', REPO_URL), 'utf8')
  const pages = readFileSync(new URL('apps/docs/src/lib/foundations.ts', REPO_URL), 'utf8')
  const looped = [...pages.matchAll(/slug:\s*'([^']+)'/g)]
    .map(([, slug]) => `/foundations/${slug}`)
    .filter((path) => path !== '/foundations/getting-started')
  const literal = [...nav.matchAll(/to:\s*'([^']+)'/g)].map(([, path]) => path as string)
  const all = [...looped, ...literal]
  assert.deepEqual(
    all.filter((path, at) => all.indexOf(path) !== at),
    []
  )
})

test('the Color page states each shared usage once, over every family it covers', () => {
  const sections = usageSections(buildTokens().semantic as Parameters<typeof usageSections>[0])
  const keys = sections.flatMap((section) => (section.usage ? [usageKey(section.usage)] : []))
  assert.deepEqual(
    sections
      .filter(
        (section) =>
          section.usage &&
          keys.indexOf(usageKey(section.usage)) !== keys.lastIndexOf(usageKey(section.usage))
      )
      .map((section) => section.ids.join(', ')),
    []
  )
  assert.ok(sections.some((section) => section.ids.length > 1))
  const view = readFileSync(new URL('apps/docs/src/components/tokens-view.vue', REPO_URL), 'utf8')
  assert.match(view, /usageSections\(tokens\.semantic\)/)
})

test('a search hint drops the benchmark notes a purpose carries for reviewers', () => {
  assert.equal(
    stripReviewerNotes(
      'Shows what an agent is doing (Cloudscape progressive steps, AI Elements Chain of Thought): the current step.'
    ),
    'Shows what an agent is doing: the current step.'
  )
  assert.equal(
    stripReviewerNotes(
      "Key and value tags of one resource, after Cloudscape's tag editor, built on AttributeEditor."
    ),
    'Key and value tags of one resource, built on AttributeEditor.'
  )
  assert.equal(
    stripReviewerNotes(
      "A toolbar of icon actions (a code panel, a preview), after Cloudscape's button group."
    ),
    'A toolbar of icon actions (a code panel, a preview).'
  )
  assert.equal(
    stripReviewerNotes('A list of rows (environment variables, headers) or columns.'),
    'A list of rows (environment variables, headers) or columns.'
  )
})

test('every Do and Don’t heading of a rendered page carries an id the outline can link', async () => {
  const withIds = await markdown('', { headingIds: true })
  const parts = markdownParts(
    withIds,
    [
      '## Do',
      '',
      '- a',
      '',
      "## Don't",
      '',
      '- b',
      '',
      '## Example',
      '',
      '### Do',
      '',
      '- c',
      '',
      "### Don't",
      '',
      '- d'
    ].join('\n')
  )
  const pairs = parts.flatMap((part) => ('pair' in part ? [part.pair] : []))
  assert.equal(pairs.length, 2)
  assert.deepEqual(
    pairs.map((pair) => [pair.doId, pair.dontId]),
    [
      ['do', 'dont'],
      ['example-do', 'example-dont']
    ]
  )
})

test('a foundation page drops the Enforcement section written for maintainers', () => {
  const source = [
    '## Do',
    '',
    'a',
    '',
    '## Enforcement',
    '',
    'lint gaps',
    '',
    '### Known gaps (review still owns these)',
    '',
    'more',
    '',
    '## Why',
    '',
    'b'
  ].join('\n')
  const kept = dropToolingSections(source)
  assert.doesNotMatch(kept, /Enforcement|lint gaps|Known gaps/)
  assert.match(kept, /## Do/)
  assert.match(kept, /## Why/)
})
