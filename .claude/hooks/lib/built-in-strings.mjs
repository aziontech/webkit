// Re-export shim: the built-in string check lives inside the package
// (packages/webkit/scripts/lib/built-in-strings.mjs) so the write-time hook and the CI ratchet
// (scripts/check-authoring.mjs) run the same scan. One definition, two surfaces.
export * from '../../../packages/webkit/scripts/lib/built-in-strings.mjs'
