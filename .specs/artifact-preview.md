---
name: artifact-preview
category: ai
structure: monolithic
status: implemented
spec_version: 2
template: 2
checksum: ab5a5db5a0643f6fece55904a93f32f443683d283d068ec77a794466f7af6989
created: 2026-11-11
last_updated: 2026-11-13
---

# ArtifactPreview — Component Spec

## Purpose

A card for something the assistant generated — a file, a code snippet, a table, a configuration
(Cloudscape artifact previews, AI Elements Artifact). The header names it (title, description,
metadata such as size or format, a file-type icon) and carries its actions: Copy (when `copyValue` is
set), Download (when `downloadHref` is set) and Open (when `openable`, emitting `open` so the owner
shows the full artifact in a side panel — Cloudscape's canvas preview). The body holds a short inline
preview (Cloudscape's inline preview): the first lines of code, the first rows of a table.

## When to use

- The assistant produced an artifact the reader may copy, download or open: a rules file, a CSV export, a command, a generated function.

## When NOT to use

- Short code inside the prose of a response → fenced code in `StreamingResponse` (rendered as `CodeBlock`).
- A resource that already exists in the product → link to its page; this card is for generated content.
- Uploads the reader attached → `file-dropzone` items or chips in `PromptInput`'s attachments.

## Related

- `code-block` — the usual inline preview body.
- `drawer` — where an `open` artifact is shown in full.
- `chat-message` — artifacts stack under the response, not inside its bubble.

## Best practices

- Stack artifacts below the message text, one card each; do not nest them in the bubble.
- Keep artifact actions in the card and message actions in `ChatMessage.Actions`.
- Express sizes in KB, MB or GB in `meta`.
- Long or editable content opens (canvas); the inline body stays a preview.

## Usage

```vue
<script setup>
  import ArtifactPreview from '@aziontech/webkit/artifact-preview'
  import CodeBlock from '@aziontech/webkit/code-block'

  const rules = '{ "ttl": 3600 }'
</script>

<template>
  <ArtifactPreview title="cache-rules.json" meta="1 KB · JSON" icon="pi pi-code" :copy-value="rules" openable @open="showInDrawer">
    <CodeBlock :tabs="[{ label: 'JSON', value: 'json', code: rules, language: 'json' }]" :show-line-numbers="false" :bordered="false" />
  </ArtifactPreview>
</template>
```

## Sub-components

_None. Exports: `"./artifact-preview"`. Composed DS components: `button` (Open), `copy-button`,
`icon-button` (Download)._

## Props

| Prop           | Type      | Default       | Required | JSDoc                                                                                                          |
| -------------- | --------- | ------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `title`        | `string`  | —             | true     | File name or title of what was generated (`cache-rules.json`).                                                 |
| `description`  | `string`  | `''`          | false    | One line on what it is or does.                                                                                |
| `meta`         | `string`  | `''`          | false    | Facts that help recognize it: size, rows, language (`2.4 KB · JSON`).                                          |
| `icon`         | `string`  | `'pi pi-file'`| false    | Icon class for the file type.                                                                                  |
| `copyValue`    | `string`  | `''`          | false    | Text the Copy control puts on the clipboard. Empty hides Copy.                                                 |
| `downloadHref` | `string`  | `''`          | false    | URL of the file for the Download control. Empty hides Download.                                                |
| `openable`     | `boolean` | `false`       | false    | Shows Open, which emits `open` so the owner shows the full artifact in a side panel or page (a canvas preview). |

## Events

| Event  | Payload               | When                    |
| ------ | --------------------- | ----------------------- |
| `open` | `(event: MouseEvent)` | Open pressed.           |
| `copy` | `string`              | The content was copied. |

## Slots

| Slot      | Scope | Notes                                                                 |
| --------- | ----- | --------------------------------------------------------------------- |
| `default` | —     | The inline preview; scrolls inside a 20 rem body.                      |
| `actions` | —     | Extra icon actions, placed before Copy and Download.                  |

## States

- `data-openable`; body rendered only when the default slot is used.

## Motion & Animations

_No motion of its own._

## Tokens

| Region       | Token                                                          |
| ------------ | -------------------------------------------------------------- |
| frame        | `var(--bg-surface)`, `var(--border-default)`, `var(--shape-card)` |
| icon tile    | `var(--bg-surface-raised)`, `var(--shape-elements)`, `var(--text-muted)` |
| title        | `.text-label-md`, `var(--text-default)`                         |
| description  | `.text-body-xs`, `var(--text-muted)`                            |
| padding      | `var(--spacing-sm)`, `var(--spacing-xs)`                        |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: controls carry their own rings; the scrollable body is focusable with an inset ring.
- Keyboard map: `Tab` through the header actions, then into the body.
- ARIA: `<article aria-labelledby>` its `h3` title; Copy, Download and Open are named with the title (`Copy cache-rules.json`); the icon tile is `aria-hidden`; the visible `Open` text is contained in its accessible name.

## Internationalization

| Key                         | English source     | Override prop |
| --------------------------- | ------------------ | ------------- |
| `artifactPreview.open`      | `Open`             | —             |
| `artifactPreview.openLabel` | `Open {title}`     | —             |
| `artifactPreview.copy`      | `Copy {title}`     | —             |
| `artifactPreview.download`  | `Download {title}` | —             |

- Formatting: the owner formats `meta` (sizes with `Intl.NumberFormat`).

## Right-to-left

- Layout: logical utilities; actions at the inline end.
- Icons: external-link and download are not mirrored.
- Keyboard: none.
- User data: the title is `dir="auto"` (file names).

## Responsive

- Container queries: none.
- Narrow: title and description truncate; actions stay.
- Touch: actions are `IconButton` / small `Button` (44 px on coarse pointers).
- Reflow: the body scrolls inside the card.

## Performance

- Bundle budget: see `.size-limit.json` (`artifact-preview`).
- Runtime budget: static.
- Heavy parts: none (preview content is the owner's).

## Examples

_Examples in `packages/webkit/examples/artifact-preview/`: Code (copy and open), Table (download)._

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
