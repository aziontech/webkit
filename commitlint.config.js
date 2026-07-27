/**
 * Commitlint config — the commit-message gate for the repo.
 * Merges to `main` are squash merges: release-please parses the squashed
 * commit header (the PR title), and its conventional-commit parser is NOT
 * configurable — the header must START with the bare type. A leading ticket
 * tag (`[NO-ISSUE] fix: …`) is unparseable there and silently produces no
 * release, so that form is rejected here; the ticket tag lives in the
 * subject instead, right after the colon.
 *
 * Accepted forms:
 *   feat(webkit): [NO-ISSUE] add segmented button component
 *   fix(theme): [ENG-1234] move vue-tsc to devDependencies
 *   feat(webkit)!: [ENG-999] drop tone prop
 *   fix(webkit): commit message
 *   fix: commit message                       ← ticket tag is optional
 *
 * Rejected (the pre-2026-07 convention — invisible to release-please):
 *   [NO-ISSUE] fix(webkit): commit message
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
      headerPattern: /^(\w+)(?:\(([\w-]+)\))?!?:\s(.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject']
    }
  },
  plugins: [
    {
      rules: {
        // Migration guard: the old `[TICKET] type: …` header parses as no
        // type at all, so without this rule the only feedback would be a
        // cryptic "type may not be empty". Point at the new form instead.
        'header-no-leading-ticket': (parsed) => {
          const header = parsed.header ?? ''
          return [
            !/^\[[^\]]*\]/.test(header),
            'the ticket tag moved: write "type(scope): [TICKET] subject" — a leading "[TICKET] type: …" header is invisible to release-please and releases nothing'
          ]
        },
        // When the subject opens with a bracket tag, it must be well-formed:
        // [NO-ISSUE] or [ABC-123], followed by a space and the subject text.
        'subject-ticket-tag': (parsed) => {
          const subject = parsed.subject ?? ''
          if (!subject.startsWith('[')) return [true]
          return [
            /^\[(NO-ISSUE|[A-Z]+-\d+)\] \S/.test(subject),
            'subject ticket tag must be "[NO-ISSUE]" or "[ABC-123]" followed by a space and the subject text'
          ]
        }
      }
    }
  ],
  rules: {
    'header-no-leading-ticket': [2, 'always'],
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
    'subject-ticket-tag': [2, 'always'],
    'header-max-length': [2, 'always', 100]
  }
}
