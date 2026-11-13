---
name: artifact-canvas
category: ai
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: b5aabf722dbd16b236b351b55c39dc517dacb2556c81eb2afcdc782f16fdf28a
created: 2026-11-11
last_updated: 2026-11-13
---

# ArtifactCanvas — Component Spec

## Purpose

The side panel that shows one generated artifact in full next to the conversation: a SQL file, a configuration, a table of results, a document. A header names it (title, meta, Close), a toolbar pages through its versions with `ResponseBranches` and offers Copy and Download, and the body scrolls on its own. It is the full view behind `ArtifactPreview`'s Open: the preview sits in the message, the canvas beside the thread. The owner places it in a `Resizable` pane, so the reader can widen it, narrow it or collapse it from the keyboard; the canvas fills whatever the pane gives it. Benchmarks: the artifact or canvas panel of chat assistants (a document beside the thread with versions), Cloudscape's split panel (a resizable side region with its own header and close).

## When to use

- An assistant answer produced something longer than a message can show: a file, a long query, a table, a document the reader will copy or keep.
- The reader asks for changes to that thing and each answer makes a new version to compare with the earlier ones.
- The reader reads the artifact and keeps chatting at the same time.

## When NOT to use

- A short snippet that fits the message → `CodeBlock` or `ArtifactPreview` inside `ChatMessage`.
- A setting or a form the reader must fill → `Drawer` with the form.
- Help text about the page → `HelpPanel`.
- A narrow screen: show the same canvas in a full-height `Drawer` instead of a side pane (see Responsive).

## Related

- `artifact-preview` — the card in the message; its Open opens this canvas.
- `response-branches` — the version pager the toolbar reuses.
- `resizable` — the split the owner puts the canvas in (pane, handle, collapse).
- `chat-message`, `conversation` — the thread beside the canvas.
- `copy-button` — the Copy control.

## Best practices

- Open the canvas from `ArtifactPreview`'s Open, then call `focus()` so the reader lands on its title; on Close return focus to the Open that opened it.
- Put it in a `Resizable.Pane` with a `min` that keeps the toolbar on one row (about 320 px) and a handle named after the canvas (`Resize the artifact`).
- Show the newest version when a new one finishes (set `v-model:version` to the last index); while it is generated set `streaming`, which locks the pager and marks the body busy.
- Keep Copy and Download about the version shown; `copyValue` and `downloadHref` change with `version`.
- One canvas at a time. Opening another artifact replaces the content and keeps the pane width.

## Usage

```vue
<script setup>
  import ArtifactCanvas from '@aziontech/webkit/artifact-canvas'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Resizable from '@aziontech/webkit/resizable'
  import { ref } from 'vue'

  const versions = ['SELECT * FROM orders;', 'SELECT id, total FROM orders;']
  const version = ref(1)
  const open = ref(true)
  const width = ref(480)
</script>

<template>
  <Resizable class="h-dvh">
    <Resizable.Pane>
      <p>The conversation.</p>
    </Resizable.Pane>
    <Resizable.Handle
      v-if="open"
      aria-label="Resize the artifact"
    />
    <Resizable.Pane
      v-if="open"
      v-model:basis="width"
      :min="320"
      :max="960"
    >
      <ArtifactCanvas
        v-model:version="version"
        title="top-orders.sql"
        meta="SQL"
        kind="code"
        :versions="versions.length"
        :copy-value="versions[version]"
        @close="open = false"
      >
        <CodeBlock
          :code="versions[version]"
          language="sql"
        />
      </ArtifactCanvas>
    </Resizable.Pane>
  </Resizable>
</template>
```

## Sub-components

_none_ — monolithic. The split and the handle are `Resizable`'s; the pager is `ResponseBranches`. Exposes `focus()`, which moves focus to the panel title (`tabindex="-1"`) for the owner to call after opening.

## Props

| Prop           | Type                              | Default      | Required | JSDoc                                                                                                   |
| -------------- | --------------------------------- | ------------ | -------- | ------------------------------------------------------------------------------------------------------- |
| `title`        | `string`                          | —            | true     | File name or title of the artifact (`top-orders.sql`); names the panel.                                 |
| `meta`         | `string`                          | `''`         | false    | Facts that help recognize it, after the title: language, size, rows (`SQL · 12 lines`).                 |
| `kind`         | `'code' \| 'table' \| 'document'` | `'document'` | false    | What the artifact is; picks the icon and `data-kind`. The body is always the owner's slot.              |
| `versions`     | `number`                          | `1`          | false    | How many versions exist. With more than one, the toolbar shows the `ResponseBranches` pager.            |
| `copyValue`    | `string`                          | `''`         | false    | Text the Copy control puts on the clipboard, of the version shown. Empty hides Copy.                    |
| `downloadHref` | `string`                          | `''`         | false    | URL of the version shown, for Download (`download` takes the title). Empty hides Download.              |
| `streaming`    | `boolean`                         | `false`      | false    | A new version is being generated: the pager locks, the body is `aria-busy` and a polite status says so. |

