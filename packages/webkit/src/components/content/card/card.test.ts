import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'

import Default from '../../../../examples/card/default.vue'
import LinkCard from '../../../../examples/card/link.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Card from './card.vue'

const TESTID = 'card'

describe('Card', () => {
  it('renders the root section with the default data-testid', () => {
    const { getByTestId } = render(Card)
    const root = getByTestId(TESTID)
    expect(root.tagName).toBe('SECTION')
  })

  it('honours a consumer-supplied data-testid on the root and derived regions', () => {
    const { getByTestId } = render(Card, {
      attrs: { 'data-testid': 'my-card' },
      props: { title: 'Titled' }
    })
    expect(getByTestId('my-card').tagName).toBe('SECTION')
    // Derived testids follow the overridden root testid.
    expect(getByTestId('my-card__header')).toBeTruthy()
    expect(getByTestId('my-card__title')).toBeTruthy()
    expect(getByTestId('my-card__content')).toBeTruthy()
  })

  it('always renders the content region', () => {
    const { getByTestId } = render(Card)
    expect(getByTestId(`${TESTID}__content`)).toBeTruthy()
  })

  it('renders default slot children as the body and ignores the removed content slot', () => {
    const plain = render(Card, { slots: { default: '<p>Default body</p>' } })
    expect(plain.getByTestId(`${TESTID}__content`).textContent).toContain('Default body')
    plain.unmount()
    const legacy = render(Card, { slots: { content: '<p>Named body</p>' } })
    expect(legacy.getByTestId(`${TESTID}__content`).textContent).not.toContain('Named body')
  })

  it('renders default slot markup inside the content region', () => {
    const { getByTestId, getByText } = render(Card, {
      slots: { default: '<p>Body copy</p>' }
    })
    const content = getByTestId(`${TESTID}__content`)
    expect(content.textContent).toContain('Body copy')
    expect(content.contains(getByText('Body copy'))).toBe(true)
  })

  describe('header region', () => {
    it('omits the header region entirely with no title and no header slots', () => {
      const { queryByTestId } = render(Card)
      expect(queryByTestId(`${TESTID}__header`)).toBeNull()
    })

    it('omits the header region when title is only whitespace', () => {
      const { queryByTestId } = render(Card, { props: { title: '   ' } })
      expect(queryByTestId(`${TESTID}__header`)).toBeNull()
    })

    it('renders the default header with an h2 title when title is set', () => {
      const { getByTestId } = render(Card, { props: { title: 'Overview' } })
      const header = getByTestId(`${TESTID}__header`)
      expect(header.tagName).toBe('HEADER')
      const title = getByTestId(`${TESTID}__title`)
      expect(title.tagName).toBe('H2')
      expect(title.textContent).toContain('Overview')
    })

    it('does not render the title node when title is empty', () => {
      const { queryByTestId } = render(Card, {
        slots: { 'header-actions': '<button>Act</button>' }
      })
      // header region shows (header-actions present) but no title element.
      expect(queryByTestId(`${TESTID}__header`)).toBeTruthy()
      expect(queryByTestId(`${TESTID}__title`)).toBeNull()
    })

    it('renders the header-actions region in the default header when its slot is provided', () => {
      const { getByTestId, getByText } = render(Card, {
        props: { title: 'Overview' },
        slots: { 'header-actions': '<button>Edit</button>' }
      })
      const action = getByTestId(`${TESTID}__header-actions`)
      expect(action.contains(getByText('Edit'))).toBe(true)
    })

    it('omits the header-actions region when its slot is absent', () => {
      const { queryByTestId } = render(Card, { props: { title: 'Overview' } })
      expect(queryByTestId(`${TESTID}__header-actions`)).toBeNull()
    })

    it('uses the header slot verbatim and suppresses the default title layout', () => {
      const { getByTestId, getByText, queryByTestId } = render(Card, {
        props: { title: 'Ignored' },
        slots: { header: '<span>Custom header</span>' }
      })
      const header = getByTestId(`${TESTID}__header`)
      expect(header.contains(getByText('Custom header'))).toBe(true)
      // Default title layout is suppressed when the header slot is used.
      expect(queryByTestId(`${TESTID}__title`)).toBeNull()
      expect(header.textContent).not.toContain('Ignored')
    })
  })

  describe('footer region', () => {
    it('omits the footer region when the footer slot is absent', () => {
      const { queryByTestId } = render(Card)
      expect(queryByTestId(`${TESTID}__footer`)).toBeNull()
    })

    it('renders the footer region with slot content when the footer slot is provided', () => {
      const { getByTestId, getByText } = render(Card, {
        slots: { footer: '<button>Save</button>' }
      })
      const footer = getByTestId(`${TESTID}__footer`)
      expect(footer.tagName).toBe('FOOTER')
      expect(footer.contains(getByText('Save'))).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('has no violations for the content-only card', async () => {
      const { container } = render(Card, {
        slots: { default: '<p>Body copy for the card region.</p>' }
      })
      await expectNoA11yViolations(container)
    })

    it('has no violations with the default header (title) and footer', async () => {
      const { container } = render(Card, {
        props: { title: 'Account settings' },
        slots: {
          'header-actions': '<button type="button">Edit</button>',
          default: '<p>Body copy for the card region.</p>',
          footer: '<button type="button">Save</button>'
        }
      })
      await expectNoA11yViolations(container)
    })
  })

  it('renders the composed Default story fixture', () => {
    const { getByTestId, getByText } = render(Default)
    expect(getByTestId(TESTID)).toBeTruthy()
    // The story sets title "Card Title" and fills the content slot.
    expect(getByTestId(`${TESTID}__title`).textContent).toContain('Card Title')
    expect(getByText(/Card body content/)).toBeTruthy()
  })

  describe('on devices', () => {
    it('makes its content region a named container', () => {
      const view = render(Card, { props: { title: 'Usage' }, slots: { default: 'Body' } })

      expect(view.getByTestId('card__content').className).toContain('@container/card')
    })

    it('keeps the header action visible where there is no hover', () => {
      const view = render(Card, {
        props: { title: 'Usage' },
        slots: { 'header-actions': '<button type="button">Edit</button>' }
      })

      expect(view.getByTestId('card__header-actions').className).toContain(
        '[@media(hover:none)]:opacity-100'
      )
    })
  })

  it('has no integration layout and no variant attribute', () => {
    const view = render(Card, { props: { title: 'Plan' } })
    expect(view.getByTestId('card')).not.toHaveAttribute('data-variant')
    expect(view.queryByTestId('card__logo')).toBeNull()
  })

  describe('slot presence', () => {
    it('follows a v-if slot that appears and disappears after mount', async () => {
      const shown = ref(false)
      const { queryByTestId } = render({
        components: { Card },
        setup: () => ({ shown }),
        template: `<Card title="Plan"><template v-if="shown" #footer><span data-testid="probe">Slotted</span></template></Card>`
      })
      expect(queryByTestId('card__footer')).toBeNull()

      shown.value = true
      await nextTick()
      expect(queryByTestId('card__footer')).not.toBeNull()
      expect(queryByTestId('probe')).not.toBeNull()

      shown.value = false
      await nextTick()
      expect(queryByTestId('card__footer')).toBeNull()
      expect(queryByTestId('probe')).toBeNull()
    })
  })

  describe('href — the whole card is one link', () => {
    it('renders the root as an anchor named by its text', async () => {
      const { container, getByRole } = render(LinkCard)
      const link = getByRole('link', { name: /^Nuxt E-commerce/ })
      expect(link.getAttribute('href')).toBe('/create/templates/nuxt-ecommerce')
      expect(link.getAttribute('data-testid')).toBe('card')
      expect(link.hasAttribute('data-link')).toBe(true)
      expect(container.querySelector('section')).toBeNull()
      await expectNoA11yViolations(container)
    })

    it('keeps the section root without href or with an unsafe one', () => {
      const plain = render(Card, { props: { title: 'Plain' } })
      expect(plain.container.querySelector('section[data-testid="card"]')).toBeTruthy()
      expect(plain.queryByRole('link')).toBeNull()
      plain.unmount()
      const unsafe = render(Card, { props: { title: 'Unsafe', href: 'javascript:alert(1)' } })
      expect(unsafe.queryByRole('link')).toBeNull()
      expect(unsafe.container.querySelector('[data-link]')).toBeNull()
    })
  })
})
