import { render, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'

import AiChat, { type AiChatMessage } from '../../../../blocks/ai/ai-chat/ai-chat.vue'
import Artifact from '../../../../blocks/ai/ai-chat/variants/artifact.vue'

describe('ai/ai-chat Artifact', () => {
  describe('wide', () => {
    beforeEach(async () => {
      await page.viewport(1280, 900)
    })
    afterEach(async () => {
      await page.viewport(414, 896)
    })

    it('shows the artifact beside the thread with its versions and a named resize handle', async () => {
      const view = render(Artifact)
      const canvas = await view.findByRole('region', { name: 'top-orders.sql' })
      expect(canvas.textContent).toContain('2 of 2')
      expect(view.getByRole('separator', { name: 'Resize the artifact' })).toBeTruthy()
      expect(view.getAllByRole('button', { name: 'Open top-orders.sql' })).toHaveLength(2)
    })

    it('puts a follow-up question in the composer without a canned answer', async () => {
      const view = render(Artifact)
      await view.findByRole('region', { name: 'top-orders.sql' })
      await userEvent.click(view.getByRole('button', { name: 'Show the customer email too' }))
      expect(view.getByRole('textbox')).toHaveValue('Show the customer email too')
      expect(view.getByRole('region', { name: 'top-orders.sql' }).textContent).toContain('2 of 2')
    })

    it('closes to the Open that showed it and reopens the version of that message', async () => {
      const view = render(Artifact)
      await view.findByRole('region', { name: 'top-orders.sql' })
      const [firstOpen] = view.getAllByRole('button', { name: 'Open top-orders.sql' })
      await userEvent.click(firstOpen!)
      await waitFor(() =>
        expect(document.activeElement).toBe(
          view.getByRole('heading', { level: 2, name: 'top-orders.sql' })
        )
      )
      expect(view.getByRole('region', { name: 'top-orders.sql' }).textContent).toContain('1 of 2')
      await userEvent.click(view.getByRole('button', { name: 'Close top-orders.sql' }))
      expect(view.queryByRole('region', { name: 'top-orders.sql' })).toBeNull()
      await waitFor(() => expect(document.activeElement).toBe(firstOpen))
      expect(view.getByRole('button', { name: 'Show artifact' })).toBeTruthy()
    })
  })

  it('opens the canvas in a drawer on a narrow screen', async () => {
    await page.viewport(414, 896)
    const view = render(Artifact)
    await waitFor(() => expect(view.queryByRole('separator')).toBeNull())
    const [firstOpen] = view.getAllByRole('button', { name: 'Open top-orders.sql' })
    await userEvent.click(firstOpen!)
    const dialog = await view.findByRole('dialog', { name: 'Artifact' })
    await waitFor(() =>
      expect(dialog.querySelector('section')).toHaveAccessibleName('top-orders.sql')
    )
  })
})

describe('ai/ai-chat', () => {
  const thread: AiChatMessage[] = [
    { id: 'u1', from: 'user', content: 'Which plan am I on?', time: '08:00' },
    { id: 'a1', from: 'assistant', content: 'Acme Inc. is on the Business plan.', time: '08:01' }
  ]

  it('renders the messages it is given instead of the empty state', () => {
    const view = render(AiChat, { props: { messages: thread } })
    expect(view.container.textContent).toContain('Acme Inc. is on the Business plan.')
    expect(view.queryByText('How can I help with your Azion account?')).toBeNull()
  })

  it('emits send with the text and clears the composer', async () => {
    const view = render(AiChat)
    await userEvent.type(view.getByRole('textbox'), 'Purge styles.css')
    await userEvent.click(view.getByRole('button', { name: 'Submit' }))
    const [[event, text]] = view.emitted('send') as [[Event, string]]
    expect(event).toBeInstanceOf(Event)
    expect(text).toBe('Purge styles.css')
    expect(view.getByRole('textbox')).toHaveValue('')
  })

  it('emits send from a starter prompt', async () => {
    const view = render(AiChat)
    await userEvent.click(view.getByRole('button', { name: 'Protect my site with a WAF' }))
    expect((view.emitted('send') as [[Event, string]])[0][1]).toBe('Protect my site with a WAF')
  })

  it('shows Stop while loading and emits stop', async () => {
    const view = render(AiChat, { props: { messages: thread, loading: true } })
    await userEvent.click(view.getByRole('button', { name: 'Stop generating' }))
    expect(view.emitted('stop')).toHaveLength(1)
  })

  it('shows the error on the last answer and emits retry with it', async () => {
    const view = render(AiChat, {
      props: { messages: thread, error: 'The connection was interrupted.' }
    })
    expect(view.container.textContent).toContain('The connection was interrupted.')
    await userEvent.click(view.getByRole('button', { name: 'Try again' }))
    const [[event, message]] = view.emitted('retry') as [[Event, AiChatMessage]]
    expect(event).toBeInstanceOf(Event)
    expect(message.id).toBe('a1')
  })
})
