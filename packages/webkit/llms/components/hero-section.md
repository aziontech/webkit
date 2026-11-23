# Hero Section

> The opening band of a marketing page: the page `h1` with its overline, accent phrase, sentence and up to two actions, full width above the page column, with an optional client strip on the floor. It is a page section — the site places it from a `{ _id: 'hero-section', props }` entry and binds `props` straight onto it — and it composes `hero`, `hero-title`, `button` and `illustration`, plus `flow-diagram` and `tag` for the topology and `container`, `module`, `registration-frame`, `card-grid`, `feature-item` and `spacer` for the argument grid. `variant` picks the layout only: `center` fills a screen over a dot field with the copy centered, `title-band` is a padded band with the copy centered, `copy-beside-art` sets an illustration (or an `image`) beside the copy, sized from that illustration's own drawn bounds so it bleeds past the column edge and trims its empty top and bottom, and `copy-on-top-art` fills a screen with the copy centered over a scene in its `top` or `bottom` slot, unpadded so the scene reaches the band's edges, and draws a `FlowDiagram` topology from `levels` in the bottom window when neither slot is given, so page JSON can carry the scene as data; every layout takes the same copy, actions and client strip, and any layout can set a framed grid of arguments (`items`, three to a row, each a `FeatureItem`) under the band. The client strip's overline falls back to the locale catalog (`Proven on mission-critical workloads`).

- Import: `import HeroSection from '@aziontech/webkit/hero-section'`
- Category: section · Surface: site · Structure: monolithic
- API as JSON: [hero-section.json](hero-section.json)

## When to use

- Use HeroSection for every marketing page opening; pick the layout with `variant`.
- To open a home, solution, product, listing or contact page with its headline and main actions; add `items` for a grid of arguments under it, or `levels` with `variant="copy-on-top-art"` for a topology under the copy.
- Rendering page JSON, or you need a whole band with no custom content → the section (`hero-section`). Building an SFC by hand, needing slots, or nesting inside another band → the primitive (`hero`).
- Pick the layout by page type (azion.com):
- Home and the product index page: `center` with the client marquee (`marqueeMarks`). No other page type opens with it.
- Every product page: `title-band` with `size="large"`.
- Compliance, Recognitions, Support, Careers and Resource Hub: `center-band`.
- Blog: `title-band` with `size="medium"`, followed by a `small` `spacer`.
- Any other page: `title-band`.

## Do

- Use `title-band` with `size="large"` for a product page and `size="medium"` for a page whose bands start right under the headline.
- Give `illustration` and `illustrationAriaLabel` only to the `copy-beside-art` layout; the other layouts ignore them.
- Leave `titleLength` at `short` for a headline of up to about 50 characters (about seven words): like azion.com, the `center`, `title-band` and `center-band` layouts set it on a narrower measure than the sentence under it, so "Certifications and Compliance" breaks over two lines. Use `long` for a headline of about 51 to 90 characters, which would run to three lines on the short measure. Rewrite a headline longer than about 90 characters; count the string as rendered, in each locale.
- Leave `headerOffset` at its default under `SiteHeaderSection`: it takes the bar's `--layout-header-height` out of a band that fills a screen, so the band fills exactly the first screen with it. Set it empty only on a page with no header above the band; never a literal length.

## Don’t

