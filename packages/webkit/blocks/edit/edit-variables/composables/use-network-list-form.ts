import {
  computed,
  type ComputedRef,
  inject,
  type InjectionKey,
  nextTick,
  provide,
  type Ref,
  ref,
  useId,
  type WritableComputedRef
} from 'vue'

import {
  COUNTRIES,
  createListEntry,
  entryError,
  listPasteReport,
  NETWORK_LIST_COPY,
  NETWORK_LIST_LIMIT,
  type NetworkListCopy,
  type NetworkListEntry
} from '../lib/network-list'
import { closePastePanel } from '../lib/paste-report'
import { plural } from '../lib/variables-format'

const writable = <T>(source: Ref<T>) =>
  computed({
    get: () => source.value,
    set: (value: T) => {
      source.value = value
    }
  })

/** One column of the entries editor. */
export type NetworkListColumn = {
  key: string
  label: string
  placeholder: string
  required?: boolean
}

export interface UseNetworkListFormReturn {
  /** The list name. */
  name: Ref<string>
  /** ip, asn or countries. */
  type: Ref<string>
  /** The countries picked when the type is countries. */
  countries: Ref<string[]>
  /** The rows of the current type. */
  rows: WritableComputedRef<NetworkListEntry[]>
  /** The words of the current type; undefined for countries. */
  copy: ComputedRef<NetworkListCopy | undefined>
  /** The columns of the entries editor. */
  columns: ComputedRef<NetworkListColumn[]>
  /** The error of each row, shown after Save or right away for a pasted row. */
  rowErrors: ComputedRef<Record<string, string>[]>
  /** True once Save was pressed with no name. */
  nameMissing: ComputedRef<boolean>
  /** True once Save was pressed on a countries list with none picked. */
  countriesMissing: ComputedRef<boolean>
  /** The id of the paste field. */
  pasteId: string
  /** The paste panel is open. */
  pasteOpen: Ref<boolean>
  /** The pasted text. */
  pasteText: Ref<string>
  /** What the last paste added, for the live region. */
  status: Ref<string>
  /** The Paste list button, which gets the focus back when the panel closes. */
  pasteToggleEl: Ref<{ $el?: HTMLElement } | null>
  /** What the pasted text holds. */
  pasteReport: ComputedRef<{ lines: NetworkListEntry[]; duplicates: number[]; invalid: number[] }>
  /** How many pasted lines do not fit under the limit. */
  pasteOverflow: ComputedRef<number>
  /** Closes the paste panel. */
  cancelPaste: () => Promise<void>
  /** Appends the pasted lines that fit as rows. */
  applyPaste: () => Promise<void>
  /** The text of the countries trigger. */
  countryDisplay: (ids: unknown[]) => string
  /** Puts the form back to its first state with this name and pasted text. */
  reset: (seedName: string, seedPaste: string) => void
  /** Validates after Save; focuses the first field in error and resolves false when invalid. */
  check: (form: HTMLFormElement | null) => Promise<boolean>
  /** How many entries or countries Save keeps. */
  count: () => number
}

const INVALID_FIELD =
  ':is(input, textarea, button)[aria-invalid="true"], :is(input, textarea, button)[aria-required="true"]'

const emptyEntries = () => ({ ip: [createListEntry()], asn: [createListEntry()] })

function useListRows(type: Ref<string>, submitted: Ref<boolean>) {
  const entries = ref<Record<string, NetworkListEntry[]>>(emptyEntries())
  const rows = computed({
    get: () => entries.value[type.value] ?? [],
    set: (next: NetworkListEntry[]) => {
      entries.value = { ...entries.value, [type.value]: next }
    }
  })
  const copy = computed(() => NETWORK_LIST_COPY[type.value])
  const columns = computed<NetworkListColumn[]>(() =>
    copy.value
      ? [
          {
            key: 'value',
            label: copy.value.column,
            placeholder: copy.value.placeholder,
            required: true
          },
          { key: 'note', label: 'Comment', placeholder: 'Optional' }
        ]
      : []
  )
  const filled = computed(() => rows.value.filter((entry) => entry.value.trim()))
  const checked = (entry: NetworkListEntry) =>
    Boolean(entry.value.trim() || entry.note.trim() || !filled.value.length)
  const rowErrors = computed(() =>
    rows.value.map((entry): Record<string, string> => {
      const shown = submitted.value ? checked(entry) : entry.pasted && entry.value.trim()
      const message = shown ? entryError(type.value, entry.value) : ''
      return message ? { value: message } : {}
    })
  )
  const rowsValid = () =>
    filled.value.length > 0 &&
    rows.value.filter(checked).every((entry) => !entryError(type.value, entry.value))
  const clear = () => {
    entries.value = emptyEntries()
  }
  return { rows, copy, columns, filled, rowErrors, rowsValid, clear }
}

