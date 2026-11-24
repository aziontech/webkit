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

    it('nests an indented list under its item', () => {
      const [list] = parseMarkdown(
        ['1. Install', '   - macOS', '   - Linux', '     - Debian', '2. Run'].join('\n')
      )
      expect(list).toMatchObject({ type: 'list', ordered: true, start: 1 })
      if (list?.type !== 'list') throw new Error('expected a list')
      expect(list.items).toHaveLength(2)
      expect(list.items[0]?.list).toMatchObject({ ordered: false })
      expect(list.items[0]?.list?.items).toHaveLength(2)
      expect(list.items[0]?.list?.items[1]?.list?.items).toHaveLength(1)
      expect(list.items[1]?.list).toBeUndefined()
    })

    it('keeps an indented plain line as part of the item text', () => {
      const [list] = parseMarkdown('- item\n  continued')
      if (list?.type !== 'list') throw new Error('expected a list')
      expect(list.items).toHaveLength(1)
      expect(list.items[0]?.list).toBeUndefined()
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

  it('marks only external links as opening a new tab', () => {
    const content = '[docs](https://www.example.com/docs) and [below](#purge)'
    const { getByRole } = render(StreamingResponse, { props: { content } })
    expect(getByRole('link', { name: 'docs (opens in a new tab)' })).toHaveAttribute(
      'target',
      '_blank'
    )
    const local = getByRole('link', { name: 'below' })
    expect(local).not.toHaveAttribute('target')
    expect(local.querySelector('.az-external-link')).toBeNull()
  })

  it('renders a nested list inside its parent item', () => {
    const { container } = render(StreamingResponse, {
      props: { content: '- Cache\n  - Purge\n  - Rules\n- Firewall' }
    })
    const outer = container.querySelector('ul:not([data-nested])')!
    expect(outer.children).toHaveLength(2)
    const nested = outer.querySelector('li > ul[data-nested]')!
    expect(nested.children).toHaveLength(2)
    expect(nested).toHaveTextContent('PurgeRules')
  })

  it('renders every heading bold with a step above it, # the largest', () => {
    const { getByRole } = render(StreamingResponse, {
      props: { content: 'Intro\n\n# Title\n\n### Step' }
    })
    const title = getByRole('heading', { level: 3, name: 'Title' })
    expect(title).toHaveAttribute('data-level', '3')
    expect(title.classList.contains('data-[level]:font-semibold')).toBe(true)
    expect(title.classList.contains('mt-(--spacing-sm)')).toBe(true)
    expect(getByRole('heading', { level: 5, name: 'Step' })).toHaveAttribute('data-level', '5')
  })

  it('draws a closed fence as a filled card with the language and copy in its header', () => {
    const { getByTestId } = render(StreamingResponse, {
      props: { content: '```bash\nazion deploy\n```' }
    })
    const block = getByTestId('code-block')
    expect(block.hasAttribute('data-bordered')).toBe(false)
    expect(block.classList.contains('rounded-(--shape-card)')).toBe(true)
    expect(getByTestId('code-block__label-text')).toHaveTextContent('Shell')
    expect(getByTestId('code-block__label').querySelector('button')).toBeTruthy()
  })

  it('never injects model HTML and drops unsafe links', () => {
    const content =
      'Hi <script>window.pwnedFlag = true</script> <img src=x onerror="window.pwnedFlag = true"> [click](javascript:window.pwnedFlag=true) [ok](https://a.b)'
    const { container, getByRole, queryByRole } = render(StreamingResponse, { props: { content } })
    expect(container.querySelector('script')).toBeNull()
    expect(container.querySelector('img')).toBeNull()
    expect(container).toHaveTextContent('<script>window.pwnedFlag = true</script>')
    expect(queryByRole('link', { name: 'click' })).toBeNull()
    const ok = getByRole('link', { name: 'ok (opens in a new tab)' })
    expect(ok).toHaveAttribute('href', 'https://a.b')
    expect(ok).toHaveAttribute('rel', 'noopener noreferrer')
    expect(ok.querySelector('.az-external-link')).toHaveAttribute('aria-hidden', 'true')
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
    expect(getByTestId('streaming-response__pending-code')).toHaveTextContent('Shell')
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

  it('renders a citation as a chip named after its source', () => {
    const { getByRole } = render(StreamingResponse, {
      props: { content: 'Fast [1].', sources: [{ title: 'Real-Time Purge' }] }
    })
    expect(getByRole('button', { name: 'Source 1: Real-Time Purge' })).toHaveTextContent(
      'Real-Time Purge'
    )
  })

  it('shows the site of a web source in its citation chip', () => {
    const { getByRole } = render(StreamingResponse, {
      props: {
        content: 'Cached [1].',
        sources: [{ title: 'Cache settings', href: 'https://www.azion.com/en/documentation/' }]
      }
    })
    expect(getByRole('button', { name: 'Source 1, azion.com: Cache settings' })).toHaveTextContent(
      'azion.com'
    )
  })

  it('folds adjacent and comma-separated markers into one chip with a count', () => {
    const { getAllByRole } = render(StreamingResponse, {
      props: {
        content: 'Cached [1][2] and purged [1, 2].',
        sources: [
          { title: 'Cache settings', href: 'https://www.azion.com/docs', site: 'Azion' },
          { title: 'aziontech/azion', href: 'https://github.com/aziontech/azion' }
        ]
      }
    })
    const chips = getAllByRole('button', { name: 'Azion +1, sources 1, 2' })
    expect(chips).toHaveLength(2)
    expect(chips[0]).toHaveTextContent('Azion+1')
  })

  it('parses citation markers into one node per run of numbers', () => {
    expect(parseInline('a [1][2] [3] b [4, 5]')).toEqual([
      { type: 'text', value: 'a ' },
      { type: 'citation', indexes: [1, 2, 3] },
      { type: 'text', value: ' b ' },
      { type: 'citation', indexes: [4, 5] }
    ])
  })

  it('puts a citation chip one space after the word and right before punctuation', () => {
    const sources = [
      { title: 'Cache settings', href: 'https://www.azion.com/docs' },
      { title: 'Purge', href: 'https://example.com/purge' }
    ]
    const { container } = render(StreamingResponse, {
      props: {
        content: 'Served by azion[1] . Then (see [2] ), more [1][2]; and [1] : done [2]next',
        sources
      }
    })
    const paragraph = container.querySelector('p')!.cloneNode(true) as HTMLElement
    paragraph.querySelectorAll('[data-testid="sources-mark"]').forEach((mark) => mark.remove())
    const text = paragraph.textContent
    expect(text).toBe(
      'Served by azion azion.com. Then (see example.com), more azion.com+1; and azion.com: done example.com next'
    )
  })

  it('marks its root as the answer text', () => {
    const { getByTestId } = render(StreamingResponse, { props: { content: 'Hi' } })
    expect(getByTestId('streaming-response')).toHaveAttribute('data-slot', 'streaming-response')
  })

  it('has no axe violations', async () => {
    const { container } = render(StreamingResponse, {
      props: { content: rich, sources: [{ title: 'Docs' }] }
    })
    await expectNoA11yViolations(container)
  })

  it('merges the consumer class so it wins over the default typography', () => {
    const { getByTestId } = render(StreamingResponse, {
      props: { content: 'Plain text' },
      attrs: { class: 'text-body-xs', 'data-testid': 'answer' }
    })
    const root = getByTestId('answer')
    expect(root).toHaveClass('text-body-xs')
    expect(root).not.toHaveClass('text-body-lg')
  })
})
