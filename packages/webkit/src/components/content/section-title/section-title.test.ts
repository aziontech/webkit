import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/content/section-title/SectionTitle.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import SectionTitle from './section-title.vue'

const { Default, Kinds, WithActions } = composeStories(stories)

const TESTID = 'content-section-title'

const props = { title: 'Everything runs at the edge' }

describe('SectionTitle', () => {
  it('renders the headline as an h2 under the default testid', () => {
    const { getByTestId, getByRole } = render(SectionTitle, { props })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(getByRole('heading', { level: 2 })).toHaveTextContent('Everything runs at the edge')
  })

  it('renders inside a flush frame that keeps only its two dividing rules', () => {
    const { getByTestId } = render(SectionTitle, { props })
    const root = getByTestId(TESTID)

    // flush="top" is subtracted from borders="y", so the header keeps only its bottom rule —
    // the divider between the header and the section body.
    expect(root).toHaveAttribute('data-flush', 'top')
    expect(root).toHaveAttribute('data-borders', 'bottom')
  })

  it.each(['centered', 'left', 'horizontal'] as const)(
    'reflects kind="%s" on data-kind',
    (kind) => {
      const { getByTestId } = render(SectionTitle, { props: { ...props, kind } })

      expect(getByTestId(TESTID)).toHaveAttribute('data-kind', kind)
    }
  )

  it('defaults to the centered kind', () => {
    const { getByTestId } = render(SectionTitle, { props })

    expect(getByTestId(TESTID)).toHaveAttribute('data-kind', 'centered')
  })

  it.each(['centered', 'left', 'horizontal'] as const)(
    'keeps the headline before its description in DOM order when kind="%s"',
    (kind) => {
      const { container } = render(SectionTitle, {
        props: { ...props, kind, eyebrow: 'Platform', description: 'One platform.' }
      })

      const heading = container.querySelector('h2')
      const paragraph = container.querySelector('p:last-of-type')

      expect(heading).toHaveTextContent('Everything runs at the edge')
      expect(paragraph).toHaveTextContent('One platform.')
      // Node.DOCUMENT_POSITION_FOLLOWING === 4: the description follows the headline, so the
      // reading order matches the visual one in every layout — including the two-column one.
      expect(heading.compareDocumentPosition(paragraph) & 4).toBe(4)
    }
  )

  it('renders no description paragraph when neither the prop nor the slot is set', () => {
    const { container } = render(SectionTitle, { props })

    expect(container.querySelector('p')).toBeNull()
  })

  it('renders the description prop', () => {
    const { getByText } = render(SectionTitle, {
      props: { ...props, description: 'One platform for everything.' }
    })

    expect(getByText('One platform for everything.')).toBeInTheDocument()
  })

  it('lets the default slot replace the description prop', () => {
    const { getByText, queryByText } = render(SectionTitle, {
      props: { ...props, description: 'ignored' },
      slots: { default: 'slotted description' }
    })

    expect(getByText('slotted description')).toBeInTheDocument()
    expect(queryByText('ignored')).toBeNull()
  })

  it('renders no eyebrow when the prop is empty', () => {
    const { queryByText } = render(SectionTitle, { props })

    expect(queryByText('Platform')).toBeNull()
  })

  it('renders the eyebrow when the prop is set', () => {
    const { getByText } = render(SectionTitle, { props: { ...props, eyebrow: 'Platform' } })

    expect(getByText('Platform')).toBeInTheDocument()
  })

  it('renders no actions row when the slot is empty', () => {
    const { queryByRole } = render(SectionTitle, { props })

    expect(queryByRole('button')).toBeNull()
  })

  it('renders the actions slot when it is filled', () => {
    const { getByRole } = render(SectionTitle, {
      props,
      slots: { actions: '<button type="button">Start building</button>' }
    })

    expect(getByRole('button', { name: 'Start building' })).toBeInTheDocument()
  })

  it('forwards a consumer data-testid onto the root', () => {
    const { getByTestId } = render(SectionTitle, {
      props,
      attrs: { 'data-testid': 'my-section-title' }
    })

    expect(getByTestId('my-section-title')).toHaveAttribute('data-kind', 'centered')
  })

  it('has no a11y violations with the full copy block', async () => {
    const { container } = render(SectionTitle, {
      props: { ...props, eyebrow: 'Platform', description: 'One platform for everything.' }
    })
    await expectNoA11yViolations(container)
  })

  describe('stories', () => {
    it('renders the Default story fixture', () => {
      const { getByTestId, getByRole } = render(Default())

      expect(getByTestId(TESTID)).toHaveAttribute('data-kind', 'centered')
      expect(getByRole('heading', { level: 2 })).toHaveTextContent('Everything runs at the edge')
    })

    it('renders the Kinds story with one header per layout', () => {
      const { getAllByTestId } = render(Kinds())

      expect(getAllByTestId(TESTID).map((el) => el.getAttribute('data-kind'))).toEqual([
        'centered',
        'left',
        'horizontal'
      ])
    })

    it('renders the WithActions story with both CTAs', () => {
      const { getAllByRole } = render(WithActions())

      expect(getAllByRole('button').map((el) => el.textContent?.trim())).toEqual([
        'Start building',
        'Read the docs'
      ])
    })

  })
})
