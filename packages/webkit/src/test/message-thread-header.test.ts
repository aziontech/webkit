import './reflow.css'

import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import type { Component } from 'vue'
import { defineComponent, h, nextTick } from 'vue'

import IconButton from '../components/action/icon-button/icon-button.vue'
import MessageThread from '../components/content/message-thread'

const AUTHOR = 'Alexandra Montgomery-Fitzgerald'

const settle = async (): Promise<void> => {
  await nextTick()
  await new Promise((done) => requestAnimationFrame(() => done(null)))
}

function mountThread(width: number, format: 'local' | 'utc', dir: 'ltr' | 'rtl') {
  const thread = MessageThread as unknown as Component & {
    Item: Component
  }
  return render(
    defineComponent({
      setup: () => () =>
        h('div', { dir, style: { width: `${width}px` } }, [
          h(
            thread,
            { timestampFormat: format, ariaLabel: 'Ticket 1042 conversation' },
            {
              default: () => [
                h(
                  thread.Item,
                  {
                    author: AUTHOR,
                    from: 'customer',
                    channel: 'email',
                    timestamp: '2026-11-20T09:12:00Z',
                    to: ['support@example.com'],
                    cc: ['sam.lee@example.com', 'priya.patel@example.com']
                  },
                  {
                    default: () => 'I was charged twice for the November invoice.',
                    actions: () => [
                      h(IconButton, { icon: 'az az-reply', variant: 'ghost', ariaLabel: 'Reply' }),
                      h(IconButton, {
                        icon: 'az az-ellipsis',
                        variant: 'ghost',
                        ariaLabel: 'More actions'
                      })
                    ]
                  }
                ),
                h(
                  thread.Item,
                  {
                    type: 'note',
                    author: 'Jane Doe',
                    from: 'agent',
                    timestamp: '2026-11-20T10:05:00Z'
                  },
                  { default: () => 'Duplicate charge confirmed.' }
                )
              ]
            }
          )
        ])
    })
  )
}

function longestWordWidth(author: HTMLElement): number {
  const probe = author.cloneNode() as HTMLElement
  probe.removeAttribute('id')
  probe.style.whiteSpace = 'nowrap'
  probe.style.position = 'absolute'
  probe.style.visibility = 'hidden'
  author.parentElement!.append(probe)
  let widest = 0
  for (const word of (author.textContent ?? '').split(/(?<=-)|\s+/)) {
    probe.textContent = word
    widest = Math.max(widest, probe.getBoundingClientRect().width)
  }
  probe.remove()
  return widest
}

describe('MessageThread item header in a narrow column (styled)', () => {
  const cases = [280, 320, 390].flatMap((width) =>
    (['local', 'utc'] as const).flatMap((format) =>
      (['ltr', 'rtl'] as const).map((dir) => ({ width, format, dir }))
    )
  )

  it.each(cases)(
    'wraps word by word at $width px ($format, $dir)',
    async ({ width, format, dir }) => {
      const { container } = mountThread(width, format, dir)
      await settle()
      const cards = Array.from(container.querySelectorAll<HTMLElement>('article'))
      expect(cards).toHaveLength(2)
      for (const card of cards) {
        const frame = card.getBoundingClientRect()
        for (const el of card.querySelectorAll<HTMLElement>('*')) {
          const box = el.getBoundingClientRect()
          if (box.width === 0) continue
          expect(box.left, el.dataset['testid'] ?? el.tagName).toBeGreaterThanOrEqual(
            frame.left - 1
          )
          expect(box.right, el.dataset['testid'] ?? el.tagName).toBeLessThanOrEqual(frame.right + 1)
        }
        const author = card.querySelector<HTMLElement>(
          '[data-testid="message-thread-item__author"]'
        )!
        const meta = author.parentElement!.parentElement!.getBoundingClientRect().width
        expect(author.getBoundingClientRect().width + 1).toBeGreaterThanOrEqual(
          Math.min(longestWordWidth(author), meta)
        )
        const range = document.createRange()
        range.selectNodeContents(author)
        const lines = new Set(Array.from(range.getClientRects(), (rect) => Math.round(rect.top)))
        const pieces = (author.textContent ?? '').split(/(?<=-)|\s+/).length
        expect(lines.size).toBeLessThanOrEqual(pieces)
        for (const piece of ['role', 'channel']) {
          const el = card.querySelector<HTMLElement>(
            `[data-testid="message-thread-item__${piece}"]`
          )
          if (el) expect(el.getClientRects()).toHaveLength(1)
        }
      }
      const first = cards[0]!
      const avatar = first.querySelector<HTMLElement>('header > :first-child')!
      const actions = first.querySelector<HTMLElement>(
        '[data-testid="message-thread-item__actions"]'
      )!
      expect(
        Math.abs(actions.getBoundingClientRect().top - avatar.getBoundingClientRect().top)
      ).toBeLessThan(2)
    }
  )
})
