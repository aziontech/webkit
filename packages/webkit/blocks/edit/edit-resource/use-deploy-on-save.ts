import { toast } from '@aziontech/webkit/toast'
import { type ComputedRef, nextTick, onScopeDispose, reactive, type Ref } from 'vue'

import { useSettingsDraft, type UseSettingsDraftReturn } from './use-settings-draft'

/** What is wrong with one field, shown under it. */
export interface FieldProblem {
  /** Whether the value is missing, malformed, or only needs a hint. */
  type: 'helper' | 'invalid' | 'required'
  /** The sentence under the field. */
  message: string
}

/** The problems of a form, by field key. */
export type FieldProblems = Record<string, FieldProblem | undefined>

/** The title and description of a toast. */
export interface DeployToastText {
  /** The toast title. */
  title: string
  /** The sentence under the title. */
  description: string
}

export interface UseDeployOnSaveOptions {
  /** The id of the toast that follows the deployment. */
  toastId: string
  /** Prefix of the field ids: a field is `<prefix>-<key>`. */
  fieldPrefix: string
  /** The field keys in reading order; the first invalid one takes focus, and Edit returns to the first. */
  fieldOrder: string[]
  /** Records every problem of the form in the given map. */
  check: (problems: FieldProblems) => void
  /** The toast while the deployment runs. */
  loading: () => DeployToastText
  /** The toast once the deployment is live. */
  success: () => DeployToastText
}

export interface UseDeployOnSaveReturn<T> {
  /** The editable copy of the record. */
  form: T
  /** The deployment is in flight. */
  saving: Readonly<Ref<boolean>>
  /** The form differs from the deployed record. */
  dirty: ComputedRef<boolean>
  /** The problems the last save found, by field key. */
  errors: FieldProblems
  /** Drops the problem of one field once it is edited. */
  clear: (key: string) => void
  /** Validates, then deploys. */
  save: () => void
  /** Puts the deployed record back and drops every problem. */
  discard: () => void
  /** The leave guard of the form. */
  leave: UseSettingsDraftReturn<T>['leave']
}

export function useDeployOnSave<T extends object>(
  record: T,
  options: UseDeployOnSaveOptions
): UseDeployOnSaveReturn<T> {
  const errors = reactive<FieldProblems>({})
  const focusField = (key: string) =>
    nextTick(() => document.getElementById(`${options.fieldPrefix}-${key}`)?.focus())

  const clear = (key: string) => {
    delete errors[key]
  }
  const clearAll = () => Object.keys(errors).forEach(clear)

  const validate = () => {
    clearAll()
    options.check(errors)
    const first = options.fieldOrder.find((key) => errors[key])
    if (first) focusField(first)
    return Object.keys(errors).length === 0
  }

  const editAgain = () => {
    toast.dismiss(options.toastId)
    focusField(options.fieldOrder[0])
  }

  const draft = useSettingsDraft(record, {
    delay: 1200,
    validate,
    onStart: () => {
      const { title, description } = options.loading()
      toast.loading(title, { id: options.toastId, description })
    },
    onSaved: () => {
      const { title, description } = options.success()
      toast.success(title, {
        id: options.toastId,
        description,
        duration: 0,
        closable: true,
        actions: [
          { label: 'Edit', onClick: editAgain },
          { label: 'Redeploy', onClick: draft.commit }
        ]
      })
    }
  })

  const discard = () => {
    draft.discard()
    clearAll()
  }

  onScopeDispose(() => toast.dismiss(options.toastId))

  return {
    form: draft.form,
    saving: draft.saving,
    dirty: draft.dirty,
    errors,
    clear,
    save: draft.save,
    discard,
    leave: draft.leave
  }
}
