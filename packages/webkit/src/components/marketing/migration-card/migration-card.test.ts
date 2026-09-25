import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import MigrationCard from './migration-card.vue'

const TESTID = 'marketing-migration-card'

const props = {
  fromSrc: '/logos/contoso.svg',
  fromAlt: 'Contoso',
  toSrc: '/logos/northwind.svg',
  toAlt: 'Northwind'
}

const label = 'Migrated in six weeks'

const href = '/customers/northwind'

describe('MigrationCard', () => {
  it('renders the card under the default testid', () => {
    const { getByTestId } = render(MigrationCard, { props })

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(MigrationCard, {
      props,
      attrs: { 'data-testid': 'switcher-proof' }
    })

    expect(getByTestId('switcher-proof')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders both marks with their own src and alt', () => {
    const { getByAltText } = render(MigrationCard, { props })

    expect(getByAltText(props.fromAlt)).toHaveAttribute('src', props.fromSrc)
    expect(getByAltText(props.toAlt)).toHaveAttribute('src', props.toSrc)
  })

  it('reads the migration left to right, from the platform left to the one moved to', () => {
    const { container } = render(MigrationCard, { props })
    const marks = container.querySelectorAll('img')

    expect(marks).toHaveLength(2)
    expect(marks[0]).toHaveAttribute('alt', props.fromAlt)
    expect(marks[1]).toHaveAttribute('alt', props.toAlt)
  })

  it('frames the card with four corner ticks, none of them announced', () => {
    const { getByTestId } = render(MigrationCard, { props })
    const ticks = getByTestId(TESTID).querySelectorAll(':scope > span[aria-hidden="true"]')

    expect(ticks).toHaveLength(4)
  })

  it('draws the corner affordance only on a card that links somewhere', () => {
    const decorations = (root: HTMLElement) => root.querySelectorAll('[aria-hidden="true"]').length

    const plain = render(MigrationCard, { props }).container
    const linked = render(MigrationCard, { props: { ...props, href } }).container

    expect(decorations(plain)).toBe(4)
    expect(decorations(linked)).toBe(5)
  })

  it('renders the label only when one is given', () => {
    const { queryByText } = render(MigrationCard, { props })
    expect(queryByText(label)).toBeNull()

    const { getByText } = render(MigrationCard, { props: { ...props, label } })
    expect(getByText(label)).toBeInTheDocument()
  })

  it('renders an article that carries no link affordance without an href', () => {
    const { getByTestId, queryByRole } = render(MigrationCard, { props: { ...props, label } })
    const root = getByTestId(TESTID)

    expect(root.tagName).toBe('ARTICLE')
    expect(root).not.toHaveAttribute('href')
    expect(root).not.toHaveAttribute('data-linked')
    expect(queryByRole('link')).toBeNull()
  })

  it('leaves an unlinked card out of the focus order', () => {
    const { getByTestId } = render(MigrationCard, { props })
    const root = getByTestId(TESTID)

    expect(root).not.toHaveAttribute('tabindex')

    root.focus()
    expect(document.activeElement).not.toBe(root)
  })

  it('renders an anchor to the href and flags it as linked', () => {
    const { getByTestId } = render(MigrationCard, { props: { ...props, label, href } })
    const root = getByTestId(TESTID)

    expect(root.tagName).toBe('A')
    expect(root).toHaveAttribute('href', href)
    expect(root).toHaveAttribute('data-linked', 'true')
  })

  it('exposes a linked card as a focusable link named by its own marks', () => {
    const { getByRole, getByTestId } = render(MigrationCard, { props: { ...props, href } })
    const link = getByRole('link', { name: new RegExp(props.toAlt) })

    expect(link).toBe(getByTestId(TESTID))

    link.focus()
    expect(document.activeElement).toBe(link)
  })

  it('has no a11y violations as an unlinked card', async () => {
    const { container } = render(MigrationCard, { props: { ...props, label } })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations as a linked card', async () => {
    const { container } = render(MigrationCard, { props: { ...props, label, href } })

    await expectNoA11yViolations(container)
  })
})
