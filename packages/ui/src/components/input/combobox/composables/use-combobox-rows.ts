import { computed, type ComputedRef, type Ref } from 'vue'

import {
  buildSections,
  type ComboboxRow,
  type ComboboxSection,
  optionLabel
} from '../lib/combobox-rows'
import type { ComboboxOption } from '../types'

export interface UseComboboxRowsReturn {
  exactMatch: (value: string) => ComboboxOption | undefined
  sections: ComputedRef<ComboboxSection[]>
  rows: ComputedRef<ComboboxRow[]>
}

export function useComboboxRows(
  props: { options: ComboboxOption[]; filter: boolean; allowCustom: boolean },
  query: ComputedRef<string>,
  locale: Ref<string>,
  uid: string
): UseComboboxRowsReturn {
  const fold = (value: string) =>
    value
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLocaleLowerCase(locale.value)

  const folded = computed(() =>
    props.options.map((option) => ({
      option,
      value: fold(option.value),
      label: fold(optionLabel(option))
    }))
  )

  const exactMatch = (value: string) => {
    const needle = fold(value)
    return folded.value.find(
      (entry) => !entry.option.disabled && (entry.value === needle || entry.label === needle)
    )?.option
  }

  const matches = computed(() => {
    if (!props.filter || !query.value) return props.options
    const needle = fold(query.value)
    return folded.value
      .filter((entry) => entry.value.includes(needle) || entry.label.includes(needle))
      .map((entry) => entry.option)
  })

  const sections = computed(() => {
    const custom = props.allowCustom && query.value && !exactMatch(query.value) ? query.value : ''
    return buildSections(matches.value, uid, custom)
  })

  const rows = computed(() => sections.value.flatMap((section) => section.rows))

  return { exactMatch, sections, rows }
}
