import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/label/Label.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Label from './label.vue'

const { Default, Required } = composeStories(stories)

describe('Label', () => {
  it('renders a <label> element carrying the default data-testid', () => {
    const { getByTestId } = render(Label, { props: { label: 'Email' } })

    const root = getByTestId('input-label')
    expect(root.tagName).toBe('LABEL')
  })

  it('shows the value prop as the label text', () => {
    const { getByTestId } = render(Label, { props: { label: 'Email' } })

    expect(getByTestId('input-label__text')).toHaveTextContent('Email')
  })

  it('renders default-slot content over the value fallback', () => {
    const { getByTestId } = render(Label, {
      props: { label: 'Fallback' },
      slots: { default: 'Slotted' }
    })

    const text = getByTestId('input-label__text')
    expect(text).toHaveTextContent('Slotted')
    expect(text).not.toHaveTextContent('Fallback')
  })

  it('does not set data-required and renders no Required tag by default', () => {
    const { getByTestId, queryByTestId } = render(Label, { props: { label: 'Email' } })

    expect(getByTestId('input-label')).not.toHaveAttribute('data-required')
    expect(queryByTestId('input-label__required')).toBeNull()
  })

  it('sets data-required and appends the Required tag when required', () => {
    const { getByTestId } = render(Label, { props: { label: 'Email', required: true } })

    expect(getByTestId('input-label')).toHaveAttribute('data-required')

    const requiredTag = getByTestId('input-label__required')
    expect(requiredTag).toBeInTheDocument()
    expect(requiredTag).toHaveTextContent('Required')
  })

  it('forwards the for attribute onto the label root via $attrs', () => {
    const { getByTestId } = render(Label, {
      props: { label: 'Email' },
      attrs: { for: 'email-field' }
    })

    expect(getByTestId('input-label')).toHaveAttribute('for', 'email-field')
  })

  it('honours a consumer-supplied data-testid', () => {
    const { getByTestId } = render(Label, {
      props: { label: 'Email' },
      attrs: { 'data-testid': 'custom-label' }
    })

    expect(getByTestId('custom-label').tagName).toBe('LABEL')
    // the derived text/required testids follow the custom base
    expect(getByTestId('custom-label__text')).toHaveTextContent('Email')
  })

  it.each([
    ['optional', { label: 'Name', required: false }],
    ['required', { label: 'Name', required: true }]
  ])('renders the %s variant', (_label, props) => {
    const { getByTestId } = render(Label, { props })
    expect(getByTestId('input-label')).toBeInTheDocument()
  })

  it('has no a11y violations in the default (optional) state', async () => {
    const { container } = render(Label, { props: { label: 'Email' } })
    await expectNoA11yViolations(container)
  })

  it('has no a11y violations in the required state', async () => {
    const { container } = render(Label, { props: { label: 'Email', required: true } })
    await expectNoA11yViolations(container)
  })

  it('composes the Default story fixture', () => {
    const { getByTestId } = render(Default)
    expect(getByTestId('input-label')).toHaveTextContent('Label')
    expect(getByTestId('input-label')).not.toHaveAttribute('data-required')
  })

  it('composes the Required story fixture with the Required tag', () => {
    const { getByTestId } = render(Required)
    expect(getByTestId('input-label')).toHaveAttribute('data-required')
    expect(getByTestId('input-label__required')).toHaveTextContent('Required')
  })
})