## v-model

| Model             | Type     | Default | Emits            | Notes                                                                 |
| ----------------- | -------- | ------- | ---------------- | --------------------------------------------------------------------- |
| `v-model:version` | `number` | `0`     | `update:version` | Zero-based index of the version shown, clamped by `ResponseBranches`. |

## Events

| Event   | Payload                                 | When                                                                         |
| ------- | --------------------------------------- | ---------------------------------------------------------------------------- |
| `close` | `(event: MouseEvent \| KeyboardEvent)`   | Close was pressed, or Escape inside the panel that no inner control handled. |
| `copy`  | `value: string`                         | Copy put the text on the clipboard.                                          |

## Slots

| Slot      | Scope                 | Notes                                                                                   |
| --------- | --------------------- | --------------------------------------------------------------------------------------- |
| `default` | `{ version: number }` | The artifact of the version shown: a `CodeBlock`, a `TableRoot`, prose. Scrolls inside. |
| `actions` | —                     | Extra icon actions in the toolbar, before Copy and Download (Insert into editor, Run).  |

## States

- `data-kind` on the root (`code`, `table`, `document`); `data-streaming` while a version is generated.
- One version: no pager; the toolbar keeps Copy and Download, and is not drawn when neither is set and the `actions` slot is empty.
- `streaming`: the pager is disabled, the body has `aria-busy="true"`, and the status reads `Generating a new version`.
- No `copyValue` / `downloadHref`: that control is not drawn.

## Motion & Animations

| Trigger | Animation / Transition                                            | Token | Reduced-motion fallback |
| ------- | ----------------------------------------------------------------- | ----- | ----------------------- |
| —       | none; opening and resizing belong to the owner's pane or `Drawer` | —     | —                       |

## Tokens

| Region  | Token                                                                    |
| ------- | ------------------------------------------------------------------------ |
| root    | `var(--bg-surface)`, `var(--border-default)`                             |
| header  | `.text-label-md` title, `.text-body-xs` + `var(--text-muted)` meta       |
| icon    | `var(--bg-surface-raised)`, `var(--text-muted)`, `var(--shape-elements)` |
| spacing | `var(--spacing-xs)`, `var(--spacing-sm)`, `var(--spacing-md)`            |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The root is a `section` named by its title (`aria-labelledby`), so it is a region landmark (`top-orders.sql`). The title is an `h2` with `tabindex="-1"`, the target of `focus()`.
- Close is an `IconButton` named `Close <title>`; Copy `Copy <title>`; Download `Download <title>`. The pager is `ResponseBranches` (`Artifact versions`, `Previous version`, `Next version`, a polite `2 of 3`).
- The body is a focusable scroll region named `<title> content`, so keyboard readers can scroll a long artifact; it is `aria-busy` while streaming.
- Keyboard: `Tab` order is title actions, then the toolbar, then the body; `Escape` anywhere inside closes the panel unless an inner control already handled it (`defaultPrevented`). Resizing is `Resizable.Handle`'s (arrow keys, Home, End).
- The streaming status is a polite live region, announced once when generation starts.

## Internationalization

| Key                        | English source             | Override prop |
| -------------------------- | -------------------------- | ------------- |
| `artifactCanvas.close`     | `Close {title}`            | —             |
| `artifactCanvas.copy`      | `Copy {title}`             | —             |
| `artifactCanvas.download`  | `Download {title}`         | —             |
| `artifactCanvas.versions`  | `Artifact versions`        | —             |
| `artifactCanvas.content`   | `{title} content`          | —             |
| `artifactCanvas.streaming` | `Generating a new version` | —             |

- The title and the meta are the owner's text; the title has `dir="auto"`.

## Right-to-left

- Layout: logical utilities only; the panel's inner layout mirrors, Close sits at the inline end.
- Icons: the pager chevrons mirror through `ResponseBranches`; the other icons are not directional.
- Keyboard: none beyond the inner controls.
- User data: code bodies keep their own direction (`CodeBlock` is LTR); the title is `dir="auto"`.

## Responsive

- Container queries: none; the canvas fills its pane (`h-full w-full`), and the toolbar wraps.
- Narrow: under the `md` breakpoint the owner shows the canvas in a full-height `Drawer` instead of a pane; the component is the same.
- Touch: icon controls are `IconButton` small, with its 40 px touch target.
- Reflow: no horizontal page scroll at 320 px; wide content scrolls inside the body.

## Performance

- Bundle budget: 6.5 KB gzip for `./artifact-canvas` initial chunk in `.size-limit.json` (`CopyButton`'s fallback stays an async chunk).
- Runtime budget: one slot render per version change.
- Heavy parts: none; the body is the owner's.

## Examples

- Default — a SQL artifact with three versions beside a conversation in a `Resizable` split; Close and Open return focus to each other.
- Table — a table artifact with one version and Download; Regenerate shows the streaming state.

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
