# Rule: styling — classes on the root, never as JS presets

Styles live on the **template root element's `class` attribute**, not in JavaScript variables, not in `<style>` blocks, not in component-local CSS files. Variants are driven by `data-*` attributes on the same root, consumed by Tailwind's `data-[attr=value]:` variants.

## The rule

> **Do not create CSS class presets** (`variantClasses` / `sizeClasses` / `sharedClasses` objects in the script). **Do not create classes inside the component** (no `<style>` block, no local CSS, no custom utility). Everything goes inline on the root's `class`, using `data-*` to switch variants.

## What this means in practice

### ❌ Forbidden — JS class presets

```vue
<!-- DO NOT DO THIS -->
<script setup lang="ts">
  const sharedClasses = ['flex', 'items-center', 'transition-colors' /* ... */]
  const variantClasses: Record<Kind, string> = {
    primary: 'bg-(--primary) text-(--primary-foreground)',
    secondary: 'bg-(--secondary) text-(--secondary-foreground)',
    outlined: 'border border-(--border-default)',
    text: 'bg-transparent'
  }
  const sizeClasses: Record<Size, string> = {
    small: 'h-7 px-(--spacing-xs) text-button-md',
    medium: 'h-8 px-(--spacing-sm) text-button-md',
    large: 'h-10 px-(--spacing-md) text-button-lg'
  }
  const rootClasses = computed(() => [
    sharedClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
    attrs.class
  ])
</script>

<template>
  <button :class="rootClasses" />
</template>
```

### ❌ Forbidden — CSS declared inside the component

```vue
<style scoped>
  .button {
    /* never */
  }
  .button--primary {
    /* never */
  }
</style>
```

```ts
// Also forbidden — no inline CSS-in-JS, no styled() helpers, no css\`\` tagged templates.
```

### ✅ Correct — utilities inline on the root, variants via `data-*`

```vue
<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({ name: 'Button', inheritAttrs: false })

  type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
  type ButtonSize = 'small' | 'medium' | 'large'

  interface Props {
    /** Visual variant. */
    variant?: ButtonVariant
    /** Size token. */
    size?: ButtonSize
    /** Disables interaction. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'large',
    disabled: false
  })

  const attrs = useAttrs()
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'button')
</script>

<template>
  <button
    v-bind="$attrs"
    :data-testid="testId"
    :data-variant="variant"
    :data-size="size"
    :data-disabled="disabled || null"
    :disabled="disabled"
    class="
      relative inline-flex items-center justify-center whitespace-nowrap
      transition-colors duration-150 ease-out motion-reduce:transition-none
      rounded-(--shape-button)
      focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)

      data-[variant=primary]:bg-(--primary) data-[variant=primary]:text-(--primary-foreground)
      data-[variant=secondary]:bg-(--secondary) data-[variant=secondary]:text-(--secondary-foreground)
      data-[variant=outline]:border data-[variant=outline]:border-(--border-default) data-[variant=outline]:bg-transparent
      data-[variant=text]:bg-transparent

      data-[size=small]:h-7 data-[size=small]:px-(--spacing-xs) data-[size=small]:text-button-md
      data-[size=medium]:h-8 data-[size=medium]:px-(--spacing-sm) data-[size=medium]:text-button-md
      data-[size=large]:h-10 data-[size=large]:px-(--spacing-md) data-[size=large]:text-button-lg

      data-[disabled]:bg-(--bg-disabled) data-[disabled]:text-(--text-disabled) data-[disabled]:cursor-not-allowed
    "
  >
    <slot />
  </button>
</template>
```

Key choices:

- **One `class` attribute on the root.** All utilities live there.
- **`data-*` attributes mirror props** — `data-variant`, `data-size`, `data-disabled`, `data-state`, `data-orientation`.
- **Tailwind variants do the switching.** `data-[variant=primary]:bg-(--primary)` is one utility, not a JS branch.
- **`v-bind="$attrs"`** flows consumer-passed `class` (and other attrs) onto the root; Vue merges class strings automatically. No `cn()` needed for the basic case.
- **No `computed` returning class arrays.** Computed values are reserved for derived state (e.g. `isAnchor`, `testId`), not for styles.

### When consumer classes must take precedence

Some components let the consumer override internal token choices (e.g. `<Card class="bg-(--bg-canvas)" />`). Tailwind class merging via `cn` solves this:

```vue
<script setup lang="ts">
  import { cn } from '@aziontech/webkit/utils/cn'
  const attrs = useAttrs()
</script>

<template>
  <div
    :data-testid="testId"
    :class="cn('rounded-(--shape-card) bg-(--bg-surface) p-(--spacing-md)', attrs.class as string)"
  />
</template>
```

`cn` (clsx + tailwind-merge) is the **only** acceptable helper for class composition. Even then, the string passed to `cn` is a flat literal — not a JS variable holding a class preset.

### Sub-components (Composition Pattern)

The same rule applies to each sub-component. Each renders its own root with its own inline `class`. No shared `*Classes` import between siblings.

## Token values: the canonical `prop-(--token)` syntax

A design-token value on a utility is written with Tailwind v4's **paren shorthand** — `bg-(--primary)`, not `bg-[var(--primary)]`. This is the **single canonical form** (ENG-47001, decision A): it is what upstream v4 canonicalizes to, so Tailwind IntelliSense no longer flags every styled line with `suggestCanonicalClasses`, and it is what every rule, spec, example, component-scaffolder output and consumer skill or rule (`skills/`, `rules/`) now teaches. The two spellings compile to byte-identical CSS; we standardize on one so the codebase reads one way.

