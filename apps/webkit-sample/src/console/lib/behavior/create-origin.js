import { computed, toValue } from 'vue'
import { useRoute } from 'vue-router'

export const CREATION_CENTER_PATH = '/create'
export const CREATION_CENTER_LABEL = 'Creation Center'

export function useCreateOrigin(fallbackPath, fallbackLabel) {
  const route = useRoute()

  const from = computed(() =>
    typeof route.query.from === 'string' ? route.query.from.split('?')[0] : ''
  )

  const fromLabel = computed(() =>
    from.value && typeof route.query.fromLabel === 'string' ? route.query.fromLabel.trim() : ''
  )

  return {
    path: computed(() => from.value || toValue(fallbackPath)),
    label: computed(() => {
      if (from.value === CREATION_CENTER_PATH) return CREATION_CENTER_LABEL
      return fromLabel.value || toValue(fallbackLabel)
    })
  }
}
