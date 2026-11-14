import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import Loader from './loader.vue'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('Loader', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(render(Loader).getByTestId('ai-loader')).toBeTruthy()
    expect(render(Loader, { attrs: { 'data-testid': 'mine' } }).getByTestId('mine')).toBeTruthy()
  })

  it('is a status region that stays empty until the delay passes', async () => {
    const { getByRole } = render(Loader, { props: { delay: 60 } })
    const status = getByRole('status')
    expect(status).not.toHaveAttribute('data-visible')
    expect(status).toHaveTextContent('')
    await wait(120)
    expect(status).toHaveAttribute('data-visible')
    expect(status).toHaveTextContent('Generating a response')
  })

  it('shows immediately with delay 0 and uses the label prop', () => {
    const { getByRole } = render(Loader, {
      props: { delay: 0, label: 'Loading list of workloads' }
    })
    expect(getByRole('status')).toHaveTextContent('Loading list of workloads')
  })

  it('renders dots for inline and a hidden bar for bar', () => {
    const inline = render(Loader, { props: { delay: 0 } })
    expect(inline.getByTestId('ai-loader__dots')).toHaveAttribute('aria-hidden', 'true')
    inline.unmount()
    const bar = render(Loader, { props: { delay: 0, kind: 'bar' } })
    expect(bar.getByTestId('ai-loader')).toHaveAttribute('data-kind', 'bar')
    expect(bar.getByTestId('ai-loader__bar')).toHaveAttribute('aria-hidden', 'true')
    expect(bar.queryByTestId('ai-loader__dots')).toBeNull()
  })

  it('pairs every animated dot with a reduced-motion escape', () => {
    const { getByTestId } = render(Loader, { props: { delay: 0 } })
    for (const dot of getByTestId('ai-loader__dots').children) {
      expect(dot.className).toContain('motion-reduce:animate-none')
    }
  })

  it('reads the text from the provider locale', () => {
    const { getByRole } = render(
      defineComponent({
        setup: () => () =>
          h(
            WebkitProvider,
            { locale: 'pt-BR', catalogs: LOCALES },
            { default: () => h(Loader, { delay: 0 }) }
          )
      })
    )
    expect(getByRole('status')).toHaveTextContent('Gerando uma resposta')
  })

  it('has no axe violations', async () => {
    const { container } = render(Loader, { props: { delay: 0, kind: 'bar' } })
    await expectNoA11yViolations(container)
  })
})
