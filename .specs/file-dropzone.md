---
name: file-dropzone
category: inputs
structure: monolithic
status: implemented
checksum: 419f92bc15822a3c1973f7a5aef8223efd32364d4edcc7a6b7818c2c2a4f5e74
spec_version: 1
created: 2026-11-10
last_updated: 2026-11-11
---

# FileDropzone — Component Spec

## Purpose

A FileDropzone is the target a user drags files from the operating system onto. It owns the drag lifecycle (only drags carrying `Files` count), the `accept` / `multiple` filtering, and the idle/active look, and it hands the result back as two activation events: `drop` with the accepted files, `reject` with the files it filtered out. It holds no value and renders no file list. The list, upload progress and validation messages belong to the consumer (typically a `Field` around this component, whose `Field.Description` / `Field.Error` carry the messages).

`kind` covers the two places a drop target lives:

- **`inline`**: a dashed region that is always visible (icon, title, description, plus a default slot for the "Browse files" action the consumer composes). It switches to the active look while files are dragged over it. This is the Cloudscape FileDropzone / Cloudflare Pages "Upload assets" shape.
- **`overlay`**: invisible at rest. When files are dragged into the window it fades in over its nearest positioned ancestor (`absolute inset-0`), and it fades out on window drag-leave, drop or `Escape`. This is the Vercel "drag and drop a folder to deploy" shape, and it replaces the sample app's page-level `ProjectDropZone` and the drop target in the `Templates/Platform/States/ProjectIntake` story.

The drop target itself is pointer-only. It is never a keyboard control. The keyboard (and screen-reader) path to the same outcome is a real button the consumer puts in the default slot (`inline`), or elsewhere on the page (`overlay`).

## When to use

- A form or settings surface accepts one or more files and should also accept them by drag (`kind="inline"` with a Browse button in the slot).
- A whole page or card should accept a project, folder contents or assets dropped anywhere on it, with no permanent drop region taking up space (`kind="overlay"` inside a `relative` container).
- The consumer needs the accepted and rejected files separated by an `accept` filter before it uploads anything.

## When NOT to use

- Picking files by keyboard or click only, with no drag affordance → a `button` that opens a native file input is enough.
- Showing the chosen files, their progress or their errors → render them yourself with `progress`, `message` or `helper-text`. The dropzone renders none of these.
- Dragging items inside the page (reordering rows, moving cards) → this component only reacts to OS drags that carry `Files`. In-page drag and drop is out of scope.
- A static "nothing here yet" panel with no drop behavior → use `empty-state`.

## Related

- `button`: the "Browse files" action composed into the default slot. It is the keyboard path to the same outcome as a drop.
- `empty-state`: a no-data panel. Compose a FileDropzone inside or beside it when the empty state's call to action is "upload".
- `progress`: the consumer renders per-file progress after `drop`. The dropzone does not track uploads.
- `toast`: confirms the result of a drop or reports rejected files to everyone, including users who never see the drag.
- `card`: a positioned container (`class="relative"`) that hosts an `overlay` dropzone.

## Best practices

- Always give the user a non-drag path. In `inline`, put a `Button` in the default slot that opens a native `<input type="file">`. In `overlay`, keep an upload button somewhere on the page. The drop target is pointer-only by design.
- Pass the same `accept` string to the dropzone and to the native input behind your Browse button, so both paths filter the same way.
- Handle `reject`. Tell the user which files were skipped and why (e.g. a `toast` naming the files and the accepted types). A silent rejection reads as a broken drop.
- Announce the outcome of a drop yourself (a toast, or a live region on your file list). The dropzone does not announce drag states (see Accessibility).
- Render one `overlay` dropzone per positioned container, and make the container `relative`. Without a positioned ancestor the overlay covers the nearest positioned element up the tree, which may be the whole page.
- Place the `overlay` dropzone as the last child of its container, so it paints above the container's other positioned content (see Theme gaps).
- When the consumer's own flow is busy (an upload in progress), set `disabled` and disable the Browse button too.
- Put the accepted types and limits in `description` ("PNG or JPG, up to 5 MB"). The title is the instruction, the description is the constraint.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import Button from '@aziontech/webkit/button'

  const picker = ref(null)
  const files = ref([])
  const skipped = ref([])

  function onDrop(event, accepted) {
    files.value.push(...accepted)
  }

  function onReject(event, rejected) {
    skipped.value = rejected.map((file) => file.name)
  }

  function onPick(event) {
    files.value.push(...event.target.files)
  }

  function onDeploy(event, accepted) {
    files.value = accepted
  }
