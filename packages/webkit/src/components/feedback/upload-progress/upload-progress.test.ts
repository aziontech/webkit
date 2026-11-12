import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/upload-progress/default.vue'
import Finished from '../../../../examples/upload-progress/finished.vue'
import Move from '../../../../examples/upload-progress/move.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import UploadProgress, { type UploadProgressItem } from './upload-progress.vue'

const running = (): UploadProgressItem[] => [
  { id: '1', name: 'logo.svg', size: 4210, status: 'done' },
  { id: '2', name: 'app.js', size: 2048, status: 'running', progress: 50 },
  { id: '3', name: 'styles.css', status: 'queued' }
]

describe('UploadProgress', () => {
  it('is a named region whose header counts finished files', () => {
    const view = render(UploadProgress, { props: { items: running(), floating: false } })
    const region = view.getByRole('region', { name: 'File transfers' })
    expect(region.getAttribute('data-state')).toBe('running')
    expect(view.getByTestId('feedback-upload-progress__title').textContent?.trim()).toBe(
      'Uploading 1 of 3 files'
    )
    expect(view.getByRole('status').textContent).toBe('Uploading 1 of 3 files')
    const overall = view.getByRole('progressbar', { name: 'Uploading 1 of 3 files' })
    expect(overall.getAttribute('aria-valuenow')).toBe('50')
    expect(view.getByRole('progressbar', { name: 'app.js progress' })).toBeTruthy()
    expect(view.getByText('Waiting')).toBeTruthy()
  })

  it('emits cancel for one file and for all', async () => {
    const view = render(UploadProgress, { props: { items: running(), floating: false } })
    await fireEvent.click(view.getByRole('button', { name: 'Cancel app.js' }))
    await fireEvent.click(view.getByRole('button', { name: 'Cancel all' }))
    expect(view.emitted('cancel')).toEqual([['2'], []])
  })

  it('turns into the outcome with retry and close when finished', async () => {
    const view = render(Finished)
    const region = view.getByRole('region')
    expect(region.getAttribute('data-state')).toBe('failed')
    expect(view.getByRole('status').textContent).toBe('3 files uploaded, 1 failed')
    expect(view.getByRole('img', { name: 'Failed' })).toBeTruthy()
    expect(view.getByText('Connection lost')).toBeTruthy()
    expect(view.getByRole('button', { name: 'Retry intro.mp4' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Retry failed' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Open folder' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Close' })).toBeTruthy()
    expect(view.queryByRole('button', { name: 'Cancel all' })).toBeNull()
  })

  it('emits retry and close', async () => {
    const items: UploadProgressItem[] = [
      { id: 'x', name: 'x.bin', status: 'error', error: 'Connection lost' }
    ]
    const view = render(UploadProgress, { props: { items, floating: false } })
    await fireEvent.click(view.getByRole('button', { name: 'Retry x.bin' }))
    await fireEvent.click(view.getByRole('button', { name: 'Retry failed' }))
    await fireEvent.click(view.getByRole('button', { name: 'Close' }))
    expect(view.emitted('retry')).toEqual([['x'], []])
    expect(view.emitted('close')).toHaveLength(1)
  })

  it('collapses the list with the toggle', async () => {
    const view = render(Move)
    const toggle = view.getByRole('button', { name: 'Show files' })
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    const list = document.getElementById(toggle.getAttribute('aria-controls') ?? '')
    expect(list?.style.display).toBe('none')
    expect(view.getByTestId('feedback-upload-progress__title').textContent?.trim()).toBe(
      'Moving 1 of 3 files'
    )
    await fireEvent.click(toggle)
    expect(view.getByRole('button', { name: 'Hide files' }).getAttribute('aria-expanded')).toBe(
      'true'
    )
    expect(list?.style.display).toBe('')
  })

  it('floats by default and renders in the flow when asked', () => {
    const floating = render(UploadProgress, { props: { items: running() } })
    expect(floating.getByRole('region').hasAttribute('data-floating')).toBe(true)
    floating.unmount()
    const inline = render(UploadProgress, { props: { items: running(), floating: false } })
    expect(inline.getByRole('region').hasAttribute('data-floating')).toBe(false)
  })

  it('reads the active locale', () => {
    const Host = defineComponent({
      render: () =>
        h(
          WebkitProvider,
          { locale: 'pt-BR', catalogs: LOCALES },
          { default: () => h(UploadProgress, { items: running(), floating: false }) }
        )
    })
    const view = render(Host)
    expect(view.getByRole('region', { name: 'Transferências de arquivos' })).toBeTruthy()
    expect(view.getByRole('status').textContent).toBe('Enviando 1 de 3 arquivos')
  })

  it('anchors at the inline end under rtl', () => {
    const view = render(UploadProgress, { props: { items: running() }, attrs: { dir: 'rtl' } })
    const region = view.getByRole('region')
    expect(region.getAttribute('dir')).toBe('rtl')
    expect(region.className).toContain('end-(--spacing-md)')
    expect(region.className).not.toMatch(/\bright-/)
  })

  it('has no axe violations', async () => {
    for (const example of [Default, Finished, Move]) {
      const view = render(example)
      await expectNoA11yViolations(view.container)
      view.unmount()
    }
  })
})

describe('UploadProgress slot presence', () => {
  it('follows a v-if slot that appears and disappears after mount', async () => {
    const shown = ref(false)
    const { queryByTestId } = render({
      components: { UploadProgress },
      setup: () => ({ shown }),
      template: `<UploadProgress><template v-if="shown" #actions><span data-testid="probe">Slotted</span></template></UploadProgress>`
    })
    expect(queryByTestId('probe')).toBeNull()

    shown.value = true
    await nextTick()
    expect(queryByTestId('probe')).not.toBeNull()
    expect(queryByTestId('probe')).not.toBeNull()

    shown.value = false
    await nextTick()
    expect(queryByTestId('probe')).toBeNull()
    expect(queryByTestId('probe')).toBeNull()
  })
})
