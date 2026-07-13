import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/layout/global-header/GlobalHeader.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import GlobalHeader from './index.js'

const { DefaultHeader } = composeStories(stories)

/**
 * global-header is a COMPOSITION component: `index.js` attaches the region
 * sub-components (Container/Left/Middle/Nav/Right/Brand) onto the root via
 * Object.assign, and the root provides { testId } through GlobalHeaderInjectionKey.
 * Each sub-component injects that context and derives its own testid as
 * `${ctx.testId}__<region>`, so overriding the root testid proves provide/inject
 * flows through the whole tree.
 *
 * The root has no emits and no v-model — the only prop is `ariaLabel` — so this
 * file asserts the compound API resolution, the injected-state propagation, slot
 * placement, testid derivation/override, the landmark a11y contract, and axe.
 */

// The runtime string-template compiler resolves component tags from the
// `components` map by tag name — it does not walk `GlobalHeader.Left` member
// access the way the SFC compiler does. So register each region under a
// PascalCase tag pointing at the compound member (the same shape the story uses).
const compoundComponents = {
  GlobalHeader,
  GlobalHeaderLeft: GlobalHeader.Left,
  GlobalHeaderMiddle: GlobalHeader.Middle,
  GlobalHeaderNav: GlobalHeader.Nav,
  GlobalHeaderRight: GlobalHeader.Right,
  GlobalHeaderBrand: GlobalHeader.Brand,
  GlobalHeaderContainer: GlobalHeader.Container
}

// A minimal but realistic composed tree exercising every region.
const composedTemplate = `
  <GlobalHeader>
    <GlobalHeaderLeft>
      <GlobalHeaderBrand>
        <a href="/" aria-label="Azion home"><svg viewBox="0 0 10 10"><rect width="10" height="10" /></svg></a>
      </GlobalHeaderBrand>
    </GlobalHeaderLeft>
    <GlobalHeaderMiddle>
      <a href="/products">Products</a>
    </GlobalHeaderMiddle>
    <GlobalHeaderRight>
      <button type="button">Account</button>
    </GlobalHeaderRight>
  </GlobalHeader>
`

const renderComposed = (options = {}) =>
  render({ components: compoundComponents, template: composedTemplate }, options)

