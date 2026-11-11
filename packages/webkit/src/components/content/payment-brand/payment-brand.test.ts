import { cleanup, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import Brands from '../../../../examples/payment-brand/brands.vue'
import Default from '../../../../examples/payment-brand/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import PaymentBrand from './payment-brand.vue'

afterEach(() => cleanup())

const root = (): HTMLElement =>
  document.body.querySelector<HTMLElement>('[data-testid="content-payment-brand"]')!

describe('PaymentBrand', () => {
  it('names the plate after the brand', () => {
    const view = render(PaymentBrand, { props: { brand: 'visa' } })
    const img = view.getByRole('img', { name: 'Visa' })
    expect(img).toHaveAttribute('data-brand', 'visa')
    expect(img).toHaveAttribute('data-glyph', 'mark')
    expect(img).toHaveAttribute('data-size', 'medium')
    expect(img.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it.each([
    ['American Express', 'amex', 'American Express'],
    ['american_express', 'amex', 'American Express'],
    ['diners_club', 'diners', 'Diners Club'],
    ['Master Card', 'mastercard', 'Mastercard'],
    ['JCB', 'jcb', 'JCB'],
    ['constructor', 'unknown', 'Card']
  ])('normalizes %s to %s', (brand, id, name) => {
    const view = render(PaymentBrand, { props: { brand } })
    expect(view.getByRole('img', { name })).toHaveAttribute('data-brand', id)
  })

  it('draws the generic glyph for a brand without a mark and keeps its name', () => {
    const view = render(PaymentBrand, { props: { brand: 'elo' } })
    const img = view.getByRole('img', { name: 'Elo' })
    expect(img).toHaveAttribute('data-glyph', 'generic')
  })

  it('takes a label and a size', () => {
    const view = render(PaymentBrand, {
      props: { brand: 'visa', label: 'Visa card', size: 'small' }
    })
    expect(view.getByRole('img', { name: 'Visa card' })).toHaveAttribute('data-size', 'small')
  })

  it('hides a decorative plate from assistive technology', () => {
    render(PaymentBrand, { props: { brand: 'visa', decorative: true } })
    expect(root()).toHaveAttribute('aria-hidden', 'true')
    expect(root()).not.toHaveAttribute('role')
    expect(root()).not.toHaveAttribute('aria-label')
  })

  it('draws no hard-coded colour', () => {
    render(Brands)
    const html = document.body.innerHTML
    expect(html).not.toMatch(/#[0-9a-f]{3,8}\b/i)
  })

  it('reads the unknown name from the locale catalog', () => {
    const Host = defineComponent({
      render: () =>
        h(
          WebkitProvider,
          { locale: 'pt-BR', catalogs: LOCALES },
          { default: () => h(PaymentBrand, { brand: '' }) }
        )
    })
    const view = render(Host)
    expect(view.getByRole('img', { name: 'Cartão' })).toBeTruthy()
  })

  it('keeps the mark unmirrored under rtl', () => {
    const view = render({
      render: () => h('div', { dir: 'rtl' }, [h(PaymentBrand, { brand: 'mastercard' })])
    })
    expect(view.getByRole('img', { name: 'Mastercard' }).querySelector('svg')).not.toHaveClass(
      '-scale-x-100'
    )
  })

  it('honors a consumer data-testid', () => {
    const view = render(PaymentBrand, { attrs: { 'data-testid': 'card-plate' } })
    expect(view.getByTestId('card-plate')).toBeTruthy()
  })

  it('has no axe violations', async () => {
    const { container } = render(Default)
    await expectNoA11yViolations(container)
    cleanup()
    const brands = render(Brands)
    await expectNoA11yViolations(brands.container)
  })
})
