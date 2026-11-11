---
name: tag-editor
category: inputs
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 632e2420d5b1fc1dfaea3aecf3f7e70136e63563e0d1f2bf0c613e3467ec70dd
created: 2026-11-11
last_updated: 2026-11-11
---

# TagEditor — Component Spec

## Purpose

Key and value tags of one resource, after Cloudscape's tag editor, built on `AttributeEditor`. It adds what tags need on top of the rows: key and value suggestions while typing, a tag limit (50 by default) that ignores tags marked for removal, the built-in key checks (required when the row has a value, unique, length, allowed characters, no reserved `azion:` prefix), and a removal that only marks a saved tag, with Undo, until the form is saved.

## When to use

- The Tags section of a create or settings form of any resource.
- Labels used for cost allocation, ownership or search, where keys repeat across resources and suggestions help keep them consistent.

## When NOT to use

- Environment variables, headers or any pairs without tag rules → use `attribute-editor`.
- Showing tags read-only → use `tag` (or `key-value-pairs`).
- Picking from a fixed list of labels → use `multi-select`.

## Related

- `attribute-editor` — the rows, Add, Remove, limit text, focus and announcements underneath.
- `input` — key and value controls; suggestions come from a native `datalist`.
- `tag` — how the saved tags read outside the editor.
- `platform/states/form-error` — the rule for server errors passed through `errors`.

## Best practices

- Mark saved tags with `existing: true`: their key is read-only, and Remove marks them `markedForRemoval` (Undo puts them back) so the save request knows what to delete.
- Call the exposed `validate()` on Save; it also flags empty keys, which are not flagged while typing.
- Feed `keySuggestions` with the keys already used in the account so tags stay consistent.
- Pass server errors per row through `errors`; they replace the built-in message of that cell.
- Keep the default `limit` unless the backend has another one.

## Usage

```vue
<script setup>
  import TagEditor from '@aziontech/webkit/tag-editor'
  import { ref } from 'vue'

  const tags = ref([
    { key: 'team', value: 'payments', existing: true },
    { key: 'environment', value: 'staging' }
  ])
  const editor = ref(null)
  const save = () => {
    if (!editor.value?.validate()) return
  }
</script>

<template>
  <TagEditor
    ref="editor"
    v-model:tags="tags"
    :key-suggestions="['team', 'environment', 'owner']"
    aria-label="Resource tags"
  />
</template>
```

## Props

| Prop               | Type                       | Default    | Required | JSDoc                                                                                                                   |
| ------------------ | -------------------------- | ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| `tags`             | `TagEditorTag[]`           | `[]`       | false    | Tags being edited. Saved tags carry `existing`; Remove marks them `markedForRemoval` until Undo. Supports v-model:tags. |
| `keySuggestions`   | `string[]`                 | `[]`       | false    | Keys offered while typing a key, for example the keys already used in the account.                                      |
| `valueSuggestions` | `Record<string, string[]>` | `{}`       | false    | Values offered per key while typing a value.                                                                            |
| `limit`            | `number`                   | `50`       | false    | Most tags allowed; tags marked for removal do not count.                                                                |
| `keyMaxLength`     | `number`                   | `128`      | false    | Longest key allowed, in characters.                                                                                     |
| `valueMaxLength`   | `number`                   | `256`      | false    | Longest value allowed, in characters.                                                                                   |
| `reservedPrefix`   | `string`                   | `'azion:'` | false    | Prefix reserved for the platform; keys may not start with it. Empty allows every prefix.                                |
| `errors`           | `TagEditorErrors`          | `[]`       | false    | Server errors per row, aligned with `tags`; shown in place of the built-in checks.                                      |
| `disabled`         | `boolean`                  | `false`    | false    | Disables every control.                                                                                                 |
| `ariaLabel`        | `string`                   | `''`       | false    | Accessible name of the list of tags. Empty uses the locale catalog.                                                     |

Types: `TagEditorTag = { key: string; value: string; existing?: boolean; markedForRemoval?: boolean }`; `TagEditorErrors = ({ key?: string; value?: string } | undefined)[]`. Exposed: `validate(): boolean`.

## Events

