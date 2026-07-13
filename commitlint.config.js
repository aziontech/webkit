/**
 * Commitlint config — mirrors the headerPattern in every packages/*\/.releaserc
 * so a commit that passes locally also passes the semantic-release analyzer.
 *
 * Accepted forms:
 *   [NO-ISSUE] fix(webkit): commit message
 *   [ENG-1231] fix(webkit): commit message
 *   fix(webkit): commit message
 *   fix: commit message
 *
 * Breaking changes (produce a major release per each .releaserc):
 *   feat(webkit)!: drop tone prop                    ← `!` after type/scope
 *   feat(webkit): add x\n\nBREAKING CHANGE: drops y  ← footer form
 *
 * Type → release bump (final, after .releaserc rules + preset defaults):
 *   feat                            → minor
 *   fix | hotfix | chore | docs |
 *   style | refactor | perf         → patch
 *   test | ci | revert              → no release  (allowed for hygiene, no version bump)
 *   any-type with `!` or BREAKING:  → major
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
        'hotfix',
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
