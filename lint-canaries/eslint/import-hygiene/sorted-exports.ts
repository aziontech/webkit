// CANARY — must keep failing simple-import-sort/exports.
// 'autoprefixer' sorts before 'vue' — the re-export order below is wrong.
export { ref } from 'vue'
export { default as autoprefixer } from 'autoprefixer'
