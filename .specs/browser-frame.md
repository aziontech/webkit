---
name: browser-frame
category: content
structure: monolithic
status: implemented
spec_version: 1
created: 2026-10-20
last_updated: 2026-10-20
checksum: cc5002be8796c7fd33aaa629c4a59db8ad15996ff27a934a74704ee90563a9a2
---

# BrowserFrame — Component Spec

## Purpose

A browser window that renders live webkit components inside a viewport of its own, so a page or story can show a real screen at a real device size — desktop, tablet or mobile — and resize it by hand. The default slot is teleported into an internal `iframe`, which gives the content a true width × height viewport: CSS breakpoints fire against the frame's simulated width, viewport units resolve against its simulated height, and content taller than the viewport scrolls inside it like a page. When the simulated width is wider than the space available, the frame scales the whole viewport down to fit instead of clamping it. The chrome's window dots, address and size readout are decoration; its one control is a copy button inside the address bar, and the frame's other controls are the resize handles on its right edge, bottom edge and bottom-right corner.

## When to use

- Showing a real screen — a site band, a console page, a template — built from webkit components, at a device size you choose.
- Letting a reader drag a layout from desktop to tablet to mobile to see how it responds, in Storybook or on a documentation page.
- Pinning a composed example to a device size (`v-model:width` + `v-model:height`) so a story or page always shows the tablet or mobile layout.
- Showing that a result lives at a URL — a deployed site, a preview link — by setting `address`.

## When NOT to use

- For a static screenshot or clip in documentation → use `doc-frame`.
- For third-party content loaded from another origin → use `embed`.
- For a mock of the Azion console's own shell on a marketing band → use the console shell mockup the page composes; it draws the console chrome and staggers its parts.
- For content whose layout depends on an overlay (`dialog`, `drawer`, a dropdown panel) or a JS breakpoint composable — those still read the outer page (see States), so the frame cannot show them at the simulated size.
- For a framed page section or grid cell → use `frame-box`.

## Related

- `doc-frame` — the documentation figure frame for stills and clips; no live viewport.
- `embed` — a titled `iframe` for another origin's document; `browser-frame` renders our own components.
- `frame-box` — the page's registration frame (hairlines + corner marks), not a window.
- `copy-button` — the clipboard control the address bar composes; reach for it directly to copy any other value.

## Best practices

- Compose the default slot exactly as the screen would be composed in an app — the frame mirrors the page's stylesheets and theme into its viewport, so no extra wiring or classes are needed.
- Pin the device the example is about with `v-model:width` and `v-model:height` (`375 × 812` mobile, `768 × 1024` tablet, `1280 × 800` desktop); leave `width` unset to fill the container.
- Give the frame an `ariaLabel` that names what is shown (`Pricing page at tablet size`); it becomes the viewport's accessible name.
- Viewport-height units (`h-screen`, `min-h-dvh`) in slot content resolve against the simulated height, so a full-height shell renders as it would on the device.
- Do not add controls to the chrome — the address's copy button and the resize handles are the frame's only controls. Interactive content belongs in the default slot.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import BrowserFrame from '@aziontech/webkit/browser-frame'
import SectionTitle from '@aziontech/webkit/section-title'
import Button from '@aziontech/webkit/button'

const width = ref(768)
const height = ref(1024)
</script>

<template>
  <BrowserFrame
    v-model:width="width"
    v-model:height="height"
    address="https://www.azion.com/en/pricing"
    aria-label="Pricing page at tablet size"
  >
    <SectionTitle title="Pricing that scales with you" />
    <Button label="Start for free" />
  </BrowserFrame>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `address` | `string` | `''` | false | Read-only URL shown in the chrome's address bar; the address bar is not rendered when empty. |
| `minWidth` | `number` | `320` | false | Smallest viewport width the resize handles can reach, in pixels. |
| `maxWidth` | `number` | `1920` | false | Largest viewport width the resize handles can reach, in pixels; widths wider than the container are scaled down to fit. |
| `minHeight` | `number` | `320` | false | Smallest viewport height the resize handles can reach, in pixels. |
| `maxHeight` | `number` | `1440` | false | Largest viewport height the resize handles can reach, in pixels. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the viewport; when empty it falls back to `address`, then to `Preview`. |
| `copyAriaLabel` | `string` | `'Copy address'` | false | Accessible name of the address bar's copy button. |
| `widthHandleAriaLabel` | `string` | `'Resize preview width'` | false | Accessible name of the right-edge width handle. |
| `heightHandleAriaLabel` | `string` | `'Resize preview height'` | false | Accessible name of the bottom-edge height handle. |

