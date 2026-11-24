import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import Default from '../../../../examples/message-thread/default.vue'
import Loading from '../../../../examples/message-thread/loading.vue'
import Types from '../../../../examples/message-thread/types.vue'
import WithEarlierMessages from '../../../../examples/message-thread/with-earlier-messages.vue'
import WithQuotedText from '../../../../examples/message-thread/with-quoted-text.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import MessageThread, {
  MessageThreadGroup,
  MessageThreadItem,
  useMessageThreadContext
} from './index'

const announcer = (): string => document.querySelector('[data-webkit-announcer]')?.textContent ?? ''

describe('MessageThread', () => {
  describe('compound API', () => {
    it('attaches Item and Group to the root for dot-notation', () => {
      expect(MessageThread.Item).toBe(MessageThreadItem)
      expect(MessageThread.Group).toBe(MessageThreadGroup)
    })

    it('throws when a part renders outside a MessageThread', () => {
      const Loose = defineComponent({
        components: { MessageThreadItem },
        template: '<MessageThreadItem author="Jane Doe">Hello</MessageThreadItem>'
      })
      expect(() => render(Loose)).toThrow(/within a MessageThread/)
    })

    it('exposes the context to a custom part', () => {
      const Probe = defineComponent({
        setup() {
          const { timestampFormat } = useMessageThreadContext()
          return { timestampFormat }
        },
        template: '<li data-testid="probe">{{ timestampFormat }}</li>'
      })
      const view = render(
        defineComponent({
          components: { MessageThread, Probe },
          template: '<MessageThread timestamp-format="utc"><Probe /></MessageThread>'
        })
      )
      expect(view.getByTestId('probe').textContent).toBe('utc')
    })
  })

  describe('rendering & testid', () => {
    it('renders a named list with the root testid and a consumer override', () => {
      const view = render(Default)
      const root = view.getByTestId('message-thread')
      expect(root.tagName).toBe('OL')
      expect(root.getAttribute('role')).toBe('list')
      expect(root.getAttribute('aria-label')).toBe('Ticket 1042 conversation')
      expect(root.getAttribute('data-slot')).toBe('message-thread')
      expect(root.getAttribute('data-timestamp-format')).toBe('local')

      const custom = render(
        defineComponent({
          components: { MessageThread },
          template: '<MessageThread data-testid="ticket-thread" />'
        })
      )
      const overridden = custom.getByTestId('ticket-thread')
      expect(overridden.getAttribute('aria-label')).toBe('Conversation')
    })

    it('renders each reply and note as an article named by author and time', () => {
      const view = render(Types)
      const items = view.getAllByTestId('message-thread-item')
      expect(items.map((item) => item.getAttribute('data-type'))).toEqual([
        'reply',
        'note',
        'event'
      ])

      const reply = items[0]!.querySelector('article')!
      const ids = reply.getAttribute('aria-labelledby')!.split(' ')
      expect(ids).toHaveLength(2)
      expect(document.getElementById(ids[0]!)!.textContent).toBe('Priya Patel')
      expect(document.getElementById(ids[1]!)!.querySelector('time')).not.toBeNull()

      const note = items[1]!.querySelector('article')!
      const noteIds = note.getAttribute('aria-labelledby')!.split(' ')
      expect(document.getElementById(noteIds[0]!)!.textContent).toContain('Internal note')
      expect(view.getByTestId('message-thread-item__note').textContent).toContain('Internal note')

      expect(items[2]!.querySelector('article')).toBeNull()
      expect(view.getByTestId('message-thread-item__event').textContent).toContain(
        'John Smith assigned the ticket to Networking'
      )
    })
  })

  describe('item props', () => {
    it('writes the role and the channel, and keeps the channel off notes', () => {
      const view = render(Types)
      const [reply, note] = view.getAllByTestId('message-thread-item')
      expect(reply!.getAttribute('data-from')).toBe('customer')
      expect(reply!.getAttribute('data-channel')).toBe('chat')
      expect(reply!.querySelector('[data-testid="message-thread-item__role"]')!.textContent).toBe(
        'Customer'
      )
      expect(
        reply!.querySelector('[data-testid="message-thread-item__channel"]')!.textContent!.trim()
      ).toBe('via Chat')
      expect(note!.getAttribute('data-from')).toBe('agent')
      expect(note!.querySelector('[data-testid="message-thread-item__role"]')!.textContent).toBe(
        'Agent'
      )
      expect(note!.querySelector('[data-testid="message-thread-item__channel"]')).toBeNull()
      expect(view.getAllByTestId('message-thread-item')[2]!.hasAttribute('data-from')).toBe(false)
    })

    it('lists the To and Cc recipients of an email reply', () => {
      const view = render(WithQuotedText)
      const lines = view.getByTestId('message-thread-item__recipients').querySelectorAll('span')
      expect(lines[0]!.textContent).toContain('To: ')
      expect(lines[0]!.textContent).toContain('support@example.com')
      expect(lines[1]!.textContent).toContain('priya.patel@example.com')
      expect(lines[1]!.textContent).toContain('sam.lee@example.com')
      expect(lines[1]!.textContent!.startsWith('Cc: ')).toBe(true)
    })

    it('reads each recipients line in its own direction on right-to-left pages', () => {
      const host = document.createElement('div')
      host.setAttribute('dir', 'rtl')
      document.body.appendChild(host)
      const view = render(WithQuotedText, { container: host })
      const lines = view.getByTestId('message-thread-item__recipients').querySelectorAll('span')
      for (const line of lines) {
        expect(line).toHaveAttribute('dir', 'auto')
        expect(line.matches(':dir(ltr)')).toBe(true)
      }
      host.remove()
    })

    it('renders the attachments and actions slots', () => {
      const view = render(Default)
      expect(view.getAllByTestId('message-thread-item__attachments')).toHaveLength(1)
      expect(view.getByRole('button', { name: 'Reply' })).toBeTruthy()
      expect(view.getByText('invoice-1042.pdf')).toBeTruthy()
    })

    it('shows no time and names the article by its author when the timestamp is missing', () => {
      const view = render(
        defineComponent({
          components: { MessageThread, MessageThreadItem },
          template:
            '<MessageThread><MessageThreadItem author="Sam Lee" timestamp="not a date">Hi</MessageThreadItem></MessageThread>'
        })
      )
      expect(view.queryByTestId('message-thread-item__time')).toBeNull()
      const article = view.getByTestId('message-thread-item').querySelector('article')!
      expect(article.getAttribute('aria-labelledby')!.split(' ')).toHaveLength(1)
    })
  })

  describe('quoted text (v-model:quotedOpen)', () => {
    it('toggles the hidden quoted region and emits update:quotedOpen', async () => {
      const user = userEvent.setup()
      const onUpdate: boolean[] = []
      const view = render(
        defineComponent({
          components: { MessageThread, MessageThreadItem },
          setup: () => ({ onUpdate: (value: boolean) => onUpdate.push(value) }),
          template: `<MessageThread>
            <MessageThreadItem author="Alex Morgan" @update:quoted-open="onUpdate">
              New text
              <template #quoted>Old text</template>
            </MessageThreadItem>
          </MessageThread>`
        })
      )
      const toggle = view.getByRole('button', { name: 'Show quoted text' })
      const region = view.getByTestId('message-thread-item__quoted')
      expect(toggle.getAttribute('aria-expanded')).toBe('false')
      expect(toggle.getAttribute('aria-controls')).toBe(region.id)
      expect(region.hidden).toBe(true)
      expect(region.getAttribute('data-state')).toBe('closed')

      await user.click(toggle)
      expect(onUpdate).toEqual([true])
      expect(region.hidden).toBe(false)
      expect(region.getAttribute('data-state')).toBe('open')
      expect(toggle.getAttribute('aria-expanded')).toBe('true')
      expect(toggle.getAttribute('aria-label')).toBe('Hide quoted text')
    })

    it('follows a controlled model', async () => {
      const open = ref(true)
      const view = render(
        defineComponent({
          components: { MessageThread, MessageThreadItem },
          setup: () => ({ open }),
          template: `<MessageThread><MessageThreadItem v-model:quoted-open="open" author="Jane Doe">
            Body<template #quoted>Quote</template></MessageThreadItem></MessageThread>`
        })
      )
      expect(view.getByTestId('message-thread-item__quoted').hidden).toBe(false)
      open.value = false
      await nextTick()
      expect(view.getByTestId('message-thread-item__quoted').hidden).toBe(true)
    })

    it('renders no toggle without the quoted slot', () => {
      const view = render(Types)
      expect(view.queryByTestId('message-thread-item__quoted-toggle')).toBeNull()
    })
  })

  describe('group (v-model:open)', () => {
    it('reveals the earlier messages and moves focus to the first one', async () => {
      const user = userEvent.setup()
      const view = render(WithEarlierMessages)
      const group = view.getByTestId('message-thread-group')
      expect(group.getAttribute('data-state')).toBe('closed')
      expect(view.getAllByTestId('message-thread-item')).toHaveLength(4)

      const toggle = view.getByRole('button', { name: 'Show 6 earlier messages' })
      expect(toggle.hasAttribute('aria-expanded')).toBe(false)
      await user.click(toggle)

      expect(group.getAttribute('data-state')).toBe('open')
      const list = view.getByTestId('message-thread-group__list')
      expect(list.getAttribute('aria-label')).toBe('Earlier messages')
      expect(view.getAllByTestId('message-thread-item')).toHaveLength(10)
      const first = list.querySelector('article')!
      expect(document.activeElement).toBe(first)
      expect(first.getAttribute('aria-labelledby')).toBeTruthy()
    })

    it('emits update:open and reads the singular and count-less labels', async () => {
      const user = userEvent.setup()
      const updates: boolean[] = []
      const view = render(
        defineComponent({
          components: { MessageThread, MessageThreadGroup, MessageThreadItem },
          setup: () => ({ onUpdate: (value: boolean) => updates.push(value) }),
          template: `<MessageThread>
            <MessageThreadGroup :count="1" @update:open="onUpdate">
              <MessageThreadItem type="event">Jane Doe changed status to Open</MessageThreadItem>
            </MessageThreadGroup>
            <MessageThreadGroup data-testid="all"><MessageThreadItem author="Sam Lee">Hi</MessageThreadItem></MessageThreadGroup>
          </MessageThread>`
        })
      )
      expect(view.getByRole('button', { name: 'Show earlier messages' })).toBeTruthy()
      await user.click(view.getByRole('button', { name: 'Show 1 earlier message' }))
      expect(updates).toEqual([true])
      const event = view.getAllByTestId('message-thread-item')[0]!
      expect(document.activeElement).toBe(event)
    })
  })

  describe('loading', () => {
    it('renders placeholders, marks the list busy and announces the change', async () => {
      const view = render(Loading)
      const root = view.getByTestId('message-thread')
      expect(root.getAttribute('aria-busy')).toBe('true')
      expect(root.hasAttribute('data-loading')).toBe(true)
      const placeholders = view.getAllByTestId('message-thread__placeholder')
      expect(placeholders).toHaveLength(3)
      expect(placeholders.every((item) => item.getAttribute('aria-hidden') === 'true')).toBe(true)

      const loading = ref(false)
      render(
        defineComponent({
          components: { MessageThread },
          setup: () => ({ loading }),
          template: '<MessageThread :loading="loading" data-testid="live" />'
        })
      )
      loading.value = true
      await nextTick()
      expect(announcer()).toBe('Loading conversation')
      loading.value = false
      await nextTick()
      expect(announcer()).toBe('Conversation loaded')
    })
  })

  describe('right-to-left', () => {
    it('renders under dir="rtl" with the name isolated and the body auto-directed', async () => {
      const host = document.createElement('div')
      host.setAttribute('dir', 'rtl')
      document.body.appendChild(host)
      const view = render(Types, { container: host })
      expect(view.getAllByTestId('message-thread-item__author')[0]!.tagName).toBe('BDI')
      expect(view.getAllByTestId('message-thread-item__content')[0]!.getAttribute('dir')).toBe(
        'auto'
      )
      await expectNoA11yViolations(host)
      host.remove()
    })
  })

  describe('accessibility', () => {
    it('has no axe violations on the default, types, earlier messages and loading examples', async () => {
      for (const example of [Default, Types, WithEarlierMessages, Loading]) {
        const view = render(example)
        await expectNoA11yViolations(view.container)
        view.unmount()
      }
    })
  })
})
