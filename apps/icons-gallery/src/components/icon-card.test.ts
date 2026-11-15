import { afterEach, describe, expect, it } from 'vitest'
import { type App, createApp, nextTick } from 'vue'

import IconCard from './icon-card.vue'

describe('IconCard', () => {
  let app: App | undefined
  let host: HTMLElement | undefined

  afterEach(() => {
    app?.unmount()
    host?.remove()
  })

  it('renders the icon name and its copy and download actions', async () => {
    host = document.createElement('div')
    document.body.append(host)
    const props = {
      name: 'ai-azion',
      icon: 'ai-azion',
      color: '#000000',
      size: 'text-base',
      downloadFormat: 'svg'
    }
    app = createApp(IconCard, props)
    app.mount(host)
    await nextTick()

    expect(host.textContent).toContain('ai-azion')
    expect(host.querySelector('button[title="Copy code"]')).not.toBeNull()
    expect(host.querySelector('button[title="Download SVG"]')).not.toBeNull()
  })
})
