import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/content/badge/Badge.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Badge from './badge.vue'

const { Default } = composeStories(stories)

const SEVERITIES = ['primary', 'secondary', 'success', 'warning', 'danger', 'default'] as const
const SIZES = ['small', 'medium', 'large'] as const

describe('Badge', () => {
  it('renders the value fallback text inside the value sub-element when no slot is given', () => {
    const { getByTestId } = render(Badge, { props: { label: '99' } })

    const root = getByTestId('content-badge')
    const valueEl = getByTestId('content-badge__label')

    expect(valueEl).toBeInTheDocument()
    expect(valueEl).toHaveTextContent('99')
    expect(root).toContainElement(valueEl)
  })

  it('does not render the value sub-element when value is empty (the default)', () => {
    const { getByTestId, queryByTestId } = render(Badge, { props: {} })

    // root still renders
    expect(getByTestId('content-badge')).toBeInTheDocument()
    // value span is guarded by v-else-if="value"; empty default => absent
    expect(queryByTestId('content-badge__label')).toBeNull()
  })

  it('renders default slot content and suppresses the value fallback when both are provided', () => {
    const { getByTestId, queryByTestId } = render(Badge, {
      props: { label: 'fallback-ignored' },
      slots: { default: 'slotted' }
    })

    const root = getByTestId('content-badge')
    expect(root).toHaveTextContent('slotted')
    // slot present => v-if branch wins, value branch not rendered
    expect(queryByTestId('content-badge__label')).toBeNull()
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

    const root = getByTestId('content-badge')
    expect(root).toHaveAttribute('data-severity', 'success')
    expect(root).toHaveAttribute('data-size', 'large')
  })

  it('applies default severity=primary and size=medium when unset', () => {
    const { getByTestId } = render(Badge, { props: { label: '1' } })

    const root = getByTestId('content-badge')
    expect(root).toHaveAttribute('data-severity', 'primary')
    expect(root).toHaveAttribute('data-size', 'medium')
  })

  it('falls back to primary on an invalid severity', () => {
    const { getByTestId } = render(Badge, {
      // @ts-expect-error exercising the runtime guard on an out-of-range severity
      props: { label: '1', severity: 'not-a-severity' }
    })

    expect(getByTestId('content-badge')).toHaveAttribute('data-severity', 'primary')
  })

  it.each(SEVERITIES)('renders data-severity=%s for each valid severity', (severity) => {
    const { getByTestId } = render(Badge, { props: { label: '1', severity } })
    expect(getByTestId('content-badge')).toHaveAttribute('data-severity', severity)
  })

  it.each(SIZES)('renders data-size=%s for each valid size', (size) => {
    const { getByTestId } = render(Badge, { props: { label: '1', size } })
    expect(getByTestId('content-badge')).toHaveAttribute('data-size', size)
  })

  it('has no accessibility violations for the default value render', async () => {
    const { container } = render(Badge, { props: { label: '99' } })
    await expectNoA11yViolations(container)
  })

  it('has no accessibility violations for a slotted badge', async () => {
    const { container } = render(Badge, {
      props: { severity: 'danger' },
      slots: { default: 'New' }
    })
    await expectNoA11yViolations(container)
  })

  it('renders the composed Default story fixture', () => {
    const { getByTestId } = render(Default)
    // Default story args: value "99", severity primary, size medium
    const root = getByTestId('content-badge')
    expect(root).toHaveTextContent('99')
    expect(root).toHaveAttribute('data-severity', 'primary')
    expect(root).toHaveAttribute('data-size', 'medium')
  })
})
