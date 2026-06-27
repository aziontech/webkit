---
name: storybook-write
description: Write a minimal `.stories.js` for a webkit component using the canonical Button.stories.js shape. Stories are Default + one composite story per multi-option axis (Types / Sizes / Icons / …) + one story per mutually-exclusive state (Loading / Disabled / Filled / Invalid) — never one-story-per-variant. Give `parameters.docs.description.component` a short prose lead from `## Purpose`, keep `parameters.docs` a plain object literal, and give every story an explicit `source.code: toSfc(IMPORT, TEMPLATE)` (from `apps/storybook/src/stories/_shared/story-source.js`) so the Docs "Show code" panel is always a single runnable PascalCase SFC. See `.claude/rules/storybook-source.md`.
status: active
last_updated: 2026-06-24
---

# Skill: storybook-write

## Purpose

Generate `apps/storybook/src/stories/components/<category>/<name>/<PascalName>.stories.js` (or `apps/storybook/src/stories/components/<category>/<PascalName>.stories.js` for short-form locations) covering **only** the stories listed in the spec's "Stories (Storybook)" section. The canonical shape is the existing `Button.stories.js` — composite `Types` and `Sizes` stories plus state-specific stories (`Loading`, `Disabled`).

**"Show code" copy-paste-ready (canonical).** `parameters.docs.description.component` carries a **short prose lead** (the `## Purpose` paragraph) — NOT the spec's `## Usage` code block. The runnable usage is surfaced by the Docs **"Show code"** panel via an **explicit** `source.code` on every story, built with `toSfc` from [`apps/storybook/src/stories/_shared/story-source.js`](../../../apps/storybook/src/stories/_shared/story-source.js):

- Keep `parameters.docs` a plain **object literal** (a helper *call* there makes Storybook print the raw CSF story object). Set `description.component` (prose lead) and `canvas.sourceState: 'shown'` at the meta level.
- Give **every** story `parameters.docs.source.code: toSfc(IMPORT, TEMPLATE)`. For composite / state stories, define the markup as a `const`, render it, and pass the same const to `toSfc` (zero drift). For the arg-driven `Default`, keep `render: Template` and set `source.code` to the canonical default markup.

Do NOT use Storybook's dynamic source (`source.transform` / `source.type: 'dynamic'`) — it lowercases tags (`<skeleton>`, `<chips>`), double-wraps `<template>`, and falls back to the raw story object. The snippet MUST be a single runnable SFC whose tags match the import (PascalCase). Enforced by [`validate-story-source.mjs`](../../hooks/validate-story-source.mjs). Full rule: [`.claude/rules/storybook-source.md`](../../rules/storybook-source.md). (Reference: `Skeleton.stories.js`.)

## When to invoke

- Step 5 of `/component-create`, after the scaffolder succeeded.

## Inputs

- The full text of `.specs/<name>.md`.
- The Constraints block (verbatim).
- [`.claude/docs/COMPONENT_REQUIREMENTS.md`](../../docs/COMPONENT_REQUIREMENTS.md), [`.claude/docs/DESIGN.md`](../../docs/DESIGN.md).
- The reference implementation: [`apps/storybook/src/stories/components/actions/button/Button.stories.js`](../../../apps/storybook/src/stories/components/actions/button/Button.stories.js).

## Workflow

