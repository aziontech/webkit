import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/content/hero-title/HeroTitle.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import HeroTitle from './hero-title.vue'

const { Default, Highlight, Centered, WithActions } = composeStories(stories)

const TESTID = 'content-hero-title'

const props = { title: 'Run it everywhere.' }

describe('HeroTitle', () => {
  it('renders the headline as an h1 under the default testid', () => {
    const { getByTestId, getByRole } = render(HeroTitle, { props })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(getByRole('heading', { level: 1 })).toHaveTextContent('Run it everywhere.')
  })

  it('renders no highlight span and is not centered by default', () => {
    const { getByTestId } = render(HeroTitle, { props })
    const root = getByTestId(TESTID)

    expect(root).not.toHaveAttribute('data-centered')
    expect(root.querySelector('h1 span')).toBeNull()
  })

  it('renders the highlight inside the same h1, so the accessible name is one sentence', () => {
    const { getByRole } = render(HeroTitle, { props: { ...props, highlight: 'Build anything.' } })
    const heading = getByRole('heading', { level: 1 })

    expect(heading.querySelector('span')).toHaveTextContent('Build anything.')
    expect(heading.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'Build anything. Run it everywhere.'
    )
  })

  it('marks the root centered when the centered prop is set', () => {
    const { getByTestId } = render(HeroTitle, { props: { ...props, centered: true } })

    expect(getByTestId(TESTID)).toHaveAttribute('data-centered', 'true')
  })

  it('renders no description paragraph when neither the prop nor the slot is set', () => {
    const { container } = render(HeroTitle, { props })

    expect(container.querySelector('p')).toBeNull()
  })

  it('renders the description prop', () => {
    const { getByText } = render(HeroTitle, {
      props: { ...props, description: 'Ship from one platform.' }
    })

    expect(getByText('Ship from one platform.')).toBeInTheDocument()
  })

  it('lets the default slot replace the description prop', () => {
    const { getByText, queryByText } = render(HeroTitle, {
      props: { ...props, description: 'ignored' },
      slots: { default: 'slotted description' }
    })

    expect(getByText('slotted description')).toBeInTheDocument()
    expect(queryByText('ignored')).toBeNull()
  })

  it('renders no eyebrow when the prop is empty', () => {
    const { queryByText } = render(HeroTitle, { props })

    expect(queryByText('Edge platform')).toBeNull()
  })

  it('renders the eyebrow when the prop is set', () => {
    const { getByText } = render(HeroTitle, { props: { ...props, eyebrow: 'Edge platform' } })

    expect(getByText('Edge platform')).toBeInTheDocument()
  })

  it('renders no actions row when the slot is empty', () => {
    const { queryByRole } = render(HeroTitle, { props })

    expect(queryByRole('button')).toBeNull()
  })

  it('renders the actions slot when it is filled', () => {
    const { getByRole } = render(HeroTitle, {
      props,
      slots: { actions: '<button type="button">Start for free</button>' }
    })

    expect(getByRole('button', { name: 'Start for free' })).toBeInTheDocument()
  })

  it('forwards a consumer data-testid and class onto the root', () => {
    const { getByTestId } = render(HeroTitle, {
      props,
      attrs: { 'data-testid': 'my-hero', class: 'max-w-(--container-3xl)' }
    })

    const root = getByTestId('my-hero')
    expect(root.tagName).toBe('HEADER')
    expect(root.className).toContain('max-w-(--container-3xl)')
  })

  it('has no a11y violations with the full copy block', async () => {
    const { container } = render(HeroTitle, {
      props: {
        ...props,
        eyebrow: 'Edge platform',
        highlight: 'Build anything.',
        description: 'Ship from one platform.'
      }
    })
    await expectNoA11yViolations(container)
  })

  describe('stories', () => {
    it('renders the Default story fixture', () => {
      const { getByTestId, getByRole } = render(Default())

      expect(getByTestId(TESTID)).not.toHaveAttribute('data-centered')
      expect(getByRole('heading', { level: 1 })).toHaveTextContent('Run it everywhere.')
    })

    it('renders the Highlight story with the accent phrase in the h1', () => {
      const { getByRole } = render(Highlight())

      expect(getByRole('heading', { level: 1 }).querySelector('span')).toHaveTextContent(
        'Build anything.'
      )
    })

    it('renders the Centered story centered', () => {
      const { getByTestId } = render(Centered())

      expect(getByTestId(TESTID)).toHaveAttribute('data-centered', 'true')
    })

    it('renders the WithActions story with both CTAs', () => {
      const { getAllByRole } = render(WithActions())

      expect(getAllByRole('button').map((el) => el.textContent?.trim())).toEqual([
        'Start for free',
        'Talk to sales'
      ])
    })
  })
})
