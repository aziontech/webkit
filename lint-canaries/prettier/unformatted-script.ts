// CANARY — must keep failing `prettier --check`.
// Semicolons, double quotes and 4-space indent violate .prettierrc.json
// (semi: false, singleQuote: true, tabWidth: 2).
import { computed } from 'vue'

const SIZES = ['small', 'medium', 'large']

export const label = computed(() => {
  return SIZES[0]
})