1. **Read the spec.** Extract Props, Events, Slots, the Stories list, and the **`## Usage`** fenced code block (everything between the first ` ```vue ` and the next ` ``` ` inside the section; ignore HTML comments).
2. **Extract the Purpose paragraph** (first paragraph under `## Purpose`). Use it — and only it — as `parameters.docs.description.component` (a short prose lead). Do **not** concatenate the spec's `## Usage` block into the description; the runnable usage is surfaced by the "Show code" panel (step 3).
3. **Wire the "Show code" panel via explicit `source.code`.** Read the spec's `## Usage` fenced block only to learn the component's canonical import line (`import <PascalName> from '@aziontech/webkit/<name>'`). Declare it once as `const IMPORT = "import <PascalName> from '@aziontech/webkit/<name>'"`, import `toSfc` relative to the story's folder (`../../_shared/story-source` or `../../../_shared/story-source` depending on depth). Keep `parameters.docs` a plain **object literal** at the meta level (description + `canvas.sourceState: 'shown'`), and give **every story** an explicit `source.code: toSfc(IMPORT, TEMPLATE)`:

   ```js
   import { toSfc } from '../../../_shared/story-source'

   const IMPORT = "import Button from '@aziontech/webkit/button'"

   // …meta.parameters — docs is a plain object literal, never a function call:
   docs: {
     description: {
       component:
         'Interactive control for user actions. Supports label text, optional icon, loading state, and link rendering when `href` is set.'
     },
     canvas: { sourceState: 'shown' }
   }
   ```

   **Do NOT use Storybook's dynamic source** (`source.transform` / `source.type: 'dynamic'`): it lowercases the tag (the .vue file name — `<button>`, `<chips>`), double-wraps `<template>`, and when `docs` is a function call it prints the raw CSF story object. **Do NOT set `parameters.docs` to a helper call** (`docs: runnableDocs({...})`) — same fallback. The reliable path is an explicit `source.code` per story.

   **Every story sets `source.code = toSfc(IMPORT, TEMPLATE)`.** For composite / state stories, define the markup as a `const`, render it, and pass the SAME const to `toSfc` (zero drift). For the arg-driven `Default`, keep `render: Template` and set `source.code` to the canonical default markup. The `TEMPLATE` body uses PascalCase tags and contains no `<template>` (toSfc adds the one wrapper). See step 7.

4. **Write the meta** following this template (substitute spec values):

   ```js
   import Component from '@aziontech/webkit/<name>'

   import { toSfc } from '../../../_shared/story-source'

   const IMPORT = "import Component from '@aziontech/webkit/<name>'"

   /** @type {import('@storybook/vue3').Meta<typeof Component>} */
   const meta = {
     title: 'Components/<Category>/<PascalName>',
     component: Component,
     // For Composition Pattern, expose subcomponents:
     // subcomponents: { <Root>Trigger, <Root>Content, ... },
     tags: ['autodocs'],
     parameters: {
       layout: 'centered',
       backgrounds: { default: 'dark' },
       a11y: {
         config: {
           rules: [
             { id: 'color-contrast', enabled: true },
             { id: 'focus-order-semantics', enabled: true }
           ]
         }
       },
       // docs is a plain OBJECT LITERAL — never a function call. Per-story source.code (step 7) carries the snippet.
       docs: {
         description: {
           component: /* the short Purpose prose from step 2 — NOT the Usage block */
         },
         canvas: { sourceState: 'shown' }
       }
     },
     argTypes: {
       /* one entry per spec.Props row + one per spec.Events row + one per spec.Slots row */
     },
     args: {
       /* sensible defaults from spec.Props.defaults */
     }
   }
   export default meta
   ```

   - `layout: 'centered'` is the canonical choice — same as `Button.stories.js`. Override to `'padded'` only when the component is full-width (header, sidebar, drawer).

5. **Build `argTypes`.** For each row:
   - **Props row.** `<name>: { control, options?, description, table: { type, defaultValue, category: 'props' } }`. Use `select` for union-literal types, `boolean` for booleans, `text` for strings, `number` for numbers.
   - **Events row.** Key is camelCase `on<EventName>` (e.g. `onClick`, `'onUpdate:open'`). Value is `{ action: '<emitted-name>', description, table: { type, category: 'events' } }`. **The key MUST be camelCase** — kebab-case keys silently fail in Vue 3.
   - **Slots row.** Key is the slot name. Value is `{ control: false, description, table: { type, category: 'slots' } }`.

