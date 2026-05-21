# Skill: component-create

## Metadata

- `name`: `component-create`
- `version`: `1.1.0`
- `owner`: `webkit-design-system`
- `status`: `active`
- `last_updated`: `2026-05-21`

## Trigger / Auto-invoke

**This skill MUST be auto-invoked by the agent whenever any of the signals below is detected. Do not wait for the user to mention the skill explicitly.**

### Textual triggers (intent matching)

The skill fires automatically when the user's request combines any of:

- **Creation verbs:** `create`, `add`, `make`, `build`, `new`, `criar`, `crie`, `gerar`, `gere`, `adicionar`, `adiciona`, `novo`, `nova`.
- **UI nouns:** `component`/`componente`, `button`/`botao`, `dialog`/`modal`, `drawer`/`sheet`, `tooltip`, `tabs`/`abas`, `accordion`/`acordeao`, `card`, `tag`, `badge`, `chip`, `input`, `select`/`dropdown`, `checkbox`, `radio`, `switch`, `spinner`, `toast`, `alert`/`message`, `breadcrumb`, `menu`, `popover`, `avatar`, `progress`, `skeleton`, `divider`.
- **Webkit category names:** `actions`, `content`, `data`, `feedback`, `inputs`, `layout`, `navigation`, `overlay`, `utils`.
- **Design / Figma references:** `figma`, `design`, `mockup`, `frame`, `prototype`, links like `figma.com/design/...` or `figma.com/proto/...`.

Examples of requests that trigger the skill:

- "I need a drawer in the webkit"
- "cria um card-banner em feedback"
- "add a tooltip following the standard"
- "new dialog in overlay, Figma link: ..."
- "generate a tabs component"
- "make a dropdown for the filters"

### Context triggers (file matching)

The skill also fires when the agent is about to create or edit any file under these globs:

- `packages/webkit/src/components/webkit/**/*.vue` (any Vue file, new or existing)
- `packages/webkit/src/components/webkit/**/package.json` (component-local `package.json`)
- A new entry in `packages/webkit/package.json#exports` mapping `./<category>/<name>` to `src/components/webkit/`
- A new story under `apps/storybook/src/stories/webkit/<category>/`

**Hard rule:** before any `Write` or `Edit` on those paths, the agent MUST have gone through this skill's Workflow — even for "small" requests (rename, add a prop, tweak a variant).

### When NOT to trigger

- Trivial comment-text changes.
- Updating `Last Updated` or other metadata-only edits.
- Migrating tokens in legacy components **outside** `src/components/webkit/` (use `/migracao-azion-theme` instead).
- Editing docs (`Design.md`, `COMPONENT_REQUIREMENTS.md`, `PRIMEVUE_ABSTRACTION.md`) — protected, requires explicit human approval.
- Internal refactors that do not touch props/emits/slots/data-testid/tokens.

### Expected agent behavior on trigger

1. **Acknowledge to the user:** "I detected a webkit-layer component request. I will follow the `component-create` skill at `skills/component-create.md`."
2. Collect any missing input (name, category, Figma URL, monolithic vs composition) before writing files.
3. Execute the Workflow below from step 1.
4. Do **not** write any file in the target folder before completing Workflow steps 1–5.

## Purpose

Create, in a single execution, the complete package of a new webkit-layer component under `packages/webkit/src/components/webkit/<category>/<name>/`: a typed TypeScript `.vue` file + local `package.json` + an entry in `packages/webkit/package.json#exports` + a Figma Code Connect file (only when its dependency is installed) + a Storybook story with the platform's full feature set. Follows the canonical files (button, icon-button, card-pricing). Applies the Composition Pattern (shadcn-vue style) only when justified. **The skill produces code, not just guidance.**

## Scope (what this skill owns vs. what it does not)

This skill is responsible for **scaffolding, contract, and integration**:

- Directory layout and `<name>.vue` + `package.json` + exports entry + Storybook story.
- TypeScript contract: `defineProps` / `defineEmits` / `defineSlots` / `defineModel`, typed variants, JSDoc on every public prop.
- Naming conventions (`kind`, `size`, boolean props without prefix, kebab-case events).
- BEM `data-testid`.
- Controlled / uncontrolled state, slot patterns, Composition Pattern decision.
- Storybook coverage (variants, states, light/dark, accessibility story).
- Accessibility and usability checklists.
- Structured report at the end.

This skill is **not** responsible for the design token system. **`packages/webkit/docs/Design.md`** is the single source of truth for typography classes, spacing, max-width, shape, and semantic colors. The skill **reads** Design.md and follows it; it never edits it and never restates its rules. The `validate-tokens.mjs` hook enforces Design.md at write time independently. The design team can iterate on Design.md without touching this skill.

When Design.md and any other source disagree, Design.md wins.

## Inputs

