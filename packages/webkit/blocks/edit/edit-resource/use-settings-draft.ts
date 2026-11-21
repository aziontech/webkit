import { computed, type ComputedRef, onScopeDispose, reactive, readonly, type Ref, ref } from 'vue'

export interface UseSettingsDraftOptions<T> {
  /** Unsaved edits the form opens with on top of the record, so it starts dirty. */
  draft?: Partial<T>
  /** Opens with the save already in flight. */
  saving?: boolean
  /** How long the sample save takes, in milliseconds. */
  delay?: number
  /** Checks the form before a save; false stops it. */
  validate?: () => boolean
  /** Runs when the save request starts. */
  onStart?: () => void
  /** Runs once the save landed and the form is the new baseline. */
  onSaved?: () => void
}

export interface UseSettingsDraftReturn<T> {
  /** The editable copy of the record. */
  form: T
  /** The save is in flight. */
  saving: Readonly<Ref<boolean>>
  /** The form differs from the last saved record. */
  dirty: ComputedRef<boolean>
  /** Validates, then saves. */
  save: () => void
  /** Saves again without validating, as a Retry or Redeploy action does. */
  commit: () => void
  /** Puts the last saved record back. */
  discard: () => void
}

export function useSettingsDraft<T extends object>(
  record: T,
  options: UseSettingsDraftOptions<T> = {}
): UseSettingsDraftReturn<T> {
  const form = reactive(structuredClone(record)) as T
  const baseline = ref(JSON.stringify(record))
  Object.assign(form, options.draft)
  const saving = ref(options.saving ?? false)
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)
  let timer: ReturnType<typeof setTimeout> | undefined

  const commit = () => {
    options.onStart?.()
    clearTimeout(timer)
    timer = setTimeout(() => {
      baseline.value = JSON.stringify(form)
      saving.value = false
      options.onSaved?.()
    }, options.delay ?? 900)
  }

  const save = () => {
    if (options.validate && !options.validate()) return
    saving.value = true
    commit()
  }

  const discard = () => Object.assign(form, JSON.parse(baseline.value) as T)

  onScopeDispose(() => clearTimeout(timer))

  return { form, saving: readonly(saving), dirty, save, commit, discard }
}