</script>

<template>
  <FileDropzone
    title="Drop files to upload"
    description="PNG or JPG, up to 5 MB each."
    accept="image/png,image/jpeg"
    @drop="onDrop"
    @reject="onReject"
  >
    <Button
      label="Browse files"
      kind="outlined"
      size="medium"
      @click="picker.click()"
    />
    <input
      ref="picker"
      type="file"
      accept="image/png,image/jpeg"
      multiple
      hidden
      @change="onPick"
    />
  </FileDropzone>

  <section class="relative">
    <FileDropzone
      kind="overlay"
      title="Drop your project to deploy it"
      description="A project folder, or the files inside one."
      @drop="onDeploy"
    />
  </section>
</template>
```

## Props

| Prop          | Type                    | Default                | Required | JSDoc                                                                                                                                                                      |
| ------------- | ----------------------- | ---------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `kind`        | `'inline' \| 'overlay'` | `'inline'`             | false    | Placement. Inline is an always-visible dashed region; overlay stays hidden until files are dragged over the window, then covers its nearest positioned ancestor.           |
| `title`       | `string`                | `''`                   | false    | Instruction shown under the icon. Empty uses the locale catalog (`Drop files to upload`).                                                                                  |
| `description` | `string`                | `''`                   | false    | Secondary line under the title, typically the accepted types and limits. Not rendered when empty.                                                                          |
| `accept`      | `string`                | `''`                   | false    | Comma-separated file filter using the native input accept syntax (extensions, MIME types, type wildcards). Files that do not match are rejected. Empty accepts every file. |
| `multiple`    | `boolean`               | `true`                 | false    | When false, only the first accepted file of a drop is accepted and the rest are rejected.                                                                                  |
| `disabled`    | `boolean`               | `false`                | false    | Ignores drags and drops: no active state, no events.                                                                                                                       |
| `invalid`     | `boolean`               | `false`                | false    | Paints the inline region with the danger border so a wrapping field can show a validation error. Drops still work.                                                         |
| `icon`        | `string`                | `'pi pi-cloud-upload'` | false    | PrimeIcons class for the glyph above the title.                                                                                                                            |

`multiple` defaults to `true` on purpose, against the "booleans default to `false`" habit. Most drops carry several files (a folder's contents, a batch of assets), and the positive name `multiple` matches the native `<input multiple>` attribute the consumer pairs it with. The inverse (`single`) would be a new term with no native counterpart.

No `v-model`: the dropzone holds no value. The accumulated file list belongs to the consumer (composed with a `Field`).

## Events

| Event    | Payload                             | Notes                                                                                                                                                                                                                                                                                                                                                                                            |
| -------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `drop`   | `(event: DragEvent, files: File[])` | Activation event. Fires when files are dropped on the target (the inline root, or the visible overlay) and at least one passes `accept` / `multiple`. `files` holds only the accepted files, in `dataTransfer.files` order, and is never empty. Not emitted when `disabled`. Declaring `drop` means a consumer `@drop` listener binds to this event, never to the native DOM `drop` on the root. |
| `reject` | `(event: DragEvent, files: File[])` | Activation event. Fires on the same drop when one or more files were filtered out, because they do not match `accept` or exceed `multiple="false"`. `files` holds only the rejected files and is never empty. When a drop has both kinds of file, `drop` fires first, then `reject`, with the same `event`. Not emitted when `disabled`.                                                         |

## Slots

| Slot      | Scope | Notes                                                                                                                                                                                                                                  |
| --------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default` | —     | Actions or extra content under the description, typically a "Browse files" `Button`. Rendered only in `kind="inline"`. The overlay is `aria-hidden` decoration, so interactive content there would be unreachable and is not rendered. |