- **Component name** in kebab-case (e.g. `dialog`, `card-banner`, `drawer`). **Required.**
- **Target category** under `packages/webkit/src/components/webkit/`: `actions`, `content`, `data`, `feedback`, `inputs`, `layout`, `navigation`, `overlay`, `utils`. **Optional** — if the user does not provide one, infer the best fit from the component name and the Figma context using the taxonomy below, then **state the inferred category and ask the user to confirm** before writing any file:
  - `actions` — interactive elements that trigger an action (Button, IconButton, MenuItem, Link).
  - `content` — present static or derived information (CardPricing, Currency, Tag, Badge, Avatar, Chip).
  - `data` — display collections of data (DataTable, List, Tree, Calendar).
  - `feedback` — communicate state to the user (Message, Toast, StatusIndicator, Alert, Banner).
  - `inputs` — receive user input (InputText, Dropdown, Checkbox, RadioButton, InputSwitch, Slider).
  - `layout` — structure visual space (Container, Grid, Stack, Divider, Splitter, empty Card).
  - `navigation` — move the user between views/states (Breadcrumb, Tabs, Pagination, Steps, Menu, Sidebar nav).
  - `overlay` — temporarily overlay content (Dialog, Drawer, Sheet, Popover, Tooltip, ContextMenu).
  - `utils` — primitives reused internally by other components (Spinner, Portal helper).
- **Desired structure:**
  - `monolithic` — one `.vue` file with props + slots (default; used for atomic components and components with a fixed layout like `card-pricing.vue`).
  - `composition` — Composition Pattern with sibling sub-components (Dialog / composed Card / Tabs / Accordion / etc.).
- **Figma reference:** the frame URL or `nodeId` so the MCP `plugin:figma:figma` can extract variables and states.
- **Required sources of truth (the skill must read them before implementing):**
  - `packages/webkit/docs/Design.md` (typography classes, spacing, max-width, shape, semantic colors).
  - `packages/webkit/docs/COMPONENT_REQUIREMENTS.md` (general structure, `package.json`, exports).
  - `packages/webkit/docs/PRIMEVUE_ABSTRACTION.md` (when the component involves PrimeVue).
  - `packages/webkit/src/components/webkit/actions/button/button.vue` (canonical atomic interactive).
  - `packages/webkit/src/components/webkit/actions/icon-button/icon-button.vue` (atomic variation).
  - `packages/webkit/src/components/webkit/content/card-pricing/card-pricing.vue` (canonical monolithic with props + slots, BEM `data-testid`, typography via generated classes).
  - `packages/webkit/src/composables/` (reusable logic to check before creating new helpers).
  - `packages/theme/src/tokens/` (the universe of CSS vars and generated classes).
  - External reference: `https://www.shadcn-vue.com/docs/components` (Composition Pattern criterion).

## Outputs

All artifacts are **created or edited by the skill**, not just planned:

- `packages/webkit/src/components/webkit/<category>/<name>/<name>.vue` (TypeScript with `<script setup lang="ts">`).
- If `structure: composition`: sibling sub-components in the same directory (`<name>-trigger.vue`, `<name>-content.vue`, `<name>-title.vue`, etc., as applicable).
- `packages/webkit/src/components/webkit/<category>/<name>/package.json` (standard `main`/`module`/`types`/`browser./sfc`/`sideEffects:["*.vue"]`).
- New entries in `packages/webkit/package.json#exports` — one per public component.
- A shared composable under `packages/webkit/src/composables/<name>/{index.ts, package.json}` when reusable logic is extracted.
- `apps/storybook/src/stories/webkit/<category>/<Name>.stories.js` using Storybook's full feature set (argTypes, args, parameters.actions/a11y/backgrounds/docs/layout, decorators, stories Default / per kind / per size / Disabled / Loading / WithSlots / WithComposition / Controlled / Uncontrolled / LightDark / Accessibility / Playground).
- A `<name>.figma.ts` Code Connect file **only when** `@figma/code-connect` is installed; otherwise the gap is recorded in the report.
- **Final report** (Markdown; see § "Final report" below).

## Workflow

1. **Figma discovery** — invoke `/figma-use` (mandatory before any MCP write call). Call `mcp__plugin_figma_figma__get_variable_defs` + `get_design_context` on the target frame. Collect colors, typography, spacing, radius, shadows, states (default / hover / active / focus / disabled), and identify the regions (header / body / footer / actions) — this feeds the Composition vs Monolithic decision.

2. **Map tokens via Design.md** — consult [`packages/webkit/docs/Design.md`](../packages/webkit/docs/Design.md) and map each Figma variable to its Design.md equivalent (typography class, semantic CSS var, spacing/shape/container token). The skill does **not** restate Design.md rules; consult it directly for the catalog and applicability. If a Figma token has no Design.md equivalent, record a **theme gap** in the report with `TODO: tokenizar` and use the closest primitive temporarily. The `validate-tokens.mjs` hook independently enforces compliance at write time.

3. **Reuse audit (anti-duplication)** — before implementing, scan:
   - `packages/webkit/src/composables/` for existing logic (`use-toast`, `use-dialog`).
   - `packages/webkit/src/components/webkit/utils/` for utility sub-components (`spinner`).
   - `packages/webkit/src/components/webkit/` in the same category for components to reuse (e.g. `card-pricing.vue` reuses `Currency` and `Tag`).
   - `packages/theme/src/` for global animations/transitions.

   Any new reusable utility **must** live in a shared location — never inline in the component.

