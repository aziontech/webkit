// CANARY — must keep failing unused-imports/no-unused-imports.
// `computed` is imported and never used — the one unused-code case
// `lint:fix` deletes automatically.
import { computed, ref } from 'vue'

export const count = ref(0)
