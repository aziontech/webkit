# Rule: Storybook "Show code" must be a runnable SFC

The Docs **"Show code"** panel is a contract with the consumer: whatever it shows must compile and render **as-is** when pasted into their app. It must express **100% of what the canvas renders** — same component, same props, same slot content — and nothing that does not run. This is non-negotiable.

A story that ships a "Show code" snippet the consumer cannot paste-and-run is a broken story, the same way a component that ignores its spec is a broken component.

## The rule

> Every story routes its `docs.source` through the shared helpers in [`apps/storybook/src/stories/_shared/story-source.js`](../../apps/storybook/src/stories/_shared/story-source.js). The emitted snippet is always a **single** runnable SFC: one `<script setup>` with the real `@aziontech/webkit/*` import(s), then one `<template>` whose tags are **PascalCase** and match those imports exactly. Never hand-roll a `docs.source.transform`.

## Why this rule exists

Storybook's dynamic Vue snippet has two defects that silently break copy-paste:

1. **It lowercases / kebab-cases the tag.** A `<Skeleton>` in the canvas is emitted as `<skeleton>`. Pasted into a consumer app, `<skeleton>` does not resolve to the imported component — it renders nothing (or a stray custom element).
2. **It already wraps the markup in `<template>`.** A naive `transform` that wraps again produces a nested `<template><template>…</template></template>` — invalid SFC structure.

Observed before this rule (a real story's "Show code"):

```vue
<script setup>
import Skeleton from '@aziontech/webkit/skeleton'
</script>

<template>
  <template>
    <skeleton animated height="100px" kind="shape" width="240px" />
  </template>
</template>
```

Two bugs in four lines: the duplicated `<template>` and the lowercase `<skeleton>` that does not match the `Skeleton` import. The shared helper exists so this is impossible to emit.

## The canonical pattern

> Import the helper relative to the story's own folder — `../../_shared/story-source` from `stories/components/<Category>/X.stories.js`, `../../../_shared/story-source` from `stories/components/<category>/<comp>/X.stories.js`. The enforcement hook matches the `_shared/story-source` suffix, so any correct depth passes.

```js
import Skeleton from '@aziontech/webkit/skeleton'
import { runnableDocs, toSfc } from '../../../_shared/story-source'

const IMPORT = "import Skeleton from '@aziontech/webkit/skeleton'"

const meta = {
  title: 'Components/Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: runnableDocs({
      component: 'A loading placeholder that reserves the space of content while it loads.',
      imports: IMPORT,
      components: ['Skeleton']
    })
  },
  argTypes: {
    /* ... */
  },
  args: {
    /* ... */
  }
}

export default meta

const Template = (args) => ({
  components: { Skeleton },
  setup: () => ({ props: args }),
  template: '<Skeleton v-bind="props" />'
})

// Arg-driven story: the transform inside runnableDocs restores the snippet.
export const Default = { render: Template }

// Composite story: supply the full SFC yourself with toSfc — PascalCase tags,
// no <template> in the body (toSfc adds the one wrapper).
const TYPES = `<div class="flex items-center gap-4">
  <Skeleton kind="shape" width="160px" height="20px" />
  <Skeleton kind="circle" width="40px" height="40px" />
</div>`

export const Types = {
  render: () => ({ components: { Skeleton }, template: TYPES }),
  parameters: {
    docs: { controls: { disable: true }, source: { code: toSfc(IMPORT, TYPES) } }
  }
}
```

- **`runnableDocs({ component, imports, components })`** sets `description.component`, `source.transform` (built from the shared `sfcTransform`), and `canvas.sourceState: 'shown'` in one call. Spread it into `parameters.docs`.
- **`toSfc(imports, body)`** wraps a `<template>` body in a runnable SFC. Use it for every composite story's `source.code`. The `body` must use **PascalCase** tags and must **not** contain its own `<template>` (one wrapper is added for you).
- **`components`** lists every PascalCase component name that appears in the markup, so the transform can restore each tag (`['Skeleton']`, `['EmptyState', 'Button', 'MiniButton']`, …).

## Hard prohibitions

1. **No hand-rolled `docs.source.transform`.** The only transform is the one `runnableDocs` / `sfcTransform` produces. A bespoke arrow risks re-introducing the double-`<template>` and lowercase-tag defects.
2. **No lowercase / kebab component tags in any `source.code` or template literal.** A tag must match its PascalCase import (`<Skeleton>`, never `<skeleton>` or `<skeleton-loader>`).
3. **No nested `<template>`.** `toSfc` adds exactly one wrapper; the body you pass must not contain `<template>`.
4. **No `v-bind="args"` / `v-bind="props"` leaking into the snippet.** The snippet shows concrete props, not the harness binding. (The dynamic transform expands args to attributes; composite `source.code` is written with concrete props.)
5. **`canvas.sourceState: 'shown'` is required** so the panel is open by default (`runnableDocs` sets it).
6. **The snippet must be complete and self-contained** — a `<script setup>` that imports every component used, and a `<template>` a consumer can paste without edits. No `// ...`, no placeholder identifiers, no missing imports.
7. **The snippet must match the canvas 1-to-1.** If the canvas renders a slot's content, the snippet shows that slot's content. "Show code" never shows less than what is rendered.

## Enforcement

[`validate-story-source.mjs`](../hooks/validate-story-source.mjs) (PostToolUse on `Write|Edit|MultiEdit`) blocks any `*.stories.@(js|jsx|ts|tsx)` write that:

- declares `docs` source config without importing the shared `story-source` helper;
- hand-rolls a `transform:` instead of using `sfcTransform` / `runnableDocs`;
- contains a lowercase/kebab tag of a component it imports PascalCase;
- contains a nested `<template>`;
- is missing `sourceState: 'shown'`.

On a violation the hook emits `BLOCKED:` with the offending lines and exits non-zero. As with the other validators, it only blocks **newly introduced** violations, so legacy stories are migrated as they are touched.

## Relationship to the storybook-write skill

[`.claude/skills/storybook-write/SKILL.md`](../skills/storybook-write/SKILL.md) is the authoring path; it emits stories already wired to `runnableDocs` / `toSfc`. This rule is the invariant the skill satisfies and the hook guards. When the two ever disagree, **this rule wins** — fix the skill.
