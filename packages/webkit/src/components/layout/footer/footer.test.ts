import { render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'

import DefaultFooter from '../../../../examples/footer/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Footer from './index'

/**
 * footer is a COMPOSITION component: `index.ts` attaches Column and Link onto
 * the root via Object.assign, and the root provides { testId } through
 * FooterInjectionKey. Each sub-component injects that context and derives its
 * own testid as `${ctx.testId}__<part>`, so overriding the root testid proves
 * provide/inject flows through the whole tree.
 *
 * The root has no emits and no v-model — its props are `ariaLabel` and `variant` — so
 * this file asserts the compound API resolution, the injected-state propagation, slot
 * placement (including each conditional band), the two placements and the frame parts
 * each one renders, testid derivation/override, the landmark a11y contract, and axe.
 */

// The runtime string-template compiler resolves component tags from the
// `components` map by tag name — it does not walk `Footer.Column` member
// access the way the SFC compiler does. So register each part under a
// PascalCase tag pointing at the compound member (the same shape the story uses).
const compoundComponents = {
  Footer,
  FooterColumn: Footer.Column,
  FooterLink: Footer.Link
}

// A minimal but realistic composed tree exercising columns, links, and all four
// consumer-filled bands: the social icons, the status/language pair, and the
// signature's brand and tagline.
const composedBands = `
    <FooterColumn title="Products">
      <FooterLink href="/products/edge-application">Edge Application</FooterLink>
      <FooterLink href="/products/edge-firewall">Edge Firewall</FooterLink>
    </FooterColumn>
    <FooterColumn title="Company">
      <FooterLink href="/about">About us</FooterLink>
    </FooterColumn>
    <template #social>
      <a href="https://github.com/aziontech" aria-label="Azion on GitHub"><svg viewBox="0 0 10 10"><rect width="10" height="10" /></svg></a>
    </template>
    <template #status>
      <a href="https://status.azion.com/">All Systems Operational</a>
    </template>
    <template #language>
      <button type="button">EN</button>
    </template>
    <template #brand>
      <a href="/" aria-label="Azion home"><svg viewBox="0 0 10 10"><rect width="10" height="10" /></svg></a>
    </template>
    <template #tagline>The web platform for modern workloads</template>
`

// Same tree in either placement, so a difference in what renders can only come from
// `variant` — which is the whole claim: the bands are identical and the FRAME is not.
const composedTemplate = `<Footer>${composedBands}</Footer>`
const composedSiteTemplate = `<Footer variant="site">${composedBands}</Footer>`

const renderComposed = (options = {}) =>
  render({ components: compoundComponents, template: composedTemplate }, options)

const renderComposedSite = (options = {}) =>
  render({ components: compoundComponents, template: composedSiteTemplate }, options)

describe('Footer', () => {
  describe('compound API (index.ts Object.assign)', () => {
    it('exposes each part via dot-notation on the root', () => {
      expect(Footer.Column).toBeTruthy()
      expect(Footer.Link).toBeTruthy()
    })

    it('names each sub-component after its anatomy', () => {
      // defineOptions.name on each part .vue.
      expect(Footer.Column.name).toBe('FooterColumn')
      expect(Footer.Link.name).toBe('FooterLink')
    })
  })

  describe('root rendering (grounded in footer.vue)', () => {
    it('renders a <footer> contentinfo landmark carrying the default data-testid', () => {
      const { getByTestId } = render(Footer)
      const root = getByTestId('footer')
      expect(root.tagName).toBe('FOOTER')
    })

    it('exposes a contentinfo landmark named from the default ariaLabel', () => {
      const { getByRole } = render(Footer)
      // Default ariaLabel is 'Footer', bound to aria-label on the landmark.
      expect(getByRole('contentinfo', { name: 'Footer' })).toBeTruthy()
    })

    it('applies a custom ariaLabel to the contentinfo landmark', () => {
      const { getByRole, getByTestId } = render(Footer, {
        props: { ariaLabel: 'Site footer' }
      })
      expect(getByTestId('footer').getAttribute('aria-label')).toBe('Site footer')
      expect(getByRole('contentinfo', { name: 'Site footer' })).toBe(getByTestId('footer'))
    })

    it('renders default slot content inside the columns region', () => {
      const { getByTestId } = render(Footer, {
        slots: { default: '<span data-testid="slotted">columns</span>' }
      })
      expect(getByTestId('footer__columns').contains(getByTestId('slotted'))).toBe(true)
    })

    it('omits every optional band when only columns are provided', () => {
      const { queryByTestId } = render(Footer, {
        slots: { default: '<span>columns</span>' }
      })
      expect(queryByTestId('footer__social')).toBeNull()
      expect(queryByTestId('footer__status')).toBeNull()
      expect(queryByTestId('footer__signature')).toBeNull()
    })

    it('routes each slot to its own band', () => {
      const { getByTestId, getByText } = renderComposed()
      expect(
        getByTestId('footer__social').querySelector('a[aria-label="Azion on GitHub"]')
      ).toBeTruthy()
      const status = getByTestId('footer__status')
      expect(status.contains(getByText('All Systems Operational'))).toBe(true)
      expect(status.contains(getByText('EN'))).toBe(true)
      const signature = getByTestId('footer__signature')
      expect(signature.querySelector('a[aria-label="Azion home"]')).toBeTruthy()
      expect(signature.contains(getByText('The web platform for modern workloads'))).toBe(true)
    })

    it('renders the status band when only the language slot is provided', () => {
      const { getByTestId, queryByTestId } = render({
        components: compoundComponents,
        template: `
          <Footer>
            <template #language>
              <button type="button">EN</button>
            </template>
          </Footer>
        `
      })
      expect(getByTestId('footer__status')).toBeTruthy()
      expect(queryByTestId('footer__social')).toBeNull()
    })

    it('renders the signature band when only the tagline slot is provided', () => {
      const { getByTestId } = render({
        components: compoundComponents,
        template: `
          <Footer>
            <template #tagline>The web platform for modern workloads</template>
          </Footer>
        `
      })
      expect(getByTestId('footer__signature')).toBeTruthy()
    })

    it('drops a band when its slot stops rendering', async () => {
      const shown = ref(true)
      const { queryByTestId } = render({
        components: compoundComponents,
        setup: () => ({ shown }),
        template: `
          <Footer>
            <template v-if="shown" #brand><a href="/" aria-label="Azion home">Azion</a></template>
            <template v-if="shown" #status><span>All Systems Operational</span></template>
          </Footer>
        `
      })
      expect(queryByTestId('footer__signature')).toBeTruthy()
      expect(queryByTestId('footer__status')).toBeTruthy()

      shown.value = false
      await nextTick()

      expect(queryByTestId('footer__signature')).toBeNull()
      expect(queryByTestId('footer__status')).toBeNull()
    })

    it('marks the signature placement on the root, always by default', () => {
      const { getByTestId, unmount } = renderComposed()
      expect(getByTestId('footer')).toHaveAttribute('data-signature', 'always')
      unmount()

      const compact = render({
        components: compoundComponents,
        template: `<Footer signature="compact">${composedBands}</Footer>`
      })
      expect(compact.getByTestId('footer')).toHaveAttribute('data-signature', 'compact')
      expect(compact.getByTestId('footer__signature').className).toContain(
        'group-data-[signature=compact]:lg:hidden'
      )
    })

    it('keeps the hatched gutters out of the a11y tree', () => {
      const { getAllByTestId } = renderComposedSite()
      for (const gutter of getAllByTestId('footer__gutter')) {
        expect(gutter.getAttribute('aria-hidden')).toBe('true')
      }
    })
  })

  describe('variant — the two placements (data-variant drives the cap; the frame is site-only)', () => {
    it('defaults to the content placement', () => {
      const { getByTestId } = render(Footer)
      // withDefaults: variant: 'content' — a footer with no variant closes an app or docs zone,
      // which is the placement that draws no frame. The cap and the side rules are read off
      // this attribute by `group-data-[variant=site]:`; the geometry belongs to the visual gate,
      // since this env renders without Tailwind.
      expect(getByTestId('footer').getAttribute('data-variant')).toBe('content')
    })

    it('marks the site placement on the root', () => {
      const { getByTestId } = render(Footer, { props: { variant: 'site' } })
      expect(getByTestId('footer').getAttribute('data-variant')).toBe('site')
    })

    it('draws no frame in the content placement — no gutters, no rules, no marks', () => {
      const { queryAllByTestId, getByTestId } = renderComposed()
      expect(queryAllByTestId('footer__gutter')).toHaveLength(0)
      const frame = getByTestId('footer__frame')
      expect(frame.getAttribute('data-borders')).toBe('none')
      expect(frame.getAttribute('data-marks')).toBe('none')
    })

    it('frames the column in the site placement, with both gutters beside it', () => {
      const { getAllByTestId, getByTestId } = renderComposedSite()
      expect(getAllByTestId('footer__gutter')).toHaveLength(2)
      const frame = getByTestId('footer__frame')
      expect(frame.getAttribute('data-borders')).toBe('left right')
      expect(frame.getAttribute('data-marks')).toBe('top-left top-right bottom-left bottom-right')
    })

    // Both trees are on the page at once, so every query is scoped to its own
    // container — the default scope is document.body, which would see four columns.
    it('keeps every band in both placements — the frame changes, the content does not', () => {
      for (const { container } of [renderComposed(), renderComposedSite()]) {
        const scope = within(container as HTMLElement)
        expect(scope.getAllByTestId('footer-column')).toHaveLength(2)
        expect(scope.getByTestId('footer__social')).toBeTruthy()
        expect(scope.getByTestId('footer__status')).toBeTruthy()
        expect(scope.getByTestId('footer__signature')).toBeTruthy()
      }
    })

    it('a site footer has no a11y violations either', async () => {
      const { container } = renderComposedSite()
      await expectNoA11yViolations(container)
    })
  })

  describe('provide/inject — the root testId flows to every part', () => {
    it('derives each part testid from the root fallback testId', () => {
      const { getAllByTestId } = renderComposed()
      // Root fallback is 'footer'; each part appends its own suffix.
      expect(getAllByTestId('footer-column')).toHaveLength(2)
      expect(getAllByTestId('footer-link')).toHaveLength(3)
    })

    it('overriding the root data-testid renames only the root', () => {
      const overriddenTemplate = `
        <Footer data-testid="site-footer">
          <FooterColumn title="Products">
            <FooterLink href="/products">Products</FooterLink>
          </FooterColumn>
        </Footer>
      `
      const { getByTestId, queryByTestId } = render({
        components: compoundComponents,
        template: overriddenTemplate
      })

      expect(getByTestId('site-footer').tagName).toBe('FOOTER')
      expect(queryByTestId('footer')).toBeNull()
      expect(getByTestId('footer-column')).toBeTruthy()
      expect(getByTestId('footer-link')).toBeTruthy()
    })

    it('a part rendered without a root keeps its own test id', () => {
      const { getByTestId } = render(Footer.Column, {
        props: { title: 'Products' },
        slots: { default: '<a href="/products">Products</a>' }
      })
      expect(getByTestId('footer-column').tagName).toBe('NAV')
    })

    it('lets a part override its own testid independent of the injected context', () => {
      const { getByTestId, queryByTestId } = render({
        components: compoundComponents,
        template:
          '<Footer><FooterColumn title="Products" data-testid="my-column">C</FooterColumn></Footer>'
      })
      // The sub-component prefers its own attrs['data-testid'] over the derived value.
      expect(getByTestId('my-column').tagName).toBe('NAV')
      expect(queryByTestId('footer-column')).toBeNull()
    })
  })

  describe('FooterColumn — labelled navigation landmark', () => {
    it('renders a <nav> whose accessible name is the title', () => {
      const { getByRole } = renderComposed()
      expect(getByRole('navigation', { name: 'Products' })).toBeTruthy()
      expect(getByRole('navigation', { name: 'Company' })).toBeTruthy()
    })

    it('associates the title to the nav via aria-labelledby', () => {
      const { getByRole } = render(Footer.Column, {
        props: { title: 'Products' }
      })
      const nav = getByRole('navigation', { name: 'Products' })
      const labelId = nav.getAttribute('aria-labelledby')
      expect(labelId).toBeTruthy()
      expect(nav.querySelector(`[id="${labelId}"]`)?.textContent?.trim()).toBe('Products')
    })
  })

  describe('FooterLink — anchor root with href and attribute fallthrough', () => {
    it('renders an <a> pointing at href with the slot as its label', () => {
      const { getByRole } = renderComposed()
      const link = getByRole('link', { name: 'Edge Application' })
      expect(link.getAttribute('href')).toBe('/products/edge-application')
    })

    it('forwards consumer attributes (target, rel) onto the anchor root', () => {
      const { getByRole } = render(Footer.Link, {
        props: { href: 'https://github.com/aziontech' },
        attrs: { target: '_blank', rel: 'noopener noreferrer' },
        slots: { default: 'GitHub' }
      })
      const link = getByRole('link', { name: 'GitHub' })
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    })
  })

  // This env loads no theme CSS and runs no Tailwind (see src/test/setup.ts), so
  // axe here checks semantics only — landmarks, names, ARIA relationships. The
  // footer's contrast lives in the styled visual suite, not in this suite.
  describe('a11y (axe against the composed tree — semantics, not contrast)', () => {
    it('a fully composed footer has no violations', async () => {
      const { container } = renderComposed()
      await expectNoA11yViolations(container)
    })

    it('a custom-labelled footer has no violations', async () => {
      const { container } = render(Footer, {
        props: { ariaLabel: 'Site footer' },
        slots: { default: '<a href="/">Home</a>' }
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('documented example (the Default story fixture runs in-test)', () => {
    it('Default story renders the landmark with its columns and every band', () => {
      const { getByRole, getByTestId, getAllByTestId } = render(DefaultFooter)
      expect(getByRole('contentinfo', { name: 'Footer' })).toBeTruthy()
      expect(getAllByTestId('footer-column')).toHaveLength(4)
      expect(getByTestId('footer__social')).toBeTruthy()
      expect(getByTestId('footer__status')).toBeTruthy()
      expect(getByTestId('footer__signature')).toBeTruthy()
    })

    it('Default story has no a11y violations', async () => {
      const { container } = render(DefaultFooter)
      await expectNoA11yViolations(container)
    })
  })
})