| Event         | Payload          | Notes                                                             |
| ------------- | ---------------- | ----------------------------------------------------------------- |
| `update:tags` | `TagEditorTag[]` | A tag was added, edited, removed, marked for removal or restored. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `empty`, `at limit` (Add disabled), `invalid` (per cell), `marked for removal` (controls disabled, a muted note, Undo), `disabled`
- Saved tags (`existing`) render the key read-only.

## Motion & Animations

_none_

## Tokens

| Region                  | Token (DESIGN.md)                    |
| ----------------------- | ------------------------------------ |
| marked-for-removal note | `.text-body-sm`, `var(--text-muted)` |
| everything else         | inherited from `attribute-editor`    |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: every control keeps its own ring.
- Keyboard map: as `attribute-editor`; suggestions open with the browser's native `datalist` keys (ArrowDown, Enter, Escape).
- ARIA: rows, labels, errors and announcements come from `attribute-editor`; Undo is named "Undo removal of tag n"; a marked tag keeps a visible note ("This tag will be removed when you save.").
- Contrast ≥4.5:1 from the semantic text tokens.
- Touch target: Remove and Undo are 32 px buttons (`medium`).

## Internationalization

| Key                          | English source                                         | Override prop                    |
| ---------------------------- | ------------------------------------------------------ | -------------------------------- |
| `tagEditor.label`            | Tags                                                   | `ariaLabel`                      |
| `tagEditor.key` / `value`    | Key / Value                                            | —                                |
| `tagEditor.keyPlaceholder`   | Enter key                                              | —                                |
| `tagEditor.valuePlaceholder` | Enter value                                            | —                                |
| `tagEditor.add`              | Add new tag                                            | —                                |
| `tagEditor.remove`           | Remove tag                                             | —                                |
| `tagEditor.undo`             | Undo                                                   | —                                |
| `tagEditor.undoLabel`        | Undo removal of tag {index}                            | —                                |
| `tagEditor.markedForRemoval` | This tag will be removed when you save.                | —                                |
| `tagEditor.empty`            | No tags associated with the resource.                  | —                                |
| `tagEditor.remaining`        | You can add {count} more tag(s) (plural)               | —                                |
| `tagEditor.limitReached`     | You have reached the limit of {limit} tags.            | —                                |
| `tagEditor.keyRequired`      | Enter a key.                                           | —                                |
| `tagEditor.keyDuplicate`     | This key is already used by another tag.               | —                                |
| `tagEditor.keyReserved`      | Keys cannot start with "{prefix}".                     | `reservedPrefix`                 |
| `tagEditor.keyInvalid`       | Use letters, numbers, spaces and + - = . _ : / @ only. | —                                |
| `tagEditor.tooLong`          | Use {max} characters or fewer.                         | `keyMaxLength`, `valueMaxLength` |

- Formatting: the tags left go through the plural rules of the active locale. Allowed key characters include letters of every script (`\p{L}`).

## Right-to-left

- Layout: inherited from `attribute-editor` (logical utilities only).
- Icons: the trash glyph is not mirrored.
- Keyboard: no arrow-key handling of its own.
- User data: keys and values keep the direction of their own text.

## Responsive

- Container queries: inherited from `attribute-editor` (cells side by side from `@md`, stacked below).
- Narrow (≤ 640 px or a narrow container): stacked key and value with their own labels.
- Touch: nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: see `.size-limit.json` entry `tag-editor` (it carries `attribute-editor`).
- Runtime budget: 50 tags validate on every keystroke under one frame (one pass to count keys).
- Heavy parts: none.

## Examples

- Default — saved and new tags with key and value suggestions.
- Validation — reserved prefix, duplicated key and a tag marked for removal, with `validate()` on Save; justified because the built-in checks are the component's reason to exist.

## Decisions and open questions

- **Suggestions use a native `datalist`.** It is accessible and costs nothing; the `Combobox` component being built in parallel can replace it later without changing the API.
- **Saved keys are read-only.** Renaming a saved key is a remove plus an add, as in Cloudscape.
- **Empty keys are flagged on `validate()`, not while typing**, so a new row does not start red (form-error rule: show required errors after Save).

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
