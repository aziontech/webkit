import { render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Code from '../../../../examples/feature-scroll/code.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import FeatureScroll from './feature-scroll.vue'

const TESTID = 'feature-scroll'
const EYEBROW = 'Workloads'
const TITLE = 'Everything a workload does, one screen at a time'
const DESCRIPTION = 'Scroll through the console a workload is run from.'

const items = [
  {
    title: 'Every workload on one list',
    description: 'See each workload with its domain, status and last deployment.',
    illustration: 'traffic-and-cost-bar-chart',
    action: { label: 'List docs', href: '/docs/list', trailing: true }
  },
  {
    title: 'Read the deployment topology',
    description: 'The domains, the application and the firewall a workload serves.',
    illustration: 'global-network',
    action: { label: 'Topology docs', href: '/docs/topology', trailing: true }
  },
  {
    title: 'Domains and TLS, handled',
    description: 'Add a domain and get its certificate issued and renewed.',
    illustration: 'dns-protection'
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(FeatureScroll, {
    props: {
      eyebrow: EYEBROW,
      title: TITLE,
      description: DESCRIPTION,
      items,
      ...props
    }
  })

describe('FeatureScroll', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(FeatureScroll, {
      props: { title: TITLE, items },
      attrs: { 'data-testid': 'workloads-feature-scroll' }
    })

    expect(getByTestId('workloads-feature-scroll')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('names the section after its title', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).getAttribute('aria-label')).toBe(TITLE)
  })

  it('renders the title as the h2 of the band', () => {
    const { getByRole } = band()

    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
  })

  it('leaves the section unnamed and headerless when no title is set', () => {
    const { getByTestId, queryByRole } = render(FeatureScroll, { props: { items } })

    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(getByTestId(TESTID).hasAttribute('aria-label')).toBe(false)
  })

  it('renders one media tile per item, in order, on the small layout', () => {
    const { getAllByTestId } = band()

    const tiles = getAllByTestId('media-tile')
    expect(tiles).toHaveLength(items.length)
    tiles.forEach((tile, index) => {
      expect(within(tile).getByText(items[index].title)).toBeInTheDocument()
    })
  })

  it('renders one step heading per item, in order, on the large layout', () => {
    const { getAllByRole } = band()

    expect(
      getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent?.trim())
    ).toEqual(items.map((item) => item.title))
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
    const { queryByRole } = render(FeatureScroll, {
      props: { title: TITLE, items: [items[2]] }
    })

    expect(queryByRole('link')).toBeNull()
  })

  it('renders only the section when items is empty', () => {
    const { getByTestId, queryAllByRole, queryByRole, queryByTestId } = render(FeatureScroll, {
      props: { eyebrow: EYEBROW, title: TITLE, description: DESCRIPTION, items: [] }
    })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(queryAllByRole('heading', { level: 3 })).toHaveLength(0)
    expect(queryByTestId('registration-frame')).toBeNull()
    expect(queryByTestId('sticky-stack')).toBeNull()
  })

  it('renders only the section when items is omitted', () => {
    const { getByTestId, queryAllByRole } = render(FeatureScroll)

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryAllByRole('heading')).toHaveLength(0)
  })

  it('sets the anchor as the band id', () => {
    const { getByTestId } = band({ anchor: 'features' })

    expect(getByTestId(TESTID)).toHaveAttribute('id', 'features')
  })

  it('sets no id when no anchor is given', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).hasAttribute('id')).toBe(false)
  })

  it('draws an item scene in place of its illustration, in the grid and in the stack', async () => {
    const sceneItems = [
      {
        title: 'Keys at the edge',
        description: 'Read and write keys from a function.',
        scene: { component: 'ConsoleMockup', props: { name: 'kv-store-key' } },
        illustration: 'global-network'
      },
      items[1]
    ]
    const { findAllByTestId, getByTestId } = render(FeatureScroll, {
      props: { title: TITLE, items: sceneItems }
    })

    const widgets = await findAllByTestId('console-mockup')
    expect(widgets.length).toBeGreaterThanOrEqual(2)
    widgets.forEach((widget) => expect(widget).toHaveAttribute('data-name', 'kv-store-key'))
    expect(getByTestId(TESTID).querySelectorAll('[data-name="kv-store-key"]').length).toBe(
      widgets.length
    )
  })

  it('draws nothing for a scene name that is not registered', () => {
    const { queryByTestId } = render(FeatureScroll, {
      props: {
        title: TITLE,
        items: [{ title: 'Unknown', description: 'No scene.', scene: { component: 'Nope' } }]
      }
    })

    expect(queryByTestId('console-mockup')).toBeNull()
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with an empty band', async () => {
    const { container } = render(FeatureScroll, { props: { title: TITLE, items: [] } })

    await expectNoA11yViolations(container)
  })

  it('pins an item code sample under its file name, in the grid and in the stack', async () => {
    const codeItems = [
      {
        title: 'Automated deployment via Git or CLI',
        description: 'Run one command from the project you already have.',
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
        code: { fileName: 'main.tf', language: 'hcl', code: 'resource "azion_workload" "app" {}' },
        illustration: 'global-network'
      }
    ]
    const { findAllByRole, findAllByText, queryByTestId } = render(FeatureScroll, {
      props: { title: TITLE, items: codeItems }
    })

    const copies = await findAllByRole(
      'button',
      { name: 'Copy the deploy.sh sample' },
      { timeout: 5000 }
    )
    expect(copies.length).toBeGreaterThanOrEqual(2)
    expect((await findAllByText('main.tf', {}, { timeout: 5000 })).length).toBeGreaterThanOrEqual(1)
    expect(queryByTestId('illustration')).toBeNull()
  })

  it('draws an item action secondary unless it sets its variant, and carries its target', () => {
    const { getAllByRole } = band({
      items: [
        items[0],
        {
          ...items[1],
          action: {
            label: 'Terraform registry',
            href: 'https://registry.terraform.io/',
            variant: 'outline',
            target: '_blank'
          }
        }
      ]
    })

    expect(getAllByRole('link', { name: 'List docs' })[0]).toHaveAttribute(
      'data-variant',
      'secondary'
    )
    const external = getAllByRole('link', { name: 'Terraform registry' })[0]
    expect(external).toHaveAttribute('data-variant', 'outline')
    expect(external).toHaveAttribute('target', '_blank')
  })

  it('has no a11y violations with code samples', async () => {
    const { container, findAllByRole } = render(Code)

    await findAllByRole('button', { name: /Copy/ }, { timeout: 5000 })
    await expectNoA11yViolations(container)
  })
})
