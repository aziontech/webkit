// Re-export shim: the canonical token-check engine lives inside the package
// (packages/ui/src/eslint-plugin/lib/token-checks.js) so the DS CI ratchet runs the
// exact same checks repo-wide. One definition, two surfaces.
export * from '../../../packages/ui/src/eslint-plugin/lib/token-checks.js'

import {
  WIDE_TOKEN_DIRS,
  tokenChecksFor
} from '../../../packages/ui/src/eslint-plugin/lib/token-checks.js'

// The package never names apps/ (test/standards/source-of-truth), so the app sources the
// wide checks also cover are added here, on the repo side, for the hook and the ratchet.
export const REPO_WIDE_TOKEN_DIRS = [...WIDE_TOKEN_DIRS, 'apps/docs/src/', 'apps/demos/src/']

export function repoTokenChecksFor(rel) {
  return tokenChecksFor(rel, REPO_WIDE_TOKEN_DIRS)
}
