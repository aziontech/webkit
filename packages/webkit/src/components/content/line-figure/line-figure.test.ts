import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import Default from '../../../../examples/line-figure/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { lineFigureNames } from './figures/registry'
import LineFigure from './line-figure.vue'

const drawn = (root: HTMLElement) => root.querySelector('svg')!.childElementCount

describe('LineFigure', () => {
  it('draws the named figure and names it with its description', async () => {
    const { getByTestId } = render(Default)
    const root = getByTestId('content-line-figure')
    await waitFor(() => expect(drawn(root)).toBeGreaterThan(0))
    expect(root).toHaveAttribute('role', 'img')
    expect(root.getAttribute('aria-label')).toBeTruthy()
    expect(root.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('lets aria-label override the description', async () => {
    const { getByRole } = render(LineFigure, { props: { name: 'dns-lookup', ariaLabel: 'DNS' } })
    await waitFor(() => expect(getByRole('img', { name: 'DNS' })).toBeInTheDocument())
  })

  it('draws nothing and has no role for an unknown or empty name', async () => {
    const { getByTestId } = render(LineFigure, { props: { name: 'nope' as never } })
    const root = getByTestId('content-line-figure')
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(drawn(root)).toBe(0)
    expect(root).not.toHaveAttribute('role')
  })

  it('reports its first reading through read', async () => {
    const { emitted } = render(LineFigure, { props: { name: 'cache-ttl' } })
    await waitFor(() => expect(emitted().read?.length).toBeGreaterThan(0))
  })

  it('swaps the drawing when the name changes', async () => {
    const { getByTestId, rerender } = render(LineFigure, { props: { name: 'cache-ttl' } })
    const root = getByTestId('content-line-figure')
    await waitFor(() => expect(drawn(root)).toBeGreaterThan(0))
    const first = root.getAttribute('aria-label')
    await rerender({ name: 'lb-rotor' })
    await waitFor(() => expect(root.getAttribute('aria-label')).not.toBe(first))
    expect(root).toHaveAttribute('data-name', 'lb-rotor')
  })

  it('marks play and keeps drawing under rtl', async () => {
    const { getByTestId } = render({
      render: () => h('div', { dir: 'rtl' }, [h(LineFigure, { name: 'lb-rotor', play: true })])
    })
    const root = getByTestId('content-line-figure')
    expect(root).toHaveAttribute('data-play', 'true')
    await waitFor(() => expect(drawn(root)).toBeGreaterThan(0))
  })

  it('registers 25 figures', () => {
    expect(lineFigureNames).toHaveLength(25)
  })

  it('has no axe violations', async () => {
    const { container, getByTestId } = render(Default)
    await waitFor(() => expect(drawn(getByTestId('content-line-figure'))).toBeGreaterThan(0))
    await expectNoA11yViolations(container)
  })
})
