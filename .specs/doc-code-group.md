---
name: doc-code-group
category: documentation
structure: monolithic
status: implemented
spec_version: 2
template: 2
checksum: 6460f2269744a4a2b16e68b80cad7903e659f82c87d9bd0e0fee4b20790bf331
created: 2026-11-11
last_updated: 2026-11-12
---

# DocCodeGroup — Component Spec

## Purpose

One or more code samples of the same thing in different languages or package managers, rendered on `CodeBlock` so the docs inherit its header, copy control and syntax surface. One sample renders a block titled by a label header (the sample label, else the language's readable name: Shell, JavaScript, JSON); several render the joined tab strip. A sample's `output` — what its command prints — renders as a separate muted "Output" block under it, with no copy control, so the command block holds only what the reader runs.

## When to use

- The same install command for npm, pnpm and yarn.
- The same request in cURL, JavaScript and Python.

## When NOT to use

- For unrelated snippets — use one `CodeBlock` each.
- For prose that differs per platform — use `DocTabs`.

## Related

- `CodeBlock` — the surface it renders on.
- `DocTabs` — alternatives that are prose, not code.

## Best practices

- Label each sample with what differs (the language or the tool), not with "Example". With one sample, leave `label` empty: the header names the language.
- Keep the same order across a page.
- Do: set `language` on every sample, so the header reads "Shell" or "JavaScript" and the code is highlighted.
- Do: keep `code` to what the reader runs or pastes; the copy control copies exactly that. A leading `$ ` prompt is drawn but never copied.
- Do: put what the command prints in the sample's `output` (`{ language: 'bash', code: 'curl -I https://<your-azion-domain>', output: 'HTTP/2 200' }`), or say it in prose.
- Do: show a standalone printout (a deploy log) with `kind="output"`.
- Don't: write output into `code` — never `curl -I https://example.com\n# HTTP/2 200`, never `$ azion version\nAzion CLI 4.23.0`. The lint `webkit/no-output-in-command` warns on it.
- Don't: turn the label header off on a docs page.

## Usage

```vue
<script setup>
  import DocCodeGroup from '@aziontech/webkit/doc-code-group'
</script>

<template>
  <DocCodeGroup
    :samples="[
      { label: 'npm', language: 'bash', code: 'npm install @aziontech/webkit' },
      { label: 'pnpm', language: 'bash', code: 'pnpm add @aziontech/webkit' }
    ]"
  />
</template>
```

## Props

| Prop              | Type                 | Default  | Required | JSDoc                                                                                                                                                             |
| ----------------- | -------------------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `samples`         | `DocCodeSample[]`    | `[]`     | false    | The samples, in tab order: `{ label?, language?, fileName?, code, output? }`. One renders a plain block, several render a joined tab strip; none renders nothing. |
| `showLineNumbers` | `boolean`            | `false`  | false    | Shows the line-number gutter.                                                                                                                                     |
| `showLabel`       | `boolean`            | `true`   | false    | Shows the label header (the sample label or the language name) on a single sample.                                                                                |
| `kind`            | `'code' \| 'output'` | `'code'` | false    | What the samples hold: `code` the reader runs, or `output` — what a command prints — drawn muted under an "Output" label, without a copy control.                 |

`DocCodeSample` is `{ label?, language?, fileName?, code, output? }`: `label` falls back to the language's readable name; `output` is what `code` prints, drawn in its own "Output" block under the sample while that sample is the active tab.

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: from `CodeBlock` (tab selection, copied, label header, output kind).
- Output: the active sample's `output` renders a second `CodeBlock` (`kind="output"`, test id `${testId}__output`) under the code block (`${testId}__code`), `--spacing-xs` apart; switching tabs swaps it.
- `data-doc-block` and `data-doc-chrome` put it on the block rung and stop prose rules at its edge.

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
| ------ | ----------------- |
| all    | From `CodeBlock`. |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Tabs, copy button and announcements come from `CodeBlock`.
- A tab label falls back to the language's readable name, then to the sample position.

## Internationalization

- Built-in strings: the "Output" label, from `CodeBlock`'s catalog group (`codeBlock.output`, en / pt-BR / es). Every other visible string is content and arrives through props.

## Right-to-left

- Layout: code stays left-to-right inside `CodeBlock`; the strip follows the page direction.
- Keyboard: unchanged.

## Responsive

- Long lines scroll inside the block, never the page.

## Performance

- Bundle budget: 27 KB gzip for `./doc-code-group` in `.size-limit.json` (CodeBlock included).

## Examples

- Default — one sample, titled "Shell" by its label header.
- Group — three package managers.
- WithOutput — a `curl -I` command with its `output` (`HTTP/2 200`) in the muted Output block under it. Justified addition: the `output` field is the docs pattern for a command and what it prints, and no other example renders it.

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
