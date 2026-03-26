import { ref } from 'vue'

interface UseViewModeOptions {
  modes: string[]
  default?: string
}

export function useViewMode(options: UseViewModeOptions) {
  const { modes, default: defaultMode } = options
  const currentMode = ref(defaultMode ?? modes[0])

  function setMode(mode: string) {
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
