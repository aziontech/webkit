---
name: help-panel
category: content
structure: composition
status: implemented
checksum: fcba6749068e5cab7697fc8048ccc9d4070b66144fccc8ed56e1c2ea948d55cc
spec_version: 1
created: 2026-11-10
last_updated: 2026-11-10
---

# HelpPanel — Component Spec

## Purpose

The content of a help side region: a topic's title, a few sections of short guidance, and the
"Learn more" links that leave for the documentation — or, in tutorial mode, an ordered list of tasks
with the reader's progress through them. It is the thing that goes **inside** a side region, not the
region itself: the consumer places it in a `Drawer` or in the page's side rail, and that host owns
opening, closing and the close button.

It owns no open state, so it has no `Trigger` / `Content` and no `data-state="open|closed"`. Its anatomy
is the anatomy of a help page — `Header`, `Section`, `Links`, `Tutorial`, `Task` — composed by hand,
so a topic can omit the links, carry one section or five, or be a tutorial with no prose at all.

## When to use

- A Console screen needs contextual help beside the work: what this page is for, what a field means, where the docs are.
- A guided, multi-task tutorial runs beside the real UI, and the reader needs to see which task they are on and how many are done.
- The help content is loaded asynchronously and the region must reserve its space while it arrives (`loading`).

## When NOT to use

- A one-line hint attached to a single control → use `doc-tooltip` or the field's `helper-text`.
- The region itself (overlay, slide-in, close button, focus trap) → use `drawer`; put `help-panel` inside it.
- Ordered steps the reader navigates between, with the step's form filling the column beside it → use `stepper`.
- Numbered instructions inside a documentation page, read all at once → use `doc-steps` + `doc-step`.
- A page with nothing configured yet, which needs one call to action → use `empty-state`.

## Related

- `drawer` — the host that opens, closes and traps focus around a help panel shown as an overlay.
- `stepper` — the same dot language for steps the reader navigates; tutorial tasks are reported, not navigated.
- `link` — the standalone link each `HelpPanel.Links` row is composed from.
- `button` — the Start / Continue / Restart controls the consumer composes into a tutorial's `actions` slot.
- `skeleton` — what the panel renders in place of its content while `loading`.
- `doc-prose` — long-form documentation prose; a help section is a few short paragraphs, not an article.

## Best practices

- One topic per panel. When the reader moves to another part of the page, swap the panel's content — do not stack two headers.
- Keep each `Section` to a short paragraph or a short list. If the reader has to scroll a section, the content belongs in the docs and the panel should link to it.
- Title sections with the question the reader is asking (`What is a workload?`), not with a noun (`Overview`).
- Put links to the documentation in `HelpPanel.Links`, at the end, not inline in every section.
- In tutorial mode, exactly one task is `current`. Mark a task `complete` only when the real UI confirms it, never on click.
- Close affordances belong to the host. Do not put a close button in `HelpPanel.Header`; the `Drawer` or side rail already has one.

## Usage

```vue
<script setup>
  import HelpPanel from '@aziontech/webkit/help-panel'
  import Link from '@aziontech/webkit/link'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <HelpPanel aria-label="Help: Workloads">
    <HelpPanel.Header
      title="Workloads"
      description="Where your domains meet the applications that answer them."
    />

    <HelpPanel.Section title="What is a workload?">
      <p>A workload binds one or more domains to an application and a firewall.</p>
    </HelpPanel.Section>

    <HelpPanel.Tutorial
      title="Put your first site online"
      description="Three tasks, about five minutes."
    >
      <HelpPanel.Task
        title="Create an application"
        status="complete"
      >
        Choose a template or start from an empty application.
      </HelpPanel.Task>
      <HelpPanel.Task
        title="Create a workload"
        status="current"
      >
        Bind your domain to the application you just created.
      </HelpPanel.Task>
      <HelpPanel.Task title="Point your DNS">
        Add the CNAME record shown on the workload page.
      </HelpPanel.Task>

      <template #actions>
        <Button
          label="Continue"
          size="medium"
        />
      </template>
    </HelpPanel.Tutorial>

    <HelpPanel.Links>
      <Link
        label="Workloads documentation"
        href="https://www.azion.com/en/documentation/"
        target="_blank"
      />
      <Link
        label="Domains and certificates"
        href="https://www.azion.com/en/documentation/"
        target="_blank"
      />
    </HelpPanel.Links>
  </HelpPanel>
</template>
```

Tree-shaking alternative — the standalone root and each sub-component from its own entry (no
`Object.assign` compound pulled in):

