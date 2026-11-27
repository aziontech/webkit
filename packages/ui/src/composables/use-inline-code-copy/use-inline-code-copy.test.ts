import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import { useInlineCodeCopy } from './use-inline-code-copy'

const Host = defineComponent({
  props: { html: { type: String, required: true } },
  setup(props) {
    const rootEl = ref<HTMLElement | null>(null)
    const copy = useInlineCodeCopy(rootEl)
    return () =>
      h('div', [
        h('div', { ref: rootEl, 'data-code-copy': '', innerHTML: props.html }),
        h('output', { 'data-testid': 'state' }, `${copy.tipLabel.value}|${copy.announcement.value}`)
      ])
  }
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const stubClipboard = () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } })
  return writeText
}

describe('useInlineCodeCopy', () => {
  it('turns a command chip added after mount into a button', async () => {
    const view = render(Host, { props: { html: '<p>Nothing yet.</p>' } })
    await view.rerender({ html: '<p>Run <code data-command>azion link</code>.</p>' })
    await waitFor(() => expect(view.getByText('azion link').getAttribute('role')).toBe('button'))
  })

  it('reports the copy in the label and the announcement', async () => {
    stubClipboard()
    const view = render(Host, { props: { html: '<p><code>azion link</code></p>' } })
    await fireEvent.click(view.getByText('azion link'))
    await waitFor(() => expect(view.getByTestId('state').textContent).toBe('Copied|Copied'))
  })

  it('stops listening once its scope is disposed', async () => {
    const writeText = stubClipboard()
    const view = render(Host, { props: { html: '<p><code>azion link</code></p>' } })
    const chip = view.getByText('azion link')
    view.unmount()
    chip.click()
    expect(writeText).not.toHaveBeenCalled()
  })
})
