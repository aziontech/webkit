import { render, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'

import Artifact from '../../blocks/platform/ai/ai-chat/variants/artifact.vue'

const content = () =>
  document.querySelector<HTMLElement>('[role="region"][aria-label="top-orders.sql content"]')!

describe('platform/ai/ai-chat Artifact', () => {
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

    it('streams a new version into the canvas with the pager locked, then shows it', async () => {
      const view = render(Artifact)
      await view.findByRole('region', { name: 'top-orders.sql' })
      await userEvent.click(view.getByRole('button', { name: 'Show the customer email too' }))
      await waitFor(() => expect(content()).toHaveAttribute('aria-busy', 'true'))
      expect(view.getByRole('button', { name: 'Previous version' })).toBeDisabled()
      await waitFor(() => expect(content().textContent).toContain('JOIN customers'), {
        timeout: 4000
      })
      await waitFor(() =>
        expect(view.getByRole('button', { name: 'Previous version' })).toBeEnabled()
      )
      expect(view.getByRole('region', { name: 'top-orders.sql' }).textContent).toContain('3 of 3')
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