```html
<!-- ✅ canonical — paren shorthand -->
<div
  class="bg-(--bg-surface) text-(--text-default) rounded-(--shape-card) focus-visible:ring-(--ring-color)"
>
  <!-- ❌ legacy bracket form — do not author -->
  <div class="bg-[var(--bg-surface)] text-[var(--text-default)] rounded-[var(--shape-card)]"></div>
</div>
```

Three shapes:

| Concern               | Canonical             | Notes                                                                                                                                            |
| --------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Whole-value var**   | `prop-(--token)`      | `bg-(--primary)`, `max-w-(--container-2xl)`, `focus-visible:ring-offset-(--bg-canvas)`. Variants compose (`data-[disabled]:bg-(--bg-disabled)`). |
| **Typed value**       | `prop-(type:--token)` | `text-(length:--text-body-md)`, `border-(color:--border-default)`, `font-(family-name:--font-sans)`.                                             |
| **Numeric arbitrary** | `z-1`                 | The bare-number utility, not `z-[1]`.                                                                                                            |

**Two cases stay bracketed — the paren form emits _no CSS_ for them, silently:**

- **Custom-property declarations** — `[--table-row-bg:var(--bg-surface)]`, `data-[state=selected]:[--table-row-bg:var(--bg-selected)]`. There is no paren shorthand for _declaring_ a custom property; `(--x:--y)` compiles to nothing.
- **Expression values** — anything whose arbitrary value is more than a lone `var(--x)`: `w-[calc(var(--a)*2)]`, gradients (`bg-[linear-gradient(...var(--x)...)]`), box-shadows, and a **var with a fallback** (`bg-[var(--x,var(--y))]`, `text-[length:var(--w,1px)]`). These must remain in brackets — converting them drops the style with **no build or lint error**.

## Transitioning a transform: name `translate` / `scale`, not `transform`

Tailwind v4 does **not** compile the transform utilities to the `transform` property. `translate-x-*` / `translate-y-*` compile to the standalone **`translate`** property, and `scale-*` to **`scale`**:

```css
/* what Tailwind v4 actually emits */
.translate-x-\[12\%\] {
  --tw-translate-x: 12%;
  translate: var(--tw-translate-x) var(--tw-translate-y);
}
.scale-90 {
  --tw-scale-x: 90%;
  --tw-scale-y: 90%;
  scale: var(--tw-scale-x) var(--tw-scale-y);
}
```

So a transition that names `transform` never animates them. This fails **silently** in the worst way: the class compiles, `vue-tsc` and ESLint pass, the utility is emitted, the element ends up in the right place — and no motion is ever interpolated.

```html
<!-- ❌ compiles, lints, animates NOTHING -->
<div class="translate-x-[12%] transition-[transform,opacity] duration-moderate-01">
  <!-- ✅ name the properties the utilities actually set -->
  <div class="translate-x-[12%] transition-[translate,opacity] duration-moderate-01">
    <div class="scale-90 transition-[scale,opacity] duration-moderate-01"></div>
  </div>
</div>
```

**With Vue `<Transition>` / `<TransitionGroup>`, list all three.** The enter/leave classes use the utilities above (`translate`, `scale`), but `TransitionGroup`'s _move_ animation sets an inline `transform` of its own, so a group that both moves and fades needs every property named:

```html
transition-[transform,translate,scale,opacity] duration-moderate-01 ease-productive-entrance
motion-reduce:transition-none
```

Two related traps in the same family, both silent:

- **An inline `style="transition: …"` beats every class.** A component that sets one (e.g. for its own dismiss animation) discards any `transition-*` a consumer puts on that same element. Do not set `transition` inline on a component root; express it as a utility so the consumer can override it.
- **Re-inserting a node discards its pending transition.** Reordering a keyed list moves the DOM node, which cancels any transition that was about to start on it or inside it. A list whose items animate their own size or content cannot also reorder on the same interaction — pick one. (Measured: 8 interpolated frames when the item keeps its position, 0 when it moves.)

**Verify motion by measuring, not by looking.** Sample the animated property across `requestAnimationFrame` and assert there are interpolated frames between the start and end values; a snap and a 150ms ease are indistinguishable by eye in review.

The guardrail token-checks (`typography-raw-length`, `leading-raw`, `tracking-raw`, `font-family-raw`, `animate-arbitrary`, `motion-hardcoded`) match **both** spellings, so accepting the IntelliSense suggestion cannot walk a raw value through the typography / motion / animation gates.

### A malformed shorthand is dead, and looks alive

The shorthand has no tolerance: the parens hold **exactly** `--token` or `type:--token`, nothing else. Get it slightly wrong and the style never reaches the element, while the class keeps reading as correct — in a 1000-character root `class` string, forever.

| Written              | What actually happens                                                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `bg-(--bg-surface )` | The space **terminates the candidate**. Tailwind sees the unterminated `bg-(--bg-surface` and emits **nothing**.                         |
| `bg-( --bg-surface)` | Same — whitespace anywhere inside the parens.                                                                                            |
| `min-h-[--(size-4)]` | Bracket/paren inverted. This one _does_ emit a rule — `min-height: --(size-4)`, an invalid value the **browser discards at parse time**. |

Both shipped: chip's `filled` variant was fully transparent in both themes from the day it shipped (the first form), and `popover-header`'s min-height was inert from the v4 sweep until 2026-08-12 (the third). Neither is a lint, type, or build error on its own, and **a visual baseline generated from the broken render encodes the bug as correct** — so nothing downstream fails either.

