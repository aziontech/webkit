import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  sampleFailedUploads,
  sampleUploads
} from '../../../../blocks/state/state-project-intake/sample'
import StateProjectIntake from '../../../../blocks/state/state-project-intake/state-project-intake.vue'
import Initializing from '../../../../blocks/state/state-project-intake/variants/initializing.vue'

afterEach(() => cleanup())

const buttonByText = (text: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement | undefined
describe('state/state-project-intake', () => {
  it('offers Choose a folder and Choose files as the keyboard way in', () => {
    const view = render(StateProjectIntake)
    expect(view.getByRole('button', { name: 'Choose a folder' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Choose files' })).toBeTruthy()
    expect(
      view
        .getByRole('button', { name: 'Choose a folder' })
        .parentElement?.classList.contains('pointer-coarse:hidden')
    ).toBe(true)
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

  it('UploadError: Retry clears the failure and emits retry for every failed file', async () => {
    const view = render(StateProjectIntake, { props: { uploads: sampleFailedUploads } })
    expect(view.container.textContent).toContain('1 file could not be uploaded')
    expect(view.getByRole('heading', { level: 1 }).textContent?.trim()).toBe('Upload paused')
    expect(view.container.textContent).not.toContain('Setting up your deployment')
    const alertRetry = Array.from(
      view.container.querySelectorAll('[role="alert"] button, [role="status"] button')
    ).find((b) => b.textContent?.trim() === 'Retry') as HTMLButtonElement
    await fireEvent.click(alertRetry ?? (buttonByText('Retry') as HTMLButtonElement))
    await waitFor(() =>
      expect(view.container.textContent).not.toContain('1 file could not be uploaded')
    )
    const retries = view.emitted('retry') as [MouseEvent, string | undefined][]
    expect(retries).toHaveLength(1)
    expect(retries[0][0]).toBeInstanceOf(MouseEvent)
    expect(retries[0][1]).toBeUndefined()
  })

  it('heads a paused upload with its paused counts, not the uploading wording', () => {
    const view = render(StateProjectIntake, { props: { uploads: sampleFailedUploads } })
    expect(view.container.textContent).toContain('Paused: 2 of 5 uploaded, 1 failed')
    expect(view.container.textContent).not.toMatch(/Uploading \d+ of/)
  })

  it('renders the uploads it is given instead of the drop target', () => {
    const view = render(StateProjectIntake, {
      props: {
        uploads: [
          { id: 'index.html', name: 'index.html', size: 2000, status: 'success' as const },
          { id: 'main.js', name: 'main.js', size: 3000, status: 'pending' as const }
        ]
      }
    })
    expect(view.container.textContent).toContain('Setting up your deployment.')
    expect(view.container.querySelector('header')?.textContent).not.toMatch(/\d+ of \d+/)
    expect(view.container.textContent).toContain('2 files, 4.9 kB')
    expect(view.container.textContent).not.toContain(sampleUploads[0].name)
    expect(view.queryByRole('button', { name: 'Choose a folder' })).toBeNull()
  })

  it('emits select with the chosen folder', async () => {
    const view = render(StateProjectIntake)
    const pickers: HTMLInputElement[] = []
    const createElement = document.createElement.bind(document)
    const spy = vi.spyOn(document, 'createElement').mockImplementation(((tag: string) => {
      const el = createElement(tag)
      if (tag === 'input') {
        vi.spyOn(el as HTMLInputElement, 'click').mockImplementation(() => {})
        pickers.push(el as HTMLInputElement)
      }
      return el
    }) as typeof document.createElement)
    await fireEvent.click(buttonByText('Choose a folder')!)
    spy.mockRestore()
    const input = pickers[0]
    expect(input.webkitdirectory).toBe(true)
    const file = new File(['{}'], 'package.json', { type: 'application/json' })
    Object.defineProperty(input, 'files', { value: [file] })
    input.dispatchEvent(new Event('change'))
    await waitFor(() => expect(view.emitted('select')).toBeTruthy())
    const selected = view.emitted('select') as [Event, File[]][]
    expect(selected).toHaveLength(1)
    expect(selected[0][1].map((f) => f.name)).toEqual(['package.json'])
    await waitFor(() => expect(view.container.textContent).toContain('1 files received.'))
  })
})
