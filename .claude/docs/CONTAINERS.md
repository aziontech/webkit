# Containers — page structure and the framed grid

Two registers share one container system:

- **The console page.** A centred column at a measure, inset by a boundary, holding a heading and
  one parent section. Spacing does the separating; nothing is ruled. The reference is the console
  home — [`console/pages/home/`](../../apps/webkit-sample/src/console/pages/home/).
- **The framed grid.** The Site, Hub and Docs register: a full-bleed hero band, then one centred
  column framed by vertical rules, holding bands divided by hairlines, textured gaps and ticked
  corners. Nothing floats, nothing is rounded, and **no line is ever drawn twice**. The reference
  is the Site — [`site/components/`](../../apps/webkit-sample/src/site/components/).

Both read the same tokens: the layout group in
[`semantic/layouts.data.js`](../../packages/theme/src/tokens/semantic/layouts.data.js) (boundary,
rhythm, measure) and the container ladder in
[`container.js`](../../packages/theme/src/tokens/primitives/shape/container.js). The framed-grid
primitives ship in `@aziontech/webkit`: `FrameBox`, `SectionGap`, `SectionContainer`,
`SectionModule`, `SectionTitle`, `Hero`, `CardGrid`, `BandStack`, `TextureMaterial`.

---

## Building a Site page

### Picture the containers first

Before writing markup, draw the page as nested boxes. Every Site page is this one shape: the
shell, one full-width hero, one framed column, and bands stacked inside it. Whether you use
`nav-overlay` changes only where the nav sits.

```text
SiteLayout ─────────────────────────────────────────────── h-dvh, owns the scroll
│ SiteNav (sticky, 3.5rem)            ← one rung wider than the frame (7xl)
│ <main>
│ ┌─ Hero ───────────────────────────────────────────── full-bleed ─┐
│ │   texture (dots, faded)                                         │
│ │        ┌─ inner column, max-width="site" ─┐                     │
│ │        │  Hero.Title  eyebrow / h1 / …    │                     │
│ │        └──────────────────────────────────┘                     │
│ └═════════════════════════════════════════════════ border-b ══════┘
│          ║ SectionContainer max-width="site"  (border-x) ║
│          ║┌ SectionModule ─────────────────────────────┐ ║
│          ║│ SectionTitle   (framed)            ▪     ▪ │ ║
│          ║╞═══════════════════════════════ bottom rule ╡ ║
│          ║│ FrameBox flush borders="y" marks="all"     │ ║
│          ║│   CardGrid kind="frame" → Cell│Cell│Cell   │ ║
│          ║╞═══════════════════════════════ bottom rule ╡ ║
│          ║│ SectionGap hatch   ││││││││││││││││││││││  │ ║
│          ║╞═══════════════════════════════ bottom rule ╡ ║
│          ║│ next module … (top edge = the gap's rule)  │ ║
│          ║╞════════════════════════════════════════════╡ ║
│          ║│ closing texture band (no rules, 4 marks)   │ ║
│ SiteFooter ═════════════════════════════════════ border-t ═══════
```

Read it as an ownership map. The `═` rules are each drawn **once**, always by the box **above**
them. The `║` rules belong to the column alone. The `▪` marks are the corner squares (§ 6).

### The files a page is

| File | Holds |
| --- | --- |
| `site/views/Landing<Name>.vue` | The routed view: `SiteLayout` around one content component, nothing else |
| `site/components/Azion<Name>.vue` | The page itself: `Hero` + `SectionContainer` + bands |
| `site/components/<Band>.vue` | Any band reused on more than one page (`WhyAzion`, `MarketLeader`, `ClientStories`) |
| `site/data/<name>.js` | Lists the page iterates over: cards, stats, quotes, links |
| `router/site.routes.js` | `{ path: '/site/<slug>', name: 'site-<slug>', component: Landing<Name> }` |

```vue
<!-- site/views/LandingCache.vue -->
<script setup>
  import AzionCache from '../components/AzionCache.vue'
  import SiteLayout from '../components/SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionCache />
  </SiteLayout>
</template>
```

`SiteLayout` supplies the nav, the `<main>`, the footer, the scroll region and the forced dark
theme. A page never renders its own nav or footer.

Import every primitive from its flat public path, using a PascalCase binding:

```js
import Button from '@aziontech/webkit/button'
import CardGrid from '@aziontech/webkit/card-grid'
import FrameBox from '@aziontech/webkit/frame-box'
import Hero from '@aziontech/webkit/hero'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'
import TextureMaterial from '@aziontech/webkit/texture-material'
```

### Step 1 — the hero

