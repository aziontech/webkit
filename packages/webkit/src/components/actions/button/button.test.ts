import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import axe from 'axe-core'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/actions/button/Button.stories'
import Button from './button.vue'

const composed = composeStories(stories)

const expectNoA11yViolations = async (container: Element) => {
  const results = await axe.run(container)
  expect(results.violations).toEqual([])
}

describe('Button', () => {
  describe('rendering', () => {
    it('renders a <button> by default with the label text', () => {
      const { getByRole } = render(Button, { props: { label: 'Save' } })
      const node = getByRole('button', { name: 'Save' })
      expect(node.tagName).toBe('BUTTON')
      expect(node.getAttribute('data-testid')).toBe('actions-button')
    })

    it('renders an <a> when href is provided', () => {
      const { getByRole } = render(Button, {
        props: { label: 'Docs', href: 'https://example.com' }
      })
      const link = getByRole('link', { name: 'Docs' })
      expect(link.tagName).toBe('A')
      expect(link.getAttribute('href')).toBe('https://example.com')
    })

    it('honors a consumer-provided data-testid', () => {
      const { getByTestId } = render(Button, {
        props: { label: 'Save' },
        attrs: { 'data-testid': 'save-button' }
      })
      expect(getByTestId('save-button').tagName).toBe('BUTTON')
    })

    it.each(['primary', 'secondary', 'outlined', 'text', 'danger'] as const)(
      'mounts kind=%s without throwing',
      (kind) => {
        const { getByRole } = render(Button, { props: { label: 'X', kind } })
        expect(getByRole('button')).toBeTruthy()
      }
    )

    it.each(['small', 'medium', 'large'] as const)('mounts size=%s without throwing', (size) => {
      const { getByRole } = render(Button, { props: { label: 'X', size } })
      expect(getByRole('button')).toBeTruthy()
    })
  })

  describe('disabled', () => {
    it('reflects disabled via the native attribute and aria-disabled', () => {
      const { getByRole } = render(Button, {
        props: { label: 'Save', disabled: true }
      })
      const node = getByRole('button', { name: 'Save' }) as HTMLButtonElement
      expect(node.disabled).toBe(true)
      expect(node.getAttribute('aria-disabled')).toBe('true')
      expect(node.getAttribute('data-disabled')).toBe('')
    })

    it('does not emit click when disabled', async () => {
      const { getByRole, emitted } = render(Button, {
        props: { label: 'Save', disabled: true }
      })
      await fireEvent.click(getByRole('button'))
      expect(emitted().click).toBeUndefined()
    })
  })

  describe('loading', () => {
    it('exposes aria-busy and renders a spinner with the loading testid', () => {
      const { getByRole, getByTestId } = render(Button, {
        props: { label: 'Save', loading: true }
      })
      expect(getByRole('button').getAttribute('aria-busy')).toBe('true')
      expect(getByTestId('actions-button-loading')).toBeTruthy()
    })

    it('does not emit click while loading', async () => {
      const { getByRole, emitted } = render(Button, {
        props: { label: 'Save', loading: true }
      })
      await fireEvent.click(getByRole('button'))
      expect(emitted().click).toBeUndefined()
    })
  })

  describe('click', () => {
    it('emits click with the MouseEvent when active', async () => {
      const { getByRole, emitted } = render(Button, { props: { label: 'Save' } })
      await fireEvent.click(getByRole('button'))
      const events = emitted().click as MouseEvent[][]
      expect(events).toHaveLength(1)
      expect(events[0][0]).toBeInstanceOf(MouseEvent)
    })
  })

  describe('a11y', () => {
    it('Default has no axe violations', async () => {
      const { container } = render(Button, { props: { label: 'Save' } })
      await expectNoA11yViolations(container)
    })

    it('Disabled has no axe violations', async () => {
      const { container } = render(Button, {
        props: { label: 'Save', disabled: true }
      })
      await expectNoA11yViolations(container)
    })

    it('Anchor variant has no axe violations', async () => {
      const { container } = render(Button, {
        props: { label: 'Docs', href: 'https://example.com' }
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('via composeStories (runs the stories play() in vitest)', () => {
    it('Default play(): click + keyboard activate emit click', async () => {
      const { Default } = composed
      await Default.run()
    })

    it('Disabled play(): click does not emit; aria-disabled is set', async () => {
      const { Disabled } = composed
      await Disabled.run()
    })
  })
})
