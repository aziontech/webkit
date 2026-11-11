---
name: upload-progress
category: feedback
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: e4f7706c93bc7db52b9e5d7954adfd457575d1fbe951a37deaf457d29158c588
created: 2026-11-11
last_updated: 2026-11-11
---

# UploadProgress — Component Spec

## Purpose

A card that follows a file transfer to its end while the person keeps working: uploading files into a bucket, moving objects between folders or deleting them. Its header says what is happening and how far it got (`Uploading 2 of 5 files`) over one overall bar; below it each file has its own bar, its state and a Cancel or Retry button. When every file has finished the header turns into the outcome (`5 files uploaded`, or `4 files uploaded, 1 failed` with Retry failed) and the card can be closed. It floats at the inline-end bottom corner by default, so it survives route changes in the console shell. Taken from the Console Kit's object storage progress card, extended with the per-file list the design sample's bucket browser needs.

## When to use

- A bucket upload that keeps running after the upload dialog closes.
- A move or delete of many objects that takes more than a second or two.
- Any batch of file transfers where the person should be able to cancel one file, or retry the ones that failed.

## When NOT to use

- The files picked in a form before it is submitted → use `file-token-group`.
- A single action with no per-file parts (a deploy, a build) → use the async-submit toast (`toast` with Edit and Redeploy).
- Progress of a page load or a determinate step inside a form → use `progress`.

## Related

- `file-token-group` — the files picked for upload, before the transfer starts.
- `progress` — the bar used for the overall and per-file progress.
- `toast` — reports the outcome of a single async action.

## Best practices

- Keep the card until the person closes it when anything failed; close it yourself a few seconds after a clean finish if you like.
- Send `error` as the reason (`Connection lost`, `Larger than 300 MB`), not a status code.
- Update `progress` no more than a few times a second; the bars animate between values.
- Report the outcome with a toast only when the card is not in view (for example, after the person collapsed it and left the page).

## Usage

```vue
<script setup>
  import UploadProgress from '@aziontech/webkit/upload-progress'

  const items = [
    { id: '1', name: 'logo.svg', size: 4210, status: 'done' },
    { id: '2', name: 'app.js', size: 248320, status: 'running', progress: 64 },
    { id: '3', name: 'styles.css', size: 52100, status: 'queued' }
  ]
</script>

<template>
  <UploadProgress
    :items="items"
    @cancel="(id) => {}"
  />
</template>
```

## Props

| Prop         | Type                             | Default    | Required | JSDoc                                                                                         |
| ------------ | -------------------------------- | ---------- | -------- | --------------------------------------------------------------------------------------------- |
| `items`      | `UploadProgressItem[]`           | `[]`       | false    | The files in the transfer, in order, with their state and progress.                           |
| `operation`  | `'upload' \| 'move' \| 'delete'` | `'upload'` | false    | What the transfer does; picks the header wording and the glyph.                               |
| `title`      | `string`                         | `''`       | false    | Overrides the header text. Empty builds it from the operation and the counts.                 |
| `floating`   | `boolean`                        | `true`     | false    | Fixes the card to the inline-end bottom corner of the viewport; false renders it in the flow. |
| `cancelable` | `boolean`                        | `true`     | false    | Shows Cancel on running and waiting files and Cancel all in the header.                       |

Types: `UploadProgressStatus = 'queued' | 'running' | 'done' | 'error' | 'canceled'`; `UploadProgressItem = { id: string; name: string; size?: number; progress?: number; status: UploadProgressStatus; error?: string }`. `progress` is 0–100; a running file without it shows an indeterminate bar.

## v-model

| Model               | Type      | Default | Emits              | Notes                                                     |
| ------------------- | --------- | ------- | ------------------ | --------------------------------------------------------- |
| `v-model:collapsed` | `boolean` | `false` | `update:collapsed` | Hides the file list and keeps the header and overall bar. |

## Events

| Event    | Payload       | Notes                                                                                 |
| -------- | ------------- | ------------------------------------------------------------------------------------- |
| `cancel` | `id?: string` | Cancel on one file (its `id`) or Cancel all (no `id`). The parent stops the transfer. |
| `retry`  | `id?: string` | Retry on one failed file (its `id`) or Retry failed (no `id`).                        |
| `close`  | —             | Close was pressed; offered only once every file has finished.                         |

## Slots

| Slot      | Scope | Notes                                                                                        |
| --------- | ----- | -------------------------------------------------------------------------------------------- |
| `actions` | —     | Buttons for the finished transfer beside Close (for example `Open folder`). Shown when done. |

## States

- Root `data-state`: `running` (some file queued or running) | `done` (all finished, none failed) | `failed` (all finished, at least one error).
- Root `data-floating` when floating; `data-collapsed` when the list is hidden.
- Row `data-status`: `queued` | `running` | `done` | `error` | `canceled`.

