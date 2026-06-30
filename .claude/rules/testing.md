# Rule: testing — every component has a smoke test; every interactive story has a `play()`

Each webkit component must ship with a minimum automated safety net: a `*.test.ts` co-located with the `.vue` (smoke + a11y) and, for components with interactive flows, a `play()` function on the relevant story. This rule fixes the **floor** — not the ceiling. The story is the fixture, and `composeStories` is the glue between docs, visual regression, interactions, and unit tests.

The reasoning behind the layered strategy (Vitest browser mode, Portable Stories, axe via Vitest browser, governance hook) lives in [`.claude/docs/TESTING_STRATEGY.md`](../docs/TESTING_STRATEGY.md). This file is the **non-negotiable contract** the hooks and skills enforce.

## The rule

> Every component under `packages/webkit/src/components/<category>/<name>/` ships **one** `<name>.test.ts` next to the `.vue`. The test imports `composeStories` from the component's `*.stories.@(js|ts)`, covers at least the smoke surface below, and runs `axe-core` against the rendered tree. Stories with interactive flows (keyboard, focus, toggle, compound state) ship a `play()` that the same `.test.ts` exercises via `Story.run()`.

## What every `<name>.test.ts` must cover

The minimum bar (mirrors `packages/webkit/src/components/actions/button/button.test.ts`):

| # | Surface | Why |
|---|---|---|
| 1 | Default render → root tag, `data-testid` fallback, key props on `data-*` | Confirms the spec ↔ markup contract: the variant attribute the consumer reads (`data-kind`, `data-size`, …) is actually emitted. |
| 2 | Consumer `data-testid` is honored (`attrs['data-testid']` wins over the fallback) | Catches accidental `:data-testid="someConstant"` regressions. |
| 3 | `it.each` over every value of each variant prop (`kind`, `size`, …) → mounts without throwing | Cheapest possible matrix coverage. This is "compiles + renders"; the visual side is reviewed in Storybook by hand. |
| 4 | Disabled / loading / readonly behavior, when present in the spec | Native attribute set, `aria-*` set, click suppressed. These are the most-broken edges. |
| 5 | Event emission for every event in the spec's Events table | If the spec promises `update:value`, the test calls the user action and asserts `emitted('update:value')`. |
| 6 | `axe-core` over `Default` + every variant where a11y semantics differ (`Disabled`, `Anchor`, `Loading`, …) | a11y bar. Until **Wave 7** of the rollout finishes, axe violations log a warning only — the test does not fail on regressions. Wave 7 flips this to a hard failure. |

The smoke test does **not** assert: pixel positions, CSS class strings, Tailwind variants, animation timing — those belong to manual Storybook review, and asserting on class strings traps refactors. If the test would only pass when the implementation is written one specific way, delete the assertion.

## What every interactive story must cover

A story is **interactive** when its `Default` render is incomplete without keyboard / mouse / focus action — toggles, overlays, focus traps, compound state (`Tabs`, `NavigationMenu`, `Accordion`), keyboard navigation (arrow keys, Esc, Enter/Space), or any flow whose acceptance criteria mention a user action.

The story ships a `play()` that:

1. Uses `userEvent` from `@storybook/test` (never the raw DOM `click()`).
2. Asserts on visible side effects (focus, ARIA state, `data-state`), **not** internal state.
3. Drives the same `fn()` mock instrumented in `args` so the Storybook **Interactions** panel and the Vitest CI run share one source of truth.
4. Is referenced from the matching `<name>.test.ts` via `composeStories(stories)[storyName].run()` so the play executes in CI.

A story without an interactive surface (`Default`, `Sizes`, `Kinds`, `Loading`) does **not** need a `play()`. Forcing one would just churn the diff.

## Conventions

