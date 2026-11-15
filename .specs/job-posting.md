---
name: job-posting
category: sections
structure: monolithic
status: implemented
spec_version: 6
template: 2
checksum: faacb8f96cfcaac3f3bb998165285a30895003d67f4c894c6ff46face36cc870
created: 2026-11-14
last_updated: 2026-11-15
---

# JobPosting — Component Spec

## Purpose

The body of a careers posting page, under the posting's title band: the description in rows, one per section of the posting (a heading, then its paragraphs and bullet lists), beside a sticky rail that restates the posting (its area, its title and its facets such as department, location and contract) with the link to the application; then the application form, and a dialog that confirms a sent application with a way back to the open positions. From the design sample's careers job page. It is a page section — the site places it from a `{ _id: 'job-posting', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `section-title`, `overline`, `button`, `field`, `label`, `input`, `phone-input`, `file-dropzone`, `file-token-group`, `alert`, `dialog` and `panel`. It collects data, so it follows the forms exception of the page-section contract: it validates on submit only and emits `submit`; the site sends the application and hands the outcome back through `loading`, `submitted` and `failed`.

## When to use

- On the page of one open position, under a `hero-band` (`variant: 'title-band'`) that carries the posting's title and its apply link.

## When NOT to use

- For the list of open positions → use `listing-browser`.
- For a lead or contact form at the top of a landing page → use `hero-form`.
- For a newsletter sign-up at the end of a page → use `closing-call-to-action-newsletter`.

## Related

- `hero-band` — the title band above the posting; its action links to `#` plus `form.anchor`.
- `hero-form` — the sibling page section that also emits `submit` and takes `loading`, `submitted` and `failed`.

## Best practices

- Write each section as a short heading and its `blocks`: a `text` block per paragraph, a `list` block per bullet list, in the posting's order.
- Keep `facets` to the four the listing states (department, location, work arrangement, contract), each with a glyph.
- Set `form.anchor` (for example `apply`) and point the title band's action at `#apply`; the rail's apply button links there too.
- Put the format and size limits of a `file` field in its `helper`, and the accepted types in `accept`.
- Mark only what the team needs as `required`; say "Optional." in the `helper` of the rest.
- Send the application from the `submit` handler, read the file from `new FormData(event.target)`, and set `loading`, then `submitted` or `failed`.

## Usage

```vue
<script setup>
  import { ref } from 'vue'

  import JobPosting from '@aziontech/webkit/job-posting'

  const loading = ref(false)
  const submitted = ref(false)

  const send = async (event, values) => {
    loading.value = true
    await fetch('https://api.example.com/applications', {
      method: 'POST',
      body: new FormData(event.target)
    })
    loading.value = false
    submitted.value = true
  }
</script>

<template>
  <JobPosting
    area="Engineering"
    title="Senior Platform Engineer"
    apply-label="Apply for this position"
    :facets="[
      { label: 'Engineering', icon: 'ai ai-sitemap' },
      { label: 'San Francisco, California', icon: 'ai ai-map-pin' }
    ]"
    :sections="[
      {
        title: 'About the role',
        blocks: [{ variant: 'text', text: 'You will build the tools our engineers ship with.' }]
      }
    ]"
    :form="{
      anchor: 'apply',
      title: 'Apply for this position',
      submitLabel: 'Submit application',
      fields: [
        { name: 'name', variant: 'text', label: 'Name', required: true },
        { name: 'email', type: 'email', label: 'Email address', required: true }
      ]
    }"
    :messages="{
      missing: 'This field is required.',
      invalidEmail: 'Enter an email address like name@example.com.',
      invalidUrl: 'Enter the full URL, starting with https://.',
      error: 'We could not send your application. Try again.',
      successTitle: 'Application sent',
      successDescription: 'Thank you for applying. We will reply by email.',
      done: 'Done',
      browse: 'Browse files'
    }"
    :secondary-action="{ label: 'See open positions', href: '/careers' }"
    :loading="loading"
    :submitted="submitted"
    @submit="send"
  />
</template>
```

## Props

