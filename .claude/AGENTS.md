# AGENTS.md

Guidelines for contributors and coding agents working in the Azion Webkit monorepo.

## 1) Monorepo context

This repository is a `pnpm` workspace with two top-level domains:

- `apps/*`: runnable applications (for documentation and tooling)
- `packages/*`: publishable/shared libraries used by Azion products

Current main workspaces:

- `apps/storybook`: visual documentation and component development environment
- `apps/icons-gallery`: icon browsing/validation app
- `packages/webkit`: reusable Vue component library (`@aziontech/webkit`)
- `packages/theme`: tokens, theme, and styling foundations (`@aziontech/theme`)
- `packages/icons`: icon font pipeline and package (`@aziontech/icons`)

## 2) Core principles

1. Preserve consistency with existing patterns before introducing new ones.
2. Make the smallest safe change that solves the problem.
3. Keep docs and stories updated when behavior or API changes.
4. Prefer semantic design tokens over hardcoded visual values.
5. Keep workspace commands reproducible from repository root.

## 3) Environment and tooling

- Node.js: `>= 22.18.0`
- Package manager: `pnpm` (workspace-first)
- Install dependencies from root only:

```bash
pnpm install
```

Prefer root scripts when available:

```bash
pnpm storybook:dev
pnpm storybook:build
pnpm storybook:preview
pnpm icons:build
```

## 4) Where to change what

- Webkit components: `packages/webkit/src/**`
- Theme tokens/styles: `packages/theme/**`
- Icons and generation pipeline: `packages/icons/**`
- Storybook stories/docs: `apps/storybook/src/stories/**`

When changing UI components in `packages/webkit`, update or add stories in Storybook in the same branch.

## 5) Component and styling standards

For `@aziontech/webkit` and Storybook content:

- Reuse established component patterns and naming conventions.
- Keep props semantic and explicit (avoid cryptic booleans when possible).
- Maintain backward-compatible defaults unless a breaking change is intentional.
- Use `@aziontech/theme` tokens/classes for colors, text, and surfaces.
- Avoid hardcoded hex colors in components when semantic tokens exist.
- Keep accessibility in mind (labels, states, disabled/readability, keyboard behavior).

## 6) Storybook standards

- Storybook is the source of truth for component behavior.
- Add clear examples for new states/props.
- Prefer docs-first pages for onboarding and conceptual guidance.
- Keep story titles and grouping consistent with existing sidebar taxonomy.
- For foundations docs, keep content practical and copy-paste friendly.

## 7) Git workflow and commits

- Create focused branches by context (examples: `feat/...`, `fix/...`, `docs/...`).
- Use conventional commit messages when possible:
  - `feat(...)`: new feature/enhancement
  - `fix(...)`: bug fix
  - `docs(...)`: documentation changes
  - `chore(...)`: maintenance
- Keep commits scoped and coherent (one context per commit).
- Never rewrite unrelated changes in a dirty working tree.

## 8) Validation checklist before push

Run the minimum relevant validations for the scope of your change.

- Storybook/docs change:
  - `pnpm storybook:build`
- Icons change:
  - `pnpm icons:build`
- Any change in `packages/webkit/src/components/webkit/**` (canonical webkit layer):
  - `pnpm webkit:lint`
  - `pnpm webkit:type-check`
  - `pnpm webkit:type-coverage`
  - `pnpm storybook:build`

If a full validation is too expensive, run targeted checks and document what was/was not validated.

## 9) Documentation expectations

When behavior changes, update docs close to the code:

- Root overview: `README.md`
- Storybook app docs: `apps/storybook/README.md`
- Package-level docs in each `packages/*/README.md`

For onboarding content, prioritize Storybook docs pages under `Foundations`.

## 10) Safety rules

- Do not commit secrets, credentials, or environment-specific private data.
- Do not perform destructive git operations without explicit approval.
- Avoid broad refactors during targeted fixes unless required for correctness.

## 11) Webkit Layer Components (mandatory for agents)

**Scope:** any file under `packages/webkit/src/components/webkit/**` (categories `actions`, `content`, `data`, `feedback`, `inputs`, `layout`, `navigation`, `overlay`, `utils`).

### 11.1) Sources of truth (read first)

