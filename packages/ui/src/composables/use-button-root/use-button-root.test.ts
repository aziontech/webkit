import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import { useButtonRoot, type UseButtonRootProps } from './index'

const host = (onActivate: (event: MouseEvent) => void) =>
  defineComponent({
    inheritAttrs: false,
    props: {
      disabled: Boolean,
      loading: Boolean,
      href: { type: String, default: '' },
      target: { type: String, default: '_self' },
      type: { type: String, default: undefined }
    },
    setup(props) {
      const { Root, rootAttrs, onClick } = useButtonRoot(
        props as UseButtonRootProps,
        'host-button',
        onActivate
      )
      return () => h(Root, { tag: 'button', ...rootAttrs.value, onClick }, () => 'Go')
    }
  })

describe('useButtonRoot', () => {
  it('renders a button with the component name as its test id and emits on click', async () => {
    const onActivate = vi.fn()
    const { getByTestId } = render(host(onActivate))
    const root = getByTestId('host-button')
    expect(root.tagName).toBe('BUTTON')
    expect(root.getAttribute('type')).toBe('button')
    await fireEvent.click(root)
    expect(onActivate).toHaveBeenCalledTimes(1)
  })

  it('keeps the consumer test id', () => {
    const { getByTestId } = render(host(vi.fn()), { attrs: { 'data-testid': 'save' } })
    expect(getByTestId('save')).toBeTruthy()
  })

  it('renders a safe href as an anchor and guards a new tab', () => {
    const { getByTestId } = render(host(vi.fn()), {
      props: { href: 'https://example.com', target: '_blank' }
    })
    const root = getByTestId('host-button')
    expect(root.tagName).toBe('A')
    expect(root.getAttribute('rel')).toBe('noopener noreferrer')
    expect(root.hasAttribute('type')).toBe(false)
  })

  it('ignores an unsafe href', () => {
    const { getByTestId } = render(host(vi.fn()), { props: { href: 'javascript:alert(1)' } })
    expect(getByTestId('host-button').tagName).toBe('BUTTON')
  })

  it('blocks activation while disabled or loading', async () => {
    const onActivate = vi.fn()
    const { getByTestId, rerender } = render(host(onActivate), { props: { loading: true } })
    const root = getByTestId('host-button')
    expect(root.getAttribute('aria-busy')).toBe('true')
    expect(root.hasAttribute('data-inert')).toBe(true)
    await fireEvent.click(root)
    await rerender({ loading: false, disabled: true })
    expect(root.hasAttribute('disabled')).toBe(true)
    expect(root.hasAttribute('data-disabled')).toBe(true)
    expect(onActivate).not.toHaveBeenCalled()
  })

  it('takes an inert anchor out of the tab order', () => {
    const { getByTestId } = render(host(vi.fn()), {
      props: { href: 'https://example.com', disabled: true }
    })
    const root = getByTestId('host-button')
    expect(root.getAttribute('tabindex')).toBe('-1')
    expect(root.getAttribute('aria-disabled')).toBe('true')
  })

  it('keeps the consumer rel and tabindex where the root does not set them', () => {
    const { getByTestId } = render(host(vi.fn()), {
      props: { href: 'https://example.com' },
      attrs: { rel: 'nofollow', tabindex: 2 }
    })
    const root = getByTestId('host-button')
    expect(root.getAttribute('rel')).toBe('nofollow')
    expect(root.getAttribute('tabindex')).toBe('2')
  })
})
