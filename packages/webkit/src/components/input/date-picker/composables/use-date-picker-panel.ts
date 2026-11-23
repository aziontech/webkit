import {
  type Component,
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  shallowRef,
  toValue,
  watch
} from 'vue'

export interface DatePickerPanel {
  grid: Component
  fields: Component
}

export interface UseDatePickerPanelReturn {
  panel: ComputedRef<DatePickerPanel | null>
  panelOpen: ComputedRef<boolean>
}

export function useDatePickerPanel(open: MaybeRefOrGetter<boolean>): UseDatePickerPanelReturn {
  const loaded = shallowRef<DatePickerPanel | null>(null)

  watch(
    () => toValue(open),
    async (isOpen) => {
      if (!isOpen || loaded.value) return
      const [grid, fields] = await Promise.all([
        import('../parts/date-picker-grid.vue'),
        import('../parts/date-picker-fields.vue')
      ])
      loaded.value = { grid: grid.default, fields: fields.default }
    },
    { immediate: true }
  )

  return {
    panel: computed(() => loaded.value),
    panelOpen: computed(() => toValue(open) && loaded.value !== null)
  }
}
