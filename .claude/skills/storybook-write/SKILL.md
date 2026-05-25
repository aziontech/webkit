---
name: storybook-write
description: Write a minimal `.stories.js` for a webkit component using the canonical CSF3 template. Only the stories listed in the spec — and the spec is intentionally minimal (Default + per kind + per size + Disabled).
status: active
last_updated: 2026-05-22
---

# Skill: storybook-write

## Purpose

Generate `apps/storybook/src/stories/webkit/<category>/<PascalName>.stories.js` covering **only** the stories listed in the spec's "Stories (Storybook)" section. The spec is intentionally minimal: Default, one per `kind`, one per `size`, Disabled. Do **not** add LightDark, Accessibility play, Playground, WithSlots, Controlled/Uncontrolled, or anything else unless the spec explicitly lists it. Storybook's autodocs + a11y addon already cover those concerns from the meta.

## When to invoke

- Step 5 of `/component-create`, after the scaffolder succeeded.

## Inputs

- The full text of `.specs/<name>.md`.
- The Constraints block (verbatim).
- [`.claude/docs/COMPONENT_REQUIREMENTS.md`](../../docs/COMPONENT_REQUIREMENTS.md), [`.claude/docs/Design.md`](../../docs/Design.md).

## Workflow

1. **Read the spec.** Extract Props, Events, Slots, and the Stories list.
2. **Write the meta** following this template (substitute spec values):

   ```js
   import Component from '@aziontech/webkit/<category>/<name>'
   import { expect, userEvent, within } from '@storybook/test'

   /** @type {import('@storybook/vue3').Meta<typeof Component>} */
   const meta = {
     title: 'Webkit/<Category>/<PascalName>',
     component: Component,
     // For Composition Pattern, expose subcomponents:
     // subcomponents: { <Root>Trigger, <Root>Content, ... },
     tags: ['autodocs'],
     parameters: {
       layout: 'padded',
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
           component: '<one paragraph from spec.Purpose>'
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

3. **Build `argTypes`.** For each row:
   - **Props row.** `<name>: { control, options?, description, table: { type, defaultValue, category: 'props' } }`. Use `select` for union-literal types, `boolean` for booleans, `text` for strings, `number` for numbers.
   - **Events row.** Key is camelCase `on<EventName>` (e.g. `onClick`, `'onUpdate:open'`). Value is `{ action: '<emitted-name>', description, table: { type, category: 'events' } }`. **The key MUST be camelCase** — kebab-case keys silently fail in Vue 3.
   - **Slots row.** Key is the slot name. Value is `{ control: false, description, table: { type, category: 'slots' } }`.

4. **Write the reusable render at module scope:**

   ```js
   const Template = (args) => ({
     components: { Component },
     setup() { return { args } },
     template: '<Component v-bind="args" />'
   })
   ```

5. **Write one story per item** in `spec.Stories`. **Do not** add stories that aren't in the spec. The spec is minimal on purpose; respect it. For each, emit:

   ```js
   /** @type {import('@storybook/vue3').StoryObj<typeof Component>} */
   export const <PascalName> = {
     args: { /* delta from meta.args */ },
     render: Template,
     parameters: {
       docs: { description: { story: '<one sentence describing this story>' } }
     }
   }
   ```

   - Allowed: `Default`, one per `kind`, one per `size`, `Disabled`.
   - **Forbidden unless explicitly listed in the spec**: `LightDark`, `Accessibility` (with play), `Playground`, `WithSlots`, `WithComposition`, `Controlled`, `Uncontrolled`, `Loading`. Storybook's `autodocs` + `a11y` addon + `backgrounds` already cover dark/light, axe checks, and consumer-driven exploration via Controls. Adding bespoke stories for those is duplication.

## Outputs

- One file: `apps/storybook/src/stories/webkit/<category>/<PascalName>.stories.js`.
- Nothing else.

## Rules

- **No HEX / Tailwind palette / raw typography** in story templates (some stories embed markup for slots).
- **No Figma references.** Do NOT add `parameters.design`, `parameters.figma`, links to Figma frames in `docs.description.component`/`docs.description.story`, or imports from `@storybook/addon-designs` / `storybook-addon-designs`. The Figma link is owned by `<name>.figma.ts` (Code Connect), not the story. Full rationale: [`.claude/docs/COMPONENT_REQUIREMENTS.md`](../../docs/COMPONENT_REQUIREMENTS.md).
- **`docs.description.component` is one short paragraph** about the component API and when to use it. No marketing copy, no design history, no Figma URLs.
- **Events keys are camelCase `on<EventName>`** in `argTypes`. Kebab-case keys silently break the Actions panel.
- **Do NOT use** `parameters.actions.argTypesRegex` (deprecated in Storybook 8). Declare each event explicitly.
- **Do NOT use** the legacy `Name.args = {...}` form. Always object-style CSF3.
- **Use `table.category`** to group controls (`'props'`, `'events'`, `'slots'`).
- **`control: false`** for slots and any uncontrollable arg.
- **`tags: ['autodocs']`** on meta to generate the Docs page.
- **`subcomponents`** when Composition Pattern.

## Fallbacks

- `@storybook/test` not installed → omit the `play` function in the Accessibility story; record a pending item in the report.
- Spec.Stories lists a story name the skill does not recognize → emit it with `args: {}` and a `// TODO: define this story` comment.

## Definition of Done

- [ ] One `.stories.js` written at the canonical path.
- [ ] Meta has `title`, `component`, `tags: ['autodocs']`, `parameters` (`layout`, `backgrounds`, `a11y`, `docs`), `argTypes`, `args`.
- [ ] Every prop, event, and slot from the spec has an `argTypes` entry.
- [ ] Reusable `Template` declared once at module scope.
- [ ] Every story from spec.Stories is exported in CSF3 object form — and nothing beyond that list is exported.
- [ ] No bespoke `LightDark` / `Accessibility (play)` / `Playground` / `WithSlots` / `Controlled` stories unless the spec explicitly listed them.
- [ ] No `argTypesRegex`, no legacy `.args =` form.
- [ ] No `parameters.design` / `parameters.figma`, no Figma URLs anywhere in the file, no `@storybook/addon-designs` import.
