// Re-export shim: the built-in string check lives inside the package
// (packages/webkit/src/eslint-plugin/lib/built-in-strings.js) so the write-time hook and the CI ratchet
// (scripts/check-authoring.mjs) run the same scan. One definition, two surfaces.
export * from '../../../packages/webkit/src/eslint-plugin/lib/built-in-strings.js'
