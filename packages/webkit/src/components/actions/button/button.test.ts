import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/actions/button/Button.stories'

import { expectNoA11yViolations } from '../../../test/axe'
import Button from './button.vue'

const { Default, Disabled, Loading } = composeStories(stories)

describe('Button', () => {
  describe('rendering & polymorphism', () => {
    it('renders a <button> with the label and the default testid', () => {
      const { getByRole } = render(Button, { props: { label: 'Save' } })
      const node = getByRole('button', { name: 'Save' })
      expect(node.tagName).toBe('BUTTON')
      expect(node.getAttribute('data-testid')).toBe('actions-button')
    })

    it('renders an <a> when href is set, carrying href/target/rel', () => {
      const { getByRole } = render(Button, {
        props: { label: 'Docs', href: 'https://example.com', target: '_blank' }
      })
      const link = getByRole('link', { name: 'Docs' })
      expect(link.tagName).toBe('A')
      expect(link.getAttribute('href')).toBe('https://example.com')
      expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    })

    it('honors a consumer-provided data-testid over the fallback', () => {
      const { getByTestId } = render(Button, {
        props: { label: 'Save' },
        attrs: { 'data-testid': 'save-button' }
      })
      expect(getByTestId('save-button').tagName).toBe('BUTTON')
    })
  })

  describe('click emission', () => {
    it('emits click with a MouseEvent when active', async () => {
      const { getByRole, emitted } = render(Button, { props: { label: 'Go' } })
      await fireEvent.click(getByRole('button'))
      const events = emitted().click as MouseEvent[][]
      expect(events).toHaveLength(1)
      expect(events[0][0]).toBeInstanceOf(MouseEvent)
    })
  })

  describe('disabled', () => {
    it('sets the native + aria disabled state and suppresses click', async () => {
      const { getByRole, emitted } = render(Button, {
        props: { label: 'Save', disabled: true }
      })
      const node = getByRole('button', { name: 'Save' }) as HTMLButtonElement
      expect(node.disabled).toBe(true)
      expect(node.getAttribute('aria-disabled')).toBe('true')
      await fireEvent.click(node)
      expect(emitted().click).toBeUndefined()
    })
  })

  describe('loading', () => {
    it('exposes aria-busy, shows the spinner, and suppresses click (not natively disabled)', async () => {
      const { getByRole, getByTestId, emitted } = render(Button, {
        props: { label: 'Save', loading: true }
      })
      const node = getByRole('button', { name: 'Save' }) as HTMLButtonElement
      expect(node.getAttribute('aria-busy')).toBe('true')
      expect(node.disabled).toBe(false)
      expect(getByTestId('actions-button-loading')).toBeTruthy()
      await fireEvent.click(node)
      expect(emitted().click).toBeUndefined()
    })
  })

  describe('a11y (axe against styled DOM)', () => {
    it('Default has no violations', async () => {
      const { container } = render(Button, { props: { label: 'Save' } })
      await expectNoA11yViolations(container)
    })

    it('Anchor variant has no violations', async () => {
      const { container } = render(Button, {
        props: { label: 'Docs', href: 'https://example.com' }
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('composeStories (the story fixture runs in-test)', () => {
    it('Default story mounts an enabled button', () => {
      const { getByRole } = render(Default)
      expect(getByRole('button', { name: 'Button' }).tagName).toBe('BUTTON')
    })

    it('Disabled story is disabled', () => {
      const { getByRole } = render(Disabled)
      expect((getByRole('button', { name: 'Button' }) as HTMLButtonElement).disabled).toBe(true)
    })

    it('Loading story renders the spinner', () => {
      const { getByTestId } = render(Loading)
      expect(getByTestId('actions-button-loading')).toBeTruthy()
    })
  })
})
