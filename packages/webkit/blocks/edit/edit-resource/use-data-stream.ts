import {
  computed,
  type ComputedRef,
  inject,
  type InjectionKey,
  nextTick,
  provide,
  reactive,
  readonly,
  type Ref,
  ref
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

export function provideDataStream(): DataStreamContext {
  const form = reactive(structuredClone(sampleDataStream))
  const saving = ref(false)
  const baseline = ref(JSON.stringify(sampleDataStream))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)
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
    baseline.value = JSON.stringify(form)
  }

  const save = () => {
    destinationError.value = ''
    if (!checkDataStream(form, errors)) {
      focusFirstError(errors)
      return
    }
    saving.value = true
    setTimeout(land, 900)
  }

  const discard = () => {
    Object.assign(form, JSON.parse(baseline.value) as DataStreamRecord)
    Object.keys(errors).forEach((key) => delete errors[key])
    destinationError.value = ''
  }

  const context: DataStreamContext = {
    form,
    saving: readonly(saving),
    dirty,
    errors,
    destinationError: readonly(destinationError),
    clear,
    onDestinationChange,
    save,
    discard
  }
  provide(DataStreamInjectionKey, context)
  return context
}

export function useDataStreamContext(): DataStreamContext {
  const context = inject(DataStreamInjectionKey, null)
  if (!context) throw new Error('useDataStreamContext must be used within DataStreamPage.')
  return context
}