- When the page exists to capture a lead and the form sits above the fold → use `hero-form-section`.
- `center` with the client marquee on any page other than Home and the product index page → use `title-band` (or `center-band` on the pages listed under When to use).
- In a hand-built SFC that needs slots HeroSection does not offer → use the `hero` primitive.
- For a band inside the page column → use `module` or a sibling section.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [hero](hero.md) — the band primitive every layout is rendered with.
- `hero-title` — the headline block rendered inside it.
- [hero-form-section](hero-form-section.md) — the opening band with a lead form beside the copy.
- [flow-diagram](flow-diagram.md) — the diagram primitive the `levels` topology is drawn with.
- [feature-item](feature-item.md) — the icon, heading and sentence each argument of `items` is rendered with.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `HeroSectionVariant` | `'title-band'` | false | Layout of the band: `center` fills a screen over a dot field, `title-band` is a padded band, `center-band` is a large site-wide band with the copy centered, `compact-band` is a short site-wide band with the copy at the start, `copy-beside-art` sets an illustration or an image beside the copy, `copy-on-top-art` fills a screen with the copy centered over a scene in the `top` or `bottom` slot. |
| `size` | `HeroSectionSize` | `'medium'` | false | Vertical rhythm of the band; `large` is the opening a product page leads with. |
| `eyebrow` | `string` | `''` | false | Short overline above the headline. |
| `titleHighlight` | `string` | `''` | false | Opening words of the headline, painted in the brand accent; reads as one sentence with `title`. |
| `title` | `string` | `''` | false | Page headline, rendered as the page `h1`; the band renders nothing when empty. |
| `description` | `string` | `''` | false | Sentence under the headline. |
| `primaryAction` | `ModuleHeaderAction` | `undefined` | false | First button under the headline; `{ label, href, trailing?, target? }`. Shown only with a label and a link. |
| `secondaryAction` | `ModuleHeaderAction` | `undefined` | false | Second, outlined button beside the first; `{ label, href, trailing?, target? }`. Shown only with a label and a link. |
| `marqueeLabel` | `string` | `''` | false | Eyebrow above the client marquee; empty uses the locale catalog (`Proven on mission-critical workloads`). |
| `marqueeMarks` | `string[]` | `[]` | false | Registry names of the client marks on the band floor, in order; the marquee renders only when it has marks. |
| `illustration` | `string` | `''` | false | Registry name of the illustration set beside the copy in the `copy-beside-art` layout. |
| `illustrationAriaLabel` | `string` | `''` | false | Accessible description of the illustration. |
| `image` | `HeroSectionImage` | `undefined` | false | Image set beside the copy in the `copy-beside-art` layout when no `illustration` is given; `{ src, alt, width, height }`. A portrait image (taller than wide) is drawn at half width, centered, below `md`. |
| `eyebrowPrefix` | `HeroTitleEyebrowPrefix` | `'//'` | false | Mark set before the eyebrow (`//`, `<>`, `</>`, or empty for none); drawn only with an eyebrow. |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `headerOffset` | `string` | `'var(--layout-header-height)'` | false | Height of the site header above the band, taken out of a band that fills a screen; defaults to the `SiteHeaderSection` bar's token, any CSS length, empty for a page with no header above it. |
| `titleLength` | `HeroSectionTitleLength` | `'short'` | false | Length of the headline: `short` sets it on the site's narrow headline measure in the centered layouts, so a four-to-seven-word headline breaks over two balanced lines while the sentence under it keeps the full column; `long` lets the headline take the whole column. |
| `plain` | `boolean` | `false` | false | Drops the dot texture of the `center` layout. |
| `levels` | `HeroSectionLevel[]` | `[]` | false | Columns of the topology the `copy-on-top-art` layout draws under the copy when neither scene slot is given, left to right; each is `{ nodes }`, the cards top to bottom, each `{ eyebrow, icon, title, label, severity, lit? }`. A card without `title` is skipped. |
| `items` | `HeroSectionItem[]` | `[]` | false | Arguments in a framed grid under the band, three to a row; each is `{ icon, title, description }`. The grid renders only when there are items. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `top` | — | A scene in the window above the copy (`ConsoleMockup`, a diagram). The design sample's hero scenes render here. |
| `bottom` | — | A scene in the window under the copy; it enters after the copy (`animate-content-enter`, off under reduced motion) and fades at the inline edges on narrow containers. |

## Assets

