// Single source of truth pairing each STANDARD (the human rule the AI is told to follow,
// `.claude/rules/<id>.md`) with its ENFORCEMENT (what blocks the merge). This is what makes
// "what we suggest to the AI" and "what blocks the merge" the SAME definition — they cannot
// drift without failing the invariant test in CI
// (packages/webkit/test/standards/invariant.test.mjs).
//
// NOTHING is advisory. Every standard is BLOCKING via one or more surfaces:
//   'write-time' → a .claude/hooks/<by>.mjs hook (exit 2)
//   'lint'       → a packages/webkit/src/eslint-plugin/rules/<by>.js rule (error)
//   'ci'         → governance.yml job / the check-authoring ratchet / commitlint /
//                  branch-protection / size-limit / vuejs-accessibility
//   'review'     → mandatory approval — the PR cannot merge without the required 2 approvals
//                  (technical + design). Used for the parts regex cannot verify; review is a
//                  hard gate, not a suggestion.
// `note` records what is partial or pending activation (honest, not a silent gap).

export const STANDARDS = [
  // ── Foundational (11) ──
  {
    id: 'no-invention',
    kind: 'foundational',
    enforce: [
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'write-time', by: 'validate-references' }
    ]
  },
  {
    id: 'prop-vocabulary',
    kind: 'foundational',
    enforce: [{ surface: 'write-time', by: 'validate-spec-compliance' }]
  },
  {
    id: 'naming',
    kind: 'foundational',
    enforce: [
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'write-time', by: 'validate-story-source' }
    ]
  },
  {
    id: 'imports',
    kind: 'foundational',
    enforce: [
      { surface: 'write-time', by: 'validate-references' },
      { surface: 'lint', by: 'valid-import-path' },
      { surface: 'lint', by: 'no-barrel-import' },
      { surface: 'lint', by: 'no-deep-internal-import' }
    ]
  },
  {
    id: 'compound-api',
    kind: 'foundational',
    enforce: [
      { surface: 'ci', by: 'catalog-drift' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: 'scaffolder emits the compound + -root; catalog drift check + review confirm.'
  },
  {
    id: 'styling',
    kind: 'foundational',
    enforce: [{ surface: 'write-time', by: 'validate-tokens' }]
  },
  {
    id: 'dependencies',
    kind: 'foundational',
    enforce: [{ surface: 'write-time', by: 'validate-references' }]
  },
  {
    id: 'migration',
    kind: 'foundational',
    enforce: [
      { surface: 'write-time', by: 'validate-tokens' },
      { surface: 'write-time', by: 'validate-references' },
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: 'The rewritten output cannot be off-standard — blocked by the aggregate of the output checks; review confirms nothing was inherited as-is.'
  },
  {
    id: 'storybook-source',
    kind: 'foundational',
    enforce: [{ surface: 'write-time', by: 'validate-story-source' }]
  },
  {
    id: 'release-types',
    kind: 'foundational',
    enforce: [{ surface: 'ci', by: 'commitlint' }]
  },
  {
    id: 'git-workflow',
    kind: 'foundational',
    enforce: [
      { surface: 'ci', by: 'commitlint' },
      { surface: 'ci', by: 'branch-protection' }
    ],
    note: 'Base branch + required checks enforced by branch protection; commit shape by commitlint.'
  },

  // ── Construction (12) ──
  {
    id: 'component-structure',
    kind: 'construction',
    enforce: [
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: 'Folder layout + defineOptions blocked by spec-compliance; <script setup> section order confirmed in review.'
  },
  {
    id: 'props',
    kind: 'construction',
    enforce: [
      { surface: 'write-time', by: 'validate-authoring' },
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'write-time', by: 'validate-tokens' },
      { surface: 'ci', by: 'check-authoring' }
    ]
  },
  {
    id: 'v-model',
    kind: 'construction',
    enforce: [
      { surface: 'write-time', by: 'validate-authoring' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'lint', by: 'prefer-define-model' }
    ]
  },
  {
    id: 'emits',
    kind: 'construction',
    enforce: [
      { surface: 'write-time', by: 'validate-authoring' },
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'ci', by: 'check-authoring' }
    ]
  },
  {
    id: 'slots',
    kind: 'construction',
    enforce: [
      { surface: 'write-time', by: 'validate-authoring' },
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'ci', by: 'check-authoring' }
    ]
  },
  {
    id: 'composables',
    kind: 'construction',
    enforce: [
      { surface: 'write-time', by: 'validate-authoring' },
      { surface: 'ci', by: 'check-authoring' }
    ]
  },
  {
    id: 'root-element',
    kind: 'construction',
    enforce: [
      { surface: 'write-time', by: 'validate-tokens' },
      { surface: 'write-time', by: 'validate-references' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: '`class` in defineProps + phantom asChild are blocked automatically; defineExpose/polymorphism confirmed in review.'
  },
  {
    id: 'component-states',
    kind: 'construction',
    enforce: [
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: 'Spec state matrix checked; completeness confirmed in review.'
  },
  {
    id: 'accessibility',
    kind: 'construction',
    enforce: [
      { surface: 'ci', by: 'vuejs-accessibility' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: 'Static a11y via eslint-plugin-vuejs-accessibility (error); behavioural via axe once the test layer lands; review in the meantime.'
  },
  {
    id: 'testid',
    kind: 'construction',
    enforce: [{ surface: 'write-time', by: 'validate-spec-compliance' }]
  },
  {
    id: 'deprecation',
    kind: 'construction',
    enforce: [
      { surface: 'write-time', by: 'validate-authoring' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'lint', by: 'no-deprecated-component' }
    ]
  },
  {
    id: 'bundle-budget',
    kind: 'construction',
    enforce: [
      { surface: 'ci', by: 'size-limit' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: 'size-limit config present; CI job pending activation, review gates it meanwhile.'
  }
]

export const STANDARDS_BY_ID = Object.fromEntries(STANDARDS.map((s) => [s.id, s]))