- **File location:** `packages/webkit/src/components/<category>/<name>/<name>.test.ts` (sibling of `<name>.vue` and `<name>.stories.@(js|ts)`).
- **Imports:** `composeStories` from `@storybook/vue3` (not `@storybook/vue3-vite` — the runtime export lives in the former), `render` / `fireEvent` from `@testing-library/vue`, `axe` from `axe-core` (never `vitest-axe` — see [TESTING_STRATEGY.md § 9](../docs/TESTING_STRATEGY.md#9-progresso-fases-0--1-execução-em-waves)).
- **No mocks for positioning / DOM measurement.** Tests run in `@vitest/browser` with the Playwright Chromium provider; `getBoundingClientRect`, focus, layout, and `<Teleport>` all behave like the real browser. Mocking them is forbidden — if a test "needs" a mock, the test is wrong (or the [dependencies rule](./dependencies.md) is being violated).
- **No assertions on class strings.** Use roles, ARIA, `data-*`, visible text, or focus state.
- **a11y bar lives inside the same test.** A separate `*.a11y.test.ts` file is forbidden; running axe alongside the smoke keeps the matrix in one place.

## Composition components

Each public sub-component is a separate consumer-facing import (see [`compound-api.md`](./compound-api.md)). The root component's `<name>.test.ts` covers the compound surface: `Foo.Bar` resolves, the `-root` standalone import is tree-shakeable, the `provide`/`inject` wiring delivers shared state to a sub-component rendered inside the root. Sub-components do **not** get their own `*.test.ts` unless the spec promises behavior the root test cannot reach (rare).

## Hard prohibitions

- Don't ship a `.vue` without `<name>.test.ts` once **Wave 7** of the rollout lands the `enforce-test-exists.mjs` hook. (Until then, the rule is enforced by review and by `validate-component`.)
- Don't write a `*.test.ts` that doesn't import `composeStories` from the matching story file. Hand-rolled fixtures duplicate the story and silently rot.
- Don't add `vitest-axe` — it imports `createRequire` from `node:module`, which doesn't exist in the browser env (see TESTING_STRATEGY § 9, "Ajustes que apareceram"). Use `axe-core` directly + the local `expectNoA11yViolations` helper.
- Don't disable axe rules without a comment on the story's `parameters.a11y.config.rules` explaining **why** (same pattern as `Button.stories.js`). A rule muted with no justification is a regression waiting to be merged.
- Don't put `play()` on a non-interactive story for the sake of "having a play". The `<Default>` render is the test for static stories.
- Don't write a `*.test.ts` that asserts on Tailwind class strings or component-internal CSS.
- Don't introduce a separate test runner alongside Vitest. Everything runs under `pnpm webkit:test`.

## Legacy components

Components in [`.claude/hooks/_lib/legacy-components.json`](../hooks/_lib/legacy-components.json) are exempt from the per-component `.test.ts` requirement until they are migrated under spec enforcement. New components added after the merge of Wave 7 are **never** exempt — the hook rejects the `Write` of a `.vue` without a sibling `<name>.test.ts`.

## Enforcement

- `/component-verify` (skill [`validate-component`](../skills/validate-component/SKILL.md)) runs `pnpm webkit:test --filter <name>` as part of its check matrix.
- `/component-create` (skill [`component-scaffold`](../skills/component-scaffold/SKILL.md)) emits a minimum `<name>.test.ts` alongside the `.vue`.
- `.github/workflows/test.yml` runs `pnpm webkit:test` on every PR/push to `dev`/`main`.
- Wave 7 adds the `enforce-test-exists.mjs` PreToolUse hook that blocks `Write` of `<name>.vue` without a sibling `<name>.test.ts` (modelled on `enforce-spec-exists.mjs`).

## Why this rule exists

The hooks already ensure that the `.vue` declares what the `.specs/<name>.md` promises (`validate-spec-compliance.mjs`). They do **not** ensure that the declaration **works**: a prop can be declared and never read, an event can be typed and never emitted, a focus ring can render and never be reached by Tab order. The smoke test + the `play()` close that gap with the smallest possible per-component cost — one file, one story import, one `axe.run`.
