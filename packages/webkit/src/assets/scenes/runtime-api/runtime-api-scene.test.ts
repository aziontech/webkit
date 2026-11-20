import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import RuntimeApiCloud from './runtime-api-cloud.vue'
import { RUNTIME_API_ROWS, RUNTIME_APIS } from './runtime-api-data'
import RuntimeApiScene from './runtime-api-scene.vue'

const SCENE = 'assets-runtime-api-scene'
const CLOUD = 'assets-runtime-api-cloud'

const reducedMotion = () => globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches

const host = (props: Record<string, unknown> = {}) =>
  defineComponent({
    components: { RuntimeApiScene },
    setup: () => ({ props }),
    template: `<div style="width: 720px"><RuntimeApiScene v-bind="props" /></div>`
  })

const litLabels = (root: Element) =>
  Array.from(root.querySelectorAll('[role="listitem"][data-active]')).map(
    (pill) => pill.textContent?.trim() ?? ''
  )

describe('RuntimeApiScene', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('lays every global out in the shaped rows', () => {
    expect(RUNTIME_API_ROWS.reduce((sum, count) => sum + count, 0)).toBe(RUNTIME_APIS.length)
  })

  it('renders the scene and its cloud under the default testids', () => {
    const { getByTestId } = render(host())

    expect(getByTestId(SCENE)).toBeInTheDocument()
    expect(getByTestId(`${SCENE}__cloud`)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(host({ 'data-testid': 'hero-art' }))

    expect(getByTestId('hero-art')).toBeInTheDocument()
    expect(queryByTestId(SCENE)).toBeNull()
  })

  it('names the list of globals, and takes a consumer name', () => {
    const named = render(host())
    expect(named.getByRole('list')).toHaveAccessibleName('Globals available in the Azion Runtime')
    named.unmount()

    const custom = render(host({ ariaLabel: 'Runtime APIs' }))
    expect(custom.getByRole('list')).toHaveAccessibleName('Runtime APIs')
  })

  it('lists every global as a list item', () => {
    const { getAllByRole } = render(host())
    const items = getAllByRole('listitem')

    expect(items).toHaveLength(RUNTIME_APIS.length)
    expect(items[0]).toHaveTextContent('fetch')
  })

  it('opens with the seeded highlight and keeps the Azion globals lit', () => {
    const { getByTestId } = render(host({ animated: false }))
    const lit = litLabels(getByTestId(`${SCENE}__cloud`))

    for (const label of [
      'fetch',
      'Request',
      'CryptoKey',
      'WebAssembly',
      'FetchEvent',
      'EdgeRuntime'
    ]) {
      expect(lit).toContain(label)
    }
  })

  it('hands the highlight on over time and never dims a pinned global', async () => {
    vi.useFakeTimers()
    const { getByTestId } = render(RuntimeApiCloud)
    const cloud = getByTestId(CLOUD)
    const before = litLabels(cloud)

    vi.advanceTimersByTime(1200)
    await nextTick()
    const after = litLabels(cloud)

    if (reducedMotion()) expect(after).toEqual(before)
    else expect(after).not.toEqual(before)
    expect(after.length).toBe(before.length)
    for (const label of [
      'fetch',
      'Request',
      'CryptoKey',
      'WebAssembly',
      'FetchEvent',
      'FirewallEvent',
      'EdgeRuntime'
    ]) {
      expect(after).toContain(label)
    }
  })

  it('holds the highlight still when not animated', async () => {
    vi.useFakeTimers()
    const { getByTestId } = render(RuntimeApiCloud, { props: { animated: false } })
    const cloud = getByTestId(CLOUD)
    const before = litLabels(cloud)

    vi.advanceTimersByTime(5000)
    await nextTick()

    expect(litLabels(cloud)).toEqual(before)
  })

  it('has no accessibility violations', async () => {
    const { container } = render(host({ animated: false }))
    await expectNoA11yViolations(container)
  })
})