4. **Decide the structure — Composition Pattern only when it makes sense** (reference: `https://www.shadcn-vue.com/docs/components`):
   - **Composition (YES):** the consumer needs to reorder or omit parts — Dialog (`Dialog` / `DialogTrigger` / `DialogContent` / `DialogTitle` / `DialogDescription` / `DialogClose`), composed Card (`Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter`), Tabs, Accordion, DropdownMenu, Sheet/Drawer, Form fields.
   - **Monolithic with props + slots (NOT Composition):** fixed layout with variations driven by configuration plus narrow inversion via slots. Example: `card-pricing.vue`.
   - **Atomic:** Button, IconButton, Tag, Spinner, Badge, Currency — always monolithic, no slots.
   - Decision rule: "does the consumer need to **reorder or omit** parts the root exposes?" When in doubt, start monolithic.

5. **File scaffolding** — create the directory, the `.vue` files (root + sub-components when composition), and the local `package.json`.

6. **Implementation following the canonical pattern (typed TypeScript):**
   - `<script setup lang="ts">` before `<template>`.
   - `defineOptions({ name: 'PascalCase', inheritAttrs: false })`.
   - **Explicit types with JSDoc/TSDoc on every public prop:**

     ```ts
     type Kind = 'primary' | 'secondary' | 'outlined' | 'text'
     type Size = 'small' | 'medium' | 'large'

     interface Props {
       /** Visible label rendered inside the component. */
       label?: string
       /** Visual variant. Use `primary` for primary actions. */
       kind?: Kind
       /** Size token. Affects height, padding, and typography. */
       size?: Size
       /** Disables interaction and applies disabled token set. */
       disabled?: boolean
       /** Controlled open state. Use with `v-model:open`. */
       open?: boolean
       /** Initial open state when uncontrolled. */
       defaultOpen?: boolean
     }

     const props = withDefaults(defineProps<Props>(), {
       label: '',
       kind: 'primary',
       size: 'large',
       disabled: false,
       open: undefined,
       defaultOpen: false
     })

     const emit = defineEmits<{
       click: [event: MouseEvent]
       'update:open': [value: boolean]
     }>()

     defineSlots<{ default(): unknown; actions(): unknown }>()

     const openModel = defineModel<boolean>('open', { default: undefined })
     ```

   - `const attrs = useAttrs()` + `const testId = computed<string>(() => (attrs['data-testid'] as string | undefined) ?? '<category>-<name>')`.
   - Computed values for derived state (`isInactive`, `isAnchor`, `isOpen`), all typed.
   - Typed class maps: `const kindClasses: Record<Kind, string> = { ... }`, `const sizeClasses: Record<Size, string> = { ... }`. The **values** inside the maps (which tokens to use) come from Design.md — this skill does not enumerate them.
   - `rootClasses` computed combines `sharedClasses` + `kindClasses[kind]` + `sizeClasses[size]` + state classes + `attrs.class`.
   - **BEM `data-testid`:** root with fallback `'<category>-<name>'`; children with `${testId}__<part>` (two underscores): `__header`, `__title`, `__description`, `__actions`, `__action`, `__close`, `__loading`, `__icon`, `__panel`, `__backdrop`, `__error-message`.
   - `<a>`/`<button>` polymorphism when interactive + supports `href` (always `rel="noopener noreferrer"` for `_blank`).
   - **Controlled / uncontrolled state** (shadcn pattern) when applicable: controlled prop (default `undefined`) + `defaultProp` + `update:prop` emit + computed selecting between `defineModel` and an internal ref.
   - **Naming conventions:**
     - Visual variants always `kind` (never `variant` / `color` / `appearance`).
     - Sizes always `size` (`'small' | 'medium' | 'large'`).
     - Boolean state props without `is`/`has` prefix on the prop name (`disabled`, `loading`, `open`, `selected`, `expanded`).
     - Events emitted in kebab-case (`update:open`, `before-close`).
     - `defineModel<T>('propName')` for v-model on the principal prop.
   - **Clean code:** descriptive names, small functions, no `any`, no `// @ts-ignore`, imports sorted (Vue → @vueuse → internal webkit → relative), no complex logic inline in the template, no `<style>` (prefer Tailwind + CSS vars from Design.md).

   - **shadcn-vue patterns** (see `COMPONENT_REQUIREMENTS.md` § 2.5–2.9):
     - **Available today** (use immediately):
       - **`data-state` / `data-disabled` / `data-orientation`** on the root and on stateful sub-components, mirroring state for `data-[state=open]:bg-...` Tailwind variants. Common values: `open`/`closed`, `on`/`off`, `active`/`inactive`, `checked`/`unchecked`/`indeterminate`.
       - **`VariantProps`** exported as named exports from the `.vue` (`export type ButtonKind = 'primary' | 'secondary' | ...`, `export type ButtonSize = 'small' | 'medium' | 'large'`). Naming: `<ComponentName><PropName>`.
       - **`cn` helper** from `@aziontech/webkit/utils/cn` (built on `clsx` + `tailwind-merge`). Use it inside `rootClasses` when consumer-provided classes may need to override internal token choices (e.g. `cn(sharedClasses, kindClasses[kind], sizeClasses[size], attrs.class)`). For purely additive cases the array `[base, attrs.class]` is still fine.
       - **`<name>.figma.ts` Code Connect** — `@figma/code-connect` is installed and `figma.config.json` is set up. Generate the mapping for each new component. Publishing to Figma requires `FIGMA_ACCESS_TOKEN` in the environment; authoring works without it.
       - **`play` function in Storybook stories** — `@storybook/test` is installed. Import `userEvent`, `expect`, `within` from `@storybook/test` in the Accessibility/Playground story.
       - **Complete anatomy** for Composition Pattern (Root + Trigger + Portal + Overlay + Content + Title + Description + Close for Dialog, etc.) per shadcn-vue / Reka UI. Each public sub-component gets its own entry in `package.json#exports` and its own story.
     - **Pending — Slot helper still missing** (do NOT invent imports; the `validate-references.mjs` hook blocks them):
       - **`asChild` prop** on triggers/closes — depends on a Slot helper that does not exist yet. When needed, propose (a) creating the helper under `packages/webkit/src/composables/` in a dedicated PR after human approval, or (b) recording the gap in the report and omitting `asChild`.

