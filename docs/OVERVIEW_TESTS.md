# Test Architecture — Overview

> **@aziontech/webkit monorepo** · snapshot of July 2026
> Companion doc: [`OVERVIEW_LINT.md`](./OVERVIEW_LINT.md) (static-quality layers) · Deep audit: [`TESTING_AUDIT_2026-07-02.md`](./TESTING_AUDIT_2026-07-02.md)

## TL;DR

Webkit ships **two complementary test layers**, both running in **real Chromium** (never jsdom):

| Layer | Tooling | DOM | Owns | CI workflow |
|---|---|---|---|---|
| **1. Functional / unit** | Vitest 4 browser mode + Playwright | Unstyled (tokens load, no Tailwind pipeline) | Behavior, structure, events, v-model, ARIA, structural a11y | `package-webkit-test.yml` (4 shards) |
| **2. Visual regression** | Storybook test-runner + jest-image-snapshot | Fully styled (theme + Tailwind) | Pixels, layout, color, typography | `app-storybook-visual.yml` |

Current numbers: **67 component test suites · 1362 tests passing · 1 skipped · ~97% of in-scope component roots covered** — over a library of ~150 components (roots + sub-components).

The split is deliberate: **units prove it works, visual proves it looks right.** Neither layer pretends to do the other's job.

---

## 1. The big picture

```mermaid
flowchart TB
    subgraph SRC["Source of truth"]
        VUE["Component<br/>packages/webkit/src/components/&lt;category&gt;/&lt;name&gt;/&lt;name&gt;.vue"]
        STORY["Story<br/>apps/storybook/src/stories/components/.../&lt;Name&gt;.stories.js"]
    end

    subgraph L1["Layer 1 — Functional (Vitest browser mode)"]
        TEST["&lt;name&gt;.test.ts<br/>co-located with the .vue"]
        CHROMIUM1["Real Chromium — headless Playwright"]
        ASSERT["render · props · events · v-model<br/>ARIA · axe-core (structural)"]
        TEST --> CHROMIUM1 --> ASSERT
    end

    subgraph L2["Layer 2 — Visual regression (Storybook test-runner)"]
        BUILD["storybook:build → static dist/"]
        SNAP["screenshot of every story<br/>storybook-root element @ 1280×720"]
        COMPARE["jest-image-snapshot<br/>vs committed linux baseline"]
        BUILD --> SNAP --> COMPARE
    end

    VUE --> TEST
    STORY -- "composeStories() — story IS the fixture" --> TEST
    STORY --> BUILD

    ASSERT --> CI1["CI: package-webkit-test.yml<br/>4 shards + gate"]
    COMPARE --> CI2["CI: app-storybook-visual.yml<br/>diff artifacts on failure"]

    CI1 --> MERGE["PR mergeable"]
    CI2 --> MERGE
```

Two ideas hold this together:

1. **The story is the fixture.** Unit tests import the component's Storybook story via `composeStories()` — the same markup that documents the component also exercises it. Docs, canvas, and tests cannot drift apart. (Among 11 benchmarked component libraries, this reuse is effectively unique to webkit.)
2. **One browser, two lenses.** Both layers run Chromium via Playwright. Layer 1 mounts components unstyled and asserts *what the DOM is and does*; Layer 2 renders the fully-styled Storybook and asserts *what the pixels look like*.

---

## 2. Layer 1 — Functional tests (Vitest browser mode)

### 2.1 Why a real browser, never jsdom

jsdom silently no-ops exactly the APIs component behavior depends on. A suite that passes there is a false positive for the things that break in production:

| Capability | jsdom | Real Chromium |
|---|---|---|
| `focus()` / `document.activeElement` | no-op | real |
| Layout / `getBoundingClientRect` | zeros | real |
| `<Teleport>` content in `document.body` | not surfaced | real |
| Keyboard navigation / focus trap | fake | real |
| Scroll-lock, overlay dismissal | fake | real |

Consequence: **no mocks for layout, positioning, focus, or `<Teleport>` — ever.** If a test "needs" one of those mocks, the test is wrong.

### 2.2 The stack