describe('GlobalHeader', () => {
  describe('compound API (index.js Object.assign)', () => {
    it('exposes each region sub-component via dot-notation on the root', () => {
      expect(GlobalHeader.Container).toBeTruthy()
      expect(GlobalHeader.Left).toBeTruthy()
      expect(GlobalHeader.Middle).toBeTruthy()
      expect(GlobalHeader.Right).toBeTruthy()
      expect(GlobalHeader.Brand).toBeTruthy()
      expect(GlobalHeader.Nav).toBeTruthy()
    })

    it('exposes Nav as an alias of Middle (same component, per the index.js comment)', () => {
      // index.js: `GlobalHeader.Nav = GlobalHeaderMiddle` — one component, two names.
      expect(GlobalHeader.Nav).toBe(GlobalHeader.Middle)
    })

    it('names each sub-component after its anatomy', () => {
      // defineOptions.name on each region .vue.
      expect(GlobalHeader.Container.name).toBe('GlobalHeaderContainer')
      expect(GlobalHeader.Left.name).toBe('GlobalHeaderLeft')
      expect(GlobalHeader.Middle.name).toBe('GlobalHeaderMiddle')
      expect(GlobalHeader.Right.name).toBe('GlobalHeaderRight')
      expect(GlobalHeader.Brand.name).toBe('GlobalHeaderBrand')
    })
  })

  describe('root rendering (grounded in global-header.vue)', () => {
    it('renders a <header> banner carrying the default data-testid', () => {
      const { getByTestId } = render(GlobalHeader)
      const root = getByTestId('layout-global-header')
      expect(root.tagName).toBe('HEADER')
      // Template: role="banner" is hardcoded on the <header>.
      expect(root.getAttribute('role')).toBe('banner')
    })

    it('exposes a banner landmark named from the default ariaLabel', () => {
      const { getByRole } = render(GlobalHeader)
      // Default ariaLabel is 'Global header', bound to aria-label on the banner.
      expect(getByRole('banner', { name: 'Global header' })).toBeTruthy()
    })

    it('applies a custom ariaLabel to the banner landmark', () => {
      const { getByRole, getByTestId } = render(GlobalHeader, {
        props: { ariaLabel: 'Console header' }
      })
      expect(getByTestId('layout-global-header').getAttribute('aria-label')).toBe('Console header')
      expect(getByRole('banner', { name: 'Console header' })).toBe(
        getByTestId('layout-global-header')
      )
    })

    it('renders default slot content directly inside the banner', () => {
      const { getByTestId } = render(GlobalHeader, {
        slots: { default: '<span data-testid="slotted">brand</span>' }
      })
      const root = getByTestId('layout-global-header')
      expect(root.contains(getByTestId('slotted'))).toBe(true)
    })
  })

  describe('provide/inject — the root testId flows to every region', () => {
    it('derives each region testid from the root fallback testId', () => {
      const { getByTestId } = renderComposed()
      // Root fallback is 'layout-global-header'; each region appends its own suffix.
      expect(getByTestId('layout-global-header').tagName).toBe('HEADER')
      expect(getByTestId('layout-global-header__left').tagName).toBe('DIV')
      expect(getByTestId('layout-global-header__middle').tagName).toBe('DIV')
      expect(getByTestId('layout-global-header__right').tagName).toBe('DIV')
      expect(getByTestId('layout-global-header__brand').tagName).toBe('DIV')
    })

    it('overriding the root data-testid re-keys every injected region (proves shared state)', () => {
      const overriddenTemplate = `
        <GlobalHeader data-testid="app-chrome">
          <GlobalHeaderLeft>
            <GlobalHeaderBrand>Azion</GlobalHeaderBrand>
          </GlobalHeaderLeft>
          <GlobalHeaderMiddle>Nav</GlobalHeaderMiddle>
          <GlobalHeaderRight>Actions</GlobalHeaderRight>
        </GlobalHeader>
      `
      const { getByTestId, queryByTestId } = render({
        components: compoundComponents,
        template: overriddenTemplate
      })

      // Root uses the overridden value; each region derives from the injected ctx.testId.
      expect(getByTestId('app-chrome').tagName).toBe('HEADER')
      expect(getByTestId('app-chrome__left')).toBeTruthy()
      expect(getByTestId('app-chrome__brand')).toBeTruthy()
      expect(getByTestId('app-chrome__middle')).toBeTruthy()
      expect(getByTestId('app-chrome__right')).toBeTruthy()

      // The fallback keys no longer exist — the injected value drove every region.
      expect(queryByTestId('layout-global-header')).toBeNull()
      expect(queryByTestId('layout-global-header__left')).toBeNull()
      expect(queryByTestId('layout-global-header__middle')).toBeNull()
    })

    it('Nav (the Middle alias) derives the same __middle testid as Middle', () => {
      const { getByTestId } = render({
        components: compoundComponents,
        template: '<GlobalHeader><GlobalHeaderNav>menu</GlobalHeaderNav></GlobalHeader>'
      })
      // Nav === Middle, so its injected testid suffix is __middle.
      expect(getByTestId('layout-global-header__middle').tagName).toBe('DIV')
    })

    it('a region rendered without a root falls back to the literal default testId', () => {
      // No provider => inject() is undefined => ctx?.testId ?? 'layout-global-header'.
      const { getByTestId } = render(GlobalHeader.Right, {
        slots: { default: '<button type="button">solo</button>' }
      })
      expect(getByTestId('layout-global-header__right').tagName).toBe('DIV')
    })

    it('lets a region override its own testid independent of the injected context', () => {
      const { getByTestId, queryByTestId } = render({
        components: compoundComponents,
        template:
          '<GlobalHeader><GlobalHeaderLeft data-testid="my-left">L</GlobalHeaderLeft></GlobalHeader>'
      })
      // The sub-component prefers its own attrs['data-testid'] over the derived value.
      expect(getByTestId('my-left').tagName).toBe('DIV')
      expect(queryByTestId('layout-global-header__left')).toBeNull()
    })
  })

  describe('slots — each region renders its own default slot', () => {
    it('places composed children into their matching regions', () => {
      const { getByTestId, getByText } = renderComposed()

      const left = getByTestId('layout-global-header__left')
      const brand = getByTestId('layout-global-header__brand')
      const middle = getByTestId('layout-global-header__middle')
      const right = getByTestId('layout-global-header__right')

      // Brand is nested inside Left; the products link inside Middle; the button inside Right.
      expect(left.contains(brand)).toBe(true)
      expect(middle.contains(getByText('Products'))).toBe(true)
      expect(right.contains(getByText('Account'))).toBe(true)
    })
  })

  describe('a11y (axe against the styled, composed tree)', () => {
    it('a fully composed header has no violations', async () => {
      const { container } = renderComposed()
      await expectNoA11yViolations(container)
    })

    it('a custom-labelled banner has no violations', async () => {
      const { container } = render(GlobalHeader, {
        props: { ariaLabel: 'Console header' },
        slots: { default: '<a href="/">Home</a>' }
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('composeStories (the Default story fixture runs in-test)', () => {
    it('Default story renders the banner with its Left/Brand/Middle/Right regions', () => {
      const { getByTestId, getByRole } = render(DefaultHeader)
      // The story composes Left>Brand (Azion logo), plus empty Middle and Right.
      expect(getByRole('banner', { name: 'Global header' })).toBeTruthy()
      expect(getByTestId('layout-global-header__left')).toBeTruthy()
      expect(getByTestId('layout-global-header__brand')).toBeTruthy()
      expect(getByTestId('layout-global-header__middle')).toBeTruthy()
      expect(getByTestId('layout-global-header__right')).toBeTruthy()
    })

    it('Default story has no a11y violations', async () => {
      const { container } = render(DefaultHeader)
      await expectNoA11yViolations(container)
    })
  })
})