7. **Composition Pattern (when applicable)** — sibling sub-components in the same directory follow the same root pattern (script setup lang=ts, inheritAttrs:false, useAttrs, rootClasses with attrs.class). Shared state via typed `provide`/`inject`:

   ```ts
   // <name>.vue (root)
   import type { InjectionKey, Ref } from 'vue'
   interface <Name>Context { close: () => void; testId: string; isOpen: Readonly<Ref<boolean>> }
   const <Name>InjectionKey: InjectionKey<<Name>Context> = Symbol('<Name>Context')
   provide(<Name>InjectionKey, { close, testId: testId.value, isOpen })

   // <name>-content.vue (sub)
   const ctx = inject(<Name>InjectionKey)
   ```

   Each public sub-component gets its own entry in `packages/webkit/package.json#exports`. Ship the complete anatomy (Trigger / Portal / Overlay / Content / Title / Description / Close as applicable).

8. **Accessibility (WCAG 2.1 AA)** — apply to the root and to each sub-component:
   - Correct HTML semantics (`<button>` / `<a>` / `<dialog>` / `<nav>` native before any `role=...`).
   - Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]`. Never strip the outline without a substitute.
   - Keyboard navigation: Tab/Shift+Tab; Enter/Space on buttons; Esc closes overlays; arrow keys on menus/lists/radio groups; focus trap in modals; focus returns to the trigger on close.
   - ARIA: `aria-label`, `aria-labelledby`/`aria-describedby`, `aria-busy`, `aria-disabled`, `aria-hidden="true"` on decorative icons, `aria-current`/`aria-selected`/`aria-expanded`, `aria-live="polite"` for dynamic feedback.
   - Contrast: ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state.
   - `prefers-reduced-motion`: `motion-reduce:transition-none motion-reduce:transform-none`.
   - Touch target ≥40×40 px; smaller sizes require justification.
   - Forms: `<label>` associated, `aria-describedby` for hint/error, `aria-invalid="true"` on error, message announced via `aria-live`.
   - Screen reader test (VoiceOver/NVDA) — the behavior must be announced clearly.

9. **Usability** — mandatory checklist:
   - States visually distinguishable without relying on color alone (use border, shadow, icon, pattern).
   - Feedback < 100 ms; loading on operations > 300 ms; progress on > 2 s.
   - Loading non-blocking (`cursor-loading` + `aria-busy`).
   - Errors actionable with a clear message.
   - Generous hit area (padding ≥ `var(--spacing-2)`).
   - i18n-ready (texts via props, supports long strings without breaking layout).
   - Consistency with components in the same category.
   - Clear affordance.

10. **Exports** — add to `packages/webkit/package.json#exports` keeping the existing alphabetic/category ordering:

    ```json
    "./<category>/<name>": "./src/components/webkit/<category>/<name>/<name>.vue",
    "./<category>/<name>-header": "./src/components/webkit/<category>/<name>/<name>-header.vue"
    ```

11. **Storybook (full feature usage)** — `apps/storybook/src/stories/webkit/<category>/<Name>.stories.js`:
    - Imports via `@aziontech/webkit/<category>/<name>`.
    - **Meta:** `title: 'Webkit/<Category>/<Name>'`; `component`; `subcomponents` when applicable; `tags: ['autodocs']`.
    - **`argTypes` for every prop** with appropriate `control` (`select`/`radio` with `options`, `boolean`, `text`, `number`, `color`), `description` (from the JSDoc), `table.defaultValue`.
    - **`argTypes` for every event** with `{ action: '<event-name>' }`.
    - **`args`** with sensible defaults for the Default story.
    - **`parameters`:**
      - `parameters.actions = { argTypesRegex: '^on[A-Z].*', handles: [...] }`.
      - `parameters.a11y` (addon) with WCAG rules.
      - `parameters.docs.description.component` plus `parameters.docs.description.story` for each story.
      - `parameters.backgrounds` with theme light/dark values.
      - `parameters.layout` (`'centered'` / `'fullscreen'`).
    - **`decorators`** when needed (theme provider, mount root, router).
    - **Mandatory stories:** Default + one per `kind` + one per `size` + Disabled + Loading (when applicable) + WithSlots / WithComposition + Controlled + Uncontrolled (when applicable) + **LightDark** + Accessibility + **Playground**.
    - `play` function on Accessibility (or Playground) using `@storybook/test` (installed). Import `userEvent`, `expect`, `within` from `@storybook/test`.
    - `render: (args) => ({ ..., setup() { return { args } }, template: '<Comp v-bind="args" />' })` so the controls actually drive the component.

