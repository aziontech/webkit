import userEvent from '@testing-library/user-event'
import { render, within } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import Components from '../../../../examples/doc-markdown/components.vue'
import Default from '../../../../examples/doc-markdown/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import DocMarkdown, { parseDocMarkdown } from './doc-markdown.vue'

const mount = (source: string, extra: Record<string, unknown> = {}, options = {}) =>
  render(DocMarkdown, { props: { source, ...extra }, ...options })

describe('DocMarkdown', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(mount('Hello').getByTestId('documentation-doc-markdown')).toBeTruthy()
    expect(mount('Hello', { 'data-testid': 'page-body' }).getByTestId('page-body')).toBeTruthy()
  })

  it('renders headings as DocHeading with unique slug ids and drops the frontmatter', () => {
    const { container, getByRole, queryByText } = mount(
      '---\ntitle: First deploy\n---\n\n## Test it\n\nOne.\n\n## Test it\n\n### Use `acme deploy`'
    )
    expect(queryByText('title: First deploy')).toBeNull()
    const ids = [...container.querySelectorAll('h2, h3')].map((el) => el.id)
    expect(ids).toEqual(['test-it', 'test-it-2', 'use-acme-deploy'])
    expect(getByRole('heading', { level: 3 }).querySelector('code')?.textContent).toBe(
      'acme deploy'
    )
  })

  it('renders paragraphs, inline markup, lists, quotes, rules and tables', () => {
    const { container, getByRole, getAllByRole } = mount(
      [
        'Run **only** the *first* step with `acme login`.',
        '',
        '- One',
        '  - Nested',
        '- Two',
        '',
        '1. First',
        '2. Second',
        '',
        '> Quoted',
        '',
        '---',
        '',
        '| Name | Size |',
        '| :--- | ---: |',
        '| site-assets | 12 MB |'
      ].join('\n')
    )
    expect(container.querySelector('strong')?.textContent).toBe('only')
    expect(container.querySelector('em')?.textContent).toBe('first')
    expect(container.querySelector('p code')?.textContent).toBe('acme login')
    expect(container.querySelector('ul ul li')?.textContent).toBe('Nested')
    expect(container.querySelectorAll('ol li')).toHaveLength(2)
    expect(container.querySelector('blockquote')?.textContent).toContain('Quoted')
    expect(container.querySelector('hr')).toBeTruthy()
    expect(getByRole('table')).toBeTruthy()
    const headers = getAllByRole('columnheader')
    expect(headers.map((cell) => cell.getAttribute('scope'))).toEqual(['col', 'col'])
    expect(headers[1]!.getAttribute('data-align')).toBe('end')
    expect(getByRole('cell', { name: 'site-assets' })).toBeTruthy()
  })

  it('mounts the documentation components for the MDX tags', async () => {
    const { getByTestId, getAllByTestId, getByText, findByText } = mount(
      [
        '<Warning>Deleting a bucket removes its objects.</Warning>',
        '',
        '<Steps>',
        '  <Step title="Install">Run the installer.</Step>',
        '  <Step title="Log in">Use your token.</Step>',
        '</Steps>',
        '',
        '<CardGroup cols={2}>',
        '  <Card title="Domains" href="/docs/domains">Point a domain.</Card>',
        '  <Card title="Cache" href="/docs/cache">Cache assets.</Card>',
        '</CardGroup>',
        '',
        '<ItemGroup>',
        '  <Item title="SQL" icon="pi pi-database">Store relational data.</Item>',
        '</ItemGroup>',
        '',
        '<AccordionGroup>',
        '  <Accordion title="Is there a free tier?">Yes.</Accordion>',
        '</AccordionGroup>',
        '',
        '<Update label="March 2, 2026" tags={["CLI", "API"]}>Faster deploys.</Update>'
      ].join('\n')
    )
    expect(getByTestId('documentation-doc-callout').getAttribute('data-kind')).toBe('warning')
    expect(getAllByTestId('documentation-doc-step')).toHaveLength(2)
    expect(getByText('Domains')).toBeTruthy()
    expect(await findByText('Store relational data.')).toBeTruthy()
    expect(await findByText('Is there a free tier?')).toBeTruthy()
    expect(getByTestId('documentation-doc-update').id).toBe('march-2-2026')
    expect(getByText('CLI')).toBeTruthy()
  })

  it('collapses a CodeGroup into one tabbed block labelled from each fence', async () => {
    const { findAllByRole } = mount(
      [
        '<CodeGroup>',
        '```bash npm',
        'npm i acme',
        '```',
        '```bash pnpm',
        'pnpm add acme',
        '```',
        '</CodeGroup>'
      ].join('\n')
    )
    const tabs = (await findAllByRole('tab')).map((tab) => tab.textContent?.trim())
    expect(tabs).toEqual(['npm', 'pnpm'])
  })

  it('renders an inline Tooltip inside a sentence and keeps the rest of the line', () => {
    const { container } = mount(
      'An <Tooltip tip="Application programming interface">API</Tooltip> key is required.'
    )
    expect(container.querySelector('p')?.textContent).toContain('API')
    expect(container.querySelector('p')?.textContent).toContain('key is required.')
  })

  it('opens the inline Tooltip as a HoverCard with its title, definition and link on focus', async () => {
    const { getByRole } = mount(
      'An <Tooltip title="API" tip="Application programming interface" linkLabel="Read more" href="/docs/api">API</Tooltip> key.'
    )
    const term = getByRole('button', { name: 'API' })
    await userEvent.tab()
    expect(document.activeElement).toBe(term)
    await vi.waitFor(() => {
      const card = document.body.querySelector(
        '[data-testid="documentation-doc-markdown__tooltip__content"]'
      )
      expect(card?.textContent).toContain('Application programming interface')
      expect(term.getAttribute('aria-describedby')).toBe(card?.id)
    })
    const card = document.body.querySelector(
      '[data-testid="documentation-doc-markdown__tooltip__content"]'
    ) as HTMLElement
    expect(
      within(card)
        .getByRole('link', { name: /Read more/ })
        .getAttribute('href')
    ).toBe('/docs/api')
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() =>
      expect(
        document.body.querySelector('[data-testid="documentation-doc-markdown__tooltip__content"]')
      ).toBeNull()
    )
  })

  it('keeps unknown tags and unsafe links as text', () => {
    const { container, queryByRole, getByText } = mount(
      '<Banner>Hi</Banner>\n\nA [bad link](javascript:alert(1)) here.'
    )
    expect(getByText(/<Banner>Hi<\/Banner>/)).toBeTruthy()
    expect(queryByRole('link')).toBeNull()
    expect(container.textContent).toContain('bad link')
  })

  it('announces an external link that opens a new tab', () => {
    const { getByRole } = mount('Read the [guide](https://example.com/docs).')
    const link = getByRole('link', { name: /guide/ })
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noreferrer')
    expect(link.textContent).toContain('(opens in a new tab)')
  })

  it('follows an in-app link with the router', async () => {
    const router = { push: vi.fn(), currentRoute: ref({ path: '/docs' }) }
    const { getByRole } = mount(
      'See [domains](/docs/domains).',
      {},
      {
        global: { config: { globalProperties: { $router: router } } }
      }
    )
    await userEvent.click(getByRole('link', { name: 'domains' }))
    expect(router.push).toHaveBeenCalledWith('/docs/domains')
  })

  it('mounts a tag through the components override and adds a custom block tag', () => {
    const Badge = defineComponent({
      props: { label: { type: String, default: '' } },
      setup:
        (props, { slots }) =>
        () =>
          h('mark', { 'data-label': props.label }, slots['default']?.())
    })
    const { container } = mount('<Card title="Plain" />\n\n<Badge label="New">Fresh</Badge>', {
      components: { Card: Badge, Badge }
    })
    const marks = container.querySelectorAll('mark')
    expect(marks).toHaveLength(2)
    expect(marks[1]!.getAttribute('data-label')).toBe('New')
    expect(marks[1]!.textContent).toBe('Fresh')
  })

  it('parseDocMarkdown returns the frontmatter and the outline headings', () => {
    const { frontmatter, headings } = parseDocMarkdown(
      '---\ntitle: Release notes\ndescription: What shipped\n---\n\n# Page\n\n## One\n\n### Two\n\n#### Deep\n\n<Update label="May 1, 2026">Notes.</Update>'
    )
    expect(frontmatter).toEqual({ title: 'Release notes', description: 'What shipped' })
    expect(headings).toEqual([
      { id: 'one', text: 'One', depth: 2 },
      { id: 'two', text: 'Two', depth: 3 },
      { id: 'may-1-2026', text: 'May 1, 2026', depth: 2 }
    ])
  })

  it('renders an empty root for an empty source', () => {
    expect(mount('').getByTestId('documentation-doc-markdown').childElementCount).toBe(0)
  })

  it('renders the examples without axe violations', async () => {
    const first = render(Default)
    expect(within(first.container).getAllByRole('heading').length).toBeGreaterThan(1)
    expect((await within(first.container).findAllByRole('tab')).length).toBe(2)
    await expectNoA11yViolations(first.container)
    const second = render(Components)
    await expectNoA11yViolations(second.container)
  })

  it('renders right-to-left without violations', async () => {
    const { container } = render(
      defineComponent({
        render: () => h('div', { dir: 'rtl' }, [h(DocMarkdown, { source: '## Title\n\nBody.' })])
      })
    )
    await expectNoA11yViolations(container)
  })
})
