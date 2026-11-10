---
name: field-file-upload
category: inputs
structure: monolithic
status: implemented
checksum: c2ae95d8c63b5b334d2101a0b080dbc3e643a9357e78203526e6154fcf2240d1
spec_version: 1
created: 2026-11-10
last_updated: 2026-11-10
---

# Field File Upload — Component Spec

## Purpose

Form field for picking files. It stacks `Label`, an inline `FileDropzone` holding a "Choose file" secondary `Button` (which opens a visually hidden native `<input type="file">`), the single `HelperText` region for constraint or error copy, and a list of the selected files, each row with a remove `IconButton`. It is the file-picking member of the field family: it uses the same label, helper, `required`, `invalid`, `disabled`, `readonly` and `size` contract as `field-text`. It differs in that its value is a `File[]` and it checks `accept` and `maxSize` itself, emitting `reject` for files that fail.

## When to use

- A form needs the user to attach one or more files from their device: a logo, a certificate, a `.env` file to import, a CSV of records.
- The accepted types or a size ceiling must be checked before the form submits, and rejected files need to be reported to the user.
- The user should see what they picked (name and size) and be able to remove an entry before submitting.

## When NOT to use

- You need only a bare drop target without label, helper or file list, for example a canvas-wide drop area → use `file-dropzone`.
- The value is text the user could paste (a key, a certificate body) → use `field-textarea`.
- The file is uploaded and tracked server-side with progress, retries and per-file status → this field holds `File` objects only; compose a dedicated upload list around its `reject` / `v-model` contract.

## Related

- `file-dropzone` — the inline dashed drop region this field composes as its control area. It emits `drop` / `reject` and has no label, helper or file list.
- `field-text` — shape reference for the field family: same Label → control → HelperText stack, same `helperText` / `required` / `invalid` semantics.
- `button` — the "Choose file" / "Choose files" trigger (`kind="secondary"`) that opens the native picker.
- `icon-button` — the per-row remove control.
- `helper-text` — the single helper region (constraint copy, or the error message when `invalid`).
- `label` — the label row with the Required tag.

## Best practices

- Write the constraints in `helperText` ("PNG or JPG, up to 2 MB.") and make them match `accept` and `maxSize`. The field does not write constraint copy of its own.
- `maxSize` is in bytes and sizes are formatted in binary units (1 KB = 1024 bytes), so "up to 2 MB" is `:max-size="2 * 1024 * 1024"`.
- Handle `reject`: swap `helperText` for a message naming the rejected file and set `invalid`. Rejection does not set `invalid` by itself.
- `required` paints the warning helper on first render, as in every field. Bind it to a submit state (`:required="submitted && !files.length"`), not as a bare attribute.
- Removal goes through `v-model`. Watch the bound array instead of listening for a remove event.
- With `multiple` off, a new pick replaces the current file. Turn `multiple` on when files should accumulate.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import FieldFileUpload from '@aziontech/webkit/field-file-upload'

  const files = ref([])
  const invalid = ref(false)
  const helperText = ref('PNG or JPG, up to 2 MB.')

  function onReject(event, rejected) {
    invalid.value = true
    helperText.value = `${rejected[0].name} is not a PNG or JPG under 2 MB.`
  }
</script>

<template>
  <FieldFileUpload
    v-model="files"
    label="Logo"
    accept=".png,.jpg,image/png,image/jpeg"
    :max-size="2 * 1024 * 1024"
    :helper-text="helperText"
    :invalid="invalid"
    @reject="onReject"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `label` | `string` | `''` | false | Text rendered inside the `Label`. When empty, the label row is omitted. |
| `helperText` | `string` | `''` | false | Auxiliary text rendered inside `HelperText`, usually the accepted types and size limit; replace it with the error message when `invalid`. When empty, the helper row is omitted, including while `disabled`. |
| `accept` | `string` | `''` | false | Comma-separated list of accepted types, using the native `accept` syntax: extensions (`.png`), exact MIME types (`image/png`) or MIME wildcards (`image/*`). Forwarded to the native input and checked on every picked or dropped file. Empty accepts any type. |
| `multiple` | `boolean` | `false` | false | Lets the user pick or drop several files; new files are appended to the value. When off, a new file replaces the current one and the trigger reads "Choose file". |
| `maxSize` | `number` | `0` | false | Largest accepted file size in bytes. Files above it are rejected through the `reject` event. `0` means no limit. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size forwarded to the "Choose file" `Button` and the remove `IconButton`s. |
| `disabled` | `boolean` | `false` | false | Disables the picker, the drop region and every remove button, and switches a supplied helper to `kind="disabled"` (lock icon). |
| `readonly` | `boolean` | `false` | false | Shows the selected files without the drop region or the remove buttons. The value can be read but not changed. Use it for files the system already holds. |
| `required` | `boolean` | `false` | false | Adds the `Required` tag to the `Label` and switches a supplied helper to `kind="required"`. |
| `invalid` | `boolean` | `false` | false | Switches the helper to `kind="invalid"` and applies invalid tokens to the drop region. |
| `inputId` | `string` | `''` | false | id for the native file input; consumed by `Label` via `for` and by the `aria-describedby` wiring. When empty, the component auto-generates an id via `useId()`. |
| `name` | `string` | `''` | false | HTML name for the native file input, so native form submission and `FormData` carry the selected files. |

