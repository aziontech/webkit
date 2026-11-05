import { render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ComparisonTable from './comparison-table.vue'

const TESTID = 'sections-comparison-table'
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
  render(ComparisonTable, {
    props: {
      eyebrow: 'Comparison',
      title: TITLE,
      ...labels,
      competitor: { name: 'Cloudflare', logo: '/dark.svg', logoLight: '/light.svg' },
      groups,
      ...props
    }
  })

describe('ComparisonTable', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ComparisonTable, {
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
    const { getAllByRole } = band()

    expect(
      getAllByRole('img', { name: 'Cloudflare', hidden: true }).map((img) =>
        img.getAttribute('src')
      )
    ).toEqual(['/dark.svg', '/light.svg'])
  })

  it('falls back to the competitor name when no logo is set', () => {
    const { getByRole, queryAllByRole } = band({ competitor: { name: 'Vercel' } })

    expect(queryAllByRole('img', { name: 'Vercel', hidden: true })).toHaveLength(0)
    expect(getByRole('columnheader', { name: 'Vercel' })).toBeInTheDocument()
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

  it.skip('has no a11y violations with definitions: PopoverTrigger puts aria-expanded on a role-less span (aria-allowed-attr), a popover defect', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with a text-only competitor', async () => {
    const { container } = band({
      competitor: { name: 'Vercel' },
      groups: [{ title: 'Security', rows: [{ capability: 'Zero Trust', azion: 'full' }] }]
    })

    await expectNoA11yViolations(container)
  })
})
