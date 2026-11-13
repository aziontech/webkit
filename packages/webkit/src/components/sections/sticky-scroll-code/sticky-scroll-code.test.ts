import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import StickyScrollCode from './sticky-scroll-code.vue'

const TESTID = 'sections-sticky-scroll-code'
const EYEBROW = 'Ship It'
const TITLE = 'Everything You Need to Build and Deploy'
const DESCRIPTION = 'Deploy from Git or the CLI, automate with APIs and Terraform.'

const items = [
  {
    title: 'Automated deployment via Git or CLI',
    description: 'Run one command from the project you already have.',
    action: { label: 'Deploy docs', href: '/docs/deploy', trailing: true },
    code: {
      fileName: 'deploy.sh',
      language: 'bash',
      code: 'azion deploy',
      copyAriaLabel: 'Copy the deploy.sh sample'
    }
  },
  {
    title: 'Infrastructure as code with Terraform',
    description: 'Declare workloads in the provider.',
    action: { label: 'Terraform docs', href: '/docs/terraform' },
    code: { fileName: 'main.tf', language: 'hcl', code: 'resource "azion_workload" "app" {}' }
  },
  {
    title: 'Metrics and events via GraphQL API',
    description: 'Query the same numbers the console charts.',
    code: { fileName: 'requests.graphql', language: 'graphql', code: 'query { httpMetrics }' }
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(StickyScrollCode, {
    props: { eyebrow: EYEBROW, title: TITLE, description: DESCRIPTION, items, ...props }
  })

describe('StickyScrollCode', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(StickyScrollCode, {
      props: { title: TITLE, items },
      attrs: { 'data-testid': 'ship-it' }
    })

    expect(getByTestId('ship-it')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('names the section by its title and renders it as the h2', () => {
    const { getByRole, getByText } = band()

    expect(getByRole('region', { name: TITLE })).toBeInTheDocument()
    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
    expect(getByText(EYEBROW)).toBeInTheDocument()
    expect(getByText(DESCRIPTION)).toBeInTheDocument()
  })

  it('renders no header and leaves the section unnamed when no title is set', () => {
    const { getByTestId, queryByRole } = band({ title: '' })

    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(getByTestId(TESTID).hasAttribute('aria-label')).toBe(false)
  })

  it('renders one claim heading per item, in order', () => {
    const { getAllByRole } = band()

    expect(
      getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent?.trim())
    ).toEqual(items.map((item) => item.title))
  })

  it('renders the sample of every item under its file name', () => {
    const { getAllByText } = band()

    items.forEach((item) => {
      expect(getAllByText(item.code.fileName).length).toBeGreaterThanOrEqual(1)
    })
  })

  it('names the copy button of a sample by its copyAriaLabel', () => {
    const { getAllByRole } = band()

    expect(getAllByRole('button', { name: 'Copy the deploy.sh sample' }).length).toBeGreaterThan(0)
  })

  it('renders each item action as a link to its href', () => {
    const { getAllByRole } = band()

    items
      .filter((item) => item.action)
      .forEach((item) => {
        const links = getAllByRole('link', { name: item.action?.label })
        expect(links.length).toBeGreaterThanOrEqual(1)
        links.forEach((link) => expect(link).toHaveAttribute('href', item.action?.href))
      })
  })

  it('renders no link for an item without an action', () => {
    const { queryByRole } = band({ items: [items[2]] })

    expect(queryByRole('link')).toBeNull()
  })

  it('renders only the section when items is empty', () => {
    const { getByTestId, queryByRole, queryByTestId } = band({ items: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(queryByTestId('marketing-sticky-stack')).toBeNull()
  })

  it('has no a11y violations', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })
})