## v-model

| Model | Type | Default | Emits | Notes |
|---|---|---|---|---|
| `v-model:width` | `number` | `undefined` | `update:width` | Simulated viewport width in pixels via `defineModel('width')`. Undefined fills the container; the width and corner handles write a number, clamped to `minWidth`…`maxWidth`, on every resize step. Works controlled or uncontrolled. |
| `v-model:height` | `number` | `800` | `update:height` | Simulated viewport height in pixels via `defineModel('height', { default: 800 })`. The height and corner handles write a number, clamped to `minHeight`…`maxHeight`, on every resize step. Works controlled or uncontrolled. |

## Events

_No plain events — the size flows through `v-model:width` and `v-model:height`._

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | The live content, teleported into the frame's viewport `iframe` once it is ready. Renders client-side only. |

## States

The frame is static apart from its resize handles.

- **Viewport.** The root renders an `iframe` (blank document). Once it loads, the frame mirrors the host page's stylesheets (every `style` and stylesheet `link` in `head`, kept in sync as they change so HMR still applies) and the theme attributes of the host's root element (`data-theme`, `class`) into it, then teleports the default slot into its `body`. The content is the same Vue app — props, reactivity, provide/inject and events behave as if it were rendered in place.
- **Breakpoints.** CSS media queries and viewport units in the content resolve against the viewport's width and height. JS breakpoint reads (`matchMedia` in a composable) and overlays that teleport to the document `body` still resolve against the host page — a documented limit, not a bug.
- **Size.** The viewport renders at the effective width (`width` when set, otherwise the container's width) and at `height`. Content taller or wider than the viewport scrolls inside the `iframe`'s own document, exactly as a page scrolls in a browser.
- **Scale.** When the effective width exceeds the container, the viewport is scaled down by `container / effective` on both axes, and the frame's on-page height is `height × scale`. A frame narrower than its container is centered in it.
- **Resizing.** Three handles resize the viewport:
  - the **width handle** on the right edge writes `width`;
  - the **height handle** on the bottom edge writes `height`;
  - the **corner handle** at the bottom-right writes both at once.
  Pointer drags use pointer capture. A width drag moves the right edge under the pointer (the frame is centered, so the width changes by twice the pointer's travel) and is clamped to `minWidth` and the container width; a height drag follows the pointer's travel divided by the current scale and is clamped to `minHeight`…`maxHeight`. The keyboard reaches up to `maxWidth` / `maxHeight`. While any handle is dragged the root sets `data-resizing` and the content ignores the pointer.
- **Size readout.** While any handle is dragged or focused, the chrome shows the viewport size (`768 × 1024`) at its trailing end; it is hidden otherwise.
- **Scaled.** The root sets `data-scaled` while the viewport is scaled below 1.
- **Address.** Rendered only when `address` is non-empty, centered in the chrome as a compact, fully rounded pill up to `--container-xs` wide and exactly as tall as the small copy button (28px), which sits flush at its trailing end, never overlapping the window dots or the readout. The pill is filled with the skeleton placeholder fill (static — no sweep) and edged with a muted hairline. Its text is set in the monospace code label and centered in the space left of the copy button; long addresses truncate in the middle: a leading part ellipsizes and the last 12 characters always stay visible.
- **Copy.** The address bar's trailing end composes the package's `CopyButton` (`kind="transparent"`, `size="small"`) with `value` = the full `address`; its copied feedback is the `CopyButton`'s own.
- **Test ids.** Root fallback `content-browser-frame` (consumer override wins); `${testId}__address`, `${testId}__viewport` (the `iframe`), `${testId}__copy`, `${testId}__width-handle`, `${testId}__height-handle`, `${testId}__corner-handle`.
- **Composable.** The document mirroring and teleport target live in a co-located lifecycle composable, `composables/use-frame-document.ts`, that disconnects every observer on scope dispose.

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| handle hover/focus color change | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |

Resizing itself is not animated — the size follows the pointer or key press immediately.

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| shape (root + viewport clip) | `var(--shape-card)` |
| edge (root hairline) | `var(--border-default)` |
| viewport surface | `var(--bg-canvas)` |
| chrome surface | `var(--bg-surface)` |
| chrome divider (bottom edge of the bar) | `var(--border-default)` |
| window dots fill | `var(--border-strong)` |
| address bar surface (skeleton fill) | `var(--bg-placeholder)` |
| address bar edge | `var(--border-muted)` |
| address bar max width | `var(--container-xs)` |
| address typography | `.text-label-code-sm` |
| size readout typography | `.text-label-sm` |
| address + size readout color | `var(--text-muted)` |
| chrome spacing (bar padding x) | `var(--spacing-sm)` |
| dot gap | `var(--spacing-xs)` |
| address padding (leading) | `var(--spacing-sm)` |
| handle grip (rest) | `var(--border-strong)` |
| handle grip (hover, focus, resizing) | `var(--text-default)` |
| handle shape | `var(--shape-elements)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| — (documentation gap, not a token gap): address bar shape, a fully rounded pill | `var(--radius-full)` — ships in the theme as `9999px`, the same temporary primitive `stepper` records | `TODO: document --radius-full in DESIGN.md § Shape; there is no --shape-* alias for a pill` |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the width and height handles show `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`; focusable content inside the viewport keeps its own ring.
- Keyboard map:
  - width handle — `ArrowLeft` / `ArrowRight` change the width by 10px, `Shift` + arrow by 100px, `Home` jumps to `minWidth`, `End` to `maxWidth`;
  - height handle — `ArrowUp` / `ArrowDown` change the height by 10px, `Shift` + arrow by 100px, `Home` jumps to `minHeight`, `End` to `maxHeight`;
  - the corner handle is pointer-only and not focusable — both of its axes are already reachable through the two keyboard handles;
  - the copy button is a normal tab stop before the handles and keeps `CopyButton`'s own keyboard behavior (`Enter` / `Space` copy);
  - the viewport's content is reached with `Tab` as part of the page's normal order.
- ARIA:
  - width handle — focusable `role="separator"`, `aria-orientation="vertical"`, `aria-valuenow` (effective width), `aria-valuemin` (`minWidth`), `aria-valuemax` (`maxWidth`), `aria-valuetext` (`768 pixels wide`), `aria-controls` (the viewport id, from `useId()`), `aria-label` from `widthHandleAriaLabel`;
  - height handle — focusable `role="separator"`, `aria-orientation="horizontal"`, `aria-valuenow` (`height`), `aria-valuemin` (`minHeight`), `aria-valuemax` (`maxHeight`), `aria-valuetext` (`1024 pixels tall`), `aria-controls` (the viewport id), `aria-label` from `heightHandleAriaLabel`;
  - the corner handle, the window dots, the address text and the size readout are `aria-hidden="true"`; the chrome bar itself is not hidden, so the copy button stays reachable, named by `copyAriaLabel`;
  - the `iframe` carries `title` from `ariaLabel` → `address` → `Preview`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): `var(--text-muted)` on `var(--bg-placeholder)` over `var(--bg-surface)` for the address and on `var(--bg-surface)` for the readout; the handle grips at rest `var(--border-strong)` meet 3:1 against `var(--bg-canvas)` as non-text controls.
- `motion-reduce:transition-none` on the handles' color transition; nothing else moves.
- Touch target: the edge handles' hit areas are 24px deep and run the frame's full width or height, and the corner handle is 24×24 — a justified deviation from 40×40: a deeper strip would cover more of the content's edge, and 24px meets WCAG 2.5.8.

## Stories (Storybook)

- Default — a composed screen of real components filling the container width at the default height, with an address.
- Breakpoints — composite story rendering the same composed screen at `375 × 812`, `768 × 1024` and `1280 × 800`, each pinned with `width` and `height`. Justified addition: showing device sizes is the component's purpose, and there is no `kind`/`size` axis that would otherwise demonstrate it.
- LongAddress — a single frame whose `address` is a long URL in a narrow container. Justified addition: middle truncation is the chrome's only behavior and nothing else shows it.

<!-- Types/Sizes omitted: BrowserFrame has no `kind` or `size` axis. Loading/Disabled omitted: it declares neither prop. -->

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
