# Rule: testing — every component ships a functional browser-mode suite

**Scope: `general`.** Shipping a functional test alongside every component is a universal quality practice, not a webkit-only one — this standard travels to consuming projects (it is part of the `general` set the adoption toolkit ships out). The paths and stack below are this repo's instantiation; the invariant — a test exists for every component and moves with it — is the general rule.

Every component ships a co-located `*.test.ts` that proves it **works**, exercised in a **real browser**. The spec-compliance hooks prove a `.vue` _declares_ what its `.specs/<name>.md` promises; they do not prove a prop is read, an event is emitted, a focus ring is reachable, or an overlay closes on `Escape`. This rule closes that gap with the smallest per-component cost, and fixes the **floor** (not the ceiling) every component must clear.

**You cannot create a component without its test, and you cannot land a new or a changed component without creating/updating its test.** Existence is enforced at write-time — on create _and_ on update — and again in CI; freshness (a changed `.vue` whose test was not touched in the same change) is enforced by the CI diff gate. There is no path to merge an untested component, nor a changed component whose test stood still.

## The rule

> Every component under `packages/webkit/src/components/<category>/<name>/` ships one `<name>.test.ts` next to the `.vue`, **created with the component and updated in the same change whenever the component changes**. It runs in **Vitest browser mode** (Playwright Chromium — never jsdom), reuses the component's Storybook story as the fixture via `composeStories`, asserts the functional surface below, and runs `axe-core` against the rendered tree. Composition sub-components are tested **through their root**; only the root gets a `.test.ts` (unless the spec promises behavior the root test cannot reach).

## Why browser mode, never jsdom

jsdom returns no-ops for `focus`, `document.activeElement`, layout/`getBoundingClientRect`, and does not surface `<Teleport>`d content — so a test that "passes" there is a false positive for exactly the behaviors that break in production (keyboard, focus trap, overlays, positioning, contrast). We run in real Chromium so those are real.

- **No mocks for layout / positioning / focus / `<Teleport>`.** If a test "needs" one of those mocks, the test is wrong. Real browser makes them real.
- Teleported overlay content escapes the render container — query it from `document.body`, not the `render()` result.

## The stack (already wired — do not reinvent)

