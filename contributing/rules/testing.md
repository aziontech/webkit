# Rule: testing — every component ships a functional browser-mode suite

**Scope: `general`.** Shipping a functional test alongside every component is a universal quality practice, not an azion-ui-only one — this standard travels to consuming projects (it is part of the `general` set the adoption toolkit ships out). The paths and stack below are this repo's instantiation; the invariant — a test exists for every component and moves with it — is the general rule.

Every component ships a co-located `*.test.ts` that proves it **works**, exercised in a **real browser**. The spec-compliance hooks prove a `.vue` _declares_ what its `.specs/<name>.md` promises; they do not prove a prop is read, an event is emitted, a focus ring is reachable, or an overlay closes on `Escape`. This rule closes that gap with the smallest per-component cost, and fixes the **floor** (not the ceiling) every component must clear.

**You cannot create or land a component without its test.** Existence is enforced at write-time — on create _and_ on update — and again in CI. There is no path to merge an untested component. Whether an existing test still covers a changed component is a **review** concern, not a diff gate: a style-only change (CSS, tokens) legitimately ships without touching the test, so the machine only proves the test exists; the reviewer confirms it still asserts the behavior the change affects.

## The rule

> Every component under `packages/ui/src/components/<category>/<name>/` ships one `<name>.test.ts` next to the `.vue`, **created with the component and kept current whenever its behavior changes** (reviewers hold that line; style-only changes need no test touch). It runs in **Vitest browser mode** (Playwright Chromium — never jsdom), renders the component's documented examples (`packages/ui/examples/<name>/*.vue`, the same files the catalog and the docs use) as fixtures, asserts the functional surface below, and runs `axe-core` against the rendered tree. Composition sub-components are tested **through their root**; only the root gets a `.test.ts` (unless the spec promises behavior the root test cannot reach).

## Why browser mode, never jsdom

jsdom returns no-ops for `focus`, `document.activeElement`, layout/`getBoundingClientRect`, and does not surface `<Teleport>`d content — so a test that "passes" there is a false positive for exactly the behaviors that break in production (keyboard, focus trap, overlays, positioning). We run in real Chromium so those are real.

- **No mocks for layout / positioning / focus / `<Teleport>`.** If a test "needs" one of those mocks, the test is wrong. Real browser makes them real.
- Teleported overlay content escapes the render container — query it from `document.body`, not the `render()` result.

### Two modes: unstyled by default, styled when the suite asks for it

`vitest.config.ts` runs the Tailwind Vite plugin, but Tailwind only compiles a stylesheet a suite imports, and [`setup.ts`](../../packages/ui/src/test/setup.ts) imports none. So a suite runs in one of two modes, chosen by its own first line:

