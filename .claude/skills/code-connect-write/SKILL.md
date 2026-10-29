---
name: code-connect-write
description: Generate the `<name>.figma.ts` Code Connect mapping. Skipped automatically when `@figma/code-connect` is not installed.
status: active
last_updated: 2026-10-27
scope: webkit
enforced_by: [no-invention, prop-vocabulary, naming]
---

# Skill: code-connect-write

## Purpose

Map Figma variants (kind / size / state) → Vue props, Figma slots → Vue children, and emit the snippet Dev Mode shows in the Figma file. The file lives next to the `.vue` at `packages/webkit/src/components/<category>/<name>/<name>.figma.ts`.

## When to invoke

- Step 6 of `/component-create`, after the scaffolder and storybook-write succeeded.

## Inputs

- The full text of `.specs/<name>.md` (Props, Events, Slots, States).
- The spec's `figma.node_id` (frontmatter).
- The orchestrator's confirmation that `@figma/code-connect` is installed (check `packages/webkit/package.json`).

## Workflow

1. **Pre-flight.** If `@figma/code-connect` is not in `packages/webkit/package.json` devDependencies, emit `SKIPPED: @figma/code-connect not installed` and exit. The orchestrator records this as a pending item.
2. **Load prerequisite skill.** Invoke `figma:figma-code-connect` (mandatory before any Code Connect tool call).
3. **Read the Figma properties.** Call `get_context_for_code_connect` on the spec's `figma.node_id`. It must be a COMPONENT or COMPONENT_SET; a frame id is a spec defect → `BLOCKED: figma.node_id is not a component`. Property names are case-sensitive and are copied verbatim. Webkit Figma properties mirror the code: names are lowerCamelCase (`showIcon`, `state`, `modelValue`) and variant options are lowercase (`size=large`, `disabled=true`). A capitalized or spaced name in Figma is a library defect to report, not a name to copy.
4. **Write `<name>.figma.ts`** as a **parserless template** — never `figma.connect()`, never `@figma/code-connect/html`, never a `.vue` import:

   ```ts
   // url=https://www.figma.com/design/<fileKey>/<FileName>?node-id=<X-Y>
   // source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/<category>/<name>/<name>.vue
   // component=<PascalName>
   import figma from 'figma'

   const instance = figma.selectedInstance

   const label = instance.getString('label')
   const kind = instance.getEnum('kind', {
     primary: 'primary',
     secondary: 'secondary'
   })
   const disabled = instance.getEnum('disabled', {
     false: false,
     true: true
   })

   export default {
     example: figma.code`<<PascalName>
     label="${label}"${kind === 'primary' ? '' : figma.code`
     kind="${kind}"`}${disabled ? figma.code`
     disabled` : ''}
   />`,
     imports: ["import <PascalName> from '@aziontech/webkit/<name>'"],
     id: '<name>',
     metadata: { nestable: true }
   }
   ```

   - The three `// url=` / `// source=` / `// component=` lines are Code Connect directives and must lead the file; no other comment is allowed.
   - `import figma from 'figma'` is the only import (the runtime rejects any other).
   - Every `getEnum` lists **every** variant option Figma reports; interaction-only variants (`State=Hover/Focus/Pressed`) are not mapped.
   - Emit a prop only when it differs from its `withDefaults` default; never emit a name the `.vue` does not declare.
   - Vue syntax: PascalCase tag, kebab-case attributes, `:` for non-string values, `v-model` for a primary `defineModel`. Composition components import the compound and use dot-notation.
   - Children: SLOT → `instance.getSlot()`, INSTANCE_SWAP → `instance.getInstanceSwap()`, nested webkit instances → `instance.findInstance()`; check `type === 'INSTANCE'` and interpolate `executeTemplate().example` inside `figma.code`.
5. **Verify.** `pnpm --filter @aziontech/webkit run figma:parse` lists the file with no `❌`.
6. **Stop.** Do not call `add_code_connect_map`, do not call `send_code_connect_mappings`, do not publish anything. Publishing requires `FIGMA_ACCESS_TOKEN` and is the user's call.

## Outputs

- `packages/webkit/src/components/<category>/<name>/<name>.figma.ts` (or `SKIPPED` line).

## Rules

- **Do not** invent Figma variants. The `getEnum` keys are Figma's option names verbatim; the values are the spec's prop values.
- **Do not** publish. Authoring `.figma.ts` works without the token; publishing does not.
- **Do not** edit `figma.config.json`. It is already configured for parserless templates (`label: "Vue"`, `language: "html"`, `include: ["src/**/*.figma.ts"]`).

## Fallbacks

- `@figma/code-connect` missing → emit `SKIPPED: dep missing`.
- Figma file lacks the variants the spec lists → emit `BLOCKED: figma variants mismatch spec: <list>`.

## Definition of Done

- [ ] Either `.figma.ts` file is written, **or** `SKIPPED: <reason>` is emitted.
- [ ] The file is a parserless template: leading `// url=` (the spec's component node), `// source=`, `// component=`; `import figma from 'figma'` only.
- [ ] Every Figma property has an `instance.*` mapping or is documented as not mapped.
- [ ] `figma:parse` reports the file with no `❌`.
- [ ] No publish call.
