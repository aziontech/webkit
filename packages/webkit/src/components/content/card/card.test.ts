import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, h } from 'vue'

import Default from '../../../../examples/card/default.vue'
import Installed from '../../../../examples/card/installed.vue'
import Integration from '../../../../examples/card/integration.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import Card from './card.vue'

const TESTID = 'content-card'

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

  it('renders content slot markup inside the content region', () => {
    const { getByTestId, getByText } = render(Card, {
      slots: { content: '<p>Body copy</p>' }
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
        slots: { 'header-action': '<button>Act</button>' }
      })
      // header region shows (header-action present) but no title element.
      expect(queryByTestId(`${TESTID}__header`)).toBeTruthy()
      expect(queryByTestId(`${TESTID}__title`)).toBeNull()
    })

    it('renders the header-action region in the default header when its slot is provided', () => {
      const { getByTestId, getByText } = render(Card, {
        props: { title: 'Overview' },
        slots: { 'header-action': '<button>Edit</button>' }
      })
      const action = getByTestId(`${TESTID}__header-action`)
      expect(action.contains(getByText('Edit'))).toBe(true)
    })

    it('omits the header-action region when its slot is absent', () => {
      const { queryByTestId } = render(Card, { props: { title: 'Overview' } })
      expect(queryByTestId(`${TESTID}__header-action`)).toBeNull()
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
        slots: { content: '<p>Body copy for the card region.</p>' }
      })
      await expectNoA11yViolations(container)
    })

    it('has no violations with the default header (title) and footer', async () => {
      const { container } = render(Card, {
        props: { title: 'Account settings' },
        slots: {
          'header-action': '<button type="button">Edit</button>',
          content: '<p>Body copy for the card region.</p>',
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
})

describe('Card on devices', () => {
  it('makes its content region a named container', () => {
    const view = render(Card, { props: { title: 'Usage' }, slots: { content: 'Body' } })

    expect(view.getByTestId('content-card__content').className).toContain('@container/card')
  })

  it('keeps the header action visible where there is no hover', () => {
    const view = render(Card, {
      props: { title: 'Usage' },
      slots: { 'header-action': '<button type="button">Edit</button>' }
    })

    expect(view.getByTestId('content-card__header-action').className).toContain(
      '[@media(hover:none)]:opacity-100'
    )
  })
})

describe('Card integration kind', () => {
  const integration = {
    kind: 'integration' as const,
    title: 'Request Signer',
    vendor: 'Northwind Labs',
    logo: 'pi pi-key',
    description: 'Sign every request at the edge.',
    badges: [{ label: 'Firewall' }, { label: 'Paid', severity: 'warning' as const }]
  }

  it('lays the tile out from props, with the title as an h3 and no header region', () => {
    const view = render(Card, { props: integration })

    expect(view.queryByTestId('content-card__header')).toBeNull()
    expect(view.getByRole('heading', { level: 3 })).toHaveTextContent('Request Signer')
    expect(view.getByTestId('content-card__vendor')).toHaveTextContent('by Northwind Labs')
    expect(view.getByText('Sign every request at the edge.')).toBeTruthy()
    expect(view.getByText('Firewall')).toBeTruthy()
    expect(view.getByText('Paid')).toBeTruthy()
    expect(view.getByTestId('content-card__logo').querySelector('.pi-key')).toBeTruthy()
    expect(view.queryByTestId('content-card__installed')).toBeNull()
  })

  it('emits select from the title button, by click and by keyboard', async () => {
    const view = render(Card, { props: integration })
    const target = view.getByRole('button', { name: 'Request Signer' })

    await fireEvent.click(target)
    target.focus()
    await userEvent.keyboard('{Enter}')

    expect(view.emitted('select')).toHaveLength(2)
  })

  it('renders the title as a link when href is set', () => {
    const view = render(Card, { props: { ...integration, href: '/marketplace/request-signer' } })

    expect(view.getByRole('link', { name: 'Request Signer' })).toHaveAttribute(
      'href',
      '/marketplace/request-signer'
    )
    expect(view.queryByRole('button', { name: 'Request Signer' })).toBeNull()
  })

  it('keeps the action its own target above the stretched title', async () => {
    const view = render(Card, {
      props: integration,
      slots: { action: '<button type="button">Install</button>' }
    })

    await fireEvent.click(view.getByRole('button', { name: 'Install' }))

    expect(view.emitted('select')).toBeUndefined()
    expect(view.getByTestId('content-card__action').className).toContain('relative')
  })

  it('shows the installed state', () => {
    const view = render(Card, { props: { ...integration, installed: true } })

    expect(view.getByTestId('content-card__installed')).toHaveTextContent('Installed')
  })

  it('takes an image in the logo slot', () => {
    const view = render(Card, {
      props: integration,
      slots: { logo: '<img src="data:," alt="" />' }
    })

    expect(view.getByTestId('content-card__logo').querySelector('img')).toBeTruthy()
    expect(view.getByTestId('content-card__logo').querySelector('.pi-key')).toBeNull()
  })

  it('reads its strings from the provider locale', () => {
    const view = render(
      defineComponent({
        setup: () => () =>
          h(
            WebkitProvider,
            { locale: 'pt-BR', catalogs: LOCALES },
            { default: () => h(Card, { ...integration, installed: true }) }
          )
      })
    )

    expect(view.getByTestId('content-card__vendor')).toHaveTextContent('por Northwind Labs')
    expect(view.getByTestId('content-card__installed')).toHaveTextContent('Instalado')
  })

  it('keeps the layout under dir="rtl"', async () => {
    const view = render(
      defineComponent({
        setup: () => () =>
          h('div', { dir: 'rtl' }, [
            h(Card, integration, { action: () => h('button', { type: 'button' }, 'Install') })
          ])
      })
    )

    expect(view.getByTestId('content-card__action').className).toContain('ms-auto')
    await expectNoA11yViolations(view.container)
  })

  it('has no axe violations in the Integration and Installed examples', async () => {
    const one = render(Integration)
    await expectNoA11yViolations(one.container)
    one.unmount()
    const two = render(Installed)
    await expectNoA11yViolations(two.container)
  })
})