```vue
<Hero kind="screen" max-width="site" texture="dots" texture-fade="bottom" offset="3.5rem">
  <Hero.Title centered eyebrow="Cache" title="Accelerate content delivery globally" description="…">
    <template #actions>
      <Button label="Start Free" kind="secondary" size="large" />
      <Button label="Talk to a Specialist" kind="outlined" size="large" icon="pi pi-chevron-right" icon-position="trailing" />
    </template>
  </Hero.Title>
</Hero>
```

Renders (classes abridged):

```html
<section data-testid="marketing-hero" data-kind="screen" data-width="site" data-bordered
         class="relative isolate w-full overflow-clip bg-(--bg-canvas) border-b border-(--border-default)
                flex flex-col min-h-[calc(100dvh-var(--banner-offset,0rem))]"
         style="--banner-offset: 3.5rem">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0 …">      <!-- backdrop, z-0 -->
    <div data-kind="dots" data-fade="bottom" class="absolute inset-0 …"></div>   <!-- TextureMaterial -->
  </div>
  <div class="relative mx-auto w-full max-w-(--layout-measure-site) px-(--layout-boundary-inline)
              py-(--spacing-xxl) flex flex-1 flex-col justify-center">          <!-- copy, z-10 -->
    <!-- Hero.Title: eyebrow, <h1>, description, actions -->
  </div>
</section>
```

- `offset="3.5rem"` is the sticky nav's height. Leave it out only with
  `<SiteLayout nav-overlay>`, where the nav floats over the hero (the home page does this).
- The `h1` lives here and nowhere else on the page.

### Step 2 — the column

```vue
<SectionContainer max-width="site">
  <!-- every band, in reading order -->
</SectionContainer>
```

```html
<div data-testid="marketing-section-container" data-width="site" data-bordered
     class="mx-auto w-full layout-column-site border-x border-(--border-default)">
  …
</div>
```

There is exactly one per page, and it holds everything below the hero. `layout-column-site`
caps the column at 1388px and keeps it one boundary in from the window on a phone, so the `║`
rules never sit on the screen edge.

### Step 3 — a band: header + framed body

```vue
<SectionModule :divided="false" :padded="false">
  <template #header>
    <SectionTitle eyebrow="Why Azion" title="From commit to observability, on one platform" description="…" />
  </template>

  <FrameBox flush borders="y" marks="all">
    <!-- the body: a grid, a split, a map, a quote -->
  </FrameBox>
</SectionModule>
```

```html
<section data-testid="marketing-section-module" data-kind="left" class="w-full">   <!-- no border-t -->
  <div data-testid="layout-frame-box" data-borders="bottom" data-flush="top"
       data-marks="top-left top-right bottom-left bottom-right"
       class="relative border-(--border-default) border-b">                       <!-- SectionTitle frame -->
    <span aria-hidden="true" class="absolute z-20 m-1 size-1.5 bg-(--border-default) left-0 top-0"></span>
    <!-- …three more corner squares… -->
    <div class="relative z-10 h-full">
      <div class="px-(--spacing-xl) py-(--spacing-xxl) …"><!-- eyebrow, h2, description --></div>
    </div>
  </div>
  <div>                                                                              <!-- body, unpadded -->
    <div data-testid="layout-frame-box" data-borders="bottom" data-flush="top"
         data-marks="top-left top-right bottom-left bottom-right"
         class="relative border-(--border-default) border-b">
      <span …></span> ×4
      <div class="relative z-10 h-full"><!-- your body --></div>
    </div>
  </div>
</section>
```

Check the `data-*` attributes to confirm the frame. Every band shows `data-borders="bottom"`,
because `borders="y"` minus `flush` (top) leaves only the bottom. If you see `top` in
`data-borders`, a rule is doubled.

### Step 4 — the gap between bands

```vue
<SectionGap hatch />
```

```html
<div data-testid="marketing-section-gap" data-size="medium" data-hatch="true"
     data-borders="bottom" data-flush="top" data-marks="top-left top-right bottom-left bottom-right"
     class="relative border-(--border-default) border-b h-[calc(var(--spacing-xxl)*2)]">
  <span …></span> ×4
  <div class="relative z-10 h-full">
    <div data-testid="marketing-section-gap__hatch" data-kind="lines" class="absolute inset-0 …"></div>
  </div>
</div>
```

One gap goes between every two bands. The band right after a gap starts its frame with
`marks="bottom"`, because the gap has already marked that junction.

### Step 5 — close the column

The last band is followed by a texture band, not a gap. It draws no rules (the band above owns
its top edge and the footer owns its bottom), but it keeps all four corner squares:

