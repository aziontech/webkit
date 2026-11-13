---
name: file-token-group
category: inputs
structure: monolithic
status: implemented
spec_version: 3
template: 2
checksum: f3ff7ca12140a91a6a6feb8e58d39f5f7c9c0cc36385de932f13d9347aac520a
created: 2026-11-11
last_updated: 2026-11-13
---

# FileTokenGroup — Component Spec

## Purpose

The files a person picked for upload, shown as removable tokens before or while they upload: each token names the file with a glyph for its type, its size and, when asked, its last-modified date, carries a progress bar while it uploads and its own error or warning line when it cannot be sent. It pairs with `file-dropzone` (which receives the files) and with a Browse files button: the product keeps the list, the group renders it and reports which token was removed. Taken from Cloudscape's file token group; the Console Kit and the design sample list files by hand.

## When to use

- Under a `FileDropzone` or a Browse files button in a form, to show what will be uploaded and let the person drop a file before submitting.
- In an upload dialog, to show each file's progress and the files that were refused (too large, wrong type) with the reason.
- Read-only, in a review step, to list the attachments that will be sent.

## When NOT to use

- A running transfer that should follow the person around the console → use `upload-progress`.
- Files already stored in a bucket or a repository → use `table` (the file browser block).
- Free-text tags or labels → use `tag-editor` or `chip`.

## Related

- `file-dropzone` — receives dropped files; the group lists them.
- `upload-progress` — the floating card for transfers that keep running after the dialog closes.
- `chip` — a removable label without file details.

## Best practices

- Keep the refused files in the list with their error, so the person sees why and can remove them; do not drop them silently.
- Write each error as the reason and the limit (`Larger than 300 MB`), not as a code.
- Use `limit` when more than five files are common, so the form below stays in view.
- Remove the file from your list on `dismiss`; the group moves focus to the next token for you.

## Usage

```vue
<script setup>
  import FileTokenGroup from '@aziontech/webkit/file-token-group'
  import { ref } from 'vue'

  const items = ref([
    { file: { name: 'logo.svg', size: 4210, type: 'image/svg+xml' } },
    { file: { name: 'backup.tar', size: 412000000 }, error: 'Larger than 300 MB' }
  ])
</script>

<template>
  <FileTokenGroup
    :items="items"
    @dismiss="(_event, { index }) => items.splice(index, 1)"
  />
</template>
```

## Props

| Prop                   | Type                         | Default      | Required | JSDoc                                                                         |
| ---------------------- | ---------------------------- | ------------ | -------- | ----------------------------------------------------------------------------- |
| `items`                | `FileTokenGroupItem[]`       | `[]`         | false    | The files, in order; each with its optional upload state, error and warning.  |
| `alignment`            | `'vertical' \| 'horizontal'` | `'vertical'` | false    | Vertical stacks full-width tokens; horizontal wraps compact tokens in rows.   |
| `limit`                | `number`                     | `0`          | false    | Shows this many tokens and a Show more toggle for the rest. 0 shows them all. |
| `showFileSize`         | `boolean`                    | `true`       | false    | Shows the size beside the name, formatted for the locale.                     |
| `showFileLastModified` | `boolean`                    | `false`      | false    | Shows the last-modified date, formatted for the locale.                       |
| `readonly`             | `boolean`                    | `false`      | false    | Hides the remove buttons; the list is for reading only.                       |
| `ariaLabel`            | `string`                     | `''`         | false    | Accessible name of the list. Empty uses the locale catalog (`Files`).         |

Types: `FileTokenGroupFile = { name: string; webkitRelativePath?: string; size?: number; type?: string; lastModified?: number }`; `FileTokenGroupItem = { file: File | FileTokenGroupFile; loading?: boolean; progress?: number; error?: string; warning?: string }`. `progress` is 0–100; `loading` without `progress` shows an indeterminate bar.

## Events

| Event     | Payload                                   | Notes                                                                                      |
| --------- | ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| `dismiss` | `(event: MouseEvent, payload: { index: number; item: FileTokenGroupItem })` | The remove button of the token at `index` was pressed. The parent removes it from `items`. |