| Piece | File | What it does |
|---|---|---|
| Runner config | `packages/webkit/vitest.config.ts` | Vitest **4.1.9** browser mode: `provider: playwright()` (v4 factory), `headless: true`, single `chromium` instance, `retry: 2` in CI (0 local), includes `src/**/*.test.{ts,js}` |
| Global setup | `packages/webkit/src/test/setup.ts` | `cleanup()` after each test + **anchor-navigation guard** (prevents `<a href>` clicks from tearing down the test iframe, while `@click` handlers still fire) |
| A11y helper | `packages/webkit/src/test/axe.ts` | `expectNoA11yViolations(container)` — runs **axe-core 4.10** and asserts zero violations |
| Coverage | `vitest.config.ts` → `coverage` | V8 provider, `text` + `lcov`, **reporting-only** (no gate yet); measures `src/components/**`, excludes tests, stories, `.figma.ts`, barrels, presets |

### 2.3 Anatomy of a component test

```mermaid
flowchart LR
    S["*.stories.js"] -->|"composeStories()"| F["Story fixture<br/>(args + template)"]
    C["component.vue"] --> R["render() — @testing-library/vue"]
    F --> R
    R --> B["Chromium DOM"]
    B --> A1["queries: getByTestId, getByRole"]
    B --> A2["userEvent — @storybook/test<br/>(real keyboard / pointer)"]
    B --> A3["expectNoA11yViolations — axe-core"]
```

The canonical shape (from `avatar.test.ts` / `tag.test.ts`):

```ts
import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../apps/storybook/src/stories/components/.../Avatar.stories'
import { expectNoA11yViolations } from '../../test/axe'
import Avatar from './avatar.vue'

const { Default } = composeStories(stories) // Storybook story = test fixture

it('renders the composed Default story fixture', () => {
  const { getByTestId } = render(Default)
  expect(getByTestId('content-avatar')).toHaveAttribute('role', 'img')
})

it('has no accessibility violations', async () => {
  const { container } = render(Avatar, { props: { label: 'AB' } })
  await expectNoA11yViolations(container)
})
```

Conventions that matter:

- **Co-location** — `<name>.test.ts` sits next to `<name>.vue`. Composition components are tested **through their root** (sub-components don't get their own file unless the root can't reach the behavior).
- **Story imports are relative paths** (never a vite alias) so the reference-validation hook can resolve them.
- Overlay content is queried from `document.body` (it really Teleports there), not from the render container.

### 2.4 The mandatory surface — what every test must cover

Fixed by [`.claude/rules/testing.md`](../.claude/rules/testing.md); this is the **floor**, not the ceiling:

| # | Surface | Assertion |
|---|---|---|
| 1 | Render | mounts; `data-testid` fallback present; consumer override wins |
| 2 | Props / variants | each `kind` / `size` / … maps to its `data-*` attribute |
| 3 | Events | every spec'd event fires with the right payload on real user action |
| 4 | Suppression | `disabled` / `loading` / `readonly` → action **not** emitted |
| 5 | v-model | drive the input, assert `update:modelValue` with the exact value |
| 6 | ARIA | `role`, `aria-expanded`, `aria-busy`, `aria-selected`… as declared |
| 7 | a11y | `expectNoA11yViolations` on default render + semantically-distinct variants |
| 8 | Composition | context-aware sub-component reflects/drives the root's `provide`/`inject` |
| 9 | Overlay | open/close, `Escape` closes + returns focus, Teleport to body, scroll-lock |
| 10 | Recursive | ≥2-level nesting renders and propagates context |

### 2.5 The unstyled-DOM decision (and what axe checks)

The unit environment **does not run the Tailwind pipeline** — components mount with token variables loaded but no utility CSS generated. This is intentional (audit §2.0, "Path B"):

- Unit assertions are about **behavior, structure, and ARIA** — none of them need pixels.
- axe-core therefore runs **structural rules only**. Five visual/layout rules are explicitly disabled because they'd be meaningless without real styling: `color-contrast`, `color-contrast-enhanced`, `target-size`, `link-in-text-block`, `scrollable-region-focusable`.
- Structural axe still has teeth — it caught the suite's real defects (`nested-interactive`, `aria-required-children`, `aria-hidden-focus`).
- **Pixels and contrast belong to Layer 2**, where the full theme renders.

### 2.6 The quality bar — no false positives, no filler

