import { type Ref, ref } from 'vue'

import type { FileTokenGroupItem } from '../../../input/file-token-group/file-token-group.vue'
import { defaultCountries } from '../../../input/phone-input/lib/country-data'
import type { JobPostingSectionField, JobPostingSectionMessages } from '../job-posting-section.vue'

type Field = JobPostingSectionField

export interface UseJobPostingFormReturn {
  values: Ref<Record<string, string>>
  files: Ref<Record<string, File>>
  errors: Ref<Record<string, string>>
  fieldId: (field: Field) => string
  focusTarget: (field: Field) => string
  countryOf: (field: Field) => string
  setValue: (field: Field, next: string) => void
  setCountry: (field: Field, next: string) => void
  setFile: (field: Field, file: File | null, fromInput?: boolean) => void
  bindFileInput: (field: Field, element: unknown) => void
  browse: (field: Field) => void
  onFilePick: (field: Field, event: Event) => void
  fileTokens: (field: Field) => FileTokenGroupItem[]
  emptyRequired: (field: Field) => boolean
  malformed: (field: Field) => boolean
  validate: () => { values: Record<string, string>; first: Field | undefined }
  reset: () => void
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const URL_PATTERN = /^https?:\/\/\S+$/

function messageOf(field: Field, value: string, messages: JobPostingSectionMessages): string {
  if (field.required && !value) return messages.missing
  if (field.type === 'email' && value && !EMAIL_PATTERN.test(value)) return messages.invalidEmail
  if (field.type === 'url' && value && !URL_PATTERN.test(value)) return messages.invalidUrl
  return ''
}

function createFileFields(fields: () => Field[], setValue: (field: Field, next: string) => void) {
  const files = ref<Record<string, File>>({})
  const fileInputEls = ref<Record<string, HTMLInputElement | null>>({})

  const syncInput = (field: Field, file: File | null) => {
    const input = fileInputEls.value[field.name]
    if (!input || typeof DataTransfer === 'undefined') return
    const transfer = new DataTransfer()
    if (file) transfer.items.add(file)
    input.files = transfer.files
  }

  const setFile = (field: Field, file: File | null, fromInput = false) => {
    const next = { ...files.value }
    if (file) next[field.name] = file
    else delete next[field.name]
    files.value = next
    if (!fromInput) syncInput(field, file)
    setValue(field, file?.name ?? '')
  }

  return {
    files,
    setFile,
    bindFileInput: (field: Field, element: unknown) => {
      fileInputEls.value[field.name] = element instanceof HTMLInputElement ? element : null
    },
    browse: (field: Field) => fileInputEls.value[field.name]?.click(),
    onFilePick: (field: Field, event: Event) => {
      const input = event.target as HTMLInputElement
      setFile(field, input.files?.[0] ?? null, true)
    },
    fileTokens: (field: Field): FileTokenGroupItem[] => {
      const file = files.value[field.name]
      return file ? [{ file }] : []
    },
    clearFiles: () => {
      for (const field of fields()) {
        if (field.type === 'file') syncInput(field, null)
      }
      files.value = {}
    }
  }
}

export function useJobPostingForm(
  baseId: string,
  fields: () => Field[],
  messages: () => JobPostingSectionMessages
): UseJobPostingFormReturn {
  const values = ref<Record<string, string>>({})
  const countries = ref<Record<string, string>>({})
  const errors = ref<Record<string, string>>({})
  const fieldId = (field: Field) => `${baseId}-${field.name}`
  const countryOf = (field: Field) => countries.value[field.name] ?? field.country ?? 'US'
  const filled = (field: Field) => Boolean((values.value[field.name] ?? '').trim())
  const setValue = (field: Field, next: string) => {
    values.value = { ...values.value, [field.name]: next }
    if (errors.value[field.name]) errors.value = { ...errors.value, [field.name]: '' }
  }
  const fileFields = createFileFields(fields, setValue)

  const valueOf = (field: Field) => {
    const raw = (values.value[field.name] ?? '').trim()
    if (field.type !== 'phone' || !raw) return raw
    const dialCode = defaultCountries.find((item) => item.code === countryOf(field))?.dialCode
    return dialCode ? `${dialCode}${raw}` : raw
  }

  const validate = () => {
    const collected: Record<string, string> = {}
    const found: Record<string, string> = {}
    for (const field of fields()) {
      const value = valueOf(field)
      collected[field.name] = value
      const message = messageOf(field, value, messages())
      if (message) found[field.name] = message
    }
    errors.value = found
    return { values: collected, first: fields().find((field) => found[field.name]) }
  }

  return {
    ...fileFields,
    values,
    errors,
    fieldId,
    focusTarget: (field) => (field.type === 'file' ? `${fieldId(field)}-browse` : fieldId(field)),
    countryOf,
    setValue,
    setCountry: (field, next) => {
      countries.value = { ...countries.value, [field.name]: next }
    },
    emptyRequired: (field) => Boolean(errors.value[field.name]) && !filled(field),
    malformed: (field) => Boolean(errors.value[field.name]) && filled(field),
    validate,
    reset: () => {
      values.value = {}
      errors.value = {}
      fileFields.clearFiles()
    }
  }
}