| Prop              | Type                  | Default     | Required | JSDoc                                                                                                                                                                                                                                                                         |
| ----------------- | --------------------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `form`            | `JobPostingForm`      | —           | true     | The application form: `{ title, description?, submitLabel, anchor?, ariaLabel?, fields }`, where `anchor` is the id of the apply section the rail button links to and a field is `{ name, type, label, required?, helper?, placeholder?, accept?, autocomplete?, country? }`. |
| `messages`        | `JobPostingMessages`  | —           | true     | Copy of the form and its outcomes: `{ missing, invalidEmail, invalidUrl, error, successTitle, successDescription, done, browse }`.                                                                                                                                            |
| `anchor`          | `string`              | `''`        | false    | In-page id set on the band so a `#hash` link can scroll to it.                                                                                                                                                                                                                |
| `area`            | `string`              | `''`        | false    | Area the posting is filed under, the overline of the rail.                                                                                                                                                                                                                    |
| `title`           | `string`              | `''`        | false    | Title of the posting, restated at the top of the rail; the band renders nothing when empty.                                                                                                                                                                                   |
| `facets`          | `JobPostingFacet[]`   | `[]`        | false    | Facts about the posting listed in the rail, in order; each is `{ label, icon? }`.                                                                                                                                                                                             |
| `applyLabel`      | `string`              | `''`        | false    | Label of the rail button that links to the application form; the button is left out when empty.                                                                                                                                                                               |
| `sections`        | `JobPostingSection[]` | `[]`        | false    | The description, one row per section in order; each is `{ title, blocks }` where a block is `{ variant: 'text', text }` or `{ type: 'list', items }`.                                                                                                                         |
| `secondaryAction` | `SectionTitleAction`  | `undefined` | false    | Link in the confirmation dialog back to the open positions; `{ label, href }`. Omitted when absent.                                                                                                                                                                           |
| `loading`         | `boolean`             | `false`     | false    | The site is sending the application: the submit button shows its loading state, every control is disabled and a submit is ignored.                                                                                                                                            |
| `submitted`       | `boolean`             | `false`     | false    | The site sent the application: the confirmation dialog opens.                                                                                                                                                                                                                 |
| `failed`          | `boolean`             | `false`     | false    | The site could not send the application: `messages.error` shows under the submit button.                                                                                                                                                                                      |

## Events

| Event    | Payload                                                | Description                                                                                                                                                                                                        |
| -------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `submit` | `(event: SubmitEvent, values: Record<string, string>)` | Fired on a valid submit while not `loading`; `values` maps each field `name` to its trimmed value (a phone number with its dial code, a file field to the file name); the file itself is in the form's `FormData`. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `invalid`, `loading`, `submitted`, `failed`
- `invalid`: on submit, an empty required field shows `messages.missing`, a malformed email `messages.invalidEmail` and a URL that does not start with `http://` or `https://` `messages.invalidUrl` under the field; focus moves to the first field in error; editing the field (or picking a file) clears its message; nothing is emitted
- `loading` (prop): the submit button shows its loading state, the `fieldset` and every control are disabled and a submit emits nothing; `data-loading` on the root
- `submitted` (prop): when it turns on, the confirmation dialog opens with `messages.successTitle`, `messages.successDescription`, the `secondaryAction` link and a `messages.done` button; closing the dialog (Done, the close button, `Escape` or the overlay) clears the form; `data-submitted` on the root
- `failed` (prop): a danger `Alert` with `messages.error` shows under the submit button; the form stays editable; `data-failed` on the root
- File field: an inline `file-dropzone` with a browse button takes one file; once picked, the file shows in a `file-token-group` whose remove button clears it and brings the dropzone back
- Description: each section row after the first draws a rule above it (`data-ruled`); a `list` block is a bulleted list
- Rail: shown from the large breakpoint up, sticky under the site header while the description scrolls; the apply button renders only when `applyLabel` is set
- Disabled, readonly: not states of the band; `loading` is the only lock
- Empty: when `title` is empty the band renders nothing but its root; with no `sections` the description column is empty and the rail still renders; with no `facets` the facet list is left out

## Motion & Animations

_none_

## Tokens

