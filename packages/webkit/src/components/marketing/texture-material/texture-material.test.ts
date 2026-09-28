import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import TextureMaterial from './texture-material.vue'

const TESTID = 'marketing-texture-material'

const KINDS = ['dots', 'grid', 'dither', 'pixelate', 'none'] as const
const SIZES = ['small', 'medium', 'large'] as const
const FADES = ['none', 'top', 'bottom', 'edges', 'vignette'] as const

describe('TextureMaterial', () => {
  it('renders with the default testid and the default texture', () => {
    const { getByTestId } = render(TextureMaterial)
    const root = getByTestId(TESTID)

    expect(root).toBeInTheDocument()
    expect(root).toHaveAttribute('data-kind', 'dots')
    expect(root).toHaveAttribute('data-size', 'medium')
    expect(root).toHaveAttribute('data-fade', 'none')
  })

  it('lets a consumer-supplied data-testid win', () => {
    const { getByTestId } = render(TextureMaterial, {
      attrs: { 'data-testid': 'custom-texture' }
    })
    expect(getByTestId('custom-texture')).toBeInTheDocument()
  })

  it.each(KINDS)('carries the %s texture on data-kind', (kind) => {
    const { getByTestId } = render(TextureMaterial, { props: { kind } })
    expect(getByTestId(TESTID)).toHaveAttribute('data-kind', kind)
  })

  it.each(SIZES)('carries the %s pitch on data-size', (size) => {
    const { getByTestId } = render(TextureMaterial, { props: { size } })
    expect(getByTestId(TESTID)).toHaveAttribute('data-size', size)
  })

  it.each(FADES)('carries the %s fade on data-fade', (fade) => {
    const { getByTestId } = render(TextureMaterial, { props: { fade } })
    expect(getByTestId(TESTID)).toHaveAttribute('data-fade', fade)
  })

  it('does not fade by default', () => {
    const { getByTestId } = render(TextureMaterial)
    expect(getByTestId(TESTID)).toHaveAttribute('data-fade', 'none')
  })

  it('hides the layer from assistive tech and from the pointer', () => {
    const { getByTestId } = render(TextureMaterial)
    const root = getByTestId(TESTID)

    expect(root).toHaveAttribute('aria-hidden', 'true')
    expect(root.className).toContain('pointer-events-none')
  })

  it('takes no content — the layer paints only itself', () => {
    const { getByTestId } = render(TextureMaterial, {
      slots: { default: '<span>ignored</span>' }
    })
    expect(getByTestId(TESTID).textContent).toBe('')
  })

  it('builds the dither ramp from sixteen dispersed planes', () => {
    const { getByTestId } = render(TextureMaterial, { props: { kind: 'dither' } })
    const planes = [...getByTestId(TESTID).children] as HTMLElement[]

    expect(planes).toHaveLength(16)

    const ranks = planes.map((plane) => plane.style.getPropertyValue('--rank'))
    expect(new Set(ranks).size).toBe(16)

    const cells = planes.map(
      (plane) => `${plane.style.getPropertyValue('--col')},${plane.style.getPropertyValue('--row')}`
    )
    expect(new Set(cells).size).toBe(16)
  })

  it('draws two counter-travelling waves for the pixelate field', () => {
    const { getByTestId } = render(TextureMaterial, { props: { kind: 'pixelate' } })
    const field = getByTestId(TESTID).firstElementChild as HTMLElement
    const waves = [...field.children] as HTMLElement[]

    expect(waves).toHaveLength(2)
    expect(waves[0].className).toContain('animate-texture-wave-a')
    expect(waves[1].className).toContain('animate-texture-wave-b')

    for (const wave of waves) {
      expect(wave.className).toContain('motion-reduce:animate-none')
    }
  })

  it.each(['dots', 'grid', 'none'] as const)('paints %s with no child layers', (kind) => {
    const { getByTestId } = render(TextureMaterial, { props: { kind } })
    expect(getByTestId(TESTID).children).toHaveLength(0)
  })

  it.each(KINDS)('has no accessibility violations rendering %s', async (kind) => {
    const { container } = render(TextureMaterial, { props: { kind } })
    await expectNoA11yViolations(container)
  })
})