6. **Write the reusable render at module scope** — forward `args` reactively. Storybook 8's `args` is a reactive proxy; destructuring it (`const { onClick, ...props } = args`) **silently breaks Controls** because the rest-spread freezes property references at setup time, so changing a control in the panel no longer updates the rendered story. The canonical pattern returns `args` itself and binds it directly:

   **Shape — stateless components (Button, Tag, etc.):**

   ```js
   const Template = (args) => ({
     components: { Component },
     setup() {
       return { args }
     },
     template: '<Component v-bind="args" />'
   })
   ```

   **Shape — stateful / v-model components (InputText, InputSelect, FieldText, Checkbox, RadioGroup, anything with `modelValue`):**

   The story MUST hold local state and explicitly forward the update so the field actually reflects user typing/selection AND the `update:modelValue` action fires in the Actions panel. Binding `v-bind="args"` alone makes `modelValue` a one-way prop — the field appears frozen.

   ```js
   const Template = (args) => ({
     components: { Component },
     setup() {
       const value = ref(args.modelValue ?? '') // or `[]` for multi-select, `false` for boolean
       watch(
         () => args.modelValue,
         (next) => {
           value.value = next ?? ''
         }
       )
       const onUpdate = (next) => {
         value.value = next
         args['onUpdate:modelValue']?.(next)
       }
       return { args, value, onUpdate }
     },
     template: '<Component v-bind="args" :model-value="value" @update:model-value="onUpdate" />'
   })
   ```

   - **Events are auto-wired for stateless components.** Vue 3 treats `onClick` / `onUpdate:open` properties on `v-bind` as event listeners, so any event declared in `argTypes` with `{ action: '<name>' }` is dispatched automatically via `v-bind="args"`. Do NOT manually wire `@click="onClick"` for events without local state.
   - **For v-model**, the auto-wiring still applies for the dispatch — but you also need a local `ref` so the field updates visually. Always call `args['onUpdate:modelValue']?.(next)` inside your update handler so the Action still fires.
   - **Composite stories carry context too.** Whenever a composite story (`Sizes`, `Types`, `Icons`, …) renders a stateful component, each instance gets its own local `ref` (or one shared ref when the spec intends them to be linked) and forwards updates the same way:

     ```js
     export const Sizes = {
       render: (args) => ({
         components: { Component },
         setup() {
           const small = ref('')
           const medium = ref('')
           const large = ref('')
           const log = (size) => (next) => args['onUpdate:modelValue']?.({ size, value: next })
           return { args, small, medium, large, log }
         },
         template: `
           <div class="flex flex-col gap-4 w-[280px]">
             <Component v-bind="args" size="small" placeholder="Small" v-model="small" @update:model-value="log('small')" />
             <Component v-bind="args" size="medium" placeholder="Medium" v-model="medium" @update:model-value="log('medium')" />
             <Component v-bind="args" size="large" placeholder="Large" v-model="large" @update:model-value="log('large')" />
           </div>
         `
       })
     }
     ```

   - **Slot composites and wrappers** follow the same rule — pass `args` through, and if the component is stateful, hold a local `ref` and call `args['onUpdate:modelValue']?.(next)` in the handler.
   - **Never** destructure `args`, spread its properties, or copy them into another reactive ref. Any indirection loses the proxy and breaks the Controls panel.