function useListPaste(type: Ref<string>, rows: WritableComputedRef<NetworkListEntry[]>) {
  const pasteId = useId()
  const pasteOpen = ref(false)
  const pasteText = ref('')
  const status = ref('')
  const pasteToggleEl = ref<{ $el?: HTMLElement } | null>(null)
  const pasteReport = computed(() => listPasteReport(pasteText.value, type.value, rows.value))
  const keptRows = () => rows.value.filter((entry) => entry.value.trim() || entry.note.trim())
  const pasteOverflow = computed(() =>
    Math.max(0, pasteReport.value.lines.length - (NETWORK_LIST_LIMIT - keptRows().length))
  )
  const cancelPaste = () => closePastePanel(pasteOpen, pasteToggleEl)
  const applyPaste = async () => {
    const { invalid } = pasteReport.value
    const kept = keptRows()
    const lines = pasteReport.value.lines.slice(0, Math.max(0, NETWORK_LIST_LIMIT - kept.length))
    rows.value = [...kept, ...lines]
    const fix = invalid.length
      ? ` ${invalid.length} ${invalid.length === 1 ? 'needs' : 'need'} a fix.`
      : ''
    status.value = `${plural(lines.length, 'entry', 'entries')} added from the pasted list.${fix}`
    pasteText.value = ''
    await cancelPaste()
  }
  return {
    pasteId,
    pasteOpen,
    pasteText,
    status,
    pasteToggleEl,
    pasteReport,
    pasteOverflow,
    cancelPaste,
    applyPaste
  }
}

const countryDisplay = (ids: unknown[]): string => {
  if (!ids?.length) return ''
  if (ids.length > 1) return `${ids.length} countries`
  return COUNTRIES.find((option) => option.value === ids[0])?.label ?? String(ids[0])
}

export function useNetworkListForm(): UseNetworkListFormReturn {
  const name = ref('')
  const type = ref('ip')
  const countries = ref<string[]>([])
  const submitted = ref(false)
  const list = useListRows(type, submitted)
  const paste = useListPaste(type, list.rows)
  const nameMissing = computed(() => submitted.value && !name.value.trim())
  const countriesMissing = computed(
    () => submitted.value && type.value === 'countries' && !countries.value.length
  )
  const isValid = () => {
    if (!name.value.trim()) return false
    if (type.value === 'countries') return countries.value.length > 0
    return list.rowsValid()
  }
  const reset = (seedName: string, seedPaste: string) => {
    name.value = seedName
    type.value = 'ip'
    countries.value = []
    list.clear()
    submitted.value = false
    paste.status.value = ''
    paste.pasteOpen.value = true
    paste.pasteText.value = seedPaste
  }
  const check = async (form: HTMLFormElement | null) => {
    submitted.value = true
    if (isValid()) return true
    await nextTick()
    form?.querySelector<HTMLElement>(INVALID_FIELD)?.focus()
    return false
  }
  const count = () =>
    type.value === 'countries' ? countries.value.length : list.filled.value.length
  const { rows, copy, columns, rowErrors } = list
  return {
    name: writable(name),
    type: writable(type),
    countries: writable(countries),
    rows,
    copy,
    columns,
    rowErrors,
    nameMissing,
    countriesMissing,
    countryDisplay,
    reset,
    check,
    count,
    ...paste
  }
}

const NetworkListFormInjectionKey: InjectionKey<UseNetworkListFormReturn> =
  Symbol('NetworkListForm')

export function provideNetworkListForm(form: UseNetworkListFormReturn): void {
  provide(NetworkListFormInjectionKey, form)
}

export function useNetworkListFormContext(): UseNetworkListFormReturn {
  const form = inject(NetworkListFormInjectionKey, null)
  if (!form)
    throw new Error('useNetworkListFormContext must be used within the network list drawer.')
  return form
}
