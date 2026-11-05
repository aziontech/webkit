import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import PlatformDirectory from './platform-directory.vue'

const TESTID = 'sections-platform-directory'
const TITLE = 'Everything you need to build and run applications'
const ARIA_LABEL = 'Azion products'

const groups = [
  {
    title: 'Build',
    items: [
      {
        icon: 'ai ai-edge-functions',
        title: 'Functions',
        description: 'Run code globally with no cold starts',
        href: '/products/functions'
      },
      {
        icon: 'ai ai-edge-ai',
        title: 'AI Inference',
        description: 'Run models close to the user',
        href: '/products/ai-inference'
      }
    ]
  },
  {
    title: 'Store',
    items: [
      {
        icon: 'ai ai-edge-kv',
        title: 'KV Store',
        description: 'Store key-value data with low latency',
        href: '/products/kv-store'
      }
    ]
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(PlatformDirectory, {
    props: { title: TITLE, ariaLabel: ARIA_LABEL, groups, ...props }
  })

describe('PlatformDirectory', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(PlatformDirectory, {
      props: { title: TITLE, groups },
      attrs: { 'data-testid': 'home-directory' }
    })

    expect(getByTestId('home-directory')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders the title as the h2 and names the band with it', () => {
    const { getByRole, getByTestId } = band()

    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
    expect(getByTestId(TESTID)).toHaveAttribute('aria-label', TITLE)
  })

  it('names the directory navigation with ariaLabel', () => {
    const { getByRole } = band()

    expect(getByRole('navigation', { name: ARIA_LABEL })).toBeInTheDocument()
  })

  it('renders one list per group, named by the group title, in order', () => {
    const { getAllByRole } = band()

    const lists = getAllByRole('list')
    expect(lists).toHaveLength(groups.length)
    groups.forEach((group, index) => {
      const labelledBy = lists[index].getAttribute('aria-labelledby') ?? ''
      expect(document.getElementById(labelledBy)?.textContent?.trim()).toBe(group.title)
    })
  })

  it('renders one link per item to its href, in order', () => {
    const { getAllByRole } = band()

    const items = groups.flatMap((group) => group.items)
    const links = getAllByRole('link')
    expect(links.map((link) => link.getAttribute('href'))).toEqual(items.map((item) => item.href))
    links.forEach((link, index) => expect(link).toHaveTextContent(items[index].title))
  })

  it('skips items without a title or an href, and groups left empty', () => {
    const { getAllByRole, queryByText } = band({
      groups: [
        {
          title: 'Build',
          items: [
            { title: 'Functions', href: '/products/functions' },
            { title: 'Unlinked', href: '' },
            { title: '', href: '/products/untitled' }
          ]
        },
        { title: 'Empty', items: [{ title: 'Nowhere', href: '' }] }
      ]
    })

    expect(getAllByRole('link')).toHaveLength(1)
    expect(getAllByRole('list')).toHaveLength(1)
    expect(queryByText('Unlinked')).toBeNull()
    expect(queryByText('Empty')).toBeNull()
  })

  it('renders no header and leaves the band unnamed without a title', () => {
    const { getByTestId, queryByRole } = band({ title: '' })

    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(getByTestId(TESTID).hasAttribute('aria-label')).toBe(false)
  })

  it('renders only the section when groups is empty', () => {
    const { getByTestId, queryByRole } = band({ groups: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading')).toBeNull()
    expect(queryByRole('navigation')).toBeNull()
    expect(getByTestId(TESTID).hasAttribute('aria-label')).toBe(false)
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with an empty band', async () => {
    const { container } = band({ groups: [] })

    await expectNoA11yViolations(container)
  })
})
