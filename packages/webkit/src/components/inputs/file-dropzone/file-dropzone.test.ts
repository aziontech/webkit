import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Folders from '../../../../examples/file-dropzone/folders.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import FileDropzone from './file-dropzone.vue'

const TEST_ID = 'input-file-dropzone'

const makeFile = (name: string, type: string): File => new File(['content'], name, { type })

const fileDrag = (type: string, files: File[] = [makeFile('a.png', 'image/png')]): DragEvent => {
  const dataTransfer = new DataTransfer()
  for (const file of files) dataTransfer.items.add(file)
  return new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer })
}

const textDrag = (type: string): DragEvent => {
  const dataTransfer = new DataTransfer()
  dataTransfer.setData('text/plain', 'hello')
  return new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer })
}

const names = (files: File[]): string[] => files.map((file) => file.name)

const recordDropEffect = (event: DragEvent): string[] => {
  const writes: string[] = []
  if (event.dataTransfer) {
    Object.defineProperty(event.dataTransfer, 'dropEffect', {
      configurable: true,
      get: () => writes[writes.length - 1] ?? 'none',
      set: (value: string) => {
        writes.push(value)
      }
    })
  }
  return writes
}

describe('FileDropzone', () => {
  describe('render', () => {
    it('renders the fallback data-testid with the default title', () => {
      const { getByTestId, getByText } = render(FileDropzone)
      expect(getByTestId(TEST_ID)).toBeTruthy()
      expect(getByText('Drop files to upload')).toBeTruthy()
    })

    it('lets a consumer override data-testid', () => {
      const { getByTestId, queryByTestId } = render(FileDropzone, {
        attrs: { 'data-testid': 'upload-target' }
      })
      expect(getByTestId('upload-target')).toBeTruthy()
      expect(queryByTestId(TEST_ID)).toBeNull()
    })

    it('renders the description only when provided', async () => {
      const { queryByText, rerender } = render(FileDropzone)
      expect(queryByText('PNG only')).toBeNull()
      await rerender({ description: 'PNG only' })
      expect(queryByText('PNG only')).toBeTruthy()
    })

    it('renders the icon class on the decorative glyph', () => {
      const { getByTestId } = render(FileDropzone, { props: { icon: 'pi pi-upload' } })
      const glyph = getByTestId(TEST_ID).querySelector('i')
      expect(glyph?.className).toContain('pi-upload')
      expect(glyph?.getAttribute('aria-hidden')).toBe('true')
    })
  })

  describe('data attributes', () => {
    it('defaults to inline and idle with no disabled or invalid flag', () => {
      const root = render(FileDropzone).getByTestId(TEST_ID)
      expect(root.getAttribute('data-kind')).toBe('inline')
      expect(root.getAttribute('data-state')).toBe('idle')
      expect(root.hasAttribute('data-disabled')).toBe(false)
      expect(root.hasAttribute('data-invalid')).toBe(false)
    })

    it('mirrors kind, disabled and invalid', () => {
      const root = render(FileDropzone, {
        props: { kind: 'overlay', disabled: true, invalid: true }
      }).getByTestId(TEST_ID)
      expect(root.getAttribute('data-kind')).toBe('overlay')
      expect(root.hasAttribute('data-disabled')).toBe(true)
      expect(root.hasAttribute('data-invalid')).toBe(true)
    })
  })

  describe('ARIA', () => {
    it('inline is a group labelled by the title and described by the description', () => {
      const { getByRole, getByText } = render(FileDropzone, {
        props: { title: 'Drop assets', description: 'PNG or JPG' }
      })
      const group = getByRole('group', { name: 'Drop assets' })
      expect(group.getAttribute('aria-labelledby')).toBe(getByText('Drop assets').id)
      expect(group.getAttribute('aria-describedby')).toBe(getByText('PNG or JPG').id)
    })

    it('inline omits aria-describedby when description is empty', () => {
      const root = render(FileDropzone).getByTestId(TEST_ID)
      expect(root.hasAttribute('aria-describedby')).toBe(false)
    })

    it('overlay is aria-hidden with no role and no slot content', () => {
      const root = render(FileDropzone, {
        props: { kind: 'overlay' },
        slots: { default: '<button type="button">Browse files</button>' }
      }).getByTestId(TEST_ID)
      expect(root.getAttribute('aria-hidden')).toBe('true')
      expect(root.hasAttribute('role')).toBe(false)
      expect(root.querySelector('button')).toBeNull()
    })

    it('inline renders the default slot', () => {
      const { getByRole } = render(FileDropzone, {
        slots: { default: '<button type="button">Browse files</button>' }
      })
      expect(getByRole('button', { name: 'Browse files' })).toBeTruthy()
    })
  })

  describe('inline drag lifecycle', () => {
    it('becomes active on a file dragenter and idle on the matching dragleave', async () => {
      const root = render(FileDropzone).getByTestId(TEST_ID)
      await fireEvent(root, fileDrag('dragenter'))
      expect(root.getAttribute('data-state')).toBe('active')
      await fireEvent(root, fileDrag('dragleave'))
      expect(root.getAttribute('data-state')).toBe('idle')
    })

    it('stays active while moving between descendants', async () => {
      const root = render(FileDropzone).getByTestId(TEST_ID)
      await fireEvent(root, fileDrag('dragenter'))
      await fireEvent(root, fileDrag('dragenter'))
      await fireEvent(root, fileDrag('dragleave'))
      expect(root.getAttribute('data-state')).toBe('active')
    })

    it('ignores drags that carry no files', async () => {
      const root = render(FileDropzone).getByTestId(TEST_ID)
      await fireEvent(root, textDrag('dragenter'))
      expect(root.getAttribute('data-state')).toBe('idle')
      const over = textDrag('dragover')
      await fireEvent(root, over)
      expect(over.defaultPrevented).toBe(false)
    })

    it('allows the drop on dragover with a copy effect', async () => {
      const root = render(FileDropzone).getByTestId(TEST_ID)
      const over = fileDrag('dragover')
      const writes = recordDropEffect(over)
      await fireEvent(root, over)
      expect(over.defaultPrevented).toBe(true)
      expect(writes).toEqual(['copy'])
    })

    it('returns to idle after a drop', async () => {
      const root = render(FileDropzone).getByTestId(TEST_ID)
      await fireEvent(root, fileDrag('dragenter'))
      const drop = fileDrag('drop')
      await fireEvent(root, drop)
      expect(drop.defaultPrevented).toBe(true)
      expect(root.getAttribute('data-state')).toBe('idle')
    })
  })

  describe('drop and reject', () => {
    it('emits drop with the event and every file when accept is empty', async () => {
      const { getByTestId, emitted } = render(FileDropzone)
      const files = [makeFile('a.png', 'image/png'), makeFile('b.txt', 'text/plain')]
      const drop = fileDrag('drop', files)
      await fireEvent(getByTestId(TEST_ID), drop)
      const [event, payload] = emitted<[DragEvent, File[]]>('drop')[0]
      expect(event).toBe(drop)
      expect(names(payload)).toEqual(['a.png', 'b.txt'])
      expect(emitted('reject')).toBeUndefined()
    })

    it('splits files by accept and emits drop before reject with the same event', async () => {
      const log: Array<[string, DragEvent, string[]]> = []
      const { getByTestId } = render(FileDropzone, {
        props: {
          accept: 'image/*, .PDF, application/json',
          onDrop: (event: DragEvent, files: File[]) => log.push(['drop', event, names(files)]),
          onReject: (event: DragEvent, files: File[]) => log.push(['reject', event, names(files)])
        }
      })
      const files = [
        makeFile('photo.jpg', 'image/jpeg'),
        makeFile('notes.txt', 'text/plain'),
        makeFile('Report.pdf', ''),
        makeFile('data.json', 'application/json'),
        makeFile('archive', '')
      ]
      const drop = fileDrag('drop', files)
      await fireEvent(getByTestId(TEST_ID), drop)
      expect(log).toEqual([
        ['drop', drop, ['photo.jpg', 'Report.pdf', 'data.json']],
        ['reject', drop, ['notes.txt', 'archive']]
      ])
    })

    it('emits only reject when no file matches', async () => {
      const { getByTestId, emitted } = render(FileDropzone, { props: { accept: '.png' } })
      await fireEvent(getByTestId(TEST_ID), fileDrag('drop', [makeFile('a.txt', 'text/plain')]))
      expect(emitted('drop')).toBeUndefined()
      expect(names(emitted<[DragEvent, File[]]>('reject')[0][1])).toEqual(['a.txt'])
    })

    it('accepts only the first matching file when multiple is false', async () => {
      const { getByTestId, emitted } = render(FileDropzone, {
        props: { multiple: false, accept: 'image/*' }
      })
      const files = [
        makeFile('notes.txt', 'text/plain'),
        makeFile('one.png', 'image/png'),
        makeFile('two.png', 'image/png')
      ]
      await fireEvent(getByTestId(TEST_ID), fileDrag('drop', files))
      expect(names(emitted<[DragEvent, File[]]>('drop')[0][1])).toEqual(['one.png'])
      expect(names(emitted<[DragEvent, File[]]>('reject')[0][1])).toEqual(['notes.txt', 'two.png'])
    })

    it('still emits when invalid', async () => {
      const { getByTestId, emitted } = render(FileDropzone, { props: { invalid: true } })
      await fireEvent(getByTestId(TEST_ID), fileDrag('drop'))
      expect(emitted('drop')).toHaveLength(1)
    })
  })

  describe('folders', () => {
    const fileEntry = (fullPath: string, type = 'text/plain') => ({
      isFile: true,
      isDirectory: false,
      fullPath,
      file: (ok: (file: File) => void) => ok(makeFile(fullPath.split('/').pop()!, type))
    })
    const dirEntry = (fullPath: string, ...batches: unknown[][]) => ({
      isFile: false,
      isDirectory: true,
      fullPath,
      createReader: () => {
        const queue = [...batches]
        return { readEntries: (ok: (entries: unknown[]) => void) => ok(queue.shift() ?? []) }
      }
    })
    const entryDrop = (...entries: unknown[]): DragEvent => {
      const event = new DragEvent('drop', { bubbles: true, cancelable: true })
      Object.defineProperty(event, 'dataTransfer', {
        value: {
          types: ['Files'],
          files: [],
          dropEffect: 'none',
          items: entries.map((entry) => ({ kind: 'file', webkitGetAsEntry: () => entry }))
        }
      })
      return event
    }
    const paths = (files: File[]): string[] => files.map((file) => file.webkitRelativePath)

    it('walks dropped folders, reading every batch, and keeps relative paths', async () => {
      const { getByTestId, emitted } = render(FileDropzone, { props: { directories: true } })
      const site = dirEntry(
        '/site',
        [fileEntry('/site/index.html', 'text/html')],
        [dirEntry('/site/css', [fileEntry('/site/css/main.css', 'text/css')])]
      )
      await fireEvent(getByTestId(TEST_ID), entryDrop(site, fileEntry('/robots.txt')))
      await waitFor(() => expect(emitted('drop')).toBeTruthy())
      const [, files] = emitted<[DragEvent, File[]]>('drop')[0]
      expect(paths(files)).toEqual(['site/index.html', 'site/css/main.css', 'robots.txt'])
      expect(names(files)).toEqual(['index.html', 'main.css', 'robots.txt'])
    })

    it('filters walked files by accept and multiple', async () => {
      const { getByTestId, emitted } = render(FileDropzone, {
        props: { directories: true, accept: '.css' }
      })
      const site = dirEntry('/site', [
        fileEntry('/site/index.html', 'text/html'),
        fileEntry('/site/main.css', 'text/css')
      ])
      await fireEvent(getByTestId(TEST_ID), entryDrop(site))
      await waitFor(() => expect(emitted('reject')).toBeTruthy())
      expect(paths(emitted<[DragEvent, File[]]>('drop')[0][1])).toEqual(['site/main.css'])
      expect(paths(emitted<[DragEvent, File[]]>('reject')[0][1])).toEqual(['site/index.html'])
    })

    it('falls back to dataTransfer.files without entry support', async () => {
      const { getByTestId, emitted } = render(FileDropzone, { props: { directories: true } })
      const drop = fileDrag('drop', [makeFile('a.png', 'image/png')])
      await fireEvent(getByTestId(TEST_ID), drop)
      await waitFor(() => expect(emitted('drop')).toBeTruthy())
      expect(names(emitted<[DragEvent, File[]]>('drop')[0][1])).toEqual(['a.png'])
    })

    it('pairs the Folders example with a folder picker and lists picked paths', async () => {
      const view = render(Folders)
      const picker = view.container.querySelector<HTMLInputElement>('input[webkitdirectory]')!
      expect(picker.webkitdirectory).toBe(true)
      const file = new File(['x'], 'main.css', { type: 'text/css' })
      Object.defineProperty(file, 'webkitRelativePath', { value: 'site/css/main.css' })
      Object.defineProperty(picker, 'files', { value: [file], configurable: true })
      await fireEvent.change(picker)
      expect(view.getByRole('button', { name: 'Remove site/css/main.css' })).toBeTruthy()
      await expectNoA11yViolations(view.container)
    })

    it('does not walk entries when directories is off', async () => {
      const { getByTestId, emitted } = render(FileDropzone)
      await fireEvent(getByTestId(TEST_ID), entryDrop(dirEntry('/site', [fileEntry('/site/a')])))
      expect(emitted('drop')).toBeUndefined()
    })
  })

  describe('disabled', () => {
    it('never becomes active and refuses the drop effect', async () => {
      const root = render(FileDropzone, { props: { disabled: true } }).getByTestId(TEST_ID)
      await fireEvent(root, fileDrag('dragenter'))
      expect(root.getAttribute('data-state')).toBe('idle')
      const over = fileDrag('dragover')
      const writes = recordDropEffect(over)
      await fireEvent(root, over)
      expect(over.defaultPrevented).toBe(true)
      expect(writes).toEqual(['none'])
    })

    it('emits neither drop nor reject', async () => {
      const { getByTestId, emitted } = render(FileDropzone, {
        props: { disabled: true, accept: '.png' }
      })
      const files = [makeFile('a.png', 'image/png'), makeFile('b.txt', 'text/plain')]
      await fireEvent(getByTestId(TEST_ID), fileDrag('drop', files))
      expect(emitted('drop')).toBeUndefined()
      expect(emitted('reject')).toBeUndefined()
    })
  })

  describe('overlay', () => {
    it('is hidden at rest and shown while files are dragged over the window', async () => {
      const root = render(FileDropzone, { props: { kind: 'overlay' } }).getByTestId(TEST_ID)
      expect(root.getAttribute('data-state')).toBe('idle')
      expect(root.style.display).toBe('none')

      await fireEvent(document.body, fileDrag('dragenter'))
      expect(root.getAttribute('data-state')).toBe('active')
      await waitFor(() => expect(root.style.display).not.toBe('none'))

      await fireEvent(document.body, fileDrag('dragleave'))
      expect(root.getAttribute('data-state')).toBe('idle')
      await waitFor(() => expect(root.style.display).toBe('none'))
    })

    it('ignores window drags that carry no files', async () => {
      const root = render(FileDropzone, { props: { kind: 'overlay' } }).getByTestId(TEST_ID)
      await fireEvent(document.body, textDrag('dragenter'))
      expect(root.getAttribute('data-state')).toBe('idle')
    })

    it('hides on Escape', async () => {
      const root = render(FileDropzone, { props: { kind: 'overlay' } }).getByTestId(TEST_ID)
      await fireEvent(document.body, fileDrag('dragenter'))
      await fireEvent.keyDown(document.body, { key: 'Escape' })
      expect(root.getAttribute('data-state')).toBe('idle')
    })

    it('hides on window dragend', async () => {
      const root = render(FileDropzone, { props: { kind: 'overlay' } }).getByTestId(TEST_ID)
      await fireEvent(document.body, fileDrag('dragenter'))
      await fireEvent(document.body, fileDrag('dragend'))
      expect(root.getAttribute('data-state')).toBe('idle')
    })

    it('blocks a drop outside its area without emitting', async () => {
      const { getByTestId, emitted } = render(FileDropzone, { props: { kind: 'overlay' } })
      const root = getByTestId(TEST_ID)
      await fireEvent(document.body, fileDrag('dragenter'))
      const over = fileDrag('dragover')
      const writes = recordDropEffect(over)
      await fireEvent(document.body, over)
      expect(over.defaultPrevented).toBe(true)
      expect(writes).toEqual(['none'])
      const drop = fileDrag('drop')
      await fireEvent(document.body, drop)
      expect(drop.defaultPrevented).toBe(true)
      expect(root.getAttribute('data-state')).toBe('idle')
      expect(emitted('drop')).toBeUndefined()
    })

    it('does not override a drop another handler already claimed', async () => {
      render(FileDropzone, { props: { kind: 'overlay' } })
      await fireEvent(document.body, fileDrag('dragenter'))
      const other = document.createElement('div')
      document.body.appendChild(other)
      other.addEventListener('dragover', (event) => {
        event.preventDefault()
        if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
      })
      const over = fileDrag('dragover')
      const writes = recordDropEffect(over)
      await fireEvent(other, over)
      expect(writes).toEqual(['move'])
      other.remove()
    })

    it('emits drop when files land on the visible overlay', async () => {
      const { getByTestId, emitted } = render(FileDropzone, { props: { kind: 'overlay' } })
      const root = getByTestId(TEST_ID)
      await fireEvent(document.body, fileDrag('dragenter'))
      const over = fileDrag('dragover')
      const writes = recordDropEffect(over)
      await fireEvent(root, over)
      expect(writes).toEqual(['copy'])
      const drop = fileDrag('drop', [makeFile('site.zip', 'application/zip')])
      await fireEvent(root, drop)
      const [event, payload] = emitted<[DragEvent, File[]]>('drop')[0]
      expect(event).toBe(drop)
      expect(names(payload)).toEqual(['site.zip'])
      expect(root.getAttribute('data-state')).toBe('idle')
    })

    it('stays inert when disabled', async () => {
      const root = render(FileDropzone, {
        props: { kind: 'overlay', disabled: true }
      }).getByTestId(TEST_ID)
      await fireEvent(document.body, fileDrag('dragenter'))
      expect(root.getAttribute('data-state')).toBe('idle')
      const drop = fileDrag('drop')
      await fireEvent(document.body, drop)
      expect(drop.defaultPrevented).toBe(false)
    })

    it('inline ignores window drags outside its region', async () => {
      const root = render(FileDropzone).getByTestId(TEST_ID)
      await fireEvent(document.body, fileDrag('dragenter'))
      expect(root.getAttribute('data-state')).toBe('idle')
    })
  })

  describe('a11y', () => {
    it('has no axe violations inline with a slotted action', async () => {
      const { container } = render(FileDropzone, {
        props: { description: 'PNG or JPG, up to 5 MB each.' },
        slots: { default: '<button type="button">Browse files</button>' }
      })
      await expectNoA11yViolations(container)
    })

    it('has no axe violations as an active overlay', async () => {
      const { container, getByTestId } = render(FileDropzone, {
        props: { kind: 'overlay', description: 'A project folder.' }
      })
      await fireEvent(document.body, fileDrag('dragenter'))
      await waitFor(() => expect(getByTestId(TEST_ID).style.display).not.toBe('none'))
      await expectNoA11yViolations(container)
    })
  })
})
