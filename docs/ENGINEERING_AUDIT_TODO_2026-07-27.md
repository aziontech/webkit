# Webkit Monorepo — Engineering Checkup: Open Items

| | |
|---|---|
| **Source** | [`ENGINEERING_AUDIT_dev_2026-06-24.md`](./ENGINEERING_AUDIT_dev_2026-06-24.md) — full audit, history and everything already ✅ |
| **Extracted** | 2026-07-27 |
| **Verified** | every item below re-verified against the tree (`main`) on 2026-07-27 — statuses here supersede the source where they differ |
| **Legend** | severity + §-refs follow the source audit · ➕ = found after the source's last pass, not yet recorded there |

---

## Do now (correctness, low effort)

1. ➕ **Merge Release PR [#810](https://github.com/aziontech/webkit/pull/810)** (webkit 4.2.2 / theme 4.2.1). The pending release cut carrying the retrofitted #804 changes (`@aziontech/theme/animations` imports, `vue-tsc`→devDeps) — #804's `[NO-ISSUE]`-prefixed squash title was unparseable by release-please and released nothing; the commitlint guard (#809) and the `BEGIN_COMMIT_OVERRIDE` retrofit are already merged. #811 (CHANGELOG prettier exemption) is merged; #810 goes green once release-please rebuilds it on the next `main` push.

2. 🟠 **Theme-dep freshness** *(§2, §5)* — webkit's `"@aziontech/theme": "^4.0.0"` resolves from the **registry, lockfile-pinned at 4.0.0**, while the workspace theme is 4.2.0 (only storybook links `workspace:*`). Webkit dev/tests build against a stale theme until someone bumps. Decide the policy: bump the range (+ lockfile) per theme release — natural moment: right after #810 ships 4.2.1 — or use `workspace:^` **plus** a publish step that rewrites it (raw `npm publish` in `package-webkit.yml` does not; that's the §2 `workspace:*` trap returning).

## Next (coverage)

3. 🟠 **Quality gates for theme / icons / apps** *(§3)* — a theme- or icons-only PR still runs **only** visual regression before its publish workflow: no lint, no type-check, no unit tests for either package. icons-gallery's lint is `--fix`-only (mutates, doesn't gate); storybook has no lint/type-check; the `.mjs` build scripts sit outside every eslint glob; `lint-staged` globs remain webkit-only (`packages/webkit/**/*.{js,ts,vue}`, root `package.json:86`).

4. 🟠 **Explain the CI stylelint false negative** *(§6)* — CI's stylelint step silently passed a violation (`textarea.vue:68`) that the identical local command caught (same pinned stylelint 17.14.0, suspiciously fast 1.6s run). Mechanism still unidentified. Until explained, treat local `pnpm governance` as the authoritative stylelint gate.

