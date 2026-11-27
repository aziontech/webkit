import './reflow.css'

import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import DetailTicket from '../../blocks/detail/detail-ticket/detail-ticket.vue'
import Card from '../components/content/card/card.vue'
import Subheader from '../components/layout/subheader/subheader.vue'

describe('a band heading over its content (styled)', () => {
  it('starts the Subheader title on the same edge as the card under it, in both directions', () => {
    for (const dir of ['ltr', 'rtl'] as const) {
      const view = render(() =>
        h('div', { dir, style: 'width: 640px', class: 'flex flex-col gap-(--layout-group-gap)' }, [
          h(Subheader, { title: 'Conversation', description: 'Every message on the ticket.' }),
          h(Card, { title: 'Message' }, () => 'Body')
        ])
      )
      const title = view.getByTestId('subheader__title').getBoundingClientRect()
      const card = view.getByTestId('card').getBoundingClientRect()
      if (dir === 'ltr') expect(Math.abs(title.left - card.left)).toBeLessThanOrEqual(0.5)
      else expect(Math.abs(title.right - card.right)).toBeLessThanOrEqual(0.5)
      view.unmount()
    }
  })

  it('lines the ticket Conversation heading up with its message cards', () => {
    const view = render(DetailTicket)
    const heading = Array.from(view.container.querySelectorAll('h2')).find(
      (el) => el.textContent?.trim() === 'Conversation'
    )!
    const section = heading.closest('section')!
    const card = section.querySelector<HTMLElement>('article, [data-testid="card"]')!
    expect(
      Math.abs(heading.getBoundingClientRect().left - card.getBoundingClientRect().left)
    ).toBeLessThanOrEqual(0.5)
  })
})
