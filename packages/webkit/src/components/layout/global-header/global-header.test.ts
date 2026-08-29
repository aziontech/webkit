import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/layout/global-header/GlobalHeader.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import GlobalHeader from './index.js'

const { DefaultHeader, ContentZone, SitePlacement } = composeStories(stories)

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

  describe('kind — the two placements (data-kind drives the inset)', () => {
    it('defaults to the content placement', () => {
      const { getByTestId } = render(GlobalHeader)
      // withDefaults: kind: 'content' — a bar with no kind reads the page boundary, so it
      // cannot open on a different vertical from the page under it. The inset geometry
      // itself belongs to the visual gate; this env renders without Tailwind.
      expect(getByTestId('layout-global-header').getAttribute('data-kind')).toBe('content')
    })

    it('marks the content placement on the root', () => {
      const { getByTestId } = render(GlobalHeader, { props: { kind: 'content' } })
      expect(getByTestId('layout-global-header').getAttribute('data-kind')).toBe('content')
    })

    it('holds the regions directly — the placement changes the inset, not the anatomy', () => {
      const { getByTestId } = render({
        components: compoundComponents,
        template:
          '<GlobalHeader kind="content"><GlobalHeaderLeft>L</GlobalHeaderLeft><GlobalHeaderRight>R</GlobalHeaderRight></GlobalHeader>'
      })
      const root = getByTestId('layout-global-header')
      expect(getByTestId('layout-global-header__left').parentElement).toBe(root)
      expect(getByTestId('layout-global-header__right').parentElement).toBe(root)
    })

    it('keeps the banner landmark in the content placement', () => {
      const { getByRole } = render(GlobalHeader, {
        props: { kind: 'content', ariaLabel: 'Console header' }
      })
      expect(getByRole('banner', { name: 'Console header' })).toBeTruthy()
    })

    it('marks the site placement on the root', () => {
      const { getByTestId } = render(GlobalHeader, { props: { kind: 'site' } })
      // The site inset (capped + centred at --layout-measure-site) is selected by this
      // attribute alone; the geometry itself belongs to the visual gate, since this
      // env renders without Tailwind.
      expect(getByTestId('layout-global-header').getAttribute('data-kind')).toBe('site')
    })

    it('holds the regions directly in the site placement too', () => {
      const { getByTestId } = render({
        components: compoundComponents,
        template:
          '<GlobalHeader kind="site"><GlobalHeaderBrand>Azion</GlobalHeaderBrand><GlobalHeaderRight>R</GlobalHeaderRight></GlobalHeader>'
      })
      const root = getByTestId('layout-global-header')
      expect(getByTestId('layout-global-header__brand').parentElement).toBe(root)
      expect(getByTestId('layout-global-header__right').parentElement).toBe(root)
    })

    it('keeps the banner landmark in the site placement', () => {
      const { getByRole } = render(GlobalHeader, {
        props: { kind: 'site', ariaLabel: 'Azion' }
      })
      expect(getByRole('banner', { name: 'Azion' })).toBeTruthy()
    })
  })

  describe('a11y (axe against the styled, composed tree)', () => {
    it('a fully composed header has no violations', async () => {
      const { container } = renderComposed()
      await expectNoA11yViolations(container)
    })

    it('a content-placed bar has no violations', async () => {
      const { container } = render({
        components: compoundComponents,
        template: `
          <GlobalHeader kind="content" aria-label="Console header">
            <GlobalHeaderLeft><a href="/build">Build</a></GlobalHeaderLeft>
            <GlobalHeaderMiddle />
            <GlobalHeaderRight><button type="button">Create</button></GlobalHeaderRight>
          </GlobalHeader>
        `
      })
      await expectNoA11yViolations(container)
    })

    it('a site-placed bar has no violations', async () => {
      const { container } = render({
        components: compoundComponents,
        template: `
          <GlobalHeader kind="site" aria-label="Azion">
            <GlobalHeaderBrand><a href="/" aria-label="Azion home">Azion</a></GlobalHeaderBrand>
            <GlobalHeaderMiddle><a href="/pricing">Pricing</a></GlobalHeaderMiddle>
            <GlobalHeaderRight><button type="button">Start for Free</button></GlobalHeaderRight>
          </GlobalHeader>
        `
      })
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

    it('Content zone story renders the full-bleed content placement', () => {
      const { getByTestId } = render(ContentZone)
      const root = getByTestId('layout-global-header')
      // data-kind is what carries the boundary inset instead of the shell step.
      expect(root.getAttribute('data-kind')).toBe('content')
      expect(root.contains(getByTestId('layout-global-header__left'))).toBe(true)
      expect(root.contains(getByTestId('layout-global-header__right'))).toBe(true)
    })

    it('Content zone story has no a11y violations', async () => {
      const { container } = render(ContentZone)
      await expectNoA11yViolations(container)
    })

    it('Site placement story renders the capped, centred regions on the site column', () => {
      const { getByTestId } = render(SitePlacement)
      const root = getByTestId('layout-global-header')
      expect(root.getAttribute('data-kind')).toBe('site')
      expect(root.contains(getByTestId('layout-global-header__brand'))).toBe(true)
      expect(root.contains(getByTestId('layout-global-header__middle'))).toBe(true)
      expect(root.contains(getByTestId('layout-global-header__right'))).toBe(true)
    })

    it('Site placement story has no a11y violations', async () => {
      const { container } = render(SitePlacement)
      await expectNoA11yViolations(container)
    })
  })
})