## States

- Visual states: `idle`, `active` (files dragged over the target), `disabled`
- `data-state` values: `idle` | `active`
- `data-kind` mirrors the `kind` prop (`inline` | `overlay`)
- `data-disabled` is present when the `disabled` prop is true. A disabled dropzone is always `data-state="idle"`.
- `data-invalid` is present when the `invalid` prop is true.
- **Inline / invalid**: the dashed border turns `--danger-border` while idle; the active state still wins while files are dragged over it. Overlay ignores `invalid`.
- **Inline / idle**: dashed `--border-strong` border on a `--bg-surface` fill. Icon, title, description and slot are centered.
- **Inline / active**: the border turns `--border-selected` and the fill `--bg-selected`. Layout does not move (same border width in both states).
- **Inline / disabled**: `--border-default` dashed border, `--bg-disabled` fill, icon, title and description in `--text-disabled`, `cursor-not-allowed`. The slot still renders, and the consumer disables its own Browse button.
- **Overlay / idle**: not displayed (`v-show`). The root stays in the DOM so `data-testid` and `$attrs` are always present.
- **Overlay / active**: `absolute inset-0` over the nearest positioned ancestor. 2px dashed `--border-selected` border on a `--bg-canvas` fill, `--shape-card` radius. The content column sits in a `sticky top-0` wrapper capped at the viewport height (`h-dvh max-h-full`), so the prompt stays centered in the viewport even when the ancestor is taller than the screen (the page-level case). It receives pointer events while active so the drop lands on it, and `data-[state=idle]:pointer-events-none` keeps the fade-out from swallowing clicks.
- No `loading`, `empty` or `error` state: the dropzone does not upload, validate or list anything. `invalid` only paints the border; the message and the file list belong to the consumer (compose it inside a `Field`).

## Behavior

- **Only file drags count.** A drag is considered only when `event.dataTransfer.types` includes `'Files'`. Text, link and in-page element drags are ignored entirely: no active state, no `preventDefault`.
- **Inline lifecycle (listeners on the root element):** `dragenter` increments a depth counter and `dragleave` decrements it, so moving between descendants does not flicker. `data-state` is `active` while the counter is above 0. `dragover` calls `preventDefault()` and sets `dropEffect = 'copy'`, which allows the drop. `drop` calls `preventDefault()`, resets the counter to 0, filters the files and emits.
- **Overlay lifecycle (window listeners via VueUse `useEventListener`, removed automatically on scope dispose):** window `dragenter` / `dragleave` drive the same depth counter, and the overlay is active while it is above 0. The counter resets to 0, and the overlay hides, on window `drop`, window `dragend`, or a window `keydown` of `Escape` (a fallback: browsers cancel the native drag on `Escape` and fire `dragleave` themselves). The visible overlay handles `dragover` (`preventDefault()`, `dropEffect = 'copy'`) and `drop` on its own root, which is the only place an overlay drop is accepted.
- **Drops outside the overlay's area** (the ancestor is smaller than the window): while a file drag is active, window `dragover` / `drop` that no other handler has already claimed (`event.defaultPrevented === false`) call `preventDefault()`. `dragover` also sets `dropEffect = 'none'`. This stops the browser from navigating to the dropped file. No event is emitted, and the overlay hides. The `defaultPrevented` guard keeps the dropzone from overriding another drop target on the page.
- The window listeners are inert unless `kind="overlay"` and not `disabled`. A disabled overlay never shows and prevents nothing.
- **Disabled inline:** `dragover` still calls `preventDefault()` but sets `dropEffect = 'none'` (the not-allowed cursor, and the browser does not open the file), the state never becomes `active`, and no event is emitted.
- **`accept` matching:** split on commas, trimmed, lower-cased, empty tokens ignored. A token starting with `.` matches the end of the file name (`.png`). A token ending in `/*` matches a `file.type` with that prefix (`image/*`). Any other token must equal `file.type` (`application/pdf`). A file with an empty `type` can only match by extension. An empty `accept` accepts every file.
- **`multiple="false"`:** the first file that passes `accept`, in `dataTransfer.files` order, is accepted. Every later file, matching or not, goes to `reject`.
- **SSR:** `useEventListener` binds nothing when `window` is undefined, so the component renders on the server in its idle state.