## Motion & Animations

| Trigger        | Animation / Transition                           | Token                  | Reduced-motion fallback      |
| -------------- | ------------------------------------------------ | ---------------------- | ---------------------------- |
| card appears   | `animate-popup-scale-in`                         | popup scale-in (theme) | `motion-reduce:animate-none` |
| progress moves | inherited from `progress` (`transition-[width]`) | duration `moderate-02` | inherited                    |
| finished mark  | `OutcomeMark` `animated`                         | as in `outcome-mark`   | static under reduced motion  |

## Tokens

| Region      | Token                                                                                                             |
| ----------- | ----------------------------------------------------------------------------------------------------------------- |
| card        | `var(--bg-surface-raised)`, border `var(--border-default)`, radius `var(--shape-card)`, shadow `var(--shadow-sm)` |
| header text | `var(--text-default)`; counts and sizes `var(--text-muted)`                                                       |
| row error   | `var(--danger-contrast)`                                                                                          |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The card is a `section` named by the catalog (`File transfers`), a region landmark that screen-reader users can jump to.
- The header text is mirrored in a visually hidden `role="status"` region (polite), so each file finishing and the final outcome are announced; percentages are not announced.
- The overall bar is a `progressbar` named by the header text; each row bar is named `<file> progress`.
- Keyboard map: Tab reaches the collapse toggle (`aria-expanded`, `aria-controls` the list), Cancel all or Retry failed and Close, then each row's Cancel or Retry. After Close the card unmounts in the parent; the parent returns focus to the control that started the transfer.
- State is never colour alone: rows carry a status word (`Waiting`, `Done`, `Canceled`) or the error text, and an `OutcomeMark` in the header when finished.
- Contrast: text ≥ 4.5:1 on `--bg-surface-raised` in both themes.

## Internationalization

| Key                           | English source                                 | Override prop |
| ----------------------------- | ---------------------------------------------- | ------------- |
| `uploadProgress.label`        | File transfers                                 | —             |
| `uploadProgress.uploading`    | `Uploading {done} of {count} file(s)` (plural) | `title`       |
| `uploadProgress.moving`       | `Moving {done} of {count} file(s)` (plural)    | `title`       |
| `uploadProgress.deleting`     | `Deleting {done} of {count} file(s)` (plural)  | `title`       |
| `uploadProgress.uploaded`     | `{count} file(s) uploaded` (plural)            | `title`       |
| `uploadProgress.moved`        | `{count} file(s) moved` (plural)               | `title`       |
| `uploadProgress.deleted`      | `{count} file(s) deleted` (plural)             | `title`       |
| `uploadProgress.failed`       | `{count} failed` (plural)                      | —             |
| `uploadProgress.queued`       | Waiting                                        | —             |
| `uploadProgress.done`         | Done                                           | —             |
| `uploadProgress.canceled`     | Canceled                                       | —             |
| `uploadProgress.cancelAll`    | Cancel all                                     | —             |
| `uploadProgress.cancelItem`   | Cancel {name}                                  | —             |
| `uploadProgress.retryItem`    | Retry {name}                                   | —             |
| `uploadProgress.retryFailed`  | Retry failed                                   | —             |
| `uploadProgress.close`        | Close                                          | —             |
| `uploadProgress.expand`       | Show files                                     | —             |
| `uploadProgress.collapse`     | Hide files                                     | —             |
| `uploadProgress.itemProgress` | {name} progress                                | —             |

- Formatting: sizes with `formatFileSize`, percentages with `formatNumber` (`style: 'percent'`), plural rules with `Intl.PluralRules`, all from `useLocale`.

## Right-to-left

- Layout: logical utilities only; the floating card anchors at `end-*`, so it sits at the bottom left under rtl.
- Icons: the chevron of the collapse toggle points up or down and is not mirrored; status glyphs are not mirrored.
- Keyboard: Tab order follows the reading order.
- User data: file names render in `<bdi>`.

## Responsive

- Container queries: none. Floating, the card is `--container-xs` wide and capped to the viewport minus the gutters; below 640 px it spans the viewport width minus the gutters.
- Narrow: names truncate with an ellipsis and keep the full name in `title`; the list scrolls inside a capped height.
- Touch: buttons are `IconButton` and `Button` small (32 px).
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: see `.size-limit.json` entry `upload-progress`.
- Runtime budget: 200 rows update in < 16 ms per progress tick.
- Heavy parts: none.

## Stories (Storybook)

- Default — an upload in progress: one done, one running, one waiting.
- Finished — justified: the failed outcome with Retry failed and an `actions` slot button.
- Move — justified: a move operation rendered in the flow (`floating=false`), collapsed.

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
