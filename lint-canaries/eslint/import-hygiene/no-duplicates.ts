// CANARY — must keep failing import/no-duplicates.
// Two import statements for the same module.
import { computed } from 'vue'
import { ref } from 'vue'

export const doubled = computed(() => ref(0).value * 2)
