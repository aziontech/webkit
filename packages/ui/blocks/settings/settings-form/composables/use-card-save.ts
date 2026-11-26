import { toast } from '@aziontech/ui/toast'
import { useUnsavedChanges } from '@aziontech/ui/use-unsaved-changes'
import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  onMounted,
  type Ref,
  toValue,
  watch
} from 'vue'

export interface UseCardSaveOptions<T extends object> {
  values: T
  saved: MaybeRefOrGetter<T>
  loading: MaybeRefOrGetter<boolean>
  error: MaybeRefOrGetter<string>
  id: string
  savedMessage: string
  failedMessage: string
  valid?: () => boolean
  onSubmit: (event: Event, values: T) => void
  onInvalid?: () => void
}

export interface UseCardSaveReturn<T> {
  dirty: ComputedRef<boolean>
  baseline: Readonly<Ref<T>>
  discard: () => T
  submitting: ComputedRef<boolean>
  submit: (event: Event) => void
}

export function useCardSave<T extends object>(
  options: UseCardSaveOptions<T>
): UseCardSaveReturn<T> {
  const { values } = options
  const toastId = `${options.id}-save`
  const submitting = computed(() => toValue(options.loading))
  const {
    isDirty: dirty,
    baseline,
    commit,
    discard
  } = useUnsavedChanges(() => values, {
    onDiscard: (baseline) => Object.assign(values, baseline)
  })
  const draft = { ...values }
  Object.assign(values, toValue(options.saved))
  commit()
  Object.assign(values, draft)

  watch(
    () => JSON.stringify(toValue(options.saved)),
    () => {
      Object.assign(values, toValue(options.saved))
      commit()
    }
  )

  const submit = (event: Event) => {
    if (submitting.value || !dirty.value) return
    if (options.valid && !options.valid()) {
      options.onInvalid?.()
      return
    }
    toast.dismiss(toastId)
    options.onSubmit(event, { ...values })
  }

  watchSaveOutcome(options, submitting, submit, () => {
    commit()
    toast.success(options.savedMessage, { id: toastId })
  })

  return { dirty, baseline, discard, submitting, submit }
}

function watchSaveOutcome<T extends object>(
  options: UseCardSaveOptions<T>,
  submitting: ComputedRef<boolean>,
  submit: (event: Event) => void,
  onSaved: () => void
): void {
  const showFailure = () => {
    toast.error(options.failedMessage, {
      id: `${options.id}-save`,
      description: toValue(options.error),
      action: { label: 'Retry', onClick: (event: MouseEvent) => submit(event) }
    })
  }

  onMounted(() => {
    if (toValue(options.error)) showFailure()
  })

  watch(
    () => toValue(options.error),
    (next) => {
      if (next && !submitting.value) showFailure()
    }
  )

  watch(submitting, (now, before) => {
    if (!before || now) return
    if (toValue(options.error)) showFailure()
    else onSaved()
  })
}
