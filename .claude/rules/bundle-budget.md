# Rule: bundle budget — every entry has a size limit, tree-shaking stays intact

A design system is imported into every consumer, so its size is the consumer's size. This rule keeps each public entry under a **declared budget** and keeps the package **tree-shakeable**, so a component cannot bloat unnoticed and importing one component cannot drag in the whole catalog.

## The rule

> Each public export path has a **`size-limit` budget**. CI fails when an entry exceeds its budget (a `quality ratchet` — the budget only ratchets down). The **standalone `<name>-root`** and per-sub-component paths stay tree-shakeable: importing the root pulls in nothing else (see [`compound-api.md`](./compound-api.md)).

```jsonc
// packages/webkit/.size-limit.json (excerpt — budgets are measured gzip + headroom)
[
  { "name": "button", "path": "src/components/action/button/button.vue", "limit": "2.5 KB" },
  { "name": "table-root", "path": "src/components/data/table/table.vue", "limit": "48 KB" }
]
```

- **Tree-shaking is the reason the `-root` export exists.** The compound path (`./table` → `index.ts`) retains every sub-component via `Object.assign`; the `./table-root` path resolves straight to the root `.vue` so a root-only consumer pulls in nothing else (see [`compound-api.md`](./compound-api.md)). The budget is measured against the tree-shakeable path.
- **No external positioning/animation libs** — the biggest bundle regressions come from `floating-ui` / `gsap` / motion runtimes, which are already forbidden (see [`dependencies.md`](./dependencies.md)). This rule is the backstop that catches a size regression from any source.
- **CSS is budgeted too.** An app's stylesheet holds the Tailwind classes of the WebKit files it imports: `src/webkit.sources.css` lists them (written by the Vite plugin `@aziontech/webkit/vite-plugin` or `npx @aziontech/webkit css`), and neither `@aziontech/theme` nor `@aziontech/webkit/styles` scans the package. `.size-limit-css.json` budgets the gzipped CSS of fixture apps (Button only; a console screen's set of components). A component that grows its classes grows every app that imports it.
- **Budgets ratchet down, never up.** Raising a limit requires a written reason in the PR; the default move when an entry grows is to make it smaller, not to raise the ceiling.

## Hard prohibitions

- Do not add a public export without a `size-limit` entry.
- Do not raise a budget to make a failing check pass without a written justification in the PR.
- Do not break tree-shaking (e.g. a side-effect at module top level, or importing the compound `index.ts` from the root `.vue`).
- Do not introduce a dependency to solve a problem CSS + tokens already solve (see [`dependencies.md`](./dependencies.md)).

## Enforcement

- **`check-size.mjs`** ([`packages/webkit/scripts/check-size.mjs`](../../packages/webkit/scripts/check-size.mjs)) is the size gate, active as the **Bundle budget** step of the `build` job in [`governance.yml`](../../.github/workflows/governance.yml) and as the `size` gate of `node scripts/run-gates.mjs`, so a local run catches an overage before CI does. The stock `size-limit` presets cannot compile `.vue` source, so the gate builds each budgeted entry itself with Vite + `@vitejs/plugin-vue` (vue externalized, minified) and fails on any entry whose gzipped output exceeds its budget. Entries not yet in `.size-limit.json` remain gated by review. **`check-css-size.mjs`** (same gate and `check:size` step) builds each `.size-limit-css.json` fixture app with the stylesheet `webkit init` writes and the WebKit Vite plugin, and fails when its gzipped CSS exceeds the budget.
- **`check-complete.mjs`** ([`packages/webkit/scripts/check-complete.mjs`](../../packages/webkit/scripts/check-complete.mjs), the `complete` gate and the `toolkit` job) fails a root component with no `.size-limit.json` entry; today's unbudgeted components are listed in [`complete-baseline.json`](../../packages/webkit/scripts/complete-baseline.json), which only shrinks. **`check-size-ratchet.mjs`** (same gate and job) compares every limit with the PR's merge base and fails a raise unless the PR body has a line starting `Budget-raise:`.
- **`package-size.test.mjs`** ([`packages/webkit/test/standards/package-size.test.mjs`](../../packages/webkit/test/standards/package-size.test.mjs), the `toolkit` tests) runs `npm pack --dry-run` and fails when the package's unpacked or packed size, or an asset folder, exceeds [`package-size-budget.json`](../../packages/webkit/scripts/package-size-budget.json) (the generated `types/` and AI bundle are excluded), or when a dev-only file (test, `.figma.ts`, source map, snapshot, fixture) ships. The budget is the measured size plus about 5%; it ratchets down like every other budget.
- **`sideEffects`** is declared once at the package root (`["**/*.vue", "**/*.css"]`) so bundlers can tree-shake (see [`compound-api.md`](./compound-api.md)).
- **[`validate-references.mjs`](../hooks/validate-references.mjs)** blocks any forbidden positioning/animation dependency at write time.

## Why this rule exists

`GOVERNANCE_NEXT_STEPS.md` flagged the absence of bundle-size tracking: nothing measured whether a component grew, and nothing verified that importing `<Button>` did not pull in the rest of the catalog. Because the package is consumed as source and leads with a compound (non-tree-shakeable) path, a size regression was invisible until it landed in the consumer. A per-entry budget that only ratchets down turns bundle size into a required check instead of a periodic audit.
