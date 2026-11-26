import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'

import ContentZone from '../../../../examples/app-header/content-zone.vue'
import DefaultHeader from '../../../../examples/app-header/default.vue'
import SitePlacement from '../../../../examples/app-header/site-placement.vue'
import WithAccount from '../../../../examples/app-header/with-account.vue'
import WithLabel from '../../../../examples/app-header/with-label.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import AppHeaderAccount from './app-header-account.vue'
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
      const { getByTestId, getByRole } = render(AppHeader)
      const root = getByTestId('app-header')
      expect(root.tagName).toBe('HEADER')
      expect(root.hasAttribute('role')).toBe(false)
      expect(getByRole('banner')).toBe(root)
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
      expect(getByTestId('app-header').getAttribute('aria-label')).toBe('Console header')
      expect(getByRole('banner', { name: 'Console header' })).toBe(getByTestId('app-header'))
    })

    it('renders default slot content directly inside the banner', () => {
      const { getByTestId } = render(AppHeader, {
        slots: { default: '<span data-testid="slotted">brand</span>' }
      })
      const root = getByTestId('app-header')
      expect(root.contains(getByTestId('slotted'))).toBe(true)
    })
  })

  describe('logical region names (Start / Center / End)', () => {
    it('attaches Start, Center and End to the compound', () => {
      expect(AppHeader.Start).toBeTruthy()
      expect(AppHeader.Center).toBeTruthy()
      expect(AppHeader.End).toBeTruthy()
    })

    it('names Start / Center / End by their own part test ids', () => {
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
      expect(getByTestId('app-header-start').textContent).toContain('Menu')
      expect(getByTestId('app-header-center').textContent).toContain('Products')
      expect(getByTestId('app-header-end').textContent).toContain('Account')
    })
  })

  describe('test ids — the root and every region', () => {
    it('gives the root and each region its own test id', () => {
      const { getByTestId } = renderComposed()
      expect(getByTestId('app-header').tagName).toBe('HEADER')
      expect(getByTestId('app-header-start').tagName).toBe('DIV')
      expect(getByTestId('app-header-center').tagName).toBe('DIV')
      expect(getByTestId('app-header-end').tagName).toBe('DIV')
      expect(getByTestId('app-header-brand').tagName).toBe('DIV')
    })

    it('overriding the root data-testid renames only the root', () => {
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

      expect(getByTestId('app-chrome').tagName).toBe('HEADER')
      expect(queryByTestId('app-header')).toBeNull()
      expect(getByTestId('app-header-start')).toBeTruthy()
      expect(getByTestId('app-header-brand')).toBeTruthy()
      expect(getByTestId('app-header-center')).toBeTruthy()
      expect(getByTestId('app-header-end')).toBeTruthy()
    })

    it('a region rendered without a root keeps its own test id', () => {
      const { getByTestId } = render(AppHeader.End, {
        slots: { default: '<button type="button">solo</button>' }
      })
      expect(getByTestId('app-header-end').tagName).toBe('DIV')
    })

    it('lets a region override its own testid independent of the injected context', () => {
      const { getByTestId, queryByTestId } = render({
        components: compoundComponents,
        template: '<AppHeader><AppHeaderStart data-testid="my-left">L</AppHeaderStart></AppHeader>'
      })
      // The sub-component prefers its own attrs['data-testid'] over the derived value.
      expect(getByTestId('my-left').tagName).toBe('DIV')
      expect(queryByTestId('app-header-start')).toBeNull()
    })
  })

  describe('slots — each region renders its own default slot', () => {
    it('places composed children into their matching regions', () => {
      const { getByTestId, getByText } = renderComposed()

      const left = getByTestId('app-header-start')
      const brand = getByTestId('app-header-brand')
      const middle = getByTestId('app-header-center')
      const right = getByTestId('app-header-end')

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
      expect(getByTestId('app-header').getAttribute('data-variant')).toBe('content')
    })

    it('marks the content placement on the root', () => {
      const { getByTestId } = render(AppHeader, { props: { variant: 'content' } })
      expect(getByTestId('app-header').getAttribute('data-variant')).toBe('content')
    })

    it('holds the regions directly — the placement changes the inset, not the anatomy', () => {
      const { getByTestId } = render({
        components: compoundComponents,
        template:
          '<AppHeader variant="content"><AppHeaderStart>L</AppHeaderStart><AppHeaderEnd>R</AppHeaderEnd></AppHeader>'
      })
      const root = getByTestId('app-header')
      expect(getByTestId('app-header-start').parentElement).toBe(root)
      expect(getByTestId('app-header-end').parentElement).toBe(root)
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
      expect(getByTestId('app-header').getAttribute('data-variant')).toBe('site')
    })

    it('holds the regions directly in the site placement too', () => {
      const { getByTestId } = render({
        components: compoundComponents,
        template:
          '<AppHeader variant="site"><AppHeaderBrand>Azion</AppHeaderBrand><AppHeaderEnd>R</AppHeaderEnd></AppHeader>'
      })
      const root = getByTestId('app-header')
      expect(getByTestId('app-header-brand').parentElement).toBe(root)
      expect(getByTestId('app-header-end').parentElement).toBe(root)
    })

    it('keeps the banner landmark in the site placement', () => {
      const { getByRole } = render(AppHeader, {
        props: { variant: 'site', ariaLabel: 'Azion' }
      })
      expect(getByRole('banner', { name: 'Azion' })).toBeTruthy()
    })
  })

  describe('Brand — href turns the brand into the home link', () => {
    it('renders a div with no href and no accessible name when href is unset', () => {
      const { getByTestId } = render(AppHeader.Brand, {
        slots: { default: '<svg viewBox="0 0 10 10"><rect width="10" height="10" /></svg>' }
      })
      const brand = getByTestId('app-header-brand')
      expect(brand.tagName).toBe('DIV')
      expect(brand.hasAttribute('href')).toBe(false)
      expect(brand.hasAttribute('aria-label')).toBe(false)
      expect(brand.hasAttribute('data-link')).toBe(false)
    })

    it('renders an anchor to href, named by aria-label', () => {
      const { getByRole, getByTestId } = render(AppHeader.Brand, {
        attrs: { 'aria-label': 'Acme home' },
        props: { href: '/home' },
        slots: { default: '<svg viewBox="0 0 10 10"><rect width="10" height="10" /></svg>' }
      })
      const link = getByRole('link', { name: 'Acme home' })
      expect(link).toBe(getByTestId('app-header-brand'))
      expect(link.tagName).toBe('A')
      expect(link.getAttribute('href')).toBe('/home')
      expect(link.hasAttribute('data-link')).toBe(true)
    })

    it('names the link from the locale catalog when aria-label is empty', () => {
      const { getByRole } = render(AppHeader.Brand, {
        props: { href: '/' },
        slots: { default: '<svg viewBox="0 0 10 10"><rect width="10" height="10" /></svg>' }
      })
      expect(getByRole('link', { name: 'Azion home' }).getAttribute('href')).toBe('/')
    })

    it('keeps the slotted logo inside the link', () => {
      const { getByRole, getByTestId } = render(AppHeader.Brand, {
        props: { href: '/' },
        slots: { default: '<span data-testid="logo">Azion</span>' }
      })
      expect(getByRole('link', { name: 'Azion home' }).contains(getByTestId('logo'))).toBe(true)
    })

    it('is reachable with Tab', async () => {
      const { getByRole } = render(AppHeader.Brand, {
        props: { href: '/' },
        slots: { default: '<span>Azion</span>' }
      })
      await userEvent.setup().tab()
      expect(document.activeElement).toBe(getByRole('link', { name: 'Azion home' }))
    })

    it('a header with a brand link has no violations', async () => {
      const { container } = render({
        components: compoundComponents,
        template: `
          <AppHeader aria-label="Console header">
            <AppHeaderContainer>
              <AppHeaderBrand href="/"><svg viewBox="0 0 10 10" aria-hidden="true"><rect width="10" height="10" /></svg></AppHeaderBrand>
            </AppHeaderContainer>
            <AppHeaderEnd><button type="button">Create</button></AppHeaderEnd>
          </AppHeader>
        `
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('Brand — label names the product beside the mark', () => {
    const mark = '<svg viewBox="0 0 10 10" aria-hidden="true"><rect width="10" height="10" /></svg>'

    it('draws no label and no data-label when label is empty', () => {
      const { getByTestId, queryByTestId } = render(AppHeader.Brand, {
        props: { href: '/' },
        slots: { default: mark }
      })
      expect(queryByTestId('app-header-brand__label')).toBeNull()
      expect(getByTestId('app-header-brand').hasAttribute('data-label')).toBe(false)
    })

    it('renders the label text after the mark inside the link', () => {
      const { getByTestId } = render(AppHeader.Brand, {
        props: { href: '/', label: 'Docs' },
        slots: { default: mark }
      })
      const brand = getByTestId('app-header-brand')
      const label = getByTestId('app-header-brand__label')
      expect(label.textContent).toBe('Docs')
      expect(brand.contains(label)).toBe(true)
      expect(brand.lastElementChild).toBe(label)
      expect(brand.hasAttribute('data-label')).toBe(true)
    })

    it('names the link with the product from the locale catalog and hides the visible label', () => {
      const { getByRole, getByTestId } = render(AppHeader.Brand, {
        props: { href: '/', label: 'Docs' },
        slots: { default: mark }
      })
      expect(getByRole('link', { name: 'Azion Docs home' })).toBe(getByTestId('app-header-brand'))
      expect(getByTestId('app-header-brand__label').getAttribute('aria-hidden')).toBe('true')
    })

    it('keeps a consumer aria-label over the catalog name', () => {
      const { getByRole } = render(AppHeader.Brand, {
        attrs: { 'aria-label': 'WebKit home' },
        props: { href: '/', label: 'WebKit' },
        slots: { default: mark }
      })
      expect(getByRole('link', { name: 'WebKit home' })).toBeTruthy()
    })

    it('leaves the label readable when the brand is not a link', () => {
      const { getByTestId } = render(AppHeader.Brand, {
        props: { label: 'Console' },
        slots: { default: mark }
      })
      const label = getByTestId('app-header-brand__label')
      expect(label.hasAttribute('aria-hidden')).toBe(false)
      expect(getByTestId('app-header-brand').hasAttribute('aria-label')).toBe(false)
    })

    it('carries a consumer test id to the label', () => {
      const { getByTestId } = render(AppHeader.Brand, {
        attrs: { 'data-testid': 'docs-brand' },
        props: { href: '/', label: 'Docs' },
        slots: { default: mark }
      })
      expect(getByTestId('docs-brand__label').textContent).toBe('Docs')
    })

    it('With label example names the Console home link and has no violations', async () => {
      const { container, getByRole, getByTestId } = render(WithLabel)
      expect(getByRole('link', { name: 'Azion Console home' })).toBeTruthy()
      expect(getByTestId('app-header-brand__label').textContent).toBe('Console')
      await expectNoA11yViolations(container)
    })
  })

  describe('Account — the account control at the end of the bar', () => {
    it('is a named button drawing the account initials, and emits click', async () => {
      const onClick = vi.fn()
      const { getByRole, getByTestId } = render(AppHeaderAccount, {
        props: { name: 'Jane Doe', onClick }
      })
      const control = getByRole('button', { name: 'Account menu' })
      expect(control.getAttribute('data-testid')).toBe('app-header-account')
      expect(getByTestId('avatar').textContent?.trim()).toBe('JD')
      await userEvent.click(control)
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick.mock.calls[0]?.[0]).toBeInstanceOf(MouseEvent)
    })

    it('takes a consumer aria-label and data-testid', () => {
      const { getByRole } = render(AppHeaderAccount, {
        props: { name: 'Jane Doe', ariaLabel: 'Account settings' },
        attrs: { 'data-testid': 'my-account' }
      })
      expect(getByRole('button', { name: 'Account settings' }).getAttribute('data-testid')).toBe(
        'my-account'
      )
    })

    it('opens the account menu from DropdownMenu.Trigger, with the trigger state on the button', async () => {
      const { container } = render(WithAccount)
      const control = screen.getByRole('button', { name: 'Account menu' })
      expect(control.getAttribute('aria-haspopup')).toBe('menu')
      expect(control.getAttribute('aria-expanded')).toBe('false')
      await userEvent.click(control)
      expect(control.getAttribute('aria-expanded')).toBe('true')
      expect(screen.getByRole('menuitem', { name: 'Log out' })).toBeTruthy()
      await userEvent.keyboard('{Escape}')
      expect(control.getAttribute('aria-expanded')).toBe('false')
      await expectNoA11yViolations(container)
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
            <AppHeaderEnd><button type="button">Start for free</button></AppHeaderEnd>
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
      expect(getByTestId('app-header-start')).toBeTruthy()
      expect(getByTestId('app-header-brand')).toBeTruthy()
      expect(getByTestId('app-header-center')).toBeTruthy()
      expect(getByTestId('app-header-end')).toBeTruthy()
    })

    it('Default story has no a11y violations', async () => {
      const { container } = render(DefaultHeader)
      await expectNoA11yViolations(container)
    })

    it('Content zone story renders the full-bleed content placement', () => {
      const { getByTestId } = render(ContentZone)
      const root = getByTestId('app-header')
      // data-variant is what carries the boundary inset instead of the shell step.
      expect(root.getAttribute('data-variant')).toBe('content')
      expect(root.contains(getByTestId('app-header-start'))).toBe(true)
      expect(root.contains(getByTestId('app-header-end'))).toBe(true)
    })

    it('Content zone story has no a11y violations', async () => {
      const { container } = render(ContentZone)
      await expectNoA11yViolations(container)
    })

    it('Site placement story renders the capped, centred regions on the site column', () => {
      const { getByTestId } = render(SitePlacement)
      const root = getByTestId('app-header')
      expect(root.getAttribute('data-variant')).toBe('site')
      expect(root.contains(getByTestId('app-header-brand'))).toBe(true)
      expect(root.contains(getByTestId('app-header-center'))).toBe(true)
      expect(root.contains(getByTestId('app-header-end'))).toBe(true)
    })

    it('Site placement story has no a11y violations', async () => {
      const { container } = render(SitePlacement)
      await expectNoA11yViolations(container)
    })
  })
})