12. **Figma Code Connect** — `@figma/code-connect` is installed and `packages/webkit/figma.config.json` is configured (`parser: "html"`, `include: ["src/**/*.figma.ts"]`). Generate `<name>.figma.ts` next to the `.vue` mapping Figma variants (`kind`, `size`, `state`) → Vue props, Figma slots → Vue children, and the snippet shown in Dev Mode. Use the `/figma-code-connect` skill as a prerequisite to call `add_code_connect_map`. Publishing the mapping to Figma requires `FIGMA_ACCESS_TOKEN`; authoring the `.ts` file works without it.

13. **Validation** — run:

    ```bash
    pnpm webkit:lint
    pnpm webkit:type-check
    pnpm webkit:type-coverage
    pnpm webkit:build:dts
    pnpm storybook:build
    ```

    Force `:hover` / `:focus-visible` / `:active` via DevTools. Test keyboard-only navigation. Validate the main story with VoiceOver. Confirm light/dark in the `LightDark` story.

14. **Final report** — emit a Markdown report using the structure in the next section. Do not declare the task done while any item is missing.

## Final report

The skill produces a Markdown report at the end. The structure is strict so the output is consumable by humans, follow-up PRs, and tooling. Sections marked with `(N)` show counts inline; tables fill any number of rows.

```markdown
# Component creation report

## Summary

- **Component:** `<category>/<name>`
- **Structure:** monolithic | composition (N sub-components)
- **Figma source:** `<frame URL or "ad-hoc, no Figma">`
- **Status:** ✅ Created | ⚠️ Created with N pending items | ❌ Blocked (rolled back)

## Files created (N)

- `<absolute path>` — <one-line purpose>
- ...

## Exports added (N)

- `./<category>/<name>` → `./src/components/webkit/<category>/<name>/<name>.vue`
- ...

## Tokens mapped (Figma → webkit)

| Figma variable  | Resolved to         | Source    |
| --------------- | ------------------- | --------- |
| color/surface   | `var(--bg-surface)` | Design.md |
| text/heading-md | `.text-heading-md`  | Design.md |
| spacing/4       | `var(--spacing-4)`  | Design.md |

## Theme gaps (N)

1. `<figma var>` — no semantic equivalent in `@aziontech/theme`. Temporarily using `<primitive>` with `// TODO: tokenizar`. Suggested follow-up: add `--<token-name>` under `packages/theme/src/tokens/semantic/`.

## Reused utilities

- `@aziontech/webkit/utils/spinner` — used in the loading state
- `@aziontech/webkit/content/tag` — used inside the header slot

## Pending items (dependencies not yet installed)

- [ ] **Figma Code Connect** — requires `@figma/code-connect`. Install: `pnpm --filter webkit add -D @figma/code-connect`. File to create afterwards: `<name>.figma.ts`.
- [ ] **Storybook `play` function** — requires `@storybook/test`. Install: `pnpm --filter storybook add -D @storybook/test`.
- [ ] **`cn()` helper for class merging** — requires `clsx` + `tailwind-merge`. Install: `pnpm --filter webkit add clsx tailwind-merge`. Create the helper, then add `"./utils/cn"` to `package.json#exports`.
- [ ] **`asChild` Slot helper** — requires a Slot helper under `packages/webkit/src/composables/`. Propose creation in a dedicated PR; do not import a phantom path.

## Validation

| Check                       | Result  | Detail                |
| --------------------------- | ------- | --------------------- |
| `pnpm webkit:lint`          | ✅ pass | 0 warnings            |
| `pnpm webkit:type-check`    | ✅ pass | —                     |
| `pnpm webkit:type-coverage` | ✅ pass | 97.2% (threshold 95%) |
| `pnpm webkit:build:dts`     | ✅ pass | declarations emitted  |
| `pnpm storybook:build`      | ✅ pass | build output OK       |

## Accessibility checklist (WCAG 2.1 AA)

- [x] Visible focus (`focus-visible:ring-2` + ring-offset against `--bg-canvas`)
- [x] Keyboard navigation tested (Tab / Shift+Tab / Enter / Space / Esc / arrow keys as applicable)
- [x] ARIA (`aria-label` / `aria-busy` / `aria-disabled` / `aria-hidden` / `aria-current` / `aria-expanded` as applicable)
- [x] Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled — verified in light and dark
- [x] `motion-reduce:*` respected on animated states
- [x] Touch target ≥40×40 px (or justified deviation)
- [x] Screen reader announcement clear (tested with VoiceOver / NVDA)
- [x] Forms: `<label>` associated, `aria-describedby`, `aria-invalid`, `aria-live` for errors (when applicable)

