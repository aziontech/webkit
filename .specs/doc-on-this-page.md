---
name: doc-on-this-page
category: documentation
structure: monolithic
status: implemented
spec_version: 1
checksum: 15f014d641a8a19e4feda9172e924ab69c9788729efacaf639f1b9784ff2f3c0
created: 2026-08-22
last_updated: 2026-08-22
---

# DocOnThisPage — Component Spec

## Purpose

The "On this page" rail: the page's own headings, the active one lit, nested headings indented under their parent — followed by the rail's complementary groups (the repository, the community). The rail is a single path that bends inward as the outline nests, and the active marker is a dash cut from that same path, so moving between headings slides the marker **along** the line, through the bends, rather than jumping a separate bar between two positions.

## When to use

- Beside the body of a long documentation page, as in-page navigation over its `h2`/`h3` outline.
- To carry a page's peer links (repository, community) under the outline, each as its own named group.

## When NOT to use

- Expecting it to track scroll. It is presentation only: `activeId` is a prop, because the page owns the scroll container and therefore owns which heading is active.
- For navigation _between_ pages — that is `DocPagination` at the foot, or the sidebar.
- For an outline deeper than a couple of levels; the indent is legible for two, not for five.

## Related

- `DocPageHeader` — the masthead above the body, whose `h1` is chrome, so the outline starts at `h2`.
- `DocPagination` — navigation between documents, where this is navigation within one.
- `use-heading-nav` — the composable a page uses to receive a rail activation and scroll its own container.

## Best practices

- Feed it depth 2 and 3 only; the rail indents each level by 8px and a third level reads as noise.
- Own the active heading in the page (a scroll-spy) and pass it down; do not expect the rail to guess.
- Keep the complementary groups to peers of the page, never sections of it — a reader must not read "Join us on Discord" as part of what they are reading.

## Usage

```vue
<script setup>
  import DocOnThisPage from '@aziontech/webkit/doc-on-this-page'
</script>

<template>
  <DocOnThisPage
    :items="[
      { id: 'deploy', text: 'Deploy an application', depth: 2 },
      { id: 'what-you-get', text: 'What you get', depth: 3 }
    ]"
    :active-id="activeHeading"
    :groups="[
      {
        label: 'Repository',
        links: [
          { label: 'View source', href: 'https://github.com/aziontech', icon: 'pi pi-github' }
        ]
      }
    ]"
    @select="(event, item) => scrollToHeading(item.id)"
  />
</template>
```

## Props

| Prop       | Type            | Default          | Required | JSDoc                                                      |
| ---------- | --------------- | ---------------- | -------- | ---------------------------------------------------------- |
| `items`    | `DocTocItem[]`  | `[]`             | false    | The headings, in document order.                           |
| `activeId` | `string`        | `''`             | false    | The id of the heading currently in view.                   |
| `title`    | `string`        | `'On this page'` | false    | The rail's own heading.                                    |
| `groups`   | `DocTocGroup[]` | `[]`             | false    | Complementary groups rendered below the outline, in order. |

## Events

| Event    | Payload                                 | Notes                                                                                                              |
| -------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `select` | `(event: MouseEvent, item: DocTocItem)` | Fired when a rail entry is activated; the page decides what scrolling means. Event first, per `event-payloads.md`. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover` (a morphing highlight follows the pointer), and the active entry
- The active entry carries `aria-current="location"`; the marker is a dash cut from the rail path, positioned by measured length rather than by an index
- The complementary groups are deliberately drawn as peers: no rail, no indent, no active marker

## Motion & Animations

| Trigger                       | Animation / Transition                                                     | Token (see `.claude/docs/DESIGN.md` § Animations)   | Reduced-motion fallback         |
| ----------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------- |
| active heading changes        | the dash travels along the path (`stroke-dasharray` / `stroke-dashoffset`) | `duration-moderate-02` · `ease-productive-entrance` | `motion-reduce:transition-none` |
| pointer moves between entries | `transition-[top,left,width,height,opacity]` on the hover highlight        | inline (matches catalog)                            | `motion-reduce:transition-none` |

## Tokens

| Region                           | Token (DESIGN.md)                                                                      |
| -------------------------------- | -------------------------------------------------------------------------------------- |
| typography (title, entries)      | `.text-label-sm`                                                                       |
| typography (group overline)      | `.text-overline-xs`                                                                    |
| text (entries)                   | `var(--text-muted)`                                                                    |
| text (active entry, group links) | `var(--text-default)`                                                                  |
| rail                             | `var(--border-default)`                                                                |
| marker                           | `var(--primary)`                                                                       |
| surface (hover highlight)        | `var(--bg-hover)`                                                                      |
| shape                            | `var(--shape-elements)`                                                                |
| spacing                          | `var(--spacing-md)` / `var(--spacing-sm)` / `var(--spacing-xs)` / `var(--spacing-xxs)` |
| ring                             | `var(--ring-color)`                                                                    |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: each entry takes the focus ring on `focus-visible`.
- Keyboard map: `Tab` moves through the entries and then through each group's links; `Enter` activates. The rail owns no arrow-key model — it is a list of links, not a widget.
- ARIA: the outline is a `nav` named by `title`, and **each complementary group is its own named `nav`**, so the three read as three landmarks rather than one long list. Entries are `li` children of a `ul` (the axe `list` rule requires that), and the active entry carries `aria-current="location"`. The rail path and the group glyphs are decorative (`aria-hidden`).
- The marker is never the only signal: the active entry also changes ink and carries `aria-current`, so the state does not depend on seeing the dash.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons).
- Touch target: entries are padded rows; the rail itself is not interactive.

## Stories (Storybook)

- Default — a two-level outline with an active heading and one complementary group.
- Nesting and groups — composite story with a deeper outline and two groups, which is the only way to see the rail bend between levels and the groups render as peers rather than entries. Justified in writing here because the bend and the peer treatment are the component's two central decisions and neither is visible in a flat single-group story.

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
