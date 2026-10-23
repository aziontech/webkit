---
name: shell-mockup
category: content
structure: composition
status: implemented
spec_version: 1
checksum: a9d6e5ee2981447e3db7e0f33d2bd82a06bbbba208e3162a1f594e09e4b250b5
created: 2026-10-21
last_updated: 2026-10-23
---

# ShellMockup — Component Spec

## Purpose

A scaled, inert picture of an Azion Console screen, for marketing bands that show the product. The consumer composes the screen's body from real webkit components at a fixed design width; the frame draws the console shell around it (the slim console bar, the side rail with breadcrumbs and actions, or the previous console's top bar) and scales the whole drawing to fit its host. Each piece of the body is a `ShellMockup.Part` that travels in on its own beat once the mockup scrolls into view, so the screen assembles itself instead of appearing all at once.

## When to use

- Showing a console screen or fragment on a marketing band: a hero, a media split, a feature tab, a widget grid cell.
- Depicting a product workflow with real webkit controls instead of a screenshot, so the drawing follows the theme and stays sharp at any size.
- Staggering the parts of a mock so they arrive in reading order when the band scrolls into view, and replaying that entrance each time a tab makes the mock active.
- Drawing only a fragment of a screen (a list, a form row) floating on the band's own surface, with `kind="bare"` and `chrome` off.

## When NOT to use

- To show a real, working screen at a device size → use `browser-frame`; it renders live content in a true viewport, not a scaled picture.
- For a static screenshot or clip in documentation → use `doc-frame`.
- For an illustration scene → use `illustration`.

## Related

- `browser-frame` — a live, resizable viewport for real screens; `shell-mockup` is an inert, scaled drawing of the console.
- `texture-material` — the texture the frame grounds itself with when `texture` is set.
- `frame-box` — the page's registration frame a mockup band is often placed inside.

## Best practices

- Compose the body at the design width (`width`, `mobileWidth`), not at the host's width; the frame scales the drawing, so sizes inside are design pixels.
- Give the host a height (or an aspect ratio); the frame fills its host and derives its design height from it.
- Number parts in reading order with `order`, starting at `0`; parts on the same beat land together.
- Keep the mockup decorative: it is hidden from assistive technology unless `interactive` is set, so the band's own copy must say what the picture shows.
- Set `active` from the host when several mockups share one slot (tabs), so only the visible one plays and it replays when it returns.
- Tune a fade with the consumer-side custom properties `--mockup-fade-start` / `--mockup-fade-end` (or `--mockup-fade-edge` for `y`) and match its color to the host surface with `--mockup-fade-color`.

## Usage

```vue
<script setup>
import ShellMockup from '@aziontech/webkit/shell-mockup'
import Button from '@aziontech/webkit/button'
</script>

<template>
  <ShellMockup
    title="Workloads › my-workload"
    rail="workloads"
    fade="bottom"
  >
    <ShellMockup.Part :order="0">
      <Button label="Create workload" />
    </ShellMockup.Part>
    <ShellMockup.Part :order="1">
      <Button label="Deploy" kind="secondary" />
    </ShellMockup.Part>
  </ShellMockup>
</template>
```

Tree-shaking alternative — the standalone root and part from their own entries:

```vue
<script setup>
import ShellMockup from '@aziontech/webkit/shell-mockup-root'
import ShellMockupPart from '@aziontech/webkit/shell-mockup-part'
</script>
```

## Sub-components

- `shell-mockup-part/shell-mockup-part.vue` — one beat of the mockup's entrance. Context-aware: it reads the root's entered state and beat timing through `inject`, starts one step below its resting place at zero opacity, and travels into place on the beat its `order` names. Throws when rendered outside a `ShellMockup`.
  - Props: `order?: number` (default `0` — beat this part arrives on; each beat lands one `beat` after the one before it).
  - Slots: `default` — the part's content.
  - Root: a `div` with `data-entered` while landed, forwarding attributes; `data-testid` fallback `content-shell-mockup-part`.

Layout:

