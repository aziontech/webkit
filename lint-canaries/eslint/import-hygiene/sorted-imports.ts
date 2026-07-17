// CANARY — must keep failing simple-import-sort/imports.
// 'autoprefixer' sorts before 'vue' — the order below is wrong.
import { ref } from 'vue'
import autoprefixer from 'autoprefixer'

export const plugins = [autoprefixer]
export const count = ref(0)
