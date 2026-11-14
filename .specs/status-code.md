---
name: status-code
category: content
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 5d71c34d25478cbaf4d2b807541d6a325fb52336b28bcca6f8c7b24fedb7a5ca
created: 2026-11-14
last_updated: 2026-11-14
---

# StatusCode — Component Spec

## Purpose

StatusCode shows the HTTP status of a request, optionally preceded by its method, as one compact monospace pill whose colour comes from the status class: informational, success and redirect responses (1xx, 2xx, 3xx) stay neutral, client errors (4xx) take the warning colour and server errors (5xx) the danger colour, so failures stand out in a long request log without every successful row competing for attention. Anything that is not a status from 100 to 599 renders muted, as written. It composes `Tag` for the surface, so its sizes, shape and colours are the tag's; the component owns only the mapping from status to colour and the method plus code layout that every logs table would otherwise repeat.

## When to use

- A request log, an invocation list or a trace detail shows the HTTP status of each request (`GET 200`, `POST 503`).
- A detail panel summarizes the response of one request next to its timing and size.

## When NOT to use

- The status is a resource lifecycle (`Active`, `Pending`, `Failed`) → use `tag` or `Table.CellStatus`.
- The value is a security or incident level → use `severity-tag`.
- A dot that says whether a service is up → use `status-indicator`.

## Related

- `tag` — the surface StatusCode composes; use it directly for statuses that are not HTTP codes.
- `table` — place StatusCode inside a `#cell-<id>` slot of a request log.
- `severity-tag` — ordered severity levels with a bar glyph.

## Best practices

- Pass the status as it comes from the log (`404` or `'404'`); the component derives the colour, so do not pick a colour per row.
- Pass `method` only when the list mixes methods; a list of `GET` requests reads better with the code alone.
- Keep the column narrow: the pill never wraps and is at most `GET` plus three digits wide for real traffic.

## Usage

```vue
<script setup>
  import StatusCode from '@aziontech/webkit/status-code'
</script>

<template>
  <StatusCode
    :code="503"
    method="POST"
  />
</template>
```

## Props

| Prop     | Type                  | Default    | Required | JSDoc                                                                                                                                                            |
| -------- | --------------------- | ---------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `code`   | `number \| string`    | `''`       | false    | HTTP status, as a number or a string (`404`, `'404'`). 1xx to 3xx render neutral, 4xx warning, 5xx danger; anything else renders muted as written, empty a dash. |
| `method` | `string`              | `''`       | false    | Request method shown before the code (`GET`, `POST`), upper-cased. Empty shows the code alone.                                                                   |
| `size`   | `'small' \| 'medium'` | `'medium'` | false    | Size token forwarded to `Tag`; `medium` is 24px tall, `small` is 20px.                                                                                           |

## Events

_none_

## Slots

_none_

## States

- `data-status-class` on the root: `informational` (1xx), `success` (2xx), `redirect` (3xx), `client-error` (4xx), `server-error` (5xx) or `invalid` (anything else, including empty).
- `data-size` mirrors `size` (set by `Tag`).
- The `Tag` severity follows the class: `secondary` for 1xx to 3xx and `invalid`, `warning` for 4xx, `danger` for 5xx.
- `invalid` mutes the text; an empty `code` shows a dash, any other invalid value shows as written.
- Non-interactive: no hover, focus, active or disabled state.

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
| ------- | ---------------------- | ----- | ----------------------- |
| —       | none (static label)    | —     | —                       |

## Tokens

| Region                      | Token                                                                      |
| --------------------------- | -------------------------------------------------------------------------- |
| surface, border, colour     | the `Tag` severity tokens (`secondary`, `warning`, `danger`)               |
| method and code text        | `.text-label-code-sm`                                                      |
| method text                 | `var(--text-muted)` on the neutral surface; inherits on warning and danger |
| invalid text                | `var(--text-muted)`                                                        |
| gap between method and code | `var(--spacing-xxs)`                                                       |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable — StatusCode is non-interactive.
- Keyboard map: none.
- ARIA: plain text inside a `span`; the status number carries the meaning, so the colour is never the only cue (WCAG 1.4.1). Screen readers read `POST 503`.
- Contrast ≥4.5:1: the `Tag` severity pairs (`--warning` / `--warning-contrast`, `--danger` / `--danger-contrast`, `--text-default` on `--bg-canvas`) and `--text-muted` on `--bg-canvas` are theme-guaranteed in light and dark.
- `motion-reduce:*`: not applicable — no motion.
- Touch target: not applicable — non-interactive.

## Internationalization

_none_ — the method and the code are data and are never translated; the component has no built-in strings.

## Right-to-left

- Layout: the pill renders `dir="ltr"` so `GET 404` keeps its order inside right-to-left text; it uses logical gap only.
- Icons: none.
- Keyboard: none.
- User data: the method and code are Latin protocol tokens, isolated with `dir="ltr"`.

## Responsive

- Container queries: none.
- Narrow: `whitespace-nowrap` and `shrink-0`; at most about 9 characters wide, so it fits a 320 px column and a narrow table cell.
- Touch: not interactive.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: 1.7 KB gzip for `./status-code` in `.size-limit.json` (the class mapping plus `Tag`).
- Runtime budget: one computed per instance, no watchers or listeners; a request log of 1,000 rows renders 1,000 tags (covered by the 1k-row test in `status-code.test.ts`).
- Heavy parts: none.

## Examples

- Default — the five status classes side by side, with and without a method.
- Sizes — both sizes side by side.
- Request log — StatusCode in the `#cell-status` slot of a data-driven `Table` of requests, the column it is built for. Justified addition: the component exists for logs tables, and only the composed table shows how the neutral 2xx rows let the 4xx and 5xx rows stand out.

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
