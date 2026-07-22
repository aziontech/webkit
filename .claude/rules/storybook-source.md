# Rule: Storybook "Show code" must be a runnable SFC

The Docs **"Show code"** panel is a contract with the consumer: whatever it shows must compile and render **as-is** when pasted into their app. It must express **100% of what the canvas renders** — same component, same props, same slot content — and nothing that does not run. This is non-negotiable.

A story that ships a "Show code" snippet the consumer cannot paste-and-run is a broken story, the same way a component that ignores its spec is a broken component.

## The rule

> Every story declares an **explicit** `parameters.docs.source.code`, built with `toSfc` from [`apps/storybook/src/stories/_shared/story-source.js`](../../apps/storybook/src/stories/_shared/story-source.js). `parameters.docs` is a plain **object literal**. The snippet is a single runnable SFC: one `<script setup>` with the real `@aziontech/webkit/*` import(s), then one `<template>` whose tags are **PascalCase** and match those imports exactly. Do **not** rely on Storybook's dynamic source (`source.transform` / `source.type: 'dynamic'`).

## Why this rule exists

Storybook's *dynamic* Vue source is unreliable for our components, in three independent ways:

1. **It lowercases / kebab-cases the tag.** Storybook reads the tag from the component's `__name`, which is the **.vue file name** (`skeleton.vue` → `<skeleton>`, `chips.vue` → `<chips>`), not the PascalCase import binding (`Skeleton`, `Chip`). A pasted `<skeleton>` / `<chips>` does not resolve.
2. **It double-wraps `<template>`.** Storybook already wraps the markup in `<template>`; a transform that wraps again yields a nested `<template><template>…</template></template>`.
3. **It silently falls back to the raw CSF object.** When `parameters.docs` is anything other than a plain object literal (e.g. a helper *call* like `someHelper({...})`), Storybook stops emitting the dynamic snippet and prints the **story object** verbatim:

   ```js
   { render: Template, parameters: { docs: { description: { story: '…' } } } }
   ```

An explicit `source.code` sidesteps all three: it is what the panel shows, verbatim, every time.

## The canonical pattern

```js
import Skeleton from '@aziontech/webkit/skeleton'

import { toSfc } from '../../../_shared/story-source' // adjust ../ to the story's depth

const IMPORT = "import Skeleton from '@aziontech/webkit/skeleton'"

const meta = {
  title: 'Components/Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    // docs is a plain OBJECT LITERAL — never a function call.
    docs: {
      description: { component: 'A loading placeholder that reserves space while content loads.' },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    /* ... */
  },
  args: { kind: 'shape', width: '240px', height: '100px', animated: true }
}

export default meta

const Template = (args) => ({
  components: { Skeleton },
  setup: () => ({ props: args }),
  template: '<Skeleton v-bind="props" />'
})

// Arg-driven story: controls drive the canvas; source.code shows canonical usage.
const DEFAULT_MARKUP = '<Skeleton kind="shape" width="240px" height="100px" animated />'

export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default rectangular placeholder with a pulse.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

// Composite story: render the const, show the SAME const — zero drift.
const TYPES_TEMPLATE = `<div class="flex items-center gap-4">
  <Skeleton kind="shape" width="160px" height="20px" />
  <Skeleton kind="circle" width="40px" height="40px" />
</div>`

export const Types = {
  render: () => ({ components: { Skeleton }, template: TYPES_TEMPLATE }),
  parameters: {
    docs: { controls: { disable: true }, source: { code: toSfc(IMPORT, TYPES_TEMPLATE) } }
  }
}
```

- **`toSfc(imports, body)`** wraps a `<template>` body in a runnable SFC. `imports` is the import line (or an array of lines). `body` uses **PascalCase** tags and contains **no** `<template>` (one wrapper is added for you).
- **Composite / state stories**: define the markup as a `const`, render it, and pass the same const to `toSfc` — the canvas and the snippet can never drift.
- **Arg-driven stories** (the interactive `Default`): keep `render: Template` so Controls drive the canvas, and set `source.code` to the canonical default usage. The default args are stable; if you change a default, update the markup too.
- **`canvas.sourceState: 'shown'`** (meta-level) opens the panel by default.

## Hard prohibitions

1. **`parameters.docs` is a plain object literal.** Never `docs: someHelper({...})` — Storybook then prints the raw story object instead of the snippet.
2. **No `docs.source.transform` / `source.type: 'dynamic'`.** The snippet comes from an explicit `source.code`.
3. **No lowercase / kebab component tags.** A tag matches its PascalCase import (`<Skeleton>`, never `<skeleton>`; `<Chip>`, never `<chips>`).
4. **No nested `<template>`.** `toSfc` adds exactly one wrapper; the body you pass must not contain `<template>`.
5. **No `v-bind="args"` / `v-bind="props"` in the snippet.** Show concrete props.
6. **Complete and self-contained.** A `<script setup>` that imports every component used, and a `<template>` a consumer can paste without edits. No `// ...`, no placeholders, no missing imports.
7. **Matches the canvas 1-to-1.** If the canvas renders a slot's content, the snippet shows that slot's content. "Show code" never shows less than what is rendered.

## Enforcement

[`validate-story-source.mjs`](../hooks/validate-story-source.mjs) (PreToolUse on `Write|Edit|MultiEdit`) blocks any `*.stories.@(js|jsx|ts|tsx)` write that:

- sets `parameters.docs` to a function call instead of an object literal;
- declares a `docs.source.transform` **or** `docs.source.type: 'dynamic'`;
- contains a lowercase/kebab tag of a **non-native** component it imports PascalCase (native HTML elements that share a component name — `<label>`, `<table>`, `<button>` — are allowed in slot markup);
- contains a nested `<template>`;
- imports a webkit component under a binding that does not match its export subpath (`import Chip from '@aziontech/webkit/chips'`) — see [`naming.md`](./naming.md);
- uses `parameters.actions.argTypesRegex`, the legacy CSF2 `Story.args = {…}` assignment form, or any Figma reference (`addon-designs`, `figma.com`);
- destructures or spreads the reactive `args` proxy (`const { … } = args` / `{ …args }`), which freezes it and silently breaks the Controls panel;
- omits the shared `story-source` import, `toSfc(...)`, or `canvas.sourceState`. Foundations catalog pages (`stories/foundations/*`) are exempt from the `toSfc`/helper requirement — they document tokens, not a component API — but must still keep `docs` a literal and set `canvas.sourceState: 'none'`.

The whole stories tree was migrated to this standard, so the hook enforces the full contract on **every** write — there is no "new violations only" grandfathering. Run `node .claude/hooks/validate-story-source.mjs --all` to audit the entire `apps/storybook/src/stories` tree at once (exits non-zero on any violation); wire it into CI or run it after bulk edits.

## Relationship to the storybook-write skill

[`.claude/skills/storybook-write/SKILL.md`](../skills/storybook-write/SKILL.md) is the authoring path; it emits stories already wired to `toSfc`. This rule is the invariant the skill satisfies and the hook guards. When the two ever disagree, **this rule wins** — fix the skill.
