// Single source of truth pairing each STANDARD (the human rule the AI is told to follow,
// `.claude/rules/<id>.md`) with its ENFORCEMENT (what blocks the merge). This is what makes
// "what we suggest to the AI" and "what blocks the merge" the SAME definition — they cannot
// drift without failing the invariant test in CI
// (packages/webkit/test/standards/invariant.test.mjs).
//
// scope:
//   'general' → a construction pattern any project building/consuming Vue components should
//               follow; it SHIPS to consuming projects (the consumer guideline + eslint-plugin).
//   'webkit'  → specific to authoring the webkit design system itself (specs, the exports map,
//               Storybook, releases, the published package). It does NOT go to consumer projects.
//
// enforce[]: { surface, by }
//   'write-time' → a .claude/hooks/<by>.mjs hook (exit 2)
//   'lint'       → a packages/webkit/src/eslint-plugin/rules/<by>.js rule (error)
//   'ci'         → governance.yml job / check-authoring ratchet / commitlint / branch-protection
//                  / size-limit / vuejs-accessibility
//   'review'     → mandatory approval — the PR cannot merge without the 2 required approvals.
// NOTHING is advisory: every standard has at least one blocking surface. `note` records what
// is partial or pending activation (honest, never a silent gap).

export const STANDARDS = [
  // ── Foundational ──
  {
    id: 'no-invention',
    kind: 'foundational',
    scope: 'webkit',
    enforce: [
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'write-time', by: 'validate-references' }
    ]
  },
  {
    id: 'prop-vocabulary',
    kind: 'foundational',
    scope: 'general',
    enforce: [{ surface: 'write-time', by: 'validate-spec-compliance' }]
  },
  {
    id: 'naming',
    kind: 'foundational',
    scope: 'webkit',
    enforce: [
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'write-time', by: 'validate-story-source' }
    ]
  },
  {
    id: 'imports',
    kind: 'foundational',
    scope: 'webkit',
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
    scope: 'webkit',
    enforce: [
      { surface: 'ci', by: 'catalog-drift' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: 'scaffolder emits the compound + -root; catalog drift check + review confirm.'
  },
  {
    id: 'styling',
    kind: 'foundational',
    scope: 'general',
    enforce: [{ surface: 'write-time', by: 'validate-tokens' }]
  },
  {
    id: 'dependencies',
    kind: 'foundational',
    scope: 'webkit',
    enforce: [{ surface: 'write-time', by: 'validate-references' }]
  },
  {
    id: 'migration',
    kind: 'foundational',
    scope: 'webkit',
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
    scope: 'webkit',
    enforce: [{ surface: 'write-time', by: 'validate-story-source' }]
  },
  {
    id: 'release-types',
    kind: 'foundational',
    scope: 'webkit',
    enforce: [{ surface: 'ci', by: 'commitlint' }]
  },
  {
    id: 'git-workflow',
    kind: 'foundational',
    scope: 'webkit',
    enforce: [
      { surface: 'ci', by: 'commitlint' },
      { surface: 'ci', by: 'branch-protection' }
    ],
    note: 'Base branch + required checks enforced by branch protection; commit shape by commitlint.'
  },

  // ── Construction ──
  {
    id: 'component-structure',
    kind: 'construction',
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: 'Folder layout + defineOptions blocked by spec-compliance; <script setup> section order confirmed in review.'
  },
  {
    id: 'props',
    kind: 'construction',
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'validate-authoring' },
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'write-time', by: 'validate-tokens' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'lint', by: 'authoring-standards' }
    ]
  },
  {
    id: 'v-model',
    kind: 'construction',
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'validate-authoring' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'lint', by: 'prefer-define-model' },
      { surface: 'lint', by: 'authoring-standards' }
    ]
  },
  {
    id: 'emits',
    kind: 'construction',
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'validate-authoring' },
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'lint', by: 'authoring-standards' }
    ]
  },
  {
    id: 'slots',
    kind: 'construction',
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'validate-authoring' },
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'lint', by: 'authoring-standards' }
    ]
  },
  {
    id: 'composables',
    kind: 'construction',
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'validate-authoring' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'lint', by: 'authoring-standards' }
    ]
  },
  {
    id: 'root-element',
    kind: 'construction',
    scope: 'general',
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
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: 'Spec state matrix checked; completeness confirmed in review.'
  },
  {
    id: 'accessibility',
    kind: 'construction',
    scope: 'general',
    enforce: [
      { surface: 'ci', by: 'vuejs-accessibility' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: 'Static a11y via eslint-plugin-vuejs-accessibility (error); behavioural via axe once the test layer lands; review in the meantime.'
  },
  {
    id: 'testid',
    kind: 'construction',
    scope: 'general',
    enforce: [{ surface: 'write-time', by: 'validate-spec-compliance' }]
  },
  {
    id: 'deprecation',
    kind: 'construction',
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'validate-authoring' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'lint', by: 'no-deprecated-component' },
      { surface: 'lint', by: 'authoring-standards' }
    ]
  },
  {
    id: 'bundle-budget',
    kind: 'construction',
    scope: 'webkit',
    enforce: [
      { surface: 'ci', by: 'size-limit' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: 'size-limit config present; CI job pending activation, review gates it meanwhile.'
  }
]

export const STANDARDS_BY_ID = Object.fromEntries(STANDARDS.map((s) => [s.id, s]))

/** Standards a consuming project should adopt — they ship out (guideline + eslint-plugin). */
export const GENERAL_STANDARDS = STANDARDS.filter((s) => s.scope === 'general')
/** Standards specific to authoring the webkit design system itself. */
export const WEBKIT_STANDARDS = STANDARDS.filter((s) => s.scope === 'webkit')
