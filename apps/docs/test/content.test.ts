import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  buildComponent,
  markdown,
  markdownParts,
  pairWord,
  SPEC_SECTIONS
} from '../plugins/content.ts'

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
  assert.match(html, /<table>/)
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