- Assert **only what you read in the source**. Never invent props, events, testids, or ARIA.
- **Forbidden assertions:** Tailwind class strings, pixel positions, animation timing, internal component state. (If a test only passes when the implementation is written one specific way, it's a refactor trap — delete it.)
- A real component defect a test exposes → `it.skip` with a one-line reason and a note in the PR. Never fake a pass.

---

## 3. Layer 2 — Visual regression (Storybook test-runner)

Every story in the built Storybook is visited in Chromium, screenshotted, and compared pixel-wise against a committed baseline.

### 3.1 How one story gets tested

```mermaid
sequenceDiagram
    participant TR as test-runner (Jest)
    participant PW as Playwright page
    participant SB as Static Storybook (:6007)

    TR->>PW: preVisit — viewport 1280×720, park mouse at (0,0), inject animation freeze (1ms durations)
    PW->>SB: load story iframe
    TR->>PW: postVisit — waitForPageReady + document.fonts.ready
    PW->>PW: screenshot of the storybook-root element
    TR->>TR: toMatchImageSnapshot — failureThreshold 0.01%
    alt pixels diverge beyond threshold
        TR->>TR: write annotated diff → __diff_output__/ (uploaded as CI artifact)
    end
```

Determinism measures baked into `apps/storybook/.storybook/test-runner.js`:

| Measure | Why |
|---|---|
| Fixed viewport 1280×720 | consistent canvas across stories and runs |
| `page.mouse.move(0, 0)` before each story | the worker page is reused — a parked pointer prevents hover state (menus, tooltips) leaking into the next screenshot |
| Animations forced to **1ms** (not `animation: none`) | components that wait for `animationend`/`transitionend` to settle would hang forever with animations removed; 1ms keeps events firing while making motion invisible |
| `document.fonts.ready` await | screenshots never race font loading |
| `failureThreshold: 0.01%` | absorbs sub-pixel antialiasing noise; a real change moves far more |
| `parameters: { visual: false }` on a story | opts it out of the snapshot (still visited, so render errors are caught) |

### 3.2 Baseline lifecycle — platform discipline

Font rasterization differs across OSes, so baselines are **per-platform** and only Linux baselines are the contract:

```mermaid
flowchart LR
    D["workflow_dispatch<br/>update_baselines = true"] --> U["test:visual:update<br/>on ubuntu-latest"]
    U --> A["artifact:<br/>visual-baselines-linux (7d)"]
    A --> C["developer downloads<br/>+ commits contents"]
    C --> BASE["__image_snapshots__/linux/<br/>= the committed CI contract"]
    BASE --> PR["every PR's screenshots<br/>compared against it"]
    LOCAL["darwin/ baselines<br/>(local runs)"] -. "gitignored — never committed" .-> BASE
```

- `apps/storybook/.storybook/test-visual/__image_snapshots__/linux/` → committed, the CI contract.
- `…/darwin/` → local-only, gitignored. **Never commit darwin baselines.**
- Regeneration happens only through the workflow dispatch (or a Linux container) — never from a Mac.

### 3.3 Scripts

| Script (in `apps/storybook`) | Use |
|---|---|
| `test:visual` | run against a live `storybook dev` on :6006 |
| `test:visual:static` | serve built `dist/` on :6007 + test (one-shot local) |
| `test:visual:ci` | same, with `--ci` (fail on missing baseline instead of writing one) |
| `test:visual:update` | regenerate baselines for the current platform |

Root conveniences: `pnpm storybook:test:visual` and `pnpm storybook:test:visual:update` (both build Storybook first).

---

## 4. CI pipelines

### 4.1 Functional suite — `.github/workflows/package-webkit-test.yml`

```mermaid
flowchart LR
    T["PR / push → dev"] --> CH["changes job<br/>dorny/paths-filter"]
    CH -- "packages/webkit/** or apps/storybook/**" --> MX["matrix: shard 1–4<br/>fail-fast: false"]
    CH -- "nothing relevant" --> SKIP["skip (gate passes as skipped)"]
    MX --> S1["vitest run --shard=1/4"]
    MX --> S2["--shard=2/4"]
    MX --> S3["--shard=3/4"]
    MX --> S4["--shard=4/4"]
    S1 --> G["Tests Gate<br/>fails unless success or skipped"]
    S2 --> G
    S3 --> G
    S4 --> G
```

- **4 shards** parallelize the ~150-component suite; `retry: 2` (from `vitest.config.ts`) absorbs the rare browser-launch flake.
- Playwright Chromium only (`playwright install --with-deps chromium`), with the browser binary cached on `pnpm-lock.yaml` (`~/.cache/ms-playwright`).
- The **gate job** (`test-check`) is the single required status — it passes when shards succeed *or* the path filter skipped them.

### 4.2 Visual suite — `.github/workflows/app-storybook-visual.yml`

- Triggers: PRs to `dev` touching `packages/webkit/**`, `packages/theme/**`, `packages/icons/**`, or `apps/storybook/**`; plus manual dispatch with the `update_baselines` flag.
- Steps: install → cache/install Chromium → `storybook:build` → `test:visual:ci` against the static build.
- On failure: uploads `visual-diff-output` (annotated diffs, 7-day retention) so reviewers see exactly which pixels moved.
- On dispatch with `update_baselines=true`: runs `test:visual:update` and uploads `visual-baselines-linux` instead of failing.
- `concurrency: cancel-in-progress` per ref; 30-minute timeout.

### 4.3 Where the other gates sit

Static quality (ESLint, Stylelint, Prettier, `vue-tsc`, type-coverage, security scans, Storybook build smoke) runs in `governance.yml` — covered in [`OVERVIEW_LINT.md`](./OVERVIEW_LINT.md). One governance job matters here: **publish safety** (§5).

---

## 5. Publish safety — tests never ship to npm

Two mechanisms, verified in CI (`governance.yml` → build job):

1. `packages/webkit/package.json#files` negates test artifacts:
   ```json
   "files": ["src", "!src/**/*.test.{ts,js}", "!src/test/**", "package.json"]
   ```
2. `pack:check` asserts it:
   ```bash
   ! npm pack --dry-run 2>&1 | grep -E '\.test\.(ts|js)|src/test/'
   ```

`packages/webkit/tsconfig.json` also excludes `*.test.ts` and `src/test/` from declaration emit — no `.d.ts` is generated for test code.

---

## 6. Enforcement & scaffolding — how the floor stays enforced

| Mechanism | Kind | What it does |
|---|---|---|
| [`.claude/rules/testing.md`](../.claude/rules/testing.md) | Rule (source of truth) | Fixes the browser-mode requirement, the 10-surface floor, and the hard prohibitions |
| `enforce-test-exists.mjs` | Claude Code PostToolUse hook | Warns when a root `.vue` is written without a co-located `<name>.test.ts` |
| `component-scaffold` skill | Generator | Every new component is born with a starter test (render + testid override + axe) that the author expands to the full surface |
| `validate-references.mjs` | Claude Code PreToolUse hook | Blocks test files whose imports don't resolve (e.g. a mistaken `@stories` alias instead of a relative path) |
| `package-webkit-test.yml` gate | CI | No PR merges with a red shard |

---

## 7. Command cheat sheet

| Command (repo root) | What it runs |
|---|---|
| `pnpm webkit:test` | full browser-mode suite, headless |
| `pnpm webkit:test:watch` | watch mode |
| `pnpm webkit:test:ui` | Vitest UI with a **headed** browser (debugging) |
| `pnpm webkit:test:coverage` | suite + V8 coverage report (`text` + `lcov`) |
| `pnpm storybook:test:visual` | build Storybook + run visual snapshots locally |
| `pnpm storybook:test:visual:update` | regenerate local (darwin) baselines |
| `pnpm --filter webkit pack:check` | assert no test file leaks into the npm tarball |

---

## 8. Design decisions — the "why" in one table

| Decision | Alternative rejected | Rationale |
|---|---|---|
| Vitest **browser mode** (real Chromium) | jsdom | jsdom no-ops focus/layout/Teleport — false positives on exactly the behaviors that break in production |
| **Story as fixture** (`composeStories`) | separate hand-written fixtures | docs, canvas, and tests exercise the same markup; drift becomes impossible |
| **Unstyled** unit DOM | wiring the Tailwind pipeline into Vitest | no unit assertion needs pixels; cost (postcss + theme config duplication) buys nothing — pixels are Layer 2's job |
| axe **structural-only** in units | full axe rule set | contrast/target-size without real CSS would mislead; structural rules caught every real defect so far |
| **Snapshots at Storybook level**, per-platform baselines | visual SaaS (Chromatic etc.) / cross-platform baselines | self-hosted, zero external service; linux-only committed baselines eliminate font-rasterization noise |
| **4-shard CI matrix** + retry 2 | single job | ~150-component suite parallelizes; retries absorb browser-launch flakes without hiding real failures |
| Coverage **reporting-only** | coverage gate | signal first, ratchet later — the functional floor (10 surfaces) is the real gate |
| Tests co-located, published-excluded | separate `__tests__/` tree | test lives with the component it proves; `files` negation + `pack:check` keep npm clean |
