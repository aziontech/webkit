# lint-canaries — broken samples that must stay broken

Every fixture in this directory **violates exactly one configured lint rule on purpose** and is expected to **keep failing** that rule. The runner inverts the usual logic:

| Fixture behavior          | Canary result                           |
| ------------------------- | --------------------------------------- |
| still fails its lint rule | ✅ pass                                 |
| lints clean               | ❌ **fail — someone weakened the lint** |

If a fixture stops failing, a rule in [`eslint.config.js`](../eslint.config.js), [`.stylelintrc.json`](../.stylelintrc.json), [`.prettierrc.json`](../.prettierrc.json) or [`commitlint.config.js`](../commitlint.config.js) was relaxed/removed — or a dependency bump changed the rule's behavior. Either way CI stops so a human decides.

The check is **per rule id**, not per exit code: each fixture must be flagged by the exact rule it guards, so a parse error or an unrelated finding cannot fake a pass.

The wrong/correct code pairs these fixtures are drawn from are documented in [`packages/webkit/docs/DOC_LINTS.md`](../packages/webkit/docs/DOC_LINTS.md).

## Where it runs

**CI only** — the `lint-canary` job in [`.github/workflows/governance.yml`](../.github/workflows/governance.yml), side by side with the Security Scans (audit) job. It feeds the Governance Gate, so a weakened lint blocks the pipeline. It is deliberately **not** part of `pnpm governance`, husky, or lint-staged.

The job triggers when anything that can change lint behavior moves: the four config files, `packages/webkit/eslint.config.js`, this directory, root `package.json`, `pnpm-lock.yaml`, or the workflow itself.

Run locally when touching lint configs:

```sh
node lint-canaries/index.js
```

## Layout

```
lint-canaries/
  index.js   # runner + manifest (fixture → expected rule)
  eslint/
    vue-correctness/      # DOC_LINTS §2 — one .vue per vue/* rule
    accessibility/        # §3 — vuejs-accessibility/*
    typescript/           # §4 — @typescript-eslint/*
    import-hygiene/       # §5 — simple-import-sort/*, import/*
    clean-code/           # §6 — no-console, no-debugger, prefer-const
  stylelint/              # §7 — one .css per rule
  prettier/               # §8 — files that must stay "unformatted"
  commitlint/             # §10 — one wrong commit message per .txt
```

54 canaries: 37 ESLint · 8 Stylelint · 2 Prettier · 7 commitlint.

## Why these files never break the normal pipeline

- The repo lint scripts and CI lint job are scoped to `packages/webkit/src` (ESLint) and `packages/webkit/**` globs (Stylelint, Prettier, lint-staged). This directory lives at the repo root, outside all of them.
- `packages/webkit/tsconfig.json` only includes `src/**`, so `vue-tsc` / `type-coverage` never see these files.
- Only the canary runner ever lints them — expecting failure.

Do **not** add `lint-canaries/` to any lint script's target, and do not "fix" these files: red squiggles in your editor here are the whole point.

## Adding / removing a canary

1. Add the minimal fixture under the linter's directory (one rule per file; extra incidental findings are fine — the runner only asserts the expected rule).
2. Register it in the manifest at the top of [`index.js`](./index.js) with the exact rule id.
3. Run `node lint-canaries/index.js` — it must report the new entry as "still broken".
4. If you are _intentionally_ relaxing a rule: delete the fixture + manifest entry and update `DOC_LINTS.md` in the same PR.

## Known gaps (deliberate)

- **Type gates (§9)** — `vue-tsc` / `type-coverage` are compiler-level and project-wide; they are enforced by the `types` CI job, not canaried here.
- **Write-time Claude hooks (§11)** — enforced at authoring time, not in CI.
- **`vue/no-restricted-syntax`** is enabled with no selectors (restricts nothing) and **`at-rule-no-unknown`** is deliberately off — nothing to canary.
- `vue/multi-word-component-names` is deliberately **off**; there is no canary for it because passing is the desired state.
- A rule downgraded from `error` to `warn` still trips ESLint canaries only via the zero-warnings policy (`--max-warnings 0`) in the real lint job; the canary itself requires severity `error` for ESLint rules, so a downgrade fails the canary too.
