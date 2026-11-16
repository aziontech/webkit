import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
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

describe('HoverCard', () => {
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
    await userEvent.hover(link())
    expect(card()).toBeNull()
    await waitFor(() => expect(card()).not.toBeNull())
    expect(trigger()?.dataset['state']).toBe('open')
    await userEvent.unhover(link())
    expect(card()).not.toBeNull()
    await waitFor(() => expect(card()).toBeNull())
    expect(updates).toEqual([true, false])
  })

  it('the pointer can move from the trigger onto the card without closing it', async () => {
    render(Host, { props: { closeDelay: 200 } })
    await userEvent.hover(link())
    await waitFor(() => expect(card()).not.toBeNull())
    trigger()?.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' }))
    card()?.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }))
    await new Promise((resolve) => setTimeout(resolve, 300))
    expect(card()).not.toBeNull()
    card()?.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' }))
    await waitFor(() => expect(card()).toBeNull())
  })

  it('a touch pointer does not open the card', async () => {
    const Offset = defineComponent({
      setup: () => () => h('div', { style: 'padding-top: 60vh' }, [h(Host)])
    })
    render(Offset)
    trigger()?.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'touch' }))
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(card()).toBeNull()
  })

  it('keyboard focus opens it, describes the link with the card, and Tab away closes it', async () => {
    render(Host)
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(link())
    await waitFor(() => expect(card()).not.toBeNull())
    expect(link().getAttribute('aria-describedby')).toBe(card()?.id)
    expect(card()?.hasAttribute('role')).toBe(false)
    await userEvent.keyboard('{Tab}')
    await waitFor(() => expect(card()).toBeNull())
    expect(link().hasAttribute('aria-describedby')).toBe(false)
  })

  it('Escape closes the card without moving focus', async () => {
    render(Host)
    link().focus()
    await waitFor(() => expect(card()).not.toBeNull())
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(card()).toBeNull())
    expect(document.activeElement).toBe(link())
  })

  it('Tab from the open trigger reaches the links in the card, then the page after the trigger', async () => {
    render(LinkHost)
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(link())
    await waitFor(() => expect(card()).not.toBeNull())
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(inCard('profile'))
    expect(card()).not.toBeNull()
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(inCard('activity'))
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement?.getAttribute('data-testid')).toBe('after')
    await waitFor(() => expect(card()).toBeNull())
  })

  it('Shift+Tab from the first card link returns to the trigger and keeps the card open', async () => {
    render(LinkHost)
    link().focus()
    await waitFor(() => expect(card()).not.toBeNull())
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
    await waitFor(() => expect(card()).not.toBeNull())
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(inCard('profile'))
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(card()).toBeNull())
    expect(document.activeElement).toBe(link())
  })

  it('disabled never opens', async () => {
    const { container } = render(Disabled)
    expect(
      container.querySelector('[data-testid="hover-card"]')?.hasAttribute('data-disabled')
    ).toBe(true)
    await userEvent.hover(link())
    await new Promise((resolve) => setTimeout(resolve, 650))
    expect(card()).toBeNull()
  })

  it('default-open renders the card teleported to body with a resolved placement', async () => {
    const { container } = render(ResourcePreview)
    await waitFor(() => expect(card()).not.toBeNull())
    expect(container.contains(card())).toBe(false)
    expect(card()?.dataset['placement']).toMatch(/^(top|bottom)/)
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
