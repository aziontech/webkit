/**
 * Commitlint config — the commit-message gate for the repo.
 * Merges to `main` are squash merges: release-please parses the squashed
 * commit (the PR title), so keep PR titles commitlint-valid too.
 *
 * Accepted forms:
 *   [NO-ISSUE] fix(webkit): commit message
 *   [ENG-1231] fix(webkit): commit message
 *   fix(webkit): commit message
 *   fix: commit message
 *
 * Breaking changes (produce a major release):
 *   feat(webkit)!: drop tone prop                    ← `!` after type/scope
 *   feat(webkit): add x\n\nBREAKING CHANGE: drops y  ← footer form
 *
 * Type → release (stock release-please; not configurable per type):
 *   feat                            → minor
 *   fix                             → patch
 *   chore | docs | style | refactor |
 *   perf | test | ci | revert      → no release  (allowed for hygiene, no version bump)
 *   any-type with `!` or BREAKING:  → major
 * Contract: .claude/rules/release-types.md
 */
export default {
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\[[\w-]+\]\s+)?(\w+)(?:\(([\w-]+)\))?!?:\s(.*)$/,
      headerCorrespondence: ['ticket', 'type', 'scope', 'subject']
    }
  },
  rules: {
    'type-empty': [2, 'never'],
    'type-case': [2, 'always', 'lower-case'],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'chore',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'ci',
        'revert'
      ]
    ],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-case': [0],
    'header-max-length': [2, 'always', 100]
  }
}
