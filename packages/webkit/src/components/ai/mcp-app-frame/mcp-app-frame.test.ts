import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import DefaultExample from '../../../../examples/mcp-app-frame/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import McpAppFrame, { type McpAppFrameMessage, type McpAppFrameResource } from './mcp-app-frame.vue'

const title = 'Plan picker from the billing tool'

const widget = (script: string, body = '<p>Widget</p>'): McpAppFrameResource => ({
  uri: 'ui://billing/plan-picker',
  mimeType: 'text/html;profile=mcp-app',
  text: `${body}<script>${script}<${'/'}script>`
})

const notify = (value: string) =>
  `parent.postMessage({ type: 'notify', payload: { message: ${value} } }, '*')`

const frameOf = (container: Element) =>
  container.querySelector<HTMLIFrameElement>('[data-testid="mcp-app-frame__view"]')

const messagesOf = (emitted: () => Record<string, unknown[]>) =>
  ((emitted()['message'] ?? []) as McpAppFrameMessage[][]).map((args) => args)

const ready = (getByTestId: (id: string) => HTMLElement) =>
  waitFor(() => expect(getByTestId('mcp-app-frame')).not.toHaveAttribute('data-loading'))

describe('McpAppFrame', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    const resource = widget('')
    expect(
      render(McpAppFrame, { props: { resource, title } }).getByTestId('mcp-app-frame')
    ).toBeTruthy()
    expect(
      render(McpAppFrame, {
        props: { resource, title },
        attrs: { 'data-testid': 'mine' }
      }).getByTestId('mine')
    ).toBeTruthy()
  })

  it('renders inline HTML in an isolated frame under a content policy', () => {
    const { container } = render(McpAppFrame, { props: { resource: widget(''), title } })
    const frame = frameOf(container)!
    expect(frame).toHaveAttribute('title', title)
    expect(frame).toHaveAttribute('sandbox', 'allow-scripts')
    expect(frame).toHaveAttribute('referrerpolicy', 'no-referrer')
    expect(frame).toHaveAttribute('allow', '')
    expect(frame).not.toHaveAttribute('allowfullscreen')
    expect(frame).not.toHaveAttribute('src')
    const srcdoc = frame.getAttribute('srcdoc') ?? ''
    expect(srcdoc.startsWith('<!doctype html><meta http-equiv="Content-Security-Policy"')).toBe(
      true
    )
    expect(srcdoc).toContain("connect-src 'none'")
  })

  it('shows the loading state until the widget loads', async () => {
    const { getByTestId, getByRole, queryByRole } = render(McpAppFrame, {
      props: { resource: widget(''), title }
    })
    const root = getByTestId('mcp-app-frame')
    expect(root).toHaveAttribute('data-loading')
    expect(root).toHaveAttribute('aria-busy', 'true')
    expect(getByRole('status')).toHaveTextContent(`Loading ${title}`)
    await ready(getByTestId)
    expect(root).not.toHaveAttribute('aria-busy')
    expect(queryByRole('status')).toBeNull()
  })

  it('keeps the widget out of the parent document and its storage', async () => {
    const script = `
      let reached = 'blocked'
      try { reached = parent.document.body ? 'reached' : 'blocked' } catch (error) {}
      let storage = 'blocked'
      try { storage = typeof localStorage.length === 'number' ? 'reached' : 'blocked' } catch (error) {}
      ${notify("reached + ' ' + storage")}
    `
    const { container, emitted } = render(McpAppFrame, {
      props: { resource: widget(script), title }
    })
    await waitFor(() => expect(messagesOf(emitted)).toHaveLength(1))
    expect(messagesOf(emitted)[0]).toEqual([
      { type: 'notify', payload: { message: 'blocked blocked' } }
    ])
    expect(frameOf(container)!.contentDocument).toBeNull()
  })

  it('blocks the widget from the network', async () => {
    const script = `
      document.addEventListener('securitypolicyviolation', (event) => {
        ${notify('event.effectiveDirective')}
      })
      fetch('https://example.com/').catch(() => {})
    `
    const { emitted } = render(McpAppFrame, { props: { resource: widget(script), title } })
    await waitFor(() => expect(messagesOf(emitted).length).toBeGreaterThan(0))
    expect(messagesOf(emitted)[0]).toEqual([
      { type: 'notify', payload: { message: 'connect-src' } }
    ])
  })

  it('emits only well-formed messages, rebuilt from their known keys', async () => {
    const script = `
      const post = (data) => parent.postMessage(data, '*')
      post('text')
      post([1, 2])
      post({ type: '' })
      post({ type: 'x'.repeat(129) })
      post({ type: 'tool', payload: 'text' })
      post({ jsonrpc: '1.0', method: 'tools/call' })
      post({ jsonrpc: '2.0' })
      post({ type: 'tool', payload: { toolName: 'select_plan', params: { plan: 'pro' } }, messageId: 'm1', extra: true })
      post({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'select_plan' }, extra: true })
    `
    const { emitted } = render(McpAppFrame, { props: { resource: widget(script), title } })
    await waitFor(() => expect(messagesOf(emitted)).toHaveLength(2))
    expect(messagesOf(emitted)).toEqual([
      [
        {
          type: 'tool',
          payload: { toolName: 'select_plan', params: { plan: 'pro' } },
          messageId: 'm1'
        }
      ],
      [{ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'select_plan' } }]
    ])
  })

  it('ignores a message that does not come from its own widget', async () => {
    const { getByTestId, emitted } = render(McpAppFrame, { props: { resource: widget(''), title } })
    await ready(getByTestId)
    window.postMessage({ type: 'tool', payload: { toolName: 'select_plan' } }, '*')
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(emitted()['message']).toBeUndefined()
  })

  it('follows the size the widget reports, clamped to the maximum, without emitting it', async () => {
    const script = `
      parent.postMessage({ jsonrpc: '2.0', method: 'ui/notifications/size-changed', params: { width: 9000, height: 300 } }, '*')
      setTimeout(() => parent.postMessage({ type: 'ui-size-change', payload: { height: 5000 } }, '*'), 50)
    `
    const { getByTestId, emitted } = render(McpAppFrame, {
      props: { resource: widget(script), title, maxHeight: 480 }
    })
    const root = getByTestId('mcp-app-frame')
    expect(root.style.getPropertyValue('--mcp-app-frame-view-height')).toBe('240px')
    await waitFor(() =>
      expect(root.style.getPropertyValue('--mcp-app-frame-view-height')).toBe('300px')
    )
    await waitFor(() =>
      expect(root.style.getPropertyValue('--mcp-app-frame-view-height')).toBe('480px')
    )
    expect(emitted()['message']).toBeUndefined()
  })

  it('posts to the widget once it has spoken, and the widget can answer', async () => {
    const script = `
      addEventListener('message', (event) => {
        if (event.data && event.data.id === 1) ${notify('event.data.result.ok')}
      })
      parent.postMessage({ jsonrpc: '2.0', id: 1, method: 'ui/initialize', params: {} }, '*')
    `
    const received = ref<McpAppFrameMessage[]>([])
    const frame = ref<InstanceType<typeof McpAppFrame> | null>(null)
    const Host = defineComponent({
      setup: () => () =>
        h(McpAppFrame, {
          ref: frame,
          resource: widget(script),
          title,
          onMessage: (message: McpAppFrameMessage) => {
            received.value.push(message)
            if ('jsonrpc' in message && message.method === 'ui/initialize') {
              frame.value?.post({ jsonrpc: '2.0', id: 1, result: { ok: 'answered' } })
            }
          }
        })
    })
    render(Host)
    await waitFor(() => expect(received.value).toHaveLength(2))
    expect(received.value[1]).toEqual({ type: 'notify', payload: { message: 'answered' } })
  })

  it('blocks the widget when it navigates its frame', async () => {
    const script = `setTimeout(() => { location.href = 'about:blank' }, 50)`
    const { container, getByTestId } = render(McpAppFrame, {
      props: { resource: widget(script), title }
    })
    await waitFor(() => expect(getByTestId('mcp-app-frame')).toHaveAttribute('data-error'))
    expect(frameOf(container)).toBeNull()
    expect(getByTestId('mcp-app-frame__error')).toHaveTextContent("This app can't be shown")
  })

  it('decodes a base64 blob and blocks one that is not valid', async () => {
    const encoded = btoa(String.fromCharCode(...new TextEncoder().encode('<p>Olá</p>')))
    const { container } = render(McpAppFrame, {
      props: { resource: { uri: 'ui://a/b', mimeType: 'text/html', blob: encoded }, title }
    })
    expect(frameOf(container)!.getAttribute('srcdoc')).toContain('<p>Olá</p>')
    const broken = render(McpAppFrame, {
      props: { resource: { uri: 'ui://a/b', mimeType: 'text/html', blob: '%%%' }, title },
      attrs: { 'data-testid': 'broken' }
    })
    expect(broken.getByTestId('broken')).toHaveAttribute('data-error')
  })

  it('blocks a resource that is not inline HTML unless resolveUrl returns an https URL', async () => {
    const resource = {
      uri: 'ui://status/overview',
      mimeType: 'text/uri-list',
      text: 'https://example.com/'
    }
    const cases = [
      undefined,
      () => '',
      () => 'http://example.com/',
      () => 'javascript:alert(1)',
      () => Promise.reject(new Error('unknown server'))
    ]
    for (const [index, resolveUrl] of cases.entries()) {
      const testId = `case-${index}`
      const { getByTestId, container } = render(McpAppFrame, {
        props: { resource, title, resolveUrl },
        attrs: { 'data-testid': testId }
      })
      await waitFor(() => expect(getByTestId(testId)).toHaveAttribute('data-error'))
      expect(container.querySelector('iframe')).toBeNull()
    }
  })

  it('loads a resolved https URL in the same sandbox', async () => {
    const resource = {
      uri: 'ui://status/overview',
      mimeType: 'text/uri-list',
      text: 'https://example.com/'
    }
    const { container } = render(McpAppFrame, {
      props: { resource, title, resolveUrl: async () => 'https://example.com/status' }
    })
    await waitFor(() => expect(frameOf(container)).not.toBeNull())
    const frame = frameOf(container)!
    expect(frame).toHaveAttribute('src', 'https://example.com/status')
    expect(frame).toHaveAttribute('sandbox', 'allow-scripts')
    expect(frame).not.toHaveAttribute('srcdoc')
  })

  it('keeps the loading state while resolveUrl is pending, with no frame yet', () => {
    const { getByTestId, container } = render(McpAppFrame, {
      props: {
        resource: { uri: 'ui://a/b', mimeType: 'text/html;profile=mcp-app' },
        title,
        resolveUrl: () => new Promise<string>(() => {})
      }
    })
    expect(getByTestId('mcp-app-frame')).toHaveAttribute('data-loading')
    expect(getByTestId('mcp-app-frame__loading')).toBeTruthy()
    expect(container.querySelector('iframe')).toBeNull()
  })

  it('discards a late resolveUrl result and restarts only when the resource changes', async () => {
    let settle: (url: string) => void = () => {}
    let calls = 0
    const resolveUrl = () => {
      calls += 1
      return new Promise<string>((resolve) => {
        settle = resolve
      })
    }
    const remote = { uri: 'ui://a/b', mimeType: 'text/uri-list' }
    const { container, rerender } = render(McpAppFrame, {
      props: { resource: remote, title, resolveUrl }
    })
    await rerender({ resource: remote, title, resolveUrl: () => resolveUrl() })
    expect(calls).toBe(1)
    await rerender({ resource: widget(''), title, resolveUrl })
    settle('https://example.com/late')
    await new Promise((resolve) => setTimeout(resolve, 50))
    const frame = frameOf(container)!
    expect(frame).not.toHaveAttribute('src')
    expect(frame.getAttribute('srcdoc')).toContain('<p>Widget</p>')
  })

  it('answers the handshake and a tool call in the default example', async () => {
    const { container, getByText } = render(DefaultExample)
    await waitFor(() => expect(getByText(/Requests from the widget: ui\/initialize/)).toBeTruthy())
    const frame = frameOf(container)!
    expect(frame).toHaveAttribute('title', title)
  })

  it('has no axe violations when ready or blocked', async () => {
    const view = render(McpAppFrame, { props: { resource: widget(''), title } })
    await ready(view.getByTestId)
    await expectNoA11yViolations(view.container)
    const blocked = render(McpAppFrame, {
      props: { resource: { uri: 'ui://a/b', mimeType: 'text/uri-list' }, title }
    })
    await expectNoA11yViolations(blocked.container)
  })
})
