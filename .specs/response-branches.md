---
name: response-branches
category: ai
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 6cacf0af607a6205a83339e1e17da98d73f0e664030df106b5d2ac9d5baa79cb
created: 2026-11-11
last_updated: 2026-11-11
---

# ResponseBranches — Component Spec

## Purpose

Pages through alternative versions of one assistant response: after Regenerate, or when the model returned several candidates, the message shows one version at a time with a `‹ 2 of 3 ›` pager under it. The owner keeps every version and renders the active one in the default slot; the component owns only the position and the pager. It is the AI Elements `Branch` pattern, rebuilt on WebKit's `IconButton` and tokens.

## When to use

- A response was regenerated and the earlier versions stay available to compare.
- A model returned several candidates and the person picks the one to keep reading.

## When NOT to use

- Pages of one long list → use `Pagination`.
- Steps of a flow → use `Stepper`.
- Different documents side by side → use `Tabs`.

## Related

- `chat-message` — the message whose body the branches wrap; its actions hold Regenerate.
- `streaming-response` — a new version streams in the slot while the pager already counts it.

## Best practices

- Move to the new version when Regenerate finishes (set `v-model` to the last index) so the person sees what they asked for.
- Keep the versions in the order they were made; the newest is last.
- Do not render the pager inside the slot; it belongs to the component so its position and labels stay the same across versions.

## Usage

```vue
<script setup>
  import ResponseBranches from '@aziontech/webkit/response-branches'
  import { ref } from 'vue'

  const versions = ['First answer', 'Second answer']
  const active = ref(1)
</script>

<template>
  <ResponseBranches
    v-model="active"
    :count="versions.length"
  >
    <template #default="{ index }">
      <p>{{ versions[index] }}</p>
    </template>
  </ResponseBranches>
</template>
```

## Props

| Prop       | Type      | Default | Required | JSDoc                                                                                    |
| ---------- | --------- | ------- | -------- | ---------------------------------------------------------------------------------------- |
| `count`    | `number`  | —       | true     | How many versions exist. With one or none the pager is not drawn.                        |
| `label`    | `string`  | `''`    | false    | Accessible name of the pager group. Empty uses the locale catalog (`Response versions`). |
| `disabled` | `boolean` | `false` | false    | Locks the pager, for example while a new version streams.                                |

## v-model

| Model     | Type     | Default | Emits               | Notes                                                              |
| --------- | -------- | ------- | ------------------- | ------------------------------------------------------------------ |
| `v-model` | `number` | `0`     | `update:modelValue` | Zero-based index of the version shown, clamped to `0 … count - 1`. |

## Events

_none_ besides `update:modelValue`.

## Slots

| Slot      | Scope               | Notes                                                                         |
| --------- | ------------------- | ----------------------------------------------------------------------------- |
| `default` | `{ index: number }` | The active version. Rendered once; the owner switches its content by `index`. |

## States

- `data-count` on the root; `data-index` mirrors the clamped index.
- First version: Previous is disabled; last version: Next is disabled.
- `disabled`: both buttons are disabled and the counter is muted.
- `count` ≤ 1: only the slot renders.

## Motion & Animations

| Trigger | Animation / Transition                | Token | Reduced-motion fallback |
| ------- | ------------------------------------- | ----- | ----------------------- |
| —       | none; the slot content swaps in place | —     | —                       |

## Tokens

| Region  | Token                                     |
| ------- | ----------------------------------------- |
| counter | `.text-label-sm`, `var(--text-muted)`     |
| gap     | `var(--spacing-xxs)`, `var(--spacing-xs)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The pager is `role="group"` named by `label` (`Response versions`); Previous and Next are `IconButton`s named `Previous version` / `Next version`.
- The counter (`2 of 3`) is a polite live region, so moving announces the new position once; the slot is not live.
- Keyboard: `Tab` reaches Previous and Next; `Enter`/`Space` move; a disabled end button leaves the tab order.

## Internationalization

| Key                         | English source         | Override prop |
| --------------------------- | ---------------------- | ------------- |
| `responseBranches.label`    | `Response versions`    | `label`       |
| `responseBranches.previous` | `Previous version`     | —             |
| `responseBranches.next`     | `Next version`         | —             |
| `responseBranches.position` | `{current} of {total}` | —             |

- Numbers in the counter use the locale's digits through the catalog template.

## Right-to-left

- Layout: logical spacing only; the pager sits at the inline start.
- Icons: the chevrons mirror under `dir="rtl"` through `IconButton`'s directional icons, so Previous always points to the inline start.
- Keyboard: none beyond the buttons.
- User data: the slot follows the page direction.

## Responsive

- Container queries: none.
- Narrow: the pager stays one row (two 28 px buttons and a short counter).
- Touch: buttons are `IconButton` small, with the 40 px touch target from `IconButton`.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: 4 KB gzip for `./response-branches` in `.size-limit.json`.
- Runtime budget: one slot render per version change.
- Heavy parts: none.

## Examples

- Default — three versions of an answer under a chat message, the newest shown.

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
