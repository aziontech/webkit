import { useFilePicker } from '@aziontech/ui/use-file-picker'
import { computed, type ComputedRef, type DeepReadonly, readonly, type Ref, ref } from 'vue'

import type { SchemaEditorCsvFile } from '../edit-schema.vue'
import { type CsvRow, parseCsv } from '../lib/csv'

/** A CSV file picked or dropped, parsed into headers and rows. */
export interface UseCsvImportReturn {
  /** The file picked, or nothing. */
  file: DeepReadonly<Ref<SchemaEditorCsvFile | null>>
  /** The column names of its first line. */
  headers: DeepReadonly<Ref<string[]>>
  /** Its rows. */
  rows: DeepReadonly<Ref<CsvRow[]>>
  /** Why it could not be read. */
  error: DeepReadonly<Ref<string>>
  /** The file token the dropzone shows. */
  tokens: ComputedRef<{ file: SchemaEditorCsvFile; error: string | undefined }[]>
  /** Forgets the file. */
  clear: () => void
  /** Reads a file's text. */
  apply: (next: SchemaEditorCsvFile, text: string) => void
  /** Takes the files picked or dropped. */
  onFiles: (files: FileList | File[] | null) => Promise<void>
  /** Opens the file picker. */
  pick: () => Promise<void>
}

export function useCsvImport(
  onRead: (file: SchemaEditorCsvFile, headers: string[], rows: CsvRow[]) => void
): UseCsvImportReturn {
  const picker = useFilePicker({ accept: '.csv,text/csv' })
  const file = ref<SchemaEditorCsvFile | null>(null)
  const headers = ref<string[]>([])
  const rows = ref<CsvRow[]>([])
  const error = ref('')
  const clear = () => {
    file.value = null
    headers.value = []
    rows.value = []
    error.value = ''
  }
  const apply = (next: SchemaEditorCsvFile, text: string) => {
    clear()
    const parsed = parseCsv(text)
    file.value = next
    if (!parsed) {
      error.value = 'The first line must name every column.'
      return
    }
    headers.value = parsed.headers
    rows.value = parsed.rows
    onRead(next, parsed.headers, parsed.rows)
  }
  const onFiles = async (files: FileList | File[] | null) => {
    const picked = Array.from(files ?? [])[0]
    if (!picked) return
    if (!/\.csv$/i.test(picked.name)) {
      clear()
      file.value = { name: picked.name, size: picked.size, type: picked.type }
      error.value = 'Choose a .csv file.'
      return
    }
    apply({ name: picked.name, size: picked.size, type: 'text/csv' }, await picked.text())
  }
  const pick = async () => onFiles(await picker.open())
  const tokens = computed(() =>
    file.value ? [{ file: file.value, error: error.value || undefined }] : []
  )
  return {
    file: readonly(file),
    headers: readonly(headers),
    rows: readonly(rows),
    error: readonly(error),
    tokens,
    clear,
    apply,
    onFiles,
    pick
  }
}
