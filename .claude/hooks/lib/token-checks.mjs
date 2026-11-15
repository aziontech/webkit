// Re-export shim: the canonical token-check engine lives inside the package
// (packages/webkit/src/eslint-plugin/token-checks.js) so the DS CI ratchet runs the
// exact same checks repo-wide. One definition, two surfaces.
export * from '../../../packages/webkit/src/eslint-plugin/token-checks.js'