```
packages/webkit/src/components/content/shell-mockup/
├── shell-mockup.vue
├── shell-mockup.test.ts
├── index.ts                         (Object.assign(ShellMockup, { Part }))
├── injection-key.ts                 (ShellMockupContext + SHELL_MOCKUP_KEY)
├── composables/
│   └── use-shell-mockup-context.ts  (inject + throw outside the provider)
└── shell-mockup-part/
    └── shell-mockup-part.vue
```

Exports: `./shell-mockup` → `index.ts`, `./shell-mockup-root` → `shell-mockup.vue`, `./shell-mockup-part` → `shell-mockup-part/shell-mockup-part.vue`.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `kind` | `'window' \| 'bare'` | `'window'` | false | How the mockup is plated: a bordered console window, or bare parts floating on the host's surface. |
| `shell` | `'console' \| 'legacy'` | `'console'` | false | Console generation the shell draws: the current one, or the previous one with its top bar. |
| `width` | `number` | `860` | false | Design width of the frame from `md` up; the frame scales to fit its host. |
| `mobileWidth` | `number` | `390` | false | Design width of the frame below `md`. |
| `fade` | `'none' \| 'bottom' \| 'top' \| 'left' \| 'right' \| 'y'` | `'none'` | false | Edge the mockup fades out along; `y` fades top and bottom. |
| `chrome` | `boolean` | `true` | false | Draws the console bar over the body. |
| `title` | `string` | `''` | false | Module label on the console bar; with a rail, `›` splits it into breadcrumbs. |
| `rail` | `string` | `''` | false | Active entry of the console's side rail; empty renders no rail. |
| `texture` | `'dots' \| 'grid' \| 'lines' \| 'dither' \| 'pixelate' \| 'none'` | `'none'` | false | Texture the frame is grounded with, behind the body. |
| `textureFade` | `'none' \| 'top' \| 'bottom' \| 'left' \| 'right' \| 'edges' \| 'vignette'` | `'vignette'` | false | How the frame's texture fades out before its edges. |
| `travel` | `'fast-01' \| 'fast-02' \| 'moderate-01' \| 'moderate-02' \| 'slow-01' \| 'slow-02'` | `'slow-01'` | false | Duration token of each part's travel. |
| `beat` | `'fast-01' \| 'fast-02' \| 'moderate-01' \| 'moderate-02' \| 'slow-01' \| 'slow-02'` | `'fast-01'` | false | Duration token of the gap between one part's beat and the next. |
| `active` | `boolean` | `true` | false | Whether this mockup is the one showing; parts replay their entrance each time it becomes active. |
| `interactive` | `boolean` | `false` | false | Lets the viewer operate the controls inside instead of drawing them as an inert picture. |
| `still` | `boolean` | `false` | false | Draws every part in place from the start, with no entrance and no replay. |

`chrome` and `active` default to `true`: a mockup draws its bar and plays its entrance unless the host opts out, and both read positively.

## Events

_No events — the mockup is a picture; nothing in it reports activation._

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | The mockup's body, composed of `ShellMockup.Part` beats. |
| `overlay` | — | A layer over the whole frame, bar and rail included, such as a drawer. |

## States

- `data-kind` (`window` \| `bare`) on the root and the frame: `window` paints the canvas fill, a hairline rim lit from the top-left and bottom-right corners, and the card shape, and clips the drawing; `bare` paints nothing and lets parts overflow sideways while clipping vertically.
- `data-fade` mirrors `fade` on the root and the fade layer; `none` renders no fade layer.
- `data-interactive` is present while `interactive` is set; otherwise the root is `inert` and `aria-hidden`, ignores the pointer and blocks text selection.
- The bars and the rail are drawings: plain `div`s (no `header`, `aside` or `nav` landmark), each `inert` and `aria-hidden="true"` whatever `interactive` says, so only the slot body is ever operable.
- Shell matrix: `shell="console"` without `rail` draws the slim bar (brand, title, avatar); with `rail` it draws the side rail (from `md` up) and a top bar with breadcrumbs, a search field, Create, Agent and the avatar; `shell="legacy"` draws the previous console's top bar (menu, brand, Create, Copilot, Feedback, help, account) and swaps the legacy typography weights and line heights onto the frame. `chrome` off removes the bars; the rail stays.
- Entrance: parts are at rest offset and transparent until the root is at least 30% on screen and `active`; two animation frames later the root flips to entered and each part lands on its beat. `active` turning off resets it so it replays. `still`, or a reduced-motion preference, starts entered with no transition.
- Scale: the frame keeps the design width (`width` from `md` up, `mobileWidth` below) and scales to the host's width, deriving its design height from the host's height; it re-measures when the host resizes.

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| part entrance (root enters view while active) | inline `transition` on `opacity` and `translate`, landing classes flipped by `data-entered` | duration from `travel`, curve `expressive-entrance`, delay `order × beat` — all from `@aziontech/theme/animations` | `transition: none` inline plus `motion-reduce:translate-y-0 motion-reduce:opacity-100` (parts drawn in place) |

