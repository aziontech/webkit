import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import ContentZone from '../../../../examples/app-header/content-zone.vue'
import DefaultHeader from '../../../../examples/app-header/default.vue'
import SitePlacement from '../../../../examples/app-header/site-placement.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import AppHeader from './index.js'

/**
 * app-header is a COMPOSITION component: `index.js` attaches the region
 * sub-components (Container/Start/Center/End/Brand) onto the root via
 * Object.assign, and the root provides { testId } through AppHeaderInjectionKey.
 * Each sub-component injects that context and derives its own testid as
 * `${ctx.testId}__<region>`, so overriding the root testid proves provide/inject
 * flows through the whole tree.
 *
 * The root has no emits and no v-model — the only prop is `ariaLabel` — so this
 * file asserts the compound API resolution, the injected-state propagation, slot
 * placement, testid derivation/override, the landmark a11y contract, and axe.
 */

// The runtime string-template compiler resolves component tags from the
// `components` map by tag name — it does not walk `AppHeader.Start` member
// access the way the SFC compiler does. So register each region under a
// PascalCase tag pointing at the compound member (the same shape the story uses).
const compoundComponents = {
  AppHeader,
  AppHeaderStart: AppHeader.Start,
  AppHeaderCenter: AppHeader.Center,
  AppHeaderEnd: AppHeader.End,
  AppHeaderBrand: AppHeader.Brand,
  AppHeaderContainer: AppHeader.Container
}

// A minimal but realistic composed tree exercising every region.
const composedTemplate = `
  <AppHeader>
    <AppHeaderStart>
      <AppHeaderBrand>
        <a href="/" aria-label="Azion home"><svg viewBox="0 0 10 10"><rect width="10" height="10" /></svg></a>
      </AppHeaderBrand>
    </AppHeaderStart>
    <AppHeaderCenter>
      <a href="/products">Products</a>
    </AppHeaderCenter>
    <AppHeaderEnd>
      <button type="button">Account</button>
    </AppHeaderEnd>
  </AppHeader>
`

const renderComposed = (options = {}) =>
  render({ components: compoundComponents, template: composedTemplate }, options)

