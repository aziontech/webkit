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
      { surface: 'write-time', by: 'enforce-spec-exists' },
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'write-time', by: 'validate-references' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'ci', by: 'check-spec-integrity' }
    ],
    note: 'The spec is the contract: enforce-spec-exists blocks a component Write whose spec is missing, not approved, locked or edited after approval; check-spec-integrity runs the same _lib/spec-integrity engine over every .specs/*.md in CI (approved or beyond, a shipped component stays implemented, body checksum matches).'
  },
  {
    id: 'prop-vocabulary',
    kind: 'foundational',
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'lint', by: 'menu-node-href' }
    ]
  },
  {
    id: 'naming',
    kind: 'foundational',
    scope: 'webkit',
    enforce: [
      { surface: 'write-time', by: 'validate-spec-compliance' },
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
      { surface: 'lint', by: 'no-whole-icon-set-import' },
      { surface: 'lint', by: 'no-root-relative-asset' }
    ]
  },
  {
    id: 'compound-api',
    kind: 'foundational',
    scope: 'webkit',
    enforce: [
      { surface: 'ci', by: 'catalog-drift' },
      { surface: 'ci', by: 'check-complete' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: 'scaffolder emits the compound + -root; check-complete fails a compound whose index.ts export has no ./<name>-root pointing at the root .vue (ratcheted by complete-baseline.json); catalog drift check + review confirm.'
  },
  {
    id: 'styling',
    kind: 'foundational',
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'validate-tokens' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'lint', by: 'no-hardcoded-color' },
      { surface: 'lint', by: 'no-hardcoded-motion' },
      { surface: 'lint', by: 'no-style-override' },
      { surface: 'lint', by: 'no-physical-direction' },
      { surface: 'lint', by: 'container-needs-width' },
      { surface: 'lint', by: 'no-wrapped-page-chrome' },
      { surface: 'lint', by: 'no-gap-after-closing-section' },
      { surface: 'lint', by: 'no-viewport-height-calc' },
      { surface: 'lint', by: 'no-output-in-command' },
      { surface: 'lint', by: 'no-link-in-sentence' }
    ],
    note: 'The ratchet runs the same token-checks engine repo-wide, so an editor push cannot bypass the hook; consumers get the color/motion/override lints.'
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
    id: 'release-types',
    kind: 'foundational',
    scope: 'webkit',
    enforce: [
      { surface: 'ci', by: 'commitlint' },
      { surface: 'ci', by: 'check-api-diff' }
    ],
    note: 'commitlint checks every commit and, on pull requests, the PR title (the squash commit release-please reads); check-api-diff fails a breaking public API change whose PR title has no "!" before the colon.'
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
      { surface: 'ci', by: 'check-api-diff' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: 'Activation events emit (event, item?). check-api-diff fails a changed or removed event payload that is not marked breaking and migrated. The spec Events table states the payload and spec⇄code compliance pins the emit set to it; the (event-first, no-duplication) shape itself is confirmed in review.'
  },
  {
    id: 'slots',
    kind: 'construction',
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'validate-authoring' },
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'lint', by: 'authoring-standards' },
      { surface: 'lint', by: 'no-dropped-children' }
    ]
  },
  {
    id: 'composables',
    kind: 'construction',
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'validate-authoring' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'lint', by: 'authoring-standards' },
      { surface: 'lint', by: 'composable-readonly-return' },
      { surface: 'lint', by: 'composable-scope-cleanup' }
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
      { surface: 'lint', by: 'accessible-name' },
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
      { surface: 'lint', by: 'authoring-standards' },
      { surface: 'ci', by: 'check-api-diff' }
    ],
    note: 'check-api-diff diffs the public API of the base catalog.json with head: a removal or rename is breaking and needs "!" in the PR title plus a migration (a src/cli/migrations/ codemod entry or a new MIGRATION-v<N>.md line naming the component).'
  },
  {
    id: 'bundle-budget',
    kind: 'construction',
    scope: 'webkit',
    enforce: [
      { surface: 'ci', by: 'size-limit' },
      { surface: 'ci', by: 'check-complete' },
      { surface: 'ci', by: 'check-size-ratchet' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: 'Budget of record lives in packages/webkit/.size-limit.json. scripts/check-size.mjs is the vue-aware gate: it compiles each budgeted entry with Vite + @vitejs/plugin-vue (vue externalized, minified) and fails the governance build job when the gzipped output exceeds its budget. scripts/check-complete.mjs fails a root component with no budget entry (current debt in complete-baseline.json, which only shrinks); scripts/check-size-ratchet.mjs fails a PR that raises a limit against its merge base unless the PR body has a Budget-raise: line.'
  },
  {
    id: 'testing',
    kind: 'construction',
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'enforce-test-exists' },
      { surface: 'write-time', by: 'validate-references' },
      { surface: 'ci', by: 'check-tests' },
      { surface: 'ci', by: 'check-complete' },
      { surface: 'ci', by: 'vitest' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: 'Every component ships a co-located <name>.test.ts — you cannot create or land a component without its test. enforce-test-exists blocks a component .vue write/edit whose <name>.test.ts is missing; check-tests fails CI when any component lacks a test (existence — never grandfathered); the sharded Vitest browser CI job (Playwright Chromium, the component mounted with its examples as fixtures, axe-core on the tree) runs the suite; validate-references blocks a test with unresolved imports (incl. a mistaken @stories alias); package.json#files + pack:check keep tests out of the published tarball. Review confirms the behavioral surface is actually covered and that a behavior change updates the test (style-only changes need no test touch — deliberately no diff-freshness gate). check-complete fails a component whose example group (the test fixtures) is missing or ships fewer examples than its spec lists, or whose first example has no visual baseline, ratcheted by complete-baseline.json.'
  },
  {
    id: 'comments',
    kind: 'construction',
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'validate-authoring' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'lint', by: 'authoring-standards' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: 'Implementation code carries no prose comments: only component API JSDoc (props, emits, slots, models, exposed members, exported types), tool directives, @deprecated and .js JSDoc type tags. prose-comment in the shared authoring-checks engine (comment-scan.js), one key per comment, scoped to every non-test source under packages/.'
  },
  {
    id: 'example-data',
    kind: 'construction',
    scope: 'general',
    enforce: [
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: 'Sample data uses example.com/.org/.net (RFC 2606), Acme as the one sample company, fictional US-format people, phones and addresses, and no national ID formats or masks. example-data:domain, :regional-format and :invented-brand in the check-authoring ratchet (src/eslint-plugin/example-data.js) over src, blocks, examples, skills and rules; defaults and preselected options are held in review.'
  },
  {
    id: 'authoring-docs',
    kind: 'foundational',
    scope: 'webkit',
    enforce: [
      { surface: 'write-time', by: 'validate-authoring-docs' },
      { surface: 'ci', by: 'check-authoring-docs' }
    ],
    note: 'Skills (.claude/skills + skills/) and agents (.claude/agents + adapters/claude/agents) carry conforming frontmatter (name==folder/filename, non-empty description, scope matching location; consumer skills webkit-* + status + last_updated) and no file-as-example refs. validate-authoring-docs blocks a new/edited doc write-time (exit 2); check-authoring-docs is the CI ratchet over all four populations; both share _lib/authoring-docs-checks.mjs. scope=webkit: the standard about how the authoring/adoption bundle is shaped is DS-internal, even though the consumer skills it validates ship out.'
  }
]

export const STANDARDS_BY_ID = Object.fromEntries(STANDARDS.map((s) => [s.id, s]))

/** Standards a consuming project should adopt — they ship out (guideline + eslint-plugin). */
export const GENERAL_STANDARDS = STANDARDS.filter((s) => s.scope === 'general')
/** Standards specific to authoring the webkit design system itself. */
export const WEBKIT_STANDARDS = STANDARDS.filter((s) => s.scope === 'webkit')
