import { afterEach, describe, expect, it } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'

import SelectCompound, { type SelectValue } from '../../components/input/select'
import { hostable } from '../../test/hostable'

const Select = hostable(SelectCompound)

const TwoSelects = defineComponent({
  setup() {
    const size = ref('')
    const dial = ref('')
    const select = (testId: string, model: typeof size, values: string[]) =>
      h(
        Select,
        {
          ariaLabel: testId,
          modelValue: model.value,
          'onUpdate:modelValue': (v: SelectValue) => (model.value = String(v ?? ''))
        },
        () => [
          h(SelectCompound.Trigger, { 'data-testid': `${testId}-trigger` }),
          h(SelectCompound.Content, { 'data-testid': `${testId}-content` }, () =>
            values.map((value) => h(SelectCompound.Item, { key: value, value }, () => value))
          )
        ]
      )
    return () =>
      h('div', [select('size', size, ['1-200', '201-1000']), select('dial', dial, ['+1', '+44'])])
  }
})

const click = async (el: Element | null) => {
  el?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
  ;(el as HTMLElement | null)?.click()
  await nextTick()
  await nextTick()
}

const content = (testId: string) => document.querySelector(`[data-testid="${testId}-content"]`)

describe('useTeleportReady', () => {
  let host: HTMLElement | undefined

  afterEach(() => {
    host?.remove()
  })

  it('opens each Select in turn after hydrating HTML rendered without the teleport buffer', async () => {
    host = document.createElement('div')
    host.innerHTML = await renderToString(createSSRApp(TwoSelects))
    document.body.appendChild(host)
    const errors: unknown[] = []
    const app = createSSRApp(TwoSelects)
    app.config.errorHandler = (err) => errors.push(err)
    app.config.warnHandler = () => {}
    app.mount(host)
    const a = host.querySelector('[data-testid="size-trigger"]')
    const b = host.querySelector('[data-testid="dial-trigger"]')
    await click(a)
    expect(content('size')).not.toBeNull()
    await click(b)
    expect(content('dial')).not.toBeNull()
    await click(a)
    expect(content('size')).not.toBeNull()
    expect(errors).toEqual([])
    expect(host.contains(content('size'))).toBe(false)
    app.unmount()
  })
})

describe('useTeleportReady on a client-only mount', () => {
  it('teleports the panel to the body from the first render', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const { createApp } = await import('vue')
    const app = createApp(TwoSelects)
    app.mount(host)
    await click(host.querySelector('[data-testid="size-trigger"]'))
    expect(content('size')).not.toBeNull()
    expect(host.contains(content('size'))).toBe(false)
    app.unmount()
    host.remove()
  })
})
