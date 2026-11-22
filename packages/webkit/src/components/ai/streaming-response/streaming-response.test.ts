import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import { safeHref } from '../../../utils/safe-href'
import {
  type MarkdownParse,
  parseInline,
  parseMarkdown,
  parseMarkdownIncremental
} from '../lib/parse-markdown'
import StreamingResponse from './streaming-response.vue'

const rich = [
  '## Purge',
  'Use **Real-Time Purge** with *URL* and `ttl` [1].',
  '',
  '- one',
  '- two',
  '',
  '3. third',
  '4. fourth',
  '',
  '| Type | When |',
  '| --- | --- |',
  '| URL | One object |',
  '',
  '> A quote',
  '',
  '---',
  '',
  '```bash',
  'azion purge',
  '```'
].join('\n')

describe('StreamingResponse', () => {
  describe('parseMarkdown', () => {
    it('parses blocks in order', () => {
      expect(parseMarkdown(rich).map((block) => block.type)).toEqual([
        'heading',
        'paragraph',
        'list',
        'list',
        'table',
        'quote',
        'rule',
        'code'
      ])
    })

    it('tolerates incomplete markdown while streaming', () => {
      expect(parseInline('a **bol')).toEqual([
        { type: 'text', value: 'a ' },
        { type: 'strong', children: [{ type: 'text', value: 'bol' }] }
      ])
      expect(parseInline('see [the do')).toEqual([{ type: 'text', value: 'see the do' }])
      const open = parseMarkdown('```js\nconst a = 1')
      expect(open[0]).toMatchObject({ type: 'code', closed: false, value: 'const a = 1' })
    })

    it('keeps a lone asterisk literal', () => {
      expect(parseInline('5 * 3 and snake_case')).toEqual([
        { type: 'text', value: '5 * 3 and snake_case' }
      ])
    })

    it('parses an appended stream to the same blocks as a full parse at every step', () => {
      const source = [
        rich,
        '',
        'Then | not a table',
        '| A | B |',
        '|---|---|',
        '| 1 | 2 |',
        'para',
        '- item',
        '  continued',
        '```js x',
        '~~~ts',
        'const a = 1',
        '',
        '~~~',
        '# Done\r\nlast'
      ].join('\n')
      let state: MarkdownParse | undefined
      for (let end = 1; end <= source.length; end += 1) {
        state = parseMarkdownIncremental(source.slice(0, end), state)
        expect(state.blocks, `after ${end} chars`).toEqual(parseMarkdown(source.slice(0, end)))
      }
    })

    it('keeps settled blocks as the same objects while text is appended', () => {
      const first = parseMarkdownIncremental('```js\nconst a = 1\n```\n\nSome')
      const next = parseMarkdownIncremental('```js\nconst a = 1\n```\n\nSome more', first)
      expect(next.blocks[0]).toBe(first.blocks[0])
      expect(next.blocks[1]).not.toBe(first.blocks[1])
    })

    it('allows only safe link protocols', () => {
      expect(safeHref('https://a.b')).toBe('https://a.b')
      expect(safeHref('/docs')).toBe('/docs')
      expect(safeHref('#s-1')).toBe('#s-1')
      expect(safeHref('mailto:a@b.c')).toBe('mailto:a@b.c')
      expect(safeHref('javascript:alert(1)')).toBeNull()
      expect(safeHref('JaVaScRiPt:alert(1)')).toBeNull()
      expect(safeHref('data:text/html,x')).toBeNull()
      expect(safeHref('//evil.example')).toBeNull()
    })
  })

  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(render(StreamingResponse).getByTestId('streaming-response')).toBeTruthy()
    expect(
      render(StreamingResponse, { attrs: { 'data-testid': 'mine' } }).getByTestId('mine')
    ).toBeTruthy()
  })

  it('renders markdown as elements, headings starting at h3', () => {
    const { container, getByRole, getAllByRole } = render(StreamingResponse, {
      props: { content: rich }
    })
    expect(getByRole('heading', { level: 4, name: 'Purge' })).toBeTruthy()
    expect(container.querySelector('strong')).toHaveTextContent('Real-Time Purge')
    expect(container.querySelector('em')).toHaveTextContent('URL')
    expect(container.querySelector('p code')).toHaveTextContent('ttl')
    expect(container.querySelector('ul')?.children).toHaveLength(2)
    expect(container.querySelector('ol')).toHaveAttribute('start', '3')
    expect(getAllByRole('columnheader').map((th) => th.textContent?.trim())).toEqual([
      'Type',
      'When'
    ])
    expect(container.querySelector('blockquote')).toHaveTextContent('A quote')
    expect(container.querySelector('[role="separator"]')).toBeTruthy()
    expect(container.querySelector('[data-testid="code-block"], pre')).toBeTruthy()
  })

  it('never injects model HTML and drops unsafe links', () => {
    const content =
      'Hi <script>window.pwnedFlag = true</script> <img src=x onerror="window.pwnedFlag = true"> [click](javascript:window.pwnedFlag=true) [ok](https://a.b)'
    const { container, getByRole, queryByRole } = render(StreamingResponse, { props: { content } })
    expect(container.querySelector('script')).toBeNull()
    expect(container.querySelector('img')).toBeNull()
    expect(container).toHaveTextContent('<script>window.pwnedFlag = true</script>')
    expect(queryByRole('link', { name: 'click' })).toBeNull()
    const ok = getByRole('link', { name: 'ok' })
    expect(ok).toHaveAttribute('href', 'https://a.b')
    expect(ok).toHaveAttribute('rel', 'noopener noreferrer')
    expect((window as unknown as { pwnedFlag?: boolean }).pwnedFlag).toBeUndefined()
  })

  it('marks the region busy and shows a caret only while streaming', async () => {
    const { getByTestId, queryByTestId, rerender } = render(StreamingResponse, {
      props: { content: 'Partial text', streaming: true }
    })
    const root = getByTestId('streaming-response')
    expect(root).toHaveAttribute('aria-busy', 'true')
    const caret = getByTestId('streaming-response__caret')
    expect(caret).toHaveAttribute('aria-hidden', 'true')
    expect(caret.className).toContain('motion-reduce:animate-none')
    await rerender({ content: 'Partial text, complete.', streaming: false })
    expect(root).not.toHaveAttribute('aria-busy')
    expect(queryByTestId('streaming-response__caret')).toBeNull()
  })

  it('keeps an unclosed fence plain while streaming, then hands it to CodeBlock', async () => {
    const { getByTestId, queryByTestId, rerender } = render(StreamingResponse, {
      props: { content: '```bash\nazion purge', streaming: true }
    })
    expect(getByTestId('streaming-response__pending-code')).toHaveTextContent('azion purge')
    expect(getByTestId('streaming-response__pending-code')).toHaveAttribute('dir', 'ltr')
    await rerender({ content: '```bash\nazion purge\n```', streaming: false })
    expect(queryByTestId('streaming-response__pending-code')).toBeNull()
  })

  it('does not re-render a closed code block while later tokens stream in', async () => {
    let codeBlockUpdates = 0
    const { rerender } = render(StreamingResponse, {
      props: { content: '```js\nconst a = 1\n```\n\nThe rule', streaming: true },
      global: {
        mixins: [
          {
            updated(this: { $options: { name?: string } }) {
              if (this.$options.name === 'CodeBlock') codeBlockUpdates += 1
            }
          }
        ]
      }
    })
    for (const token of [' above', ' sets', ' the', ' cache']) {
      await rerender({
        content: `\`\`\`js\nconst a = 1\n\`\`\`\n\nThe rule${token}`,
        streaming: true
      })
      await nextTick()
    }
    expect(codeBlockUpdates).toBe(0)
  })

  it('links citations to the sources anchor', () => {
    const { getByRole } = render(StreamingResponse, {
      props: { content: 'Fast [1].', sources: [{ title: 'Real-Time Purge' }], anchor: 'answer' }
    })
    expect(getByRole('link', { name: 'Source 1: Real-Time Purge' })).toHaveAttribute(
      'href',
      '#answer-source-1'
    )
  })

  it('has no axe violations', async () => {
    const { container } = render(StreamingResponse, {
      props: { content: rich, sources: [{ title: 'Docs' }], anchor: 'a' }
    })
    await expectNoA11yViolations(container)
  })
})
