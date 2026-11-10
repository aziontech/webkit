import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import FieldFileUpload from './field-file-upload.vue'
import { formatFileSize } from './format-file-size'

const TEST_ID = 'input-field-file-upload'

const makeFile = (name: string, type: string, bytes = 8): File =>
  new File([new Uint8Array(bytes)], name, { type, lastModified: 1 })

const names = (files: File[]): string[] => files.map((file) => file.name)

const pick = async (input: HTMLElement, files: File[]): Promise<void> => {
  const transfer = new DataTransfer()
  for (const file of files) transfer.items.add(file)
  ;(input as HTMLInputElement).files = transfer.files
  await fireEvent.change(input)
}

const drop = async (target: HTMLElement, files: File[]): Promise<void> => {
  const dataTransfer = new DataTransfer()
  for (const file of files) dataTransfer.items.add(file)
  target.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }))
  await Promise.resolve()
  await Promise.resolve()
}

const renderControlled = (initial: File[], props: Record<string, unknown> = {}) => {
  const files = ref<File[]>(initial)
  const onReject = vi.fn()
  const Host = defineComponent({
    setup: () => () =>
      h(FieldFileUpload, {
        ...props,
        modelValue: files.value,
        'onUpdate:modelValue': (value: File[]) => {
          files.value = value
        },
        onReject
      })
  })
  return { ...render(Host), files, onReject }
}