```vue
<FrameBox borders="none" marks="all" data-hatch="true" class="h-[calc(var(--spacing-xxl)*2)]">
  <TextureMaterial kind="lines" />
</FrameBox>
```

After that comes `SiteFooter` from `SiteLayout`, which draws the page's last rule with
`border-t`.

### Band recipes

Each recipe is a `SectionModule :divided="false" :padded="false"` with one of these as its body:

| Band | Body |
| --- | --- |
| Heading only | `#header` → `SectionTitle` (`kind="centered"`, or `"horizontal"` for heading \| description) |
| Feature grid | `FrameBox flush borders="y" marks="all"` → `CardGrid flush kind="frame" :columns="3\|4"` → `CardGrid.Cell` |
| Link / product grid | `CardGrid kind="divider"` → `NavColumn` + `NavItem` (from the sample's `site/ui/index.js`), cells filling `bg-(--bg-canvas)` |
| Stats row | `gap-px` grid on `bg-(--border-default)` → `FrameBox borders="none" marks="none"` cells |
| Copy beside art / code | `FrameBox flush borders="y" marks="all"` → `grid md:grid-cols-2` (art from a banner, `Illustration`, or `CodeBlock`) |
| Copy over a map | `FrameBox … class="relative overflow-hidden"` → `NetworkMap` behind, copy `relative` above, `CardGrid flush kind="frame"` under a `border-t` |
| Proof / testimonials | `QuoteTabs` in `FrameBox flush borders="y" marks="all"` |
| Sticky run of bands | `BandStack sticky` |
| Closing CTA | `CallToAction framed kind="split"` (it draws its own frame, so don't wrap it), with `id="contact"` on the module |

A band used on more than one page becomes its own component in `site/components/`, with the
`SectionModule` as its root. The page then places it between two `SectionGap`s like any other
band.

### The whole page

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGrid from '@aziontech/webkit/card-grid'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import TextureMaterial from '@aziontech/webkit/texture-material'

  import { FEATURES } from '../data/cache.js'
</script>

<template>
  <Hero kind="screen" max-width="site" texture="dots" texture-fade="bottom" offset="3.5rem">
    <Hero.Title centered eyebrow="Cache" title="Accelerate content delivery globally" description="…">
      <template #actions>
        <Button label="Start Free" kind="secondary" size="large" />
      </template>
    </Hero.Title>
  </Hero>

  <SectionContainer max-width="site">
    <SectionModule :divided="false" :padded="false">
      <template #header>
        <SectionTitle title="Why teams cache on Azion" />
      </template>
      <FrameBox flush borders="y" marks="all">
        <CardGrid flush kind="frame" :columns="3">
          <CardGrid.Cell v-for="feature in FEATURES" :key="feature.key" kind="canvas">
            <h3 class="text-heading-xs text-(--text-default)">{{ feature.title }}</h3>
            <p class="text-body-sm text-(--text-muted)">{{ feature.description }}</p>
          </CardGrid.Cell>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <SectionModule id="contact" :divided="false" :padded="false" class="scroll-mt-(--spacing-xxl)">
      <CallToAction framed kind="split" title="Build, run, and protect applications." description="…">
        <template #actions>
          <Button label="Start Free" kind="secondary" size="large" />
        </template>
      </CallToAction>
    </SectionModule>

    <FrameBox borders="none" marks="all" data-hatch="true" class="h-[calc(var(--spacing-xxl)*2)]">
      <TextureMaterial kind="lines" />
    </FrameBox>
  </SectionContainer>
</template>
```

`../data/cache.js` is the page's own data file. You create it alongside the page: it exports
`FEATURES` as `{ key, title, description }` entries.

### Done when

- One `Hero` and one `SectionContainer`, both `max-width="site"`. The page has one `h1`.
- Every `SectionModule` has `:divided="false"`, and a `SectionGap hatch` sits between every pair
  of them.
- In the rendered DOM, no band's `data-borders` contains `top`, `left` or `right`.
- The band after each gap has `marks="bottom"`. Every other framed band or cell has `marks="all"`.
- The column ends on the texture band, and no page-level `border-*` touches the footer.
- Every string and list comes from props or `site/data/`, and no band hard-codes a colour or length.
- At 375, 768, 1440 and 1920px the hero copy and the first band start on the same vertical line,
  and the `║` rules never sit on the window edge.

---

## 1. Page structure rules

### The console page shape

Every console page is the same three levels. The console home, populated
([`Home.vue`](../../apps/webkit-sample/src/console/pages/home/Home.vue)):

```html
<div class="layout-column layout-boundary relative flex min-h-full flex-col">  <!-- 1. column + boundary -->
  <header class="flex items-center">
    <h1 class="text-heading-sm text-(--text-muted)">Good morning, <span class="text-(--text-default)">Gab</span></h1>
  </header>

  <main class="layout-section-start flex flex-col gap-(--layout-boundary-start)">  <!-- 2. the ONE parent -->
    <aside aria-label="Usage" class="flex flex-col gap-(--layout-group-gap) xl:flex-row xl:gap-(--layout-section-gap)">…</aside>
    <section aria-label="Resources" class="grid gap-(--layout-group-gap) xl:grid-cols-5 xl:gap-(--layout-section-gap)">…</section>
  </main>                                                                          <!-- 3. sections inside -->
</div>
```

| Level | Owns | Utility / token |
| --- | --- | --- |
| Column | The measure — how wide the page may get | `layout-column` (`--layout-measure`, `7xl` 1620px) |
| Boundary | Content ↔ app chrome inset | `layout-boundary` (`--layout-boundary-inline` / `-start` / `-end`, all `--spacing-lg`) |
| Heading → parent | The space under the heading | `layout-section-start` (margin = `--layout-boundary-start`) |
| Parent → its sections | The space between sections | `gap-(--layout-section-gap)` (`--spacing-xl`) |
| Section → its parts | Title over card, controls over table | `gap-(--layout-group-gap)` (`--spacing-md`) |

Rules:

- **The page stack carries no `gap`.** It holds the heading and exactly **one** element below it,
  and that element carries `layout-section-start`. Heading and parent are different kinds of thing;
  only inside the parent is every child a section.
- **Exactly one `layout-section-start` per page stack.** Never on a section inside the parent — in a
  flex column `gap` and `margin` add, and that section lands at twice the step. `:first-child`
  zeroes it, so it is safe to carry when the band above is a `v-if`.
- **The boundary is padding, never margin.** A top margin on an `h-full` child of a padded scroll
  box overflows by exactly the margin and clips the bottom of a table.
- **Who carries the boundary.** `AppLayout` pads its scroll box by default (`padded: true`) — the
  page then takes `layout-column` alone ([`Dashboard.vue`](../../apps/webkit-sample/src/console/pages/home/Dashboard.vue)).
  A page that needs its own inset (a full-height layout, a drop zone keyed to the inset) passes
  `:padded="false"` to `AppLayout` and carries `layout-column layout-boundary` itself — the home
  does. The column widens by the inset it now contains, so both shapes land on the same content
  width and a page can switch between them without moving a pixel.
- **One measure per page, in every state.** Home's empty state
  ([`HomeEmptyState.vue`](../../apps/webkit-sample/src/console/pages/home/HomeEmptyState.vue)) and
  its populated state both take `layout-column`. A page that changes width when the account gains
  its first resource reads as two pages.
- **Sections are named landmarks.** `<main>` for the parent, `<section>` / `<aside>` with an
  `aria-label` for each section, one `h1` per page, `h2` per panel.
- **Rows switch to columns at `xl`, and the section step grows with them.** Stacked, parts sit at
  `--layout-group-gap`; side by side at `xl` they separate at `--layout-section-gap`.

### Measures

Pick the column by **payload**, never by URL. The ladder snaps; a page never bends it.

| Utility | Token | Width | Payload |
| --- | --- | --- | --- |
| `layout-column` | `--layout-measure` | `7xl` 1620px | Data: home, overviews, lists, dashboards — **the standard page container** |
| `layout-column-focused` | `--layout-measure-focused` | `4xl` 1024px | One task with a multi-column payload |
| `layout-column-form` | `--layout-measure-form` | `4xl` 1024px | Settings, in-page edit forms |
| `layout-form-create` | `--layout-measure-form-create` | `5xl` 1192px | Create flows (also widens `--layout-measure-control`) |
| `layout-column-content` | `--layout-measure-content` | `3xl` 876px | Prose read line by line (docs, blog) |
| `layout-column-site` | `--layout-measure-site` | `6xl` 1388px | The marketing frame (see § 2) |

Full-bleed is the absence of all of these, not a `w-full`.

### Arrival

A page that loads content arrives in two beats, with no layout shift between them:

1. **A wire** in the exact geometry of the loaded page — same grid, same gaps, `Skeleton` in every
   slot ([`HomeWire.vue`](../../apps/webkit-sample/src/console/components/home/HomeWire.vue),
   [`HomeFirstUseWire.vue`](../../apps/webkit-sample/src/console/components/home/HomeFirstUseWire.vue)).
   It is `aria-hidden`; the wire is chrome, not content.
2. **The content**, each section on `animate-content-enter motion-reduce:animate-none`, later
   sections staggered with `[--content-enter-delay:var(--transition-duration-fast-01)]`.

A wire that drifts from the real layout is a jump on arrival — change both in the same edit.

### The framed page shape

The Site, Hub and Docs stack three layers, and only these three: `Hero` → `SectionContainer` →
bands. The full walkthrough, from route to rendered HTML, is
[§ Building a Site page](#building-a-site-page).

---

## 2. No double border — the one-frame principle

Every edge is owned by exactly **one** element; the neighbour on the other side draws nothing. A
doubled hairline is the one unmistakable failure of this language.

**In the framed grid, an edge belongs to the band ABOVE it.** Every band draws its own **bottom**
rule and passes `flush` to drop its top, because the band above (or the hero) already drew it.

| Edge | Owned by | How |
| --- | --- | --- |
| Top of the page body | `Hero` | `border-b` (full-bleed; `bordered`, default on) |
| Left + right of the whole column | `SectionContainer` | `border-x` (`bordered`, default on) |
| Rule under a band | That band | `FrameBox flush borders="y"` → bottom only |
| Rule under a section header | `SectionTitle` (framed, default) | `FrameBox flush borders="y"` → bottom only |
| Rules of a `SectionGap` | The gap | `flush borders="y"` → bottom only |
| Left / right edge of any band | *Nobody* — it is the column's `border-x` | `borders="y"`, never `all` |
| Seams of a `divider` grid | The grid's `gap-px` showing its own background | cells `borders="none"` |
| Seams of a `frame` grid | Each `CardGrid.Cell` (its right + bottom) | cell `flush={['top','left']}`; grid `flush` |
| Bottom of the page | `SiteFooter` | `border-t` |

The console has no column rules; its one-owner case is a **cell grid inside a card**. The home's
usage strip puts four metric cells in an unpadded `CardBox`: the card owns the perimeter, and each
cell draws only the rule on its **leading** side, so a seam exists only where a neighbour does:

```html
<CardBox :padded="false">
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
    <div class="border-(--border-default)
                max-sm:nth-[n+2]:border-t
                sm:max-xl:[&:nth-child(n+3)]:border-t
                sm:[&:nth-child(even)]:border-l
                xl:[&:nth-child(n+2)]:border-l">…</div>
  </div>
</CardBox>
```

Re-derive the selectors per breakpoint whenever the column count changes — a `border-l` on the
first cell of a row doubles the card's own edge.

Consequences to remember:

- **The first module in a column passes `:divided="false"`** — its top edge is the hero's
  `border-b`. On the Site **every** module passes it: bands are separated by `SectionGap`, never by
  `SectionModule`'s `border-t`.
- **Bands never carry side rules.** They run edge to edge inside the column, which is why
  `SectionContainer` defaults to `padded: false` and each band owns its padding.
- **A component that frames itself is a band.** `SectionTitle` (framed by default) and
  `CallToAction framed` render `FrameBox flush borders="y" marks="all"` — never wrap them in another
  frame. Pass `:framed="false"` when a band composes the title inside its own frame.
- **The border colours are opaque**, so two rules on one pixel do not composite into a visibly
  brighter line — which is exactly why a double border is easy to miss. Check by DOM, not by eye.

---

## 3. Hero rules — `Hero`

[`hero.vue`](../../packages/webkit/src/components/marketing/hero/hero.vue) ·
[`hero-title.vue`](../../packages/webkit/src/components/marketing/hero/hero-title/hero-title.vue)

A **full-bleed** band. Its bottom hairline runs the whole viewport; the framed column hangs below
it. One edge-to-edge rule above a narrower framed column is what makes the frame read as drawn on
the page rather than as a card sitting on it.

- **Full-bleed band, capped column.** The `<section>` is `w-full`; its inner column is capped by
  `max-width` and inset by `--layout-boundary-inline`. Never put `border-x` on a hero or `border-b`
  on a column.
- **`max-width` matches the column below.** On the Site that is `site` for both `Hero` and
  `SectionContainer`, so the hero copy and the first band start on the same vertical. Both map the
  same keys to the same `--container-*` rung.
- **`kind="screen"` fills one viewport** — `min-h-[calc(100dvh-var(--banner-offset,0rem))]`. Pass the
  height of the fixed chrome above it in `offset`; unset is `0`. `align` places the copy
  (`top` / `center` / `bottom`). `kind="band"` (default) is content height.
- **Rhythm is the band's own.** `padded` applies `py-(--spacing-xxl)` (`size="medium"`) or twice that
  (`size="large"`, the opening a page leads with). The inline inset is always on.
- **Copy is `Hero.Title`, in this order:** eyebrow (with an optional `//` prefix) → headline (the
  page's single `h1`; `highlight` paints its opening phrase in the accent) → description →
  `#actions`. `centered` centres the whole block. One primary action (`secondary` kind on the Site)
  plus one `outlined`.
- **Layers, bottom to top:** texture / `#background` (z-0) → `#top` window (z-1) → copy (z-10) →
  `#bottom` window + `floorTexture` + `carousel` brand strip standing on the floor (z-1). Every
  layer is `aria-hidden` except the copy and the strip.
- **`#media` sets art beside the copy** from `md` up; `media-align="end"` runs it past the inset to
  the container edge.
- **Texture comes from the `texture` prop, not a hand-rolled backdrop.** The Site opens on
  `texture="dots"` with `texture-fade="top"` or `"bottom"`; a page that needs a lattice uses
  `"grid"`. The `#background` slot is the escape hatch for one-off art (a map, an illustration) and
  stands beside the texture.
- **Heavier art is masked and dimmed.** Artwork in `#background` sits below full opacity, fades at
  the edges with a radial or linear mask, and never competes with the headline.

The console has **no hero**. A console page opens on its heading — the home's greeting `h1`
(`text-heading-sm`, muted greeting, default-ink name), or the first-use state's centred
`text-heading-lg` statement.

---

## 4. Section rules

### `SectionContainer` — the column

[`section-container.vue`](../../packages/webkit/src/components/marketing/section-container/section-container.vue)

Centred, capped, carrying **only** `border-x`.

- **`max-width="site"`** resolves to `layout-column-site`: capped at `--layout-measure-site`
  (1388px) on a wide screen, and one boundary in from each window edge below that cap — one
  `min()`, no breakpoint. The frame never lands on the bezel.
- **`padded` defaults to `false`.** Bands own their padding; column padding would double it and
  pull grid rules off the frame. Pass `padded` only for a plain prose column with no bands.
- **`bordered`** turns the rules off for a column that sits inside another frame.

### `SectionModule` — the band

[`section-module.vue`](../../packages/webkit/src/components/marketing/section-module/section-module.vue)

A `<section>` holding an optional header and a body.

| Prop / slot | Framed-grid use |
| --- | --- |
| `divided` | `false` — the band above, or the hero, owns the top edge. |
| `padded` | `false` when the body is a `FrameBox`, a grid, or a framed component that pads itself. |
| `#header` | A `SectionTitle` (framed by default — it draws its own bottom rule and ticks). |
| `title` / `eyebrow` / `description` / `kind` | The default header — a `SectionTitle` built from props. |
| `#actions` | Trailing controls in the default header row. |

### The band body

Under a header, the body is a frame with no top and no sides:

```vue
<FrameBox flush borders="y" marks="all">…</FrameBox>    <!-- under a SectionTitle -->
<FrameBox flush borders="y" marks="bottom">…</FrameBox> <!-- directly under a SectionGap -->
```

Padding inside a band is `--spacing-xl` (`--spacing-xxl` for a tall feature band); a section header
pads `px-(--spacing-xl) py-(--spacing-xxl)`.

### `BandStack` — a run of bands

[`band-stack.vue`](../../packages/webkit/src/components/marketing/band-stack/band-stack.vue)

Wraps each direct child in `FrameBox borders="y" marks="none"`, pulled up `-mt-px` so neighbours
share one rule. `flush` drops the first band's top (it sits under a rule already drawn); `sticky`
pins each band under the site header from `lg` up, one `--spacing-md` lower than the last, so the
run piles up on scroll. Use it instead of hand-stacking frames.

### Console sections

A console section is unframed: a title (`text-heading-xs`, or `text-label-sm` for a panel), then
its card or list, `gap-(--layout-group-gap)` apart. Cards (`CardBox`) carry their own border and
radius; the page around them draws nothing. A list panel inside a section scrolls on its own at
`xl` (`xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:overscroll-contain`) so the page fits one screen.

---

## 5. Section gap texture rules — `SectionGap`

[`section-gap.vue`](../../packages/webkit/src/components/marketing/section-gap/section-gap.vue) ·
[`texture-material.vue`](../../packages/webkit/src/components/marketing/texture-material/texture-material.vue)

A band with **no copy** that holds the vertical air between two bands. It is
`FrameBox flush borders="y" marks="all"` — bottom rule only, all four corners ticked.

```vue
<SectionGap hatch />                 <!-- medium, ruled -->
<SectionGap size="large" hatch />
```

- **Between every band, and only between bands.** On the Site a gap follows every module except the
  last; the column never stacks two modules rule to rule.
- **`hatch` is on.** It paints `TextureMaterial kind="lines"`: fine vertical rules at an 8px pitch in
  a 6% mix of `--text-default`. Every Site gap is `<SectionGap hatch />`.
- **The gap's hatch is unmasked.** One solid ink edge to edge — the gap is the one band with no copy
  to protect, so the field must never read as a fill that fades.
- **Height is a multiple of the largest spacing step, never a literal.** `small` = 1×, `medium`
  (default) = 2×, `large` = 3× `--spacing-xxl` (32 / 64 / 96px on a phone, 96 / 192 / 288px wide).
- **The band directly below a gap takes `marks="bottom"`** — the gap already ticked that junction.
- **The column closes on a texture band.** After the last module, before the footer: a frame with
  no rules (the module above owns the top, the footer owns the bottom) and all four ticks.

  ```vue
  <FrameBox borders="none" marks="all" data-hatch="true" class="h-[calc(var(--spacing-xxl)*2)]">
    <TextureMaterial kind="lines" />
  </FrameBox>
  ```

### Texture kinds

| `TextureMaterial` kind | Where | Ink |
| --- | --- | --- |
| `lines` | `SectionGap`, the closing band | 6% `--text-default`, unmasked |
| `dots` | Site heroes | 30% `--text-default`, faded `top` / `bottom` |
| `grid` | Lattice heroes | 22% `--text-default` |
| `dither`, `pixelate` | Feature art | — |

- **Texture outside a gap is faded.** Every texture behind copy takes a `fade` (`top`, `bottom`,
  `left`, `right`, `edges`, `vignette`) so it never competes with the text. The gap is the only
  unmasked texture.
- **Prefer `TextureMaterial` over `FrameBox hatch`.** `FrameBox`'s own `hatch` is a radially masked
  `--spacing-lg` pitch kept for compatibility; a ruled ground composes `kind="lines"`.

---

## 6. FrameBox cells — every node ticked

[`frame-box.vue`](../../packages/webkit/src/components/layout/frame-box/frame-box.vue)

The atom of the framed grid: a box that draws the rules it is told to, and a **node** — a 6px
filled square — inside each corner it is told to tick.

| Prop | Takes | Default | Meaning |
| --- | --- | --- | --- |
| `borders` | `all` · `none` · `x` · `y` · a side · a list | `all` | Rules this frame draws |
| `marks` | `all` · `none` · `top` · `bottom` · `left` · `right` · a corner · a list | `all` | Corners that get a node |
| `flush` | `true` (= `top`) · a side · a list | `false` | Sides a neighbour already draws — subtracted from `borders` |
| `hatch` | boolean | `false` | Legacy masked hatch (prefer `TextureMaterial`) |

**Node geometry.** `size-1.5` filled with `--border-default`, anchored to the corner and inset
`m-1` from both rules, `z-20`, `pointer-events-none`, `aria-hidden`. It sits **inside** the frame,
so it reads as a tick, not a second border, and it never covers content.

**The rule: a framed cell ticks all four of its nodes.** Every frame that stands as a cell renders
`marks="all"`:

| Cell | Frame it renders |
| --- | --- |
| `CardGrid.Cell` | `FrameBox :flush="['top','left']" marks="all"` |
| `SectionTitle` (framed) | `FrameBox flush borders="y" marks="all"` |
| `CallToAction framed` | `FrameBox flush borders="y" marks="all"` |
| `SectionGap` | `FrameBox flush borders="y" marks="all"` |
| A band under a header | `FrameBox flush borders="y" marks="all"` |
| The closing texture band | `FrameBox borders="none" marks="all"` |

Exceptions, each with a reason:

- **Under a `SectionGap`: `marks="bottom"`** — the gap's own nodes already mark that junction.
- **`BandStack` bands: `marks="none"`** — a sticky pile is read as one run, not as cells.
- **Cells in a `gap-px` grid: `borders="none" marks="none"`** — the seams are the gap; a node per
  cell would cluster four squares at every junction.

### Three grid registers — `CardGrid`

[`card-grid.vue`](../../packages/webkit/src/components/marketing/card-grid/card-grid.vue)

| `kind` | Seams drawn by | Nodes | Use |
| --- | --- | --- | --- |
| `frame` | Each `CardGrid.Cell` (right + bottom) | All four per cell | Feature / proof grids inside a band |
| `divider` | `gap-px` over `--border-default` (or `muted`) | None | Navigation / link grids, stat rows |
| `gap` | Nothing — self-contained cards with real gutters | None | Card lists outside the frame |

```vue
<!-- frame: every cell framed, every node ticked, laid onto the band's own rules -->
<CardGrid flush kind="frame" :columns="4" class="border-t border-(--border-default)">
  <CardGrid.Cell v-for="item in items" :key="item.key" kind="canvas">…</CardGrid.Cell>
</CardGrid>

<!-- divider: the seams are the gap, the cells fill their own ground -->
<CardGrid kind="divider" :columns="3">
  <FrameBox borders="none" marks="none" class="bg-(--bg-canvas)">…</FrameBox>
</CardGrid>
```

- **`frame` inside a frame passes `flush`.** The grid drops its own top and left rules and pulls its
  right and bottom `-1px` onto the surrounding frame's, so a framed column keeps one hairline per
  edge. Standalone, it draws its own top and left once a cell renders.
- **`CardGrid.Cell` fills its ground:** `kind="surface"` (default), `"canvas"`, or `"none"` when the
  composed content paints its own. `padded` (default on) is `--spacing-xl`; turn it off for content
  that reaches the cell's edges.
- **`divider` cells must fill their own background**, or the whole cell shows the rule colour
  through the gap.
- **Cells are square.** `--shape-flat`; nothing in a grid is rounded.

---

## Vocabulary

### Weights

| Token | Value | Role |
| --- | --- | --- |
| bare `border` | `1px` | Every page-layer rule: hero, column, bands, cells, gaps |
| `--border-width-default` | `0.8px` | Component-level hairline, opt-in (see [Known issues](#known-issues)) |
| `--border-2` | `2px` | Accent bar — painted as a filled element, never a border |

### Colours

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--border-default` | `#D1D1D1` | `#2B2B2B` | The frame: hero rule, column rules, band rules, grid seams, nodes |
| `--border-muted` | `#ECECEC` | `#242424` | One step back: rules *inside* a band, a `divider` grid on `muted`, icon frames |
| `--border-strong` | `#000000` | `#FFFFFF` | Pressed / active edge |
| `--border-selected` | `#F3652B` | `#F3652B` | Selection (Azion orange, both themes) |

All four are opaque, and `default` / `muted` now separate in both themes — still verify a rule's
role in dark, where the two sit only 7 steps apart.

### Radii

`--shape-flat` `0` (cells, bands, gaps) · `--shape-elements` `6px` (inputs, chips, list rows) ·
`--shape-button` `6px` · `--shape-card` `8px` — **the ceiling**. Nothing structural is pill-shaped.

### Widths

The container ladder is geometric — `3xs` 256px to `7xl` 1620px, each rung ~16.6% from the next.
Pages snap to it; a page decision never adds a rung.

---

## Rules of the language

- **One edge, one owner.** In the framed grid the band above owns the rule; pass `flush` below it.
- **One column per page, picked by payload.** `layout-column` unless the payload is narrower.
- **The page stack holds a heading and one parent;** exactly one `layout-section-start`.
- **Section step between sections, group step inside one.** Never restate a step as a raw length.
- **Every Site module is `:divided="false"`, and a `SectionGap hatch` sits between every pair.**
- **Bands are `borders="y"`;** the column owns the sides.
- **Every framed cell ticks all four nodes;** under a gap, `marks="bottom"`; in a `gap-px` grid, none.
- **`divider` cells fill their own background.**
- **Heroes are full-bleed; columns are capped.** Same `max-width` key for both.
- **No shadow anywhere in this language.** Shadows mean floating — overlays, popovers, drawers.
- **No radius above `--shape-card`; cells are `--shape-flat`.**
- **Texture behind copy is faded; only the gap's ruled texture runs unmasked.**
- **`motion-reduce:` on every transition and arrival.**

---

## Known issues

Found while documenting; **not fixed** — each changes rendered output.

1. **Home's resources section adds a margin inside a gapped parent.**
   [`Home.vue`](../../apps/webkit-sample/src/console/pages/home/Home.vue) gives the `Resources`
   `<section>` `mt-(--spacing-lg)` while its parent `<main>` already spaces children with
   `gap-(--layout-boundary-start)`. Gap and margin add, so the two sections sit at boundary-start +
   `--spacing-lg` apart — the double step the layout tokens forbid. The parent's gap is also the
   boundary step where the rhythm calls for `--layout-section-gap`.
2. **Two hairline weights coexist.** The page layer uses bare `border` (1px); 14 webkit component
   files request `--border-width-default` (0.8px), as does the console's `IconFrame`. The theme sets
   no `--default-border-width`, so the token is opt-in and both weights share a screen.
3. **`PageHeader` mixes raw values into a token system** —
   [`PageHeader.vue`](../../apps/webkit-sample/src/shared/ui/layout/PageHeader.vue) still uses
   `mb-12` and `max-w-[620px]` instead of spacing / container tokens.

Item 1 is a console change; items 2–3 need a visual-baseline regen.
