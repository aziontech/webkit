import { useFilePicker } from '@aziontech/ui/use-file-picker'
import {
  computed,
  type ComputedRef,
  inject,
  type InjectionKey,
  type MaybeRefOrGetter,
  nextTick,
  provide,
  reactive,
  type Ref,
  ref,
  toValue,
  useId,
  watch
} from 'vue'

import type { VariablesDraft } from '../edit-variables.vue'
import {
  formatKey,
  parseEnvFile,
  parseJsonObject,
  parsePasted,
  type VariablesPair
} from '../lib/variables-format'
import {
  createScopes,
  scopeMissing,
  scopePayload,
  type VariablesScopeState
} from '../lib/variables-scope'

const writable = <T>(source: Ref<T>) =>
  computed({
    get: () => source.value,
    set: (value: T) => {
      source.value = value
    }
  })

/** One key and value row of the drawer. */
export type VariablesEntry = {
  key: string
  id: number
  value: string
  secret: boolean
  visible: boolean
}

/** Why a key or value is not accepted. */
export type VariablesEntryProblem = { type: 'helper' | 'invalid' | 'required'; message: string }

export interface UseVariablesFormOptions {
  /** Keys already saved, which a new pair may not reuse. */
  existingKeys: MaybeRefOrGetter<string[]>
  /** True while the edited variable is a saved secret: its value may stay empty. */
  lockedSecret?: MaybeRefOrGetter<boolean>
}

export interface UseVariablesFormReturn {
  /** The id prefix of every field in the drawer. */
  formId: string
  /** The rows in the drawer. */
  entries: Ref<VariablesEntry[]>
  /** Form or JSON. */
  view: Ref<string>
  /** The text of the JSON view. */
  jsonText: Ref<string>
  /** Why the JSON view cannot be read; empty when it can. */
  jsonError: Ref<string>
  /** True once Save was pressed. */
  submitted: Ref<boolean>
  /** The rows that hold a key or a value. */
  filledEntries: ComputedRef<VariablesEntry[]>
  /** True when no row holds a key or a value. */
  noVariables: ComputedRef<boolean>
  /** True when the last row is filled, so another one may be added. */
  canAdd: ComputedRef<boolean>
  /** The scope rows. */
  scopes: VariablesScopeState[]
  /** A new row. */
  createEntry: (key?: string, value?: string, secret?: boolean) => VariablesEntry
  /** The key problem of a row, shown once Save was pressed. */
  keyError: (entry: VariablesEntry) => VariablesEntryProblem | null
  /** The value problem of a row, shown once Save was pressed. */
  valueError: (entry: VariablesEntry) => VariablesEntryProblem | null
  /** True when an enabled scope has no resource, once Save was pressed. */
  scopeError: (scope: VariablesScopeState) => boolean
  /** Writes a key as the variable format: spaces to underscores, uppercase. */
  setKey: (entry: VariablesEntry, value: string) => void
  /** Turns pasted .env or JSON contents in an empty key into one row per variable. */
  pasteIntoKey: (event: ClipboardEvent, index: number) => void
  /** Reads a .env file into rows. */
  pickEnvFile: () => Promise<void>
  /** Replaces the values of listed keys and appends the other pairs. */
  mergePairs: (pairs: VariablesPair[]) => void
  /** Puts the form back to its first state with these rows and scopes. */
  reset: (seed: VariablesEntry[], nextScopes?: VariablesScopeState[]) => void
  /** The filled rows with the chosen scope, as Save sends them. */
  drafts: () => VariablesDraft[]
  /** Validates after Save; focuses the first field in error and resolves false when invalid. */
  check: (form: HTMLFormElement | null) => Promise<boolean>
}

const INVALID_FIELD =
  ':is(input, textarea, button)[aria-invalid="true"], :is(input, textarea, button)[aria-required="true"]'

const isEmptyEntry = (entry: VariablesEntry) => !entry.key.trim() && !entry.value.trim()

const countKeys = (entries: VariablesEntry[]) =>
  entries.reduce((counts, entry) => {
    const key = entry.key.trim()
    counts.set(key, (counts.get(key) ?? 0) + 1)
    return counts
  }, new Map<string, number>())

