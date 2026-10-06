import { computed, ref, watch } from 'vue'

export const VARIABLE_KEY_PATTERN = /^[A-Z0-9_]+$/

export const SECRET_MASK = '••••••••'

export const SECRET_HINT =
  'Secret values are hidden and write-only after saving. Once saved as a secret, this behavior cannot be changed.'

export const VIEW_OPTIONS = [
  { label: 'Form', value: 'Form' },
  { label: 'JSON', value: 'JSON' }
]

export const formatVariableKey = (value) =>
  String(value ?? '')
    .replace(/\s/g, '_')
    .toUpperCase()

const unquote = (value) => {
  const quote = value[0]
  if ((quote === '"' || quote === "'") && value.length > 1 && value.at(-1) === quote) {
    return value.slice(1, -1)
  }
  return value
}

export const parseEnvFile = (content) => {
  const parsed = []
  const invalidLines = []

  String(content ?? '')
    .split(/\r?\n/)
    .forEach((line, index) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return

      const declaration = trimmed.startsWith('export ') ? trimmed.slice(7).trim() : trimmed
      const match = declaration.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/)
      if (!match) {
        invalidLines.push(index + 1)
        return
      }
      parsed.push({ key: match[1], value: unquote(match[2]) })
    })

  return { parsed, invalidLines }
}

