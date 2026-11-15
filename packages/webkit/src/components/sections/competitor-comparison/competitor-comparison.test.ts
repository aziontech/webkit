import { render, within } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import CompetitorComparison from './competitor-comparison.vue'

const TESTID = 'sections-competitor-comparison'
const TITLE = 'How Azion compares with Cloudflare'

const groups = [
  {
    title: 'Security',
    rows: [
      {
        capability: 'Bot management',
        definition: 'Detecting and blocking automated traffic.',
        azion: 'full' as const,
        competitor: 'partial' as const
      },
      { capability: 'Zero Trust', azion: 'full' as const }
    ]
  },
  {
    title: 'Compute',
    rows: [
      {
        capability: 'AI inference',
        definition: 'Running AI models close to users.',
        azion: 'full' as const,
        competitor: 'none' as const
      }
    ]
  }
]

const labels = {
  caption: TITLE,
  columnLabel: 'Capability',
  fullLabel: 'Full support',
  partialLabel: 'Partial support',
  noneLabel: 'Not available'
}

const band = (props: Record<string, unknown> = {}) =>
  render(CompetitorComparison, {
    props: {
      eyebrow: 'Comparison',
      title: TITLE,
      ...labels,
      competitor: { name: 'Cloudflare', logo: '/dark.svg', logoLight: '/light.svg' },
      groups,
      ...props
    }
  })

describe('CompetitorComparison', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(CompetitorComparison, {
      props: { competitor: { name: 'Vercel' }, groups },
      attrs: { 'data-testid': 'vercel-comparison' }
    })

    expect(getByTestId('vercel-comparison')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('names the section after its title and renders it as the h2', () => {
    const { getByTestId, getByRole } = band()

    expect(getByTestId(TESTID).getAttribute('aria-label')).toBe(TITLE)
    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
  })

  it('names the table by its caption', () => {
    const { getByRole } = band()

    expect(getByRole('table', { name: TITLE })).toBeInTheDocument()
  })

  it('renders one category head and one row head per capability, in order', () => {
    const { getAllByRole } = band()

    const heads = getAllByRole('rowheader').map((cell) => cell.textContent?.trim())
    expect(heads).toEqual(['Bot management', 'Zero Trust', 'AI inference'])
    expect(getAllByRole('columnheader').length).toBeGreaterThanOrEqual(3)
  })

  it('maps each support level to its glyph and screen-reader text, reading a missing level as none', () => {
    const { getAllByRole } = band()

    const [first, second] = getAllByRole('row').filter((row) =>
      within(row).queryByRole('rowheader')
    )
    const firstCells = within(first).getAllByRole('cell')
    expect(firstCells.map((cell) => cell.querySelector('i')?.getAttribute('data-support'))).toEqual(
      ['full', 'partial']
    )
    expect(within(firstCells[1]).getByText('Partial support')).toBeInTheDocument()

    const secondCells = within(second).getAllByRole('cell')
    expect(secondCells[1].querySelector('i')?.getAttribute('data-support')).toBe('none')
    expect(within(secondCells[1]).getByText('Not available')).toBeInTheDocument()
  })

  it('renders an info button only for a capability with a definition', () => {
    const { getByRole, queryByRole } = band()

    expect(getByRole('button', { name: 'About Bot management' })).toBeInTheDocument()
    expect(queryByRole('button', { name: 'About Zero Trust' })).toBeNull()
  })

  it('renders both theme logos when both files are set', () => {
    const { getByTestId } = band()

    const mark = getByTestId(`${TESTID}__competitor-logo`)
    expect(mark).toHaveAttribute('data-route', 'pair')
    expect(mark).toHaveAccessibleName('Cloudflare')
    expect(Array.from(mark.querySelectorAll('img')).map((img) => img.getAttribute('src'))).toEqual([
      '/dark.svg',
      '/light.svg'
    ])
  })

  it('carries the artwork of a single logo file', () => {
    const { getByTestId } = band({
      competitor: { name: 'Acme', logo: '/acme.svg', artwork: 'dark' }
    })

    const mark = getByTestId(`${TESTID}__competitor-logo`)
    expect(mark).toHaveAttribute('data-route', 'single')
    expect(mark).toHaveAttribute('data-artwork', 'dark')
  })

  it('falls back to the competitor name when no logo is set and the registry has none', async () => {
    const { getByRole, getByTestId } = band({ competitor: { name: 'Acme' } })

    expect(getByRole('columnheader', { name: 'Acme' })).toBeInTheDocument()
    await new Promise((resolve) => setTimeout(resolve, 50))
    const mark = getByTestId(`${TESTID}__competitor-logo`)
    expect(mark).toHaveAttribute('data-route', 'wordmark')
    expect(mark).toHaveTextContent('Acme')
  })

  it('takes the logo from the competitor registry when only a name is given', async () => {
    const { getByRole, getByTestId } = band({ competitor: { name: 'Fastly' } })

    expect(getByRole('columnheader', { name: 'Fastly' })).toBeInTheDocument()
    await vi.waitFor(() =>
      expect(getByTestId(`${TESTID}__competitor-logo`)).toHaveAttribute('data-route', 'pair')
    )
    const files = getByTestId(`${TESTID}__competitor-logo`).querySelectorAll('img')
    expect(files).toHaveLength(2)
    const sources = Array.from(files).map((file) => file.getAttribute('src'))
    sources.forEach((source) => expect(source).toBeTruthy())
    expect(sources[0]).not.toBe(sources[1])
  })

  it('sets the anchor as the band id', () => {
    const { getByTestId } = band({ anchor: 'compare' })

    expect(getByTestId(TESTID)).toHaveAttribute('id', 'compare')
  })

  it('renders no header when the title is empty', () => {
    const { getByTestId, queryByRole } = band({ title: '' })

    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(getByTestId(TESTID).hasAttribute('aria-label')).toBe(false)
  })

  it('renders only the section when groups is empty', () => {
    const { getByTestId, queryByRole } = band({ groups: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('table')).toBeNull()
    expect(queryByRole('heading')).toBeNull()
  })

  it('has no a11y violations with a full band whose rows carry no definition', async () => {
    const { container } = band({
      groups: groups.map((group) => ({
        ...group,
        rows: group.rows.map(({ capability, azion, competitor }) => ({
          capability,
          azion,
          competitor
        }))
      }))
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with definitions', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations in the registry example', async () => {
    const { default: Registry } =
      await import('../../../../examples/competitor-comparison/registry.vue')
    const { container, getByTestId } = render(Registry)
    await vi.waitFor(() =>
      expect(getByTestId(`${TESTID}__competitor-logo`)).toHaveAttribute('data-route', 'pair')
    )

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with a text-only competitor', async () => {
    const { container } = band({
      competitor: { name: 'Acme' },
      groups: [{ title: 'Security', rows: [{ capability: 'Zero Trust', azion: 'full' }] }]
    })

    await expectNoA11yViolations(container)
  })
})