function useEntryChecks(
  entries: Ref<VariablesEntry[]>,
  submitted: Ref<boolean>,
  options: UseVariablesFormOptions
) {
  const filledEntries = computed(() => entries.value.filter((entry) => !isEmptyEntry(entry)))
  const keyCounts = computed(() => countKeys(filledEntries.value))
  const duplicatedKeys = computed(() =>
    [...keyCounts.value].filter(([, count]) => count > 1).map(([key]) => key)
  )
  const keyError = (entry: VariablesEntry): VariablesEntryProblem | null => {
    if (!submitted.value || isEmptyEntry(entry)) return null
    const key = entry.key.trim()
    if (!key) return { type: 'required', message: 'Key is required.' }
    if (!/^[A-Z0-9_]+$/.test(key))
      return { type: 'invalid', message: 'Use only uppercase letters, numbers, and underscores.' }
    if ((keyCounts.value.get(key) ?? 0) > 1)
      return { type: 'invalid', message: `Duplicated key: ${duplicatedKeys.value.join(', ')}` }
    if (toValue(options.existingKeys).includes(key))
      return { type: 'invalid', message: `${key} already exists in this list.` }
    return null
  }
  const keepsSecret = (entry: VariablesEntry) =>
    Boolean(toValue(options.lockedSecret) && entry.secret && entry.key.trim())
  const valueError = (entry: VariablesEntry): VariablesEntryProblem | null => {
    if (!submitted.value || isEmptyEntry(entry) || entry.value.trim() || keepsSecret(entry))
      return null
    return { type: 'required', message: 'Value is required.' }
  }
  const noVariables = computed(() => filledEntries.value.length === 0)
  const isValid = computed(
    () =>
      !noVariables.value &&
      filledEntries.value.every((entry) => !keyError(entry) && !valueError(entry))
  )
  const canAdd = computed(() => {
    const last = entries.value.at(-1)
    return Boolean(last?.key.trim() && last?.value.trim())
  })
  return { filledEntries, keyError, valueError, noVariables, isValid, canAdd }
}

function useJsonView(
  entries: Ref<VariablesEntry[]>,
  filledEntries: ComputedRef<VariablesEntry[]>,
  toEntries: (pairs: VariablesPair[], secrets?: Set<string>) => VariablesEntry[],
  createEntry: () => VariablesEntry
) {
  const view = ref('Form')
  const jsonText = ref('{}')
  const jsonError = ref('')
  watch(view, (next) => {
    if (next === 'JSON') {
      jsonError.value = ''
      jsonText.value = JSON.stringify(
        Object.fromEntries(filledEntries.value.map((entry) => [entry.key.trim(), entry.value])),
        null,
        2
      )
      return
    }
    if (jsonError.value) return
    const secrets = new Set(
      filledEntries.value.filter((entry) => entry.secret).map((entry) => entry.key.trim())
    )
    const pairs = parseJsonObject(jsonText.value) ?? []
    entries.value = pairs.length ? toEntries(pairs, secrets) : [createEntry()]
  })
  watch(jsonText, (text) => {
    if (view.value !== 'JSON') return
    try {
      jsonError.value = parseJsonObject(text)
        ? ''
        : 'Variables must be a JSON object with key/value pairs.'
    } catch {
      jsonError.value = 'Variables must be valid JSON.'
    }
  })
  return { view, jsonText, jsonError }
}

