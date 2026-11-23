import {
  useUnsavedChanges,
  type UseUnsavedChangesReturn
} from '@aziontech/webkit/use-unsaved-changes'
import {
  type ComputedRef,
  inject,
  type InjectionKey,
  nextTick,
  provide,
  reactive,
  readonly,
  type Ref,
  ref,
  watch
} from 'vue'

import { checkDataStream } from './lib/data-stream-checks'
import { sampleDataStream } from './sample'
import type { FieldProblems } from './use-deploy-on-save'

export type DataStreamRecord = typeof sampleDataStream

export interface DataStreamContext {
  /** The editable copy of the stream. */
  form: DataStreamRecord
  /** The save is in flight. */
  saving: Readonly<Ref<boolean>>
  /** The form differs from the saved stream. */
  dirty: ComputedRef<boolean>
  /** The problems the last save found, by field key. */
  errors: FieldProblems
  /** Why the destination refused the test record, shown above the Destination card. */
  destinationError: Readonly<Ref<string>>
  /** Drops the problem of one field once it is edited. */
  clear: (id: string) => void
  /** Drops the problem of one destination field and the destination error. */
  onDestinationChange: (id: string) => void
  /** Validates, then sends one test record and saves. */
  save: () => void
  /** Puts the saved stream back and drops every problem. */
  discard: () => void
  /** The leave guard: warns on reload and drives the leave dialog while the form is dirty. */
  leave: UseUnsavedChangesReturn<DataStreamRecord>
}

const DataStreamInjectionKey: InjectionKey<DataStreamContext> = Symbol('DataStream')

const unreachable = (value: string) => {
  try {
    return new URL(value).hostname.endsWith('.invalid')
  } catch {
    return false
  }
}

const focusFirstError = (errors: FieldProblems) =>
  nextTick(() => {
    const id = Object.keys(errors)[0]
    if (id) document.getElementById(`data-stream-${id}`)?.focus()
  })

const settled = (saving: Ref<boolean>) =>
  new Promise<void>((resolve) => {
    if (!saving.value) return resolve()
    const stop = watch(saving, (next) => {
      if (next) return
      stop()
      resolve()
    })
  })

const guardDataStream = (form: DataStreamRecord, saving: Ref<boolean>, save: () => void) =>
  useUnsavedChanges(() => form, {
    onDiscard: (baseline) => Object.assign(form, baseline),
    onSave: () => {
      save()
      return settled(saving)
    }
  })

export function provideDataStream(): DataStreamContext {
  const form = reactive(structuredClone(sampleDataStream))
  const saving = ref(false)
  const leave = guardDataStream(form, saving, () => save())
  const errors = reactive<FieldProblems>({})
  const destinationError = ref('')

  const clear = (id: string) => {
    if (errors[id]) delete errors[id]
  }

  const onDestinationChange = (id: string) => {
    clear(id)
    destinationError.value = ''
  }

  const land = () => {
    saving.value = false
    const target = form.connector === 'analytics' ? 'analyticsUrl' : 'url'
    if (['standard', 'analytics'].includes(form.connector) && unreachable(form[target])) {
      destinationError.value =
        'The endpoint did not answer the test record, so the stream was not saved. Your other changes are still here.'
      errors[target] = {
        type: 'invalid',
        message: 'The endpoint did not answer within 10 seconds.'
      }
      nextTick(() => document.getElementById('destination')?.scrollIntoView({ block: 'start' }))
      focusFirstError(errors)
      return
    }
    leave.commit()
  }

  function save() {
    destinationError.value = ''
    if (!checkDataStream(form, errors)) {
      focusFirstError(errors)
      return
    }
    saving.value = true
    setTimeout(land, 900)
  }

  const discard = () => {
    leave.discard()
    Object.keys(errors).forEach((key) => delete errors[key])
    destinationError.value = ''
  }

  const context: DataStreamContext = {
    form,
    saving: readonly(saving),
    dirty: leave.isDirty,
    errors,
    destinationError: readonly(destinationError),
    clear,
    onDestinationChange,
    save,
    discard,
    leave
  }
  provide(DataStreamInjectionKey, context)
  return context
}

export function useDataStreamContext(): DataStreamContext {
  const context = inject(DataStreamInjectionKey, null)
  if (!context) throw new Error('useDataStreamContext must be used within DataStreamPage.')
  return context
}
