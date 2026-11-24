import { describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'

import { useFilePicker } from './use-file-picker'

const stubPicker = () => {
  const created: HTMLInputElement[] = []
  const original = document.createElement.bind(document)
  const spy = vi.spyOn(document, 'createElement').mockImplementation(((tag: string) => {
    const el = original(tag)
    if (tag === 'input') {
      vi.spyOn(el as HTMLInputElement, 'click').mockImplementation(() => {})
      created.push(el as HTMLInputElement)
    }
    return el
  }) as typeof document.createElement)
  return { created, restore: () => spy.mockRestore() }
}

const choose = (input: HTMLInputElement, files: File[]) => {
  const transfer = new DataTransfer()
  for (const file of files) transfer.items.add(file)
  input.files = transfer.files
  input.dispatchEvent(new Event('change'))
}

describe('useFilePicker', () => {
  it('opens a file input with the options and resolves with the chosen files', async () => {
    const { created, restore } = stubPicker()
    const { open } = useFilePicker({ accept: '.csv', multiple: true })
    const pending = open()
    const input = created[0]

    expect(input.type).toBe('file')
    expect(input.accept).toBe('.csv')
    expect(input.multiple).toBe(true)
    expect(input.webkitdirectory).toBe(false)
    expect(input.click).toHaveBeenCalledOnce()

    const file = new File(['a,b'], 'rows.csv', { type: 'text/csv' })
    choose(input, [file])

    await expect(pending).resolves.toEqual([file])
    restore()
  })

  it('reads ref and getter options when the picker opens', async () => {
    const { created, restore } = stubPicker()
    let folder = false
    const { open } = useFilePicker({ directory: () => folder })
    folder = true
    const pending = open()

    expect(created[0].webkitdirectory).toBe(true)
    created[0].dispatchEvent(new Event('cancel'))
    await expect(pending).resolves.toEqual([])
    restore()
  })

  it('resolves the pending pick with no files when its scope is disposed', async () => {
    const { restore } = stubPicker()
    const scope = effectScope()
    const picker = scope.run(() => useFilePicker())
    const pending = picker!.open()

    scope.stop()

    await expect(pending).resolves.toEqual([])
    restore()
  })
})
