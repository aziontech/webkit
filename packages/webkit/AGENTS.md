# AGENTS.md — `packages/webkit`

You are working inside the `@aziontech/webkit` package. Universal monorepo guidance lives in [`../../.claude/AGENTS.md`](../../.claude/AGENTS.md). Spec-driven component workflow + hard rules + hooks live in [`../../.claude/`](../../.claude/). This file only covers what is **specific to this package** and is not already documented elsewhere.

## 1) Layers within this package

```
packages/webkit/src/
├── components/
│   ├── webkit/          ← canonical webkit layer (spec-driven; see .claude/)
│   │   ├── actions/     button, icon-button
│   │   ├── content/     avatar, card-box, card-pricing, currency, tag
│   │   ├── data/        (empty, ready to receive)
│   │   ├── feedback/    message, status-indicator
│   │   ├── inputs/      checkbox, dropdown, switch, input-text, radio-button
│   │   ├── layout/      global-header, scroll-area, sidebar
│   │   ├── navigation/  link, menu-item, navigation-menu, tab-view
│   │   ├── overlay/     dialog, drawer, panel
│   │   └── utils/       spinner
│   └── buttons/, pricing-card, ...  (legacy convenience components — pre-pipeline)
├── core/
│   ├── form/            field-* (VeeValidate-based form fields)
│   ├── primevue/        thin PrimeVue wrappers — see .claude/docs/PRIMEVUE_ABSTRACTION.md
│   └── card/, list-data-table/, selector-block/
├── composables/         use-toast, use-dialog
├── directives/          tooltip
├── services/            primevue-api, markdown
├── plugins/             WebkitPlugin
├── svg/, styles/, vite/
```

Component creation under `components/webkit/**` is **always** driven by the pipeline at [`../../.claude/`](../../.claude/) — see [`../../.claude/commands/component-create.md`](../../.claude/commands/component-create.md). Other layers (`core/form/*`, `core/primevue/*`, etc.) follow their existing patterns.

## 2) Files agents must NOT edit without explicit human approval

- [`../../.claude/docs/DESIGN.md`](../../.claude/docs/DESIGN.md)
- [`../../.claude/docs/COMPONENT_REQUIREMENTS.md`](../../.claude/docs/COMPONENT_REQUIREMENTS.md)
- [`../../.claude/docs/PRIMEVUE_ABSTRACTION.md`](../../.claude/docs/PRIMEVUE_ABSTRACTION.md)
- `package.json` outside of the `exports` block (structural changes only with approval)
- `.github/workflows/governance.yml` (CI config)

## 3) Layer rules outside `components/webkit/**`

- **`core/form/*`** — VeeValidate-based form fields. Follow the existing pattern documented in [`../../.claude/docs/COMPONENT_REQUIREMENTS.md`](../../.claude/docs/COMPONENT_REQUIREMENTS.md) § Form Components. Do not migrate these to the webkit-layer pattern in the same change.
- **`core/primevue/*`** — thin PrimeVue wrappers. Read [`../../.claude/docs/PRIMEVUE_ABSTRACTION.md`](../../.claude/docs/PRIMEVUE_ABSTRACTION.md) before touching.
- **`composables/*`** — pure functions or Vue composables; document the API in TSDoc; export through the root `packages/webkit/package.json#exports` (one entry per public composable).
- **`directives/*`** — Vue directives re-exported (see [tooltip/](./src/directives/tooltip/)).

## 4) Validation gate (must pass before reporting done)

```bash
pnpm webkit:lint
pnpm webkit:type-check
pnpm webkit:type-coverage
pnpm storybook:build
```

Type coverage threshold: **95%**.

## 5) Dependency status (gotchas for the pipeline)

- **`@storybook/test`** — installed in `apps/storybook/package.json`. New stories may use `userEvent`/`expect`/`within` in a `play` function when the spec explicitly lists an Accessibility/play story.
- **`@figma/code-connect`** — installed; config at [`figma.config.json`](./figma.config.json). Authoring `.figma.ts` works locally; publishing requires `FIGMA_ACCESS_TOKEN`.
- **`cn` helper** — installed (`clsx` + `tailwind-merge`) at [`src/utils/cn.ts`](./src/utils/cn.ts), exported as `@aziontech/webkit/utils/cn`. Use it inside `:class` when the consumer must be able to override internal token choices.
- **`asChild` Slot helper** — **pending**. No helper exists yet. Do not import a phantom path — `validate-references.mjs` will block.

## 6) Common pitfalls

- **Tokenizing manually:** if Figma exposes a variable that has no equivalent in DESIGN.md, register a theme gap in the spec and use the closest primitive temporarily. Do not invent a HEX or hardcode a Tailwind palette.
- **Slots in the wrong layer:** monolithic components (button, icon-button, tag) do not expose slots. Card-pricing exposes `default` + named `actions` because the layout positions are fixed configuration points — not Composition Pattern.
- **Importing PrimeVue directly in apps:** consumer apps should not import from `primevue/*`. Re-export through `@aziontech/webkit/<name>` and follow PRIMEVUE_ABSTRACTION.md.
- **Typography raw classes leaking in:** `text-[length:var(--text-button-lg-font-size)]` and similar are legacy. New components always use the generated class (`text-button-lg`). `validate-tokens.mjs` only blocks **new** violations, so pre-existing legacy expressions are not retroactively flagged.
- **Hook blocking a legitimate edit:** read the stderr message — it states the rule that fired and how to fix it. The hooks fail open on unexpected errors and never silently break workflows.

---

For everything else — workflow, hard rules, isolated sub-agents, hook behavior, rules catalog — read [`../../.claude/AGENTS.md`](../../.claude/AGENTS.md) § 11 and the artifacts under [`../../.claude/`](../../.claude/).
