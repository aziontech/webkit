import { useEscapeToCancel } from '@aziontech/webkit/use-escape-to-cancel'
import { toAriaKeyshortcuts, useShortcuts } from '@aziontech/webkit/use-shortcuts'
import {
  useUnsavedChanges,
  type UseUnsavedChangesReturn
} from '@aziontech/webkit/use-unsaved-changes'
import { focusFirstInvalid } from '@aziontech/webkit/utils/focus-invalid'
import { computed, type ComputedRef, readonly, type Ref, ref } from 'vue'

/** Options of `useCreateForm`. */
export interface UseCreateFormOptions<T> {
  /** The draft the unsaved-changes guard watches. */
  source: () => T
  /** The form element: the submit shortcut belongs to it and submits it. */
  formEl: Ref<HTMLFormElement | null>
  /** The name of the submit shortcut in the shortcuts list. */
  shortcutLabel: string
  /** Checks the draft and flags its fields; false stops the submit. */
  validate: () => boolean
  /** Runs once the request succeeds, to confirm it in a toast. */
  onCreated: () => void
}

/** What `useCreateForm` returns. */
export interface UseCreateFormReturn<T> {
  /** The unsaved-changes guard, for the discard dialog. */
  guard: UseUnsavedChangesReturn<T>
  /** Why the last request failed, shown inline above the save bar; empty when it did not. */
  failure: Readonly<Ref<string>>
  /** True while the request runs. */
  submitting: Readonly<Ref<boolean>>
  /** What makes a Button this form's submit: its type, its loading state and the shortcut it answers to. Bind it with `v-bind`. */
  submitButton: ComputedRef<{ type: 'submit'; loading: boolean; 'aria-keyshortcuts': string }>
  /** Asks before leaving a changed draft; Cancel, Back and Escape run it. */
  leave: () => Promise<boolean>
  /** Validates the draft, sends the request, and confirms it in a toast or reports it inline. */
  submit: () => Promise<void>
}

const SAVE_FAILURES = 0
const SUBMIT_KEYS = 'meta+enter'

export function useCreateForm<T>(options: UseCreateFormOptions<T>): UseCreateFormReturn<T> {
  const submitting = ref(false)
  const failure = ref('')
  let failuresLeft = SAVE_FAILURES

  const guard = useUnsavedChanges(options.source, {
    enabled: () => !submitting.value
  })

  const leave = () => guard.confirmLeave()

  useEscapeToCancel(leave, { enabled: () => !submitting.value })

  useShortcuts({
    keys: SUBMIT_KEYS,
    label: options.shortcutLabel,
    group: 'Page',
    element: options.formEl,
    when: () => !submitting.value,
    handler: () => options.formEl.value?.requestSubmit()
  })

  const submitButton = computed(() => ({
    type: 'submit' as const,
    loading: submitting.value,
    'aria-keyshortcuts': toAriaKeyshortcuts(SUBMIT_KEYS)
  }))

  const sendRequest = () =>
    new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (failuresLeft > 0) {
          failuresLeft -= 1
          reject(new Error('The service did not answer. Check your connection and try again.'))
          return
        }
        resolve()
      }, 900)
    })

  const submit = async () => {
    if (submitting.value) return
    if (!options.validate()) {
      await focusFirstInvalid(options.formEl.value)
      return
    }
    submitting.value = true
    failure.value = ''
    try {
      await sendRequest()
      options.onCreated()
    } catch (error) {
      failure.value = error instanceof Error ? error.message : 'Try again.'
    } finally {
      submitting.value = false
    }
  }

  return {
    guard,
    failure: readonly(failure),
    submitting: readonly(submitting),
    submitButton,
    leave,
    submit
  }
}
