import { toast } from '@aziontech/webkit/toast'
import { useEscapeToCancel } from '@aziontech/webkit/use-escape-to-cancel'
import { toAriaKeyshortcuts, useShortcuts } from '@aziontech/webkit/use-shortcuts'
import {
  useUnsavedChanges,
  type UseUnsavedChangesReturn
} from '@aziontech/webkit/use-unsaved-changes'
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
  /** The title of the error toast raised when the request fails. */
  failureTitle: string
}

/** What `useCreateForm` returns. */
export interface UseCreateFormReturn<T> {
  /** The unsaved-changes guard, for the discard dialog. */
  guard: UseUnsavedChangesReturn<T>
  /** True while the request runs. */
  submitting: Readonly<Ref<boolean>>
  /** What makes a Button this form's submit: its type, its loading state and the shortcut it answers to. Bind it with `v-bind`. */
  submitButton: ComputedRef<{ type: 'submit'; loading: boolean; 'aria-keyshortcuts': string }>
  /** Asks before leaving a changed draft; Cancel, Back and Escape run it. */
  leave: () => Promise<boolean>
  /** Validates the draft, sends the request and confirms or reports it in a toast. */
  submit: () => Promise<void>
}

const SAVE_FAILURES = 0
const SUBMIT_KEYS = 'meta+enter'

export function useCreateForm<T>(options: UseCreateFormOptions<T>): UseCreateFormReturn<T> {
  const submitting = ref(false)
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
    if (submitting.value || !options.validate()) return
    submitting.value = true
    try {
      await sendRequest()
      options.onCreated()
    } catch (error) {
      toast.error(options.failureTitle, {
        description: error instanceof Error ? error.message : 'Try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }

  return { guard, submitting: readonly(submitting), submitButton, leave, submit }
}