## Motion & Animations

| Trigger                                     | Animation / Transition                                                                 | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                |
| ------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------- |
| overlay shows (files enter the window)      | `animate-fade-in` on the Vue `Transition` enter phase of the overlay root              | semantic (220ms · ease-in-out)                    | `motion-reduce:animate-none` (instant) |
| overlay hides (drag leave / drop / Escape)  | `animate-fade-out` on the Vue `Transition` leave phase of the overlay root             | semantic (220ms · ease-in-out)                    | `motion-reduce:animate-none` (instant) |
| inline idle ↔ active (border + fill colour) | `transition-[background-color,border-color] duration-fast-02 ease-productive-entrance` | DESIGN.md § Interactive states                    | `motion-reduce:transition-none`        |

## Tokens

| Region                           | Token (DESIGN.md)                                                                               |
| -------------------------------- | ----------------------------------------------------------------------------------------------- |
| shape (both kinds)               | `var(--shape-card)`                                                                             |
| inline border (idle)             | `var(--border-strong)`                                                                          |
| inline / overlay border (active) | `var(--border-selected)`                                                                        |
| inline border (disabled)         | `var(--border-default)`                                                                         |
| inline border (invalid)          | `var(--danger-border)`                                                                          |
| inline surface (idle)            | `var(--bg-surface)`                                                                             |
| inline surface (active)          | `var(--bg-selected)`                                                                            |
| inline surface (disabled)        | `var(--bg-disabled)`                                                                            |
| overlay surface                  | `var(--bg-canvas)`                                                                              |
| padding                          | `var(--spacing-lg)`                                                                             |
| gap (icon → text → slot)         | `var(--spacing-md)`                                                                             |
| gap (title → description)        | `var(--spacing-xxs)`                                                                            |
| text column max width            | `var(--container-md)`                                                                           |
| icon frame                       | `var(--bg-surface-raised)` fill, `var(--border-default)` border, `var(--shape-elements)` radius |
| icon glyph                       | `.text-body-lg`, `var(--text-default)`                                                          |
| typography (title)               | `.text-heading-xs`, `var(--text-default)`                                                       |
| typography (description)         | `.text-body-sm`, `var(--text-muted)`                                                            |
| text / icon (disabled)           | `var(--text-disabled)`                                                                          |

## Theme gaps

