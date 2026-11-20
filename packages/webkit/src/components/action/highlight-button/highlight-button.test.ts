import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/highlight-button/default.vue'
import Disabled from '../../../../examples/highlight-button/disabled.vue'
import Loading from '../../../../examples/highlight-button/loading.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import HighlightButton from './highlight-button.vue'

describe('HighlightButton', () => {
  describe('rendering & polymorphism', () => {
    it('renders a <button type=button> with the label and the default testid', () => {
      const { getByRole } = render(HighlightButton, { props: { label: 'Ask Azion' } })
      const node = getByRole('button', { name: 'Ask Azion' }) as HTMLButtonElement
      expect(node.tagName).toBe('BUTTON')
      expect(node.getAttribute('type')).toBe('button')
      expect(node.getAttribute('data-testid')).toBe('highlight-button')
    })

    it('renders an <a> when href is set, carrying href/target/rel', () => {
      const { getByRole } = render(HighlightButton, {
        props: { label: 'Docs', href: 'https://example.com', target: '_blank' }
      })
      const link = getByRole('link', { name: 'Docs' })
      expect(link.tagName).toBe('A')
      expect(link.getAttribute('href')).toBe('https://example.com')
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    })

    it('omits rel when the anchor target is _self', () => {
      const { getByRole } = render(HighlightButton, {
        props: { label: 'Home', href: '/home', target: '_self' }
      })
      const link = getByRole('link', { name: 'Home' })
      expect(link.getAttribute('target')).toBe('_self')
      expect(link.getAttribute('rel')).toBeNull()
    })

    it('honors a consumer-provided data-testid over the fallback', () => {
      const { getByTestId } = render(HighlightButton, {
        props: { label: 'Ask Azion' },
        attrs: { 'data-testid': 'ask-button' }
      })
      expect(getByTestId('ask-button').tagName).toBe('BUTTON')
    })

    it('reflects the size prop on the data-size attribute', () => {
      const { getByRole } = render(HighlightButton, {
        props: { label: 'Ask Azion', size: 'medium' }
      })
      expect(getByRole('button', { name: 'Ask Azion' }).getAttribute('data-size')).toBe('medium')
    })
  })

  describe('click emission', () => {
    it('emits click with a MouseEvent when active (button)', async () => {
      const { getByRole, emitted } = render(HighlightButton, { props: { label: 'Go' } })
      await fireEvent.click(getByRole('button'))
      const events = emitted().click as MouseEvent[][]
      expect(events).toHaveLength(1)
      expect(events[0][0]).toBeInstanceOf(MouseEvent)
    })

    it('emits click when active as an anchor', async () => {
      const { getByRole, emitted } = render(HighlightButton, {
        props: { label: 'Docs', href: 'https://example.com' }
      })
      await fireEvent.click(getByRole('link'))
      const events = emitted().click as MouseEvent[][]
      expect(events).toHaveLength(1)
      expect(events[0][0]).toBeInstanceOf(MouseEvent)
    })
  })

  describe('disabled', () => {
    it('sets the native + aria disabled state and suppresses click', async () => {
      const { getByRole, emitted } = render(HighlightButton, {
        props: { label: 'Ask Azion', disabled: true }
      })
      const node = getByRole('button', { name: 'Ask Azion' }) as HTMLButtonElement
      expect(node.disabled).toBe(true)
      expect(node.getAttribute('aria-disabled')).toBe('true')
      expect(node.getAttribute('data-disabled')).toBe('')
      await fireEvent.click(node)
      expect(emitted().click).toBeUndefined()
    })

    it('marks a disabled anchor inactive (aria-disabled + tabindex=-1) and suppresses click', async () => {
      const { getByRole, emitted } = render(HighlightButton, {
        props: { label: 'Docs', href: 'https://example.com', disabled: true }
      })
      const link = getByRole('link', { name: 'Docs' })
      expect(link.getAttribute('aria-disabled')).toBe('true')
      expect(link.getAttribute('tabindex')).toBe('-1')
      await fireEvent.click(link)
      expect(emitted().click).toBeUndefined()
    })
  })

  describe('loading', () => {
    it('exposes aria-busy, shows the spinner, and suppresses click (not natively disabled)', async () => {
      const { getByRole, getByTestId, emitted } = render(HighlightButton, {
        props: { label: 'Ask Azion', loading: true }
      })
      const node = getByRole('button', { name: 'Ask Azion' }) as HTMLButtonElement
      expect(node.getAttribute('aria-busy')).toBe('true')
      expect(node.getAttribute('aria-disabled')).toBe('true')
      expect(node.getAttribute('data-loading')).toBe('')
      expect(node.disabled).toBe(false)
      expect(getByTestId('highlight-button__loading')).toBeTruthy()
      await fireEvent.click(node)
      expect(emitted().click).toBeUndefined()
    })
  })

  describe('attribute forwarding', () => {
    it('gives the button the consumer aria-label as its accessible name', () => {
      const { getByRole } = render(HighlightButton, {
        props: { label: 'Ask' },
        attrs: { 'aria-label': 'Ask the assistant' }
      })
      expect(getByRole('button', { name: 'Ask the assistant' }).tagName).toBe('BUTTON')
    })

    it('gives the anchor the consumer aria-label and id', () => {
      const { getByRole } = render(HighlightButton, {
        props: { label: 'Ask', href: 'https://example.com/ask' },
        attrs: { 'aria-label': 'Ask the assistant', id: 'ask-link' }
      })
      expect(getByRole('link', { name: 'Ask the assistant' }).id).toBe('ask-link')
    })

    it('lands id, aria-describedby, name and form on the native button', () => {
      const { getByRole } = render(HighlightButton, {
        props: { label: 'Ask' },
        attrs: { id: 'ask', 'aria-describedby': 'ask-hint', name: 'intent', form: 'chat' }
      })
      const node = getByRole('button', { name: 'Ask' })
      expect(node.id).toBe('ask')
      expect(node.getAttribute('aria-describedby')).toBe('ask-hint')
      expect(node.getAttribute('name')).toBe('intent')
      expect(node.getAttribute('form')).toBe('chat')
    })

    it('keeps its own disabled state over a conflicting consumer aria-disabled', () => {
      const { getByRole } = render(HighlightButton, {
        props: { label: 'Ask', disabled: true },
        attrs: { 'aria-disabled': 'false' }
      })
      expect(getByRole('button', { name: 'Ask' }).getAttribute('aria-disabled')).toBe('true')
    })
  })

  describe('a11y (axe against styled DOM)', () => {
    it('Default (button) has no violations', async () => {
      const { container } = render(HighlightButton, { props: { label: 'Ask Azion' } })
      await expectNoA11yViolations(container)
    })

    it('Anchor variant has no violations', async () => {
      const { container } = render(HighlightButton, {
        props: { label: 'Docs', href: 'https://example.com' }
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('documented examples (the example file runs in-test)', () => {
    it('Default story mounts an enabled button', async () => {
      const { getByRole, emitted } = render(Default)
      const node = getByRole('button', { name: /Ask Azion/ })
      expect(node.tagName).toBe('BUTTON')
      await fireEvent.click(node)
      expect((emitted().click as unknown[][]).length).toBe(1)
    })

    it('Disabled story is natively disabled', () => {
      const { getByRole } = render(Disabled)
      expect((getByRole('button', { name: /Ask Azion/ }) as HTMLButtonElement).disabled).toBe(true)
    })

    it('Loading story renders the spinner', () => {
      const { getByTestId } = render(Loading)
      expect(getByTestId('highlight-button__loading')).toBeTruthy()
    })
  })
})