- `packages/webkit/vitest.config.ts` — `@vitejs/plugin-vue`, `browser: { provider: 'playwright', instances: [{ browser: 'chromium' }], headless: true }`, `define: { 'process.env.NODE_ENV': ... }` (so `@testing-library/vue`'s `fireEvent` runs in the browser), `resolve.alias['@aziontech/webkit'] = '@aziontech/webkit.dev'` (self-reference so story imports resolve), `retry: process.env.CI ? 2 : 0`.
- `packages/webkit/src/test/setup.ts` — imports `@aziontech/theme/globals.css` (styled DOM ⇒ axe contrast is real) + `cleanup()`.
- `packages/webkit/src/test/axe.ts` — `expectNoA11yViolations(container)`.
- `.github/workflows/governance.yml` — the `tests` job runs Vitest browser mode sharded (×4) + retry, only when webkit/storybook changes; the `toolkit` job runs `test:gate` (existence + freshness).
- Publish-safety: `packages/webkit/package.json#files` negates `*.test.ts` and `src/test/**` (verified with `pnpm --filter webkit pack:dry`). Test files never ship to npm.

## Conventions

- **Location:** `packages/webkit/src/components/<category>/<name>/<name>.test.ts` (sibling of the `.vue` / `index.ts`).
- **Imports:** `describe`/`it`/`expect` from `vitest` (explicit — no `globals`); `render`/`fireEvent`/`screen` from `@testing-library/vue`; `userEvent` from `@storybook/test` for realistic keyboard/pointer; `composeStories` from `@storybook/vue3`; `expectNoA11yViolations` from the relative `test/axe`; the component via relative `./...`.
- **Story import is a RELATIVE path**, never a `@stories` alias — `validate-references.mjs` cannot resolve a vite alias and will block the write. If a component has no story, test it directly with `render(Component, { props })`.
- **Local runs** (when node_modules is symlinked into a worktree) set `PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false CI=` so pnpm's deps check doesn't abort against symlinks.

## What every `<name>.test.ts` must cover

| #   | Surface          | Assertion                                                                                                                 |
| --- | ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1   | Render           | mounts without throwing; the `data-testid` fallback is present; consumer `data-testid` override wins                      |
| 2   | Props / variants | each variant prop (`kind`, `size`, …) maps to its `data-*` / attribute / rendered state                                   |
| 3   | Events           | every event in the spec's Events table fires with the right payload on the real user action                               |
| 4   | Suppression      | when `disabled` / `loading` / `readonly`, the action is **not** emitted                                                   |
| 5   | v-model          | drive the input, assert `update:modelValue` (and `update:open` / `update:*`) with the exact value                         |
| 6   | ARIA             | `role`, `aria-expanded`, `aria-busy`, `aria-disabled`, `aria-selected`… as the template declares                          |
| 7   | a11y             | `expectNoA11yViolations(container)` on the default render + any variant whose semantics differ                            |
| 8   | Composition      | a context-aware sub-component reflects/drives the root's `provide`/`inject` state with no manual wiring                   |
| 9   | Overlay          | open/close (trigger + second click), `Escape` closes and returns focus, panel Teleports to `body`, scroll-lock while open |
| 10  | Recursive        | nested instances ≥2 levels deep render and propagate context (active item, open submenu, orientation)                     |

A tiny `it.each` smoke over enum variants ("mounts without throwing") is a **floor**, never the substance.

## The functional bar — no false positives, no filler

- Assert **only what you read** in the source. Never invent props/events/testids/aria/sub-components.
- **Forbidden:** assertions on Tailwind/class strings, pixel positions, animation timing, or internal component state.
- **If a test only passes when the implementation is written one specific way, delete it.** It traps refactors and adds no signal.
- If a test reveals a real component defect you cannot satisfy without changing the `.vue`, **`it.skip` it with a one-line reason** — never fake a pass or weaken an assertion into meaninglessness. Record the gap in the PR.

## Composition, overlay, recursive — how to reach them

- **Composition:** import the compound root (default export of `index.ts`) and its sub-components; render a realistic composed tree; assert dot-notation resolves (`Root.Sub`), `provide`/`inject` delivers state, events fire, `v-model` round-trips. Data-driven roots (`data` + `columns`) render via props and assert rows/cells render through the sub-components.
- **Overlay** (`data-state="open|closed"` + `<Teleport>` + trigger): use `userEvent`; query the panel from `document.body`; assert `role`/`aria-*`, `Escape` + focus restoration, backdrop/close-button dismissal, scroll-lock.
- **Recursive** (`navigation-menu`, `breadcrumb`): build a ≥2-level tree; assert nested render + context propagation; exercise keyboard where supported.

## Hard prohibitions

- No jsdom; no mocking layout/positioning/focus/`<Teleport>`.
- No `@stories` alias in a test import — use a relative path (the reference hook blocks the alias).
- No class-string / pixel / animation-timing / internal-state assertions.
- No test file outside the co-located `<name>.test.ts` convention; sub-components do not get their own test unless the root cannot reach the behavior.
- Do not edit a `.vue` to make a test pass — fix the test, or `it.skip` + document.

## Enforcement

Existence and freshness are both blocking — no advisory path:

- **Write-time — existence, on create AND update.** `.claude/hooks/enforce-test-exists.mjs` (PostToolUse on `Write`/`Edit`/`MultiEdit`) blocks (exit 2) when a ROOT component `.vue` is written or edited and its co-located `<name>.test.ts` is missing. Composition sub-components are exempt (tested through their root); `wip/` and the legacy whitelist (`.claude/hooks/_lib/legacy-components.json`) are exempt.
- **CI — existence (mandatory) + freshness.** `packages/webkit/scripts/check-tests.mjs` (`pnpm --filter @aziontech/webkit run test:gate`, run in the `toolkit` job of `governance.yml`) fails the PR when (a) **any** component has no co-located test, or (b) on a PR, a changed ROOT component `.vue` lands without its `<name>.test.ts` in the **same** diff. **Existence is mandatory and never grandfathered** — a component without a test always fails the build. Only _freshness_ carries a transition baseline (`scripts/test-gate-baseline.json`, same ratchet philosophy as `check-authoring`): components changed-without-a-test-touch before the gate existed are grandfathered there; new freshness debt is blocked. Re-snapshot with `TEST_GATE_BASE=<base> pnpm --filter @aziontech/webkit run test:gate:update`. This is what makes "no untested component" true at merge, not just at save.
- **CI — the suite runs.** The sharded Vitest browser job (`vitest`, Playwright Chromium) runs `pnpm webkit:test` on every PR/push touching webkit; a failing assertion fails the PR.
- **Write-time — test integrity.** `validate-references.mjs` blocks a test whose imports don't resolve (including a mistaken `@stories` alias).
- **Publish safety.** `pnpm --filter webkit pack:dry` must list **no** `*.test.ts` — the `files` negation keeps tests out of the published package.
- **Review.** Reviewers confirm the behavioral surface is actually covered (the machine proves the test exists and moves with the component; the human confirms it asserts the right things).

The registry pairs this rule with those gates in `.claude/hooks/_lib/standards.mjs` (`enforce[]`), and `packages/webkit/test/standards/invariant.test.mjs` fails the build if the rule and its gates ever drift apart.

## Why this rule exists

A prop can be declared and never read; an event typed and never emitted; a focus ring rendered and never reached by `Tab`; an overlay that never closes on `Escape`. Lint, types and the Storybook build catch none of these. A real-browser functional suite, reusing the story as its fixture, catches all of them at one file per component — and refuses to pass on the jsdom no-ops that would otherwise give false confidence.
