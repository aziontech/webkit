# File Dropzone

> A FileDropzone is the target a user drags files from the operating system onto. It owns the drag lifecycle (only drags carrying `Files` count), the `accept` / `multiple` filtering, and the idle/active look, and it hands the result back as two activation events: `drop` with the accepted files, `reject` with the files it filtered out. It holds no value and renders no file list. The list, upload progress and validation messages belong to the consumer (typically a `Field` around this component, whose `Field.Description` / `Field.Error` carry the messages). `kind` covers the two places a drop target lives: - **`inline`**: a dashed region that is always visible (icon, title, description, plus a default slot for the "Browse files" action the consumer composes). It switches to the active look while files are dragged over it. This is the Cloudscape FileDropzone / Cloudflare Pages "Upload assets" shape. - **`overlay`**: invisible at rest. When files are dragged into the window it fades in over its nearest positioned ancestor (`absolute inset-0`), and it fades out on window drag-leave, drop or `Escape`. This is the Vercel "drag and drop a folder to deploy" shape, and it replaces the sample app's page-level `ProjectDropZone` and the drop target in the `Templates/Platform/States/ProjectIntake` story. The drop target itself is pointer-only. It is never a keyboard control. The keyboard (and screen-reader) path to the same outcome is a real button the consumer puts in the default slot (`inline`), or elsewhere on the page (`overlay`).

