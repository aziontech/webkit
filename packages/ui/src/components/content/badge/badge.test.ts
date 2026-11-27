import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/badge/default.vue'
import Severities from '../../../../examples/badge/severities.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Badge from './badge.vue'

const SEVERITIES = ['neutral', 'info', 'success', 'warning', 'danger'] as const
const VARIANTS = ['primary', 'secondary'] as const
const SIZES = ['small', 'medium', 'large'] as const

describe('Badge', () => {
  it('sets every count of the Severities example beside a word that says what it counts', () => {
    const badges = render(Severities).getAllByTestId('badge')
    const words = badges.map((badge) =>
      badge.parentElement?.textContent?.replace(badge.textContent ?? '', '').trim()
    )

    expect(badges).toHaveLength(SEVERITIES.length + VARIANTS.length)
    expect(words.every(Boolean)).toBe(true)
    expect(new Set(words).size).toBe(words.length)
  })

  it('renders the value fallback text inside the value sub-element when no slot is given', () => {
    const { getByTestId } = render(Badge, { props: { label: '99' } })

    const root = getByTestId('badge')
    const valueEl = getByTestId('badge__label')

    expect(valueEl).toBeInTheDocument()
    expect(valueEl).toHaveTextContent('99')
    expect(root).toContainElement(valueEl)
  })

  it('does not render the value sub-element when value is empty (the default)', () => {
    const { getByTestId, queryByTestId } = render(Badge, { props: {} })

    // root still renders
    expect(getByTestId('badge')).toBeInTheDocument()
    // value span is guarded by v-else-if="value"; empty default => absent
    expect(queryByTestId('badge__label')).toBeNull()
  })

  it('renders default slot content and suppresses the value fallback when both are provided', () => {
    const { getByTestId, queryByTestId } = render(Badge, {
      props: { label: 'fallback-ignored' },
      slots: { default: 'slotted' }
    })

    const root = getByTestId('badge')
    expect(root).toHaveTextContent('slotted')
    // slot present => v-if branch wins, value branch not rendered
    expect(queryByTestId('badge__label')).toBeNull()
    expect(root).not.toHaveTextContent('fallback-ignored')
  })

  it('honors a consumer-supplied data-testid on the root and derives the value sub-testid from it', () => {
    const { getByTestId } = render(Badge, {
      props: { label: '7' },
      attrs: { 'data-testid': 'my-badge' }
    })

    expect(getByTestId('my-badge')).toBeInTheDocument()
    expect(getByTestId('my-badge__label')).toHaveTextContent('7')
  })

  it('reflects severity and size on data-* attributes of the root', () => {
    const { getByTestId } = render(Badge, {
      props: { label: '1', severity: 'success', size: 'large' }
    })

    const root = getByTestId('badge')
    expect(root).toHaveAttribute('data-severity', 'success')
    expect(root).toHaveAttribute('data-size', 'large')
  })

  it('applies default variant=primary and size=medium when unset, with no severity', () => {
    const { getByTestId } = render(Badge, { props: { label: '1' } })

    const root = getByTestId('badge')
    expect(root).toHaveAttribute('data-variant', 'primary')
    expect(root).not.toHaveAttribute('data-severity')
    expect(root).toHaveAttribute('data-size', 'medium')
  })

  it.each(VARIANTS)('renders data-variant=%s for each brand look', (variant) => {
    const { getByTestId } = render(Badge, { props: { label: '1', variant } })
    expect(getByTestId('badge')).toHaveAttribute('data-variant', variant)
  })

  it('lets severity win over variant when both are set', () => {
    const { getByTestId } = render(Badge, {
      props: { label: '1', variant: 'secondary', severity: 'danger' }
    })

    const root = getByTestId('badge')
    expect(root).toHaveAttribute('data-severity', 'danger')
    expect(root).not.toHaveAttribute('data-variant')
  })

  it('falls back to the variant on an invalid severity', () => {
    const { getByTestId } = render(Badge, {
      // @ts-expect-error exercising the runtime guard on an out-of-range severity
      props: { label: '1', severity: 'primary' }
    })

    const root = getByTestId('badge')
    expect(root).not.toHaveAttribute('data-severity')
    expect(root).toHaveAttribute('data-variant', 'primary')
  })

  it.each(SEVERITIES)('renders data-severity=%s for each valid severity', (severity) => {
    const { getByTestId } = render(Badge, { props: { label: '1', severity } })
    expect(getByTestId('badge')).toHaveAttribute('data-severity', severity)
  })

  it.each(SIZES)('renders data-size=%s for each valid size', (size) => {
    const { getByTestId } = render(Badge, { props: { label: '1', size } })
    expect(getByTestId('badge')).toHaveAttribute('data-size', size)
  })

  it('has no accessibility violations for the default value render', async () => {
    const { container } = render(Badge, { props: { label: '99' } })
    await expectNoA11yViolations(container)
  })

  it('has no accessibility violations for a slotted badge', async () => {
    const { container } = render(Badge, {
      props: { severity: 'danger' },
      slots: { default: '3' }
    })
    await expectNoA11yViolations(container)
  })

  it('renders the composed Default story fixture', () => {
    const { getByTestId } = render(Default)
    const root = getByTestId('badge')
    expect(root).toHaveTextContent('99')
    expect(root).toHaveAttribute('data-variant', 'primary')
    expect(root).toHaveAttribute('data-size', 'medium')
  })
})
