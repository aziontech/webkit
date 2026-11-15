import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import ContentZone from '../../../../examples/global-header/content-zone.vue'
import DefaultHeader from '../../../../examples/global-header/default.vue'
import SitePlacement from '../../../../examples/global-header/site-placement.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import GlobalHeader from './index.js'

/**
 * global-header is a COMPOSITION component: `index.js` attaches the region
 * sub-components (Container/Start/Center/End/Brand) onto the root via
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
// `components` map by tag name — it does not walk `GlobalHeader.Start` member
// access the way the SFC compiler does. So register each region under a
// PascalCase tag pointing at the compound member (the same shape the story uses).
const compoundComponents = {
  GlobalHeader,
  GlobalHeaderStart: GlobalHeader.Start,
  GlobalHeaderCenter: GlobalHeader.Center,
  GlobalHeaderEnd: GlobalHeader.End,
  GlobalHeaderBrand: GlobalHeader.Brand,
  GlobalHeaderContainer: GlobalHeader.Container
}

// A minimal but realistic composed tree exercising every region.
const composedTemplate = `
  <GlobalHeader>
    <GlobalHeaderStart>
      <GlobalHeaderBrand>
        <a href="/" aria-label="Azion home"><svg viewBox="0 0 10 10"><rect width="10" height="10" /></svg></a>
      </GlobalHeaderBrand>
    </GlobalHeaderStart>
    <GlobalHeaderCenter>
      <a href="/products">Products</a>
    </GlobalHeaderCenter>
    <GlobalHeaderEnd>
      <button type="button">Account</button>
    </GlobalHeaderEnd>
  </GlobalHeader>
`

const renderComposed = (options = {}) =>
  render({ components: compoundComponents, template: composedTemplate }, options)

describe('GlobalHeader', () => {
  describe('compound API (index.js Object.assign)', () => {
    it('exposes each region sub-component via dot-notation on the root', () => {
      expect(GlobalHeader.Container).toBeTruthy()
      expect(GlobalHeader.Start).toBeTruthy()
      expect(GlobalHeader.Center).toBeTruthy()
      expect(GlobalHeader.End).toBeTruthy()
      expect(GlobalHeader.Brand).toBeTruthy()
      for (const removed of ['Left', 'Middle', 'Nav', 'Right']) {
        expect(removed in GlobalHeader).toBe(false)
      }
    })

    it('names each sub-component after its anatomy', () => {
      // defineOptions.name on each region .vue.
      expect(GlobalHeader.Container.name).toBe('GlobalHeaderContainer')
      expect(GlobalHeader.Start.name).toBe('GlobalHeaderStart')
      expect(GlobalHeader.Center.name).toBe('GlobalHeaderCenter')
      expect(GlobalHeader.End.name).toBe('GlobalHeaderEnd')
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

  describe('logical region names (Start / Center / End)', () => {
    it('attaches Start, Center and End to the compound', () => {
      expect(GlobalHeader.Start).toBeTruthy()
      expect(GlobalHeader.Center).toBeTruthy()
      expect(GlobalHeader.End).toBeTruthy()
    })

    it('derives __start / __center / __end from the root testid', () => {
      const { getByTestId } = render({
        components: {
          GlobalHeader,
          GlobalHeaderStart: GlobalHeader.Start,
          GlobalHeaderCenter: GlobalHeader.Center,
          GlobalHeaderEnd: GlobalHeader.End
        },
        template: `
          <GlobalHeader data-testid="app-chrome">
            <GlobalHeaderStart>Menu</GlobalHeaderStart>
            <GlobalHeaderCenter>Products</GlobalHeaderCenter>
            <GlobalHeaderEnd>Account</GlobalHeaderEnd>
          </GlobalHeader>
        `
      })
      expect(getByTestId('app-chrome__start').textContent).toContain('Menu')
      expect(getByTestId('app-chrome__center').textContent).toContain('Products')
      expect(getByTestId('app-chrome__end').textContent).toContain('Account')
    })
  })

  describe('provide/inject — the root testId flows to every region', () => {
    it('derives each region testid from the root fallback testId', () => {
      const { getByTestId } = renderComposed()
      // Root fallback is 'layout-global-header'; each region appends its own suffix.
      expect(getByTestId('layout-global-header').tagName).toBe('HEADER')
      expect(getByTestId('layout-global-header__start').tagName).toBe('DIV')
      expect(getByTestId('layout-global-header__center').tagName).toBe('DIV')
      expect(getByTestId('layout-global-header__end').tagName).toBe('DIV')
      expect(getByTestId('layout-global-header__brand').tagName).toBe('DIV')
    })

    it('overriding the root data-testid re-keys every injected region (proves shared state)', () => {
      const overriddenTemplate = `
        <GlobalHeader data-testid="app-chrome">
          <GlobalHeaderStart>
            <GlobalHeaderBrand>Azion</GlobalHeaderBrand>
          </GlobalHeaderStart>
          <GlobalHeaderCenter>Nav</GlobalHeaderCenter>
          <GlobalHeaderEnd>Actions</GlobalHeaderEnd>
        </GlobalHeader>
      `
      const { getByTestId, queryByTestId } = render({
        components: compoundComponents,
        template: overriddenTemplate
      })

      // Root uses the overridden value; each region derives from the injected ctx.testId.
      expect(getByTestId('app-chrome').tagName).toBe('HEADER')
      expect(getByTestId('app-chrome__start')).toBeTruthy()
      expect(getByTestId('app-chrome__brand')).toBeTruthy()
      expect(getByTestId('app-chrome__center')).toBeTruthy()
      expect(getByTestId('app-chrome__end')).toBeTruthy()

      // The fallback keys no longer exist — the injected value drove every region.
      expect(queryByTestId('layout-global-header')).toBeNull()
      expect(queryByTestId('layout-global-header__start')).toBeNull()
      expect(queryByTestId('layout-global-header__center')).toBeNull()
    })

    it('a region rendered without a root falls back to the literal default testId', () => {
      // No provider => inject() is undefined => ctx?.testId ?? 'layout-global-header'.
      const { getByTestId } = render(GlobalHeader.End, {
        slots: { default: '<button type="button">solo</button>' }
      })
      expect(getByTestId('layout-global-header__end').tagName).toBe('DIV')
    })

    it('lets a region override its own testid independent of the injected context', () => {
      const { getByTestId, queryByTestId } = render({
        components: compoundComponents,
        template:
          '<GlobalHeader><GlobalHeaderStart data-testid="my-left">L</GlobalHeaderStart></GlobalHeader>'
      })
      // The sub-component prefers its own attrs['data-testid'] over the derived value.
      expect(getByTestId('my-left').tagName).toBe('DIV')
      expect(queryByTestId('layout-global-header__start')).toBeNull()
    })
  })

  describe('slots — each region renders its own default slot', () => {
    it('places composed children into their matching regions', () => {
      const { getByTestId, getByText } = renderComposed()

      const left = getByTestId('layout-global-header__start')
      const brand = getByTestId('layout-global-header__brand')
      const middle = getByTestId('layout-global-header__center')
      const right = getByTestId('layout-global-header__end')

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
          '<GlobalHeader kind="content"><GlobalHeaderStart>L</GlobalHeaderStart><GlobalHeaderEnd>R</GlobalHeaderEnd></GlobalHeader>'
      })
      const root = getByTestId('layout-global-header')
      expect(getByTestId('layout-global-header__start').parentElement).toBe(root)
      expect(getByTestId('layout-global-header__end').parentElement).toBe(root)
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
          '<GlobalHeader kind="site"><GlobalHeaderBrand>Azion</GlobalHeaderBrand><GlobalHeaderEnd>R</GlobalHeaderEnd></GlobalHeader>'
      })
      const root = getByTestId('layout-global-header')
      expect(getByTestId('layout-global-header__brand').parentElement).toBe(root)
      expect(getByTestId('layout-global-header__end').parentElement).toBe(root)
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
            <GlobalHeaderStart><a href="/build">Build</a></GlobalHeaderStart>
            <GlobalHeaderCenter />
            <GlobalHeaderEnd><button type="button">Create</button></GlobalHeaderEnd>
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
            <GlobalHeaderCenter><a href="/pricing">Pricing</a></GlobalHeaderCenter>
            <GlobalHeaderEnd><button type="button">Start for Free</button></GlobalHeaderEnd>
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

  describe('documented example (the Default story fixture runs in-test)', () => {
    it('Default story renders the banner with its Start/Brand/Center/End regions', () => {
      const { getByTestId, getByRole } = render(DefaultHeader)
      // The story composes Start>Brand (Azion logo), plus empty Center and End.
      expect(getByRole('banner', { name: 'Global header' })).toBeTruthy()
      expect(getByTestId('layout-global-header__start')).toBeTruthy()
      expect(getByTestId('layout-global-header__brand')).toBeTruthy()
      expect(getByTestId('layout-global-header__center')).toBeTruthy()
      expect(getByTestId('layout-global-header__end')).toBeTruthy()
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
      expect(root.contains(getByTestId('layout-global-header__start'))).toBe(true)
      expect(root.contains(getByTestId('layout-global-header__end'))).toBe(true)
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
      expect(root.contains(getByTestId('layout-global-header__center'))).toBe(true)
      expect(root.contains(getByTestId('layout-global-header__end'))).toBe(true)
    })

    it('Site placement story has no a11y violations', async () => {
      const { container } = render(SitePlacement)
      await expectNoA11yViolations(container)
    })
  })
})
