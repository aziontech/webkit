import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/feedback/status-indicator/StatusIndicator.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import StatusIndicator from './status-indicator.vue'

const { Default, Status, Loading } = composeStories(stories)

const STATUSES = ['positive', 'info', 'neutral', 'warning', 'alt', 'danger'] as const

describe('StatusIndicator', () => {
  it('renders with the default testid, default status and default label', () => {
    const { getByTestId } = render(StatusIndicator)

    const root = getByTestId('feedback-status-indicator')
    expect(root).toBeTruthy()
    // Defaults from withDefaults: status positive, label "Status", loading false.
    expect(root.getAttribute('data-status')).toBe('positive')
    expect(root.getAttribute('role')).toBe('status')
    // loading defaults to false → aria-busy is undefined (omitted) and data-loading null.
    expect(root.hasAttribute('aria-busy')).toBe(false)
    expect(root.getAttribute('data-loading')).toBeNull()
    expect(getByTestId('feedback-status-indicator__label').textContent?.trim()).toBe('Status')
  })

  it('honors a consumer-supplied data-testid on the root and its parts', () => {
    const { getByTestId } = render(StatusIndicator, {
      attrs: { 'data-testid': 'my-status' }
    })

    expect(getByTestId('my-status')).toBeTruthy()
    // Child testids are derived from the root testid.
    expect(getByTestId('my-status__dot')).toBeTruthy()
    expect(getByTestId('my-status__label')).toBeTruthy()
  })

  it('reflects the status prop on data-status for every option', () => {
    for (const status of STATUSES) {
      const { getByTestId, unmount } = render(StatusIndicator, { props: { status } })
      expect(getByTestId('feedback-status-indicator').getAttribute('data-status')).toBe(status)
      // The dot mirrors the status too.
      expect(getByTestId('feedback-status-indicator__dot').getAttribute('data-status')).toBe(
        status
      )
      unmount()
    }
  })

  it('falls back to positive when status is undefined', () => {
    const { getByTestId } = render(StatusIndicator, { props: { status: undefined } })

    expect(getByTestId('feedback-status-indicator').getAttribute('data-status')).toBe('positive')
  })

  it('renders the label prop inside the label span', () => {
    const { getByTestId } = render(StatusIndicator, { props: { label: 'Online' } })

    expect(getByTestId('feedback-status-indicator__label').textContent?.trim()).toBe('Online')
  })

  it('renders the dot (hidden from a11y) and no spinner when not loading', () => {
    const { getByTestId, queryByTestId } = render(StatusIndicator, { props: { loading: false } })

    const dot = getByTestId('feedback-status-indicator__dot')
    expect(dot).toBeTruthy()
    expect(dot.getAttribute('aria-hidden')).toBe('true')
    expect(queryByTestId('feedback-status-indicator__spinner')).toBeNull()
  })

  it('swaps the dot for a spinner, sets aria-busy and appends an ellipsis to the label when loading', () => {
    const { getByTestId, queryByTestId } = render(StatusIndicator, {
      props: { loading: true, label: 'Deploying' }
    })

    const root = getByTestId('feedback-status-indicator')
    // aria-busy is true and data-loading is present when loading.
    expect(root.getAttribute('aria-busy')).toBe('true')
    expect(root.hasAttribute('data-loading')).toBe(true)
    // Spinner replaces the dot.
    expect(getByTestId('feedback-status-indicator__spinner')).toBeTruthy()
    expect(queryByTestId('feedback-status-indicator__dot')).toBeNull()
    // Label appends the ellipsis in loading state.
    expect(getByTestId('feedback-status-indicator__label').textContent?.trim()).toBe(
      'Deploying...'
    )
  })

  it('merges a consumer-supplied class onto the root', () => {
    const { getByTestId } = render(StatusIndicator, {
      attrs: { class: 'consumer-class' }
    })

    expect(getByTestId('feedback-status-indicator').classList.contains('consumer-class')).toBe(
      true
    )
  })

  it.each([...STATUSES])('has no a11y violations for status "%s"', async (status) => {
    const { container } = render(StatusIndicator, { props: { status, label: 'Status' } })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations in the loading state', async () => {
    const { container } = render(StatusIndicator, {
      props: { loading: true, label: 'Loading' }
    })

    await expectNoA11yViolations(container)
  })

  it('renders the Default story fixture cleanly', async () => {
    const { getByTestId, container } = render(Default())

    expect(getByTestId('feedback-status-indicator')).toBeTruthy()
    await expectNoA11yViolations(container)
  })

  it('renders the Status story fixture with all variants', () => {
    const { getAllByTestId } = render(Status())

    // The composite story renders one indicator per status option.
    expect(getAllByTestId('feedback-status-indicator').length).toBe(STATUSES.length)
  })

  it('renders the Loading story fixture with a spinner and busy state', async () => {
    const { getByTestId, container } = render(Loading())

    expect(getByTestId('feedback-status-indicator').getAttribute('aria-busy')).toBe('true')
    expect(getByTestId('feedback-status-indicator__spinner')).toBeTruthy()
    await expectNoA11yViolations(container)
  })
})
