# AGENTS.md — `packages/webkit`

You are working inside the `@aziontech/webkit` package. Universal monorepo guidance lives in [`../../contributing/AGENTS.md`](../../contributing/AGENTS.md). Spec-driven component workflow + hard rules + hooks live in [`../../contributing/`](../../contributing/). This file only covers what is **specific to this package** and is not already documented elsewhere.

## 1) Layers within this package

```
packages/webkit/src/
├── components/          ← the design-system components (spec-driven; see contributing/)
│   ├── action/  ai/  chart/  code/  content/  data/  docs/  feedback/
│   └── input/  layout/  marketing/  navigation/  overlay/  provider/  section/
├── composables/         use-controllable, use-direction, use-focus-trap, use-placement, use-collection, …
├── utils/               cn (clsx + tailwind-merge), csv
├── cli/                 `webkit` bin — init / doctor / plan / apply
├── catalog/             catalog query engine (`@aziontech/webkit/catalog-queries`) — used by the CLI and `@aziontech/webkit-mcp`
├── eslint-plugin/       consumer lint rules + the shared authoring/token check engines
├── stylelint-config.js  consumer stylelint config
├── svg/, images/, styles/, vite/
```

Component creation under `components/**` is **always** driven by the pipeline at [`../../contributing/`](../../contributing/) — see [`../../contributing/commands/component-create.md`](../../contributing/commands/component-create.md). The end-to-end process (creation → release, adoption → enforcement) is mapped in [`contributing/docs/PROCESS.md`](../../contributing/docs/PROCESS.md).

## 2) Files agents must NOT edit without explicit human approval

- [`../../contributing/docs/COMPONENT_REQUIREMENTS.md`](../../contributing/docs/COMPONENT_REQUIREMENTS.md)
- `package.json` outside of the `exports` block (structural changes only with approval)
- `.github/workflows/governance.yml` (CI config)

## 3) Layer rules outside `components/**`

- **`composables/*`** — Vue composables following [`../../contributing/rules/composables.md`](../../contributing/rules/composables.md) (`readonly` state out, `toValue` args, `onScopeDispose` cleanup); document the API in TSDoc; export through the root `packages/webkit/package.json#exports` (one entry per public composable).
- **`cli/` · `mcp/` · `eslint-plugin/` · `stylelint-config.js`** — the adoption toolkit. It ships inside `@aziontech/webkit` (bins + subpath exports; no separate packages). Covered by `test/**/*.test.mjs` (`pnpm test:toolkit`) and documented in [`docs/toolkit/`](./docs/toolkit/). The check engines in `eslint-plugin/lib/*.js` are shared with the write-time hooks and the CI ratchet — changing them changes three enforcement surfaces at once.

## 4) Validation gate (must pass before reporting done)

```bash
pnpm lint:webkit
pnpm typecheck:webkit
pnpm check:webkit:type-coverage
pnpm --filter @aziontech/webkit test:ssr
```

Type coverage threshold: **95%**.

## 5) Dependency status (gotchas for the pipeline)

- **`@testing-library/user-event`** — installed in `packages/webkit` for the browser tests (`import userEvent from '@testing-library/user-event'`); `vitest/browser` also exports a `userEvent`.
- **`@figma/code-connect`** — installed; config at [`figma.config.json`](./figma.config.json). Authoring `.figma.ts` works locally; publishing requires `FIGMA_ACCESS_TOKEN`.
- **`cn` helper** — installed (`clsx` + `tailwind-merge`) at [`src/utils/cn.ts`](./src/utils/cn.ts), exported as `@aziontech/webkit/utils/cn`. Use it inside `:class` when the consumer must be able to override internal token choices.
- **`asChild` Slot helper** — **pending**. No helper exists yet. Do not import a phantom path — `validate-references.mjs` will block.

## 6) Common pitfalls

- **Tokenizing manually:** if Figma exposes a variable that has no equivalent token (check `list_tokens` in the webkit MCP), register a theme gap in the spec and use the closest primitive temporarily. Do not invent a HEX or hardcode a Tailwind palette.
- **Slots in the wrong layer:** a monolithic component exposes only the slots its spec lists, at fixed configuration points: `Button` has `default` (the label) and `leading`, `Tag` has `default`, `IconButton` has none, and `PricingCard` has `default` + `actions`. None of that is the Composition Pattern; a part the consumer reorders or omits is a sub-component.
- **Typography raw classes leaking in:** `text-[length:var(--text-button-lg-font-size)]` and similar are legacy. New components always use the generated class (`text-button-lg`). `validate-tokens.mjs` only blocks **new** violations; the remaining legacy debt is frozen in [`scripts/authoring-baseline.json`](./scripts/authoring-baseline.json) and blocked from growing by the CI ratchet.
- **Hook blocking a legitimate edit:** read the stderr message — it states the rule that fired and how to fix it. The hooks fail open on unexpected errors and never silently break workflows.

---

For everything else — workflow, hard rules, isolated sub-agents, hook behavior, rules catalog — read [`../../contributing/AGENTS.md`](../../contributing/AGENTS.md) § 11 and the artifacts under [`../../contributing/`](../../contributing/).
