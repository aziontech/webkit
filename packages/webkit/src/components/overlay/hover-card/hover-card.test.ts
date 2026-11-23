import { render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, h, nextTick, type PropType } from 'vue'

import Default from '../../../../examples/hover-card/default.vue'
import Disabled from '../../../../examples/hover-card/disabled.vue'
import ResourcePreview from '../../../../examples/hover-card/resource-preview.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import HoverCard from './index'

const card = () => document.body.querySelector<HTMLElement>('[data-testid="hover-card-content"]')

const trigger = () => document.body.querySelector<HTMLElement>('[data-testid="hover-card-trigger"]')

const link = () => trigger()?.querySelector('a') as HTMLElement

const OPENS = { timeout: 3000 }

const pointer = (el: HTMLElement | null | undefined, type: 'pointerenter' | 'pointerleave') =>
  el?.dispatchEvent(new PointerEvent(type, { pointerType: 'mouse' }))

async function advance(ms: number) {
  vi.advanceTimersByTime(ms)
  await nextTick()
}

function fakeTimers() {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
}

async function parkPointer() {
  const parking = document.createElement('div')
  parking.style.cssText = 'position:fixed;right:0;bottom:0;width:4px;height:4px'
  document.body.append(parking)
  await userEvent.hover(parking)
  parking.remove()
}

const Host = defineComponent({
  props: {
    openDelay: { type: Number, default: 0 },
    closeDelay: { type: Number, default: 0 },
    'onUpdate:open': { type: Function as PropType<(open: boolean) => void>, default: undefined }
  },
  setup: (props) => () =>
    h('div', [
      h(
        HoverCard,
        {
          openDelay: props.openDelay,
          closeDelay: props.closeDelay,
          'onUpdate:open': props['onUpdate:open']
        },
        () => [
          h(HoverCard.Trigger, null, () => h('a', { href: '#jane' }, 'Jane Doe')),
          h(HoverCard.Content, null, () => h('p', 'Owner of production'))
        ]
      ),
      h('button', { type: 'button', 'data-testid': 'after' }, 'After')
    ])
})

const LinkHost = defineComponent({
  setup: () => () =>
    h('div', [
      h(HoverCard, { openDelay: 0, closeDelay: 0 }, () => [
        h(HoverCard.Trigger, null, () => h('a', { href: '#jane' }, 'Jane Doe')),
        h(HoverCard.Content, null, () => [
          h('p', 'Owner of production'),
          h('a', { href: '#profile', 'data-testid': 'profile' }, 'Profile'),
          h('a', { href: '#activity', 'data-testid': 'activity' }, 'Activity')
        ])
      ]),
      h('button', { type: 'button', 'data-testid': 'after' }, 'After')
    ])
})

const inCard = (id: string) =>
  document.body.querySelector<HTMLElement>(
    `[data-testid="hover-card-content"] [data-testid="${id}"]`
  ) as HTMLElement

const EdgeHost = (dir: 'ltr' | 'rtl', edge: 'left' | 'right') =>
  defineComponent({
    setup: () => () =>
      h('div', { dir, style: `position:fixed;top:200px;${edge}:0` }, [
        h(HoverCard, { defaultOpen: true, side: 'start', align: 'start' }, () => [
          h(HoverCard.Trigger, null, () => h('a', { href: '#jane' }, 'Jane Doe')),
          h(HoverCard.Content, null, () => h('p', 'Owner of production'))
        ])
      ])
  })

