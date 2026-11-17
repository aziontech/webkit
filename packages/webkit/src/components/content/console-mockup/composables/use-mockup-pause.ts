import { computed, type ComputedRef, ref } from 'vue'

import { useMediaQuery } from '../../../../composables/use-media-query'
import { useTranslate } from '../../../../composables/use-translate'
import * as en from '../../../../locales/en'

export interface UseMockupPauseReturn {
  paused: ComputedRef<boolean>
  label: ComputedRef<string>
  toggle: () => void
}

export function useMockupPause(): UseMockupPauseReturn {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const { t } = useTranslate({ common: en.common })
  const chosen = ref<boolean | null>(null)

  const paused = computed(() => chosen.value ?? reduced.value)
  const label = computed(() =>
    paused.value ? t('common.playAnimation') : t('common.pauseAnimation')
  )

  const toggle = () => {
    chosen.value = !paused.value
  }

  return { paused, label, toggle }
}
