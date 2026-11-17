import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, h } from 'vue'

import Default from '../../../../examples/integration-card/default.vue'
import Featured from '../../../../examples/integration-card/featured.vue'
import Installed from '../../../../examples/integration-card/installed.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../provider/webkit-provider/webkit-provider.vue'
import IntegrationCard from './integration-card.vue'

describe('IntegrationCard', () => {
  it('renders the root with the default data-testid and lets a consumer one win', () => {
    const view = render(IntegrationCard, { props: { title: 'Request Signer' } })
    expect(view.getByTestId('integration-card').tagName).toBe('SECTION')
    view.unmount()
    const custom = render(IntegrationCard, {
      props: { title: 'Request Signer' },
      attrs: { 'data-testid': 'signer' }
    })
    expect(custom.getByTestId('signer')).toBeTruthy()
    expect(custom.getByTestId('signer__title')).toBeTruthy()
    expect(custom.queryByTestId('integration-card')).toBeNull()
  })

  it('renders default slot content under the description', () => {
    const view = render(IntegrationCard, {
      props: { title: 'Request Signer', description: 'Sign every request.' },
      slots: { default: '<p>Extra</p>' }
    })
    expect(view.getByText('Extra')).toBeTruthy()
  })

  const tile = {
    title: 'Request Signer',
    vendor: 'Acme Inc.',
    logo: 'az az-key',
    description: 'Sign every request at the edge.',
    badges: [{ label: 'Firewall' }, { label: 'Paid', severity: 'warning' as const }]
  }

  it('lays the tile out from props, with the title as an h3 and no header region', () => {
    const view = render(IntegrationCard, { props: tile })

    expect(view.queryByTestId('integration-card__header')).toBeNull()
    expect(view.getByRole('heading', { level: 3 })).toHaveTextContent('Request Signer')
    expect(view.getByTestId('integration-card__vendor')).toHaveTextContent('by Acme Inc.')
    expect(view.getByText('Sign every request at the edge.')).toBeTruthy()
    expect(view.getByText('Firewall')).toBeTruthy()
    expect(view.getByText('Paid')).toBeTruthy()
    expect(view.getByTestId('integration-card__logo').querySelector('.az-key')).toBeTruthy()
    expect(view.queryByTestId('integration-card__installed')).toBeNull()
  })

  it('renders a badge as info by default, by its severity, or by its brand variant', () => {
    const view = render(IntegrationCard, {
      props: {
        ...tile,
        badges: [
          { label: 'Firewall' },
          { label: 'Paid', severity: 'warning' as const },
          { label: 'New', variant: 'primary' as const }
        ]
      }
    })

    const tagOf = (label: string) => view.getByText(label).closest('[data-testid="tag"]')
    expect(tagOf('Firewall')?.getAttribute('data-severity')).toBe('info')
    expect(tagOf('Paid')?.getAttribute('data-severity')).toBe('warning')
    expect(tagOf('New')?.getAttribute('data-variant')).toBe('primary')
    expect(tagOf('New')?.hasAttribute('data-severity')).toBe(false)
  })

  it('emits select from the title button, by click and by keyboard', async () => {
    const view = render(IntegrationCard, { props: tile })
    const target = view.getByRole('button', { name: 'Request Signer' })

    await fireEvent.click(target)
    target.focus()
    await userEvent.keyboard('{Enter}')

    expect(view.emitted('select')).toHaveLength(2)
  })

  it('renders the title as a link when href is set', () => {
    const view = render(IntegrationCard, {
      props: { ...tile, href: '/marketplace/request-signer' }
    })

    expect(view.getByRole('link', { name: 'Request Signer' })).toHaveAttribute(
      'href',
      '/marketplace/request-signer'
    )
    expect(view.queryByRole('button', { name: 'Request Signer' })).toBeNull()
  })

  it('keeps the action its own target above the stretched title', async () => {
    const view = render(IntegrationCard, {
      props: tile,
      slots: { actions: '<button type="button">Install</button>' }
    })

    await fireEvent.click(view.getByRole('button', { name: 'Install' }))

    expect(view.emitted('select')).toBeUndefined()
    expect(view.getByTestId('integration-card__actions').className).toContain('relative')
  })

  it('shows the installed state', () => {
    const view = render(IntegrationCard, { props: { ...tile, installed: true } })

    expect(view.getByTestId('integration-card__installed')).toHaveTextContent('Installed')
  })

  it('takes an image in the logo slot', () => {
    const view = render(IntegrationCard, {
      props: tile,
      slots: { logo: '<img src="data:," alt="" />' }
    })

    expect(view.getByTestId('integration-card__logo').querySelector('img')).toBeTruthy()
    expect(view.getByTestId('integration-card__logo').querySelector('.az-key')).toBeNull()
  })

  it('reads its strings from the provider locale', () => {
    const view = render(
      defineComponent({
        setup: () => () =>
          h(
            WebkitProvider,
            { locale: 'pt-BR', catalogs: LOCALES },
            { default: () => h(IntegrationCard, { ...tile, installed: true }) }
          )
      })
    )

    expect(view.getByTestId('integration-card__vendor')).toHaveTextContent('por Acme Inc.')
    expect(view.getByTestId('integration-card__installed')).toHaveTextContent('Instalado')
  })

  it('keeps the layout under dir="rtl"', async () => {
    const view = render(
      defineComponent({
        setup: () => () =>
          h('div', { dir: 'rtl' }, [
            h(IntegrationCard, tile, { actions: () => h('button', { type: 'button' }, 'Install') })
          ])
      })
    )

    expect(view.getByTestId('integration-card__actions').className).toContain('ms-auto')
    await expectNoA11yViolations(view.container)
  })

  it('lays out the featured tile: corner badges default to primary, a glow, and the title still selects', async () => {
    const view = render(IntegrationCard, { props: { ...tile, featured: true } })
    const root = view.getByTestId('integration-card')

    expect(root).toHaveAttribute('data-featured')
    expect(view.getByTestId('integration-card__glow')).toHaveAttribute('aria-hidden', 'true')
    const badges = view.getByTestId('integration-card__badges')
    expect(badges.textContent).toContain('Firewall')
    expect(badges.textContent).toContain('Paid')
    expect(view.getAllByText('Firewall')).toHaveLength(1)
    expect(view.getByRole('heading', { level: 3 })).toHaveTextContent('Request Signer')
    expect(view.getByTestId('integration-card__vendor')).toHaveTextContent('by Acme Inc.')

    await fireEvent.click(view.getByRole('button', { name: 'Request Signer' }))
    expect(view.emitted('select')).toHaveLength(1)
  })

  it('keeps the installed tag and the action in the featured layout', () => {
    const view = render(IntegrationCard, {
      props: { ...tile, featured: true, installed: true },
      slots: { actions: '<button type="button">Configure</button>' }
    })

    expect(view.getByTestId('integration-card__installed')).toHaveTextContent('Installed')
    expect(view.getByRole('button', { name: 'Configure' })).toBeTruthy()
  })

  it('has no axe violations in the Featured example', async () => {
    const view = render(Featured)
    await expectNoA11yViolations(view.container)
    await fireEvent.click(view.getByRole('button', { name: 'Bot Shield' }))
    expect(view.getByRole('status')).toHaveTextContent('Opened Bot Shield')
  })

  it('has no axe violations in the Default and Installed examples', async () => {
    const one = render(Default)
    await expectNoA11yViolations(one.container)
    one.unmount()
    const two = render(Installed)
    await expectNoA11yViolations(two.container)
  })
})