| Mode                   | How                                                                                                                       | What a computed style reads                          | Used by                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Unstyled** (default) | import nothing                                                                                                            | the UA default: utility classes emit no CSS          | almost every component suite                                                                                    |
| **Styled**             | `import '<relative>/test/reflow.css'` first (the theme's `globals.css` plus `@source` on components, blocks and examples) | the real theme: tokens, utilities, container queries | `reflow`, `forced-colors`, `screen-reader`, the `*-rtl` suites, and the few component suites that assert layout |

What that decides:

- **A computed style, a color or a geometry is asserted only where it is real**: in a styled suite, or when the style reaches the element without the stylesheet (an inline `style` or a custom property the component writes, CSS the suite injects itself). In an unstyled suite `getComputedStyle(el).backgroundColor` reads `rgba(0, 0, 0, 0)` whether the class is right, misspelled or missing, so the assertion passes in the broken _and_ fixed states. A suite that needs a utility-derived value imports `reflow.css`; it does not assert against the UA default.
- **A class assertion is a pin, not a style check.** It may assert that one exact utility is on one element (`toContain('ms-auto')`, `classList.contains('w-full')`) when that utility is the decision under test: a token choice, a logical-side utility, an `rtl:` or `motion-reduce:` pairing, a container query, a consumer `class` merged onto the root. That is the documented exception, because the unstyled DOM has no other signal for it. Never compare a whole class attribute, never assert a class to prove a rendered result (a size, a position, a colour): render the styled suite for that. When the state is also exposed as `data-*` or ARIA, assert that instead.
- **`expectNoA11yViolations` checks semantics, not pixels**: role, name, ARIA relationships, focus order. Contrast is checked where the colours are: the styled visual suite (`apps/visual`) and the docs site.
- **Pixels, contrast and token correctness belong to visual regression.** A dead utility class (a token that emits no CSS) is invisible to an unstyled suite by construction; it is caught by [`styling.md`](./styling.md)'s token checks at write time and by the visual gate at review time.

Do not add theme CSS to `setup.ts`: every suite would compile the full stylesheet, which slows the whole run for the handful that read it.

The styled stylesheet holds every class Tailwind finds: the `@source` folders, its automatic detection of the package and every module the suite imports. `reflow.css` excludes `test/` so a fixture string never becomes a rule, and a JSON or fixture a styled suite imports never spells a class (`perf-budgets.json` once compiled its own note into a rule that slowed the table it measures).

## The stack (already wired — do not reinvent)

- `packages/ui/vitest.config.ts` — `@vitejs/plugin-vue`, `browser: { provider: playwright(), instances: [{ browser: 'chromium' }], headless: true }`, `define: { 'process.env.NODE_ENV': ... }` (so `@testing-library/vue`'s `fireEvent` runs in the browser), `retry: process.env.CI ? 2 : 0`. `tailwindcss()` compiles only the stylesheet a suite imports (see the two modes above). Example imports of `@aziontech/ui/*` resolve through the package's own `exports` (no alias needed).
- `packages/ui/src/test/setup.ts` — `cleanup()` + an anchor-navigation guard (a real click on an `<a href>` would navigate and tear down the test iframe). It loads **no** CSS, on purpose — see the two modes above.
- `packages/ui/src/test/axe.ts` — `expectNoA11yViolations(container)`; semantics only, no contrast.
- `.github/workflows/governance.yml` — the `tests` job runs Vitest browser mode sharded (×4) + retry, only when `packages/ui` changes; the `toolkit` job runs `check:tests` (existence).
- Publish-safety: `packages/ui/package.json#files` negates `*.test.ts` and `src/test/**` (verified with `pnpm --filter @aziontech/ui check:pack`, which fails when the dry-run pack lists a test file). Test files never ship to npm.

## Conventions

- **Location:** `packages/ui/src/components/<category>/<name>/<name>.test.ts` (sibling of the `.vue` / `index.ts`).
- **Blocks:** `packages/ui/src/test/blocks/<block-id>.test.ts`, named by the block id (`blocks/view/view-table.test.ts`); a suite over several blocks of one group is `src/test/blocks/<group>.test.ts`. A cross-cutting suite is `src/test/<concern>.test.ts` (`rtl`, `reflow`, `screen-reader`, `a11y-*`).
- **Imports:** `describe`/`it`/`expect` from `vitest` (explicit — no `globals`); `render`/`fireEvent`/`screen` from `@testing-library/vue`; `userEvent` from `@testing-library/user-event` (or `vitest/browser`) for realistic keyboard/pointer; the example SFCs by relative import from `packages/ui/examples/<name>/` (never from `apps/`); `expectNoA11yViolations` from the relative `test/axe`; the component via relative `./...`.
- **Example import is a RELATIVE path**, never a vite alias — `validate-references.mjs` cannot resolve an alias and will block the write. If a component has no example that fits, test it directly with `render(Component, { props })`.
- **Local runs** (when node_modules is symlinked into a worktree) set `PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false CI=` so pnpm's deps check doesn't abort against symlinks.

## What every `<name>.test.ts` must cover

| #   | Surface          | Assertion                                                                                                                                        |
| --- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Render           | mounts without throwing; the `data-testid` fallback is present; consumer `data-testid` override wins                                             |
| 2   | Props / variants | each variant prop (`variant`, `size`, …) maps to its `data-*` / attribute / rendered state                                                       |
| 3   | Events           | every event in the spec's Events table fires with the right payload on the real user action                                                      |
| 4   | Suppression      | when `disabled` / `loading` / `readonly`, the action is **not** emitted                                                                          |
| 5   | v-model          | drive the input, assert `update:modelValue` (and `update:open` / `update:*`) with the exact value                                                |
| 6   | ARIA             | `role`, `aria-expanded`, `aria-busy`, `aria-disabled`, `aria-selected`… as the template declares                                                 |
| 7   | a11y             | `expectNoA11yViolations(container)` on the default render + any variant whose semantics differ (semantics only — contrast is the visual suite's) |
| 8   | Composition      | a context-aware sub-component reflects/drives the root's `provide`/`inject` state with no manual wiring                                          |
| 9   | Overlay          | open/close (trigger + second click), `Escape` closes and returns focus, panel Teleports to `body`, scroll-lock while open                        |
| 10  | Recursive        | nested instances ≥2 levels deep render and propagate context (active item, open submenu, orientation)                                            |

A tiny `it.each` smoke over enum variants ("mounts without throwing") is a **floor**, never the substance.

## The functional bar — no false positives, no filler

- Assert **only what you read** in the source. Never invent props/events/testids/aria/sub-components.
- **Forbidden:** a computed style, colour, pixel position or geometry asserted in an unstyled suite; a whole class attribute compared or snapshotted; a class used as proof of a rendered result; animation timing; internal component state. In an unstyled suite a computed-style assertion is _weaker_ than a class pin, because the UA default reads the same whether the style is right or absent.
- **If a test only passes when the implementation is written one specific way, delete it.** It traps refactors and adds no signal.
- If a test reveals a real component defect you cannot satisfy without changing the `.vue`, **`it.skip` it with a one-line reason** — never fake a pass or weaken an assertion into meaninglessness. Record the gap in the PR.

## Composition, overlay, recursive — how to reach them

- **Composition:** import the compound root (default export of `index.ts`) and its sub-components; render a realistic composed tree; assert dot-notation resolves (`Root.Sub`), `provide`/`inject` delivers state, events fire, `v-model` round-trips. Data-driven roots (`data` + `columns`) render via props and assert rows/cells render through the sub-components.
- **Overlay** (`data-state="open|closed"` + `<Teleport>` + trigger): use `userEvent`; query the panel from `document.body`; assert `role`/`aria-*`, `Escape` + focus restoration, backdrop/close-button dismissal, scroll-lock.
- **Recursive** (`navigation-menu`, `breadcrumb`): build a ≥2-level tree; assert nested render + context propagation; exercise keyboard where supported.

## Hard prohibitions

- No jsdom; no mocking layout/positioning/focus/`<Teleport>`.
- No vite alias in a test import — use a relative path (the reference hook blocks the alias).
- No computed-style, pixel or geometry assertion outside a styled suite; no whole-class-string comparison; no animation-timing or internal-state assertion.
- No test file outside the co-located `<name>.test.ts` convention; sub-components do not get their own test unless the root cannot reach the behavior.
- Do not edit a `.vue` to make a test pass — fix the test, or `it.skip` + document.

## Enforcement

Existence is blocking — no advisory path:

- **Write-time — existence, on create AND update.** `contributing/hooks/enforce-test-exists.mjs` (PostToolUse on `Write`/`Edit`/`MultiEdit`) blocks (exit 2) when a ROOT component `.vue` is written or edited and its co-located `<name>.test.ts` is missing. Composition sub-components are exempt (tested through their root); `wip/` and the legacy whitelist (`contributing/hooks/lib/legacy-components.json`) are exempt.
- **CI — existence (mandatory).** `packages/ui/scripts/check-tests.mjs` (`pnpm --filter @aziontech/ui run check:tests`, run in the `toolkit` job of `governance.yml`) fails the PR when **any** ROOT component has no co-located `<name>.test.ts`. **Never grandfathered** — a component without a test always fails the build. This is what makes "no untested component" true at merge, not just at save. There is deliberately **no** diff-freshness gate (changed `.vue` ⇒ changed test): it cannot tell a behavior change from a style-only one, so it taxed CSS/token PRs with no-op test edits; keeping the test honest on behavior changes is the reviewer's job (below).
- **CI — the suite runs.** The sharded Vitest browser job (`vitest`, Playwright Chromium) runs `pnpm test:browser-webkit` on every PR/push touching Azion UI; a failing assertion fails the PR.
- **Write-time — test integrity.** `validate-references.mjs` blocks a test whose imports don't resolve (including a mistaken alias).
- **Publish safety.** `pnpm --filter @aziontech/ui check:pack` must pass (the dry-run pack lists **no** `*.test.ts`) — the `files` negation keeps tests out of the published package.
- **Review.** Reviewers confirm the behavioral surface is actually covered (the machine proves the test exists and moves with the component; the human confirms it asserts the right things).

The registry pairs this rule with those gates in `contributing/hooks/lib/standards.mjs` (`enforce[]`), and `packages/ui/test/standards/invariant.test.mjs` fails the build if the rule and its gates ever drift apart.

## Why this rule exists

A prop can be declared and never read; an event typed and never emitted; a focus ring rendered and never reached by `Tab`; an overlay that never closes on `Escape`. Lint, types and the docs build catch none of these. A real-browser functional suite, reusing the examples as fixtures, catches all of them at one file per component — and refuses to pass on the jsdom no-ops that would otherwise give false confidence.
