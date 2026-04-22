import type { DynamicDialogOptions } from 'primevue/dynamicdialogoptions'

import { usePrimeDialog } from '../../plugins/primevue/primevue-internals.js'

export function useDialog(): {
  open: (content: unknown, options?: DynamicDialogOptions) => { close: () => void }
} {
  return usePrimeDialog()
}
