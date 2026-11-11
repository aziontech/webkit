import { cleanup, fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/response-branches/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import ResponseBranches from './response-branches.vue'

afterEach(() => cleanup())

const versions = ['First', 'Second', 'Third']

const Harness = defineComponent({
  props: {
    start: { type: Number, default: 0 },
    disabled: Boolean,
    count: { type: Number, default: 3 }
  },
  setup(props) {
    const index = ref(props.start)
    return () =>
      h(
        ResponseBranches,
        {
          modelValue: index.value,
          'onUpdate:modelValue': (value: number) => (index.value = value),
          count: props.count,
          disabled: props.disabled
        },
        { default: ({ index: i }: { index: number }) => h('p', versions[i]) }
      )
  }
})

describe('ResponseBranches', () => {
  it('shows the active version and pages through the others', async () => {
    const view = render(Harness)
    const group = view.getByRole('group', { name: 'Response versions' })
    expect(view.getByText('First')).toBeTruthy()
    expect(view.getByText('1 of 3')).toHaveAttribute('aria-live', 'polite')
    expect(view.getByRole('button', { name: 'Previous version' })).toBeDisabled()

    await fireEvent.click(view.getByRole('button', { name: 'Next version' }))
    expect(view.getByText('Second')).toBeTruthy()
    expect(view.getByText('2 of 3')).toBeTruthy()
    await fireEvent.click(view.getByRole('button', { name: 'Next version' }))
    expect(view.getByRole('button', { name: 'Next version' })).toBeDisabled()
    await fireEvent.click(view.getByRole('button', { name: 'Previous version' }))
    expect(view.getByText('Second')).toBeTruthy()
    expect(group.closest('[data-testid="ai-response-branches"]')).toHaveAttribute('data-index', '1')
  })

  it('clamps an out-of-range index and hides the pager for one version', async () => {
    const view = render(Harness, { props: { start: 9 } })
    expect(view.getByText('Third')).toBeTruthy()
    view.unmount()
    const single = render(Harness, { props: { count: 1 } })
    expect(single.queryByRole('group')).toBeNull()
    expect(single.getByText('First')).toBeTruthy()
  })

  it('locks both buttons while disabled', () => {
    const view = render(Harness, { props: { start: 1, disabled: true } })
    expect(view.getByRole('button', { name: 'Previous version' })).toBeDisabled()
    expect(view.getByRole('button', { name: 'Next version' })).toBeDisabled()
  })

  it('reads its strings from the locale catalog', () => {
    const view = render(WebkitProvider, {
      props: { locale: 'pt-BR', catalogs: LOCALES },
      slots: { default: () => h(Harness) }
    })
    expect(view.getByRole('group', { name: 'Versões da resposta' })).toBeTruthy()
    expect(view.getByText('1 de 3')).toBeTruthy()
  })

  it('keeps the previous button at the inline start under rtl', () => {
    const host = document.createElement('div')
    host.dir = 'rtl'
    document.body.appendChild(host)
    const view = render(Harness, { container: host })
    const [first] = view.getAllByRole('button')
    expect(first).toHaveAccessibleName('Previous version')
    host.remove()
  })

  it('regenerates into a new version in the example, without axe violations', async () => {
    const view = render(Default)
    expect(view.getByText('3 of 3')).toBeTruthy()
    await expectNoA11yViolations(view.container)
    await fireEvent.click(view.getByRole('button', { name: 'Regenerate response' }))
    await new Promise((resolve) => setTimeout(resolve, 900))
    await nextTick()
    expect(view.getByText('4 of 4')).toBeTruthy()
  })
})
