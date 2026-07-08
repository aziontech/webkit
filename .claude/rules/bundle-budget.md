# Rule: bundle budget — every entry has a size limit, tree-shaking stays intact

A design system is imported into every consumer, so its size is the consumer's size. This rule keeps each public entry under a **declared budget** and keeps the package **tree-shakeable**, so a component cannot bloat unnoticed and importing one component cannot drag in the whole catalog.

## The rule

> Each public export path has a **`size-limit` budget**. CI fails when an entry exceeds its budget (a `quality ratchet` — the budget only ratchets down). The **standalone `<name>-root`** and per-sub-component paths stay tree-shakeable: importing the root pulls in nothing else (see [`compound-api.md`](./compound-api.md)).

```jsonc
// packages/webkit/.size-limit.json
[
  { "name": "button",      "path": "src/components/actions/button/button.vue", "limit": "6 KB" },
  { "name": "table-root",  "path": "src/components/data/table/table.vue",       "limit": "12 KB" }
]
```

- **Tree-shaking is the reason the `-root` export exists.** The compound path (`./table` → `index.ts`) retains every sub-component via `Object.assign`; the `./table-root` path resolves straight to the root `.vue` so a root-only consumer pulls in nothing else (see [`compound-api.md`](./compound-api.md)). The budget is measured against the tree-shakeable path.
- **No external positioning/animation libs** — the biggest bundle regressions come from `floating-ui` / `gsap` / motion runtimes, which are already forbidden (see [`dependencies.md`](./dependencies.md)). This rule is the backstop that catches a size regression from any source.
- **Budgets ratchet down, never up.** Raising a limit requires a written reason in the PR; the default move when an entry grows is to make it smaller, not to raise the ceiling.

## Hard prohibitions

- Do not add a public export without a `size-limit` entry.
- Do not raise a budget to make a failing check pass without a written justification in the PR.
- Do not break tree-shaking (e.g. a side-effect at module top level, or importing the compound `index.ts` from the root `.vue`).
- Do not introduce a dependency to solve a problem CSS + tokens already solve (see [`dependencies.md`](./dependencies.md)).

## Enforcement

- **`size-limit`** runs as a **required** CI job in [`governance.yml`](../../.github/workflows/governance.yml): it builds each entry and fails on any over-budget path.
- **`sideEffects`** is declared once at the package root (`["**/*.vue", "**/*.css"]`) so bundlers can tree-shake (see [`compound-api.md`](./compound-api.md)).
- **[`validate-references.mjs`](../hooks/validate-references.mjs)** blocks any forbidden positioning/animation dependency at write time.

## Why this rule exists

`GOVERNANCE_NEXT_STEPS.md` flagged the absence of bundle-size tracking: nothing measured whether a component grew, and nothing verified that importing `<Button>` did not pull in the rest of the catalog. Because the package is consumed as source and leads with a compound (non-tree-shakeable) path, a size regression was invisible until it landed in the consumer. A per-entry budget that only ratchets down turns bundle size into a required check instead of a periodic audit.
