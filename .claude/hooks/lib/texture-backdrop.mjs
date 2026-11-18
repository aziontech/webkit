// Re-export shim: the texture backdrop check lives inside the package
// (packages/webkit/src/eslint-plugin/lib/texture-backdrop.js) so the write-time hook and the CI ratchet
// (scripts/check-authoring.mjs) run the same scan. One definition, two surfaces.
export * from '../../../packages/webkit/src/eslint-plugin/lib/texture-backdrop.js'
