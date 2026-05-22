---
name: code-connect-write
description: Generate the `<name>.figma.ts` Code Connect mapping. Skipped automatically when `@figma/code-connect` is not installed.
status: active
last_updated: 2026-05-22
---

# Skill: code-connect-write

## Purpose

Map Figma variants (kind / size / state) → Vue props, Figma slots → Vue children, and emit the snippet Dev Mode shows in the Figma file. The file lives next to the `.vue` at `packages/webkit/src/components/webkit/<category>/<name>/<name>.figma.ts`.

## When to invoke

- Step 6 of `/component-create`, after the scaffolder and storybook-write succeeded.

## Inputs

- The full text of `.specs/<name>.md` (Props, Events, Slots, States).
- The spec's `figma.node_id` (frontmatter).
- The orchestrator's confirmation that `@figma/code-connect` is installed (check `packages/webkit/package.json`).

## Workflow

1. **Pre-flight.** If `@figma/code-connect` is not in `packages/webkit/package.json` devDependencies, emit `SKIPPED: @figma/code-connect not installed` and exit. The orchestrator records this as a pending item.
2. **Load prerequisite skill.** Invoke `figma:figma-code-connect` (mandatory before any Code Connect tool call).
3. **Write `<name>.figma.ts`** using this skeleton (substitute spec values):

   ```ts
   import { figma } from '@figma/code-connect'
   import <PascalName> from './<name>.vue'

   figma.connect(<PascalName>, '<figma.url>', {
     props: {
       kind: figma.enum('kind', {
         primary: 'primary',
         secondary: 'secondary',
         outlined: 'outlined',
         text: 'text'
       }),
       size: figma.enum('size', {
         small: 'small',
         medium: 'medium',
         large: 'large'
       }),
       disabled: figma.boolean('disabled'),
       label: figma.children('label')
     },
     example: (props) => /* html */ `
       <${'<PascalName>'} :kind="${'${props.kind}'}" :size="${'${props.size}'}" :disabled="${'${props.disabled}'}">
         ${'${props.label}'}
       </${'<PascalName>'}>
     `
   })
   ```

4. **Stop.** Do not call `add_code_connect_map`, do not call `send_code_connect_mappings`, do not publish anything. Publishing requires `FIGMA_ACCESS_TOKEN` and is the user's call.

## Outputs

- `packages/webkit/src/components/webkit/<category>/<name>/<name>.figma.ts` (or `SKIPPED` line).

## Rules

- **Do not** invent Figma variants. The `figma.enum` keys must match the spec's prop values exactly.
- **Do not** publish. Authoring `.figma.ts` works without the token; publishing does not.
- **Do not** edit `figma.config.json`. It is already configured for `parser: "html"` and `include: ["src/**/*.figma.ts"]`.

## Fallbacks

- `@figma/code-connect` missing → emit `SKIPPED: dep missing`.
- Figma file lacks the variants the spec lists → emit `BLOCKED: figma variants mismatch spec: <list>`.

## Definition of Done

- [ ] Either `.figma.ts` file is written, **or** `SKIPPED: <reason>` is emitted.
- [ ] `figma.connect` references the actual `.vue` import and the spec's `figma.url`.
- [ ] Every prop in the spec has a `figma.*` mapping or is documented as not mapped.
- [ ] No publish call.