- Illustrations: every valid name is in [illustrations.md](../foundations/illustrations.md) (MCP `list_assets({ kind: "illustrations" })`). An unknown name renders a "PLACE DESIGN ASSET" placeholder and warns in the console.
- Brand marks: every valid name is in [brand-marks.md](../foundations/brand-marks.md) (MCP `list_assets({ kind: "brandMarks" })`). An unknown name is not drawn as a mark: `Marquee` prints it as a typographic wordmark, the quote components show no mark.

## States

- Visual states: `default`
- `data-variant` mirrors the `variant` prop and drives the hero's height, width, backdrop and the copy alignment
- `data-title-measure="narrow"` on the root when the headline is set on the narrow measure (`titleLength: 'short'` in the `center`, `title-band` and `center-band` layouts); the headline then caps at `--container-lg` while the description keeps the column
- Empty: when `title` is empty the band renders nothing but its root
- The client strip renders only when `marqueeMarks` has marks; each action renders only with a label and a link; the art renders only in the `copy-beside-art` layout with `illustration` or `image` set (`illustration` wins when both are given)
- `copy-beside-art` art bounds: a registered illustration whose drawn area is known (the `azion-to-*` comparisons and the solution illustrations) takes a width, a bleed past the column's end edge and a top and bottom trim computed from where it is drawn on its canvas, set as `--hero-section-art-width`, `--hero-section-art-bleed`, `--hero-section-art-trim-top` and `--hero-section-art-trim-bottom` on the art box from `md` up; any other illustration keeps the default bounds (161.45 % wide, 35.73 % bleed, no trim); an `image` fills the media column. Below `md` the art takes the column width
- `data-orientation="portrait"` on an `image` taller than it is wide
- Topology: in `copy-on-top-art` with no `top` or `bottom` slot, `levels` draws a `FlowDiagram` in the bottom window, one column per level and one card per node with a title; a level left with no card is dropped, and with none left the window is not drawn. A lit node carries `data-lit` and a brand glow. Other layouts ignore `levels`, and a slotted scene wins over it
- Dots behind text only: the `center` dot field stays behind the copy; a diagram, chart or stat in the `top` or `bottom` scene (or a page-JSON content scene, which `SitePage` marks `data-plain-ground`) gets no dots under it, because `hero` stops its backdrop above a marked `bottom` window and drops it for a marked `top` window. A console window, illustration or globe scene keeps the dots under it
- Argument grid: `items` renders a framed three-column `CardGrid` of `FeatureItem`s (headings at level 2) inside a site-wide `Container` under the hero, closed by a hatched `Spacer`; only with a title and at least one item

## Accessibility

- Visible focus: owned by `button`.
- Keyboard map: `Tab` moves through the actions; the client strip is not focusable.
- ARIA: the hero `<section>` is named by the full headline (`aria-label`); the headline is the page `h1`; the illustration is named by `illustrationAriaLabel`, decorative when empty; an `image` carries its `alt`. The topology cards are static text (eyebrow, title, status tag), not focusable; each argument heading is an `h2` under the page `h1`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `hero-title` and `button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the client strip stops under reduced motion in `marquee`.
- Touch target ≥40×40 px — the large buttons meet it.

## Right-to-left

- Layout: logical utilities only; in `copy-beside-art` the art bleeds past the end edge (`-me-`) and moves to the start side under `dir="rtl"`.
- Icons: the action chevrons mirror with `button`; illustrations, images and client marks are not mirrored.
- Keyboard: no arrow-key handling.
- User data: none.

## Internationalization

| Key                         | English source                       | Override prop  |
| --------------------------- | ------------------------------------ | -------------- |
| `heroSection.carouselLabel` | Proven on mission-critical workloads | `marqueeLabel` |

- Formatting: none; every other text is a prop from the page JSON.

## Responsive

- Container queries: the `bottom` scene window reads its container (`@max-2xl` fades its inline edges); the layouts switch at viewport breakpoints.
- Topology: in a scene window narrower than 42rem the `levels` topology draws as a vertical rail (columns top to bottom), so no card is cut by the screen edge; from 42rem it is the row, 40rem wide, and `var(--container-3xl)` from 56rem. Both layouts are in the server HTML and a container query shows one, so nothing shifts on load.
- Narrow (below `md`): in `copy-beside-art` the copy centres and stacks over the art, which takes the column width with no bleed or trim; a portrait image takes half the width, centered.
- Touch: the large buttons meet 40 px; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; the art bleed applies from `md` only and is clipped by the hero.

## Examples

### Default

```vue
<script setup>
  import HeroSection from '@aziontech/webkit/hero-section'
