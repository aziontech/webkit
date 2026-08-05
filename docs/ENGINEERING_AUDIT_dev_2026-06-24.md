# Webkit Monorepo — Architecture & Engineering Checkup

| | |
|---|---|
| **Repository** | `@aziontech/design-system` (webkit monorepo) |
| **Branch** | `dev` |
| **Date** | 2026-06-24 |
| **Re-audit** | **2026-07-16** (`dev` @ `3c1fbc71`) — every finding below re-verified against the tree; status notes added inline. Legend: ✅ resolved · ◐ partial · ⏳ still open · ➕ new since 2026-06-24 |
| **Re-check** | **2026-07-26** (`main` @ `cafed5a8`) — third pass, after the release-please migration (#798) and the 4.2.x releases. Items re-verified this pass carry an inline `→ Re-check 2026-07-26` note; items without one were not re-swept. |
| **Scope** | 3 packages (`webkit`, `theme`, `icons`) + 3 apps (`storybook`, `icons-gallery`, `fonts`), all tooling configs, CI/CD, release automation, the `.claude` governance system, and the full dependency tree (1,535 deps) |

**Bottom line (2026-06-24):** The *shipped component code* is largely clean (no `v-html`, no forbidden positioning/animation libs imported, no `any`/`@ts-ignore`, exports resolve 100%). The problems are concentrated in **(1) packaging correctness, (2) quality-gate coverage, and (3) the gap between documented governance and what actually runs.** Several "enforcement" mechanisms are silently no-ops.

**Re-audit bottom line (2026-07-16):** Three of the five criticals are closed — the `webkit.dev` publish foot-gun died with the package rename (`@aziontech/webkit@4.0.0`, releases from `main`, the disabled dev-publish workflow deleted), `vue` is now a real peer dependency, and the dead governance hook was fixed. CI grew from three webkit-scoped checks into an **11-job `governance.yml`** (security audit + SHA-pinned TruffleHog + depcheck, lint-canary, type-coverage, bundle-size gate, pack-leak check, 4-shard real-browser test suite, test-existence gate, visual regression) plus an OpenSSF Scorecard workflow (`ossf.yml`) — and `pnpm audit` is now **clean at every severity**. Still open: the theme v4 / `@keyframes` gaps, the `--ext .js,.js,.vue` lint bug, theme/icons' zero quality gates, `vue-tsc` shipping as a runtime dep, and the styling-rule contradiction (3 `kindClasses` files + ~13 `*Classes` arrays vs. a still-empty whitelist). **➕ One new critical:** webkit now depends on `@aziontech/theme: workspace:*` (`package.json:47`) but `.releaserc:55` publishes with raw `npm publish`, which does **not** rewrite the workspace protocol — the first 4.0.0 release as wired would ship an **uninstallable tarball**.

**Re-check bottom line (2026-07-26):** The release machinery was replaced wholesale — **#798 dropped semantic-release for release-please** (Release-PR model: `release-please-config.json` + `release-please.yml` → per-package tags/GitHub Releases → `package-*.yml` publish workflows) and deleted all three `.releaserc` files, so every `.releaserc`-anchored claim below is superseded. That migration plus the switch to a plain `"@aziontech/theme": "^4.0.0"` range **closes the ➕ `workspace:*` critical** — webkit 4.2.1 and theme 4.2.0 already shipped through the new path (#796/#797). The **theme-v4 critical is also closed**, in the "finish v4" direction: v3 was deleted outright and `dist/v4/globals.css` now carries 14 `@keyframes`, a dark-scheme block and ~208 `--color-*` tokens. Two new items take their place: **(1)** webkit now resolves theme from the **registry, locked at 4.0.0**, while the workspace is at 4.2.0 — the §5 workspace-link fix regressed; **(2)** the release-types four-way invariant is **broken** — `release-types.md` still points at the deleted `.releaserc` files, and stock release-please only bumps for `feat`/`fix`/`BREAKING`, so the documented `chore`/`docs`/`style`/`refactor`/`perf`/`hotfix` → patch mapping no longer happens. Still open: `storybook:validate-docs` unwired — and the styling contradiction, which this pass found **understated** (14 `presets/` dirs, ~73 named-`*Classes` files, whitelist still `[]`). Fixed **later the same day** (see §2–§6): the `--ext .js,.js,.vue` lint bug, the `lts/*` float, the CI≠`governance` drift (which also exposed CI's stylelint step as a silent false negative), missing `concurrency:`, the 7 deep-relative `theme/src` imports, `vue-tsc`-as-runtime-dep (webkit + theme), and the release-types divergence (all four surfaces rewritten for release-please's real semantics). The "releases never rebuild tokens" item turned out **already solved** by theme's `prepack`.

> Every Critical/High claim was verified directly against the files on 2026-06-24, and re-verified the same way on 2026-07-16 (five targeted read-only sweeps over package manifests, workflows, hooks, theme build, and component sources). A third read-only pass on 2026-07-26 covered release wiring, package manifests, workflows, theme build/dist, and the component styling/import surface — items it touched carry a `Re-check` note.

## Severity scoreboard

| Sev | 2026-06-24 | Status 2026-07-16 | Status 2026-07-26 |
|---|---|---|---|
| 🔴 Critical | 5 | **3 ✅** (publish wiring · vue peer · dead hook) · **1 ◐** (governance teeth — test/toolkit/lint-canary gates now in CI; spec/token/reference hooks still Claude-only) · **1 ⏳** (theme v4) · **➕1 new** (`workspace:*` not rewritten by `npm publish`) | **5 ✅** (+ theme v4 · + `workspace:*` via release-please & `^4.0.0`) · **1 ◐** (governance teeth — not re-swept) |
| 🟠 High | 9 | **3 ✅** (override consolidation · tar floor · trufflehog pin) · **2 ◐** (styling violations ~20→~16 · workflow permissions fixed, `concurrency:` still absent) · **4 ⏳** (lint skips `.ts` · theme/icons gates · `lts/*` float · theme release never rebuilds tokens) | **3 ✅** · **6 ✅ fixed same-day** (lint `.ts` · Node pin · CI≡`governance` · `concurrency:` everywhere · deep theme imports · vue-tsc→devDeps) · **1 ✅ was already solved** (release rebuild via theme `prepack`) · **2 ◐** (styling — surface *larger* than the re-audit counted · theme/icons — visual job now triggers on them) · **➕1 new → ✅ fixed same-day** (release-types invariant broken by #798; four surfaces rewritten for release-please) |
| 🟡 Medium | ~12 | **~5 ✅** (audit gate · webkit→theme workspace link · primevue-at-root · stale `.d.ts` · docs-drift cleanup) · rest ⏳ | workspace link **⚠️ regressed** (registry 4.0.0 vs workspace 4.2.0) · keyframes-in-dist ✅ · rest not re-swept |
| ⚪ Low | ~15 | mostly unchanged | not re-swept |

---

## 1. Security & supply chain

**`pnpm audit` (2026-06-24): 0 critical, 0 high, 2 moderate, 2 low** — all four in build/dev tooling, not shipped runtime:

| Package | Sev | CVE | Path | Fix |
|---|---|---|---|---|
| `tar@7.5.13` | moderate | CVE-2026-53655 (tar smuggling) | `icons → fantasticon → ttf2woff2 → node-gyp → tar` | ≥7.5.16 |
| `js-yaml@4.1.1` | moderate | CVE-2026-53550 (ReDoS/DoS) | `@commitlint/cli → cosmiconfig → js-yaml` | ≥4.2.0 |
| `elliptic@6.6.1` | low | CVE-2025-14505 | `icons-gallery → azion → … → elliptic` | none available |
| `@babel/core@7.29.0` | low | CVE-2026-49356 (arbitrary file read) | `icons-gallery → azion → …` | ≥7.29.6 |

→ **Re-audit: ✅ all four cleared.** `pnpm audit` at the root now reports **"No known vulnerabilities found"**. The `tar` floor was raised (resolves 7.5.19); the `elliptic`/`@babel/core` chain died when the `azion` v3 lib was removed from icons-gallery (#725, 2026-07-07); the remaining advisories were resolved and the gate strengthened in #722.

🟡 **The audit gate can't catch any of these.** `security:audit` = `pnpm audit --audit-level=high` (`package.json:37`), so the two **moderate** CVEs pass CI silently. And it runs only in `packages/webkit`.
→ **Re-audit: ✅ resolved.** `security:audit` moved to the **root** and is now plain `pnpm audit` — the whole workspace, failing on **any** severity — and runs in the `security` job of `governance.yml` (alongside TruffleHog and depcheck).

🟠 **The `tar` override is set *below* the patched version** (`>=7.5.11`, lockfile resolved 7.5.13).
→ **Re-audit: ✅ resolved.** Override is `>=7.5.16` (`pnpm-workspace.yaml:18`); lockfile resolves **7.5.19**.

🟠 **Unpinned third-party action** `trufflesecurity/trufflehog@main`.
→ **Re-audit: ✅ resolved.** Pinned to a full SHA (`governance.yml:95` — `trufflehog@8feb77b…# main`). Action versions across workflows are now Dependabot-managed (#742–#746), and a new **`ossf.yml` OpenSSF Scorecard** workflow watches the posture.

🟢 **Verified NOT a compromise:** the lockfile's `lodash@4.18.1`, `uuid@14.0.0`, `ip-address@10.1.1` genuinely exist on public npm; integrity hashes match. No typosquat. *(Unchanged.)*

🟡 **Override *philosophy* invites risk: open-ended `>=` pins auto-adopt any future publish.**
→ **Re-audit: ◐ partial.** Overrides are consolidated (see §2) and `@babel/core` is now bounded (`>=7.29.1 <8`), but the rest (`lodash`, `uuid`, `tar`, …) remain open-ended `>=`. Note: the `ip-address` pin was deliberately **dropped** — forcing v10 breaks `ip-cidr@4`; don't re-add it.

🟠 **`@popperjs/core@2.11.8` is in the tree** (via `icons-gallery → vue3-colorpicker`), so "the lib is never installed" no longer backs `dependencies.md` enforcement.
→ **Re-audit: ⏳ still present** (same transitive path, dev-app only). Mitigating context: webkit itself imports no positioning lib (re-verified), and `validate-references.mjs` still blocks phantom paths at write time in Claude Code — but the in-tree presence means a hand-written `import '@popperjs/core'` would resolve. Unchanged risk, low blast radius.

---

## 2. Dependencies & versioning

🟠 **Overrides defined in TWO diverging places** (root `package.json#pnpm.overrides` vs `pnpm-workspace.yaml#overrides`).
→ **Re-audit: ✅ resolved.** Root `package.json` no longer has a `pnpm.overrides` block; the single source is `pnpm-workspace.yaml` (~21 entries, including the formerly package.json-only pins `fast-uri`, `ws`, `qs`, `@babel/*` — and the formerly ignored `form-data`, `undici`, `vite`).

🔴 **`@aziontech/webkit` declares no `vue` peer dependency** — no `peerDependencies` block at all.
→ **Re-audit: ✅ resolved.** `peerDependencies` now declares `vue: ^3.5.29`, plus optional `eslint >=9` / `stylelint >=16` / `vue-eslint-parser >=9` for the in-package adoption-toolkit ESLint plugin (#717). (`@aziontech/icons` was not added as a peer — icon fonts remain the consumer's install.)

➕ **NEW 🔴 — the publish flow cannot ship `workspace:*`.** Fixing the theme link (below) introduced `"@aziontech/theme": "workspace:*"` into webkit's runtime `dependencies`, but `.releaserc` publishes via `@semantic-release/exec` → **raw `npm publish --provenance`** (`npmPublish: false` on the npm plugin). `npm` does not understand the workspace protocol and does **not** rewrite it — the published `package.json` would carry `workspace:*` verbatim → uninstallable for every consumer. Fix before the first `main` release: publish with `pnpm publish` (which rewrites `workspace:*` to the real version), or add a rewrite step to `prepareCmd`.
→ **Re-check 2026-07-26: ✅ resolved — differently than prescribed.** The dep is now a plain range (`"@aziontech/theme": "^4.0.0"`, `package.json:49`), #798 replaced semantic-release with **release-please**, and all three `.releaserc` files are gone; webkit **4.2.1** / theme **4.2.0** shipped through the new `package-*.yml` publish workflows (still raw `npm publish --provenance` — safe now that no `workspace:` protocol remains in a publishable manifest, but the trap returns if one is reintroduced). ⚠️ The trade: the lockfile now resolves webkit's theme from the **registry at 4.0.0** while the workspace is at **4.2.0** — see §5.

🟠 **Build tools shipped as runtime `dependencies`:** `vue-tsc` in `dependencies` of both webkit and theme; theme's `tailwindcss` a hard dep instead of a peer.
→ **Re-audit: ⏳ both still open.** `vue-tsc@^3.2.5` sits in `dependencies` of webkit (`package.json:54`) and theme (`package.json:39`); theme's `tailwindcss@^3.4.17` is still a hard `dependency`. ➕ Also new in webkit's runtime deps: `@modelcontextprotocol/sdk` + `zod` (the in-package adoption toolkit/MCP, #717) — deliberate, but worth confirming they shouldn't be `optionalDependencies` for consumers who never run the MCP.
→ **Re-check 2026-07-26: ◐.** `vue-tsc@^3.2.5` is still a runtime dep of webkit (`package.json:56`) and theme (`package.json:35` — now theme's **only** dependency). Theme's `tailwindcss` hard dep is **gone entirely** (resolved by removal). `@modelcontextprotocol/sdk` + `zod` remain runtime deps. → **✅ Fixed 2026-07-26** — `vue-tsc` moved to `devDependencies` in both packages; theme now ships **zero** runtime dependencies. Publish flows unaffected: the `package-*.yml` Build steps and theme's `prepack` all run after `pnpm install --frozen-lockfile` (devDependencies included). MCP SDK + `zod` remain runtime deps (deliberate, per #717).

🟡 **Version drift across the workspace** (tailwindcss ^3.4.19/^3.4.17/^3.3.3/^3.4.4; primevue root 3.47.2 vs storybook 3.35.0; eslint ^9.39.3 vs ^9.18.0; `eslint-plugin-vue: "^9"` bare-major).
→ **Re-audit: ◐ partial.** `primevue` is gone from the root (storybook-only now, 3.35.0 — storybook still uses it for legacy stories). The tailwindcss and eslint drifts persist verbatim, and `eslint-plugin-vue: "^9"` is still a bare major.

⚪ **`pnpm` listed as a project `dependency`** and root runtime deps (`primeflex`, `vue`, `autoprefixer`, `tailwindcss`) not in `devDependencies`.
→ **Re-audit: ⏳ unchanged** (`pnpm`, `primeflex`, `tailwindcss`, `autoprefixer`, `vue`, `@tailwindcss/typography` still in root `dependencies`).

---

## 3. Lints & quality-gate coverage ("all our tools")

🟠 **The webkit lint script doesn't lint TypeScript** — `"lint": "eslint src --ext .js,.js,.vue --max-warnings 0"` (`.js` duplicated, `.ts` omitted), while CI uses `--ext .js,.ts,.vue` → local and CI lint different file sets.
→ **Re-audit: ⏳ still open, verbatim** (`packages/webkit/package.json:21` unchanged; CI at `governance.yml:157` still includes `.ts`). The drift now covers **144** `.ts` files under `src/`. Still a one-line fix. → **Re-check 2026-07-26: ⏳ still verbatim** (now `package.json:20`; CI at `governance.yml:140`). → **✅ Fixed 2026-07-26** — `--ext .js,.ts,.vue` in webkit's `lint`/`lint:fix`, and CI's ESLint step now runs `pnpm run webkit:lint`, so the two sides can no longer drift. Local lint over the 144 `.ts` files passes.

🟠 **theme, icons, and apps have effectively no quality gates.**
→ **Re-audit: ⏳ largely unchanged.** theme: format only; icons: format + an SVG-`validate` script; icons-gallery: still `--fix`-only lint (mutates, doesn't gate); storybook: gained `test:visual*` scripts but no lint/type-check. `governance.yml`'s paths-filter still triggers on `packages/webkit/**` (+ `.specs/**`, `.claude/hooks/**`, `apps/storybook/**` for the toolkit job) — **a theme- or icons-only PR still runs zero checks** before its publish workflow. The `.mjs` build scripts remain outside every eslint glob.
→ **Re-check 2026-07-26: ◐ slightly better.** The `visual` paths-filter now includes `packages/theme/**` and `packages/icons/**`, so a theme/icons-only PR at least runs visual regression — but still no lint/type/unit for either package, and `lint-staged` globs remain webkit-only.

🟠 **Git pre-commit only covers webkit** (`lint-staged` globs `packages/webkit/**`).
→ **Re-audit: ⏳ unchanged** (root `package.json:88–100`).

🟡 **`eslint.config.js` hand-maintains a globals allowlist** instead of using the `globals` package.
→ **Re-audit: ◐ partial.** The list was expanded by hand (now includes `Event`, `KeyboardEvent`, `MouseEvent`, `CustomEvent`, `IntersectionObserver`, `ResizeObserver`, `requestAnimationFrame`, `HTMLInputElement` and friends), so the imminent `no-undef` traps are mostly defused — but it is still a hand-list (`eslint.config.js:24–62`), still missing entries like `MutationObserver`/`getComputedStyle`/`matchMedia`/`AbortController`/`structuredClone`, and the `globals` package is still unused.

⚪ Smaller eslint smells — `eslint-plugin-unused-imports` registered with **no rule enabled**; base `no-unused-vars` off for plain `.js`/`.mjs`; the commented-out `vue/no-reserved-component-names` block.
→ **Re-audit: ⏳ all three unchanged** (`eslint.config.js:70, :139, :104–108`). ➕ New since the audit: the repo now ships its **own ESLint plugin** (`packages/webkit/src/eslint-plugin/`) with a **`lint-canary` CI job** guarding rule regressions, and a `types` job running `type-coverage` (95% threshold) — the tooling *around* eslint got markedly stronger even though these three smells persist.

⚪ **184 stale `.d.ts`/`.d.ts.map` artifacts in `packages/webkit/src/`.**
→ **Re-audit: ✅ resolved.** 0 `.d.ts` files under `src/`; the dev `build:dts`/`clean:dts` flow was dropped (#684) — declarations are emitted only at publish time.

---

## 4. Architecture & component patterns

The component layer is the strongest part — but it broadly violates the repo's **own** styling rule:

🔴/🟠 **`legacy-components.json` is `[]` (empty)** while ~20 files use the forbidden class-preset patterns; 2 `<style scoped>` blocks; presets modules institutionalize the idiom.
→ **Re-audit: ◐ partial — and the contradiction stands.** The whitelist is **still `[]`**. Current violation surface (re-grepped): **3** files with the full `kindClasses`/`sizeClasses` pattern — `button.vue`, `icon-button.vue`, `avatar.vue` (old `dropdown.vue` died with the dropdown replacement #685; `input-text.vue` was rewritten clean in the InputText v2 work) — plus **~13** files with named `*Classes` const arrays, and the shared presets survive (`inputs/presets/interactive-states.js`, `navigation-menu/presets/styles.js`; the dropdown-menu presets are gone with the component). **✅ The two `<style scoped>` blocks are gone** — zero `<style>` blocks in the whole package (both offenders were deleted with #685). Net: ~20 → ~16 violators, whitelist still empty → every one is still formally in violation of `styling.md`. Either migrate the 16 or seed the whitelist; the docs and the code still disagree.
→ **Re-check 2026-07-26: ◐ — and the re-audit undercounted.** Whitelist still `[]`; the 3 `kindClasses`/`sizeClasses` files are unchanged, but the forbidden-trio grep now hits **10 files** (`sharedClasses` also lives in `radio-button` + the six `field-*` wrappers), named `*Classes` consts appear in **~73 files** (not all maps — some are flat-string consts — but the idiom is package-wide), and there are **14 `presets/` directories**, several in *post-rule* families (navigation-menu, drawer, dialog, tab-view import preset class-builders; e.g. `navigation-menu-trigger.vue` composes via `computed` + `getNavigationMenuTriggerClasses()`). The migrate-or-whitelist decision is now bigger than "~16 files" — or `styling.md` needs amending to bless the preset modules it currently forbids.

🟠 **Export strategy fragmented across composition families** (four conventions; consumers can't predict barrel vs deep import).
→ **Re-audit: ◐ substantially changed.** A single convention now exists in writing and in tooling — the **compound API rule** (`.claude/rules/compound-api.md`, #666) + tree-shakeable `<name>-root` exports (#691/#692): `index.ts` with `Object.assign`, compound + `-root` + per-sub-component export keys. **13 families are on it** (accordion, item, table, paginator, flow, pick-list, toast, calendar, input-group, multi-select, select, dropdown, popover — verified `index.ts` present), and the scaffolder emits it for every new composition component. **Pre-rule families are not yet back-migrated**: dialog, drawer, panel, tab-view, navigation-menu, global-header, breadcrumb still expose flat per-sub-component exports with no compound root. Fragmentation is now "old vs new convention" rather than four ad-hoc shapes. → **Re-check 2026-07-26: ⏳ unchanged** — same 13 `index.ts` families; the seven pre-rule families still lack a compound root.

🟡 **Duplication that wants a composable** — the 6 `field-*` wrappers duplicate ~90% of their script; a `useField()` is the obvious extraction.
→ **Re-audit: ⏳ still open.** `src/composables/` grew only by `use-placement` (now: `use-controllable`, `use-focus-trap`, `use-placement`); no `useField`, and the field wrappers (now more of them — password, phone-number, text-switch, input-group…) still wire id/testid/label per file. → **Re-check 2026-07-26: ⏳ unchanged** (`src/composables/` still only `use-controllable`, `use-focus-trap`, `use-placement`).

🟡 **Inconsistent focus-trap policy** — `panel-content` doesn't trap focus while dialog/drawer do.
→ **Re-audit: ⏳ unchanged** (no focus-trap usage in the panel family). → **Re-check 2026-07-26: ⏳ unchanged.**

🟡 **Brittle cross-package import** — deep-relative `../../../../../../theme/src/tokens/...` reaches into theme's src.
→ **Re-audit: ⏳ open and it spread.** Now **7 files** carry the identical deep-relative path (`…/theme/src/tokens/primitives/animations/animate.js`): dialog, drawer, tab-view, segmented-button transitions **plus new adopters** tooltip, code-block, and `navigation-menu-css-vars.js`. Because webkit ships as source, `../../../../../../theme` escapes the published package root entirely — this breaks for any npm consumer and should be `@aziontech/theme/animations` everywhere (the `message` component still shows the correct form). → **Re-check 2026-07-26: ⏳ unchanged** — the same 7 files re-verified; theme still exports `./animations`, so the fix path stands. → **✅ Fixed 2026-07-26** — all 7 now use `import { curve, duration } from '@aziontech/theme/animations'` (the form `message`/`toast`/`pick-list` already had); verified by `vue-tsc` + real-browser tests on tooltip, navigation-menu and dialog (49 passing).

✅ **Genuinely clean (2026-06-24):** no `variant` (all `kind`), consistent sizes, kebab events, uniform `injection-key.ts`, no `v-html`, a11y lint rules passing.
→ **Re-audit: still true, and stronger** — prop-vocabulary guardrails + canonical renames landed (#717), event payloads were standardized to `(event, item)` across the system in a deliberate breaking wave (#735–#737, #739), and the whole convention set is now codified as **25 enforced rules** under `.claude/rules/` with a machine-readable registry (`standards.mjs`) and a CI invariant test.

---

## 5. Theme / tokens

🔴 **The v4 output is broken for real theming** — `emitCssV4()` never calls `compileThemeCss()`; `dist/v4/globals.css` has 0 `@keyframes`, 0 dark-mode blocks, 0 semantic color tokens.
→ **Re-audit: ⏳ still open, verbatim** (`build-tokens.mjs:321–374` unchanged; v4 dist still 0/0/0 — v3 dist has dark mode + 24 semantic vars). **Mitigation shipped instead:** the default flipped — `./globals.css` now resolves to **`dist/v3/globals.css`**, with v4 exposed only as opt-in `./v4/globals.{css,scss}` keys. The "finish or remove v4" decision is still pending; theme is now `4.0.0`, which makes an export named `v4` that is *less* complete than v3 extra confusing.
→ **Re-check 2026-07-26: ✅ resolved — "finish v4" won.** v3 was deleted; `dist/` contains only v4. `dist/v4/globals.css` now has **14 `@keyframes`**, a dark-scheme block and ~208 `--color-*` tokens; `emitCssV4()` calls `compileThemeCss()` (script now at `src/scripts/build-tokens.mjs:347`). Exports collapsed to `".": "./dist/v4/globals.css"` — the `./globals.css` / `./v4/*` keys are gone.

🟡 **`@keyframes` missing from *both* v3 and v4 built CSS** — they live only in the JS Tailwind plugin.
→ **Re-audit: ⏳ still open.** 0 `@keyframes` in either dist file; the plugin now defines **10** keyframes (was 7 — shimmer, progress-indeterminate etc. added). A consumer importing only `globals.css` still gets animation utilities that reference undefined keyframes. → **Re-check 2026-07-26: ✅ resolved** — 14 `@keyframes` in the (only) dist CSS.

🟡 **webkit builds against the *published* theme (`^2.3.2`), not the workspace.**
→ **Re-audit: ✅ resolved** — `"@aziontech/theme": "workspace:*"` — **but see the ➕ new critical in §2**: the release flow doesn't rewrite the protocol on publish yet, so this fix is what created the publish blocker.
→ **Re-check 2026-07-26: ⚠️ regressed.** The range is now `^4.0.0`, and the lockfile resolves it from the **registry at 4.0.0** while the workspace theme is **4.2.0** (storybook still links `workspace:*`). Webkit dev/tests build against a two-minors-stale theme until someone bumps the range — keep it fresh per release, or use `workspace:^` plus a publish path that rewrites it (raw `npm publish` does not).

🟠 **theme releases never rebuild tokens** (`prepareCmd` runs only `vue-tsc`; publishes whatever `dist/` is committed).
→ **Re-audit: ⏳ unchanged** (`packages/theme/.releaserc:54` verbatim). Combined with the v4 gap above, a stale/partial dist can still ship.
→ **Re-check 2026-07-26: ⏳ still true, new location.** `.releaserc` is gone; the release path is `package-theme.yml`, whose Build step (:73–75) runs only `vue-tsc --declaration --emitDeclarationOnly` before `npm publish` — a release still ships whatever `dist/` is committed. → **Correction (later 2026-07-26): ✅ already solved, the re-check missed it.** Theme's `package.json` declares `"prepack": "pnpm build:tokens && pnpm build:dts"`, and `npm publish` triggers `prepack` — so every release **does** rebuild tokens + declarations; the workflow's minimal Build step was a red herring.

⚪ `compile-primitives.js` / `compile-theme.js` silently fall through on an unresolved `tokenRef`.
→ **Re-audit: ⏳ unchanged** (`compile-primitives.js:132` emits the raw `__ref` string; `compile-theme.js:66` silently drops). A typo'd token still vanishes with no build warning.
→ **✅ Fixed 2026-07-26.** All three resolvers (`compile-primitives`, `compile-theme`, **and `resolve.js`** — same silent class, missed by the audit) now collect misses and **throw one aggregated error** (`assertResolvedRefs` in `refs.js`) listing every `--var → ref`; the token build, `prepack`, and any import fail loudly. Dist output verified byte-identical on the clean tree; three deliberate-typo tests confirmed each path fires. ➕ **The guard immediately found real rot**: `semantic/colors.js` carries 4 pre-existing dangling refs (`--background-backdrop → primitives.alpha.neutral.25`, `--background-primary-mask → primitives.alpha.brand.primary.65`, light+dark — `alpha` has no `neutral`/`brand` shades). They live in the **dead** `css-vars.js`/`resolve.js` path (zero callers in the monorepo, not in theme's exports map; shipped CSS gets these vars from the healthy compile-theme path), so production is unaffected — but `createCssVars()` now throws with that list until the refs are fixed or the dead path is deleted. Follow-up decision. → **Resolved 2026-07-27: deleted.** `css-vars.js` + `resolve.js` removed (zero callers; unreachable — `./tokens` absent from the v4 exports map and root `tokens.js` not even in `files`), the barrel re-export dropped, and every stale doc reference corrected (both READMEs still advertised `injectCssVars` as public API with a fictional `build/` path; the prefix table documented the deleted resolver's prefixes and claimed unknown refs pass through as raw strings). The dangling `semanticColorsData` refs are annotated in-file as known-broken-if-rewired.

---

## 6. Governance / CI / release

🔴 **`@aziontech/webkit.dev@0.0.0` is fully publish-wired** — one `mv` away from publishing a `.dev` package on every push to `dev`.
→ **Re-audit: ✅ resolved.** The package was renamed **`@aziontech/webkit@4.0.0`**; `.releaserc` targets `branches: ["main"]` with `tagFormat: @aziontech/webkit@${version}`; the `.disabled/` directory (and `package-webkit-dev.yml` inside it) is **gone**; `package-webkit.yml` is the release workflow. The `exec.publishCmd: npm publish --provenance` pattern remains as the deliberate publish path (`npmPublish: false` on the npm plugin) — no longer a foot-gun in itself, but it is what makes the ➕ `workspace:*` rewrite blocker in §2 real.
→ **Re-check 2026-07-26:** superseded further — #798 removed semantic-release entirely; releases are release-please Release PRs → per-package tags/GitHub Releases → `package-*.yml` (each with a `concurrency: publish-*` group). The §2 blocker died with the `^4.0.0` range.

🔴 **Spec/token/reference governance has zero teeth outside Claude Code.**
→ **Re-audit: ◐ partial.** Real CI teeth now exist for part of the surface: the `toolkit` job runs **`test:gate`** (`check-tests.mjs` — a test file must exist for every root component, never grandfathered), `catalog:check`, `test:toolkit` and authoring checks; `lint-canary` guards the custom ESLint rules; the write-time hook set grew (now also `enforce-spec-exists`, `enforce-test-exists`, `validate-authoring`). **Still Claude-Code-only:** `validate-spec-compliance`, `validate-tokens`, `validate-references`, `validate-story-source` — a human editing `.vue` in VS Code still bypasses spec/token/reference checks; `.husky/pre-commit` is still just `lint-staged`. Notably, `storybook:validate-docs` (`validate-story-source.mjs --all`) exists as a root script but is **not** wired into CI — one line in `governance.yml` away. → **Re-check 2026-07-26:** still not wired (script at root `package.json:27`; no reference in `governance.yml`). → **Tracked as [#806](https://github.com/aziontech/webkit/issues/806)** — wire `storybook:validate-docs` into CI (one line) + batch modes for `validate-spec-compliance`/`validate-tokens`/`validate-references`, or stop advertising them as governance for humans.

🔴 **`enforce-component-create.mjs` is a dead hook** (`ReferenceError` → fail-open; divergent hard-coded category lists).
→ **Re-audit: ✅ resolved.** The function name is consistent (`pipelineReferencedInTranscript` defined at :21, called at :91), and the category list is now imported from a shared `component-categories.mjs` used by both the hook and `_lib/spec.mjs` (lists agree, `templates` included).

🟠 **Missing least-privilege & concurrency in CI.**
→ **Re-audit: ◐ partial.** `governance.yml` now sets least-privilege `permissions: contents: read, pull-requests: read` and TruffleHog is SHA-pinned; action versions are Dependabot-maintained. **No workflow sets `concurrency:` yet** — overlapping `semantic-release` runs on rapid merges remain possible. (`auto-author-assign.yml` unchanged; publish/deploy workflows' token grants not re-swept this pass.)
→ **Re-check 2026-07-26: ◐ mostly closed** — `concurrency:` now set in `release-please.yml`, all three `package-*.yml` publish workflows and the baseline workflow; `governance.yml` still has none (worst case: redundant CI runs, not double-publishes). → **✅ Fixed 2026-07-26** — `governance.yml` now cancels superseded PR runs (pushes to `main` queue instead, so landed commits keep their status), the two live deploy workflows (`app-storybook`, `app-icons-gallery`) got `cancel-in-progress: false` groups so overlapping `azion deploy`s can't race, and the `dev`-branch storybook deploy (`app-storybook-dev.yml`) was **deleted outright** — the repo is `main`-flow now. The parenthetical loose ends were swept and were already fine: `auto-author-assign.yml` is least-privilege (`issues: write`, `pull-requests: write`) with a SHA-pinned action; deploy/OSSF workflows all carry `permissions: {}` + job-level grants.

🟠 **`lts/*` Node float vs `engines`.**
→ **Re-audit: ⏳ unchanged.** All 9 `node-version` directives are still `'lts/*'`; no `.nvmrc`; no root `engines`. Node 24 LTS will still silently bump CI. → **Re-check 2026-07-26: ⏳ and it spread** — now **17** `node-version: 'lts/*'` directives; still no `.nvmrc` / `engines`. → **✅ Fixed 2026-07-26** — `.nvmrc` (`24`, matching what `lts/*` resolves to today, so zero behavioral change) + root `engines.node: >=24`; all 17 directives are now `node-version-file: '.nvmrc'` (16 after `app-storybook-dev.yml` was deleted later the same day; checkout precedes setup-node in every workflow — verified). A Node major bump is now an explicit one-line PR.

🟠 **CI gate ≠ `governance` npm script** (CI re-implements the checks with different flags; `pnpm governance` never runs in CI).
→ **Re-audit: ⏳ unchanged in substance** — CI still runs raw commands (correct `--ext`, so CI is the *stronger* side of the drift; see §3), and the aggregate `pnpm governance` script (now lint + type-check + format + audit) is still local-only.
→ **✅ Fixed 2026-07-26.** `governance.yml`'s six re-implemented steps (eslint, stylelint, prettier, vue-tsc, type-coverage, audit) now invoke the root npm scripts (`webkit:lint`, `webkit:lint:style`, `webkit:format:check`, `webkit:type-check`, `webkit:type-coverage`, `security:audit`), the package-wide prettier commands live in webkit's own `format`/`format:check` (root `webkit:format*` aliases them; `packages/webkit/.prettierignore` mirrors the root ignores, incl. generated `catalog.json`), the root stylelint wrapper carries CI's package-wide glob, and `pnpm governance` chains the same six legs — one command set, two entry points. ➕ **The alignment immediately paid off:** running the stylelint leg locally surfaced a violation (`textarea.vue:68`, `no-invalid-position-declaration` on the deliberate inline `style="width: 100%"`) that CI's identical step had been **silently passing** (same lockfile-pinned stylelint 17.14.0, same command, green in CI on the same tree — a false negative, mechanism unidentified; CI's step also ran suspiciously fast at 1.6s vs 2.5s on an M-series Mac). Since webkit `.vue` files carry no `<style>` blocks (banned by `styling.md`; zero exist), inline `style` attributes are the only CSS stylelint sees in them and bare declarations are the only valid content there — the rule is disabled for `**/*.vue` via an override in `.stylelintrc.json`, and the stylelint gate is green.

🟡 **Spec coverage gap** (`segmented-button`, `empty-results-block`, `overline` exported without specs).
→ **Re-audit: ◐ partial.** `.specs/` grew to **79** specs (~87 component families). `empty-results-block` was **removed** outright in favor of `EmptyState` (#714) — moot. `segmented-button` and `overline` still have no spec. → **Re-check 2026-07-26: ⏳** — both still missing.

✅ **Verified correct (2026-06-24):** the three `.releaserc` are consistent; commitlint mirrors every headerPattern byte-for-byte; `commit-msg` runs everywhere.
→ **Re-audit: still true, now codified** as `.claude/rules/release-types.md` (one type→bump table enforced across commitlint, the three `.releaserc`, CONTRIBUTING, and the PR commands).
→ **Re-check 2026-07-26: ➕ broken by #798.** The three `.releaserc` files no longer exist, yet `release-types.md` still names them as an enforcement surface — and `release-please-config.json` carries **no bump customization** (stock `release-type: node`), so only `feat` (minor), `fix` (patch) and `BREAKING CHANGE` (major) produce releases: the documented `hotfix`/`chore`/`docs`/`style`/`refactor`/`perf` → patch mapping silently stopped happening. The exact divergence class the rule was written to kill is live again; rewrite the rule + CONTRIBUTING + the PR commands for release-please (or encode the intended mapping) in one PR.
→ **✅ Fixed 2026-07-26.** Release-please cannot encode a per-type mapping, so the four surfaces were rewritten to its real semantics: `release-types.md` (now anchored on `release-please-config.json`, with the squash-merge/PR-title, path-filter and `Release-As` details), CONTRIBUTING's type table (`feat`→minor, `fix`→patch, breaking→major, **everything else → no release on its own**), and `/open-pr` + `/create-branch`. The same stale `.releaserc` claim was purged from `git-workflow.md` and `deprecation.md`. `hotfix` (zero uses in the repo's entire history) was **dropped from the commitlint enum** — it silently never released; commitlint now rejects it loudly and urgent fixes are `fix`. Remaining dangling `.releaserc` mentions (compound-api.md, component-scaffold SKILL, COMPONENT_REQUIREMENTS) concern the d.ts-at-publish mechanism, not release types — follow-up.

⚪ **Docs drift** (phantom scripts, stale claims, README name mismatch, phantom `tokens.md`).
→ **Re-audit: ◐ mostly cleared by the #741 doc cleanup** — `GOVERNANCE_IMPLEMENTATION.md` was deleted, the README install name matches the renamed package, and rules reference `DESIGN.md`. `GOVERNANCE_NEXT_STEPS.md` survives and wasn't re-checked line-by-line.

➕ **New since 2026-06-24 (context for the next audit):** `governance.yml` now has 11 jobs — `changes`, `security` (audit + TruffleHog + depcheck), `lint-canary`, `lint`, `types` (vue-tsc + type-coverage), `build` (pack:dry + `pack:check` test-leak gate + **bundle-size gate** via `check-size.mjs` against `.size-limit.json`, 5 entries), `storybook` build smoke, `toolkit` (catalog:check, test:toolkit, authoring, test:gate), `tests` (4-shard Vitest browser mode with Playwright cache), `visual` (Storybook visual regression), `governance-check` summary gate. Plus `ossf.yml` (Scorecard), the visual-baseline workflow (`app-storybook-generate-baseline.yml`), and the 25-rule `.claude/rules/` system with its registry + CI invariant test. → **Re-check 2026-07-26:** `governance.yml` is now **12 jobs** (a `smoke` job was added) and the rule set is **26**; release automation is now release-please (`release-please.yml` + `release-please-config.json`, which also stamps `catalog.json#webkitVersion` on webkit releases).

---

## Recommended order of attack — status 2026-07-26

**Done since 2026-06-24:**
- ~~Make `webkit.dev` private / strip publish wiring~~ → superseded by the rename to `@aziontech/webkit@4.0.0`, `main`-only releases, dev workflow deleted. ✅
- ~~Add `vue` peerDependencies~~ ✅ (vue `^3.5.29` + optional toolkit peers).
- ~~Bump `tar` ≥7.5.16; consolidate overrides into one file~~ ✅ (bounding the `>=` pins is still pending — only `@babel/core` is bounded).
- ~~Pin `trufflehog` to a SHA; least-privilege permissions~~ ✅.
- ~~Stale `.d.ts` pollution~~ ✅ (#684).
- ~~Audit gate depth/scope~~ ✅ (root `pnpm audit`, any severity, in CI).
- ~~Fix the publish flow for `workspace:*`~~ ✅ **differently than prescribed** (2026-07-26): #798 replaced semantic-release with release-please and the dep became `^4.0.0`; 4.2.x shipped. The `vue-tsc → devDependencies` half of that item is **still open**.
- ~~Theme: finish-or-remove v4 / emit `@keyframes` into built CSS~~ ✅ (2026-07-26) — **finished v4, deleted v3**; `@keyframes` + dark scheme + semantic tokens now in `dist/v4/globals.css`; `emitCssV4()` calls `compileThemeCss()`. (`tokenRef` warning still pending.)
- ~~`concurrency:`~~ ✅ **2026-07-26** — release/publish workflows already had groups; `governance.yml` (PR-cancel/main-queue) and the two live deploy workflows (no-cancel groups) completed the set; the dead `dev`-branch storybook deploy workflow was deleted.
- ~~Fix the lint script (`--ext .js,.ts,.vue`)~~ ✅ **2026-07-26** — fixed in `lint`/`lint:fix`; CI's ESLint step now calls `pnpm run webkit:lint`.
- ~~Pin Node~~ ✅ **2026-07-26** — `.nvmrc` (`24`) + root `engines.node: >=24`; all 17 workflow directives now `node-version-file: '.nvmrc'`.
- ~~CI gate ≠ `pnpm governance`~~ ✅ **2026-07-26** — `governance.yml`'s six re-implemented steps invoke the root scripts; `governance` chains the same six legs (eslint, stylelint, prettier, vue-tsc, type-coverage, audit). Surfaced a latent CI stylelint false negative; `no-invalid-position-declaration` overridden for `**/*.vue` (see §6).

- ~~Replace the 7 deep-relative `theme/src` imports~~ ✅ **2026-07-26** — all on `@aziontech/theme/animations`; type-check + browser tests green.
- ~~Move `vue-tsc` to `devDependencies` (webkit + theme)~~ ✅ **2026-07-26** — theme now has zero runtime deps; publish flows unaffected.
- ~~Make theme releases rebuild tokens~~ ✅ **was already solved** — theme's `prepack` (`build:tokens && build:dts`) runs on `npm publish`; the workflow's minimal Build step misled the re-check.
- ~~Warn on unresolved `tokenRef`~~ ✅ **2026-07-26** — all three resolvers now throw an aggregated miss list; the guard immediately exposed 4 pre-existing dangling refs in the dead `css-vars.js` path (see §5).
- ~~Dangling refs / dead `css-vars.js` path~~ ✅ **2026-07-27 — deleted** (`css-vars.js` + `resolve.js` + barrel re-export + all stale doc references; see §5).

- ~~Reconcile release types with release-please~~ ✅ **2026-07-26** — release-please can't encode a custom mapping, so all four surfaces (rule, CONTRIBUTING, `/open-pr`, `/create-branch`) were rewritten to stock semantics (`feat`→minor, `fix`→patch, breaking→major, rest → no release); stale `.releaserc` claims also purged from `git-workflow.md` / `deprecation.md`; unused `hotfix` dropped from the commitlint enum.

**Do now (correctness, low effort):**
1. ➕ Decide theme-dep freshness: webkit resolves `@aziontech/theme` from the registry pinned at 4.0.0 while the workspace is at 4.2.0 — bump the range per release, or use `workspace:^` with a publish step that rewrites it. *(§2, §5)*

**Next (coverage):**
3. Lint/type gates + lint-staged for theme/icons/apps (visual regression now triggers on them; nothing else does); investigate why CI's stylelint step false-negatived (§6) — until explained, treat local `pnpm governance` as the authoritative stylelint gate. *(§3, §6)*
4. Wire `storybook:validate-docs` into CI (script already exists); decide whether spec/token hooks get a CI/pre-commit harness or stop being advertised as governance for humans. **Tracked as [#806](https://github.com/aziontech/webkit/issues/806).** *(§6)*

**Then (architecture/theme, larger):**
5. Resolve the styling contradiction — the surface is larger than the re-audit counted (3 `kindClasses`/`sizeClasses` files, `sharedClasses` in 7 input files, ~73 named-`*Classes` files, **14 `presets/` dirs**, several in post-rule families): migrate, seed `legacy-components.json`, or amend `styling.md` to bless preset modules. *(§4)*
6. Back-migrate dialog/drawer/panel/tab-view/navigation-menu/global-header/breadcrumb onto the compound API; `useField()`; panel focus-trap; specs for `segmented-button`/`overline`. *(§4, §6)*