const stringifyJsonValue = (value) => {
  if (typeof value === 'string') return value
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const parseJsonObject = (content) => {
  const parsed = JSON.parse(content)
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
  return Object.entries(parsed)
    .filter(([key]) => key.trim())
    .map(([key, value]) => ({ key: formatVariableKey(key), value: stringifyJsonValue(value) }))
}

export const parsePastedVariables = (content) => {
  const text = String(content ?? '').trim()
  if (!text) return null

  if (text.startsWith('{')) {
    try {
      const pairs = parseJsonObject(text)
      return pairs?.length ? pairs : null
    } catch {
      return null
    }
  }

  const { parsed, invalidLines } = parseEnvFile(text)
  return invalidLines.length || !parsed.length ? null : parsed
}

let nextEntryId = 0

export const createVariableEntry = (key = '', value = '', secret = false) => ({
  id: (nextEntryId += 1),
  key,
  value,
  secret,
  visible: false
})

const isEmptyEntry = (entry) => !entry.key.trim() && !entry.value.trim()

export function useVariablesEditor({ existingKeys }) {
  const entries = ref([createVariableEntry()])
  const view = ref('Form')
  const jsonText = ref('{}')
  const jsonError = ref('')
  const submitted = ref(false)

  const filledEntries = computed(() => entries.value.filter((entry) => !isEmptyEntry(entry)))

  const keyCounts = computed(() =>
    filledEntries.value.reduce((counts, entry) => {
      const key = entry.key.trim()
      counts.set(key, (counts.get(key) ?? 0) + 1)
      return counts
    }, new Map())
  )

  const duplicatedKeys = computed(() =>
    [...keyCounts.value].filter(([, count]) => count > 1).map(([key]) => key)
  )

  const required = (message) => ({ kind: 'required', message })
  const invalid = (message) => ({ kind: 'invalid', message })

  const keyError = (entry) => {
    if (isEmptyEntry(entry)) return null
    const key = entry.key.trim()
    if (!key) return required('Key is required.')
    if (!VARIABLE_KEY_PATTERN.test(key))
      return invalid('Use only uppercase letters, numbers, and underscores.')
    if (keyCounts.value.get(key) > 1)
      return invalid(`Duplicated key: ${duplicatedKeys.value.join(', ')}`)
    if (existingKeys().includes(key)) return invalid(`${key} already exists in this list.`)
    return null
  }

  const valueError = (entry) => {
    if (isEmptyEntry(entry) || entry.value.trim()) return null
    return required('Value is required.')
  }

  const noVariables = computed(() => filledEntries.value.length === 0)

  const isValid = computed(
    () =>
      !noVariables.value &&
      filledEntries.value.every((entry) => !keyError(entry) && !valueError(entry))
  )

  const shownKeyError = (entry) => (submitted.value ? keyError(entry) : null)
  const shownValueError = (entry) => (submitted.value ? valueError(entry) : null)

  const canAdd = computed(() => {
    const last = entries.value.at(-1)
    return Boolean(last?.key.trim() && last?.value.trim())
  })

  const canRemove = computed(() => entries.value.length > 1)

  const addEntry = () => {
    const entry = createVariableEntry()
    entries.value.push(entry)
    return entry
  }

  const removeEntry = (index) => {
    if (!canRemove.value) return
    entries.value.splice(index, 1)
  }

  const setKey = (entry, value) => {
    entry.key = formatVariableKey(value)
  }

  const toEntries = (pairs, secrets = new Set()) =>
    pairs.map((pair) => createVariableEntry(pair.key, pair.value, secrets.has(pair.key)))

  const pasteIntoKey = (event, index) => {
    if (!isEmptyEntry(entries.value[index])) return 0
    const pairs = parsePastedVariables(event.clipboardData?.getData('text/plain'))
    if (!pairs) return 0
    event.preventDefault()
    entries.value.splice(index, 1, ...toEntries(pairs))
    return pairs.length
  }

  const applyPairs = (pairs) => {
    entries.value = [...filledEntries.value, ...toEntries(pairs)]
    if (!entries.value.length) entries.value = [createVariableEntry()]
  }

  const secretKeys = () =>
    new Set(filledEntries.value.filter((entry) => entry.secret).map((entry) => entry.key.trim()))

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
    const secrets = secretKeys()
    const pairs = parseJsonObject(jsonText.value) ?? []
    entries.value = pairs.length ? toEntries(pairs, secrets) : [createVariableEntry()]
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

  const reset = () => {
    entries.value = [createVariableEntry()]
    view.value = 'Form'
    jsonText.value = '{}'
    jsonError.value = ''
    submitted.value = false
  }

  return {
    entries,
    view,
    jsonText,
    jsonError,
    submitted,
    filledEntries,
    noVariables,
    isValid,
    canAdd,
    canRemove,
    keyError: shownKeyError,
    valueError: shownValueError,
    addEntry,
    removeEntry,
    setKey,
    pasteIntoKey,
    applyPairs,
    reset
  }
}

export const secretTooltip = (entry) =>
  entry.secret ? 'The value is hidden and write-only.' : 'Mark as secret'

export const secretAriaLabel = (entry) => (entry.secret ? 'Unmark as secret' : 'Mark as secret')

export const SCOPE_TYPES = [
  { type: 'global', label: 'Global', plural: '' },
  { type: 'environment', label: 'Environment', plural: 'environments' },
  { type: 'deployment', label: 'Deployment', plural: 'deployments' },
  { type: 'application', label: 'Application', plural: 'applications' },
  { type: 'firewall', label: 'Firewall', plural: 'firewalls' }
]

export const createScopes = (optionsByType) =>
  SCOPE_TYPES.map((scope) => ({
    ...scope,
    placeholder: scope.plural ? `Select ${scope.plural}` : '',
    enabled: scope.type === 'global',
    ids: [],
    query: '',
    options: optionsByType[scope.type] ?? []
  }))

export const setScopeEnabled = (scopes, scope, enabled) => {
  if (scope.type === 'global') return
  scope.enabled = enabled
  scope.ids = enabled ? scope.options.map((option) => option.value) : []
  scope.query = ''
  scopes[0].enabled = !scopes.some((item) => item.type !== 'global' && item.enabled)
}

export const scopeMissing = (scope) =>
  scope.enabled && scope.type !== 'global' && scope.ids.length === 0

export const scopeDisplay = (scope) => (ids) => {
  if (!ids?.length) return ''
  if (ids.length > 1) return `Selected ${ids.length} ${scope.plural}`
  return scope.options.find((option) => option.value === ids[0])?.label ?? ids[0]
}

export const visibleScopeOptions = (scope) => {
  const query = scope.query.trim().toLowerCase()
  if (!query) return scope.options
  return scope.options.filter((option) => option.label.toLowerCase().includes(query))
}

export const scopePayload = (scopes) =>
  scopes.flatMap((scope) => {
    if (!scope.enabled) return []
    if (scope.type === 'global') return [{ type: 'global', id: '', name: '' }]
    return scope.ids.map((id) => ({
      type: scope.type,
      id,
      name: scope.options.find((option) => option.value === id)?.label ?? id
    }))
  })

export const scopeSummary = (scope) => {
  const groups = SCOPE_TYPES.map((entry) => ({
    ...entry,
    names: (scope ?? []).filter((item) => item.type === entry.type).map((item) => item.name)
  })).filter((entry) => entry.names.length > 0)

  return groups.map((group) => ({
    label: group.label,
    detail:
      group.type === 'global'
        ? ''
        : group.names.length === 1
          ? group.names[0]
          : `${group.names.length} ${group.plural}`
  }))
}
