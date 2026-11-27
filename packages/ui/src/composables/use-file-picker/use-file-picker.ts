import { getCurrentScope, type MaybeRefOrGetter, onScopeDispose, toValue } from 'vue'

export interface UseFilePickerOptions {
  /** Comma-separated file filter in the native accept syntax (extensions, MIME types, type wildcards). Empty accepts every file. */
  accept?: MaybeRefOrGetter<string>
  /** Lets the person pick more than one file. */
  multiple?: MaybeRefOrGetter<boolean>
  /** Picks a folder: every file inside it is returned, each with its `webkitRelativePath`. */
  directory?: MaybeRefOrGetter<boolean>
}

export interface UseFilePickerReturn {
  /** Opens the system file picker; resolves with the chosen files, or an empty list when the person cancels. Call it from a click handler. */
  open: () => Promise<File[]>
}

export function useFilePicker(options: UseFilePickerOptions = {}): UseFilePickerReturn {
  let settle: ((files: File[]) => void) | null = null
  let input: globalThis.HTMLInputElement | null = null

  const finish = (files: File[]): void => {
    input?.removeEventListener('change', onChange)
    input?.removeEventListener('cancel', onCancel)
    input = null
    const done = settle
    settle = null
    done?.(files)
  }

  const onChange = (): void => finish(Array.from(input?.files ?? []))
  const onCancel = (): void => finish([])

  const open = (): Promise<File[]> => {
    if (typeof document === 'undefined') return Promise.resolve([])
    finish([])
    const picker = document.createElement('input')
    picker.type = 'file'
    picker.accept = toValue(options.accept) ?? ''
    picker.multiple = Boolean(toValue(options.multiple))
    picker.webkitdirectory = Boolean(toValue(options.directory))
    input = picker
    return new Promise<File[]>((resolve) => {
      settle = resolve
      picker.addEventListener('change', onChange)
      picker.addEventListener('cancel', onCancel)
      picker.click()
    })
  }

  if (getCurrentScope()) onScopeDispose(() => finish([]))

  return { open }
}
