// Re-export shim: the canonical construction-standard check engine now lives INSIDE the
// package (packages/webkit/src/eslint-plugin/authoring-checks.js) so it ships to
// consumers as the `webkit/authoring-standards` ESLint rule. The write-time hook and the
// CI ratchet import it from here — one definition, three enforcement surfaces.
export * from '../../../packages/webkit/src/eslint-plugin/authoring-checks.js'
