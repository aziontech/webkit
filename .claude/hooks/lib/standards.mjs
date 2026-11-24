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
    note: 'The spec is the contract: enforce-spec-exists blocks a component Write whose spec is missing, not approved, locked or edited after approval; check-spec-integrity runs the same lib/spec-integrity engine over every .specs/*.md in CI (approved or beyond, a shipped component stays implemented, body checksum matches).'
  },
  {
    id: 'prop-vocabulary',
    kind: 'foundational',
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'write-time', by: 'validate-naming' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'ci', by: 'check-naming' },
      { surface: 'lint', by: 'prefer-href-in-menu-node' },
      { surface: 'lint', by: 'no-deprecated-name' }
    ],
    note: 'One machine source, lib/prop-vocabulary.mjs: its `aliases` block today in validate-spec-compliance and the check-authoring ratchet; its `staged` aliases, values, slots, event words and data attributes (the 6.0 standard) are reported by check-naming and validate-naming and block once NAMING_STAGED_BLOCKS flips. no-deprecated-name flags the renamed props on WebKit tags in consumer code from v6-props.json.'
  },
  {
    id: 'naming',
    kind: 'foundational',
    scope: 'webkit',
    enforce: [
      { surface: 'write-time', by: 'validate-naming' },
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'ci', by: 'check-naming' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'ci', by: 'check-spelling' },
      { surface: 'lint', by: 'no-deprecated-name' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: 'check-spelling (typos, root pnpm check:spelling, _typos.toml lists each accepted word with its reason) keeps every name and doc whole English words. One engine, packages/webkit/scripts/lib/naming-rules.mjs (RULES registry, one id per checkable rule of decisions N1-N18): check-naming runs it in CI (gate `naming`, toolkit job) and validate-naming write-time on the file a write produces (only added violations block). Enforced rules (export-kebab, block-id, export-synonym, export-retired) block now; staged rules are reported until the rename lanes merge, then NAMING_STAGED_BLOCKS flips. no-deprecated-name carries the old→new maps (src/cli/migrations/v6*.json, the ones webkit migrate applies) to consumer code. What a machine cannot decide is listed review-only in naming.md.'
  },
  {
    id: 'imports',
    kind: 'foundational',
    scope: 'webkit',
    enforce: [
      { surface: 'write-time', by: 'validate-references' },
      { surface: 'lint', by: 'no-unknown-import' },
      { surface: 'lint', by: 'no-barrel-import' },
      { surface: 'lint', by: 'no-deep-internal-import' },
      { surface: 'lint', by: 'prefer-tree-shakeable-root' },
      { surface: 'lint', by: 'no-whole-icon-set-import' },
      { surface: 'lint', by: 'no-root-relative-asset' },
      { surface: 'ci', by: 'check-package-lint' }
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
    note: 'component-scaffolder emits the compound + -root; check-complete fails a compound whose index.ts export has no ./<name>-root pointing at the root .vue (ratcheted by complete-baseline.json); catalog drift check + review confirm.'
  },
  {
    id: 'styling',
    kind: 'foundational',
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'validate-tokens' },
      { surface: 'write-time', by: 'validate-authoring' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'lint', by: 'no-hardcoded-color' },
      { surface: 'lint', by: 'no-hardcoded-motion' },
      { surface: 'lint', by: 'no-style-override' },
      { surface: 'lint', by: 'no-physical-direction' },
      { surface: 'lint', by: 'require-container-width' },
      { surface: 'lint', by: 'no-wrapped-page-chrome' },
      { surface: 'lint', by: 'no-gap-after-closing-section' },
      { surface: 'lint', by: 'no-viewport-height-calc' },
      { surface: 'lint', by: 'no-output-in-command' },
      { surface: 'lint', by: 'no-link-in-sentence' },
      { surface: 'lint', by: 'consistent-header-action-size' },
      { surface: 'ci', by: 'visual' }
    ],
    note: 'The ratchet runs the same token-checks engine repo-wide, so an editor push cannot bypass the hook; consumers get the color/motion/override lints. Never double a line is a rendered property no static check can see: the visual job runs apps/visual/tests/doubled-lines.spec.ts (the findDoubledLines detector, once per page in the browser) over every first example, every block primary state and the docs home and foundation pages, and fails on any two visible borders flush or 1px apart. Never stack regions flush is gated the same way: apps/visual/tests/region-gaps.spec.ts (findTightRegions) fails when two consecutive page regions (a surface over a surface or a heading, outside any card, overlay, list item or article) sit closer than --layout-group-gap. A texture is a backdrop for text only: the texture-backdrop engine (validate-authoring at write time, check-authoring in CI) blocks a chart, diagram, map or stat placed on a Texture or in a slot a section paints a texture under, in a .vue or page JSON; Texture hides itself when the content beside it holds a [data-plain-ground]; and apps/visual/tests/texture-backdrop.spec.ts (findGraphicsOnTexture) fails when a painted texture lies under a graphic.'
  },
  {
    id: 'dependencies',
    kind: 'foundational',
    scope: 'webkit',
    enforce: [
      { surface: 'write-time', by: 'validate-references' },
      { surface: 'ci', by: 'type-check' },
      { surface: 'ci', by: 'check-unused' }
    ],
    note: 'Forbidden libs are never installed — any import of one fails vue-tsc/build in CI, so an editor push cannot bypass the hook. check-unused (knip, root pnpm check:unused, knip.json) fails an unused dependency, file or export, with no baseline.'
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
      { surface: 'ci', by: 'branch-protection' },
      { surface: 'ci', by: 'check-workflows' }
    ],
    note: 'Base branch + required checks enforced by branch protection; commit shape by commitlint; check-workflows (actionlint and zizmor, root pnpm check:workflows) fails a workflow error, an unpinned action or a missing least-privilege permission.'
  },

  // ── Construction ──
  {
    id: 'component-structure',
    kind: 'construction',
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'validate-spec-compliance' },
      { surface: 'review', by: 'required-approval' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'ci', by: 'check-maintainability' },
      { surface: 'ci', by: 'check-duplication' }
    ],
    note: 'Folder layout + defineOptions blocked by spec-compliance; <script setup> section order confirmed in review. check-maintainability fails a file, script block, function, line, prop or model count over the CODE_QUALITY.md 3.1 limits, so a component is split by feature into composables/, parts/ and lib/; check-duplication (jscpd) fails code copied between components or inside a block. Both run with no baseline.'
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
      { surface: 'ci', by: 'check-assertions' },
      { surface: 'lint', by: 'require-authoring-standards' }
    ],
    note: 'check-assertions fails any `as never` or `as unknown as` in src, blocks and examples (the one allowed form is `undefined as never` as the default of an unbound defineModel, decision CQ-E7), and caps the count of other type assertions in src.'
  },
  {
    id: 'v-model',
    kind: 'construction',
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'validate-authoring' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'lint', by: 'prefer-define-model' },
      { surface: 'lint', by: 'require-authoring-standards' }
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
      { surface: 'lint', by: 'require-authoring-standards' }
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
      { surface: 'lint', by: 'require-authoring-standards' },
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
      { surface: 'lint', by: 'require-authoring-standards' },
      { surface: 'lint', by: 'require-readonly-composable-return' },
      { surface: 'lint', by: 'require-composable-scope-cleanup' }
    ]
  },
  {
    id: 'root-element',
    kind: 'construction',
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'validate-tokens' },
      { surface: 'write-time', by: 'validate-references' },
      { surface: 'write-time', by: 'validate-authoring' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'lint', by: 'no-polymorphic-as-prop' },
      { surface: 'lint', by: 'no-unowned-element' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: '`class` in defineProps, phantom asChild imports and `as`/`asChild` props are blocked automatically (write-time AND the CI ratchet); defineExpose confirmed in review. no-unowned-element (lint:quality, and the consumer strict preset) fails a native element or ARIA role written outside the component that owns it in src/eslint-plugin/owners.json (each owner with its reason, no exception list): a raw button belongs to Button, a raw anchor to Link.'
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
      { surface: 'ci', by: 'vitest' },
      { surface: 'ci', by: 'docs-smoke' },
      { surface: 'lint', by: 'require-accessible-name' },
      { surface: 'lint', by: 'prefer-hint' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: 'Static a11y via eslint-plugin-vuejs-accessibility, the full recommended set at error with no baseline (lint:quality); prefer-hint (lint:quality over components, blocks and examples, check:blocks, and both consumer presets) fails hand-made help: a typed question mark or an info icon inside a Tooltip or Popover trigger, a Tooltip over 80 characters and a Hint over 280; axe in every component test and over every block and example (vitest); axe in light and dark over the built docs site (docs-smoke, pnpm test:docs:smoke in the site job); focus and keyboard behaviour confirmed in review.'
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
      { surface: 'lint', by: 'require-authoring-standards' },
      { surface: 'ci', by: 'check-api-diff' }
    ],
    note: 'check-api-diff diffs the public API of the base catalog.json with head: a removal or rename is breaking and needs "!" in the PR title plus a migration (a src/cli/migrations/ codemod entry or a new MIGRATION_V<N>.md line naming the component). 6.0 is the clean-break major: old names were removed outright (MIGRATION_V6.md + webkit migrate); the mark, one major, remove lifecycle applies from 6.0 on, and from GA on: a part with stability: preview is exempt from the breaking marker and the migration, and a GA → preview change fails.'
  },
  {
    id: 'bundle-budget',
    kind: 'construction',
    scope: 'webkit',
    enforce: [
      { surface: 'ci', by: 'size-limit' },
      { surface: 'ci', by: 'check-complete' },
      { surface: 'ci', by: 'check-size-ratchet' },
      { surface: 'ci', by: 'package-size' },
      { surface: 'review', by: 'required-approval' }
    ],
    note: 'Budget of record lives in packages/webkit/.size-limit.json. scripts/check-size.mjs is the vue-aware gate: it compiles each budgeted entry with Vite + @vitejs/plugin-vue (vue externalized, minified) and fails the governance build job when the gzipped output exceeds its budget. scripts/check-complete.mjs fails a root component with no budget entry (current debt in complete-baseline.json, which only shrinks); scripts/check-size-ratchet.mjs fails a PR that raises a limit against its merge base unless the PR body has a Budget-raise: line. scripts/check-css-size.mjs (same size gate) builds fixture apps wired the way webkit init wires them (the @aziontech/webkit/vite-plugin scan) and fails when their gzipped CSS exceeds packages/webkit/.size-limit-css.json. test/standards/package-size.test.mjs (toolkit tests) fails when the npm package itself (npm pack --dry-run, generated folders excluded) or an asset folder outgrows packages/webkit/scripts/package-size-budget.json, or when it ships a dev-only file.'
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
    note: 'Every component ships a co-located <name>.test.ts — you cannot create or land a component without its test. enforce-test-exists blocks a component .vue write/edit whose <name>.test.ts is missing; check-tests fails CI when any component lacks a test (existence — never grandfathered); the sharded Vitest browser CI job (Playwright Chromium, the component mounted with its examples as fixtures, axe-core on the tree) runs the suite; validate-references blocks a test with unresolved imports (incl. a mistaken alias); package.json#files + check:pack keep tests out of the published tarball. Review confirms the behavioral surface is actually covered and that a behavior change updates the test (style-only changes need no test touch — deliberately no diff-freshness gate). check-complete fails a component whose example group (the test fixtures) is missing or ships fewer examples than its spec lists, or whose first example has no visual baseline, ratcheted by complete-baseline.json.'
  },
  {
    id: 'comments',
    kind: 'construction',
    scope: 'general',
    enforce: [
      { surface: 'write-time', by: 'validate-authoring' },
      { surface: 'ci', by: 'check-authoring' },
      { surface: 'lint', by: 'require-authoring-standards' },
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
    note: 'Sample data uses example.com/.org/.net (RFC 2606), Acme as the one sample company, fictional US-format people, phones and addresses, and no national ID formats or masks. example-data:domain, :regional-format and :invented-brand in the check-authoring ratchet (src/eslint-plugin/lib/example-data.js) over src, blocks, examples, skills and rules; defaults and preselected options are held in review.'
  },
  {
    id: 'authoring-docs',
    kind: 'foundational',
    scope: 'webkit',
    enforce: [
      { surface: 'write-time', by: 'validate-authoring-docs' },
      { surface: 'ci', by: 'check-authoring-docs' },
      { surface: 'ci', by: 'check-docs-markdown' },
      { surface: 'ci', by: 'visual' }
    ],
    note: "Rendered docs (rules, foundation skills, block guidelines, specs) label every example pair Do / Don't, colour its icons with --success-mark / --danger-mark, carry no task list and print no HTML comment: check-docs-markdown + apps/docs/test/content.test.ts (toolkit job) and the visual do-dont spec (contrast, light and dark). Skills (.claude/skills + skills/) and agents (.claude/agents + adapters/claude/agents) carry conforming frontmatter (name==folder/filename, non-empty description, scope matching location; consumer skills webkit-* + status + last_updated) and no file-as-example refs. validate-authoring-docs blocks a new/edited doc write-time (exit 2); check-authoring-docs is the CI ratchet over all four populations; both share lib/authoring-docs-checks.mjs. scope=webkit: the standard about how the authoring/adoption bundle is shaped is DS-internal, even though the consumer skills it validates ship out."
  }
]

export const STANDARDS_BY_ID = Object.fromEntries(STANDARDS.map((s) => [s.id, s]))
