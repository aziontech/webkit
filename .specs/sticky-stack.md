---
name: sticky-stack
category: marketing
structure: monolithic
status: implemented
spec_version: 1
checksum: ead7590ee79d019a4fb482b4a9ec9021190c7c19c782c924b19dac0d8dc7c7ad
created: 2026-09-25
last_updated: 2026-09-25
---

# Sticky Stack — Component Spec

## Purpose

A band that pins to the viewport and is read by scrolling through it: a stack of claims on one side, one piece of media on the other, and the scroll position — not a pointer — deciding which claim is open. Each claim expands in turn while the ones already read collapse and stack above it, so the column keeps one height and the reader always sees where they are in the run. The media beside it is replaced, not dimmed: the outgoing scene leaves and the incoming one mounts, so a scene that animates plays its entrance every time it is reached.

## When to use

- For a sequence of claims a reader should take in one at a time, each with a medium worth looking at — five ways a platform is used, each with the file you would actually write.
- When the media is the payload and the copy is the caption: a code sample, a console shot, an official scene.
- As the one band on a page that rewards scrolling slowly, placed where a reader has already committed to the page.

## When NOT to use

- For peer claims a reader should be able to jump between at will → use `media-tabs`, which selects on hover, click and a timer without taking the scroll.
- For one claim beside one picture → use `media-split`.
- For an ordered walkthrough the reader steps through by hand → use `accordion-gallery`.
- For questions and answers, or any run longer than about six items → use `faq`. A pinned band holds the page for its whole run, and a long run holds it too long.
- On a page that is already a single short screen: there is no scroll to spend.

## Related

- `media-tabs` — the pointer-driven sibling. Same two-column anatomy; the selection moves on hover, click and a timer, and the band does not pin.
- `accordion-gallery` — the sequenced sibling a reader drives by clicking, with a progress bar per step.
- `media-split` — one claim, one medium, no selection and no pin.
- `code-block` — the medium this band most often holds, one sample per claim.
- `illustration` — the official scene a claim's `media` slot otherwise holds.
- `section-title` — the heading above the band; this component carries no title of its own.

## Best practices

- Keep the run to three to six claims. The band holds the page for `dwell` of a screen per claim, and a reader who cannot see the end of it reads it as a page that will not let go.
- Write each claim to stand alone. A reader can land mid-band from a deep link or a focus jump, so no claim may depend on the one above it.
- Keep a title to one line. The collapsed rows set the column's height, and a title that wraps changes it for every claim at once.
- Keep a description to two or three lines. Only the open claim shows one, and a long one pushes the stack past the pinned frame.
- Give every claim a medium. The frame holds one at a time and mounts it fresh, so a claim with nothing to show reads as a band that broke rather than one that is quiet.
- Use media of the same shape. The frame does not resize between claims, and a scene that changes the frame's height un-pins the band mid-read.
- Set `--sticky-stack-top` to the height of any sticky header above the band, or the first claim opens underneath it. Set it on a wrapper around the band rather than on the band's own tag: custom properties inherit, and the band is not a style seam.
- Leave `showProgress` on. It is the only thing telling a reader how much of the pin is left.
- Raise `dwell` for claims that carry code a reader must actually read; lower it for scenes that are grasped at a glance.

## Usage