describe('AppHeader', () => {
  describe('compound API (index.js Object.assign)', () => {
    it('exposes each region sub-component via dot-notation on the root', () => {
      expect(AppHeader.Container).toBeTruthy()
      expect(AppHeader.Start).toBeTruthy()
      expect(AppHeader.Center).toBeTruthy()
      expect(AppHeader.End).toBeTruthy()
      expect(AppHeader.Brand).toBeTruthy()
      for (const removed of ['Left', 'Middle', 'Nav', 'Right']) {
        expect(removed in AppHeader).toBe(false)
      }
    })

    it('names each sub-component after its anatomy', () => {
      // defineOptions.name on each region .vue.
      expect(AppHeader.Container.name).toBe('AppHeaderContainer')
      expect(AppHeader.Start.name).toBe('AppHeaderStart')
      expect(AppHeader.Center.name).toBe('AppHeaderCenter')
      expect(AppHeader.End.name).toBe('AppHeaderEnd')
      expect(AppHeader.Brand.name).toBe('AppHeaderBrand')
    })
  })

  describe('root rendering (grounded in app-header.vue)', () => {
    it('renders a <header> banner carrying the default data-testid', () => {
      const { getByTestId } = render(AppHeader)
      const root = getByTestId('layout-app-header')
      expect(root.tagName).toBe('HEADER')
      // Template: role="banner" is hardcoded on the <header>.
      expect(root.getAttribute('role')).toBe('banner')
    })

    it('exposes a banner landmark named from the default ariaLabel', () => {
      const { getByRole } = render(AppHeader)
      // Default ariaLabel is 'Global header', bound to aria-label on the banner.
      expect(getByRole('banner', { name: 'Global header' })).toBeTruthy()
    })

    it('applies a custom ariaLabel to the banner landmark', () => {
      const { getByRole, getByTestId } = render(AppHeader, {
        props: { ariaLabel: 'Console header' }
      })
      expect(getByTestId('layout-app-header').getAttribute('aria-label')).toBe('Console header')
      expect(getByRole('banner', { name: 'Console header' })).toBe(getByTestId('layout-app-header'))
    })

    it('renders default slot content directly inside the banner', () => {
      const { getByTestId } = render(AppHeader, {
        slots: { default: '<span data-testid="slotted">brand</span>' }
      })
      const root = getByTestId('layout-app-header')
      expect(root.contains(getByTestId('slotted'))).toBe(true)
    })
  })

  describe('logical region names (Start / Center / End)', () => {
    it('attaches Start, Center and End to the compound', () => {
      expect(AppHeader.Start).toBeTruthy()
      expect(AppHeader.Center).toBeTruthy()
      expect(AppHeader.End).toBeTruthy()
    })

    it('derives __start / __center / __end from the root testid', () => {
      const { getByTestId } = render({
        components: {
          AppHeader,
          AppHeaderStart: AppHeader.Start,
          AppHeaderCenter: AppHeader.Center,
          AppHeaderEnd: AppHeader.End
        },
        template: `
          <AppHeader data-testid="app-chrome">
            <AppHeaderStart>Menu</AppHeaderStart>
            <AppHeaderCenter>Products</AppHeaderCenter>
            <AppHeaderEnd>Account</AppHeaderEnd>
          </AppHeader>
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
      // Root fallback is 'layout-app-header'; each region appends its own suffix.
      expect(getByTestId('layout-app-header').tagName).toBe('HEADER')
      expect(getByTestId('layout-app-header__start').tagName).toBe('DIV')
      expect(getByTestId('layout-app-header__center').tagName).toBe('DIV')
      expect(getByTestId('layout-app-header__end').tagName).toBe('DIV')
      expect(getByTestId('layout-app-header__brand').tagName).toBe('DIV')
    })

    it('overriding the root data-testid re-keys every injected region (proves shared state)', () => {
      const overriddenTemplate = `
        <AppHeader data-testid="app-chrome">
          <AppHeaderStart>
            <AppHeaderBrand>Azion</AppHeaderBrand>
          </AppHeaderStart>
          <AppHeaderCenter>Nav</AppHeaderCenter>
          <AppHeaderEnd>Actions</AppHeaderEnd>
        </AppHeader>
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
      expect(queryByTestId('layout-app-header')).toBeNull()
      expect(queryByTestId('layout-app-header__start')).toBeNull()
      expect(queryByTestId('layout-app-header__center')).toBeNull()
    })

    it('a region rendered without a root falls back to the literal default testId', () => {
      // No provider => inject() is undefined => ctx?.testId ?? 'layout-app-header'.
      const { getByTestId } = render(AppHeader.End, {
        slots: { default: '<button type="button">solo</button>' }
      })
      expect(getByTestId('layout-app-header__end').tagName).toBe('DIV')
    })

    it('lets a region override its own testid independent of the injected context', () => {
      const { getByTestId, queryByTestId } = render({
        components: compoundComponents,
        template: '<AppHeader><AppHeaderStart data-testid="my-left">L</AppHeaderStart></AppHeader>'
      })
      // The sub-component prefers its own attrs['data-testid'] over the derived value.
      expect(getByTestId('my-left').tagName).toBe('DIV')
      expect(queryByTestId('layout-app-header__start')).toBeNull()
    })
  })

  describe('slots — each region renders its own default slot', () => {
    it('places composed children into their matching regions', () => {
      const { getByTestId, getByText } = renderComposed()

      const left = getByTestId('layout-app-header__start')
      const brand = getByTestId('layout-app-header__brand')
      const middle = getByTestId('layout-app-header__center')
      const right = getByTestId('layout-app-header__end')

      // Brand is nested inside Left; the products link inside Middle; the button inside Right.
      expect(left.contains(brand)).toBe(true)
      expect(middle.contains(getByText('Products'))).toBe(true)
      expect(right.contains(getByText('Account'))).toBe(true)
    })
  })

  describe('variant — the two placements (data-variant drives the inset)', () => {
    it('defaults to the content placement', () => {
      const { getByTestId } = render(AppHeader)
      // withDefaults: variant: 'content' — a bar with no variant reads the page boundary, so it
      // cannot open on a different vertical from the page under it. The inset geometry
      // itself belongs to the visual gate; this env renders without Tailwind.
      expect(getByTestId('layout-app-header').getAttribute('data-variant')).toBe('content')
    })

    it('marks the content placement on the root', () => {
      const { getByTestId } = render(AppHeader, { props: { variant: 'content' } })
      expect(getByTestId('layout-app-header').getAttribute('data-variant')).toBe('content')
    })

    it('holds the regions directly — the placement changes the inset, not the anatomy', () => {
      const { getByTestId } = render({
        components: compoundComponents,
        template:
          '<AppHeader variant="content"><AppHeaderStart>L</AppHeaderStart><AppHeaderEnd>R</AppHeaderEnd></AppHeader>'
      })
      const root = getByTestId('layout-app-header')
      expect(getByTestId('layout-app-header__start').parentElement).toBe(root)
      expect(getByTestId('layout-app-header__end').parentElement).toBe(root)
    })

    it('keeps the banner landmark in the content placement', () => {
      const { getByRole } = render(AppHeader, {
        props: { variant: 'content', ariaLabel: 'Console header' }
      })
      expect(getByRole('banner', { name: 'Console header' })).toBeTruthy()
    })

    it('marks the site placement on the root', () => {
      const { getByTestId } = render(AppHeader, { props: { variant: 'site' } })
      // The site inset (capped + centred at --layout-measure-site) is selected by this
      // attribute alone; the geometry itself belongs to the visual gate, since this
      // env renders without Tailwind.
      expect(getByTestId('layout-app-header').getAttribute('data-variant')).toBe('site')
    })

    it('holds the regions directly in the site placement too', () => {
      const { getByTestId } = render({
        components: compoundComponents,
        template:
          '<AppHeader variant="site"><AppHeaderBrand>Azion</AppHeaderBrand><AppHeaderEnd>R</AppHeaderEnd></AppHeader>'
      })
      const root = getByTestId('layout-app-header')
      expect(getByTestId('layout-app-header__brand').parentElement).toBe(root)
      expect(getByTestId('layout-app-header__end').parentElement).toBe(root)
    })

    it('keeps the banner landmark in the site placement', () => {
      const { getByRole } = render(AppHeader, {
        props: { variant: 'site', ariaLabel: 'Azion' }
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
          <AppHeader variant="content" aria-label="Console header">
            <AppHeaderStart><a href="/build">Build</a></AppHeaderStart>
            <AppHeaderCenter />
            <AppHeaderEnd><button type="button">Create</button></AppHeaderEnd>
          </AppHeader>
        `
      })
      await expectNoA11yViolations(container)
    })

    it('a site-placed bar has no violations', async () => {
      const { container } = render({
        components: compoundComponents,
        template: `
          <AppHeader variant="site" aria-label="Azion">
            <AppHeaderBrand><a href="/" aria-label="Azion home">Azion</a></AppHeaderBrand>
            <AppHeaderCenter><a href="/pricing">Pricing</a></AppHeaderCenter>
            <AppHeaderEnd><button type="button">Start for Free</button></AppHeaderEnd>
          </AppHeader>
        `
      })
      await expectNoA11yViolations(container)
    })

    it('a custom-labelled banner has no violations', async () => {
      const { container } = render(AppHeader, {
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
      expect(getByTestId('layout-app-header__start')).toBeTruthy()
      expect(getByTestId('layout-app-header__brand')).toBeTruthy()
      expect(getByTestId('layout-app-header__center')).toBeTruthy()
      expect(getByTestId('layout-app-header__end')).toBeTruthy()
    })

    it('Default story has no a11y violations', async () => {
      const { container } = render(DefaultHeader)
      await expectNoA11yViolations(container)
    })

    it('Content zone story renders the full-bleed content placement', () => {
      const { getByTestId } = render(ContentZone)
      const root = getByTestId('layout-app-header')
      // data-variant is what carries the boundary inset instead of the shell step.
      expect(root.getAttribute('data-variant')).toBe('content')
      expect(root.contains(getByTestId('layout-app-header__start'))).toBe(true)
      expect(root.contains(getByTestId('layout-app-header__end'))).toBe(true)
    })

    it('Content zone story has no a11y violations', async () => {
      const { container } = render(ContentZone)
      await expectNoA11yViolations(container)
    })

    it('Site placement story renders the capped, centred regions on the site column', () => {
      const { getByTestId } = render(SitePlacement)
      const root = getByTestId('layout-app-header')
      expect(root.getAttribute('data-variant')).toBe('site')
      expect(root.contains(getByTestId('layout-app-header__brand'))).toBe(true)
      expect(root.contains(getByTestId('layout-app-header__center'))).toBe(true)
      expect(root.contains(getByTestId('layout-app-header__end'))).toBe(true)
    })

    it('Site placement story has no a11y violations', async () => {
      const { container } = render(SitePlacement)
      await expectNoA11yViolations(container)
    })
  })
})