5. 🔴◐ **Governance teeth outside Claude Code** *(§6, tracked as [#806](https://github.com/aziontech/webkit/issues/806))* — wire `storybook:validate-docs` into `governance.yml` (the root script exists at `package.json:30`; still zero references in CI), and give `validate-spec-compliance` / `validate-tokens` / `validate-references` batch modes runnable in CI/pre-commit — or stop advertising them as governance for humans. A human editing a `.vue` in VS Code still bypasses spec/token/reference checks; `.husky/pre-commit` is still just `lint-staged`.

6. 🟡 **Specs for `segmented-button` and `overline`** *(§6)* — both still exported without a spec (79 specs total; these are the last two gaps).

## Then (architecture, larger)

7. 🔴/🟠 **Resolve the styling contradiction** *(§4)* — `legacy-components.json` is still `[]` while the violation surface (re-verified 2026-07-27) is: **10 component files** with the forbidden `kindClasses`/`sizeClasses`/`sharedClasses` trio (button, icon-button, avatar, radio-button + the six `field-*` block/inline wrappers), **~73 files** with named `*Classes` consts, and **14 `presets/` directories** — several in *post-rule* families (navigation-menu, drawer, dialog, tab-view compose via preset class-builders). Three exits, pick one: migrate the offenders, seed the whitelist, or amend `styling.md` to bless preset modules. Until then the docs and the code disagree package-wide.

8. 🟠 **Back-migrate the 7 pre-rule families onto the compound API** *(§4)* — dialog, drawer, panel, tab-view, navigation-menu, global-header, breadcrumb still expose flat per-sub-component exports with no compound `index.ts` root (13 families are already on the convention).

9. 🟡 **Extract `useField()`** *(§4)* — the `field-*` wrappers (now ~12: text, textarea, password, phone-number, text-switch, input-group, checkbox ×2, radio ×2, switch ×2) still duplicate ~90% of their script wiring id/testid/label per file. `src/composables/` still holds only `use-controllable`, `use-focus-trap`, `use-placement`.

10. 🟡 **Panel focus-trap** *(§4)* — `panel-content` still doesn't trap focus while dialog/drawer do; unify the overlay policy.

## Hygiene / low

11. 🟠 **`@popperjs/core` still in the tree** *(§1)* — via `icons-gallery → vue3-colorpicker` (dev-app only; webkit imports no positioning lib). While present, a hand-written `import '@popperjs/core'` resolves, weakening `dependencies.md`'s "never installed" backstop. Replace/remove `vue3-colorpicker` or accept and document.

12. 🟡 **Bound the remaining open-ended `>=` overrides** *(§1)* — largely mitigated post-audit: #801 (2026-07-25) pruned `pnpm-workspace.yaml#overrides` to a minimal 5-entry set, each with a written rationale (`brace-expansion`, `minimatch`, `uuid`, `@babel/core` bounded `<8`, `@hono/node-server`). Residual: the other four floors are still unbounded `>=`; drop `@hono/node-server` when the MCP SDK moves to `^2`. Do **not** re-add an `ip-address` pin (v10 breaks `ip-cidr@4`).

13. 🟡 **Version drift across the workspace** *(§2, re-verified 2026-07-27 — shape changed)* — `tailwindcss` is now a **cross-major** split: root `^3.4.19` / icons-gallery `^3.4.4` / storybook **`^4.0.0`**; `eslint` root `^9.39.3` vs icons-gallery `^9.18.0`; root `eslint-plugin-vue: "^9"` still bare-major. (`primevue` is fully gone from the workspace — that part of the item is resolved.)

14. ⚪ **Root `dependencies` that are dev tools** *(§2)* — `pnpm`, `primeflex`, `tailwindcss`, `autoprefixer`, `vue`, `@tailwindcss/typography` still sit in the root `dependencies` block; move to `devDependencies`.

15. ✅ **Adopt the `globals` package in `eslint.config.js`** *(§3)* — **fixed 2026-07-29**, PR [#823](https://github.com/aziontech/webkit/pull/823). The 38-entry hand-maintained allowlist replaced by `...globals.browser, ...globals.node` (`globals@17.8.0`, new root devDependency) — covers every previously-listed global plus the five missing ones (`MutationObserver` / `getComputedStyle` / `matchMedia` / `AbortController` / `structuredClone`). The redundant `Promise`/`Symbol`/`Reflect` trio dropped (flat config auto-enables ES built-ins per `ecmaVersion`, proven by `JSON`/`Math` never having been listed). Validated: `webkit:lint` clean tree-wide, canaries 56/56.

16. ✅ **Three eslint smells** *(§3)* — **all three fixed 2026-07-29**, PR [#823](https://github.com/aziontech/webkit/pull/823). `eslint-plugin-unused-imports` now actually enabled in the canonical setup (`unused-imports/no-unused-imports: error` + `unused-imports/no-unused-vars` with the `^_` ignore patterns; `@typescript-eslint/no-unused-vars` off to avoid double reports) — verified live: it flags unused `var`/`let`/`const` injected into a component. The `no-unused-vars: 'off'` residue comment (`// 'error'`) removed — the off is now the deliberate half of that pairing. The commented-out `vue/no-reserved-component-names` block replaced by the rule enabled tuned (`htmlElementCaseSensitive: true` + both `disallow*BuiltInComponents: true` — the only mode compatible with the DS's PascalCase roots `Table`/`Button`/`Link`). Residue: the `.mjs`-outside-every-glob hole stays with item 3, not duplicated here.

17. ✅ **Purge dangling `.releaserc` mentions** *(§6 follow-up; tracked as [#818](https://github.com/aziontech/webkit/issues/818))* — **all six files fixed 2026-07-28** (five sit in the working tree, uncommitted; `GOVERNANCE_IMPLEMENTATION.md` went via the item-18 refresh, PR [#820](https://github.com/aziontech/webkit/pull/820)). The d.ts-at-publish claims (`compound-api.md`, `component-scaffold/SKILL.md`, `COMPONENT_REQUIREMENTS.md` ×2, `STYLEGUIDE.md:497`) now name the **publish workflows** (`package-webkit.yml` runs `vue-tsc --declaration --emitDeclarationOnly` right before `npm publish`, on release-please's `release: published`). `docs/OVERVIEW_LINT.md` §6 was rewritten for release-please: squash-merged PR title = the parsed commit; the leading-ticket example corrected to the after-the-colon form (the #804 trap — the old example showed the now-rejected form); the type table de-`hotfix`ed (`feat`→minor, `fix`→patch, everything else→none); the sync invariant now names `release-please-config.json` instead of `packages/*/.releaserc`. Acceptance grep is clean — only `release-types.md`'s deliberate don't-do-this notes and `GOVERNANCE_IMPLEMENTATION.md`'s one past-tense migration note remain. Close #818 when the sweep PR lands.

18. ✅ **Docs-drift residue** *(§6, changed since the audit; tracked as [#819](https://github.com/aziontech/webkit/issues/819))* — `GOVERNANCE_NEXT_STEPS.md` is gone (resolved by deletion; nothing to do). `packages/webkit/docs/GOVERNANCE_IMPLEMENTATION.md` (resurrected by #768 after #741 deleted it; ships to npm via `files: docs`) was **refreshed 2026-07-28** rather than deleted: the `.releaserc` claim replaced with the publish-workflow mechanism, CI section rewritten for the current 12-job pipeline (`main`-only triggers, plain `pnpm audit`, sharded tests/visual, lint-canary/smoke), scripts/hooks/config locations brought current. Refresh sits in the working tree — lands with the next PR; close #819 when it merges.

19. ⚪ ➕ **Optional: lint PR titles in CI** — the squash setting `COMMIT_OR_PR_TITLE` means multi-commit PRs use the hand-typed title as the release-visible commit, and nothing lints it (the commitlint hook only sees local commits). A tiny title-check job closes the last parseability hole the #804 incident exposed.

20. ⚪ ➕ **Refresh the source audit** — it lags the repo by ~2 days: §1/§2's override counts predate #801's prune; §6 has no entry for the #804 → #809/#810 release-parseability incident; the scoreboard says "governance teeth — not re-swept" though §6 re-checked it (and its High-row arithmetic doesn't reconcile); the "order of attack" numbering skips 2.