## Usability checklist

- [x] Distinct visual states (default / hover / focus / active / disabled / loading) — not relying on color alone
- [x] Feedback < 100 ms; loading on operations > 300 ms
- [x] Loading non-blocking (`cursor-loading` + `aria-busy`)
- [x] Errors actionable (clear message + state preserved when possible)
- [x] Hit area ≥ `var(--spacing-2)`
- [x] i18n-ready (texts via props, long strings without breaking)
- [x] Consistent terminology / iconography / spacing with neighbors in the category

## Suggested next steps

- Open a PR titled `feat(webkit): add <category>/<name>`.
- (optional) Install the pending dependencies above to unlock Code Connect, `play` tests, and the `cn()` helper.
- Validate visually with `pnpm storybook:dev`; confirm the `LightDark` story in both themes.
- Watch out for the active enforcement hooks (`.claude/hooks/*.mjs`) — they block tokens, references, and skill bypasses on retry.

## Rollback (if Status is ❌ Blocked)

When a hook or validation blocks completion:

1. Read the stderr message from the hook (it states the rule and the fix).
2. Roll back any partial file the skill wrote (the report lists them under "Files created").
3. Re-run the skill after fixing the root cause (install the dep, replace the token, etc.).
```

## Rules

0. **No hallucination — only reference things that exist.** Before importing any module, calling any function, or mentioning any path in generated code, **verify it exists**:
   - `@aziontech/webkit/<subpath>` must appear in [`packages/webkit/package.json#exports`](../packages/webkit/package.json).
   - Relative imports must resolve to an existing file (`.vue`/`.ts`/`.js`/`/index.*` fallbacks).
   - npm packages must be installed in some `node_modules/`.
   - Workspaces must have a matching `packages/<name>/package.json`.
   - If something does NOT exist, **do not invent it**: propose creation/installation, record the gap in the report, or skip the dependent piece. The `validate-references.mjs` hook physically blocks Writes with unresolved imports.
1. **Always TypeScript** for new components: `<script setup lang="ts">` with `defineProps<...>()`, `defineEmits<...>()`, typed variants, zero `any`.
2. **JSDoc/TSDoc mandatory on every public prop** — one line describing the purpose.
3. **Strict naming conventions:**
   - Visual variants always `kind`.
   - Sizes always `size` (`'small' | 'medium' | 'large'`).
   - Boolean props without `is`/`has` prefix.
   - Events emitted in kebab-case.
   - `defineModel<T>('propName')` for v-model.
4. **Controlled / uncontrolled state** (shadcn pattern) when the component owns relevant internal state (open / value / selected / expanded).
5. **Typed slots** with `defineSlots<...>()` when there is content inversion.
6. **Tokens via Design.md only** — typography uses the generated classes from Design.md; colors, spacing, max-width, and shape use semantic `var(--*)` from Design.md. The exact catalog and applicability live in Design.md; this skill does not restate them. The `validate-tokens.mjs` hook enforces compliance at write time.
7. **Never declare `class` in `defineProps`.** Use `attrs.class` via `useAttrs()` with `inheritAttrs: false`.
8. `<script setup>` always before `<template>`.
9. **Composition Pattern only when justified** (Dialog / Card / Tabs / Accordion / etc.); in doubt, monolithic. Atomic components are always monolithic.
10. **Do not duplicate utilities:** animations / classes / logic that can be reused live in `packages/theme/`, `packages/webkit/src/composables/`, or `packages/webkit/src/components/webkit/utils/`.
11. **Clean code:** descriptive names, small functions, no obvious comments, no dead code, sorted imports.
12. The directory, the `.vue` file, and `defineOptions.name` must agree (kebab-case on disk, PascalCase in `name`).
13. **Hierarchical BEM `data-testid`:** root with fallback `'<category>-<name>'`, children with `${testId}__<part>`.
14. Every variant declared in props has an entry in the class maps AND a dedicated story.
15. **`LightDark` story mandatory**, validating the component in both modes.
16. **Storybook complete:** `argTypes` / `args` / `parameters.actions` / `a11y` / `docs` / `backgrounds` / `layout` / `decorators` + `play` function on Accessibility (conditional on `@storybook/test`).
17. **Visible focus mandatory** with `focus-visible:ring-*` + ring-offset based on `--bg-canvas`.
18. **Comply with WCAG 2.1 AA** for contrast, focus, and keyboard operability.
19. **Figma Code Connect:** generate `<name>.figma.ts` for every new component. `@figma/code-connect` is installed; the helper lives next to the `.vue` and maps Figma variants → Vue props.
20. The category must exist under `packages/webkit/src/components/webkit/`; a new category requires justification.
21. **`asChild` prop** on trigger-like Composition Pattern sub-components (Trigger / Close): pending until a Slot helper exists. Until then, omit `asChild` and let the sub-component render its own element (`<button>`/`<a>`).
22. **`data-state` / `data-disabled` / `data-orientation`** on the root and stateful sub-components for Tailwind state variants (`data-[state=open]:...`).
23. **`VariantProps`** exported as named exports from the `.vue` (`export type ButtonKind = ...`); naming `<ComponentName><PropName>`.
24. **`cn` helper** from `@aziontech/webkit/utils/cn` for class merging when consumer classes may override defaults; the array `[base, attrs.class]` remains valid for purely additive cases.
25. **Complete anatomy** for Composition Pattern (Dialog = Root / Trigger / Portal / Overlay / Content / Title / Description / Close, etc.) per shadcn-vue / Reka UI.

