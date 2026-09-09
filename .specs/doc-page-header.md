---
name: doc-page-header
category: documentation
structure: monolithic
status: implemented
spec_version: 1
checksum: 0f497e00e7d9821b5fd7faa38768717c38f90bd082daabeeb4de10471e18501a
created: 2026-08-22
last_updated: 2026-08-28
---

# DocPageHeader — Component Spec

## Purpose

The masthead of a documentation page: where the reader is (the breadcrumb), what the page is (the title), what they can do with it (a Copy Page control that hands the page to an AI tool — or, through the `actions` slot, the consumer's own menu; the trail is likewise slottable, for an application whose crumbs route rather than navigate), the deck that says what they will have by the end, and when the content last changed. It closes on a rule spanning the column, which is what gives every `h2` below it something to be subordinate to.

## When to use

- At the top of any documentation or changelog page, above `DocProse`.

## When NOT to use

- For an application screen's title — that is `PageHeading`, which carries console actions rather than a Copy Page control.
- For a section heading inside a page — the content's own `h2` does that, and the masthead's `h1` is chrome.

## Related

- `DocProse` — the body below it. The masthead's `h1` is chrome, so authored content starts at `h2`.
- `DocOnThisPage` — the rail beside the body, which lists those `h2`s.
- `Button` / `Tooltip` / `Divider` — the meta line's entries: a quiet `text` button (an anchor when the entry has an `href`), the sentence its label has no room for, and the rule between two of them.

## Best practices

- Give every `metaActions` entry a `tip`: two or three words name a control, and only a sentence says what it does.
- Give an entry an `href` when it has a destination, so it is a real link — then prevent the default in `meta-action` if the app routes in-page.
- Let `lastUpdated` come from the page's own frontmatter. It is the author's claim that the content changed, not the file's mtime.
- Put the current page last in `breadcrumb`; it is marked as current for you.
- Use `title` and `details` for a page ABOUT something (a tool, a product): its mark and maker are a title, and its facts belong between the deck and the meta line.

## Usage

```vue
<script setup>
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
</script>

<template>
  <DocPageHeader
    title="Deploy an application"
    description="Go from a template to a live edge application in a few clicks."
    :breadcrumb="[{ label: 'Docs', href: '/docs' }, { label: 'Deploy an application' }]"
    last-updated="2026-06-30"
    :meta-actions="[
      {
        value: 'copy',
        label: 'Copy as Markdown',
        icon: 'pi pi-copy',
        tip: 'Copy this page as Markdown, ready to paste into an assistant.'
      },
      {
        value: 'agent',
        label: 'Agent setup',
        icon: 'pi pi-microchip-ai',
        href: '/docs/agent-setup',
        tip: 'Set up your coding agent to build on Azion.'
      }
    ]"
    @meta-action="(event, item) => onPageAction(event, item)"
  />
</template>
```

## Props

| Prop          | Type              | Default | Required | JSDoc                                                                   |
| ------------- | ----------------- | ------- | -------- | ----------------------------------------------------------------------- |
| `title`       | `string`          | `''`    | false    | The page title.                                                         |
| `description` | `string`          | `''`    | false    | The deck under the title.                                               |
| `breadcrumb`  | `DocCrumb[]`      | `[]`    | false    | Ancestor trail, current page last.                                      |
| `lastUpdated` | `string`          | `''`    | false    | When the page's content last changed. ISO date, or a ready-made string. |
| `metaActions` | `DocPageAction[]` | `[]`    | false    | The controls on the meta line, in reading order.                        |

## Events

| Event         | Payload                                    | Notes                                                                                                                                                                                        |
| ------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `meta-action` | `(event: MouseEvent, item: DocPageAction)` | Fired when a meta-line control is activated; `item` is the entry that was picked. Event first, per `event-payloads.md`. A link's default navigation is the consumer's to keep or to prevent. |

## Slots

| Slot         | Scope | Notes                                                                                      |
| ------------ | ----- | ------------------------------------------------------------------------------------------ |
| `breadcrumb` | —     | The trail; replaces the built-in `Breadcrumb` fed by the `breadcrumb` prop.                |
| `title`      | —     | The page's name; replaces the built-in `h1`, for a title that is more than a string.       |
| `actions`    | —     | A control on the title's line. Empty by default; the meta line carries the page's actions. |
| `details`    | —     | Rows between the deck and the meta line — a page's own facts, tags or references.          |

## States

- Visual states: `default`. The masthead holds no interactive state of its own; each meta-line entry owns its own hover, focus and tooltip.
- Each region renders only when it has content: no breadcrumb, deck, or meta line appears empty. An unfilled slot with a `v-if`-ed fallback renders no element, so a masthead with no trail pays no gap for the region; an empty `metaActions` with no date renders no meta line at all.
- `data-undated` on the meta line when there is no date: the line then starts with a `text` button, whose label sits one spacing step inside its own box, so the row is pulled left by exactly that padding to keep the ink on the column.
- The rules between entries render from `md` up only. Below that the line wraps per entry, and a rule at the end of a wrapped line has nothing after it.
- Below `sm` a passed `actions` control leaves the title's line and stacks under it at its natural width; from `sm` up the two share one row.

## Motion & Animations

_none_

## Tokens

| Region                    | Token (DESIGN.md)                           |
| ------------------------- | ------------------------------------------- |
| typography (title)        | `.text-heading-2xl` / `sm:.text-heading-xl` |
| typography (deck)         | `.text-body-md`                             |
| typography (last updated) | `.text-label-sm`                            |
| typography (meta entry)   | `Button` `kind="text"` `size="small"`       |
| text                      | `var(--text-default)`                       |
| text (last updated)       | `var(--text-muted)`                         |
| border (the closing rule) | `var(--border-default)`                     |
| border (entry separator)  | `Divider` `orientation="vertical"`          |
| spacing                   | `var(--spacing-lg)` / `var(--spacing-xxs)`  |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: inherited from `Breadcrumb`, `Button` and `Tooltip`; the masthead adds no focusable element of its own.
- Keyboard map: `Tab` reaches the breadcrumb links and then each meta-line entry in reading order; a `tip` opens on focus, not on hover alone, so a definition is never pointer-only. The separators are `aria-hidden` — three announced separators on the way to three controls is noise.
- ARIA: the root is a `header`. The title is the page's single `h1`, so authored content must start at `h2`. The "last updated" glyph is decorative (`aria-hidden`) because the words "Last updated" sit beside it, and the date is wrapped in `<time datetime>` so the machine-readable value survives formatting.
- The ISO date is parsed and rendered in **UTC** on purpose: read as local time, a bare `2026-06-30` becomes the 29th for every reader west of Greenwich.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons).
- Touch target: each meta-line entry is a standard `small` button (28px) with its own hover surface; nothing else is interactive.

## Stories (Storybook)

- Default — the full masthead: breadcrumb, title, deck and the meta line.
- Actions — composite story of the belt's entry shapes in one line: a button, an in-app link, and an external link. Justified in writing here because the shapes differ only by the entry's own fields, which no single-arg story shows.
- Undated — the meta line with no date, which is the only way to see the left compensation that keeps the first label on the column.
- Slots — the `title` and `details` regions carrying an identity card, which is what those slots exist for.

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
