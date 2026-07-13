import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/content/card-pricing/CardPricing.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import CardPricing from './card-pricing.vue'

const { Default } = composeStories(stories)

const SLOT_POSITIONS = ['bottom', 'middle'] as const
const CARD_STYLES = ['contained', 'transparent'] as const

const ROOT = 'content-card-pricing'

describe('CardPricing', () => {
  it('renders the article root with the fallback data-testid', () => {
    const { getByTestId } = render(CardPricing, { props: {} })

    const root = getByTestId(ROOT)
    expect(root).toBeInTheDocument()
    expect(root.tagName).toBe('ARTICLE')
  })

  it('renders planTitle inside the title sub-element', () => {
    const { getByTestId } = render(CardPricing, { props: { planTitle: 'Enterprise' } })

    const title = getByTestId(`${ROOT}__title`)
    expect(title).toHaveTextContent('Enterprise')
    expect(getByTestId(`${ROOT}__header`)).toContainElement(title)
  })

  it('uses the default planTitle "Pro" when unset', () => {
    const { getByTestId } = render(CardPricing, { props: {} })
    expect(getByTestId(`${ROOT}__title`)).toHaveTextContent('Pro')
  })

  it('omits the description sub-element by default (empty string)', () => {
    const { queryByTestId } = render(CardPricing, { props: {} })
    // description default is '' -> v-if="description" is falsy
    expect(queryByTestId(`${ROOT}__description`)).toBeNull()
  })

  it('renders the description sub-element when provided', () => {
    const { getByTestId } = render(CardPricing, {
      props: { description: 'Best for growing teams.' }
    })
    expect(getByTestId(`${ROOT}__description`)).toHaveTextContent('Best for growing teams.')
  })

  it('hides the tag by default (showTag false)', () => {
    const { queryByTestId } = render(CardPricing, { props: {} })
    expect(queryByTestId(`${ROOT}__tag`)).toBeNull()
  })

  it('shows the tag with tagLabel when showTag is true', () => {
    const { getByTestId } = render(CardPricing, {
      props: { showTag: true, tagLabel: 'Best value' }
    })
    expect(getByTestId(`${ROOT}__tag`)).toHaveTextContent('Best value')
  })

  it('shows pricing-details when showPricingDetails is true and text is non-empty', () => {
    const { getByTestId } = render(CardPricing, {
      props: { showPricingDetails: true, pricingDetails: 'Billed annually.' }
    })
    expect(getByTestId(`${ROOT}__pricing-details`)).toHaveTextContent('Billed annually.')
  })

  it('hides pricing-details when the text is empty even if showPricingDetails is true', () => {
    const { queryByTestId } = render(CardPricing, {
      props: { showPricingDetails: true, pricingDetails: '' }
    })
    expect(queryByTestId(`${ROOT}__pricing-details`)).toBeNull()
  })

  it('hides pricing-details when showPricingDetails is false even if text is present', () => {
    const { queryByTestId } = render(CardPricing, {
      props: { showPricingDetails: false, pricingDetails: 'Billed annually.' }
    })
    expect(queryByTestId(`${ROOT}__pricing-details`)).toBeNull()
  })

  it('passes value/prefix/suffix through to the composed Currency sub-testids', () => {
    const { getByTestId } = render(CardPricing, {
      props: { value: '49', prefix: '€', suffix: 'per year' }
    })

    const currency = getByTestId(`${ROOT}__currency`)
    expect(getByTestId(`${ROOT}`)).toContainElement(currency)
    expect(getByTestId(`${ROOT}__currency__value`)).toHaveTextContent('49')
    expect(getByTestId(`${ROOT}__currency__prefix`)).toHaveTextContent('€')
    expect(getByTestId(`${ROOT}__currency__suffix`)).toHaveTextContent('per year')
  })

  it('renders the default action button with actionLabel when the actions slot is empty', () => {
    const { getByTestId } = render(CardPricing, { props: { actionLabel: 'Choose plan' } })

    const actions = getByTestId(`${ROOT}__actions`)
    const action = getByTestId(`${ROOT}__action`)
    expect(actions).toContainElement(action)
    expect(action).toHaveTextContent('Choose plan')
  })

  it('suppresses the default action button when actionLabel is empty', () => {
    const { getByTestId, queryByTestId } = render(CardPricing, { props: { actionLabel: '' } })

    // actions container still renders (it holds the slot), but the default button is guarded by v-if="actionLabel"
    expect(getByTestId(`${ROOT}__actions`)).toBeInTheDocument()
    expect(queryByTestId(`${ROOT}__action`)).toBeNull()
  })

  it('renders default slot content inside the slot region', () => {
    const { getByTestId } = render(CardPricing, {
      props: {},
      slots: { default: '<p data-testid="feature-list">Feature copy</p>' }
    })

    const slot = getByTestId(`${ROOT}__slot`)
    expect(slot).toHaveTextContent('Feature copy')
    expect(slot).toContainElement(getByTestId('feature-list'))
  })

  it('overrides the default action button when the actions slot is filled', () => {
    const { getByTestId, queryByTestId } = render(CardPricing, {
      props: { actionLabel: 'Should be replaced' },
      slots: { actions: '<button data-testid="custom-cta">Get started</button>' }
    })

    const actions = getByTestId(`${ROOT}__actions`)
    expect(actions).toContainElement(getByTestId('custom-cta'))
    // named-slot content replaces the fallback default button entirely
    expect(queryByTestId(`${ROOT}__action`)).toBeNull()
    expect(actions).not.toHaveTextContent('Should be replaced')
  })

  it('renders currency, pricing, actions and slot regions for both slot positions', () => {
    for (const slotPosition of SLOT_POSITIONS) {
      const { getByTestId, unmount } = render(CardPricing, {
        props: { slotPosition, pricingDetails: 'x', showPricingDetails: true }
      })

      expect(getByTestId(ROOT)).toBeInTheDocument()
      expect(getByTestId(`${ROOT}__currency`)).toBeInTheDocument()
      expect(getByTestId(`${ROOT}__pricing`)).toBeInTheDocument()
      expect(getByTestId(`${ROOT}__pricing-details`)).toBeInTheDocument()
      expect(getByTestId(`${ROOT}__actions`)).toBeInTheDocument()
      expect(getByTestId(`${ROOT}__slot`)).toBeInTheDocument()
      unmount()
    }
  })

  it('honors a consumer-supplied data-testid on the root and derives every sub-testid from it', () => {
    const { getByTestId } = render(CardPricing, {
      props: { showTag: true, tagLabel: 'Popular', pricingDetails: 'details' },
      attrs: { 'data-testid': 'my-card' }
    })

    expect(getByTestId('my-card')).toBeInTheDocument()
    expect(getByTestId('my-card__title')).toHaveTextContent('Pro')
    expect(getByTestId('my-card__tag')).toHaveTextContent('Popular')
    expect(getByTestId('my-card__currency')).toBeInTheDocument()
    expect(getByTestId('my-card__pricing-details')).toHaveTextContent('details')
    expect(getByTestId('my-card__action')).toBeInTheDocument()
  })

  it.each(SLOT_POSITIONS)('renders slotPosition=%s without dropping the root', (slotPosition) => {
    const { getByTestId } = render(CardPricing, { props: { slotPosition } })
    expect(getByTestId(ROOT)).toBeInTheDocument()
  })

  it.each(CARD_STYLES)('renders cardStyle=%s without dropping the root', (cardStyle) => {
    const { getByTestId } = render(CardPricing, { props: { cardStyle } })
    expect(getByTestId(ROOT)).toBeInTheDocument()
  })

  it('has no accessibility violations for the default (bottom, contained) render', async () => {
    const { container } = render(CardPricing, {
      props: { description: 'A plan description.', pricingDetails: 'Billed annually.' }
    })
    await expectNoA11yViolations(container)
  })

  it('has no accessibility violations for the middle slot position with a filled slot', async () => {
    const { container } = render(CardPricing, {
      props: { slotPosition: 'middle', showTag: true, description: 'Middle layout.' },
      slots: { default: '<ul><li>Feature one</li><li>Feature two</li></ul>' }
    })
    await expectNoA11yViolations(container)
  })

  it('renders the composed Default story fixture (bottom slot, contained surface)', () => {
    const { getByTestId } = render(Default)

    const root = getByTestId(ROOT)
    expect(root).toBeInTheDocument()
    // meta args: planTitle "Pro", value "20", prefix "$", suffix "per month", actionLabel "Label"
    expect(getByTestId(`${ROOT}__title`)).toHaveTextContent('Pro')
    expect(getByTestId(`${ROOT}__currency__value`)).toHaveTextContent('20')
    expect(getByTestId(`${ROOT}__action`)).toHaveTextContent('Label')
  })
})
