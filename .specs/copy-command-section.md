---
name: copy-command-section
category: section
structure: monolithic
status: implemented
spec_version: 5
template: 2
checksum: 9e816eb83359d44f7f4a6236080a4d58fe84bd88a88fd1b8c6a5ed75ff6ab83e
created: 2026-11-11
last_updated: 2026-11-25
---

# CopyCommandSection — Component Spec

## Purpose

A command or agent prompt with a copy button, under hero or section copy ("npm create azion", "Ask your agent to …"). Both are a read-only block that wraps, so the reader sees every word they copy; with `shell` a decorative `$` prompt leads the command, which breaks anywhere (a command has no spaces to break at), and without it the agent prompt wraps between words. From the design sample's site `CopyCommandSection`.

## When to use

- Use CopyCommandSection for a one-line command or agent prompt with a copy button on a marketing page.
- The one command that starts a product, beside or instead of a call to action.
- A prompt to paste into an AI agent (`shell` off).

## When NOT to use

- For several lines or output — use `CodeBlock` or `CliTerminalSection`.
- For an editable field — use `Input`.

## Related

- `CopyButton` — the part.
- `CliTerminalSection` — a full terminal session.

## Best practices

- One line that works when pasted as is.
- Place it in a hero or module-header actions slot.

## Usage

```vue
<script setup>
  import CopyCommandSection from '@aziontech/webkit/copy-command-section'
</script>

<template>
  <CopyCommandSection value="npm create azion@latest" />
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

- Read-only text; the copy button shows its copied state (from `CopyButton`).

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md)                            |
| ------ | -------------------------------------------- |
| field  | `var(--bg-surface)`                          |
| text   | `.text-label-code-sm`, `var(--text-default)` |
| width  | `var(--container-md)`                        |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The read-only block is a group named "Command" or "Prompt"; the copy button is named "Copy command" or "Copy prompt".
- The `$` is decorative (`aria-hidden`). The command is a read-only textbox named "Command"; the prompt is a group named "Prompt" holding its text and the copy button.
- Keyboard: `Tab` reaches the field (text can be selected) and the copy button.

## Internationalization

| Key                                     | English source | Override prop |
| --------------------------------------- | -------------- | ------------- |
| `copyCommandSection.command`            | `Command`      | —             |
| `copyCommandSection.prompt`             | `Prompt`       | —             |
| `copyCommandSection.copyCommand` | `Copy command` | —             |
| `copyCommandSection.copyPrompt`         | `Copy prompt`  | —             |

- The command itself is content.

## Right-to-left

- Layout: logical utilities.
- The command and the prompt are `dir="ltr"` so a shell line keeps its order inside right-to-left pages.
- Keyboard: unchanged.

## Responsive

- Fills its column up to `--container-md`; a command is fixed at that width from large, a prompt keeps the width of its column and grows in height.
- Touch: the copy button is large; the text is not a field, so it takes no focus and stays at its code size on a phone, wrapping instead of being cut.

## Performance

- Bundle budget: 9 KB for `./copy-command-section` gzip in `.size-limit.json` (measured + ~0.5 KB).

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
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