## Guardrails

- Never create a component without discovering tokens in Figma first (exception: explicit "ad-hoc, no Figma" request recorded in the report).
- Never touch `packages/webkit/docs/COMPONENT_REQUIREMENTS.md`, `Design.md`, or `PRIMEVUE_ABSTRACTION.md` (the skill **reads** them, never edits).
- Never alter the root `package.json` or `.github/workflows/*`.
- Never create tests (webkit has no test suite yet); story + visual checklist cover validation.
- **Never close the skill** with the accessibility or usability checklist incomplete — unmet items become explicit pending entries in the report.
- **Never remove** `focus-visible`, `aria-*`, `data-testid`, the HTML `disabled` attribute, `<a>`/`<button>` polymorphism, or TS typing "to simplify".
- **Never use `any` or `// @ts-ignore`** in generated code.
- **Never create an inline animation/utility class** if it is generic enough to be shared.
- **Never bypass Design.md** for visual tokens (typography classes, semantic vars, spacing, max-width, shape). The hook `validate-tokens.mjs` enforces this independently; if it blocks, fix the value, do not work around it.
- **Never apply Composition Pattern reflexively** — check the decision rule: "does the consumer need to reorder or omit parts?"

## Fallbacks

- If the Figma MCP fails to respond or the frame has no variables, ask the user for a URL/screenshot and use `get_screenshot` to infer manually; record the gap.
- If a Figma token has no Design.md / CSS var equivalent, record a **theme gap** and use the closest primitive with `TODO: tokenizar`.
- If the target category is empty (first component in the category), call this out in the report.
- If a proposed shared utility doesn't fit any existing location, propose a new location (`packages/webkit/src/composables/<name>/` or `packages/webkit/src/components/webkit/utils/<name>/`) in the report — do not create it without confirmation.
- If the target Figma file does not support Code Connect (`@figma/code-connect` is installed, but the file lacks a valid `fileKey`/`nodeId`), skip the `<name>.figma.ts` mapping and record the gap. Authoring still works; only `figma:publish` requires `FIGMA_ACCESS_TOKEN`.
- If unsure about Composition Pattern, start monolithic and refactor later when a real use case appears.

## Definition of Done

All artifacts must be **created** by the skill at the end, not just planned:

- [ ] `packages/webkit/src/components/webkit/<category>/<name>/<name>.vue` created in typed TypeScript, with **JSDoc on every public prop**.
- [ ] When Composition Pattern: sibling sub-components created in the same directory with typed `provide`/`inject`.
- [ ] Local `package.json` created.
- [ ] Entries added to `packages/webkit/package.json#exports`.
- [ ] `<name>.figma.ts` (Code Connect) created next to the `.vue`.
- [ ] `apps/storybook/src/stories/webkit/<category>/<Name>.stories.js` created with full Storybook usage: meta with `argTypes`/`args`/`parameters`/`decorators`/`subcomponents`; stories Default + per `kind` + per `size` + Disabled + Loading + WithSlots/WithComposition + Controlled + Uncontrolled + **LightDark** + Accessibility (with `play` via `@storybook/test`) + Playground.
- [ ] Component matches the canonicals (`<script setup lang="ts">` first, `inheritAttrs: false`, `useAttrs`, BEM `testId`, typed class arrays, `rootClasses` with `attrs.class`, no HEX, no `any`, typography via generated Design.md classes).
- [ ] **Naming conventions** applied (`kind` / `size` / booleans without prefix, kebab-case events, `defineModel`).
- [ ] **Controlled/uncontrolled state** implemented when applicable.
- [ ] **Typed slots** with `defineSlots<...>()` when applicable.
- [ ] **shadcn-vue patterns** applied as appropriate: `data-state`/`data-disabled` on the root, `VariantProps` exported, `cn` helper from `@aziontech/webkit/utils/cn` when consumer classes may override defaults, complete anatomy for Composition Pattern. `asChild` deferred (pending Slot helper) without phantom imports.
- [ ] Reusable utilities extracted to shared locations.
- [ ] `pnpm webkit:lint && pnpm webkit:type-check && pnpm webkit:type-coverage && pnpm webkit:build:dts && pnpm storybook:build` all pass.
- [ ] `LightDark` story validates the component in both modes.
- [ ] Final report produced following the § "Final report" structure (Summary, Files created, Exports added, Tokens mapped, Theme gaps, Reused utilities, Pending items, Validation, Accessibility checklist, Usability checklist, Suggested next steps).

## Example

> **NOTE:** the example below describes an aspirational scenario to illustrate the output shape. None of the listed files (dialog.vue, dialog-trigger.vue, dialog.figma.ts, etc.) **exist** in the repository today — the skill would create them at execution time. All required dependencies (`@storybook/test`, `@figma/code-connect`, `clsx` + `tailwind-merge`) **are installed**; the only Pending item in a real run is `asChild` (Slot helper not yet available).

