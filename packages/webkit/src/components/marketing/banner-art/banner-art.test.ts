import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import Arts from '../../../../examples/banner-art/arts.vue'
import Default from '../../../../examples/banner-art/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import BannerArt from './banner-art.vue'

describe('BannerArt', () => {
  it('draws the backdrop from variant and ignores the removed art prop', () => {
    const { getByTestId } = render(BannerArt, { props: { art: 'globe' } })
    expect(getByTestId('marketing-banner-art')).toHaveAttribute('data-variant', 'map')
    expect(getByTestId('marketing-banner-art')).not.toHaveAttribute('data-art')
  })

  it('defaults to the map backdrop and hides it from assistive technology', () => {
    const { getByTestId } = render(BannerArt)
    const root = getByTestId('marketing-banner-art')
    expect(root).toHaveAttribute('data-variant', 'map')
    expect(root).toHaveAttribute('aria-hidden', 'true')
    expect(root.querySelector('[data-testid="content-network-map"]')).toHaveAttribute(
      'data-region',
      'atlantic'
    )
  })

  it('draws the globe over the dot lattice', () => {
    const { getByTestId } = render(BannerArt, { props: { variant: 'globe' } })
    const root = getByTestId('marketing-banner-art')
    expect(root.querySelector('[data-testid="assets-spinning-globe"]')).not.toBeNull()
    expect(root.querySelector('[data-testid="marketing-texture-material"]')).not.toBeNull()
  })

  it('lays the network map full bleed with its PoPs lit', () => {
    const { getByTestId } = render(BannerArt, { props: { variant: 'network' } })
    const map = getByTestId('marketing-banner-art').querySelector(
      '[data-testid="content-network-map"]'
    )
    expect(map).toHaveAttribute('data-density', 'high')
  })

  it('passes animated through so the art can hold a still frame', () => {
    const { getByTestId } = render(BannerArt, { props: { variant: 'map', animated: false } })
    const map = getByTestId('marketing-banner-art').querySelector(
      '[data-testid="content-network-map"]'
    )
    expect(map?.querySelector('[data-animated]')).toBeNull()
  })

  it('mirrors its washes under rtl', () => {
    const { getByTestId } = render({
      render: () => h('div', { dir: 'rtl' }, [h(BannerArt, { variant: 'globe' })])
    })
    expect(getByTestId('marketing-banner-art').innerHTML).toContain('rtl:-translate-x-1/2')
  })

  it('has no axe violations behind a hero and alone', async () => {
    const hero = render(Default)
    await expectNoA11yViolations(hero.container)
    hero.unmount()
    const { container } = render(Arts)
    await expectNoA11yViolations(container)
  })
})
