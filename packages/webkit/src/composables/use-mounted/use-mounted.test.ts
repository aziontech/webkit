import { afterEach, describe, expect, it } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'

import Select, { SelectContent, SelectOption, SelectTrigger } from '../../components/inputs/select'

/**
 * Two Selects in one app, as in a lead form (company size + phone dial code).
 * Each SelectContent teleports to <body>.
 */
const TwoSelects = defineComponent({
  setup() {
    const size = ref('')
    const dial = ref('')
    const select = (testId: string, model: typeof size, values: string[]) =>
      h(
        Select,
        {
          'data-testid': testId,
          modelValue: model.value,
          'onUpdate:modelValue': (v: unknown) => (model.value = v as string)
        },
        () => [
          h(SelectTrigger, { 'data-testid': `${testId}-trigger` }),
          h(SelectContent, { 'data-testid': `${testId}-content` }, () =>
            values.map((value) => h(SelectOption, { key: value, value }, () => value))
          )
        ]
      )
    return () =>
      h('div', [select('size', size, ['1-200', '201-1000']), select('dial', dial, ['+55', '+1'])])
  }
})

const click = async (el: Element | null) => {
  el?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
  ;(el as HTMLElement | null)?.click()
  await nextTick()
  await nextTick()
}

const content = (testId: string) => document.querySelector(`[data-testid="${testId}-content"]`)

describe('useMounted (teleport hydration under SSR hosts)', () => {
  let host: HTMLElement | undefined

  afterEach(() => {
    host?.remove()
    document.querySelectorAll('[role="listbox"]').forEach((el) => el.remove())
  })

  // Astro and similar hosts keep the app HTML but drop Vue's teleport buffer, so
  // <body> holds no teleport anchors when the app hydrates.
  it('opens each Select in turn after hydrating HTML rendered without the teleport buffer', async () => {
    host = document.createElement('div')
    host.innerHTML = await renderToString(createSSRApp(TwoSelects))
    document.body.appendChild(host)

    const errors: unknown[] = []
    const app = createSSRApp(TwoSelects)
    app.config.errorHandler = (err) => errors.push(err)
    app.config.warnHandler = () => {}
    app.mount(host)

    const sizeTrigger = host.querySelector('[data-testid="size-trigger"]')
    const dialTrigger = host.querySelector('[data-testid="dial-trigger"]')

    await click(sizeTrigger)
    expect(content('size')).not.toBeNull()

    await click(dialTrigger)
    expect(content('dial')).not.toBeNull()

    await click(sizeTrigger)
    expect(content('size')).not.toBeNull()

    expect(errors).toEqual([])
    // Once mounted, the panel lives in <body>, outside the app root.
    expect(host.contains(content('size'))).toBe(false)
    app.unmount()
  })
})