## v-model

| Model | Type | Default | Emits | Notes |
|---|---|---|---|---|
| `v-model` | `File[]` | `[]` | `update:modelValue` | Two-way bound file list via `defineModel<File[]>({ default: () => [] })`. Accepted files are added (appended when `multiple`, replacing otherwise); a row's remove button emits the array without that file. An empty array is the empty state. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `reject` | `(event: Event, files: File[])` | Fired when picked or dropped files fail the `accept` or `maxSize` check, or arrive beyond the first while `multiple` is off. `event` is the native input's `change` event or the drop's `DragEvent`; `files` holds every rejected file from that batch. Accepted files from the same batch still reach `v-model`. |

## Slots

| _none_ | — | — |

## Behavior

- **Control area.** The field renders `FileDropzone` (relative import `../file-dropzone/file-dropzone.vue`) as its control. Its default slot holds the secondary `Button` (`label` "Choose file", or "Choose files" when `multiple`; `icon="pi pi-upload"` leading) and the visually hidden native `<input type="file">` (`sr-only`, `tabindex="-1"`, `:accept`, `:multiple`, `:name`, `:disabled`, `id = inputId || useId()`). Activating the Button calls `click()` on the native input. `FileDropzone` receives `accept`, `multiple`, `disabled` and `invalid`; it filters dropped files by `accept` / `multiple` itself, and the field re-emits its `reject` unchanged. Files it accepts (its `drop` event) then pass the `maxSize` check here. Files picked through the input (`change`) bypass the dropzone, so the field runs the full check on them.
- **Check.** A file is accepted when it matches `accept` (empty matches all; an extension token matches the end of `file.name`, case-insensitive; a MIME token matches `file.type` exactly; `type/*` matches the type prefix) and, when `maxSize > 0`, `file.size <= maxSize`. With `multiple` off, only the first accepted file of a batch is kept and the rest are rejected. Rejected files are emitted once per batch through `reject`.
- **Duplicates.** With `multiple` on, a file already in the value (same `name`, `size` and `lastModified`) is not appended a second time and is not rejected.
- **Native input sync.** After each change, the native input's `value` is cleared, so picking the same file again fires `change`. Its `files` is then rewritten from the model through a `DataTransfer`, so `name` + `FormData` submit what the list shows.
- **File list.** Rendered below the helper only when the value is non-empty: a `<ul>` with one `<li>` per file. Each row shows a `pi pi-file` glyph (`aria-hidden="true"`), the file name (single line, truncated with ellipsis, full name in `title`), and the size formatted in binary units (`B` below 1 KB, then `KB` / `MB` / `GB` with one decimal, e.g. `1.4 MB`). Each row ends in a remove `IconButton` (`icon="pi pi-times"`, `kind="transparent"`, `ariaLabel` "Remove <file name>"), omitted when `readonly`.
- **Removal focus.** After a remove, focus moves to the next row's remove button, else the previous row's, else the "Choose file" Button. When `readonly`, focus is not managed (no remove buttons exist).
- **Announcements.** A visually hidden `role="status"` region (`aria-live="polite"`), always mounted, announces "<file name> added" / "<file name> removed" (or "<n> files added" for a batch) after each model change made by the field.
- **Helper kind** resolves exactly as in `field-text`: `disabled` › `invalid` › `required` › `helper`. The helper row renders only when `helperText` is non-empty.
- **Readonly.** The `FileDropzone`, the Button and the native input are not rendered. The file list renders without remove buttons. An empty readonly field shows the label and helper only. The field writes no "No files" copy of its own.
- **data-testid.** Root fallback `input-field-file-upload` (consumer `data-testid` wins). Parts follow the field family's `${testId}__<part>` derivation: `__label`, `__dropzone`, `__button`, `__input`, `__helper`, `__list`, `__file` (each `<li>`), `__remove` (each remove `IconButton`), `__status` (live region).

## States

