import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import Arts from '../../../../examples/backdrop/arts.vue'
import Default from '../../../../examples/backdrop/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Backdrop from './backdrop.vue'

describe('Backdrop', () => {
  it('draws the backdrop from variant and ignores the removed art prop', () => {
    const { getByTestId } = render(Backdrop, { attrs: { art: 'globe' } })
    expect(getByTestId('backdrop')).toHaveAttribute('data-variant', 'map')
    expect(getByTestId('backdrop')).not.toHaveAttribute('data-art')
  })

  it('defaults to the map backdrop and hides it from assistive technology', () => {
    const { getByTestId } = render(Backdrop)
    const root = getByTestId('backdrop')
    expect(root).toHaveAttribute('data-variant', 'map')
    expect(root).toHaveAttribute('aria-hidden', 'true')
    expect(root.querySelector('[data-testid="network-map"]')).toHaveAttribute(
      'data-region',
      'atlantic'
    )
  })

  it('draws the globe over the dot lattice', () => {
    const { getByTestId } = render(Backdrop, { props: { variant: 'globe' } })
    const root = getByTestId('backdrop')
    expect(root.querySelector('[data-testid="spinning-globe"]')).not.toBeNull()
    expect(root.querySelector('[data-testid="texture"]')).not.toBeNull()
  })

  it('lays the network map full bleed with its PoPs lit', () => {
    const { getByTestId } = render(Backdrop, { props: { variant: 'network' } })
    const map = getByTestId('backdrop').querySelector('[data-testid="network-map"]')
    expect(map).toHaveAttribute('data-density', 'high')
  })

  it('passes animated through so the art can hold a still frame', () => {
    const { getByTestId } = render(Backdrop, { props: { variant: 'map', animated: false } })
    const map = getByTestId('backdrop').querySelector('[data-testid="network-map"]')
    expect(map?.querySelector('[data-animated]')).toBeNull()
  })

  it.each(['map', 'network'] as const)(
    'fades the %s art with an alpha mask, never a canvas-coloured wash',
    (variant) => {
      const { getByTestId } = render(Backdrop, { props: { variant } })
      const root = getByTestId('backdrop')

      expect(root.innerHTML).not.toContain('var(--bg-canvas)')
      const fade = root.querySelector('[data-slot="backdrop-fade"]')
      expect(fade?.classList.contains('[mask-composite:intersect]')).toBe(true)
      expect(fade?.querySelector('[data-testid="network-map"]')).not.toBeNull()
    }
  )

  it('mirrors its washes under rtl', () => {
    const { getByTestId } = render({
      render: () => h('div', { dir: 'rtl' }, [h(Backdrop, { variant: 'globe' })])
    })
    expect(getByTestId('backdrop').innerHTML).toContain('rtl:-translate-x-1/2')
  })

  it('has no axe violations behind a hero and alone', async () => {
    const hero = render(Default)
    await expectNoA11yViolations(hero.container)
    hero.unmount()
    const { container } = render(Arts)
    await expectNoA11yViolations(container)
  })
})