```vue
<script setup>
  import HelpPanel from '@aziontech/webkit/help-panel-root'
  import HelpPanelHeader from '@aziontech/webkit/help-panel-header'
  import HelpPanelSection from '@aziontech/webkit/help-panel-section'
  import HelpPanelLinks from '@aziontech/webkit/help-panel-links'
  import HelpPanelTutorial from '@aziontech/webkit/help-panel-tutorial'
  import HelpPanelTask from '@aziontech/webkit/help-panel-task'
</script>
```

## Sub-components

The root ships a **compound API**: an `index.ts` (beside `help-panel.vue`) attaches every sub-component
to the root so `<HelpPanel.Header>` … `<HelpPanel.Task>` resolve from one import; the standalone imports
remain the tree-shaking path. The panel has no open/closed state, so there is no `Trigger` / `Content` —
every member is named after a part of a help page. Tutorial progress flows through `provide`/`inject`
(`injection-key.ts`, provided by `HelpPanel.Tutorial`, not by the root): each `HelpPanel.Task` registers
itself and its `status` with the nearest tutorial on mount, reads back its own ordinal, and unregisters
on unmount, so the consumer never counts tasks or numbers them by hand.

- `help-panel-header/help-panel-header.vue` — The topic's title and an optional one-line description. Renders a `<header>` holding an `<h2>` and, when `description` is non-empty, a `<p>`. No close affordance — the host owns closing.
  - Props: `title?: string` (default `''` — the topic's name, rendered as the panel's heading), `description?: string` (default `''` — one line under the title saying what the topic covers; not rendered when empty).
  - Slot: `default` — optional extra content under the description (a `Tag` naming the product state, for example).
  - `data-testid` fallback: `content-help-panel-header`.
- `help-panel-section/help-panel-section.vue` — One block of guidance with its own heading. Renders a `<section aria-labelledby>` holding an `<h3>` (only when `title` is non-empty) and the slot, in `text-body-sm`, with a fixed vertical rhythm between paragraphs and lists inside it.
  - Props: `title?: string` (default `''` — the question this section answers; the section renders no heading when empty).
  - Slot: `default` — the section's prose: paragraphs, short lists, inline `text-link` anchors.
  - `data-testid` fallback: `content-help-panel-section`.
- `help-panel-links/help-panel-links.vue` — The "Learn more" footer: a heading over a column of `Link` items the consumer composes. Renders a `<section aria-labelledby>` holding an `<h3>` and a vertical flex column of the slot, separated from the content above by a `Divider`.
  - Props: `title?: string` (default `'Learn more'` — the heading over the links).
  - Slot: `default` — `Link` items, one per destination.
  - `data-testid` fallback: `content-help-panel-links`.