Two consequences worth internalizing:

- **A dead class is invisible to the unit suite.** Vitest browser mode runs without Tailwind, so a computed-style assertion returns the same value whether the class works or does not exist (see [`testing.md`](./testing.md) § "What a real browser does NOT give this suite"). Verify a fill by sampling the rendered pixel, or probe the class through the v4 compile API — not through `getComputedStyle` in a test.
- **When a style "does nothing", suspect the class before the cascade.** Probe it (`compile(...).build(['the-class'])`) with a deliberately bogus class in the list as a control; if the bogus one also "emits", the probe is measuring nothing.

The **`dead-token-shorthand`** token-check blocks both spellings at write time and in the CI ratchet. It scans raw file text, so a comment that _quotes_ a malformed class trips it too — describe such a class in prose instead of spelling it out.

## A container query never matches its own container

`@container/name` makes an element a query container; `@xl/name:` asks about the nearest ancestor container called `name`. The element that declares the container is not its own ancestor, so a variant on it never matches, and it fails silently: the base value applies at every width.

```html
<!-- ❌ the variable is 9rem at every width -->
<div class="@container/trace [--trace-name:9rem] @xl/trace:[--trace-name:13rem]"></div>

<!-- ✅ the container on the parent, the query on the children that use it -->
<div class="@container/trace">
  <div class="[--trace-name:9rem] @xl/trace:[--trace-name:13rem]"></div>
</div>
```

Shipped in `Trace` (its name column stayed at 9rem in every panel) until 2026-11-13. The **`container-query-on-container`** token check blocks it at write time and in the CI ratchet.

## Never read `:has()` from a frame that wraps rows

A `group-has-[…]/<frame>:` variant asks Chromium to re-check the `:has()` whenever anything inside the frame changes. On a frame that wraps a list or a table, every row a virtualizer mounts triggers that check, and a `:has()` in an ancestor position invalidates the whole frame subtree, so every visible cell restyles on every scroll frame.

```html
<!-- ❌ every mounted row restyles the whole table -->
<span class="hidden group-data-[overflow-end]/scroll:block group-has-[[data-frozen=end]]/scroll:invisible"></span>

<!-- ✅ the cue sits below the frozen cells (z-10), which paint over it -->
<span class="z-5 hidden group-data-[overflow-end]/scroll:block"></span>
```

Shipped in the table scroll cue until 2026-11-20 (the 10k-row virtual DataTable went from 228 ms to 3,580 ms of style recalc on a phone). Get the same result from the stacking order, or measure the state in script and set a `data-*` attribute on the frame. The **`has-on-scroll-frame`** token check blocks a `:has()` variant read from the `scroll` group at write time and in the CI ratchet, and the styled suite `table-scroll-performance.test.ts` fails when scrolling the virtual DataTable restyles the whole table.

## A directional icon already mirrors — never rotate it under `rtl`

`@aziontech/webkit/styles` mirrors every directional glyph (`az-arrow-right`, `az-chevron-left`, `ai-caret-*`, `az-log-in`, `az-reply`, … — the `DIRECTIONAL_ICONS` set in `src/utils/directional-icons.ts`) under `dir="rtl"` with `scale: -1 1`. Adding `rtl:rotate-180` (or `rtl:-rotate-180`) on the same glyph composes a rotation with that scale, which flips it vertically instead of horizontally: the arrow points the wrong way, and nothing errors.

```html
<!-- ❌ mirrored twice — points the wrong way in rtl -->
<i class="az az-arrow-right rtl:rotate-180"></i>

<!-- ✅ the stylesheet already mirrors it -->
<i class="az az-arrow-right"></i>
```

`rtl:-scale-x-100` is harmless (it sets the same scale), and a non-directional glyph (`az-chevron-down`) may rotate freely. Shipped in `apps/docs` until 2026-11-17. The **`rtl-double-flip`** token check blocks it at write time and in the CI ratchet, over components and also `apps/docs/src`, `apps/demos/src`, `packages/webkit/blocks` and `packages/webkit/examples` (one of the two token checks that run outside components).

## One orange: the logo orange

Content uses one orange, the logo orange `#F3652B` (owner decisions 2026-11-18 and 2026-11-22), and it is never the colour of text: as text it misses WCAG AA on light surfaces (about 3:1). It is `--primary`, in two shapes: a **fill** behind `--primary-foreground` text (the button, `Tag variant="highlight"`, the `HeroTitle` highlight), or a **mark** beside text in `--text-default`: a bar (the `Quote` name, a comparison group title; never before an `Eyebrow`, whose only mark is its `//` prefix, EB-1), an underline (a `LinkDirectory` column title, a hovered linked `FeatureItem`), a glyph or a glow fading to transparent. A mark is decoration, so it carries no contrast requirement; the text beside it does, and passes.

```html
<!-- ❌ the orange as text: 3:1 on white, and a second orange -->
<span class="text-(--text-brand)">Jane Doe</span>
<span class="text-(--color-orange-300)">Compute</span>

<!-- ✅ a mark beside default text, or a fill behind its foreground -->
<span class="border-s-2 border-(--primary) ps-(--spacing-xs) text-(--text-default)">Jane Doe</span>
<span class="rounded-(--shape-control) bg-(--primary) px-(--spacing-xs) text-(--primary-foreground)">Build and run</span>
```