describe('HoverCard', () => {
  afterEach(async () => {
    vi.useRealTimers()
    await parkPointer()
  })

  it('resolves side=start to the right under rtl, so a trigger on the right edge flips to end', async () => {
    render(EdgeHost('rtl', 'right'))
    await waitFor(() => expect(card()?.dataset['side']).toBe('end'))
  })

  it('keeps side=start under rtl when the trigger sits on the left edge', async () => {
    render(EdgeHost('rtl', 'left'))
    await waitFor(() => expect(card()?.style.translate ?? '').not.toMatch(/-9999|^$/))
    expect(card()?.dataset['side']).toBe('start')
    expect(card()?.dataset['align']).toBe('start')
  })

  it('renders derived test ids, closed by default, and a consumer test id wins', () => {
    const { container } = render(Default)
    expect(container.querySelector('[data-testid="hover-card"]')).not.toBeNull()
    expect(trigger()?.dataset['state']).toBe('closed')
    expect(card()).toBeNull()

    const Override = defineComponent({
      setup: () => () =>
        h(HoverCard, { 'data-testid': 'user-card' }, () => [
          h(HoverCard.Trigger, null, () => h('a', { href: '#x' }, 'X'))
        ])
    })
    const second = render(Override)
    expect(second.container.querySelector('[data-testid="user-card"]')).not.toBeNull()
    expect(second.container.querySelector('[data-testid="hover-card-trigger"]')).not.toBeNull()
  })

  it('hover opens after the open delay and leaving closes after the close delay', async () => {
    const updates: boolean[] = []
    render(Host, {
      props: { openDelay: 150, closeDelay: 150, 'onUpdate:open': (v: boolean) => updates.push(v) }
    })
    fakeTimers()
    pointer(trigger(), 'pointerenter')
    await advance(149)
    expect(card()).toBeNull()
    await advance(1)
    expect(card()).not.toBeNull()
    expect(trigger()?.dataset['state']).toBe('open')
    pointer(trigger(), 'pointerleave')
    await advance(149)
    expect(card()).not.toBeNull()
    await advance(1)
    expect(card()).toBeNull()
    expect(updates).toEqual([true, false])
  })

  it('the pointer can move from the trigger onto the card without closing it', async () => {
    render(Host, { props: { closeDelay: 200 } })
    fakeTimers()
    pointer(trigger(), 'pointerenter')
    await advance(0)
    expect(card()).not.toBeNull()
    pointer(trigger(), 'pointerleave')
    pointer(card(), 'pointerenter')
    await advance(300)
    expect(card()).not.toBeNull()
    pointer(card(), 'pointerleave')
    await advance(199)
    expect(card()).not.toBeNull()
    await advance(1)
    expect(card()).toBeNull()
  })

  it('a touch pointer does not open the card', async () => {
    const Offset = defineComponent({
      setup: () => () => h('div', { style: 'padding-top: 60vh' }, [h(Host)])
    })
    render(Offset)
    fakeTimers()
    trigger()?.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'touch' }))
    await advance(1000)
    expect(card()).toBeNull()
  })

  it('keyboard focus opens it, describes the link with the card, and Tab away closes it', async () => {
    render(Host)
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(link())
    await waitFor(() => expect(card()).not.toBeNull(), OPENS)
    expect(link().getAttribute('aria-describedby')).toBe(card()?.id)
    expect(card()?.hasAttribute('role')).toBe(false)
    await userEvent.keyboard('{Tab}')
    await waitFor(() => expect(card()).toBeNull(), OPENS)
    expect(link().hasAttribute('aria-describedby')).toBe(false)
  })

  it('Escape closes the card without moving focus', async () => {
    render(Host)
    link().focus()
    await waitFor(() => expect(card()).not.toBeNull(), OPENS)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(card()).toBeNull(), OPENS)
    expect(document.activeElement).toBe(link())
  })

  it('Tab from the open trigger reaches the links in the card, then the page after the trigger', async () => {
    render(LinkHost)
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(link())
    await waitFor(() => expect(card()).not.toBeNull(), OPENS)
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(inCard('profile'))
    expect(card()).not.toBeNull()
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(inCard('activity'))
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement?.getAttribute('data-testid')).toBe('after')
    await waitFor(() => expect(card()).toBeNull(), OPENS)
  })

  it('Shift+Tab from the first card link returns to the trigger and keeps the card open', async () => {
    render(LinkHost)
    link().focus()
    await waitFor(() => expect(card()).not.toBeNull(), OPENS)
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(inCard('profile'))
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}')
    expect(document.activeElement).toBe(link())
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(card()).not.toBeNull()
  })

  it('Escape inside the card closes it and returns focus to the trigger', async () => {
    render(LinkHost)
    link().focus()
    await waitFor(() => expect(card()).not.toBeNull(), OPENS)
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(inCard('profile'))
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(card()).toBeNull(), OPENS)
    expect(document.activeElement).toBe(link())
  })

  it('disabled never opens', async () => {
    const { container } = render(Disabled)
    expect(
      container.querySelector('[data-testid="hover-card"]')?.hasAttribute('data-disabled')
    ).toBe(true)
    fakeTimers()
    pointer(trigger(), 'pointerenter')
    link().focus()
    await advance(5000)
    expect(card()).toBeNull()
  })

  it('the ResourcePreview example opens on hover, teleported to body with a resolved side and align', async () => {
    const { container } = render(ResourcePreview)
    await nextTick()
    expect(card()).toBeNull()
    await userEvent.hover(link())
    await waitFor(() => expect(card()).not.toBeNull(), OPENS)
    expect(container.contains(card())).toBe(false)
    expect(card()?.dataset['side']).toMatch(/^(top|bottom)$/)
    expect(card()?.dataset['align']).toBe('start')
    await nextTick()
    await expectNoA11yViolations(container)
    await expectNoA11yViolations(card() as HTMLElement)
  })

  it('the default example has no a11y violations', async () => {
    const { container } = render(Default)
    await expectNoA11yViolations(container)
  })

  it('mounts 1,000 closed triggers quickly', () => {
    const Many = defineComponent({
      setup: () => () =>
        h(
          'ul',
          Array.from({ length: 1000 }, (_, i) =>
            h('li', { key: i }, [
              h(HoverCard, null, () => [
                h(HoverCard.Trigger, null, () => h('a', { href: `#r${i}` }, `resource-${i}`)),
                h(HoverCard.Content, null, () => h('p', `Details ${i}`))
              ])
            ])
          )
        )
    })
    const start = performance.now()
    render(Many)
    const elapsed = performance.now() - start
    expect(document.body.querySelectorAll('[data-testid="hover-card-trigger"]')).toHaveLength(1000)
    expect(card()).toBeNull()
    expect(elapsed).toBeLessThan(1500)
  })
})