function useEntryImport(
  entries: Ref<VariablesEntry[]>,
  filledEntries: ComputedRef<VariablesEntry[]>,
  toEntries: (pairs: VariablesPair[]) => VariablesEntry[],
  createEntry: () => VariablesEntry
) {
  const envFilePicker = useFilePicker({ accept: '.env,.txt,text/plain' })
  const pasteIntoKey = (event: ClipboardEvent, index: number) => {
    if (!isEmptyEntry(entries.value[index])) return
    const pairs = parsePasted(event.clipboardData?.getData('text/plain'))
    if (!pairs) return
    event.preventDefault()
    entries.value.splice(index, 1, ...toEntries(pairs))
  }
  const pickEnvFile = async (view: Ref<string>) => {
    const [file] = await envFilePicker.open()
    if (!file) return
    const { parsed, invalidLines } = parseEnvFile(await file.text())
    if (!parsed.length && invalidLines.length) return
    view.value = 'Form'
    await nextTick()
    entries.value = [...filledEntries.value, ...toEntries(parsed)]
    if (!entries.value.length) entries.value = [createEntry()]
  }
  const mergePairs = (pairs: VariablesPair[]) => {
    const merged = filledEntries.value.map((entry) => {
      const pasted = pairs.find((pair) => pair.key === entry.key.trim())
      return pasted ? { ...entry, value: pasted.value } : entry
    })
    const known = new Set(merged.map((entry) => entry.key.trim()))
    entries.value = [...merged, ...toEntries(pairs.filter((pair) => !known.has(pair.key)))]
  }
  return { pasteIntoKey, pickEnvFile, mergePairs }
}

function useFormSubmit(
  view: Ref<string>,
  jsonError: Ref<string>,
  submitted: Ref<boolean>,
  valid: () => boolean
) {
  return async (form: HTMLFormElement | null) => {
    if (view.value === 'JSON') {
      if (jsonError.value) return false
      view.value = 'Form'
      await nextTick()
    }
    submitted.value = true
    if (valid()) return true
    await nextTick()
    form?.querySelector<HTMLElement>(INVALID_FIELD)?.focus()
    return false
  }
}

const toDrafts = (entries: VariablesEntry[], scopes: VariablesScopeState[]): VariablesDraft[] => {
  const scope = scopePayload(scopes)
  return entries.map((entry) => ({
    key: entry.key.trim(),
    value: entry.value,
    secret: entry.secret,
    scope
  }))
}

export function useVariablesForm(options: UseVariablesFormOptions): UseVariablesFormReturn {
  const formId = useId()
  let nextEntryId = 0
  const createEntry = (key = '', value = '', secret = false): VariablesEntry => ({
    key,
    id: (nextEntryId += 1),
    value,
    secret,
    visible: false
  })
  const toEntries = (pairs: VariablesPair[], secrets = new Set<string>()) =>
    pairs.map((pair) => createEntry(pair.key, pair.value, secrets.has(pair.key)))
  const submitted = ref(false)
  const entries = ref<VariablesEntry[]>([createEntry()])
  const checks = useEntryChecks(entries, submitted, options)
  const json = useJsonView(entries, checks.filledEntries, toEntries, createEntry)
  const imports = useEntryImport(entries, checks.filledEntries, toEntries, createEntry)
  const scopes = reactive(createScopes())
  const check = useFormSubmit(
    json.view,
    json.jsonError,
    submitted,
    () => checks.isValid.value && !scopes.some(scopeMissing)
  )
  const reset = (seed: VariablesEntry[], nextScopes = createScopes()) => {
    entries.value = seed
    json.view.value = 'Form'
    json.jsonText.value = '{}'
    json.jsonError.value = ''
    submitted.value = false
    Object.assign(scopes, nextScopes)
  }
  return {
    formId,
    entries: writable(entries),
    submitted: writable(submitted),
    scopes,
    createEntry,
    setKey: (entry, value) => {
      entry.key = formatKey(value)
    },
    scopeError: (scope) => submitted.value && scopeMissing(scope),
    pasteIntoKey: imports.pasteIntoKey,
    pickEnvFile: () => imports.pickEnvFile(json.view),
    mergePairs: imports.mergePairs,
    reset,
    drafts: () => toDrafts(checks.filledEntries.value, scopes),
    check,
    ...json,
    ...checks
  }
}

const VariablesFormInjectionKey: InjectionKey<UseVariablesFormReturn> = Symbol('VariablesForm')

export function provideVariablesForm(form: UseVariablesFormReturn): void {
  provide(VariablesFormInjectionKey, form)
}

export function useVariablesFormContext(): UseVariablesFormReturn {
  const form = inject(VariablesFormInjectionKey, null)
  if (!form) throw new Error('useVariablesFormContext must be used within the variables drawer.')
  return form
}