## Slots

_none_

## States

- Root `data-alignment`: `vertical` | `horizontal`; `data-readonly` when read-only.
- Token `data-status`: `idle` | `loading` | `warning` | `error` (error wins over warning, both over loading).
- Show more toggle: `aria-expanded` `true` | `false`.
- A file with a `webkitRelativePath` (picked with a folder picker or dropped as a folder on `FileDropzone directories`) is named by that path (`site/css/main.css`) in the token, its title, the remove button and the progress bar; otherwise by `name`.

## Motion & Animations

| Trigger         | Animation / Transition                                        | Token                                           | Reduced-motion fallback         |
| --------------- | ------------------------------------------------------------- | ----------------------------------------------- | ------------------------------- |
| token hover     | `transition-colors duration-fast-02 ease-productive-entrance` | duration `fast-02`, curve `productive-entrance` | `motion-reduce:transition-none` |
| progress change | inherited from `progress` (`transition-[width]`)              | duration `moderate-02`                          | inherited                       |

## Tokens

| Region        | Token                                                                               |
| ------------- | ----------------------------------------------------------------------------------- |
| token surface | `var(--bg-surface)`, border `var(--border-default)`, radius `var(--shape-elements)` |
| error token   | border `var(--danger-border)`, text `var(--danger-contrast)`                        |
| warning token | border `var(--warning-border)`, text `var(--warning-contrast)`                      |
| name / meta   | `var(--text-default)` / `var(--text-muted)`                                         |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The root is a `ul` (`role="list"`) named by `ariaLabel` or the catalog; each token is a `li`.
- Each remove button is an `IconButton` named `Remove <file name>`; its `aria-describedby` points at the token's error or warning line, so the reason is read with it.
- Keyboard map: Tab reaches each remove button and the Show more toggle in order; Enter or Space removes. After a removal focus moves to the remove button now at the same index, else the previous one, else the list itself (`tabindex="-1"`).
- An error or warning is shown as text with an icon, never by colour alone (WCAG 1.4.1); the uploading bar is a `progressbar` named `Uploading <file name>`.
- Contrast: name and meta ≥ 4.5:1 on `--bg-surface` in both themes; the danger border ≥ 3:1.

## Internationalization

| Key                        | English source                                                | Override prop |
| -------------------------- | ------------------------------------------------------------- | ------------- |
| `fileTokenGroup.label`     | Files                                                         | `ariaLabel`   |
| `fileTokenGroup.remove`    | Remove {name}                                                 | —             |
| `fileTokenGroup.uploading` | Uploading {name}                                              | —             |
| `fileTokenGroup.modified`  | Modified {date}                                               | —             |
| `fileTokenGroup.showMore`  | `Show {count} more file` / `Show {count} more files` (plural) | —             |
| `fileTokenGroup.showFewer` | Show fewer files                                              | —             |

- Formatting: sizes with `formatFileSize`, dates with `formatDate` (`dateStyle: 'medium'`), both from `useLocale`.

## Right-to-left

- Layout: logical utilities only (`ms-auto`, `ps-`, `text-start`); the remove button sits at the inline end.
- Icons: file glyphs and the cross are not mirrored.
- Keyboard: Tab order follows the reading order.
- User data: file names render in `<bdi>` so a Latin name keeps its order inside rtl text.

## Responsive

- Container queries: none; vertical tokens fill their container, horizontal tokens are at most `--container-3xs` wide and wrap.
- Narrow: names truncate with an ellipsis and keep the full name in `title`.
- Touch: the remove button is a small `IconButton` (32 px), 44 px hit area on `pointer: coarse` through the button.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: see `.size-limit.json` entry `file-token-group`.
- Runtime budget: 200 tokens render in < 30 ms; use `limit` beyond that.
- Heavy parts: none.

## Examples

- Default — four files, one refused with its error and one with a warning.
- Uploading — justified: tokens with determinate and indeterminate progress.
- Horizontal — justified: the wrapping layout with `limit`.

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
