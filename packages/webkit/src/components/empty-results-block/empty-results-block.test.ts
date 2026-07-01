import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'

import * as stories from '../../../../../apps/storybook/src/stories/components/EmptyResultsBlock.stories'

import { expectNoA11yViolations } from '../../test/axe'
import EmptyResultsBlock from './empty-results-block.vue'

const { Default, DisabledButton, NoBorder } = composeStories(stories)

const REQUIRED = {
  title: 'No results found',
  description: 'Try adjusting your filters or create a new item.'
}

describe('EmptyResultsBlock', () => {
  describe('rendering (required content)', () => {
    it('renders the title and description text', () => {
      const { getByText } = render(EmptyResultsBlock, { props: { ...REQUIRED } })
      expect(getByText('No results found')).toBeTruthy()
      expect(getByText('Try adjusting your filters or create a new item.')).toBeTruthy()
    })

    it('does not render the create button when createButtonLabel is empty (default)', () => {
      const { queryByRole } = render(EmptyResultsBlock, { props: { ...REQUIRED } })
      expect(queryByRole('button')).toBeNull()
    })

    it('does not render the documentation link when documentationService is null (default)', () => {
      const { queryByText } = render(EmptyResultsBlock, { props: { ...REQUIRED } })
      expect(queryByText('View Documentation')).toBeNull()
    })
  })

  describe('create button (createButtonLabel)', () => {
    it('renders the create button with the label and its derived testid', () => {
      const { getByRole, getByTestId } = render(EmptyResultsBlock, {
        props: { ...REQUIRED, createButtonLabel: 'Create Item' }
      })
      const node = getByRole('button', { name: 'Create Item' })
      expect(node.tagName).toBe('BUTTON')
      expect(getByTestId('create_Create Item_button')).toBe(node)
    })

    it('emits click-to-create when the create button is clicked', async () => {
      const { getByRole, emitted } = render(EmptyResultsBlock, {
        props: { ...REQUIRED, createButtonLabel: 'Create Item' }
      })
      await fireEvent.click(getByRole('button', { name: 'Create Item' }))
      expect(emitted()['click-to-create']).toHaveLength(1)
    })
  })

  describe('disabledList suppresses the create action', () => {
    it('natively disables the create button and does not emit click-to-create', async () => {
      const { getByRole, emitted } = render(EmptyResultsBlock, {
        props: { ...REQUIRED, createButtonLabel: 'Create Item', disabledList: true }
      })
      const node = getByRole('button', { name: 'Create Item' }) as HTMLButtonElement
      expect(node.disabled).toBe(true)
      await fireEvent.click(node)
      expect(emitted()['click-to-create']).toBeUndefined()
    })
  })

  describe('documentationService', () => {
    it('renders the documentation link and invokes the service on click', async () => {
      const documentationService = vi.fn()
      const { getByText } = render(EmptyResultsBlock, {
        props: { ...REQUIRED, documentationService }
      })
      const link = getByText('View Documentation')
      await fireEvent.click(link)
      expect(documentationService).toHaveBeenCalledTimes(1)
    })
  })

  describe('slots', () => {
    it('renders the illustration slot content', () => {
      const { getByTestId } = render(EmptyResultsBlock, {
        props: { ...REQUIRED },
        slots: { illustration: '<span data-testid="illo">art</span>' }
      })
      expect(getByTestId('illo')).toBeTruthy()
    })

    it('renders extraActionsLeft and extraActionsRight slot content', () => {
      const { getByTestId } = render(EmptyResultsBlock, {
        props: { ...REQUIRED },
        slots: {
          extraActionsLeft: '<span data-testid="left">L</span>',
          extraActionsRight: '<span data-testid="right">R</span>'
        }
      })
      expect(getByTestId('left')).toBeTruthy()
      expect(getByTestId('right')).toBeTruthy()
    })

    it('default slot overrides the built-in create button', () => {
      const { getByTestId, queryByRole } = render(EmptyResultsBlock, {
        props: { ...REQUIRED, createButtonLabel: 'Create Item' },
        slots: { default: '<span data-testid="custom-action">custom</span>' }
      })
      expect(getByTestId('custom-action')).toBeTruthy()
      // The built-in create button lives inside the default slot fallback,
      // so a provided default slot replaces it entirely.
      expect(queryByRole('button', { name: 'Create Item' })).toBeNull()
    })
  })

  describe('a11y (axe against styled DOM)', () => {
    it('Default (title + description + create button) has no violations', async () => {
      const { container } = render(EmptyResultsBlock, {
        props: { ...REQUIRED, createButtonLabel: 'Create Item' }
      })
      await expectNoA11yViolations(container)
    })

    it('With documentation link has no violations', async () => {
      const { container } = render(EmptyResultsBlock, {
        props: { ...REQUIRED, documentationService: () => {} }
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('composeStories (the story fixtures run in-test)', () => {
    it('Default story renders its title and an enabled create button', () => {
      const { getByText, getByRole } = render(Default)
      expect(getByText('No items yet')).toBeTruthy()
      expect((getByRole('button', { name: 'Create Item' }) as HTMLButtonElement).disabled).toBe(
        false
      )
    })

    it('DisabledButton story disables the create button', () => {
      const { getByRole } = render(DisabledButton)
      expect((getByRole('button', { name: 'Create Item' }) as HTMLButtonElement).disabled).toBe(
        true
      )
    })

    it('NoBorder story renders its title', () => {
      const { getByText } = render(NoBorder)
      expect(getByText('No border variant')).toBeTruthy()
    })
  })
})