| Region               | Token (DESIGN.md)                                                                     |
| -------------------- | ------------------------------------------------------------------------------------- |
| rail title           | `.text-heading-sm`, `var(--text-default)`                                             |
| facets               | `.text-body-sm`, `var(--text-muted)`                                                  |
| description copy     | `.text-body-md`, `var(--text-muted)`                                                  |
| rules and marks      | `var(--border-default)`                                                               |
| reading measure      | `var(--layout-measure-content)`                                                       |
| form measure         | `var(--layout-measure-form)`                                                          |
| rail width           | `var(--container-xs)`                                                                 |
| insets               | `var(--spacing-xl)` / `var(--spacing-2xl)`                                            |
| rhythm               | `var(--spacing-xs)` / `var(--spacing-sm)` / `var(--spacing-md)` / `var(--spacing-lg)` |
| anchor scroll offset | `var(--spacing-2xl)`                                                                  |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the composed `button`, `input`, `phone-input`, `file-token-group` and `dialog` controls.
- Keyboard map: `Tab` walks the rail's apply link, then the fields in order (the file field's browse button, or its remove button once a file is picked), then the submit button; `Enter` in a text field or on the submit button submits; `Enter` or `Space` on the browse button opens the file picker. In the confirmation dialog `Tab` cycles the secondary action, Done and the close button (focus is trapped), and `Escape` closes it and returns focus (`dialog`'s Dialog (Modal) pattern).
- ARIA: the root is a plain `div` (the posting's title is the title band's heading); each description section heads with an `h2` through `section-title`; the rail restates the title as a paragraph, not a heading, so the outline lists the posting once. The fields sit in a `fieldset` whose visually hidden `legend` is `form.ariaLabel`, or `form.title`; each control is labelled through its own `Field.Label` with an id from `useId`, carrying the persistent Required tag of a `required` field from first render. An `email` field is an `<input type="email">` with `autocomplete="email"` and `spellcheck="false"`, a `url` field a text input with `inputmode="url"`. The file field's dropzone is a named `group`; its browse button is named `messages.browse` followed by the field label. Validation runs on submit only: a required field left empty takes the amber `required` state, a malformed value the red `invalid` state (`aria-invalid`), never both at once; the message is the field's helper text. The failure message is an `alert`; the confirmation is a modal `dialog` named by its title and described by its description.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components; copy uses the text tokens above.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the composed button, dropzone and dialog carry their own fallback.
- Touch target ≥40×40 px — the text fields, the buttons and the dialog actions are large or medium controls at least 40 px tall.

## Internationalization

No built-in strings: every visible string and accessible name comes from the props (`title`, `area`, `facets`, `applyLabel`, `sections`, `form`, `messages`, `secondaryAction`). The composed `dialog` close button and `file-dropzone` title keep their own locale catalogs.

| Key | English source | Override prop |
| --- | -------------- | ------------- |
| —   | —              | —             |

- Formatting: none; the file size in the file token is formatted by `file-token-group` with `Intl.NumberFormat`.

## Right-to-left

- Layout: logical utilities only (`border-s` on the rail, `ps-` on the bullet lists, `text-start`); the rail sits at the inline end.
- Icons: the apply button's `ai ai-chevron-right` is mirrored by `button`; facet glyphs are not mirrored.
- Keyboard: no arrow-key interaction of its own.
- User data: the posting copy is passed as props and inherits the page direction; field values are typed by the reader.

## Responsive

- Container queries: none; the band follows the page breakpoints.
- Narrow (below `lg`): the rail is hidden and the description takes the full width; the title band's apply link and the form remain. Below `sm` the form's fields stack in one column; from `sm` they sit two to a row, the file field across both.
- Touch: targets ≥ 40 px; no hover-only affordance.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; the description holds a reading measure and wraps.

## Performance

- Bundle budget: 50 KB gzip for `./job-posting` in `.size-limit.json` (`entryOnly`, like `hero-form`: `phone-input` carries its country list and `dialog` its motion; measured 49.1 KB).
- Runtime budget: none: static content and one form.
- Heavy parts: none; the dialog renders only while open.

## Examples

- Default — a posting with four description sections, four facets, the rail and the application form with text, email, phone, file and URL fields.
- States — the same posting with `failed` set under the form, and a button that sets `submitted` to open the confirmation dialog.

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
