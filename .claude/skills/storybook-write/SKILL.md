---
name: storybook-write
description: Write a minimal `.stories.js` for a webkit component using the canonical Button.stories.js shape. The spec lists Default + Types + Sizes + Loading + Disabled (only the state stories the component's prop set supports). Inject the spec's `## Usage` block into `parameters.docs.description.component` as a code snippet.
status: active
last_updated: 2026-05-27
---

# Skill: storybook-write

## Purpose

Generate `apps/storybook/src/stories/webkit/<category>/<name>/<PascalName>.stories.js` (or `apps/storybook/src/stories/webkit/<category>/<PascalName>.stories.js` for short-form locations) covering **only** the stories listed in the spec's "Stories (Storybook)" section. The canonical shape is the existing `Button.stories.js` — composite `Types` and `Sizes` stories plus state-specific stories (`Loading`, `Disabled`). The spec's `## Usage` block (import + minimal `<script setup>` + `<template>`) is injected verbatim into `parameters.docs.description.component`.

## When to invoke

- Step 5 of `/component-create`, after the scaffolder succeeded.

## Inputs

- The full text of `.specs/<name>.md`.
- The Constraints block (verbatim).
- [`.claude/docs/COMPONENT_REQUIREMENTS.md`](../../docs/COMPONENT_REQUIREMENTS.md), [`.claude/docs/DESIGN.md`](../../docs/DESIGN.md).
- The reference implementation: [`apps/storybook/src/stories/webkit/actions/button/Button.stories.js`](../../../apps/storybook/src/stories/webkit/actions/button/Button.stories.js).

## Workflow

1. **Read the spec.** Extract Props, Events, Slots, the Stories list, and the **`## Usage`** fenced code block (everything between the first ` ```vue ` and the next ` ``` ` inside the section; ignore HTML comments).
2. **Extract the Purpose paragraph** (first paragraph under `## Purpose`). Use it as the prose lead-in for `parameters.docs.description.component`.
3. **Build `parameters.docs.description.component`** as a single markdown string concatenating:
   - The Purpose paragraph (one line).
   - A blank line.
   - The literal heading `## Usage` followed by a blank line, then the `vue` fenced code block from the spec.

   Example (string literal — note the embedded newlines and the four-backtick fence to escape the inner triple-backtick block):

   ````js
   docs: {
     description: {
       component: [
         'Interactive control for user actions. Supports label text, optional icon, loading state, and link rendering when `href` is set.',
         '',
         '## Usage',
         '',
         '```vue',
         "<script setup>",
         "import Button from '@aziontech/webkit/actions/button'",
         '</script>',
         '',
         '<template>',
         '  <Button label="Click me" />',
         '</template>',
         '```'
       ].join('\n')
     }
   }
   ````

   Storybook's Docs page renders this markdown as a fenced code block under a `Usage` heading. The same `Usage` block is the source of truth for both spec and Docs; never copy-paste it elsewhere in the story file.

4. **Write the meta** following this template (substitute spec values):

   ```js
   import Component from '@aziontech/webkit/<category>/<name>'

   /** @type {import('@storybook/vue3').Meta<typeof Component>} */
   const meta = {
     title: 'Webkit/<Category>/<PascalName>',
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
       docs: {
         description: {
           component: /* the multi-line string built in step 3 */
         }
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

6. **Write the reusable render at module scope** — destructure event handlers off `args` so the `Template`-driven stories forward them via `@event` listeners:

   ```js
   const Template = (args) => ({
     components: { Component },
     setup() {
       const { onClick, ...props } = args
       return { props, onClick }
     },
     template: '<Component v-bind="props" @click="onClick" />'
   })
   ```

   - If the spec declares more than one event, destructure each one (`onClick`, `'onUpdate:open': onUpdateOpen`, …) and forward via the matching `@event="handler"` in the template.

7. **Write one story per item** in `spec.Stories`. The spec lists only the canonical set; do **not** add extras. For each, emit one of the two shapes:

   **Shape A — uses the reusable `Template` with an args delta (Default, Loading, Disabled):**

   ```js
   /** @type {import('@storybook/vue3').StoryObj<typeof Component>} */
   export const Default = {
     render: Template,
     parameters: {
       docs: { description: { story: 'Default primary button at large size.' } }
     }
   }

   export const Loading = {
     args: { loading: true, label: 'Button' },
     render: Template,
     parameters: {
       docs: { description: { story: 'Loading state with spinner replacing the icon.' } }
     }
   }

   export const Disabled = {
     args: { disabled: true, label: 'Button' },
     render: Template,
     parameters: {
       docs: { description: { story: 'Disabled state.' } }
     }
   }
   ```

   **Shape B — composite story with inline template (Types, Sizes):**

   ```js
   export const Types = {
     render: () => ({
       components: { Component },
       template: `
         <div class="flex flex-wrap items-center gap-4">
           <Component kind="primary" label="Button" />
           <Component kind="secondary" label="Button" />
           <Component kind="outlined" label="Button" />
           <Component kind="text" label="Button" />
         </div>
       `
     }),
     parameters: {
       docs: { description: { story: 'All kind variants side by side.' } }
     }
   }

   export const Sizes = {
     render: () => ({
       components: { Component },
       template: `
         <div class="flex flex-wrap items-center gap-4">
           <Component size="small" label="Button" />
           <Component size="medium" label="Button" />
           <Component size="large" label="Button" />
         </div>
       `
     }),
     parameters: {
       docs: { description: { story: 'All size variants side by side.' } }
     }
   }
   ```

   - **Allowed:** `Default`, `Types`, `Sizes`, `Loading`, `Disabled`.
   - **Skip** any story whose backing prop is not in `spec.Props` (e.g. no `loading` prop → no `Loading` story).
   - **Forbidden unless explicitly listed in the spec:** `LightDark`, `Accessibility` (with play), `Playground`, `WithSlots`, `WithComposition`, `Controlled`, `Uncontrolled`, one-story-per-variant (`Primary`, `Secondary`, …). Storybook's `autodocs` + `a11y` addon + `backgrounds` already cover dark/light, axe checks, and consumer-driven exploration via Controls.

## Outputs

- One file: `apps/storybook/src/stories/webkit/<category>/<PascalName>.stories.js` (mirror the component's actual storybook location — some components live under `webkit/<category>/<name>/`, others directly under `webkit/<category>/`).
- Nothing else.

## Rules

- **No HEX / Tailwind palette / raw typography** in story templates (some stories embed markup for slots).
- **No Figma references.** Do NOT add `parameters.design`, `parameters.figma`, links to Figma frames in `docs.description.component` / `docs.description.story`, or imports from `@storybook/addon-designs` / `storybook-addon-designs`. The Figma link is owned by `<name>.figma.ts` (Code Connect), not the story. Full rationale: [`.claude/docs/COMPONENT_REQUIREMENTS.md`](../../docs/COMPONENT_REQUIREMENTS.md).
- **`docs.description.component` is built from the spec.** The leading prose comes from `## Purpose`; the trailing `## Usage` heading + fenced code block comes verbatim from `## Usage`. No marketing copy, no design history, no Figma URLs, no hand-edited usage examples.
- **Do not duplicate the Usage snippet.** It lives in `parameters.docs.description.component` and nowhere else in the story file. Do not paste it into a story `description.story`, JSDoc, or comment.
- **Events keys are camelCase `on<EventName>`** in `argTypes`. Kebab-case keys silently break the Actions panel.
- **Do NOT use** `parameters.actions.argTypesRegex` (deprecated in Storybook 8). Declare each event explicitly.
- **Do NOT use** the legacy `Name.args = {...}` form. Always object-style CSF3.
- **Use `table.category`** to group controls (`'props'`, `'events'`, `'slots'`).
- **`control: false`** for slots and any uncontrollable arg.
- **`tags: ['autodocs']`** on meta to generate the Docs page.
- **`subcomponents`** when Composition Pattern.
- **`layout: 'centered'`** unless the component is full-width.

## Fallbacks

- Spec has no `## Usage` block (legacy spec being migrated) → emit `BLOCKED: spec missing ## Usage block` and stop. Do not invent a usage snippet.
- Spec.Stories lists a story name the skill does not recognize → emit it with `args: {}` and a `// TODO: define this story` comment.
- Spec lists `Types` but the component has only one `kind` (or `Sizes` with one `size`) → omit that story silently; record the divergence in the report.

## Definition of Done

- [ ] One `.stories.js` written at the canonical path.
- [ ] Meta has `title`, `component`, `tags: ['autodocs']`, `parameters` (`layout: 'centered'`, `backgrounds`, `a11y`, `docs`), `argTypes`, `args`.
- [ ] `parameters.docs.description.component` contains the Purpose paragraph **and** the `## Usage` heading + the `vue` fenced code block lifted verbatim from the spec.
- [ ] Every prop, event, and slot from the spec has an `argTypes` entry.
- [ ] Reusable `Template` declared once at module scope, destructuring event handlers off `args`.
- [ ] Every story from spec.Stories is exported in CSF3 object form — and nothing beyond that list is exported.
- [ ] Composite `Types` / `Sizes` stories use inline templates with side-by-side markup; state stories (`Loading`, `Disabled`) use the reusable `Template` with an args delta.
- [ ] No bespoke `LightDark` / `Accessibility (play)` / `Playground` / `WithSlots` / `Controlled` stories unless the spec explicitly listed them.
- [ ] No one-story-per-variant (`Primary`, `Secondary`, …) — `Types` is the canonical replacement.
- [ ] No `argTypesRegex`, no legacy `.args =` form.
- [ ] No `parameters.design` / `parameters.figma`, no Figma URLs anywhere in the file, no `@storybook/addon-designs` import.
- [ ] The `## Usage` snippet appears in exactly one place in the file (inside `docs.description.component`).
