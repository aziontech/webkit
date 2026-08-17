# The framed grid — Azion's industrial page language

The page-composition language shared by **Hub**, **Docs**, and **Site**: a fluid hero band, a
centered column framed by vertical rules, and a stack of self-contained modules divided by
hairlines. Nothing floats, nothing is rounded, and **no line is ever drawn twice**. The result is
the drawn-grid, technical-drawing look — the *industrial* register of the Azion brand.

Reference implementations live in
[`apps/webkit-sample/src/site/components/`](../../apps/webkit-sample/src/site/components/) and
[`.../site/docs/components/`](../../apps/webkit-sample/src/site/docs/components/); the layout primitives —
shared by Site, Hub and Docs — are in
[`shared/ui/layout/`](../../apps/webkit-sample/src/shared/ui/layout/).

For the token-level vocabulary (weights, border colors, radii) and how individual **webkit
components** draw their own edges, see [§ Vocabulary](#vocabulary) below and
[`DESIGN.md`](./DESIGN.md).

---

## The one-frame principle

The whole page is **one continuous frame**. Every edge in it is owned by exactly one element — the
neighbour on the other side of that edge draws nothing. This is the rule the entire language hangs
on; a doubled line is the one unmistakable failure.

| Edge | Owned by | Utility |
| --- | --- | --- |
| Top rule of the page body | The hero band | `border-b` (full-bleed) |
| Left + right rules | The content column | `border-x` |
| Bottom rule | The footer | `border-t` |
| Rule between two modules | The **lower** module | `border-t` |
| Rule under a module header | The header row | `border-b` |
| Left/right edge of any module | *Nobody* — it's the column's `border-x` | — |
| Internal rules of a cell grid | The grid's `gap-px` showing its own background | — |

Two consequences you have to actively remember:

- **The first module in a column passes `:divided="false"`.** Its top edge is already the hero's
  `border-b`.
- **Modules never carry side borders.** They are edge-to-edge inside the column, which is why the
  column defaults to `padded: false` and each module owns its own padding.

---

## The three-layer skeleton

```vue
<BannerContainer hero max-width="7xl">   <!-- 1. fluid hero band, full-bleed, owns border-b -->
  <template #background> … </template>
  <PageHeader size="hero" eyebrow="…" title="…" description="…" />
</BannerContainer>

<SectionContainer max-width="7xl">        <!-- 2. framed column, owns border-x -->
  <SectionModule :divided="false" title="…">…</SectionModule>   <!-- 3. bricks -->
  <SectionModule title="…">…</SectionModule>
  <SectionModule title="…" :padded="false">
    <CardGrid variant="divider" :columns="3">…</CardGrid>
  </SectionModule>
</SectionContainer>

<SiteFooter />                            <!-- owns border-t -->
```

Live: [`WebkitHub.vue:200-363`](../../apps/webkit-sample/src/hub/views/WebkitHub.vue#L200-L363),
[`DocsHome.vue:244-539`](../../apps/webkit-sample/src/site/docs/components/DocsHome.vue#L244-L539),
[`HubFoundations.vue:209-269`](../../apps/webkit-sample/src/hub/components/HubFoundations.vue#L209-L269).

---

## 1. The hero rule — `BannerContainer`

[`BannerContainer.vue`](../../apps/webkit-sample/src/shared/ui/layout/BannerContainer.vue)

A **full-bleed** band. Its bottom hairline runs the entire viewport width; the framed column hangs
below it. That contrast — one edge-to-edge rule above a narrower framed column — is what makes the
frame read as *drawn on* the page rather than as a card sitting on it.

```html
<section class="relative w-full overflow-hidden border-b border-[var(--border-default)]
                flex min-h-[calc(100dvh-var(--banner-offset,0px))] flex-col justify-center">
  <!-- #background: z-0 -->
  <div class="relative z-10 mx-auto w-full max-w-[…] px-[var(--spacing-xl)] py-[var(--spacing-xl)]">
    <!-- default slot: z-10 copy -->
  </div>
</section>
```

**`hero` fills exactly one screen.** It subtracts `--banner-offset` from `100dvh`, so a banner
mounted under fixed chrome still measures one viewport. The page passes the chrome height in:

```html
<!-- docs: top bar + page bar folded into one offset -->
class="[--banner-offset:calc(var(--bar-height,3.5rem)+var(--page-bar-height,3rem))]"
```

Unset ⇒ `0`, so a banner that owns the whole viewport needs nothing.
([`DocsGetStarted.vue:368`](../../apps/webkit-sample/src/site/docs/components/DocsGetStarted.vue#L368))

**`#background` is z-0, copy is z-10.** The heroes ship **no backdrop** — Site, Hub and Docs all
open on plain `--bg-canvas`, so the headline is the only thing in the band. When a page does dress
one, the recipe is layered bottom-up:

1. A texture at `opacity-60`…`opacity-80` — today only `MapBanner` (`banner="map"`), the one entry
   left in the banner registry.
2. A **radial mask** fading it at the edges: `mask-[radial-gradient(ellipse_at_center,black,transparent_75%)]`.
3. A **scrim** dimming it under the headline — e.g. a `bg-gradient-to-b … to-[var(--bg-canvas)]`
   fade handing the band off to the module below.

([`WebkitHub.vue:199-202`](../../apps/webkit-sample/src/hub/views/WebkitHub.vue#L199-L202),
[`AzionHome.vue:211-221`](../../apps/webkit-sample/src/site/components/AzionHome.vue#L211-L221))

**Hero copy anatomy** — left-aligned, always in this order
([`PageHeader.vue`](../../apps/webkit-sample/src/shared/ui/layout/PageHeader.vue)):

| Part | Style |
| --- | --- |
| Eyebrow | `Overline` (uppercase, tracking baked in) — or an orange dot + `text-overline-sm` on the Site |
| Headline | `text-heading-2xl`, `text-balance`, capped at `--container-4xl` |
| Description | `text-body-lg`, `text-pretty`, capped at `--container-2xl` |
| Actions | Primary `Button` + secondary, or a `ContrastBanner` copy-prompt pill |

The Site hero closes with a **capability strip** — a 2/3/5-column grid separated from the copy by
`border-t border-[var(--border-muted)]`, bold lead-in plus one supporting line per cell.
([`AzionHome.vue:251-260`](../../apps/webkit-sample/src/site/components/AzionHome.vue#L251-L260))

---

## 2. The container rule — `SectionContainer`

[`SectionContainer.vue`](../../apps/webkit-sample/src/shared/ui/layout/SectionContainer.vue)

The framed column. Centered, capped, and carrying **only** `border-x`.

```html
<div class="mx-auto w-full max-w-[var(--container-7xl)] border-x border-[var(--border-default)]">
```

- **`padded` defaults to `false`.** An edge-to-edge stack of modules each own their padding; adding
  column padding would double it and pull the modules off the frame. Pass `padded` only for a plain
  prose column with no modules.
- **`bordered`** can be turned off for a column that sits inside another frame.

---

## 3. The module rule — `SectionModule`

[`SectionModule.vue`](../../apps/webkit-sample/src/shared/ui/layout/SectionModule.vue)

The "lego brick". A `<section>` with a header row divided from its body by a hairline, and divided
from the module above by a hairline. Stacked in a `SectionContainer`, the modules read as bricks in
one continuous frame.

```html
<section class="w-full border-t border-[var(--border-default)]">   <!-- divided -->
  <header class="border-b border-[var(--border-default)] p-[var(--spacing-xl)]">…</header>
  <div class="p-[var(--spacing-xl)]">…</div>                        <!-- padded -->
</section>
```

| Prop | When to change it |
| --- | --- |
| `divided` | `false` on the **first** module in a column — its top edge is the hero's `border-b`. |
| `padded` | `false` when the body is an edge-to-edge `CardGrid`, so the grid's rules meet the frame with no gutter. |
| `#header` | Replaces the default title row entirely. |
| `#actions` | Trailing CTAs inside the default header row. |

---

## 4. The hairline box grid — `CardGrid variant="divider"`

[`CardGrid.vue`](../../apps/webkit-sample/src/shared/ui/layout/CardGrid.vue)

The signature industrial module: a grid whose internal rules are **gaps**, not borders.

```html
<div class="grid gap-px bg-[var(--border-default)] sm:grid-cols-2 lg:grid-cols-3">
  <!-- each child MUST fill its own background, or the gap trick shows through -->
  <div class="bg-[var(--bg-canvas)] …">…</div>
</div>
```

`gap-px` lets the wrapper's background colour show through as 1px internal rules. **Children must
fill their own background** (`bg-[var(--bg-canvas)]`) or the whole cell goes border-coloured.

The divider variant carries **no perimeter border** — that is what lets it sit flush inside a
`SectionContainer` whose `border-x` already owns the outer edges. Set `dividerColor="muted"` for
rules one step back.

The `gap` variant is the other mode: self-contained cards with their own border, radius and
background, separated by real gutters.

**Cells are square.** `ComponentGridCell` uses `rounded-[var(--shape-flat)]` — the interactive
component showcase grid is deliberately unrounded, with a dashed `--primary` ring and a corner label
pinned at `top-0 left-0` on hover/focus-within.
([`ComponentGridCell.vue:33-49`](../../apps/webkit-sample/src/hub/components/ComponentGridCell.vue#L33-L49))

---

## 5. The registration frame — `FrameBox`

[`FrameBox.vue`](../../apps/webkit-sample/src/shared/ui/layout/FrameBox.vue)

The most literal piece of the industrial language: a thin bordered box with **crosshair registration
marks** straddling each corner, plus an optional vertical hatch texture. Used for the final CTA
block.

- **Marks** (`marks`, default `true`) — an 11px crosshair per corner, centered *on* the corner with a
  half-size translate so it straddles the border line. Two 1px spans in `--border-default`.
- **Hatch** (`hatch`, default `false`) — vertical rules every `--spacing-lg`, drawn as a
  `repeating-linear-gradient` in `--border-muted` at `opacity-40`, faded at the edges with
  `mask-[radial-gradient(ellipse_at_center,black,transparent_85%)]`.

```html
<div class="relative border border-[var(--border-muted)]">
  <div class="pointer-events-none absolute inset-0 opacity-40
              [background-image:repeating-linear-gradient(to_right,var(--border-muted)_0,var(--border-muted)_1px,transparent_1px,transparent_var(--spacing-lg))]
              mask-[radial-gradient(ellipse_at_center,black,transparent_85%)]" />
  <!-- 4× corner crosshairs, z-20 -->
  <div class="relative z-10"><slot /></div>
</div>
```

---

## Vocabulary

The token layer everything above resolves to.

### Weights

| Token | Value | Role |
| --- | --- | --- |
| `--border-width-default` (= `--border-1`) | `0.8px` | Component-level hairline (opt-in, see [drift](#known-issues)). |
| `--border-2` | `2px` | Accent bar — painted as a **filled element**, never a border. |

The page layer uses the bare `border` / `border-x` / `border-t` utilities throughout, which is
Tailwind's **1px**.

### Colors

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--border-default` | `#00000014` | `#FFFFFF1A` | The frame: hero rule, column rules, module dividers, grid gaps. |
| `--border-muted` | `#00000014` | `#FFFFFF0D` | One step back: rules *inside* a module, capability strips, `FrameBox` perimeter + hatch. |
| `--border-strong` | `#000000` | `#FFFFFF` | Pressed / active edge. |
| `--border-selected` | `#F3652B` | `#F3652B` | Selection (Azion orange, both modes). |

> **`default` and `muted` are identical in light mode** (`#00000014`); only dark mode separates them.
> Pick by role and verify in dark — light mode cannot show you the mistake.

### Radii

`--shape-flat` `0` (grid cells, bands) · `--shape-elements` `6px` (inputs, chips) ·
`--shape-button` `6px` · `--shape-card` `8px` — **the ceiling**. Nothing structural is pill-shaped.

### Column widths

Both containers key into [`container.js`](../../packages/theme/src/tokens/primitives/shape/container.js)
— a geometric scale anchored at `3xs` 256px and `7xl` 1620px, every neighbour ~+16.6% apart.

---

## Rules of the language

- **One edge between two things.** Give it to one side; the other draws nothing.
- **First module in a column: `:divided="false"`.**
- **Module body `:padded="false"` when it holds an edge-to-edge grid.**
- **`variant="divider"` children must fill their own background.**
- **Heroes are full-bleed; columns are capped.** Never put `border-x` on a hero or `border-b` on a
  column.
- **No shadow anywhere in this language.** Shadows mean *floating* — overlays, popovers, drawers.
- **No radius above `--shape-card` (8px); grid cells are `--shape-flat`.**
- **Texture is masked, never raw.** Every ASCII field / hatch carries a radial mask and an opacity
  below 1, so it never competes with copy.
- **`motion-reduce:` on every transition.** `ComponentGridCell` does this in its scoped block; inline
  utilities use `motion-reduce:transition-none`.

---

## Known issues

Found while documenting; **not fixed** — each changes rendered output.

1. **`FrameBox` is used but never imported** —
   [`AzionHome.vue:550`](../../apps/webkit-sample/src/site/components/AzionHome.vue#L550) wraps the
   final CTA in `<FrameBox hatch>`, but the script block imports only `Button`, `CardBox`,
   `CardPricing`, `CodeBlock`, `PlatformIllustrations`, `PlatformShowcase`, and
   `main.js` registers nothing globally. The route is live (`/site/home` → `LandingAzion` →
   `AzionHome`), so Vue logs *"Failed to resolve component: FrameBox"* and the CTA renders with **no
   frame, no crosshairs, no hatch**. One-line fix:
   `import FrameBox from './foundations/components/layout/FrameBox.vue'`.

2. **`maxWidth` keys don't mean the same width in the two containers.** `BannerContainer`'s map is
   shifted two steps down from `SectionContainer`'s — `max-width="7xl"` gives `--container-5xl`
   (1192px) in the banner but `--container-7xl` (1620px) in the column; `"6xl"` gives 1024px vs
   1388px. `SectionContainer`'s docstring says *"match the banner above it"*, which reads as "pass
   the same key" — and passing the same key does **not** align their content edges. (The banner also
   adds `px-[var(--spacing-xl)]`, so some inset is intended; the two-step shift is systematic across
   all five keys.)

3. **Two hairline weights coexist.** The page layer uses bare `border` (1px); 39 webkit components
   request `border-[length:var(--border-width-default)]` (0.8px). The theme sets no
   `--default-border-width`, so the token is opt-in and the two sit side by side on the same screen.

4. **`PageHeader` mixes raw values into a token system** — `mb-12`, `mb-3`, `mt-4`, `mt-6`, and
   `max-w-[620px]` instead of spacing/container tokens.

Items 2–4 need a visual-baseline regen; item 1 does not.
