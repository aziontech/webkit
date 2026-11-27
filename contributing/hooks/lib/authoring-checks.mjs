// Re-export shim: the canonical construction-standard check engine now lives INSIDE the
// package (packages/ui/src/eslint-plugin/lib/authoring-checks.js) so it ships to
// consumers as the `azion-ui/require-authoring-standards` ESLint rule. The write-time hook and the
// CI ratchet import it from here — one definition, three enforcement surfaces.
export * from '../../../packages/ui/src/eslint-plugin/lib/authoring-checks.js'
