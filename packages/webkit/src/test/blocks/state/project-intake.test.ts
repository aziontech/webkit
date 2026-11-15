import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import ProjectIntake from '../../../../blocks/state/project-intake/project-intake.vue'
import Initializing from '../../../../blocks/state/project-intake/variants/initializing.vue'
import UploadError from '../../../../blocks/state/project-intake/variants/upload-error.vue'

afterEach(() => cleanup())

const buttonByText = (text: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement | undefined
describe('state/project-intake', () => {
  it('offers Choose a folder as the keyboard way in', () => {
    const view = render(ProjectIntake)
    expect(view.getByRole('button', { name: 'Choose a folder' })).toBeTruthy()
    expect(
      view.container.querySelector('[aria-hidden="true"] h1, [aria-hidden="true"] p')
    ).toBeNull()
  })

  it('Initializing: each row says its status in words, and the page adds no live region', () => {
    const view = render(Initializing)
    const rows = Array.from(view.container.querySelectorAll('[data-testid$="__row"]'))
    expect(rows).toHaveLength(5)
    expect(rows[0].textContent).toContain('Done')
    expect(rows[4].textContent).toContain('Waiting')
    expect(view.container.querySelector('[aria-live="polite"]:not([data-testid])')).toBeNull()
  })

  it('UploadError: Retry clears the failure', async () => {
    const view = render(UploadError)
    expect(view.container.textContent).toContain('1 file could not be uploaded')
    const alertRetry = Array.from(
      view.container.querySelectorAll('[role="alert"] button, [role="status"] button')
    ).find((b) => b.textContent?.trim() === 'Retry') as HTMLButtonElement
    await fireEvent.click(alertRetry ?? (buttonByText('Retry') as HTMLButtonElement))
    await waitFor(() =>
      expect(view.container.textContent).not.toContain('1 file could not be uploaded')
    )
  })
})