| Figma variable                                               | Temporary primitive                                                                                                                                                          | Follow-up                                                                                                                                                                                           |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| (no Figma frame) overlay stacking layer inside its container | none: no z-index. The overlay relies on paint order (a positioned element placed as the container's last child). The sample's `z-40` is a raw value and is not carried over. | `TODO: tokenizar` a semantic in-container overlay layer in `z-indices.data.js` + DESIGN.md (the theme has only `z-input-field` / `z-input-popup` / `z-input-overlay`, none documented in DESIGN.md) |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the dropzone root is **not focusable** and has no focus ring. Focus belongs to the controls in the default slot, which carry their own `focus-visible` ring (e.g. `Button`).
- Keyboard map: none on the dropzone. Drag and drop from the OS is a pointer gesture with no keyboard equivalent on the target. The keyboard path is the consumer's Browse button, which opens a native file input and reaches the same outcome. `Escape` during a drag hides the overlay (window `keydown` fallback; browsers also cancel the drag natively).
- No `@click` on the root: clicking the region does nothing, so there is no click-without-key handler. The Browse button is the click target.
- ARIA, inline: the root is a `<div role="group">` with `aria-labelledby` pointing at the title and `aria-describedby` pointing at the description (only when `description` is non-empty), both ids from `useId()`. A screen reader therefore reads the slotted Browse button in context ("Drop files to upload, group, PNG or JPG, up to 5 MB each, Browse files, button"). The title is a `<p>`, not a heading: the page owns its heading outline. When `disabled`, the group carries `aria-disabled="true"`, so the dimmed title and description are announced as part of a disabled control and fall under the WCAG 1.4.3 exemption for inactive components.
- ARIA, overlay: the root is `aria-hidden="true"`. It is a pointer-only duplicate of an affordance that must exist elsewhere on the page, and it renders no interactive content.
- No `aria-live` in the component. Announcing every drag that crosses the window is noise, and the outcome that matters (files accepted or skipped) is the consumer's to announce from `drop` / `reject` (a `toast`, or a live region on its file list). `aria-dropeffect` / `aria-grabbed` are deprecated in WAI-ARIA 1.1 and are not used.
- The icon is decorative: `aria-hidden="true"`.
- `data-disabled` has no ARIA mirror because the root is not a control. The slotted button carries its own `disabled` / `aria-disabled`.
- Contrast ≥4.5:1 for the title and description in both themes, including `--text-muted` on `--bg-selected` (inline active) and on `--bg-canvas` (overlay). The `webkit-ui-verifier` must confirm the active state in both themes, since the unit suite has no CSS. The dashed border (`--border-strong` idle, `--border-selected` active) must meet 3:1 non-text contrast against the surrounding surface.
- `motion-reduce:animate-none` on both overlay fades, `motion-reduce:transition-none` on the inline colour transition.
- Touch target: not applicable. The region is not a control (touch devices cannot drag OS files into a page), and the slotted Button carries its own ≥40×40 px target.

## Examples

Canonical layout, with two justified deviations: there is no `size` prop (no Sizes story), and there is no Types composite because an `overlay` is invisible at rest, so a side-by-side frame would show one empty box. Each kind gets its own story instead.

- Default: `kind="inline"` with a "Browse files" `Button` in the default slot wired to a hidden native `<input type="file" multiple>`. `drop` and `reject` are logged through `argTypes` actions (`onDrop` / `onReject`).
- Overlay: `kind="overlay"` inside a positioned `Card` (`class="relative"`) with a min height, and placeholder card content under it. The story copy tells the reader to drag a file over the window to see it. Justified because the overlay's placement and window-level behavior cannot be shown in Default.
- Accept: `kind="inline"`, `accept="image/*"`, with the story rendering the names of rejected files from the `reject` payload under the dropzone. Justified because `reject` is half of the event contract and needs a visible demonstration.
- Disabled: `disabled: true` on the Default composition, with the slotted Button also disabled.

## Open questions

- **`multiple="false"` with several accepted files:** the draft accepts the first and rejects the rest. Cloudscape-style "reject the whole drop" is the alternative. Decide before approval, because changing it later changes what `drop` delivers.
- **Reject reason:** `reject` carries `File[]` only, so the consumer cannot tell "wrong type" from "too many" without re-running the filter. A reason-bearing payload (`{ file, reason }[]`) would be a breaking reshape once shipped. Decide before approval.
- **Folder drops (Vercel's "drop a folder"):** the draft passes `dataTransfer.files` as the browser exposes them. A dropped directory arrives as an unreadable entry with an empty `type`, and nothing is traversed recursively (`webkitGetAsEntry`). Folder traversal would be a new prop and a `spec_version` bump, or a consumer concern.
- **Overlay inset:** the sample insets its overlay by the page boundary (`--drop-zone-inset`). The draft covers the positioned ancestor exactly (`inset-0`). The consumer controls the inset by choosing which container is positioned. Revisit if page-level usage needs a gutter.
- **Stacking token:** see Theme gaps. Paint order is fragile when the container has its own z-indexed children.
- **Active-state visual baseline:** neither story shows the active look at rest. A `play` function that dispatches a synthetic `dragenter` carrying a `DataTransfer` with a `File` would let the visual gate capture it. Not added to the story list without approval.
- **Default `title` copy:** `'Drop files to upload'` is English-only. Confirm the microcopy (sentence case, no trailing period) against the console microcopy standard.
- **`invalid` prop (resolved):** added so a consumer form can paint the dropzone from its own validation (an enclosing `Field`'s error) while reusing this component's `reject` for dropped files instead of filtering them a second time.
- **File size / count limits:** out of scope here (a consumer concern). Confirm that no `maxSize` / `maxFiles` is wanted on the dropzone itself.

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