</script>

<template>
  <HeroSection
    variant="title-band"
    size="large"
    eyebrow="Cache"
    title="Deliver content fast, worldwide"
    description="Serve cached content close to users. Cut origin load and keep applications fast during traffic spikes."
    :primary-action="{ label: 'Start for free', href: 'https://console.azion.com/signup/' }"
    :secondary-action="{
      label: 'Docs',
      href: 'https://www.azion.com/en/documentation/',
      trailing: true
    }"
  />
</template>
```

### Variants

```vue
<script setup>
  import CopyCommandSection from '@aziontech/webkit/copy-command-section'
  import HeroSection from '@aziontech/webkit/hero-section'
</script>

<template>
  <div class="flex flex-col">
    <HeroSection
      variant="center"
      title-highlight="Build and run applications"
      title="globally, with no ops"
      description="Run code, AI, data, and security on 100+ data centers worldwide."
      :primary-action="{ label: 'Start for free', href: '/signup' }"
      :secondary-action="{ label: 'Talk to sales', href: '/contact', trailing: true }"
      marquee-label="Trusted by teams running critical workloads"
      :marquee-marks="['global-fashion-group', 'herospark', 'itau', 'nzn', 'netshoes']"
    />
    <HeroSection
      variant="title-band"
      size="large"
      eyebrow="Cache"
      title="Deliver content fast, worldwide"
      description="Serve cached content close to users."
      :primary-action="{ label: 'Start for free', href: '/signup' }"
      :secondary-action="{ label: 'Docs', href: '/docs', trailing: true }"
    />
    <HeroSection
      variant="copy-beside-art"
      eyebrow="AWS Alternative Comparison"
      title="AWS sells services. Your team becomes the integrator."
      description="Azion delivers one platform, distributed by default."
      :primary-action="{ label: 'Talk to sales', href: '/contact', trailing: true }"
      illustration="global-network"
      illustration-aria-label="A global network of Azion data centers"
      marquee-label="Trusted by teams running critical workloads"
      :marquee-marks="['agibank', 'radware', 'america-movil', 'gpa', 'fourbank']"
    />
    <HeroSection
      variant="copy-on-top-art"
      eyebrow="Workloads"
      title="Put your application close to users in seconds"
      description="Create a workload and it is live in every data center."
      :primary-action="{ label: 'Start for free', href: '/signup' }"
    >
      <template #bottom>
        <CopyCommandSection value="npm create azion@latest" />
      </template>
    </HeroSection>
  </div>
</template>
```

### Bands

```vue
<script setup>
  import CopyCommandSection from '@aziontech/webkit/copy-command-section'
  import HeroSection from '@aziontech/webkit/hero-section'
</script>

<template>
  <div class="flex flex-col">
    <HeroSection
      variant="center-band"
      eyebrow="Pricing"
      title="Pay for what runs, not for what waits"
      description="Start free and grow without changing plans."
      :primary-action="{ label: 'Start for free', href: '/signup' }"
    />
    <HeroSection
      variant="compact-band"
      eyebrow="Changelog"
      title="What shipped this month across the platform, the console and the CLI"
      title-length="long"
      description="New features and fixes, newest first."
    />
    <HeroSection
      variant="center"
      plain
      title="Ship from your terminal"
      description="One command creates, builds and deploys a project."
    >
      <template #bottom>
        <CopyCommandSection value="npm create azion@latest" />
      </template>
    </HeroSection>
  </div>
</template>
```