describe('FieldFileUpload', () => {
  describe('render', () => {
    it('renders the fallback data-testid and its parts', () => {
      const { getByTestId, queryByTestId } = render(FieldFileUpload, {
        props: { label: 'Logo', helperText: 'PNG only.' }
      })
      const root = getByTestId(TEST_ID)
      expect(root.getAttribute('data-empty')).toBe('true')
      expect(getByTestId(`${TEST_ID}__label`)).toBeTruthy()
      expect(getByTestId(`${TEST_ID}__dropzone`)).toBeTruthy()
      expect(getByTestId(`${TEST_ID}__button`).textContent).toContain('Choose file')
      expect(getByTestId(`${TEST_ID}__input`).getAttribute('type')).toBe('file')
      expect(getByTestId(`${TEST_ID}__helper`)).toBeTruthy()
      expect(getByTestId(`${TEST_ID}__status`).getAttribute('role')).toBe('status')
      expect(queryByTestId(`${TEST_ID}__list`)).toBeNull()
    })

    it('lets a consumer data-testid win and derives the parts from it', () => {
      const { getByTestId, queryByTestId } = render(FieldFileUpload, {
        props: { label: 'Logo' },
        attrs: { 'data-testid': 'logo-upload' }
      })
      expect(getByTestId('logo-upload')).toBeTruthy()
      expect(getByTestId('logo-upload__button')).toBeTruthy()
      expect(queryByTestId(TEST_ID)).toBeNull()
    })

    it('omits the label and helper rows when their text is empty', () => {
      const { queryByTestId } = render(FieldFileUpload, { props: { disabled: true } })
      expect(queryByTestId(`${TEST_ID}__label`)).toBeNull()
      expect(queryByTestId(`${TEST_ID}__helper`)).toBeNull()
    })

    it('reads Choose files and forwards accept, multiple and name when multiple', () => {
      const { getByTestId } = render(FieldFileUpload, {
        props: { multiple: true, accept: '.png', name: 'logos' }
      })
      const input = getByTestId(`${TEST_ID}__input`) as HTMLInputElement
      expect(getByTestId(`${TEST_ID}__button`).textContent).toContain('Choose files')
      expect(input.multiple).toBe(true)
      expect(input.accept).toBe('.png')
      expect(input.name).toBe('logos')
      expect(getByTestId(TEST_ID).getAttribute('data-multiple')).toBe('true')
    })

    it.each(['small', 'medium', 'large'] as const)('mirrors size="%s" on data-size', (size) => {
      const { getByTestId } = render(FieldFileUpload, { props: { size } })
      expect(getByTestId(TEST_ID).getAttribute('data-size')).toBe(size)
    })

    it('lists each file with its name and binary size', () => {
      const { getAllByTestId, getByTestId } = render(FieldFileUpload, {
        props: {
          multiple: true,
          modelValue: [makeFile('a.png', 'image/png', 512), makeFile('b.png', 'image/png', 1536)]
        }
      })
      const rows = getAllByTestId(`${TEST_ID}__file`)
      expect(rows).toHaveLength(2)
      expect(rows[0].textContent).toContain('a.png')
      expect(rows[0].textContent).toContain('512 B')
      expect(rows[1].textContent).toContain('1.5 KB')
      expect(rows[0].querySelector('[title="a.png"]')).toBeTruthy()
      expect(getByTestId(TEST_ID).getAttribute('data-empty')).toBeNull()
    })
  })

  describe('picking through the native input', () => {
    it('updates v-model with the picked file and announces it', async () => {
      const { getByTestId, emitted } = render(FieldFileUpload)
      const file = makeFile('logo.png', 'image/png')
      await pick(getByTestId(`${TEST_ID}__input`), [file])

      const updates = emitted()['update:modelValue'] as File[][][]
      expect(names(updates[updates.length - 1][0])).toEqual(['logo.png'])
      expect(getByTestId(`${TEST_ID}__status`).textContent).toBe('logo.png added')
      expect(getByTestId(`${TEST_ID}__list`).textContent).toContain('logo.png')
    })

    it('replaces the current file when multiple is off', async () => {
      const { getByTestId, files } = renderControlled([makeFile('old.png', 'image/png')])
      await pick(getByTestId(`${TEST_ID}__input`), [makeFile('new.png', 'image/png')])
      expect(names(files.value)).toEqual(['new.png'])
    })

    it('appends picked files and announces a batch when multiple is on', async () => {
      const { getByTestId, files } = renderControlled([makeFile('a.png', 'image/png')], {
        multiple: true
      })
      await pick(getByTestId(`${TEST_ID}__input`), [
        makeFile('b.png', 'image/png'),
        makeFile('c.png', 'image/png')
      ])
      expect(names(files.value)).toEqual(['a.png', 'b.png', 'c.png'])
      expect(getByTestId(`${TEST_ID}__status`).textContent).toBe('2 files added')
    })

    it('rejects files outside accept and keeps the accepted ones', async () => {
      const { getByTestId, files, onReject } = renderControlled([], {
        multiple: true,
        accept: '.png,image/jpeg'
      })
      await pick(getByTestId(`${TEST_ID}__input`), [
        makeFile('a.png', 'image/png'),
        makeFile('b.gif', 'image/gif'),
        makeFile('c.jpg', 'image/jpeg')
      ])
      expect(names(files.value)).toEqual(['a.png', 'c.jpg'])
      expect(onReject).toHaveBeenCalledTimes(1)
      const [event, rejected] = onReject.mock.calls[0]
      expect(event).toBeInstanceOf(Event)
      expect(names(rejected)).toEqual(['b.gif'])
    })

    it('rejects files above maxSize', async () => {
      const { getByTestId, files, onReject } = renderControlled([], {
        multiple: true,
        maxSize: 100
      })
      await pick(getByTestId(`${TEST_ID}__input`), [
        makeFile('small.png', 'image/png', 50),
        makeFile('big.png', 'image/png', 200)
      ])
      expect(names(files.value)).toEqual(['small.png'])
      expect(names(onReject.mock.calls[0][1])).toEqual(['big.png'])
    })

    it('rejects every file beyond the first when multiple is off', async () => {
      const { getByTestId, files, onReject } = renderControlled([])
      await pick(getByTestId(`${TEST_ID}__input`), [
        makeFile('a.png', 'image/png'),
        makeFile('b.png', 'image/png')
      ])
      expect(names(files.value)).toEqual(['a.png'])
      expect(names(onReject.mock.calls[0][1])).toEqual(['b.png'])
    })

    it('skips duplicates without rejecting them', async () => {
      const { getByTestId, files, onReject } = renderControlled([makeFile('a.png', 'image/png')], {
        multiple: true
      })
      await pick(getByTestId(`${TEST_ID}__input`), [
        makeFile('a.png', 'image/png'),
        makeFile('b.png', 'image/png')
      ])
      expect(names(files.value)).toEqual(['a.png', 'b.png'])
      expect(onReject).not.toHaveBeenCalled()
    })

    it('mirrors the model into the native input files', async () => {
      const { getByTestId } = renderControlled([], { multiple: true, accept: '.png' })
      const input = getByTestId(`${TEST_ID}__input`) as HTMLInputElement
      await pick(input, [makeFile('a.png', 'image/png'), makeFile('b.gif', 'image/gif')])
      await waitFor(() => expect(names(Array.from(input.files ?? []))).toEqual(['a.png']))
    })
  })

  describe('dropping on the drop region', () => {
    it('adds dropped files to v-model', async () => {
      const { getByTestId, files } = renderControlled([], { multiple: true })
      await drop(getByTestId(`${TEST_ID}__dropzone`), [
        makeFile('a.png', 'image/png'),
        makeFile('b.png', 'image/png')
      ])
      expect(names(files.value)).toEqual(['a.png', 'b.png'])
    })

    it('rejects oversized and unaccepted files in one reject per drop', async () => {
      const { getByTestId, files, onReject } = renderControlled([], {
        multiple: true,
        accept: '.png',
        maxSize: 100
      })
      await drop(getByTestId(`${TEST_ID}__dropzone`), [
        makeFile('ok.png', 'image/png', 50),
        makeFile('big.png', 'image/png', 200),
        makeFile('doc.pdf', 'application/pdf', 50)
      ])
      expect(names(files.value)).toEqual(['ok.png'])
      expect(onReject).toHaveBeenCalledTimes(1)
      const [event, rejected] = onReject.mock.calls[0]
      expect(event).toBeInstanceOf(DragEvent)
      expect(names(rejected).sort()).toEqual(['big.png', 'doc.pdf'])
    })

    it('emits reject for an oversized drop with nothing else rejected', async () => {
      const { getByTestId, files, onReject } = renderControlled([], { maxSize: 10 })
      await drop(getByTestId(`${TEST_ID}__dropzone`), [makeFile('big.png', 'image/png', 200)])
      expect(files.value).toEqual([])
      await waitFor(() => expect(onReject).toHaveBeenCalledTimes(1))
      expect(names(onReject.mock.calls[0][1])).toEqual(['big.png'])
    })
  })

  describe('removing files', () => {
    it('removes the file, announces it and focuses the next remove button', async () => {
      const { getAllByTestId, getByTestId, files } = renderControlled(
        [
          makeFile('a.png', 'image/png'),
          makeFile('b.png', 'image/png'),
          makeFile('c.png', 'image/png')
        ],
        { multiple: true }
      )
      await fireEvent.click(getAllByTestId(`${TEST_ID}__remove`)[1])
      expect(names(files.value)).toEqual(['a.png', 'c.png'])
      expect(getByTestId(`${TEST_ID}__status`).textContent).toBe('b.png removed')
      await waitFor(() =>
        expect(document.activeElement?.getAttribute('aria-label')).toBe('Remove c.png')
      )
    })

    it('focuses the previous remove button after removing the last row', async () => {
      const { getAllByTestId, files } = renderControlled(
        [makeFile('a.png', 'image/png'), makeFile('b.png', 'image/png')],
        { multiple: true }
      )
      await fireEvent.click(getAllByTestId(`${TEST_ID}__remove`)[1])
      expect(names(files.value)).toEqual(['a.png'])
      await waitFor(() =>
        expect(document.activeElement?.getAttribute('aria-label')).toBe('Remove a.png')
      )
    })

    it('focuses the Choose file button after removing the only file', async () => {
      const { getByTestId, queryByTestId, files } = renderControlled([
        makeFile('a.png', 'image/png')
      ])
      await fireEvent.click(getByTestId(`${TEST_ID}__remove`))
      expect(files.value).toEqual([])
      expect(queryByTestId(`${TEST_ID}__list`)).toBeNull()
      await waitFor(() => expect(document.activeElement).toBe(getByTestId(`${TEST_ID}__button`)))
    })
  })

  describe('states', () => {
    it('hides the drop region, picker and remove buttons when readonly', () => {
      const { getByTestId, queryByTestId, queryAllByTestId } = render(FieldFileUpload, {
        props: { label: 'Certificate', readonly: true, modelValue: [makeFile('a.pem', '')] }
      })
      expect(getByTestId(TEST_ID).getAttribute('data-readonly')).toBe('true')
      expect(queryByTestId(`${TEST_ID}__dropzone`)).toBeNull()
      expect(queryByTestId(`${TEST_ID}__button`)).toBeNull()
      expect(queryByTestId(`${TEST_ID}__input`)).toBeNull()
      expect(queryAllByTestId(`${TEST_ID}__remove`)).toHaveLength(0)
      expect(getByTestId(`${TEST_ID}__list`).textContent).toContain('a.pem')
    })

    it('disables the picker, input and remove buttons and ignores drops when disabled', async () => {
      const { getByTestId, files } = renderControlled([makeFile('a.png', 'image/png')], {
        disabled: true,
        multiple: true
      })
      expect(getByTestId(TEST_ID).getAttribute('data-disabled')).toBe('true')
      expect((getByTestId(`${TEST_ID}__button`) as HTMLButtonElement).disabled).toBe(true)
      expect((getByTestId(`${TEST_ID}__input`) as HTMLInputElement).disabled).toBe(true)
      expect((getByTestId(`${TEST_ID}__remove`) as HTMLButtonElement).disabled).toBe(true)
      await drop(getByTestId(`${TEST_ID}__dropzone`), [makeFile('b.png', 'image/png')])
      expect(names(files.value)).toEqual(['a.png'])
    })

    it.each([
      [{ disabled: true, invalid: true, required: true }, 'disabled'],
      [{ invalid: true, required: true }, 'invalid'],
      [{ required: true }, 'required'],
      [{}, 'helper']
    ] as const)('resolves the helper kind for %o to %s', (state, kind) => {
      const { getByTestId } = render(FieldFileUpload, {
        props: { helperText: 'PNG only.', ...state }
      })
      expect(getByTestId(`${TEST_ID}__helper`).getAttribute('data-kind')).toBe(kind)
    })

    it('mirrors required and invalid on the root and marks the input invalid', () => {
      const { getByTestId } = render(FieldFileUpload, {
        props: { label: 'Logo', required: true, invalid: true }
      })
      const root = getByTestId(TEST_ID)
      expect(root.getAttribute('data-required')).toBe('true')
      expect(root.getAttribute('data-invalid')).toBe('true')
      expect(getByTestId(`${TEST_ID}__input`).getAttribute('aria-invalid')).toBe('true')
      expect(getByTestId(`${TEST_ID}__dropzone`).getAttribute('data-invalid')).toBe('true')
    })
  })

  describe('ARIA wiring', () => {
    it('associates the label, helper and list with the input', () => {
      const { getByTestId } = render(FieldFileUpload, {
        props: {
          label: 'Logo',
          helperText: 'PNG only.',
          inputId: 'logo',
          modelValue: [makeFile('a.png', 'image/png')]
        }
      })
      const label = getByTestId(`${TEST_ID}__label`)
      const input = getByTestId(`${TEST_ID}__input`)
      expect(label.getAttribute('for')).toBe('logo')
      expect(label.id).toBe('logo-label')
      expect(input.id).toBe('logo')
      expect(input.getAttribute('tabindex')).toBe('-1')
      expect(input.getAttribute('aria-describedby')).toBe('logo-helper')
      expect(getByTestId(`${TEST_ID}__helper`).id).toBe('logo-helper')
      expect(getByTestId(`${TEST_ID}__list`).getAttribute('aria-labelledby')).toBe('logo-label')
    })

    it('names the list and the remove buttons without a label', () => {
      const { getByTestId } = render(FieldFileUpload, {
        props: { modelValue: [makeFile('a.png', 'image/png')] }
      })
      expect(getByTestId(`${TEST_ID}__list`).getAttribute('aria-label')).toBe('Selected files')
      expect(getByTestId(`${TEST_ID}__remove`).getAttribute('aria-label')).toBe('Remove a.png')
    })

    it('labels the Choose file button with the field name', () => {
      const { getByTestId } = render(FieldFileUpload, {
        props: { label: 'Logo', helperText: 'PNG only.', inputId: 'logo' }
      })
      const button = getByTestId(`${TEST_ID}__button`)
      expect(button.id).toBe('logo-button')
      expect(button.getAttribute('aria-labelledby')).toBe('logo-label logo-button')
      expect(button.getAttribute('aria-describedby')).toBe('logo-helper')
    })
  })

  describe('a11y', () => {
    it('has no violations when empty with label and helper', async () => {
      const { container } = render(FieldFileUpload, {
        props: { label: 'Logo', helperText: 'PNG only.', inputId: 'a11y-empty' }
      })
      await expectNoA11yViolations(container)
    })

    it('has no violations with files, invalid', async () => {
      const { container } = render(FieldFileUpload, {
        props: {
          label: 'Logos',
          multiple: true,
          invalid: true,
          helperText: 'b.gif is not a PNG.',
          inputId: 'a11y-files',
          modelValue: [makeFile('a.png', 'image/png'), makeFile('b.png', 'image/png')]
        }
      })
      await expectNoA11yViolations(container)
    })

    it('has no violations when readonly', async () => {
      const { container } = render(FieldFileUpload, {
        props: { readonly: true, modelValue: [makeFile('a.png', 'image/png')] }
      })
      await expectNoA11yViolations(container)
    })
  })
})

describe('formatFileSize', () => {
  it.each([
    [0, '0 B'],
    [1023, '1023 B'],
    [1024, '1.0 KB'],
    [1468006, '1.4 MB'],
    [3 * 1024 ** 3, '3.0 GB'],
    [2048 * 1024 ** 3, '2048.0 GB']
  ])('formats %d bytes as %s', (bytes, expected) => {
    expect(formatFileSize(bytes)).toBe(expected)
  })
})
