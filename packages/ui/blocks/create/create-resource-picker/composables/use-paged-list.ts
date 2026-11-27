import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  ref,
  toValue,
  type WritableComputedRef
} from 'vue'

import type { ResourcePickerOption } from '../create-resource-picker.vue'

const PAGE_SIZE = 5

export interface UsePagedListReturn {
  query: WritableComputedRef<string>
  paged: ComputedRef<boolean>
  matches: ComputedRef<ResourcePickerOption[]>
  visible: ComputedRef<ResourcePickerOption[]>
  remaining: ComputedRef<number>
  nextBatch: ComputedRef<number>
  summary: ComputedRef<string>
  showMore: () => void
}

export const usePagedList = (
  source: MaybeRefOrGetter<ResourcePickerOption[]>,
  noun: string,
  loading: MaybeRefOrGetter<boolean>,
  chosen: MaybeRefOrGetter<string>
): UsePagedListReturn => {
  const options = computed(() => toValue(source))
  const queryText = ref('')
  const query = computed({
    get: () => queryText.value,
    set: (value: string) => {
      queryText.value = value
    }
  })
  const shown = ref(PAGE_SIZE)

  const chosenIndex = options.value.findIndex((option) => option.value === toValue(chosen))
  if (chosenIndex >= PAGE_SIZE) shown.value = Math.ceil((chosenIndex + 1) / PAGE_SIZE) * PAGE_SIZE

  const paged = computed(() => options.value.length > PAGE_SIZE)
  const matches = computed(() => {
    const text = query.value.trim().toLowerCase()
    if (!text) return options.value
    return options.value.filter(
      (option) =>
        option.label.toLowerCase().includes(text) ||
        String(option.description ?? '')
          .toLowerCase()
          .includes(text)
    )
  })
  const visible = computed(() => matches.value.slice(0, shown.value))
  const remaining = computed(() => Math.max(0, matches.value.length - visible.value.length))
  const nextBatch = computed(() => Math.min(PAGE_SIZE, remaining.value))

  const summary = computed(() => {
    if (toValue(loading)) return 'Loading ' + nextBatch.value + ' more ' + noun + 's'
    if (query.value.trim() && !matches.value.length) return 'No ' + noun + ' matches ' + query.value
    if (remaining.value)
      return visible.value.length + ' of ' + matches.value.length + ' ' + noun + 's'
    return query.value.trim()
      ? matches.value.length + ' of ' + options.value.length + ' ' + noun + 's'
      : options.value.length + ' ' + noun + 's'
  })

  const showMore = () => {
    shown.value += PAGE_SIZE
  }

  return { query, paged, matches, visible, remaining, nextBatch, summary, showMore }
}
