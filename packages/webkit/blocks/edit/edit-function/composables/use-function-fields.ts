import { computed, type ComputedRef, nextTick, type Ref, ref } from 'vue'

import type { FunctionEditorField } from '../edit-function.vue'
import { emptyField, fieldName } from '../lib/function-editor'

export interface UseFunctionFieldsReturn {
  moveStatus: ComputedRef<string>
  keyError: (field: FunctionEditorField) => string
  touch: (id: string) => void
  isExpanded: (id: string) => boolean
  toggle: (id: string) => void
  addField: () => void
  removeField: (index: number) => void
  duplicateField: (index: number) => void
  move: (index: number, direction: number) => void
}

const VALID_KEY = /^[A-Za-z_][A-Za-z0-9_]*$/

function useFieldExpansion(defaultOpenKeys: string[]) {
  const expanded = ref(new Set<string>(defaultOpenKeys))
  const isExpanded = (id: string) => expanded.value.has(id)
  const toggle = (id: string) => {
    const next = new Set(expanded.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    expanded.value = next
  }
  const open = (id: string) => {
    expanded.value = new Set(expanded.value).add(id)
  }
  const close = (id: string) => {
    const next = new Set(expanded.value)
    next.delete(id)
    expanded.value = next
  }
  return { isExpanded, toggle, open, close }
}

function useFieldKeys(draftFields: Ref<FunctionEditorField[]>) {
  const touched = ref(new Set<string>())
  const keyError = (field: FunctionEditorField) => {
    const key = field.key.trim()
    if (!key) return touched.value.has(field.id) ? 'Give the field a name.' : ''
    if (!VALID_KEY.test(key)) return 'Letters, digits and underscore, not starting with a digit.'
    return draftFields.value.some((other) => other.id !== field.id && other.key.trim() === key)
      ? 'Another field already uses this name.'
      : ''
  }
  const touch = (id: string) => {
    touched.value = new Set(touched.value).add(id)
  }
  return { keyError, touch }
}

function focusMoved(formId: string, id: string, direction: number) {
  const same = document.getElementById(`${formId}-${direction < 0 ? 'up' : 'down'}-${id}`)
  const other = document.getElementById(`${formId}-${direction < 0 ? 'down' : 'up'}-${id}`)
  const target = same instanceof HTMLButtonElement && !same.disabled ? same : other
  target?.focus()
}

export function useFunctionFields(
  draftFields: Ref<FunctionEditorField[]>,
  formId: string,
  defaultOpenKeys: string[]
): UseFunctionFieldsReturn {
  const { isExpanded, toggle, open, close } = useFieldExpansion(defaultOpenKeys)
  const { keyError, touch } = useFieldKeys(draftFields)
  const status = ref('')
  let sequence = draftFields.value.length
  const nextId = () => 'field-' + (sequence += 1)

  const addField = () => {
    const field = emptyField(nextId())
    draftFields.value.push(field)
    open(field.id)
    nextTick(() => document.getElementById(formId + '-key-' + field.id)?.focus())
  }
  const removeField = (index: number) => {
    const [removed] = draftFields.value.splice(index, 1)
    if (removed) close(removed.id)
  }
  const duplicateField = (index: number) => {
    const copy = { ...draftFields.value[index], id: nextId(), key: '' }
    draftFields.value.splice(index + 1, 0, copy)
    open(copy.id)
  }
  const move = (index: number, direction: number) => {
    const to = index + direction
    if (to < 0 || to >= draftFields.value.length) return
    const [moved] = draftFields.value.splice(index, 1)
    draftFields.value.splice(to, 0, moved)
    status.value = `${fieldName(moved)} moved to position ${to + 1} of ${draftFields.value.length}.`
    nextTick(() => focusMoved(formId, moved.id, direction))
  }

  return {
    moveStatus: computed(() => status.value),
    keyError,
    touch,
    isExpanded,
    toggle,
    addField,
    removeField,
    duplicateField,
    move
  }
}