- `help-panel-tutorial/help-panel-tutorial.vue` — Tutorial mode: a title, a description, a progress line derived from the registered tasks ("2 of 3 complete"), the ordered task list, and an action row. Renders a `<section aria-labelledby>` holding an `<h3>`, the description, the progress line, an `<ol>` wrapping the default slot, and the `actions` slot. Provides the tutorial context (the task registry and the derived counts) to its `HelpPanel.Task` children.
  - Props: `title?: string` (default `''` — the tutorial's name), `description?: string` (default `''` — one line on what the reader will have done at the end; not rendered when empty), `completed?: boolean` (default `false` — the owner marks the whole tutorial done; renders `data-completed` and a `Tag` reading `Completed` beside the title).
  - Slots: `default` — `HelpPanel.Task` items, in order; `actions` — the Start / Continue / Restart controls (`Button`) the consumer composes; the row is not rendered when the slot is empty.
  - `data-testid` fallback: `content-help-panel-tutorial`.
- `help-panel-task/help-panel-task.vue` — One task: a numbered marker, a title, and the task's instructions. Renders an `<li>`; must sit inside a `HelpPanel.Tutorial` — used anywhere else, its context composable throws a clear error. Registers with the tutorial on mount (ordinal + `status`) and re-reports when `status` changes.
  - Props: `title?: string` (default `''` — what the reader does, in their words), `status?: 'upcoming' | 'current' | 'complete'` (default `'upcoming'` — where the reader is in the tutorial; set by the owner from what the real UI confirmed).
  - Slot: `default` — the task's instructions, in `text-body-sm`.
  - `data-testid` fallback: `content-help-panel-task`.

Exported types (from the root folder, so a consumer can type the value it holds): `HelpPanelTaskStatus = 'upcoming' | 'current' | 'complete'`.

Resulting layout (no per-component `package.json`; the root `packages/webkit/package.json#exports`
resolves every path, and `.d.ts` is generated at publish time):

```
packages/webkit/src/components/content/help-panel/
├── help-panel.vue                         (root; aside landmark, loading state)
├── help-panel.test.ts
├── index.ts                               (compound: attaches the five parts to the root)
├── injection-key.ts                       (HelpPanelTutorialContext — provided by Tutorial)
├── composables/
│   └── use-help-panel-tutorial-context.ts (injects; throws outside a HelpPanel.Tutorial)
├── help-panel-header/
│   └── help-panel-header.vue
├── help-panel-section/
│   └── help-panel-section.vue
├── help-panel-links/
│   └── help-panel-links.vue
├── help-panel-tutorial/
│   └── help-panel-tutorial.vue
└── help-panel-task/
    └── help-panel-task.vue
```

Exports to add to `packages/webkit/package.json#exports` (flat public names; category lives in the
folder only):

```jsonc
"./help-panel": "./src/components/content/help-panel/index.ts",
"./help-panel-root": "./src/components/content/help-panel/help-panel.vue",
"./help-panel-header": "./src/components/content/help-panel/help-panel-header/help-panel-header.vue",
"./help-panel-section": "./src/components/content/help-panel/help-panel-section/help-panel-section.vue",
"./help-panel-links": "./src/components/content/help-panel/help-panel-links/help-panel-links.vue",
"./help-panel-tutorial": "./src/components/content/help-panel/help-panel-tutorial/help-panel-tutorial.vue",
"./help-panel-task": "./src/components/content/help-panel/help-panel-task/help-panel-task.vue"
```

Composed DS components (all present in `packages/webkit/package.json#exports`, imported by relative path
inside the package): `skeleton` (root, `loading`), `divider` (`Links`), `tag` (`Tutorial`, `completed`).
`link` and `button` are composed by the consumer through slots, never imported by the panel.

## Props

| Prop        | Type      | Default  | Required | JSDoc                                                                                      |
| ----------- | --------- | -------- | -------- | ------------------------------------------------------------------------------------------ |
| `ariaLabel` | `string`  | `'Help'` | false    | Accessible name for the complementary landmark the panel renders.                          |
| `loading`   | `boolean` | `false`  | false    | Renders skeleton lines in place of the content while the help topic loads; sets aria-busy. |

## Events

_No events — the panel is content; opening, closing and tutorial actions belong to the host and to the controls the consumer composes._

## Slots

| Slot      | Scope | Notes                                                                                                                              |
| --------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `default` | —     | The panel's parts — `HelpPanel.Header`, `HelpPanel.Section`, `HelpPanel.Tutorial`, `HelpPanel.Links` — in reading order. Not rendered while `loading`. |

## States

- Visual states: `default`, `loading`; on `HelpPanel.Task`: `upcoming`, `current`, `complete`
- `data-loading` on the root mirrors the `loading` prop
- `data-status` on `HelpPanel.Task` mirrors its `status` prop: `upcoming` | `current` | `complete`
- `data-completed` on `HelpPanel.Tutorial` mirrors its `completed` prop
- No `data-state` — the panel has no open/closed state (the host owns it)
- No `data-disabled` — nothing in the panel is interactive on its own; interactive content (`Link`, `Button`) is composed by the consumer and carries its own states

The root, while `loading`: the default slot is not rendered; in its place the root renders a title
line and three body lines with `Skeleton` (`kind="shape"`; title `width="60%"` `height="1.25rem"`, body
lines `width="100%"`, `width="100%"`, `width="75%"`, each `height="0.875rem"`), and sets
`aria-busy="true"`. The loading lines carry `aria-hidden="true"`; the landmark keeps its accessible
name.

The three task markers, and what each one renders:

| `data-status` | Marker                                                 | Title ink                | Screen-reader word |
| ------------- | ------------------------------------------------------ | ------------------------ | ------------------ |
| `upcoming`    | outlined in `--border-default`, muted, shows its number | `var(--text-muted)`      | `Not started`      |
| `current`     | outlined in `--secondary`, shows its number            | `var(--text-default)`    | `Current task`     |
| `complete`    | filled `--secondary`, `pi pi-check` glyph              | `var(--text-default)`    | `Complete`         |

The tutorial's progress line reads `<complete> of <total> complete`, counting registered tasks whose
`status` is `complete`. It is derived; the consumer never passes the counts.

## Motion & Animations

| Trigger                       | Animation / Transition                                     | Token (see `.claude/docs/DESIGN.md` § Animations)        | Reduced-motion fallback                            |
| ----------------------------- | ---------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------- |
| task `status` change          | `transition-colors` on the task marker and the task title  | inline · `duration-fast-02` · `ease-productive-entrance` | `motion-reduce:transition-none`                    |
| `loading` placeholder shimmer | `Skeleton` component (owns its own shimmer)                | component                                                | handled by `Skeleton` (suppressed under reduced motion) |

## Tokens

| Region                                   | Token (DESIGN.md)           |
| ---------------------------------------- | --------------------------- |
| typography (header title)                | `.text-heading-xs`          |
| typography (header description)          | `.text-body-sm`             |
| typography (section / links / tutorial title) | `.text-heading-xxs`    |
| typography (section prose, task instructions) | `.text-body-sm`        |
| typography (tutorial description)        | `.text-body-sm`             |
| typography (tutorial progress line)      | `.text-label-sm`            |
| typography (task title)                  | `.text-label-md`            |
| typography (task marker number)          | `.text-label-sm`            |
| typography (inline anchors in prose)     | `.text-link`                |
| title ink                                | `var(--text-default)`       |
| description / progress / muted ink       | `var(--text-muted)`         |
| marker surface (upcoming, current)       | `var(--bg-surface)`         |
| marker border (upcoming)                 | `var(--border-default)`     |
| marker border (current, complete)        | `var(--secondary)`          |
| marker surface (complete)                | `var(--secondary)`          |
| marker ink (complete)                    | `var(--secondary-contrast)` |
| shape (marker)                           | `var(--radius-full)`        |
| padding (root)                           | `var(--spacing-md)`         |
| gap (between panel parts)                | `var(--spacing-lg)`         |
| gap (title to body, inside a part)       | `var(--spacing-xs)`         |
| gap (between paragraphs, between tasks)  | `var(--spacing-sm)`         |
| gap (between links, marker to title)     | `var(--spacing-xxs)`        |

## Theme gaps

| Figma variable                         | Temporary primitive                                                                                    | Follow-up                                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| — (documentation gap, not a token gap) | `var(--radius-full)` — ships in the theme and is what `stepper` and `doc-step` already use for their dot | `TODO: document --radius-full in DESIGN.md § Shape; there is no --shape-* alias for a full circle` |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the panel itself is not focusable; focus rings belong to the composed `Link` / `Button` controls, which already carry `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- Keyboard map: `Tab` moves through the composed links and action buttons in reading order. The panel adds no key handling of its own — no roving tabindex, no arrow navigation. `Esc` and focus trap / restore are owned by the host (`Drawer`), not by the panel.
- ARIA: the root is an `<aside>` (complementary landmark) named by `aria-label` from `ariaLabel`; `aria-busy="true"` while `loading`. Headings form an outline — `HelpPanel.Header` is `<h2>`, `Section` / `Links` / `Tutorial` titles are `<h3>` — and each `<section>` is `aria-labelledby` its heading via `useId()`. The tutorial's task list is an `<ol>`; the `current` task's `<li>` carries `aria-current="step"`. The task marker glyph is `aria-hidden="true"`, and each task carries an `sr-only` status word (see States). The progress line is `aria-live="polite"` so a task completing in the real UI is announced.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the muted `upcoming` title and the description ink
- `motion-reduce:transition-none` on the task marker and title transition
- Touch target ≥40×40 px — not applicable to the panel's own markup (nothing in it is interactive); the composed `Link` / `Button` controls meet it

## Stories (Storybook)

- Default — a help topic: `HelpPanel.Header`, two `HelpPanel.Section`s, and `HelpPanel.Links` with two `Link`s.
- Tutorial — `HelpPanel.Header` plus a `HelpPanel.Tutorial` with three tasks (one `complete`, one `current`, one `upcoming`) and a `Continue` `Button` in `actions`. Justified as its own story because tutorial mode is a different composition of the same root, not an args delta — the same reason `Types` is a composite story on a component with a `kind`.
- Loading — the root with `loading` set; the args delta is `loading` only.

## Open questions

- **Heading levels are fixed (`h2` header, `h3` parts).** Inside a `Drawer` whose own title is an `h2`, the panel's header should arguably be an `h3`. A heading-level prop was not added (not in the brief); revisit if a host needs it.
- **Progress line microcopy is English and fixed** (`n of N complete`, `Completed`, the screen-reader status words). The brief adds no label props for them; a localized host would need a `progressLabel`-style prop or a slot — decide before `approved`.
- **`completed` is set by the owner, not derived** from "every task is `complete`". Deriving it would remove a prop but would also block a tutorial the owner wants to mark done early; kept as the brief states.
- **Root padding.** The root owns `p-(--spacing-md)` so it reads correctly in a bare side rail; inside a `Drawer` whose content area already pads, that doubles. Confirm against the Drawer's content padding during scaffold.
- **`HelpPanel.Links` is a column, not a list.** Wrapping each consumer-composed `Link` in an `<li>` needs slot-vnode iteration; the draft renders a flex column under a labelled `<section>` instead. Revisit if a11y review wants list semantics.
- **Task instructions render for every task**, not only the `current` one. Collapsing non-current tasks (Cloudscape's tutorial behaviour) would add a disclosure and motion; out of scope for this draft.

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
