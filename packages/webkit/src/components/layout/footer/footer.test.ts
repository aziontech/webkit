import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/layout/footer/Footer.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Footer from './index'

const { DefaultFooter } = composeStories(stories)

/**
 * footer is a COMPOSITION component: `index.ts` attaches Column and Link onto
 * the root via Object.assign, and the root provides { testId } through
 * FooterInjectionKey. Each sub-component injects that context and derives its
 * own testid as `${ctx.testId}__<part>`, so overriding the root testid proves
 * provide/inject flows through the whole tree.
 *
 * The root has no emits and no v-model — the only prop is `ariaLabel` — so this
 * file asserts the compound API resolution, the injected-state propagation, slot
 * placement (including the conditional social bar), testid derivation/override,
 * the landmark a11y contract, and axe.
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

// A minimal but realistic composed tree exercising columns, links, and both
// social-bar clusters.
const composedTemplate = `
  <Footer>
    <FooterColumn title="Products">
      <FooterLink href="/products/edge-application">Edge Application</FooterLink>
      <FooterLink href="/products/edge-firewall">Edge Firewall</FooterLink>
    </FooterColumn>
    <FooterColumn title="Company">
      <FooterLink href="/about">About us</FooterLink>
    </FooterColumn>
    <template #social-start>
      <a href="/" aria-label="Azion home"><svg viewBox="0 0 10 10"><rect width="10" height="10" /></svg></a>
    </template>
    <template #social-end>
      <a href="https://status.azion.com/">All Systems Operational</a>
    </template>
  </Footer>
`

const renderComposed = (options = {}) =>
  render({ components: compoundComponents, template: composedTemplate }, options)

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
      const root = getByTestId('layout-footer')
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
      expect(getByTestId('layout-footer').getAttribute('aria-label')).toBe('Site footer')
      expect(getByRole('contentinfo', { name: 'Site footer' })).toBe(getByTestId('layout-footer'))
    })

    it('renders default slot content inside the columns region', () => {
      const { getByTestId } = render(Footer, {
        slots: { default: '<span data-testid="slotted">columns</span>' }
      })
      expect(getByTestId('layout-footer__columns').contains(getByTestId('slotted'))).toBe(true)
    })

    it('omits the social bar when neither social slot is provided', () => {
      const { queryByTestId } = render(Footer, {
        slots: { default: '<span>columns</span>' }
      })
      expect(queryByTestId('layout-footer__social')).toBeNull()
    })

    it('renders the social bar with each cluster in place when the slots are provided', () => {
      const { getByTestId, getByText } = renderComposed()
      const social = getByTestId('layout-footer__social')
      expect(social.contains(getByText('All Systems Operational'))).toBe(true)
      expect(social.querySelector('a[aria-label="Azion home"]')).toBeTruthy()
    })

    it('renders the social bar when only social-start is provided', () => {
      const { getByTestId } = render({
        components: compoundComponents,
        template: `
          <Footer>
            <template #social-start>
              <a href="/" aria-label="Azion home">Azion</a>
            </template>
          </Footer>
        `
      })
      expect(getByTestId('layout-footer__social')).toBeTruthy()
    })

    it('renders the social bar when only social-end is provided', () => {
      const { getByTestId } = render({
        components: compoundComponents,
        template: `
          <Footer>
            <template #social-end>
              <a href="https://status.azion.com/">All Systems Operational</a>
            </template>
          </Footer>
        `
      })
      expect(getByTestId('layout-footer__social')).toBeTruthy()
    })
  })

  describe('provide/inject — the root testId flows to every part', () => {
    it('derives each part testid from the root fallback testId', () => {
      const { getAllByTestId } = renderComposed()
      // Root fallback is 'layout-footer'; each part appends its own suffix.
      expect(getAllByTestId('layout-footer__column')).toHaveLength(2)
      expect(getAllByTestId('layout-footer__link')).toHaveLength(3)
    })

    it('overriding the root data-testid re-keys every injected part (proves shared state)', () => {
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

      // Root uses the overridden value; each part derives from the injected ctx.testId.
      expect(getByTestId('site-footer').tagName).toBe('FOOTER')
      expect(getByTestId('site-footer__column')).toBeTruthy()
      expect(getByTestId('site-footer__link')).toBeTruthy()

      // The fallback keys no longer exist — the injected value drove every part.
      expect(queryByTestId('layout-footer')).toBeNull()
      expect(queryByTestId('layout-footer__column')).toBeNull()
      expect(queryByTestId('layout-footer__link')).toBeNull()
    })

    it('a part rendered without a root falls back to the literal default testId', () => {
      // No provider => inject() is null => ctx?.testId ?? 'layout-footer'.
      const { getByTestId } = render(Footer.Column, {
        props: { title: 'Products' },
        slots: { default: '<a href="/products">Products</a>' }
      })
      expect(getByTestId('layout-footer__column').tagName).toBe('NAV')
    })

    it('lets a part override its own testid independent of the injected context', () => {
      const { getByTestId, queryByTestId } = render({
        components: compoundComponents,
        template:
          '<Footer><FooterColumn title="Products" data-testid="my-column">C</FooterColumn></Footer>'
      })
      // The sub-component prefers its own attrs['data-testid'] over the derived value.
      expect(getByTestId('my-column').tagName).toBe('NAV')
      expect(queryByTestId('layout-footer__column')).toBeNull()
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

  describe('a11y (axe against the styled, composed tree)', () => {
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

  describe('composeStories (the Default story fixture runs in-test)', () => {
    it('Default story renders the landmark with its columns and social bar', () => {
      const { getByRole, getByTestId, getAllByTestId } = render(DefaultFooter)
      expect(getByRole('contentinfo', { name: 'Footer' })).toBeTruthy()
      expect(getAllByTestId('layout-footer__column')).toHaveLength(4)
      expect(getByTestId('layout-footer__social')).toBeTruthy()
    })

    it('Default story has no a11y violations', async () => {
      const { container } = render(DefaultFooter)
      await expectNoA11yViolations(container)
    })
  })
})