```vue
<script setup>
  import CodeBlock from '@aziontech/webkit/code-block'
  import StickyStack from '@aziontech/webkit/sticky-stack'

  const samples = [
    {
      label: 'azion.config.js',
      value: 'build',
      language: 'javascript',
      fileName: 'azion.config.js',
      code: "import { defineConfig } from 'azion'\n\nexport default defineConfig({ build: { preset: 'typescript' } })"
    }
  ]
</script>

<template>
  <div class="[--sticky-stack-top:3.5rem]">
    <StickyStack
      :items="[
        {
          title: 'Automated deployment via Git or CLI',
          description:
            'Push to a branch or run one command; the platform builds the project and puts the result in every location.'
        },
        {
          title: 'Infrastructure as code with Terraform',
          description:
            'Declare workloads, rules and domains in the provider and apply them the same way as the rest of your estate.'
        }
      ]"
    >
      <template #media>
        <CodeBlock
          :tabs="samples"
          show-line-numbers
        />
      </template>
    </StickyStack>
  </div>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `items` | `StickyStackItem[]` | `[]` | false | The claims, in reading order; each item is a title, the sentence that opens with it, and the image shown while it is open. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Height the open claim is held to, and so the height of the whole stack beside the media. |
| `dwell` | `number` | `0.7` | false | Screen-heights of scrolling each claim holds while the band is pinned; the band's total scroll is one screen plus this much per claim. |
| `showProgress` | `boolean` | `true` | false | Fills a hairline along the open claim's bottom edge as its share of the scroll is spent. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `index-change` | `number` | The open claim changed; the payload is the index now open. Fires on the scroll that moved it and on a reader selecting a claim. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `media` | `{ item: StickyStackItem, index: number, active: boolean }` | The claim's medium; replaces the image built from the item's own source. Mounted fresh on every change, so an entrance animation inside it replays. |

## States

- Visual states: `default`, `hover`, `focus-visible` on each claim's title control
- `data-active` marks the open claim; it holds the plain text tone and shows its description
- `data-complete` marks every claim already read; they collapse to their title and rest at a muted tone, further dimmed so the read part of the run is legible at a glance, stacked above the open one
- `data-size` carries the size token, which is what sets the open claim's height and so the stack's height
- `data-progress` is present on the root while `showProgress` is on
- The media frame shows exactly one medium: the outgoing one leaves as the incoming one mounts
- Below `lg` the band does not pin: every claim is open, each with its own medium under it, and nothing moves
- Empty: when `items` is empty the band renders nothing

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| a claim opens or collapses as the scroll moves | `transition-[grid-template-rows] duration-moderate-01 ease-productive-entrance` | inline (catalog duration + easing) | `motion-reduce:transition-none` |
| a claim dims as it is read past | `transition-[color,opacity] duration-moderate-01 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |
| the medium for the newly open claim arrives | `animate-fade-in` | semantic (fade-in) | `motion-reduce:animate-none` |
| the medium for the claim just closed leaves | `animate-fade-out` | semantic (fade-out) | `motion-reduce:animate-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (claim title) | `.text-heading-md` |
| typography (claim description) | `.text-body-md` |
| surface | `var(--bg-surface)` |
| canvas (media frame) | `var(--bg-canvas)` |
| text (open claim) | `var(--text-default)` |
| text (read / unread claim) | `var(--text-muted)` |
| border (band rules and the seam) | `var(--border-default)` |
| progress hairline | `var(--primary)` |
| spacing.x | `var(--spacing-xl)` |
| spacing.y | `var(--spacing-md)` |
| ring | `var(--ring-color)` |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on every claim's title control
- Keyboard map: `Tab` reaches each claim's title control in reading order; focusing or activating one scrolls the band to that claim's share of the scroll, so a keyboard reader moves the band exactly as a pointer reader does. There is no key that scrolls the page other than the reader's own — the band never takes the scroll it is given.
- ARIA: the claim list is an `<ol>` (the run is ordered); the open claim's control carries `aria-current="true"`; the progress hairline is `aria-hidden="true"`; the scroll anchors are `aria-hidden="true"`
- Every claim's description stays in the accessibility tree while collapsed (clipped, never `display: none`), so the whole run is readable without scrolling through it
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the muted tone a read claim rests at
- `motion-reduce:transition-none` / `motion-reduce:animate-none` on every animated state; the pin itself is not motion and stays
- Touch target ≥40×40 px: each claim's control spans its whole row

## Stories (Storybook)

- Default
- Sizes — composite story rendering every `size` value.

The band is read by scrolling, and a Storybook canvas is short. Both stories therefore set `parameters.layout: 'fullscreen'`, and the Docs canvas shows the band's resting state (first claim open) rather than its full run — the "Show code" snippet is what a consumer pastes. No extra story demonstrates the scroll; a story cannot scroll itself.

## Constraints — DO NOT

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