- Visual states: `empty` (no files: label, drop region, helper), `with-files` (file list rendered), `required`, `invalid`, `disabled`, `readonly`; `FileDropzone` owns its own drag-over state.
- `data-size` mirrors the `size` prop
- `data-multiple` mirrors the `multiple` prop
- `data-required` mirrors the `required` prop
- `data-invalid` mirrors the `invalid` prop
- `data-disabled` mirrors the `disabled` prop
- `data-readonly` mirrors the `readonly` prop
- `data-empty` is present when the value is an empty array

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| _none_ — motion is owned by the composed `FileDropzone`, `Button` and `IconButton` | — | — | — |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| gap (between label / control / helper / list rows) | `var(--spacing-xs)` |
| file list gap (between rows) | `var(--spacing-xxs)` |
| file row padding | `var(--spacing-xs)` |
| file row gap (icon / name / size / remove) | `var(--spacing-xs)` |
| file row border | `var(--border-default)` |
| file row surface | `var(--bg-surface)` |
| file row shape | `var(--shape-elements)` |
| typography (file name) | `.text-label-md` |
| text (file name) | `var(--text-default)` |
| typography (file size) | `.text-body-sm` |
| text (file size, file glyph) | `var(--text-muted)` |

Label, helper, drop region, Button and IconButton typography and color are owned by those children and not redeclared here, as in `field-text`.

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: delegated to the composed `Button` and `IconButton` (their `focus-visible:ring-(--ring-color)` ring). The native input is never a tab stop (`tabindex="-1"`, visually hidden but not `display: none`, so the `Label` click and assistive tech still reach it).
- Keyboard map: `Tab` focuses the "Choose file" Button; `Enter` / `Space` opens the native file picker; `Tab` continues through each row's remove button; `Enter` / `Space` removes that file and moves focus as described in Behavior; `Shift+Tab` moves back. Dragging is never the only way to add a file.
- Label association: the `Label` renders `for="<inputId>"` and `id="<inputId>-label"`; the Button carries `aria-labelledby="<inputId>-label <inputId>-button"` so it announces the field name and its action ("Logo, Choose file"). With no `label`, the Button keeps its own name.
- `aria-describedby="<inputId>-helper"` on the Button and the native input when `helperText` is set, so the constraints or the error are read with the control.
- `aria-invalid="true"` on the native input when `invalid`; the helper carries the human-readable message.
- The file list is a `<ul>` named by `aria-labelledby="<inputId>-label"` (or `aria-label` "Selected files" when there is no label). Each remove button is named "Remove <file name>". The file glyph is `aria-hidden="true"`.
- Add/remove changes are announced through the polite `role="status"` live region.
- `disabled` disables the Button, the native input, the drop region and every remove button; the label dims via inherited `var(--text-muted)`.
- Contrast ≥4.5:1 (file name, size) / ≥3:1 (glyph, row border), including the disabled state.
- Touch target: the Button and IconButton own their hit areas; ≥40×40 px at `size="large"`.

## Stories (Storybook)

Canonical layout — matches `apps/storybook/src/stories/webkit/actions/button/Button.stories.js`.

- Default — single file, empty value, `label` + constraint `helperText`.
- Sizes — composite story rendering all three sizes side by side.
- Multiple — justified: `multiple: true` with two `File` objects preloaded through `v-model`, to show the file list, size formatting, truncation and the remove buttons.
- Constraints — justified: `accept` + `maxSize` with a `@reject` handler that sets `invalid` and swaps `helperText`, to show the reject → error-message round trip that is the field's main validation contract.
- Invalid — `invalid: true` with an error `helperText`; shows the danger helper and invalid drop region.
- Disabled — `disabled: true` with one preloaded file; shows the disabled Button, drop region and remove buttons.

## Open questions

- **`file-dropzone` API (resolved).** `FileDropzone` exposes a default slot, `drop` / `reject` `(event: DragEvent, files: File[])`, and `accept`, `multiple`, `disabled`, `invalid` props. The field forwards those props, re-emits the dropzone's `reject`, and adds only the `maxSize` check for dropped files. `file-dropzone` is scaffolded first so its export exists before this field is written.
- **Copy written by the field.** "Choose file" / "Choose files", "Remove <name>", "Selected files", and the live-region strings are English literals. No prop was requested for them; add label props (e.g. `buttonLabel`) only if localisation needs them.
- **Last-modified.** The brief lists last-modified as optional on each row. It is left out of v1 because showing it would need a toggle prop that was not requested. Add it (e.g. a `showLastModified` boolean) if needed.
- **Rejection reason.** `reject` reports which files failed, not why (type, size or count). The consumer recomputes the reason from `accept` / `maxSize`. A structured payload would be a breaking change later.
- **Native `required`.** The field does not set native `required` on the hidden input. `required` is a submit state in the field family, and a hidden input is a poor target for the browser's validation bubble. Confirm this matches the form integration.
- **Readonly empty state.** An empty readonly field shows only label + helper. Confirm that is acceptable or whether a muted placeholder row is wanted (it would need a prop for its copy).

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
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
