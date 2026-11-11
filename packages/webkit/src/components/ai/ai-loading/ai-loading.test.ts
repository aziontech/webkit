import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import AiLoading from './ai-loading.vue'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('AiLoading', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(render(AiLoading).getByTestId('ai-ai-loading')).toBeTruthy()
    expect(render(AiLoading, { attrs: { 'data-testid': 'mine' } }).getByTestId('mine')).toBeTruthy()
  })

  it('is a status region that stays empty until the delay passes', async () => {
    const { getByRole } = render(AiLoading, { props: { delay: 60 } })
    const status = getByRole('status')
    expect(status).not.toHaveAttribute('data-visible')
    expect(status).toHaveTextContent('')
    await wait(120)
    expect(status).toHaveAttribute('data-visible')
    expect(status).toHaveTextContent('Generating a response')
  })

  it('shows immediately with delay 0 and uses the label prop', () => {
    const { getByRole } = render(AiLoading, {
      props: { delay: 0, label: 'Loading list of workloads' }
    })
    expect(getByRole('status')).toHaveTextContent('Loading list of workloads')
  })

  it('renders dots for inline and a hidden bar for bar', () => {
    const inline = render(AiLoading, { props: { delay: 0 } })
    expect(inline.getByTestId('ai-ai-loading__dots')).toHaveAttribute('aria-hidden', 'true')
    inline.unmount()
    const bar = render(AiLoading, { props: { delay: 0, kind: 'bar' } })
    expect(bar.getByTestId('ai-ai-loading')).toHaveAttribute('data-kind', 'bar')
    expect(bar.getByTestId('ai-ai-loading__bar')).toHaveAttribute('aria-hidden', 'true')
    expect(bar.queryByTestId('ai-ai-loading__dots')).toBeNull()
  })

  it('pairs every animated dot with a reduced-motion escape', () => {
    const { getByTestId } = render(AiLoading, { props: { delay: 0 } })
    for (const dot of getByTestId('ai-ai-loading__dots').children) {
      expect(dot.className).toContain('motion-reduce:animate-none')
    }
  })

  it('reads the text from the provider locale', () => {
    const { getByRole } = render(
      defineComponent({
        setup: () => () =>
          h(WebkitProvider, { locale: 'pt-BR' }, { default: () => h(AiLoading, { delay: 0 }) })
      })
    )
    expect(getByRole('status')).toHaveTextContent('Gerando uma resposta')
  })

  it('has no axe violations', async () => {
    const { container } = render(AiLoading, { props: { delay: 0, kind: 'bar' } })
    await expectNoA11yViolations(container)
  })
})
