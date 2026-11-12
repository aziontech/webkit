---
name: section-command
category: sections
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: f9b0f139557bc7c024537948484c3c4609462af1c16810c5b8cd3673355c4c02
created: 2026-11-11
last_updated: 2026-11-11
---

# SectionCommand — Component Spec

## Purpose

A one-line command or agent prompt with a copy button, set in a large `InputGroup` under hero or section copy ("npm create azion", "Ask your agent to …"). With `shell` a `$` prompt leads the line. From the design sample's site `SectionCommand`.

## When to use

- The one command that starts a product, beside or instead of a call to action.
- A prompt to paste into an AI agent (`shell` off).

## When NOT to use

- For several lines or output — use `CodeBlock` or `CliTerminal`.
- For an editable field — use `InputText`.

## Related

- `CopyButton`, `InputGroup` — the parts.
- `CliTerminal` — a full terminal session.

## Best practices

- One line that works when pasted as is.
- Place it in a hero or section-title actions slot.

## Usage

```vue
<script setup>
  import SectionCommand from '@aziontech/webkit/section-command'
</script>

<template>
  <SectionCommand value="npm create azion@latest" />
</template>
```

## Props

| Prop    | Type      | Default | Required | JSDoc                                                                             |
| ------- | --------- | ------- | -------- | --------------------------------------------------------------------------------- |
| `value` | `string`  | —       | true     | Text on the line, copied as written.                                              |
| `shell` | `boolean` | `true`  | false    | Draws the shell prompt before the text; turn off for a prompt meant for an agent. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Read-only input; the copy button shows its copied state (from `CopyButton`).

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md)                            |
| ------ | -------------------------------------------- |
| field  | `var(--bg-surface)`                          |
| text   | `.text-label-code-sm`, `var(--text-default)` |
| width  | `var(--container-xs)`                        |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The read-only input is named "Command" or "Prompt"; the copy button is named "Copy command" or "Copy prompt".
- The `$` is decorative (`aria-hidden`).
- Keyboard: `Tab` reaches the field (text can be selected) and the copy button.

## Internationalization

| Key                          | English source | Override prop |
| ---------------------------- | -------------- | ------------- |
| `sectionCommand.command`     | `Command`      | —             |
| `sectionCommand.prompt`      | `Prompt`       | —             |
| `sectionCommand.copyCommand` | `Copy command` | —             |
| `sectionCommand.copyPrompt`  | `Copy prompt`  | —             |

- The command itself is content.

## Right-to-left

- Layout: logical utilities.
- The command is `dir="ltr"` so a shell line keeps its order inside right-to-left pages.
- Keyboard: unchanged.

## Responsive

- Fills its column up to `--container-xs`; fixed at that width from large.

## Performance

- Bundle budget: 9 KB for `./section-command` gzip in `.size-limit.json` (measured + ~0.5 KB).

## Examples

- Default — a shell command.
- Prompt — `shell` off for an agent prompt.

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
