// Single source of truth pairing each STANDARD (the human rule the AI is told to follow,
// `.claude/rules/<id>.md`) with its ENFORCEMENT (the check that blocks the merge). This is
// what makes "what we suggest to the AI" and "what the pipeline blocks" the SAME
// definition — they cannot drift without failing the invariant test in CI
// (packages/webkit/test/standards/invariant.test.mjs).
//
// enforce[]:  { surface, by }
//   surface: 'write-time' → a .claude/hooks/<by>.mjs hook
//            'ci'         → governance.yml / the check-authoring ratchet / commitlint
//            'lint'       → a packages/webkit/src/eslint-plugin/rules/<by>.js rule
// reviewGated: true → deliberately not fully mechanizable yet; caught by human review
//   (and/or the axe test layer). It is DECLARED debt, never a silent gap.

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
    reviewGated: true,
    note: 'scaffolder emits the compound + -root; reviewer confirms.'
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
    reviewGated: true,
    note: 'Injected in the agent envelope; reviewer confirms nothing was inherited as-is.'
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
    reviewGated: true,
    note: 'Enforced by the /create-branch and /open-pr flows + review.'
  },

  // ── Construction (12) ──
  {
    id: 'component-structure',
    kind: 'construction',
    reviewGated: true,
    note: 'scaffolder skeleton fixes folder layout + <script setup> order; reviewer confirms.'
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
    reviewGated: true,
    enforce: [
      { surface: 'write-time', by: 'validate-tokens' },
      { surface: 'write-time', by: 'validate-references' }
    ],
    note: 'Partial: `class` in defineProps + phantom asChild are blocked; defineExpose/polymorphism are review.'
  },
  {
    id: 'component-states',
    kind: 'construction',
    reviewGated: true,
    note: 'Spec state matrix + review; loading/empty render via Skeleton/EmptyState.'
  },
  {
    id: 'accessibility',
    kind: 'construction',
    reviewGated: true,
    enforce: [{ surface: 'ci', by: 'vuejs-accessibility' }],
    note: 'Static a11y via eslint-plugin-vuejs-accessibility; behavioural (focus/keyboard) via axe in the test layer.'
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
    reviewGated: true,
    note: 'size-limit config present; the CI job is a pending follow-up.'
  }
]

export const STANDARDS_BY_ID = Object.fromEntries(STANDARDS.map((s) => [s.id, s]))
