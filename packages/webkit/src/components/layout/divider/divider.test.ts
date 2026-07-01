import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/layout/Divider.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Divider from './divider.vue'

const { Default, WithLabel, Vertical } = composeStories(stories)

const TESTID = 'layout-divider'

describe('Divider', () => {
  it('renders a separator with the default testid and horizontal semantics by default', () => {
    const { getByTestId } = render(Divider)
    const root = getByTestId(TESTID)

    expect(root).toBeInTheDocument()
    expect(root).toHaveAttribute('role', 'separator')
    expect(root).toHaveAttribute('aria-orientation', 'horizontal')
    expect(root).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('reflects the orientation prop on aria-orientation and data-orientation', () => {
    const { getByTestId } = render(Divider, { props: { orientation: 'vertical' } })
    const root = getByTestId(TESTID)

    expect(root).toHaveAttribute('aria-orientation', 'vertical')
    expect(root).toHaveAttribute('data-orientation', 'vertical')
  })

  it.each(['horizontal', 'vertical'] as const)(
    'sets both orientation attributes to %s',
    (orientation) => {
      const { getByTestId } = render(Divider, { props: { orientation } })
      const root = getByTestId(TESTID)

      expect(root).toHaveAttribute('aria-orientation', orientation)
      expect(root).toHaveAttribute('data-orientation', orientation)
    }
  )

  it('renders no label span and is not marked labelled when there is no content', () => {
    const { getByTestId, queryByTestId } = render(Divider)
    const root = getByTestId(TESTID)

    // data-labelled is `hasContent || null` — absent (not "false") when empty.
    expect(root).not.toHaveAttribute('data-labelled')
    expect(queryByTestId(`${TESTID}__label`)).toBeNull()
  })

  it('renders the label prop inside the label span and marks the root labelled', () => {
    const { getByTestId } = render(Divider, { props: { label: 'OR' } })
    const root = getByTestId(TESTID)
    const label = getByTestId(`${TESTID}__label`)

    expect(root).toHaveAttribute('data-labelled', 'true')
    expect(label).toBeInTheDocument()
    expect(label).toHaveTextContent('OR')
  })

  it('renders default slot content in the label span, overriding the label prop', () => {
    const { getByTestId } = render(Divider, {
      props: { label: 'ignored' },
      slots: { default: 'sliced' }
    })
    const root = getByTestId(TESTID)
    const label = getByTestId(`${TESTID}__label`)

    expect(root).toHaveAttribute('data-labelled', 'true')
    expect(label).toHaveTextContent('sliced')
    expect(label).not.toHaveTextContent('ignored')
  })

  it('forwards consumer data-testid onto the root and derives the label testid from it', () => {
    const { getByTestId } = render(Divider, {
      attrs: { 'data-testid': 'my-divider' },
      props: { label: 'OR' }
    })

    const root = getByTestId('my-divider')
    expect(root).toHaveAttribute('role', 'separator')
    expect(getByTestId('my-divider__label')).toHaveTextContent('OR')
  })

  it('has no a11y violations without a label (horizontal)', async () => {
    const { container } = render(Divider)
    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with a label', async () => {
    const { container } = render(Divider, { props: { label: 'OR' } })
    await expectNoA11yViolations(container)
  })

  it('has no a11y violations when vertical', async () => {
    const { container } = render(Divider, { props: { orientation: 'vertical' } })
    await expectNoA11yViolations(container)
  })

  describe('stories', () => {
    it('renders the Default story fixture', () => {
      const { getByTestId } = render(Default())
      const root = getByTestId(TESTID)

      expect(root).toHaveAttribute('role', 'separator')
      expect(root).toHaveAttribute('data-orientation', 'horizontal')
    })

    it('renders the WithLabel story with its labelled separator', () => {
      const { getByTestId } = render(WithLabel())
      const root = getByTestId(TESTID)

      expect(root).toHaveAttribute('data-orientation', 'horizontal')
      expect(root).toHaveAttribute('data-labelled', 'true')
      expect(getByTestId(`${TESTID}__label`)).toHaveTextContent('OR')
    })

    it('renders the Vertical story with vertical semantics', () => {
      const { getByTestId } = render(Vertical())
      const root = getByTestId(TESTID)

      expect(root).toHaveAttribute('aria-orientation', 'vertical')
      expect(root).toHaveAttribute('data-orientation', 'vertical')
    })
  })
})