7. **Write one story per item** in `spec.Stories`. The spec lists only the canonical set; do **not** add extras. For each, emit one of the two shapes:

   **Shape A — uses the reusable `Template` with an args delta (Default, Loading, Disabled).** Controls drive the canvas; `source.code` shows the canonical usage for that state (a `const` markup reflecting the story's args):

   ```js
   const DEFAULT_MARKUP = '<Component kind="primary" size="large" label="Button" />'

   /** @type {import('@storybook/vue3').StoryObj<typeof Component>} */
   export const Default = {
     render: Template,
     parameters: {
       docs: {
         description: { story: 'Default primary button at large size.' },
         source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
       }
     }
   }

   const LOADING_MARKUP = '<Component label="Button" loading />'

   export const Loading = {
     args: { loading: true, label: 'Button' },
     render: Template,
     parameters: {
       docs: {
         description: { story: 'Loading state with spinner replacing the icon.' },
         source: { code: toSfc(IMPORT, LOADING_MARKUP) }
       }
     }
   }

   const DISABLED_MARKUP = '<Component label="Button" disabled />'

   export const Disabled = {
     args: { disabled: true, label: 'Button' },
     render: Template,
     parameters: {
       docs: {
         description: { story: 'Disabled state.' },
         source: { code: toSfc(IMPORT, DISABLED_MARKUP) }
       }
     }
   }
   ```

   **Shape B — composite story with inline template (Types, Sizes):**

   ```js
   const TYPES_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
     <Component kind="primary" label="Button" />
     <Component kind="secondary" label="Button" />
     <Component kind="outlined" label="Button" />
     <Component kind="text" label="Button" />
   </div>`

   export const Types = {
     render: () => ({ components: { Component }, template: TYPES_TEMPLATE }),
     parameters: {
       docs: {
         controls: { disable: true },
         description: { story: 'All kind variants side by side.' },
         // Composite: Storybook's dynamic source can't introspect this template —
         // toSfc wraps the SAME const so "Show code" matches the canvas exactly.
         source: { code: toSfc(IMPORT, TYPES_TEMPLATE) }
       }
     }
   }

   const SIZES_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
     <Component size="small" label="Button" />
     <Component size="medium" label="Button" />
     <Component size="large" label="Button" />
   </div>`

   export const Sizes = {
     render: () => ({ components: { Component }, template: SIZES_TEMPLATE }),
     parameters: {
       docs: {
         controls: { disable: true },
         description: { story: 'All size variants side by side.' },
         source: { code: toSfc(IMPORT, SIZES_TEMPLATE) }
       }
     }
   }
   ```

   > Define the template once as a `const`, reuse it for both `render`'s `template` and `toSfc(IMPORT, TEMPLATE)`, so they can never drift. The body uses PascalCase tags and contains no `<template>` (toSfc adds the one wrapper). Any story built from a raw multi-element `render` template (a row of variants, a `Toaster` + several trigger buttons, …) needs this explicit `source.code`.

   - **Always-composite stories.** Whenever a prop or slot has more than one meaningful option, render **one composite story** that shows every option side by side — never one story per option. Canonical composites and their backing concept:
     - `Types` — the `kind` prop (visual variants).
     - `Sizes` — the `size` prop.
     - `Icons` — the `iconLeft` / `iconRight` slots (or any pair/triple of icon-like slots) shown alone and combined.
     - `Slots` — for components with one slot whose content shape varies (long text, short, with leading content, etc.), if applicable.
     - Project-specific composites are allowed when the spec lists them with justification (e.g. `Densities`, `Tones`, `Placements`).
   - **One story per state** is correct only for **mutually-exclusive boolean states** that aren't variants of the same axis: `Loading`, `Disabled`, `Filled`, `Invalid`. These cannot be shown side by side because they would each need their own composite axis.
   - **Skip** any story whose backing prop/slot is not in `spec.Props` / `spec.Slots` (e.g. no `loading` prop → no `Loading` story; no second icon slot → no `Icons` composite, prefer a single inline example inside `Default` or a state story).
   - **Forbidden** — one story per variant value (`Small` + `Medium` + `Large`, `Primary` + `Secondary` + …) when a composite axis exists. Replace with `Sizes` / `Types`.
   - **Forbidden unless explicitly listed in the spec:** `LightDark`, `Accessibility` (with play), `Playground`, `WithSlots` (covered by the composite `Slots`/`Icons` pattern), `WithComposition`, `Controlled`, `Uncontrolled`. Storybook's `autodocs` + `a11y` addon + `backgrounds` already cover dark/light, axe checks, and consumer-driven exploration via Controls.

## Outputs

- One file: `apps/storybook/src/stories/components/<category>/<PascalName>.stories.js` (mirror the component's actual storybook location — some components live under `components/<category>/<name>/`, others directly under `components/<category>/`).
- Nothing else.

## Rules

- **No HEX / Tailwind palette / raw typography** in story templates (some stories embed markup for slots).
- **No Figma references.** Do NOT add `parameters.design`, `parameters.figma`, links to Figma frames in `docs.description.component` / `docs.description.story`, or imports from `@storybook/addon-designs` / `storybook-addon-designs`. The Figma link is owned by `<name>.figma.ts` (Code Connect), not the story. Full rationale: [`.claude/docs/COMPONENT_REQUIREMENTS.md`](../../docs/COMPONENT_REQUIREMENTS.md).
- **`docs.description.component` is a short prose lead from `## Purpose`** — one or two sentences. Do NOT embed the spec's `## Usage` block (or any static code snippet) in the description; the runnable usage comes from the "Show code" panel. No marketing copy, no design history, no Figma URLs.
- **Surface usage via an explicit `source.code`, not a pasted snippet.** Keep `parameters.docs` a plain object literal (meta-level `description.component` + `canvas.sourceState: 'shown'`); give **every** story `docs.source.code: toSfc(IMPORT, TEMPLATE)` from the same `const` it renders. **Never use `docs.source.transform` / `source.type: 'dynamic'`, never set `docs` to a function call, and never emit a lowercase/kebab tag** — the snippet must be a single runnable SFC whose tags match the PascalCase import. Enforced by `validate-story-source.mjs`; full rule in [`.claude/rules/storybook-source.md`](../../rules/storybook-source.md). Never paste the `## Usage` code into `description.component`, `description.story`, JSDoc, or a comment.
- **Events keys are camelCase `on<EventName>`** in `argTypes`. Kebab-case keys silently break the Actions panel.
- **Do NOT use** `parameters.actions.argTypesRegex` (deprecated in Storybook 8). Declare each event explicitly.
- **Do NOT use** the legacy `Name.args = {...}` form. Always object-style CSF3.
- **Use `table.category`** to group controls (`'props'`, `'events'`, `'slots'`).
- **`control: false`** for slots and any uncontrollable arg.
- **`tags: ['autodocs']`** on meta to generate the Docs page.
- **`subcomponents`** when Composition Pattern.
- **`layout: 'centered'`** unless the component is full-width.

## Fallbacks

- Spec has no `## Usage` block (legacy spec being migrated) → derive the `IMPORT` line from the component's export path (`@aziontech/webkit/<name>`) and proceed; note the missing block in the report. Build each story's `source.code` markup from its args/template.
- Spec.Stories lists a story name the skill does not recognize → emit it with `args: {}` and a `// TODO: define this story` comment.
- Spec lists `Types` but the component has only one `kind` (or `Sizes` with one `size`) → omit that story silently; record the divergence in the report.

## Definition of Done

- [ ] One `.stories.js` written at the canonical path.
- [ ] Meta has `title`, `component`, `tags: ['autodocs']`, `parameters` (`layout: 'centered'`, `backgrounds`, `a11y`, `docs`), `argTypes`, `args`.
- [ ] `parameters.docs.description.component` is the short `## Purpose` prose only (no embedded `## Usage` block / code snippet).
- [ ] `parameters.docs` is a plain object literal (meta-level `description.component` + `canvas.sourceState: 'shown'`) — NOT a function call. `toSfc` is imported from `_shared/story-source`. No `docs.source.transform` / `source.type: 'dynamic'` anywhere.
- [ ] Every composite / multi-element story (`Types`, `Sizes`, `Positions`, any multi-instance row, any raw-`render`-template story) sets `parameters.docs.source.code = toSfc(IMPORT, TEMPLATE)` from the same `const` it renders, so "Show code" shows all rendered elements — not a single arg-driven component.
- [ ] The "Show code" snippet is a single runnable SFC with **PascalCase** tags matching the import — no lowercase/kebab tag, no nested `<template>`. (Verified by `validate-story-source.mjs`.)
- [ ] Every prop, event, and slot from the spec has an `argTypes` entry.
- [ ] Reusable `Template` declared once at module scope, forwarding `args` reactively via `setup() { return { args } }` + `v-bind="args"` — NO destructuring, NO manual `@event` listeners for stateless components (events auto-wire through `v-bind` when declared in `argTypes` with `action`).
- [ ] **For v-model components**, every story (Default, composites, and state stories) holds a local `ref` synced from `args.modelValue` (via `watch` on `Template`, or fresh refs per instance in composites), binds it with `:model-value="value"` + `@update:model-value="onUpdate"`, and the handler calls `args['onUpdate:modelValue']?.(next)` so the Actions panel logs every change. Composite stories that render multiple stateful instances give each instance its own ref (or one shared ref if the spec links them) — never leave instances with a frozen `modelValue` from `v-bind="args"` alone.
- [ ] Every story from spec.Stories is exported in CSF3 object form — and nothing beyond that list is exported.
- [ ] Composite stories (`Types`, `Sizes`, `Icons`, …) use inline templates with side-by-side markup whenever a prop or slot has multiple meaningful options; mutually-exclusive boolean state stories (`Loading`, `Disabled`, `Filled`, `Invalid`) use the reusable `Template` with an args delta.
- [ ] No bespoke `LightDark` / `Accessibility (play)` / `Playground` / `WithSlots` / `Controlled` stories unless the spec explicitly listed them.
- [ ] No one-story-per-variant (`Small`/`Medium`/`Large`, `Primary`/`Secondary`/…, `WithLeadingIcon`/`WithTrailingIcon`) — the corresponding composite (`Sizes`, `Types`, `Icons`) is the canonical replacement.
- [ ] No `argTypesRegex`, no legacy `.args =` form.
- [ ] No `parameters.design` / `parameters.figma`, no Figma URLs anywhere in the file, no `@storybook/addon-designs` import.
- [ ] Every story (Default, composites, state stories) sets an explicit `docs.source.code: toSfc(IMPORT, TEMPLATE)` with PascalCase tags. No static `## Usage` snippet is pasted into `description.component`.