No `animate-*` keyframes: the entrance is a transition on a `data-*` flip, so every part's timing comes from the root's context.

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| window shape | `var(--shape-card)` |
| window + frame fill | `var(--bg-canvas)` |
| window edge, bar dividers, rail divider, search edge | `var(--border-default)` |
| window edge width | `var(--border-width-default)` |
| legacy bar surface | `var(--bg-surface-raised)` |
| search field surface | `var(--bg-surface)` |
| rail active entry | `var(--bg-selected)` |
| rail entry + search shape | `var(--shape-elements)` |
| title, group label, crumbs, icons | `var(--text-muted)` |
| current crumb, rail entry | `var(--text-default)` |
| bar title + rail group label + search placeholder typography | `.text-label-sm` |
| rail entry typography | `.text-label-md` |
| crumbs typography | `.text-body-sm` |
| rail icon typography | `.text-body-md` |
| bar spacing (gap) | `var(--spacing-sm)`, `var(--spacing-md)` |
| bar padding x | `var(--spacing-md)`, `var(--spacing-xl)` (legacy) |
| rail padding + entry gaps | `var(--spacing-sm)`, `var(--spacing-xs)`, `var(--spacing-xxs)` |
| fade color (default) | `var(--bg-canvas)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| — (no Figma source; ported from the sample's mockup): the window's rim light, a lit-from-the-corners edge | the `--illustration-rim*` tokens with a fallback that draws the same 135° ramp from `var(--border-default)` at `var(--border-width-default)`, because the illustration theme foundation is not on main yet | `TODO: drop the fallbacks once the illustration theme foundation lands on main` |

## Accessibility (WCAG 2.1 AA)

- Visible focus: none by default — the root is `inert`, so nothing inside takes focus. With `interactive`, the composed controls keep their own focus rings.
- Keyboard map: none by default (inert). With `interactive`, `Tab` reaches the composed controls in DOM order and each keeps its own keyboard behavior; the shell's own bar, rail and search are drawings and never take focus.
- ARIA: the root is a `figure` with `aria-hidden="true"` and `inert` unless `interactive`; the band hosting it carries the text that describes it. The bars and the rail are non-landmark `div`s that stay `inert` and `aria-hidden="true"` even when `interactive`, so the mockup never exposes a `banner`, `navigation` or `complementary` landmark, nor a focusable drawn control, inside the host page.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the shell's text uses `var(--text-default)` and `var(--text-muted)` on `var(--bg-canvas)` / `var(--bg-surface-raised)`, the same pairs the console uses.
- `motion-reduce:` landing classes on every part, and the inline transition drops to `none` under reduced motion.
- Touch target: not applicable by default (inert). Interactive content keeps the composed components' own targets.

## Stories (Storybook)

- Default — a `window` mockup with the console rail, a breadcrumb title and three parts on successive beats, fading at the bottom.
- Types — composite story rendering `kind="window"` and `kind="bare"` side by side.
- Shells — composite story rendering `shell="console"` (slim bar), `shell="console"` with a `rail`, and `shell="legacy"`. Justified addition: the shell is the component's main visual axis besides `kind`, and no other story shows the three bars.
- Fades — composite story rendering `fade` `bottom`, `right` and `y`. Justified addition: 61 of the sample's 68 call sites set a fade, and nothing else shows how it meets the host.

<!-- Sizes omitted: no size axis. Loading/Disabled omitted: neither prop is declared. -->

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
