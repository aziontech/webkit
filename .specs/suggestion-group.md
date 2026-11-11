---
name: suggestion-group
category: ai
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 93d165ef10b153465614fb21a39c189e4762c05877cee285d8e0affda1537c3b
created: 2026-11-11
last_updated: 2026-11-11
---

# SuggestionGroup — Component Spec

## Purpose

A group of prompts the reader can send without typing (Cloudscape support prompt group, AI Elements
Suggestion): support prompts on an empty conversation, follow-up questions after a response, or the
choices of a clarifying question. Each prompt is a button; choosing one emits `select` with the item,
and the owner either sends it or places it in the prompt input to edit.

## When to use

- The empty state of an assistant, to show what it can do (vertical, up to five).
- After a broad response, to narrow it (horizontal chips, up to five, most likely first).
- A follow-up question with predefined answers.

## When NOT to use

- Navigation or filters → `tabs`, `toggle-group`, `property-filter`.
- Choices that are a form value → `radio-group` / `radio-cards`.
- More than five options → let the reader type; the prompt input stays available.

## Related

- `prompt-input` — the open-ended alternative that must stay reachable.
- `empty-state` — hosts the vertical support prompts before the first message.
- `chip`, `button` — visual cousins; prompts are their own control because they send text.

## Best practices

- Five or fewer, ordered by likelihood.
- Write prompts as the reader would ask them, under 72 characters, sentence case, no end punctuation needed for questions you send verbatim.
- Disable the group while a response is generating.
- Remove follow-ups once the reader sends anything else.

## Usage

```vue
<script setup>
  import SuggestionGroup from '@aziontech/webkit/suggestion-group'
</script>

<template>
  <SuggestionGroup
    :items="[
      { id: 'ttl', label: 'What TTL should my images use?' },
      { id: 'purge', label: 'How do I purge one URL?' }
    ]"
    @select="(item) => send(item.label)"
  />
</template>
```

## Sub-components

_None. Data-driven (`items`), like Cloudscape's support prompt group. Exports: `"./suggestion-group"`;
types `SuggestionItem`, `SuggestionGroupOrientation`._

## Props

| Prop          | Type                           | Default        | Required | JSDoc                                                                                                                   |
| ------------- | ------------------------------ | -------------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| `items`       | `SuggestionItem[]`             | `[]`           | false    | Up to five prompts, most likely first.                                                                                  |
| `ariaLabel`   | `string`                       | `''`           | false    | Accessible name of the group. Empty uses the locale catalog (`Suggested prompts`).                                     |
| `orientation` | `'horizontal' \| 'vertical'`   | `'horizontal'` | false    | `horizontal` wraps chips in a row (follow-up questions under a response); `vertical` stacks them (support prompts on an empty conversation). |
| `disabled`    | `boolean`                      | `false`        | false    | Disables every prompt, while a response is being generated.                                                             |

## Events

| Event    | Payload          | When                                       |
| -------- | ---------------- | ------------------------------------------ |
| `select` | `SuggestionItem` | A prompt was chosen (not while disabled).  |

## Slots

_No slots._

## States

- `data-orientation`, `data-disabled`; renders nothing when `items` is empty.

## Motion & Animations

| Trigger | Animation / Transition                                   | Token     | Reduced-motion fallback         |
| ------- | -------------------------------------------------------- | --------- | ------------------------------- |
| hover   | `transition-colors duration-fast-02 ease-productive-entrance` | `fast-02` | `motion-reduce:transition-none` |

## Tokens

| Region   | Token                                                                    |
| -------- | ------------------------------------------------------------------------ |
| prompt   | `var(--bg-surface)`, `var(--border-default)` → hover `var(--border-strong)` / `var(--bg-hover)`, `var(--shape-button)` |
| text     | `.text-label-sm`, `var(--text-default)`; icon `var(--text-muted)`; disabled `var(--text-disabled)` |
| gaps     | `var(--spacing-xs)`, padding `var(--spacing-sm)` / `var(--spacing-xxs)`  |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- Keyboard map: `Tab` moves between prompts (each is a native button; five at most keeps the tab order short); `Enter` / `Space` chooses.
- ARIA: `role="group"` with `aria-label`; icons `aria-hidden`; native `disabled`.
- Touch target: 32 px rows, 44 px on coarse pointers.

## Internationalization

| Key                     | English source      | Override prop |
| ----------------------- | ------------------- | ------------- |
| `suggestionGroup.label` | `Suggested prompts` | `ariaLabel`   |

- Formatting: none.

## Right-to-left

- Layout: logical utilities, `text-start`.
- Icons: product icons are not mirrored.
- Keyboard: none beyond Tab.
- User data: prompt labels follow the document direction.

## Responsive

- Container queries: none.
- Narrow: horizontal chips wrap; vertical prompts fill the width.
- Touch: 44 px on coarse pointers.
- Reflow: wraps, no horizontal scroll.

## Performance

- Bundle budget: see `.size-limit.json` (`suggestion-group`).
- Runtime budget: static.
- Heavy parts: none.

## Stories (Storybook)

_Storybook is retired in M2.5; examples in `packages/webkit/examples/suggestion-group/`: Follow-up questions (horizontal), Support prompts (vertical with icons)._

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
