---
name: error-boundary
category: feedback
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 20ba9c3bb955282ebd19440ecba6aa46ac17b78f2f3b54e3da35588082524c3e
created: 2026-11-11
last_updated: 2026-11-11
---

# ErrorBoundary — Component Spec

## Purpose

Guards one region of a page. When a component inside the region throws while it renders, sets up or
runs a lifecycle hook, the boundary catches the error, reports it through its `error` event, and puts
a recoverable message in the region's place: a danger `Alert` that says the section failed and offers
**Try again**, which mounts the region again. The rest of the page keeps working. A `fallback` slot
replaces the built-in message when the region needs a different shape (a card-sized `EmptyState`, for
example).

## When to use

- A dashboard card, a side panel, a tab body or any region whose failure should not take the whole page down.
- A region that renders data you do not control (a third-party widget, a chart fed by a remote response, a plugin).
- Around each route's content inside the app shell, so a failing page leaves the navigation usable (pass the route path as `resetKey`).
- When the app reports render errors to a monitoring service: the `error` event carries the error and where it was thrown.

## When NOT to use

- A request that failed (a fetch, a mutation): that is data state, not a render error. Show it in the region with an `alert` and a Retry, as `platform/states/form-error` and `skills/webkit-ui-states` describe.
- A whole page that cannot be shown (missing route, no access, server failure) → use the `platform/states/not-found` block.
- A field that failed validation → use `field` with its error message.
- Errors thrown in click or submit handlers you can catch yourself: catch them where you call the action and show the outcome with `toast` or `alert`.

## Related

- `alert` — the built-in fallback; also what a failed request shows inside a region that rendered fine.
- `empty-state` — a common custom fallback for a card-sized region.
- `skeleton` — what the region shows while it loads; the boundary only covers the failed case.
- `toast` — reports the outcome of an action; never use it for a region that failed to render.

## Best practices

- Wrap regions, not the whole app. One boundary per card, panel or route body keeps the blast radius small.
- Report every error: listen to `error` and send it to your monitoring service. The boundary stops the error from reaching the app error handler unless `propagate` is set.
- Make Retry mean something. Listen to `retry` and reset the state that broke the region (refetch, clear the bad value) before it mounts again; a retry that renders the same bad data fails again.
- Pass `resetKey` when the region shows different content for different keys (route path, record id), so moving on from a failed record clears the fallback.
- Keep the fallback the size of the region. In a card, use a small `EmptyState`; in a page body, the built-in `Alert` is right.

## Usage

```vue
<script setup>
  import ErrorBoundary from '@aziontech/webkit/error-boundary'
  import BarList from '@aziontech/webkit/bar-list'

  const report = ({ error, info }) => console.error(info, error)
</script>

<template>
  <ErrorBoundary @error="report">
    <BarList
      :items="items"
      aria-label="Top services"
    />
  </ErrorBoundary>
</template>
```

## Props

| Prop          | Type               | Default     | Required | JSDoc                                                                                                                    |
| ------------- | ------------------ | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| `title`       | `string`           | `''`        | false    | Heading of the built-in fallback. Empty uses the locale catalog (`This section failed to load`).                         |
| `description` | `string`           | `''`        | false    | Sentence under the heading of the built-in fallback. Empty uses the locale catalog.                                      |
| `retryLabel`  | `string`           | `''`        | false    | Label of the built-in Retry action. Empty uses the locale catalog (`Try again`).                                         |
| `resetKey`    | `string \| number` | `undefined` | false    | When this value changes while the fallback shows, the region is mounted again (pass the route path or the record id).    |
| `propagate`   | `boolean`          | `false`     | false    | When true, the error keeps travelling to the parent boundaries and the app error handler after this boundary handles it. |

## Events

| Event   | Payload                   | Notes                                                                                                                    |
| ------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `error` | `ErrorBoundaryErrorEvent` | Fires once per failure with `{ error, info }`: what was thrown and Vue's description of where. Report it from here.      |
| `retry` | `void`                    | Fires when the region is mounted again (Retry, the slot's `retry`, or a `resetKey` change). Reset the broken state here. |

## Slots

| Slot       | Scope                                   | Notes                                                                                     |
| ---------- | --------------------------------------- | ----------------------------------------------------------------------------------------- |
| `default`  | —                                       | The region the boundary guards. Mounted again, from scratch, on every retry.              |
| `fallback` | `{ error: unknown, retry: () => void }` | Replaces the built-in `Alert` while the region is failed. Call `retry` to mount it again. |

## States

- Visual states: `default` (the region renders), `error` (the fallback renders in its place)
- `data-error` on the root is present while the fallback shows
- A second error captured while the fallback already shows (a failing custom fallback) is not handled again: it travels to the parent, so a broken fallback can never loop.
- What the boundary catches is what Vue's `onErrorCaptured` catches from descendant components: errors in render, setup, watchers, lifecycle hooks and component event handlers. Errors thrown directly in the slot's own markup belong to the component that owns the markup, and errors in native DOM listeners or promises outside Vue are not caught.

## Motion & Animations

_none_ — the swap between region and fallback is instant. The built-in `Alert` owns its own dismiss transition, which the boundary does not use.

## Tokens

| Region   | Token (DESIGN.md)                                 |
| -------- | ------------------------------------------------- |
| fallback | `alert` with `severity="danger"` (its own tokens) |
| root     | no surface, no spacing: the region's own box      |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | none      |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the root is focusable only by script (`tabindex="-1"`, `outline-none`) and never in the tab order; the Retry button carries the `Button` focus ring.
- Keyboard map: `Tab` reaches the Retry action in the fallback; `Enter` / `Space` runs it. No key handling of its own.
- Focus: when the region fails while focus was inside it (or had fallen to the document body), focus moves to the fallback `Alert`, which is announced. After a retry from inside the boundary, focus moves to the boundary's root so it is not lost to the body.
- ARIA: the built-in fallback is an `Alert` with `role="alert"` (danger), so the failure is announced once when it appears. A custom fallback is responsible for its own announcement (`EmptyState` is `role="status"`).
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): inherited from the `alert` danger tokens.
- No motion.
- Touch target ≥40×40 px: the Retry action is a `Button`.

## Internationalization

| Key                         | English source                                                                              | Override prop |
| --------------------------- | ------------------------------------------------------------------------------------------- | ------------- |
| `errorBoundary.title`       | This section failed to load                                                                 | `title`       |
| `errorBoundary.description` | Something went wrong while showing this part of the page. The rest of the page still works. | `description` |
| `errorBoundary.retry`       | Try again                                                                                   | `retryLabel`  |

- Formatting: none.

## Right-to-left

- Layout: the boundary adds no layout; the `Alert` uses logical utilities and puts the action at the inline end.
- Icons: the danger glyph is not mirrored.
- Keyboard: no arrow-key navigation.
- User data: the error message is never rendered by the built-in fallback; none.

## Responsive

- Container queries: none of its own; the `Alert` is `@container/alert` and moves its action under the copy in a narrow region.
- Narrow (≤ 640 px or a narrow container): the action wraps under the text (from `alert`).
- Touch: the Retry button is 40 px; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: 4 KB gzip for `./error-boundary` (it carries `alert`) in `.size-limit.json`.
- Runtime budget: none: the boundary is a wrapper with one hook; the fallback renders only on failure.
- Heavy parts: none.

## Examples

- Default — a card region with a control that makes it fail, showing the built-in fallback and Retry.
- Custom fallback — the `fallback` slot with a small `EmptyState`. Justified as its own story because the slot replaces the whole fallback, which no args delta can show.

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
