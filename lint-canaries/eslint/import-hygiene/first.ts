// CANARY — must keep failing import/first.
// A statement appears before the import block.
const DEFAULT_SIZE = 'large'
import { ref } from 'vue'

export const size = ref(DEFAULT_SIZE)
