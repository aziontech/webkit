import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/actions/button-highlight/ButtonHighlight.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import ButtonHighlight from './button-highlight.vue'

const { Default, Disabled, Loading } = composeStories(stories)

describe('ButtonHighlight', () => {
  describe('rendering & polymorphism', () => {
    it('renders a <button type=button> with the label and the default testid', () => {
      const { getByRole } = render(ButtonHighlight, { props: { label: 'Ask Azion' } })
      const node = getByRole('button', { name: 'Ask Azion' }) as HTMLButtonElement
      expect(node.tagName).toBe('BUTTON')
      expect(node.getAttribute('type')).toBe('button')
      expect(node.getAttribute('data-testid')).toBe('actions-button-highlight')
    })

    it('renders an <a> when href is set, carrying href/target/rel', () => {
      const { getByRole } = render(ButtonHighlight, {
        props: { label: 'Docs', href: 'https://example.com', target: '_blank' }
      })
      const link = getByRole('link', { name: 'Docs' })
      expect(link.tagName).toBe('A')
      expect(link.getAttribute('href')).toBe('https://example.com')
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    })

    it('omits rel when the anchor target is _self', () => {
      const { getByRole } = render(ButtonHighlight, {
        props: { label: 'Home', href: '/home', target: '_self' }
      })
      const link = getByRole('link', { name: 'Home' })
      expect(link.getAttribute('target')).toBe('_self')
      expect(link.getAttribute('rel')).toBeNull()
    })

    it('honors a consumer-provided data-testid over the fallback', () => {
      const { getByTestId } = render(ButtonHighlight, {
        props: { label: 'Ask Azion' },
        attrs: { 'data-testid': 'ask-button' }
      })
      expect(getByTestId('ask-button').tagName).toBe('BUTTON')
    })

    it('reflects the size prop on the data-size attribute', () => {
      const { getByRole } = render(ButtonHighlight, {
        props: { label: 'Ask Azion', size: 'medium' }
      })
      expect(getByRole('button', { name: 'Ask Azion' }).getAttribute('data-size')).toBe('medium')
    })
  })

  describe('click emission', () => {
    it('emits click with a MouseEvent when active (button)', async () => {
      const { getByRole, emitted } = render(ButtonHighlight, { props: { label: 'Go' } })
      await fireEvent.click(getByRole('button'))
      const events = emitted().click as MouseEvent[][]
      expect(events).toHaveLength(1)
      expect(events[0][0]).toBeInstanceOf(MouseEvent)
    })

    it('emits click when active as an anchor', async () => {
      const { getByRole, emitted } = render(ButtonHighlight, {
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
      const { getByRole, emitted } = render(ButtonHighlight, {
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
      const { getByRole, emitted } = render(ButtonHighlight, {
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
      const { getByRole, getByTestId, emitted } = render(ButtonHighlight, {
        props: { label: 'Ask Azion', loading: true }
      })
      const node = getByRole('button', { name: 'Ask Azion' }) as HTMLButtonElement
      expect(node.getAttribute('aria-busy')).toBe('true')
      expect(node.getAttribute('aria-disabled')).toBe('true')
      expect(node.getAttribute('data-loading')).toBe('')
      expect(node.disabled).toBe(false)
      expect(getByTestId('actions-button-highlight-loading')).toBeTruthy()
      await fireEvent.click(node)
      expect(emitted().click).toBeUndefined()
    })
  })

  describe('enum smoke', () => {
    it.each(['small', 'medium', 'large'] as const)('renders size %s', (size) => {
      const { getByRole } = render(ButtonHighlight, { props: { label: 'Ask Azion', size } })
      expect(getByRole('button', { name: 'Ask Azion' }).getAttribute('data-size')).toBe(size)
    })
  })

  describe('a11y (axe against styled DOM)', () => {
    it('Default (button) has no violations', async () => {
      const { container } = render(ButtonHighlight, { props: { label: 'Ask Azion' } })
      await expectNoA11yViolations(container)
    })

    it('Anchor variant has no violations', async () => {
      const { container } = render(ButtonHighlight, {
        props: { label: 'Docs', href: 'https://example.com' }
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('composeStories (the story fixture runs in-test)', () => {
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
      expect(getByTestId('actions-button-highlight-loading')).toBeTruthy()
    })
  })
})