- Import: `import FileDropzone from '@aziontech/webkit/file-dropzone'`
- Category: inputs · Surface: product · Structure: monolithic
- API as JSON: [file-dropzone.json](https://github.com/aziontech/webkit/blob/main/.specs/file-dropzone.json)

## When to use

- A form or settings surface accepts one or more files and should also accept them by drag (`kind="inline"` with a Browse button in the slot).
- A whole page or card should accept a project, folder contents or assets dropped anywhere on it, with no permanent drop region taking up space (`kind="overlay"` inside a `relative` container).
- The consumer needs the accepted and rejected files separated by an `accept` filter before it uploads anything.

## Do

- Always give the user a non-drag path. In `inline`, put a `Button` in the default slot that opens a native `<input type="file">`. In `overlay`, keep an upload button somewhere on the page. The drop target is pointer-only by design.
- Pass the same `accept` string to the dropzone and to the native input behind your Browse button, so both paths filter the same way.
- Handle `reject`. Tell the user which files were skipped and why (e.g. a `toast` naming the files and the accepted types). A silent rejection reads as a broken drop.
- Announce the outcome of a drop yourself (a toast, or a live region on your file list). The dropzone does not announce drag states (see Accessibility).
- Render one `overlay` dropzone per positioned container, and make the container `relative`. Without a positioned ancestor the overlay covers the nearest positioned element up the tree, which may be the whole page.
- Place the `overlay` dropzone as the last child of its container, so it paints above the container's other positioned content (see Theme gaps).
- When the consumer's own flow is busy (an upload in progress), set `disabled` and disable the Browse button too.
- Put the accepted types and limits in `description` ("PNG or JPG, up to 5 MB"). The title is the instruction, the description is the constraint.

## Don’t

- Picking files by keyboard or click only, with no drag affordance → a `button` that opens a native file input is enough.
- Showing the chosen files, their progress or their errors → render them yourself with `progress`, `message` or `helper-text`. The dropzone renders none of these.
- Dragging items inside the page (reordering rows, moving cards) → this component only reacts to OS drags that carry `Files`. In-page drag and drop is out of scope.
- A static "nothing here yet" panel with no drop behavior → use `empty-state`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [button](button.md): the "Browse files" action composed into the default slot. It is the keyboard path to the same outcome as a drop.
- [empty-state](empty-state.md): a no-data panel. Compose a FileDropzone inside or beside it when the empty state's call to action is "upload".
- [progress](progress.md): the consumer renders per-file progress after `drop`. The dropzone does not track uploads.
- [toast](toast.md): confirms the result of a drop or reports rejected files to everyone, including users who never see the drag.
- [card](card.md): a positioned container (`class="relative"`) that hosts an `overlay` dropzone.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `kind` | `'inline' \| 'overlay'` | `'inline'` | false | Placement. Inline is an always-visible dashed region; overlay stays hidden until files are dragged over the window, then covers its nearest positioned ancestor. |
| `title` | `string` | `''` | false | Instruction shown under the icon. Empty uses the locale catalog (`Drop files to upload`). |
| `description` | `string` | `''` | false | Secondary line under the title, typically the accepted types and limits. Not rendered when empty. |
| `accept` | `string` | `''` | false | Comma-separated file filter using the native input accept syntax (extensions, MIME types, type wildcards). Files that do not match are rejected. Empty accepts every file. |
| `multiple` | `boolean` | `true` | false | When false, only the first accepted file of a drop is accepted and the rest are rejected. |
| `directories` | `boolean` | `false` | false | Accepts dropped folders: walks every dropped folder and emits the files inside, each with its `webkitRelativePath` (`assets/img/logo.svg`). The events fire after the walk. |
| `disabled` | `boolean` | `false` | false | Ignores drags and drops: no active state, no events. |
| `invalid` | `boolean` | `false` | false | Paints the inline region with the danger border so a wrapping field can show a validation error. Drops still work. |
| `icon` | `string` | `'pi pi-cloud-upload'` | false | PrimeIcons class for the glyph above the title. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `drop` | `(event: DragEvent, files: File[])` | Activation event. Fires when files are dropped on the target (the inline root, or the visible overlay) and at least one passes `accept` / `multiple`. `files` holds only the accepted files, in `dataTransfer.files` order, and is never empty. Not emitted when `disabled`. Declaring `drop` means a consumer `@drop` listener binds to this event, never to the native DOM `drop` on the root. |
| `reject` | `(event: DragEvent, files: File[])` | Activation event. Fires on the same drop when one or more files were filtered out, because they do not match `accept` or exceed `multiple="false"`. `files` holds only the rejected files and is never empty. When a drop has both kinds of file, `drop` fires first, then `reject`, with the same `event`. Not emitted when `disabled`. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Actions or extra content under the description, typically a "Browse files" `Button`. Rendered only in `kind="inline"`. The overlay is `aria-hidden` decoration, so interactive content there would be unreachable and is not rendered. |

## Assets

- Icons: every valid name is in [icons.md](../foundations/icons.md) (MCP `list_assets({ kind: "icons" })`). An unknown class renders nothing.

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

## Accessibility

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

### Default

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import { ref } from 'vue'

  const input = ref(null)
  const browse = () => input.value?.click()
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <FileDropzone description="Or browse for files on your computer.">
      <Button
        label="Browse files"
        kind="secondary"
        size="medium"
        @click="browse"
      />
    </FileDropzone>
    <input
      ref="input"
      type="file"
      multiple
      class="hidden"
    />
  </div>
</template>
```

### Folders

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import FileTokenGroup from '@aziontech/webkit/file-token-group'
  import { ref } from 'vue'

  const filesInput = ref(null)
  const folderInput = ref(null)
  const items = ref([])

  const add = (files) => {
    items.value = [...items.value, ...Array.from(files, (file) => ({ file }))]
  }
  const onPick = (event) => {
    add(event.target.files ?? [])
    event.target.value = ''
  }
  const remove = (index) => {
    items.value = items.value.filter((_, position) => position !== index)
  }
</script>

<template>
  <div class="flex w-full max-w-(--container-md) flex-col gap-(--spacing-md)">
    <FileDropzone
      directories
      title="Drop files or folders to upload"
      description="Folders keep their structure: each file goes up with its path."
      @drop="(event, files) => add(files)"
    >
      <div class="flex flex-wrap justify-center gap-(--spacing-xs)">
        <Button
          label="Browse files"
          kind="secondary"
          size="medium"
          @click="filesInput?.click()"
        />
        <Button
          label="Browse folder"
          kind="secondary"
          size="medium"
          icon="pi pi-folder-open"
          @click="folderInput?.click()"
        />
      </div>
    </FileDropzone>
    <input
      ref="filesInput"
      type="file"
      multiple
      class="hidden"
      aria-hidden="true"
      tabindex="-1"
      @change="onPick"
    />
    <input
      ref="folderInput"
      type="file"
      webkitdirectory
      class="hidden"
      aria-hidden="true"
      tabindex="-1"
      @change="onPick"
    />
    <FileTokenGroup
      v-if="items.length"
      :items="items"
      :limit="6"
      aria-label="Files to upload"
      @dismiss="remove"
    />
  </div>
</template>
```

### Overlay

```vue
<script setup>
  import Card from '@aziontech/webkit/card'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
</script>

<template>
  <div class="relative w-full max-w-(--container-md)">
    <Card title="Project files">
      <template #content>
        <div class="flex min-h-48 flex-col gap-(--spacing-xs)">
          <p class="text-body-sm text-(--text-muted)">
            Drag a file from your computer over this window. The drop target covers this card until
            you drop the file, leave the window or press Escape.
          </p>
        </div>
      </template>
    </Card>
    <FileDropzone kind="overlay" />
  </div>
</template>
```
