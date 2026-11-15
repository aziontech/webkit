---
name: cli-terminal
category: section
structure: monolithic
status: implemented
spec_version: 3
created: 2026-11-05
last_updated: 2026-11-15
checksum: 0345e5c92a4c71c4450c51ba3efdc9a68cab25ea548f0a84fce9fe0bedbf0524
---

# CliTerminal — Component Spec

## Purpose

The Azion CLI band of a product page: a horizontal section title with one outlined button, over a terminal on the pixelate texture that runs off the frame's bottom rule. The terminal is either a recorded Azion CLI session typed live by a `console-mockup` (`script`), in a fixed-height stage that rises in when it scrolls into view, or a static session whose lines enter one after another (`session`). It is a page section — the site places it from a `{ _id: 'cli-terminal', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `button`, `registration-frame`, `texture`, `console-mockup` and `code-block`.

## When to use

- Use CliTerminal only on marketing pages for a full-width terminal session.
- To close a product argument on how little it takes to ship from the terminal, like Functions and Workloads.

## When NOT to use

- For a config file or handler beside the claim → use `media-split-section` with `codeTabs`.
- For several capabilities, each with its own file → use `feature-scroll` with code items.

## Related

- `code-block` — the terminal session the band shows.
- `media-split-section` — the sibling band with the sample (`codeTabs`) beside the copy.

## Best practices

- Keep the session to a few commands and their output; comment the output lines so the copied text still runs.
- Name the copy button with `copyAriaLabel` so a screen reader says what it copies.
- Prefer `script` on a product page: `start` types the first-project session, `deploy` the deploy session. Use `session` for a command set the recordings do not cover.
- Set `anchor` when a hero button scrolls to this band.

## Usage

```vue
<script setup>
  import CliTerminal from '@aziontech/webkit/cli-terminal'
</script>

<template>
  <CliTerminal
    eyebrow="Azion CLI"
    title="Deploy your first function in two commands"
    description="Link a project, deploy it, and curl the domain the CLI hands back."
    copy-aria-label="Copy the deploy session"
    session="azion deploy --auto"
    :primary-action="{ label: 'Install the CLI', href: '/docs/cli', trailing: true }"
  />
</template>
```

## Props

| Prop            | Type                 | Default     | Required | JSDoc                                                                                                                                                                       |
| --------------- | -------------------- | ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `anchor`        | `string`             | `''`        | false    | In-page id set on the band so a `#hash` link can scroll to it.                                                                                                              |
| `eyebrow`       | `string`             | `''`        | false    | Eyebrow above the section title.                                                                                                                                            |
| `title`         | `string`             | `''`        | false    | Headline of the band, rendered by the horizontal section title as its `h2`; the band renders no header when empty.                                                          |
| `description`   | `string`             | `''`        | false    | Supporting sentence beside the headline.                                                                                                                                    |
| `script`        | `CliTerminalScript`  | `undefined` | false    | Recorded Azion CLI session the terminal types live: `start` or `deploy`; wins over `session`.                                                                               |
| `session`       | `string`             | `''`        | false    | The terminal session shown under the header when no `script` is set, commands and their output verbatim, highlighted as bash; the band renders nothing when neither is set. |
| `copyAriaLabel` | `string`             | `''`        | false    | Accessible name of the session's copy button; empty keeps the code block's own.                                                                                             |
| `primaryAction` | `SectionTitleAction` | `undefined` | false    | Outlined button in the section title; `{ label, href, trailing?, target? }`. Omitted when absent.                                                                           |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`; the copy button and the button own their hover and focus states
- Empty: when neither `script` nor `session` is set the band renders nothing — not the header, not the frame
- `script` draws the `console-mockup` `cli-terminal-start` or `cli-terminal-deploy` in a stage 18rem tall (24rem from `md` up); `data-entered` is set on the stage the first time a fifth of it is on screen, and the stage rises, grows and fades in. The widget types its session while on screen and shows its finished state under reduced motion (owned by `console-mockup`). Without `script` the `session` renders as a `code-block`
- The header renders only when `title` is set

## Motion & Animations

| Trigger                          | Animation / Transition                                                                                                                                           | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                                                                                                          |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `script` stage scrolls into view | `transition-[translate,scale,opacity] duration-slow-02 ease-expressive-entrance`, from `translate-y-(--spacing-xl) scale-95 opacity-0` to rest on `data-entered` | `slow-02` · `expressive-entrance`                 | `motion-reduce:transition-none`, drawn at rest (`motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100`) |

## Tokens

| Region               | Token (DESIGN.md)                        |
| -------------------- | ---------------------------------------- |
| session shape        | `var(--shape-control)`                   |
| session shadow       | `var(--shadow-2xl)`                      |
| session width        | `var(--container-4xl)`                   |
| headline width       | `var(--container-xl)`                    |
| frame inset          | `var(--spacing-xl)`                      |
| frame top air        | `var(--spacing-16)`, `var(--spacing-32)` |
| session bleed        | `var(--spacing-xs)`                      |
| script stage height  | `var(--size-72)`, `var(--size-96)`       |
| script stage rise    | `var(--spacing-xl)`                      |
| anchor scroll offset | `var(--spacing-2xl)`                     |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `code-block` (copy button) and `button`; the `script` terminal has no focusable parts.
- Keyboard map: `Tab` reaches the button and the copy button; `Enter` follows the button.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the headline is the section title's `h2`; the copy button is named by `copyAriaLabel`; the `script` terminal is an `aria-hidden` picture of the console (owned by `console-mockup`), so the headline carries the meaning.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `section-title`, `code-block` and `button`.
- `motion-reduce:transition-none` — the `script` stage's entrance is skipped under reduced motion and the stage is drawn at rest; the session's line entrance is owned by `code-block` and draws at once under reduced motion.
- Touch target ≥40×40 px: the large button.

## Examples

- Default
- Script — the recorded `deploy` session typed live, with an `anchor`.

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