**User input (natural language):**

> "I need a Dialog in the webkit under `overlay`. Header with a title and close button, content, footer with primary/secondary actions. Support both controlled (`v-model:open`) and uncontrolled (`defaultOpen`), focus trap, ESC closes. Figma: figma.com/design/abc/?node-id=10-42"

**Invocation:**

```
/component-create dialog --category overlay --structure composition --figma figma.com/design/abc/?node-id=10-42
```

**Files created:**

```
packages/webkit/src/components/webkit/overlay/dialog/
  dialog.vue                    # root, defineModel('open'), provide context, data-state="open|closed"
  dialog-trigger.vue            # inject context; no asChild yet (Slot helper pending)
  dialog-portal.vue             # Teleport to body
  dialog-overlay.vue            # backdrop, data-state
  dialog-content.vue            # inject context, panel + focus trap, data-state
  dialog-title.vue              # text-heading-md
  dialog-description.vue        # text-body-sm text-[var(--text-muted)]
  dialog-close.vue              # inject context.close; no asChild yet
  injection-key.ts              # DialogInjectionKey + shared types
  package.json

apps/storybook/src/stories/webkit/overlay/Dialog.stories.js
```

**Complete anatomy** (shadcn-vue / Reka UI style): Root + Trigger + Portal + Overlay + Content + Title + Description + Close.

**Exports added (8):** `./overlay/dialog`, `./overlay/dialog-trigger`, `./overlay/dialog-portal`, `./overlay/dialog-overlay`, `./overlay/dialog-content`, `./overlay/dialog-title`, `./overlay/dialog-description`, `./overlay/dialog-close`.

**Named type exports** (in `dialog.vue`):

```ts
export type DialogSize = 'small' | 'medium' | 'large'
export type DialogState = 'open' | 'closed'
```

**Snippet from `dialog-title.vue`:**

```vue
<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'
  import { DialogInjectionKey } from './injection-key'

  defineOptions({ name: 'DialogTitle', inheritAttrs: false })
  defineSlots<{ default(): unknown }>()

  const ctx = inject(DialogInjectionKey)
  const attrs = useAttrs()
  const rootClasses = computed(() => ['text-heading-md text-[var(--text-default)]', attrs.class])
</script>

<template>
  <h2
    :class="rootClasses"
    :data-testid="`${ctx?.testId}__title`"
  >
    <slot />
  </h2>
</template>
```

**Consumer usage:**

```vue
<Dialog v-model:open="open">
  <DialogTrigger><Button label="Open" /></DialogTrigger>
  <DialogContent>
    <DialogTitle>Confirm action</DialogTitle>
    <DialogDescription>This cannot be undone.</DialogDescription>
    <Button kind="text" label="Cancel" @click="open = false" />
    <Button kind="primary" label="Confirm" @click="handleConfirm" />
    <DialogClose />
  </DialogContent>
</Dialog>
```

**Report snippet** (using the § "Final report" structure):

```markdown
# Component creation report

## Summary

- **Component:** `overlay/dialog`
- **Structure:** composition (8 sub-components)
- **Figma source:** `figma.com/design/abc/?node-id=10-42`
- **Status:** ⚠️ Created with 4 pending items

## Files created (10)

- `packages/webkit/src/components/webkit/overlay/dialog/dialog.vue`
- ... (and 8 siblings + package.json)
- `apps/storybook/src/stories/webkit/overlay/Dialog.stories.js`

## Tokens mapped (Figma → webkit)

| Figma variable  | Resolved to         | Source    |
| --------------- | ------------------- | --------- |
| color/surface   | `var(--bg-surface)` | Design.md |
| text/heading-md | `.text-heading-md`  | Design.md |
| spacing/6       | `var(--spacing-6)`  | Design.md |
| radius/card     | `var(--shape-card)` | Design.md |
| color/mask      | `var(--bg-mask)`    | Design.md |

## Theme gaps (1)

1. `color/overlay-shadow` — no semantic equivalent. Temporarily using `shadow-lg` primitive with `// TODO: tokenizar`.

## Pending items (4)

- [ ] **Figma Code Connect** — install `@figma/code-connect`, then create `dialog.figma.ts`.
- [ ] **Storybook `play` function** — install `@storybook/test`.
- [ ] **`cn()` helper** — install `clsx` + `tailwind-merge`, create `packages/webkit/src/utils/cn.ts`, add to exports.
- [ ] **`asChild` Slot helper** — propose a composable PR; until then `DialogTrigger` renders its own `<button>`.

## Validation

| Check                       | Result  | Detail               |
| --------------------------- | ------- | -------------------- |
| `pnpm webkit:lint`          | ✅ pass | 0 warnings           |
| `pnpm webkit:type-check`    | ✅ pass | —                    |
| `pnpm webkit:type-coverage` | ✅ pass | 97.2%                |
| `pnpm webkit:build:dts`     | ✅ pass | declarations emitted |
| `pnpm storybook:build`      | ✅ pass | build output OK      |
```