- `.claude/docs/DESIGN.md` — typography (generated classes such as `text-heading-md`, `text-body-sm`, `text-button-lg`), spacing (`var(--spacing-*)` from `spacings.data.js` only), max-width (`var(--container-*)`), shape (`var(--shape-*)`), semantic colors. In any visual conflict, **DESIGN.md wins**.
- `.claude/docs/COMPONENT_REQUIREMENTS.md` § "Webkit Layer Pattern (in-depth)" — TypeScript pattern, JSDoc on props, naming conventions, controlled/uncontrolled states, typed slots, Composition Pattern criteria, `data-testid` BEM-style, class structure, ARIA, usability, light/dark, Code Connect, Storybook.
- Canonical components: `packages/webkit/src/components/webkit/actions/button/button.vue`, `packages/webkit/src/components/webkit/actions/icon-button/icon-button.vue`, `packages/webkit/src/components/webkit/content/card-pricing/card-pricing.vue`.
- External reference for Composition Pattern: [shadcn-vue.com/docs/components](https://www.shadcn-vue.com/docs/components).

### 11.2) Spec-driven workflow (mandatory)

The legacy monolithic skill `skills/component-create.md` has been **removed**. New components follow a spec-first pipeline with isolated sub-agents per phase.

**Two-step entry point:**

```text
/spec-create <name> [--category <category>] [--figma <url>]
# review .specs/<name>.md, mark status: approved (or let spec-validator do it)
/component-create <name> [--dry-run]
```

**What lives where:**

| Concern | Location |
|---|---|
| Per-component contract | [`.specs/<name>.md`](.specs/) (one file per component, reviewed BEFORE code) |
| Frontmatter schema | [`.specs/_schema.json`](.specs/_schema.json) |
| Spec template | [`.specs/_template.md`](.specs/_template.md) |
| Slash commands | [`.claude/commands/`](.claude/commands/) (`spec-create`, `component-create`, `component-verify`) |
| Focused skills (one per phase) | [`.claude/skills/`](.claude/skills/) — `spec-create`, `spec-validate`, `figma-discover`, `token-map`, `reuse-audit`, `structure-decide`, `component-scaffold`, `storybook-write`, `code-connect-write`, `validate-component`, `echo-report` |
| Isolated sub-agent prompts | [`.claude/agents/`](.claude/agents/) — one per skill, no chat history, no cross-talk |
| Immutable rules (injected verbatim) | [`.claude/rules/`](.claude/rules/) — `no-invention`, `migration`, `dependencies` |
| Centralized design docs (sources of truth) | [`.claude/docs/`](.claude/docs/) — `DESIGN.md` (tokens + animations + forbidden list), `COMPONENT_REQUIREMENTS.md` (component pattern + Storybook discipline), `PRIMEVUE_ABSTRACTION.md` |
| Run logs (audit trail) | [`.claude/logs/<run-id>.jsonl`](.claude/logs/) |

**How `/component-create` runs:**

1. **Preflight** — resolves `.specs/<name>.md`, validates checksum (tamper detection).
2. **spec-validator** (blocking) — schema, body, Constraints block, animation table.
3. **Parallel discovery** — `figma-extractor`, `reuse-auditor`, then `token-mapper`.
4. **Reconciliation** (blocking) — every token in spec exists in DESIGN.md; every Figma region is covered by the spec.
5. **scaffolder** — writes `.vue` + `package.json` + exports entry. Hooks fire on each Write.
6. **storybook-writer** — minimal stories only (Default + per kind + per size + Disabled).
7. **code-connect-writer** — skips if `@figma/code-connect` missing.
8. **echo-reporter** (cross-check) — independent parser; disagreement with the hook marks the run degraded.
9. **validate-component** — `pnpm webkit:lint && type-check && type-coverage && storybook:build`.
10. **Finalize** — `status: approved → implemented`, refresh checksum, close log.

**Why this is mandatory:** the previous workflow gave a single 749-line skill creative latitude — it sometimes added props, variants, or imports the user did not request. The new pipeline removes that latitude structurally: sub-agents see only the spec + their narrow rules; two hooks (`enforce-spec-exists`, `validate-spec-compliance`) verify the `.vue` matches the spec 1-to-1.

### 11.3) Auto-invoke triggers (mandatory — do not wait for the user to mention the skill)

- **Intent triggers (textual):** the user's request combines a creation verb (`criar`/`crie`/`gerar`/`adicionar`/`novo`/`create`/`add`/`make`/`build`) with a UI noun (`componente`/`component`/`button`/`botao`/`dialog`/`modal`/`drawer`/`sheet`/`tooltip`/`tabs`/`accordion`/`card`/`tag`/`badge`/`chip`/`input`/`select`/`dropdown`/`checkbox`/`radio`/`switch`/`spinner`/`toast`/`alert`/`message`/`breadcrumb`/`menu`/`popover`/`avatar`/`progress`/`skeleton`/`divider`) — or one of the categories (`actions`/`content`/`data`/`feedback`/`inputs`/`layout`/`navigation`/`overlay`/`utils`) — or any Figma reference (`figma.com/design/...`, `figma.com/proto/...`, "design", "frame", "mockup").
- **File triggers (context):** the agent is about to `Write`/`Edit` any of:
  - `packages/webkit/src/components/webkit/**/*.vue`
  - `packages/webkit/src/components/webkit/**/package.json`
  - new entries in `packages/webkit/package.json#exports` mapping `./<category>/<name>` to `src/components/webkit/`
  - new stories under `apps/storybook/src/stories/webkit/<category>/`

When any trigger matches, the agent must (a) announce that the trigger fired and which skill will run; (b) collect missing inputs (name, category, Figma URL, monolithic vs composition) before writing any file; (c) execute the skill's workflow from the top.

The trigger logic now lives in the orchestrator command [`.claude/commands/component-create.md`](.claude/commands/component-create.md) and the focused skill prompts under [`.claude/skills/`](.claude/skills/). Auto-invocation happens whenever the agent detects intent (creation verb + UI noun, Figma URL) or is about to `Write` under `packages/webkit/src/components/webkit/**`.

### 11.4) Hard rules (non-negotiable)

- **No hallucination — only reference things that exist.** Before importing any module, calling any function, mentioning any file path, or referencing any package/export in generated code, **verify it exists**:
  - `@aziontech/webkit/<subpath>` → must be present in [`packages/webkit/package.json#exports`](packages/webkit/package.json).
  - Relative imports → the target file (with `.vue`/`.ts`/`.js`/`/index.*` fallbacks) must exist on disk.
  - npm packages → must be installed in some `node_modules/` of the monorepo.
  - Workspaces → `packages/<name>/package.json` must exist.
  - If a needed module does **not** exist yet, do not import it speculatively. Either (1) install it first (`pnpm --filter <ws> add ...`), (2) create the file and its `package.json` entry first, or (3) annotate the gap explicitly in the report as `TODO: create <path>` or `TODO: install <pkg>` and skip the dependent code. The `validate-references.mjs` hook physically blocks imports that resolve to nothing — see § 12.
- New components use `<script setup lang="ts">` with `defineProps<...>()`, `defineEmits<...>()`, `defineSlots<...>()` and `defineModel<...>()` where applicable. JSDoc on every public prop. Zero `any`. Zero `// @ts-ignore`.
- Variants are always exposed as `kind`. Sizes as `size` (`'small' | 'medium' | 'large'`). Boolean state props have no `is`/`has` prefix.
- Typography is **always** applied via the generated class from DESIGN.md (`text-heading-md`, `text-body-sm`, etc.). Never `text-[length:var(--text-*)]`, `leading-*`, `tracking-*`, or `font-family` directly.
- Colors, spacing, max-width, and shape come from semantic `var(--*)` tokens. No hex, no Tailwind palette names (`bg-gray-*`), no PrimeVue color utilities (`text-color`, `surface-*`).
- `defineOptions({ name, inheritAttrs: false })` + `useAttrs()` + `rootClasses` that merges `attrs.class`. Never declare `class` in `defineProps`.
- `data-testid` hierarchical, BEM-style: root with fallback `'<category>-<name>'`, children with `${testId}__<part>` (two underscores).
- Composition Pattern only when the consumer needs to swap the order or omit parts (Dialog, Card composto, Tabs, Accordion, DropdownMenu, Sheet/Drawer, Form). When in doubt, stay monolithic. When applying it, ship the complete shadcn-vue anatomy (e.g. Dialog = Root + Trigger + Portal + Overlay + Content + Title + Description + Close).
- **shadcn-vue patterns** (see COMPONENT_REQUIREMENTS § 2.5-2.9):
  - **Available today** (use immediately): `data-state`/`data-disabled`/`data-orientation` on root and stateful sub-components; `VariantProps` exported as named exports (`export type ButtonKind = ...`); `cn` helper from `@aziontech/webkit/utils/cn` for class merging; `<name>.figma.ts` Code Connect mappings (config at `packages/webkit/figma.config.json`; publishing requires `FIGMA_ACCESS_TOKEN`); Storybook `play` functions via `@storybook/test`.
  - **Pending — Slot helper missing** (do NOT emulate; `validate-references.mjs` blocks fake imports): `asChild` prop on trigger-like sub-components. Propose a Slot composable under `packages/webkit/src/composables/` in a dedicated PR before adopting.
- WCAG 2.1 AA: visible focus, full keyboard navigation, minimum ARIA, contrast >=4.5:1 / >=3:1, `motion-reduce:*` on animated components, touch target >=40x40px.
- Light/dark validated via the `LightDark` Storybook story.
- Each new public component (including each Composition Pattern sub-component) receives its own entry in `packages/webkit/package.json#exports` and its own Storybook story.

### 11.5) Storybook story

Uses Storybook features fully: `argTypes` (with `control`, `description`, `table.defaultValue`) for every prop and `{ action: '...' }` for every event, `args`, `parameters.actions`/`a11y`/`docs`/`backgrounds`/`layout`, `decorators` when needed; stories Default + per `kind` + per `size` + Disabled + Loading + WithSlots/WithComposition + Controlled + Uncontrolled + **LightDark** + Accessibility (with `play` function via `@storybook/test`) + Playground.

### 11.6) Validation gate (must pass before reporting done)

```bash
pnpm webkit:lint
pnpm webkit:type-check
pnpm webkit:type-coverage
pnpm storybook:build
```

### 11.7) Forbidden shortcuts

- Skipping the `component-create` skill "because it is a small change".
- Adding hex colors, raw typography classes, or Tailwind palette names "until the theme catches up". Register a theme gap with `TODO: tokenizar` instead.
- Applying Composition Pattern reflexively. Use the decision rule: "does the consumer need to swap order or omit parts?"
- Removing `focus-visible`, `aria-*`, `data-testid`, `disabled` HTML, or `<a>`/`<button>` polymorphism to simplify code.
- Editing `.claude/docs/DESIGN.md`, `COMPONENT_REQUIREMENTS.md`, or `PRIMEVUE_ABSTRACTION.md` without explicit human approval (these are sources of truth).

For deeper, package-specific instructions, agents should also read [`packages/webkit/AGENTS.md`](packages/webkit/AGENTS.md) when working inside `packages/webkit/`.

## 12) Active enforcement (Claude Code hooks)

Five hooks in [`.claude/hooks/`](.claude/hooks/) act as physical guard rails on top of the cultural rules above. They are wired up in [`.claude/settings.json`](.claude/settings.json) and run automatically — the agent cannot bypass them.

### 12.1) Pre-existing (unchanged)

- **[`.claude/hooks/validate-tokens.mjs`](.claude/hooks/validate-tokens.mjs)** (PreToolUse `Write|Edit|MultiEdit`) — blocks new content introducing hex/rgb/hsl colors, Tailwind palette names, raw typography (`text-xs|sm|...`, `text-[length:var(--text-*)]`, `leading-*`, `tracking-*`, `font-family`), PrimeVue color utilities, `class` in `defineProps`, `any`, or `@ts-ignore`. Pre-existing violations are not retroactively flagged.
- **[`.claude/hooks/validate-references.mjs`](.claude/hooks/validate-references.mjs)** (PreToolUse `Write|Edit|MultiEdit`) — blocks imports that don't resolve: `@aziontech/webkit/<subpath>` without a matching `package.json#exports`, relative paths to no file, uninstalled npm packages, missing workspaces.
- **[`.claude/hooks/enforce-component-create.mjs`](.claude/hooks/enforce-component-create.mjs)** (PreToolUse `Write`) — blocks the first `Write` of a new `.vue` under `packages/webkit/src/components/webkit/<category>/<name>/` when the session transcript shows no reference to the `component-create` skill/command. Forces the agent to invoke the orchestrator first.

### 12.2) New — spec-driven enforcement

- **[`.claude/hooks/enforce-spec-exists.mjs`](.claude/hooks/enforce-spec-exists.mjs)** (PreToolUse `Write`) — blocks Writes of a webkit-layer `.vue` when `.specs/<name>.md` is missing, has `status ∉ {approved, implemented}`, or the body sha256 no longer matches the frontmatter `checksum` (tamper detection). Legacy components on the whitelist (`.claude/hooks/_lib/legacy-components.json`) bypass this hook.
- **[`.claude/hooks/validate-spec-compliance.mjs`](.claude/hooks/validate-spec-compliance.mjs)** (PostToolUse `Write|Edit|MultiEdit`) — re-reads the just-written `.vue`, parses `defineProps`/`defineEmits`/`defineSlots`/`defineOptions.name`/animation classes, and diffs them against `.specs/<name>.md`. Blocks on any divergence: missing prop, extra event, slot not in spec, animation class outside the Motion & Animations table, missing `motion-reduce:*` escape.

Shared parser library: [`.claude/hooks/_lib/spec.mjs`](.claude/hooks/_lib/spec.mjs). Legacy whitelist: [`.claude/hooks/_lib/legacy-components.json`](.claude/hooks/_lib/legacy-components.json).

When a hook blocks a Write, the stderr message states the rule that fired and how to fix it — replace the offending tokens, install the missing dep, create the missing file, fix the spec or the `.vue` so they match, or invoke the skill. The hooks **fail open** on unexpected errors (e.g. invalid JSON input) — they never silently break workflows.

These hooks make § 11.2 and § 11.4 enforceable in practice, not just by convention.

---

If in doubt, follow existing code style in the touched files, keep the change minimal, and leave the repository in a buildable and documented state.
