import { ref } from 'vue'

export function useViewMode(options) {
  const { modes, default: defaultMode } = options
  const currentMode = ref(defaultMode ?? modes[0])

  function setMode(mode) {
    if (modes.includes(mode)) {
      currentMode.value = mode
    }
  }

  function isMode(mode) {
    return currentMode.value === mode
  }

  return {
    currentMode,
    setMode,
    isMode
  }
}
