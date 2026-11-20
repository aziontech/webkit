import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import Texture from './texture.vue'

const TESTID = 'texture'

const VARIANTS = ['dots', 'grid', 'dither', 'pixelate', 'none'] as const
const SIZES = ['small', 'medium', 'large'] as const
const FADES = ['none', 'top', 'bottom', 'left', 'right', 'edges', 'vignette'] as const

describe('Texture', () => {
  it('renders with the default testid and the default texture', () => {
    const { getByTestId } = render(Texture)
    const root = getByTestId(TESTID)

    expect(root).toBeInTheDocument()
    expect(root).toHaveAttribute('data-variant', 'dots')
    expect(root).toHaveAttribute('data-size', 'medium')
    expect(root).toHaveAttribute('data-fade', 'none')
  })

  it('lets a consumer-supplied data-testid win', () => {
    const { getByTestId } = render(Texture, {
      attrs: { 'data-testid': 'custom-texture' }
    })
    expect(getByTestId('custom-texture')).toBeInTheDocument()
  })

  it.each(VARIANTS)('carries the %s texture on data-variant', (variant) => {
    const { getByTestId } = render(Texture, { props: { variant: variant } })
    expect(getByTestId(TESTID)).toHaveAttribute('data-variant', variant)
  })

  it.each(SIZES)('carries the %s pitch on data-size', (size) => {
    const { getByTestId } = render(Texture, { props: { size } })
    expect(getByTestId(TESTID)).toHaveAttribute('data-size', size)
  })

  it.each(FADES)('carries the %s fade on data-fade', (fade) => {
    const { getByTestId } = render(Texture, { props: { fade } })
    expect(getByTestId(TESTID)).toHaveAttribute('data-fade', fade)
  })

  it('does not fade by default', () => {
    const { getByTestId } = render(Texture)
    expect(getByTestId(TESTID)).toHaveAttribute('data-fade', 'none')
  })

  it('hides the layer from assistive tech and from the pointer', () => {
    const { getByTestId } = render(Texture)
    const root = getByTestId(TESTID)

    expect(root).toHaveAttribute('aria-hidden', 'true')
    expect(root.className).toContain('pointer-events-none')
  })

  it('takes no content — the layer paints only itself', () => {
    const { getByTestId } = render(Texture, {
      slots: { default: '<span>ignored</span>' }
    })
    expect(getByTestId(TESTID).textContent).toBe('')
  })

  it('builds the dither ramp from sixteen dispersed planes', () => {
    const { getByTestId } = render(Texture, { props: { variant: 'dither' } })
    const planes = [...getByTestId(TESTID).children] as HTMLElement[]

    expect(planes).toHaveLength(16)

    const ranks = planes.map((plane) => plane.style.getPropertyValue('--texture-rank'))
    expect(new Set(ranks).size).toBe(16)

    const cells = planes.map(
      (plane) =>
        `${plane.style.getPropertyValue('--texture-column')},${plane.style.getPropertyValue('--texture-row')}`
    )
    expect(new Set(cells).size).toBe(16)
  })

  it('draws two counter-travelling waves for the pixelate field', () => {
    const { getByTestId } = render(Texture, { props: { variant: 'pixelate' } })
    const field = getByTestId(TESTID).firstElementChild as HTMLElement
    const waves = [...field.children] as HTMLElement[]

    expect(waves).toHaveLength(2)
    expect(waves[0].className).toContain('animate-texture-wave-a')
    expect(waves[1].className).toContain('animate-texture-wave-b')

    for (const wave of waves) {
      expect(wave.className).toContain('motion-reduce:animate-none')
    }
  })

  it.each(['dots', 'grid', 'none'] as const)('paints %s with no child layers', (variant) => {
    const { getByTestId } = render(Texture, { props: { variant: variant } })
    expect(getByTestId(TESTID).children).toHaveLength(0)
  })

  it.each(VARIANTS)('has no accessibility violations rendering %s', async (variant) => {
    const { container } = render(Texture, { props: { variant: variant } })
    await expectNoA11yViolations(container)
  })
})