`--text-primary` and `--text-brand` were removed in 6.0 (`webkit migrate` rewrites `--text-primary` to `--text-default`). The other steps of the orange scale stay inside the theme, where the chart and severity scales use them as data colours. No part needs a contrast exception for brand colour: `packages/webkit/src/test/a11y-accepted.json` is empty. The **`off-brand-orange`** token check blocks `--text-primary`, `--text-brand` and any orange step but `500` at write time and in the CI ratchet, over components, examples, blocks and the docs and demos apps.

## Never double a line

Adjacent bordered surfaces share **exactly one hairline**. The outer frame belongs to the container; the parts inside it draw only the internal dividers between themselves. Two borders never sit flush side by side or 1px apart: no 2px seam where two parts meet, no frame drawn again just inside its container's frame.

```html
<!-- ❌ the header's bottom rule and the grid's own top rule stack into a 2px seam,
        and the grid's side rules sit inside the column's -->
<div class="border-x">
  <header class="border-b">…</header>
  <div class="border">…</div>
</div>

<!-- ✅ the column draws the sides, the header the seam, the grid only its inner dividers -->
<div class="border-x">
  <header class="border-b">…</header>
  <div class="grid gap-px bg-(--border-default)">…</div>
</div>
```

How the library keeps it, so a page composed from it inherits the single line:

- **The container owns the outer edge.** `Container` draws the column's sides, `ModuleHeader` the header's bottom rule; an unpadded `Module` body marks itself `data-frame-edges`, and a `RegistrationFrame` placed directly in it (and the `DocCardGroup` built on one) drops its top and side rules and its top corner marks. `Card` frames its regions, `InputGroup` frames its controls and strips a nested `Input`'s border, the `Pagination` strip frames its current page.
- **Parts draw dividers, not frames.** A list of items rules the seams between them (`not-last:border-b`), never under the last one; a header rules its bottom only when a body follows it.
- **A frame that closes a band hands the next seam over.** A frame's bottom rule (`Spacer`, a framed grid) is the next band's top edge, so the `Module` after it passes `divided` as `false`.
- **Drop the part's own frame when it sits in one.** `CodeEditor` and `LogViewer` take `:bordered="false"` inside a pane, card or accordion that already frames them.
- **When two parts must both keep a rule, lay one exactly on the other** (`CardGrid`'s `flush`, a cell's `ring-1` painted into its frame's pixel). Coinciding on the same pixel reads as one line; touching or 1px apart reads as two.

A static lint cannot see rendered borders, so this rule is gated where the CSS is real: the styled visual suite measures every page it visits and fails on a doubled line (see Enforcement).

## One outline per toolbar

In a header or a toolbar row (`header`, `[role=toolbar]`, a `*toolbar` / `*__actions` / `*__end` part), outlined controls that sit side by side at the same height share **one border colour**: the toolbar's `--border-default` (`IconButton` / `Button` `variant="outline"`, `SearchTrigger`, `ThemeSwitcher`). The field outline `--border-input` is for a text-entry field (an `input`, a `textarea`, a `contenteditable`) and for a field in a form, where it is the control's boundary (WCAG 1.4.11); it never sits on a button-like control between outlined buttons.

```html
<!-- ❌ the field outline (#535353) between outline buttons (#2B2B2B) -->
<SearchTrigger /><Select><Select.Trigger aria-label="Language" />…</Select><IconButton variant="outline" />

<!-- ✅ the compact switcher draws no outline; the row keeps one border colour -->
<SearchTrigger /><LanguageSelect v-model="locale" variant="ghost" /><IconButton variant="outline" />
```

- **A switcher in a header is ghost**: `LanguageSelect variant="ghost"` for the language, `Select variant="ghost"` for anything else. The field-sized `Select`, `LanguageSelect` and `Input` stay in forms.
- **A text field in a toolbar keeps its field outline** (a table's search `Input`): typing is what the outline marks, so the check skips it.

Shipped in the docs header (the language `Select` beside the search and the icon buttons) until 2026-11-20. A static lint cannot see a rendered border colour; the styled visual suite measures it (see Enforcement).

## Two filled rows never touch

In a list of rows (a select or combobox option, a menu item, a command item, a sidebar or tree row), the hover, highlighted, active and selected fills of two neighbouring rows are separated by a **2px gap**. The row keeps its full height, so the hit area and the touch target do not shrink; only the painted fill is inset, 1px from the top and 1px from the bottom edge. This is the market pattern (Radix and shadcn menus, Linear, Vercel Geist, Raycast): each highlighted row is its own rounded surface, and a selected row next to a highlighted one reads as two surfaces, never as one merged block.

```html
<!-- ❌ the selected row and the highlighted row below it fuse into one block -->
<div role="option" class="h-8 rounded-(--shape-control) hover:bg-(--bg-hover) data-[selected]:bg-(--bg-selected)">…</div>

<!-- ✅ the fill stops 1px inside each edge; the row is still 32px tall -->
<div
  role="option"
  class="h-8 rounded-(--shape-control) border-y border-transparent bg-clip-padding forced-colors:border-y-0 hover:bg-(--bg-hover) data-[selected]:bg-(--bg-selected)"
>…</div>
```

- **The pattern is the four utilities `border-y border-transparent bg-clip-padding forced-colors:border-y-0`** on the row, next to its `rounded-*`. A fill painted on a `before:` / `after:` layer with `inset-0` is inset too, because an absolute layer fills the padding box. An inset focus ring (`ring-inset`) sits inside the same box.
- **`forced-colors:border-y-0` is required**: under Windows high contrast the system paints a transparent border as a solid line, which would rule every row. There are no fills in that mode, so the gap is not needed there.
- **The list does not add a gap between rows**: the gap comes from the inset, so a list is exactly as tall as before, and a virtualized list keeps its fixed row height.
- **A panel list whose focus ring sits outside the row keeps its list gap instead.** `TransferList`, `ConversationHistory`, `FilterMenu` and the `DateRangePicker` presets space their rows with `gap-(--spacing-2xs)`, which already separates the fills and leaves room for the offset ring; they do not add the inset as well.
- **Rows that are not a list keep their own shape**: a calendar cell, a tab, a segmented control, a mega-menu entry and a table row follow their own components' rules.

## Never stack regions flush

Two regions of a page never sit closer than the group step, `--layout-group-gap` (`--spacing-md`, 16px). A region is a banner (`Alert`), a card, a framed table or any bordered or filled surface, and a section heading; the step between two of them is `--layout-section-gap` between the sections of a parent and `--layout-group-gap` between the parts of one section (the two steps of [`webkit-layout`](../../skills/webkit-layout/SKILL.md)), so the group step is the floor.

```html
<!-- ❌ the parent section carries no gap: the banner lands flush on the band's heading -->
<section class="layout-section-start flex flex-col">
  <Alert … />
  <div><SettingsGroup label="Defaults">…</SettingsGroup></div>
</section>

<!-- ✅ the parent section spaces every band, the banner included -->
<section class="layout-section-start flex flex-col gap-(--layout-section-gap)">…</section>
```

`SettingsGroup` spaces itself from the bands before it with its own top margin, and only from a `SettingsGroup` sibling, so a page-level banner above the first band is spaced by the parent section's `gap`, never by the band. Tighter steps are right **inside one unit**: a card's rows, a list's items, a chat message's parts, a label over its own field, a controls row inside a card, anything inside an overlay. The gate reads them as one unit and stays silent.

A static lint cannot see a rendered gap either; the styled visual suite measures it (see Enforcement).

## A texture is a backdrop for text only

A `Texture` (every variant, the orange `pixelate` floor above all) sits behind **text**: an eyebrow, a headline, a paragraph, the buttons of a band. Nothing that has to be read in its own lines and marks is drawn on it: a chart, a diagram, a map, a stat, and any page-JSON content scene (an accordion, a card, a code block, an embed, a key-value list, a plan feature list). The dots compete with the axis labels, the legend and the lines, and the content cannot be read (owner decision RV-T2-1, 2026-11-18).

The places it is used today are the allowed ones, and they stay as they are: behind the text of a hero, a call-to-action and a newsletter band, and under the opaque windows the bands were designed around (a console mock-up in `ConsoleShowcaseSection`, the terminal in `CliTerminalSection`, the code file in `FeatureTabsSection` and `FeatureScrollSection`, the media of `MediaSplit`), where the window's own ground hides the dots.

```html
<!-- ❌ the chart is drawn on the orange floor -->
<ConsoleShowcaseSection title="Watch every threat"><template #scene><Chart … /></template></ConsoleShowcaseSection>

<!-- ✅ the diagram layout draws its scene on the plain canvas -->
<ConsoleShowcaseSection variant="diagram" title="Watch every threat"><template #scene><Chart … /></template></ConsoleShowcaseSection>
```

How the library keeps it:

- **`ConsoleShowcaseSection variant="diagram"` paints no texture.** Its `texture` prop grounds only the `console` panel; a scene that is not a console window takes `variant="diagram"`, and keeps its bottom padding on every width.
- **A `Texture` hides itself next to content.** Every chart, `FlowDiagram`, `StatTile` and `Tracker` root carries `data-plain-ground`, and `SitePage` stamps it on every page-JSON scene that is not a backdrop scene (`ConsoleMockup`, the console scenes, the globes, `Illustration`, `Diagram`: `backdropScenes` in `src/assets/scene-registry.ts`). A `Texture` whose parent holds a `[data-plain-ground]` is `display: none`, unless that content sits inside an opaque window (`[data-opaque]`, the `window` `ConsoleMockupShell`).
- **The hero keeps its dots off its windows** (RV-H2-1). `Hero`'s backdrop runs behind the copy; when its `bottom` window holds `data-plain-ground` content the backdrop stops at that window's top edge, and when the `top` window or the `media` cell does, the band paints no backdrop. `HeroSection` (`center`) inherits it, so a topology under the headline sits on the plain canvas while the dots stay behind the copy.
- **The rule is checked where the content is placed**, so it fails at write time and in CI, not in review (see Enforcement).

## A zero length carries no unit

A zero is the one value that is identical in every unit, so the unit is pure noise — and it makes the same zero read three different ways across the codebase (`0px` here, `0rem` there, `0em` in a token). **Write `0`.**

```js
// ❌ tokens, arbitrary values, inline styles — the unit says nothing
const tracking = { normal: '0em' }
node.style.height = '0px'
class="p-[0rem] translate-y-[0px]"

// ✅
const tracking = { normal: '0' }
node.style.height = '0'
class="p-0 translate-y-0"
```

The rule covers **length** units only — `px`, `rem`, `em`, `ch`, `vw`/`vh`, `cqw`, `cm`/`in`/`pt`, and the rest of the CSS length set. Units that carry meaning (or are required) at zero are untouched: `0%`, `0s` / `0ms`, `0deg`, `0fr`.

### The one place a zero keeps a unit: math functions

Inside `calc()` / `min()` / `max()` / `clamp()` a bare `0` is a **number**, not a length, so the whole expression is invalid — CSS requires the unit there. When the unit is unavoidable it is **`rem`**, the one length unit this system scales in; never `px` / `em`.

```css
/* ✅ the unit is required here, and it is rem */
width: calc(100% - 0rem);
height: max(0rem, var(--content-height));

/* ❌ same requirement, wrong unit */
width: calc(100% - 0px);
height: max(0em, var(--content-height));

/* ✅ outside a math function the zero stays bare */
margin: 0;
padding: 0 var(--spacing-md);
```

## Hard prohibitions

- Never mix two border colours on outlined controls side by side in one header or toolbar; only a text-entry field keeps the field outline there.
- Never double a line — no two visible borders flush side by side or 1px apart. The container draws the outer frame; the parts inside draw only the dividers between themselves.
- Never let the fills of two neighbouring list rows touch: inset the fill with `border-y border-transparent bg-clip-padding forced-colors:border-y-0`, keeping the row height.
- Never stack two page regions (a banner, a card, a framed table, a section heading) closer than `--layout-group-gap`; the stack that holds them carries the gap.
- Never draw anything but text on a `Texture`: no chart, diagram, map or stat, and no page-JSON content scene. Use `ConsoleShowcaseSection variant="diagram"`, `texture="none"`, or a band without a texture.
- No zero with a length unit — `0`, never `0px` / `0rem` / `0em` (in tokens, arbitrary Tailwind values, inline `style`, or authored CSS). The single exception is inside `calc()`/`min()`/`max()`/`clamp()`, where CSS requires a unit and that unit is **`rem`**.
- No malformed token shorthand — no whitespace inside the parens (`bg-(--token )`, `bg-( --token)`) and never the inverted `[--(token)]`. The style silently never applies; blocked by `dead-token-shorthand`.
- No `const sharedClasses = [...]`, `const variantClasses = {...}`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`. The whole "class map" pattern goes away.
- No `<style>` blocks (scoped or unscoped).
- No `.css` / `.scss` files inside a component directory.
- No CSS-in-JS, no `styled()`, no `css\`\`` tagged templates.
- No utility classes declared in a `tailwind.config.*` plugin specifically for one component. Component utilities live in [`@aziontech/theme`](../../packages/theme/) (`semantic/*` if reusable across components), or as inline composition on the root.
- No `:class="[a, b, c]"` arrays when a flat string + `data-*` would do.

## Vue SFC pitfall — no backticks inside `<template>` `:class`

The Vue HTML parser runs **before** JavaScript. **Do not** pass multiline template literals from the template:

```vue
<!-- ❌ Breaks Vite: vite:vue "Element is missing end tag" (often last line, high column) -->
<button
  :class="
    cn(
      `
      data-[variant=primary]:bg-(--primary)
      `,
      attrs.class
    )
  "
/>
```

**Symptoms**

| Signal                                | Meaning                                                 |
| ------------------------------------- | ------------------------------------------------------- |
| `Plugin: vite:vue`                    | SFC compile failed (not runtime)                        |
| `Element is missing end tag`          | HTML tokenizer lost sync inside a bound attribute       |
| Line = last line of file, column ≫ 80 | Error position is end-of-template, not the real mistake |

**Fix (pick one)**

1. **Plain multiline `class` on the root** (no JS quotes) + optional `:class="attrs.class"` for consumer overrides.
2. **Single-quoted `ROOT_CLASS` in `<script setup>`** + `:class="cn(ROOT_CLASS, attrs.class)"` — one flat literal string, not a `variantClasses` / `sizeClasses` map.

`pnpm lint:webkit` and `vue-tsc` may still pass; only the SFC template compiler (`pnpm dev:docs`, `pnpm build:docs`) catches this.

## Vue SFC pitfall — no HTML-like tags in `<script>` comments

A tool that runs `@vitejs/plugin-vue` twice (as some consumer setups do) may call `compiler-sfc` `parse()` on **already-compiled** module code. Any substring that looks like HTML in that output breaks the parse, so the rule stays for every consumer build.

```ts
// ❌ Survives compileScript and breaks the second vite:vue pass
/** When set, renders as a link (`<a>`). */

// ✅ Plain language — no angle brackets in script comments
/** When set, renders as an anchor link. */
```

**Symptoms:** same as above (`vite:vue` / `Element is missing end tag` on the `.vue` path, often line past EOF). `compiler-sfc` `parse()` on the raw `.vue` file succeeds; `parse(compiledJs)` fails.

**Debug checklist**

| Step | Command / action                                                                                                                    |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Read the Vite terminal: `Plugin: vite:vue` + `Element is missing end tag`                                                           |
| 2    | Confirm raw SFC parses: `node -e "require('vue/compiler-sfc').parse(fs.readFileSync('…vue','utf8'),{filename:'…'})"` → `errors: []` |
| 3    | Grep script for `` `<…>` ``, `<template`, `</…>` in comments and JSDoc                                                              |
| 4    | Remove backtick multiline literals from `<template> :class="cn(\`…\`)"`(move class string to script`ROOT_CLASS`)                    |
| 5    | Restart `pnpm dev:docs` after fixing (clear stale HMR descriptor if needed)                                                         |

## When you legitimately need conditional styling

Use a `data-*` attribute + a Tailwind variant. The decision lives in HTML, not in JS:

```vue
<!-- ✅ Loading state -->
<button
  :data-loading="loading || null"
  class="data-[loading]:cursor-wait data-[loading]:opacity-80"
/>

<!-- ✅ Open/closed (overlays) -->
<div
  :data-state="open ? 'open' : 'closed'"
  class="data-[state=open]:animate-popup-scale-in data-[state=closed]:animate-popup-scale-out"
/>

<!-- ❌ Don't do this -->
<button :class="loading ? 'cursor-wait opacity-80' : ''" />
```

## Enforcement

- `component-scaffolder` (agent) refuses to emit the `variantClasses`/`sizeClasses`/`sharedClasses`/`rootClasses` pattern. The skeleton in [`.claude/skills/component-scaffold/SKILL.md`](../skills/component-scaffold/SKILL.md) uses inline classes + `data-*` variants.
- `validate-tokens.mjs` (PreToolUse hook) already blocks HEX/palette/raw typography regardless of where they appear.
- **`container-query-on-container`** (same engine, write-time hook and CI ratchet) blocks a class string that declares `@container/<name>` and also uses an `@…/<name>:` variant; pinned both ways in [`token-checks.test.mjs`](../../packages/webkit/test/eslint-plugin/token-checks.test.mjs).
- **`has-on-scroll-frame`** (same engine, write-time hook and CI ratchet) blocks a `group-has-[…]/scroll:` or `peer-has-…/scroll:` variant; pinned both ways in [`token-checks.test.mjs`](../../packages/webkit/test/eslint-plugin/token-checks.test.mjs). The styled suite [`table-scroll-performance.test.ts`](../../packages/webkit/src/test/table-scroll-performance.test.ts) holds the virtual DataTable's scroll style recalc to a machine-independent ratio (`perf-budgets.json#styleRecalc`).
- **`rtl-double-flip`** (same engine, write-time hook and CI ratchet; marked `wide`, so `tokenChecksFor` also runs it over blocks and examples, and `repoTokenChecksFor` in `.claude/hooks/lib/token-checks.mjs` adds `apps/docs/src` and `apps/demos/src`, since the package itself never names `apps/`) blocks a class string that holds a directional `az-*` glyph together with `rtl:rotate-180` / `rtl:-rotate-180` under any variant chain; pinned both ways, and against `DIRECTIONAL_ICONS`, in [`token-checks.test.mjs`](../../packages/webkit/test/eslint-plugin/token-checks.test.mjs).
- **`off-brand-orange`** (same engine, write-time hook and CI ratchet; marked `wide` like `rtl-double-flip`, so it runs over components, blocks, examples, `apps/docs/src` and `apps/demos/src`) blocks `--text-primary` and every `orange` / `brand-primary` / `alpha-orange` step other than the logo step `500`, as a variable or a utility; pinned both ways in [`token-checks.test.mjs`](../../packages/webkit/test/eslint-plugin/token-checks.test.mjs).
- **`status-fill-as-text`** (same engine, write-time hook and CI ratchet; marked `wide`, so it runs over components, blocks, examples and the docs and demos apps) blocks a status fill (`--danger`, `--success`, `--warning`, `--info`) used as a text or icon colour: an icon on a surface is the `-mark` token, error text `--text-danger`, text on the fill its `-foreground` (`rules/webkit-tokens.md`); pinned both ways in [`token-checks.test.mjs`](../../packages/webkit/test/eslint-plugin/token-checks.test.mjs).
- **`dead-token-shorthand`** (same shared token-checks engine, so write-time hook **and** the `check-authoring` CI ratchet) blocks a malformed shorthand — whitespace inside the parens, or the inverted `[--(token)]`. It is the only gate that sees this class of defect: the utility never exists, so nothing else in the pipeline has anything to complain about, and the unit suite runs unstyled. Pinned both directions (fires / stays silent on ordinary subtraction and on a nested `var()` fallback) in [`token-checks.test.mjs`](../../packages/webkit/test/eslint-plugin/token-checks.test.mjs).
- **Zero-unit** is gated on four surfaces, so no authoring path escapes it: the `zero-with-unit` check in the shared token-checks engine (write-time hook **and** the `check-authoring` CI ratchet, over component sources); `length-zero-no-unit` in [`.stylelintrc.json`](../../.stylelintrc.json) for authored CSS/SCSS/Vue `<style>` — set to plain `true` so the preset's `ignore: ['custom-properties']` does **not** apply, since a design system is authored almost entirely as custom properties; the same rule in the shipped [`stylelint-config.js`](../../packages/webkit/src/stylelint-config.js) so consumers inherit it; and a build-time assertion in the theme's `build:tokens`, which is the only gate that sees token values (they are authored in JS and compiled, so no linter reads them). A `length-zero-no-unit` canary fixture keeps the stylelint side from being relaxed.
- **The `rem`-in-math-function carve-out** is gated by the two engines we own — the `zero-unit-in-calc` token check and the same assertion in `build:tokens`. Stylelint's `length-zero-no-unit` deliberately skips math functions (a unit is required there), so it accepts `calc(100% - 0px)`; the token check is what makes that `0rem`.
- **Never double a line** is gated by the `visual` CI job: [`apps/visual/tests/doubled-lines.spec.ts`](../../apps/visual/tests/doubled-lines.spec.ts) runs [`findDoubledLines`](../../apps/visual/tests/doubled-lines.ts) once per page in the browser — the first example of every component, the primary state of every block, and the docs home and foundation pages, at 390 and 1280 — and fails listing every pair of visible borders (non-zero width, opaque color, not inside a form control, not hidden or zero-size) that lie flush or 1px apart and overlap along at least 4px. [`apps/visual/scripts/doubled-lines.mjs`](../../apps/visual/scripts/doubled-lines.mjs) runs the same detector over every docs route, example and block state against a built docs site, for a full sweep before a PR.
- **One outline per toolbar** is gated by the same `visual` job: [`apps/visual/tests/toolbar-outlines.spec.ts`](../../apps/visual/tests/toolbar-outlines.spec.ts) runs [`findMixedToolbarOutlines`](../../apps/visual/tests/toolbar-outlines.ts) over the docs home (light and dark) and foundation pages, the first example of every component and the primary state of every block, at 390 and 1280. In every `header`, `[role=toolbar]`, `[role=banner]` and toolbar part it takes each visible, enabled control with a four-sided opaque border of one colour (the control or one of its two nearest wrappers), skips text-entry fields, and fails on two of them in the same row (centres within 2px) with the same height (within 1px) and different border colours. [`apps/visual/scripts/toolbar-outlines.mjs`](../../apps/visual/scripts/toolbar-outlines.mjs) sweeps every docs route, example and block state.
- **Two filled rows never touch** is gated by the styled suite [`list-row-gap.test.ts`](../../packages/webkit/src/test/list-row-gap.test.ts): it opens Select, MultiSelect, Combobox and DropdownMenu, puts a selected row next to a highlighted one, and measures a visible gap of at least 2px between the two fills, with the row height unchanged.
- **Never stack regions flush** is gated by the same `visual` job: [`apps/visual/tests/region-gaps.spec.ts`](../../apps/visual/tests/region-gaps.spec.ts) runs [`findTightRegions`](../../apps/visual/tests/region-gaps.ts) over the same pages at the same widths. For every vertical stack (a block flow, a column flex or a grid) that is not inside a unit — a bordered or filled surface, a fixed or sticky layer, an `article`, a list item, a log or a dialog — it takes each pair of consecutive visible children and fails when the first ends on a surface (bordered on four sides or filled with a radius, at least 120 × 32px, not a control or a field wrapper) and the second starts on a surface or a heading, closer than the resolved `--layout-group-gap`. A heading is measured from its content box, so a heading's own top padding counts as space; two surfaces of the same kind (a list of like cards) are a list, not two regions. [`apps/visual/scripts/region-gaps.mjs`](../../apps/visual/scripts/region-gaps.mjs) sweeps every docs route, example and block state.
- **A texture is a backdrop for text only** is gated three ways. At write time and in CI, the `texture-backdrop` engine ([`texture-backdrop.js`](../../packages/webkit/src/eslint-plugin/lib/texture-backdrop.js), run by [`validate-authoring.mjs`](../hooks/validate-authoring.mjs) and the [`check-authoring.mjs`](../../packages/webkit/scripts/check-authoring.mjs) ratchet over components, blocks and examples) blocks a chart, diagram, map or stat placed next to a `Texture` or in the slot of a section that paints one (`ConsoleShowcaseSection` outside `diagram`, `MediaSplitSection`, `MediaSplit`, `MediaTabs`, `Backdrop`, the copy column or `background` slot of a `Hero` with a `texture`, the `bottom` window of a `Hero` with a `floorTexture`; the hero's `top`, `bottom` and `media` windows pass because `Hero` keeps its backdrop off them), and page JSON that puts any scene but a backdrop scene on a textured `console-showcase-section` or `media-split-section`; pinned both ways in [`texture-backdrop.test.mjs`](../../packages/webkit/test/eslint-plugin/texture-backdrop.test.mjs). In the component, the styled suite [`texture-backdrop.test.ts`](../../packages/webkit/src/test/texture-backdrop.test.ts) proves `Texture` drops itself beside marked content and the Page JSON examples paint no texture under their scene. In the `visual` job, [`texture-backdrop.spec.ts`](../../apps/visual/tests/texture-backdrop.spec.ts) runs [`findGraphicsOnTexture`](../../apps/visual/tests/texture-backdrop.ts) on every example that composes a band or a texture and every block's primary state, at 390 and 1280, and fails when a painted texture lies under a `[data-plain-ground]` box; [`apps/visual/scripts/texture-backdrop.mjs`](../../apps/visual/scripts/texture-backdrop.mjs) sweeps every example and block state.
- A future PostToolUse hook may grep `.vue` files for `const \w+Classes\s*=\s*[\{[]` and emit `BLOCKED: forbidden class preset` — until then, `echo-reporter` flags the pattern.
- `.claude/docs/COMPONENT_REQUIREMENTS.md` § 13.w "Styling discipline" supersedes any older example in the same file that still shows the JS-presets pattern. **The data-attribute approach is the canonical pattern for new components.**

## Why this rule exists

The old `variantClasses` Record pattern looks clean but rots over time:

- Every new variant adds a JS branch AND a Tailwind class — duplicated edits.
- Tailwind's `data-[attr=value]` variant compiles to the same CSS but reads in one place.
- Designers can scan a `.vue` and see all states without crossing the script/template boundary.
- Code Connect can map Figma variants to `data-*` attributes more naturally than to JS dictionaries.
- Removes the need for `computed` arrays whose only purpose is class composition.

Legacy components (in `.claude/hooks/lib/legacy-components.json`) still use the old pattern — that's fine, they're whitelisted. **Every new component starts with the new pattern.**
