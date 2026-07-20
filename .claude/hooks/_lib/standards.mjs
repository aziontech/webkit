// Machine-readable registry pairing each standard (.claude/rules/<id>.md) with what enforces
// it; the invariant test (packages/webkit/test/standards/invariant.test.mjs) fails CI when
// they drift. scope: 'general' ships to consumer projects, 'webkit' is DS-internal. enforce[]
// surfaces: 'write-time' (hook), 'lint' (eslint-plugin rule), 'ci' (governance gate),
// 'review' (mandatory approval). Semantics and full rule table: .claude/rules/README.md.

export const STANDARDS = [
  // ── Foundational ──
  {
    id: 'no-invention',
    kind: 'foundational',
    scope: 'webkit',
    enforce: [
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'write-time', by: 'validate-references' },
      { surface: 'ci', by: 'check-authoring' }
    ]
  },
  {
    id: 'prop-vocabulary',
    kind: 'foundational',
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'ci', by: 'check-authoring' }
    ]
  },
  {
    id: 'naming',
    kind: 'foundational',
    scope: 'webkit',
    enforce: [
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'write-time', by: 'validate-story-source' },
      { surface: 'ci', by: 'check-authoring' }
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
      { surface: 'lint', by: 'no-deep-internal-import' },
      { surface: 'lint', by: 'prefer-tree-shakeable-root' },
      { surface: 'lint', by: 'no-whole-icon-set-import' }
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
    enforce: [
      { surface: 'write-time', by: 'validate-tokens' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'lint', by: 'no-hardcoded-color' },
      { surface: 'lint', by: 'no-style-override' }
    ],
    note: 'The ratchet runs the same token-checks engine repo-wide, so an editor push cannot bypass the hook; consumers get the color/override lints.'
  },
  {
    id: 'dependencies',
    kind: 'foundational',
    scope: 'webkit',
    enforce: [
      { surface: 'write-time', by: 'validate-references' },
      { surface: 'ci', by: 'type-check' }
    ],
    note: 'Forbidden libs are never installed — any import of one fails vue-tsc/build in CI, so an editor push cannot bypass the hook.'
  },
  {
    id: 'migration',
    kind: 'foundational',
    scope: 'webkit',
    enforce: [
      { surface: 'write-time', by: 'validate-tokens' },
      { surface: 'write-time', by: 'validate-references' },
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: 'The rewritten output cannot be off-standard — blocked by the aggregate of the output checks (which the ratchet also runs in CI); review confirms nothing was inherited as-is.'
  },
  {
    id: 'storybook-source',
    kind: 'foundational',
    scope: 'webkit',
    enforce: [
      { surface: 'write-time', by: 'validate-story-source' },
      { surface: 'ci', by: 'check-authoring' }
    ],
    note: 'The ratchet runs the same story-source engine over apps/storybook/src in CI; the Storybook build also fails on non-compiling stories.'
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
      { surface: 'review', by: 'required-approval' },
      { surface: 'ci', by: 'check-authoring' }
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
    id: 'event-payloads',
    kind: 'construction',
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: 'Activation events emit (event, item?). The spec Events table states the payload and spec⇄code compliance pins the emit set to it; the (event-first, no-duplication) shape itself is confirmed in review.'
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
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: '`class` in defineProps + phantom asChild are blocked automatically (write-time AND the CI ratchet token scan); defineExpose/polymorphism confirmed in review.'
  },
  {
    id: 'component-states',
    kind: 'construction',
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'review', by: 'required-approval' },
      { surface: 'ci', by: 'check-authoring' }
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
    enforce: [
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'ci', by: 'check-authoring' }
    ]
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
    note: 'Budget of record lives in packages/webkit/.size-limit.json. scripts/check-size.mjs is the vue-aware gate: it compiles each budgeted entry with Vite + @vitejs/plugin-vue (vue externalized, minified) and fails the governance build job when the gzipped output exceeds its budget. Budgets only ratchet down; entries not yet budgeted stay gated by review.'
  },
  {
    id: 'testing',
    kind: 'construction',
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'enforce-test-exists' },
      { surface: 'write-time', by: 'validate-references' },
      { surface: 'ci', by: 'check-tests' },
      { surface: 'ci', by: 'vitest' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: 'Every component ships a co-located <name>.test.ts — you cannot create or land a component without its test. enforce-test-exists blocks a component .vue write/edit whose <name>.test.ts is missing; check-tests fails CI when any component lacks a test (existence — never grandfathered); the sharded Vitest browser CI job (Playwright Chromium, Storybook story as fixture, axe-core on the tree) runs the suite; validate-references blocks a test with unresolved imports (incl. a mistaken @stories alias); package.json#files + pack:check keep tests out of the published tarball. Review confirms the behavioral surface is actually covered and that a behavior change updates the test (style-only changes need no test touch — deliberately no diff-freshness gate).'
  },
  {
    id: 'authoring-docs',
    kind: 'foundational',
    scope: 'webkit',
    enforce: [
      { surface: 'write-time', by: 'validate-authoring-docs' },
      { surface: 'ci', by: 'check-authoring-docs' }
    ],
    note: 'Skills (.claude/skills + cli-templates/claude/skills) and agents (.claude/agents + cli-templates/claude/agents) carry conforming frontmatter (name==folder/filename, non-empty description, scope matching location; consumer skills webkit-* + status + last_updated) and no file-as-example refs. validate-authoring-docs blocks a new/edited doc write-time (exit 2); check-authoring-docs is the CI ratchet over all four populations; both share _lib/authoring-docs-checks.mjs. scope=webkit: the standard about how the authoring/adoption bundle is shaped is DS-internal (like storybook-source), even though the consumer skills it validates ship out.'
  }
]

export const STANDARDS_BY_ID = Object.fromEntries(STANDARDS.map((s) => [s.id, s]))

/** Standards a consuming project should adopt — they ship out (guideline + eslint-plugin). */
export const GENERAL_STANDARDS = STANDARDS.filter((s) => s.scope === 'general')
/** Standards specific to authoring the webkit design system itself. */
export const WEBKIT_STANDARDS = STANDARDS.filter((s) => s.scope === 'webkit')
