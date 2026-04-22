import type { Ref } from 'vue'
import { ref } from 'vue'

interface ViewModeOptions {
  modes: string[]
  default?: string
}

interface ViewModeReturn {
  currentMode: Ref<string>
  setMode: (mode: string) => void
  isMode: (mode: string) => boolean
}

export function useViewMode(options: ViewModeOptions): ViewModeReturn {
  const { modes, default: defaultMode } = options
  const currentMode = ref(defaultMode ?? modes[0])

  function setMode(mode: string): void {
    if (modes.includes(mode)) {
      currentMode.value = mode
    }
  }

  function isMode(mode: string): boolean {
    return currentMode.value === mode
  }

  return {
    currentMode,
    setMode,
    isMode
  }
}
