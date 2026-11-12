# Hero Band

> The opening band of a marketing page: the page `h1` with its overline, accent phrase, sentence and up to two actions, full width above the page column, with an optional client strip on the floor. It is a page section — the site places it from a `{ _id: 'hero-band', props }` entry and binds `props` straight onto it — and it composes `hero`, `hero-title`, `button` and `illustration`. `kind` picks the layout only: `centered` fills a screen over a dot field with the copy centered, `title-band` is a padded band with the copy centered, `pixel-floor` sets the copy at the start over an animated pixel floor, and `copy-beside-art` sets an illustration beside the copy; every layout takes the same copy, actions and client strip.

- Import: `import HeroBand from '@aziontech/webkit/hero-band'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [hero-band.json](https://github.com/aziontech/webkit/blob/main/.specs/hero-band.json)

## When to use

- To open a home, solution, product, listing or contact page with its headline and main actions.

## Do

- Use `title-band` with `size="large"` for a product page and `size="medium"` for a page whose bands start right under the headline.
- Give `illustration` and `illustrationAriaLabel` only to the `copy-beside-art` layout; the other layouts ignore them.
- Leave `headerOffset` at its default under `SiteNav`: it takes the bar's `--layout-header-height` out of a band that fills a screen, so the band fills exactly the first screen with it. Set it empty only on a page with no header above the band; never a literal length.

## Don’t

- For a hero followed by a grid of arguments → use `hero-with-opening`.
- For a hero with a topology scene under the copy → use `hero-copy-on-top-art`.
- For a band inside the page column → use `section-module` or a sibling section.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [hero](hero.md) — the band primitive every layout is rendered with.
- hero-title` — the headline block rendered inside it.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `kind` | `HeroBandKind` | `'title-band'` | false | Layout of the band: `centered` fills a screen over a dot field, `title-band` is a padded band, `centered-band` is a large site-wide band with the copy centered, `compact-band` is a short site-wide band with the copy at the start, `pixel-floor` sets the copy over an animated pixel floor, `copy-beside-art` sets an illustration beside the copy. |
| `size` | `HeroBandSize` | `'medium'` | false | Vertical rhythm of the band; `large` is the opening a product page leads with. |
| `eyebrow` | `string` | `''` | false | Short overline above the headline. |
| `highlight` | `string` | `''` | false | Opening words of the headline, painted in the brand accent; reads as one sentence with `title`. |
| `title` | `string` | `''` | false | Page headline, rendered as the page `h1`; the band renders nothing when empty. |
| `description` | `string` | `''` | false | Sentence under the headline. |
| `primaryAction` | `HeroBandAction` | `undefined` | false | First button under the headline; `{ label, href, trailing?, target? }`. Shown only with a label and a link. |
| `secondaryAction` | `HeroBandAction` | `undefined` | false | Second, outlined button beside the first; `{ label, href, trailing?, target? }`. Shown only with a label and a link. |
| `carouselLabel` | `string` | `''` | false | Overline above the client strip. |
| `carouselMarks` | `string[]` | `[]` | false | Registry names of the client marks on the band floor, in order; the strip renders only when it has marks. |
| `illustration` | `string` | `''` | false | Registry name of the illustration set beside the copy in the `copy-beside-art` layout. |
| `illustrationAriaLabel` | `string` | `''` | false | Accessible description of the illustration. |
| `headerOffset` | `string` | `'var(--layout-header-height)'` | false | Height of the site header above the band, taken out of a band that fills a screen; defaults to the `SiteNav` bar's token, any CSS length, empty for a page with no header above it. |
| `titleLength` | `HeroBandTitleLength` | `'short'` | false | Length of the headline; `long` widens its column so it breaks into two lines instead of three. |
| `plain` | `boolean` | `false` | false | Drops the dot texture of the `centered` layout. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `top` | — | A scene in the window above the copy (`ShellMockup`, `ProductWidget`, a diagram). The design sample's hero scenes render here. |
| `bottom` | — | A scene in the window under the copy; it enters after the copy (`animate-content-enter`, off under reduced motion) and fades at the inline edges on narrow containers. |

## Assets

- Illustrations: every valid name is in [illustrations.md](../foundations/illustrations.md) (MCP `list_assets({ kind: "illustrations" })`). An unknown name renders a "PLACE DESIGN ASSET" placeholder and warns in the console.
- Brand marks: every valid name is in [brand-marks.md](../foundations/brand-marks.md) (MCP `list_assets({ kind: "brandMarks" })`). An unknown name is not drawn as a mark: `Ticker` prints it as a typographic wordmark, the quote components show no mark.

## States

- Visual states: `default`
- `data-kind` mirrors the `kind` prop and drives the hero's height, width, backdrop and the copy alignment
- Empty: when `title` is empty the band renders nothing but its root
- The client strip renders only when `carouselMarks` has marks; each action renders only with a label and a link; the illustration renders only in the `copy-beside-art` layout with `illustration` set

## Accessibility

- Visible focus: owned by `button`.
- Keyboard map: `Tab` moves through the actions; the client strip is not focusable.
- ARIA: the hero `<section>` is named by the full headline (`aria-label`); the headline is the page `h1`; the illustration is named by `illustrationAriaLabel`, decorative when empty.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `hero-title` and `button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the pixel floor and the client strip stop under reduced motion in `texture-material` and `ticker`.
- Touch target ≥40×40 px — the large buttons meet it.

## Examples

### Default

```vue
<script setup>
  import HeroBand from '@aziontech/webkit/hero-band'
</script>

<template>
  <HeroBand
    kind="title-band"
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

### Types

```vue
<script setup>
  import HeroBand from '@aziontech/webkit/hero-band'
</script>

<template>
  <div class="flex flex-col">
    <HeroBand
      kind="centered"
      highlight="Build and run applications"
      title="globally, with no ops"
      description="Run code, AI, data, and security on 100+ data centers worldwide."
      :primary-action="{ label: 'Start for free', href: '/signup' }"
      :secondary-action="{ label: 'Talk to a specialist', href: '/contact', trailing: true }"
      carousel-label="Trusted by teams running critical workloads"
      :carousel-marks="['global-fashion-group', 'herospark', 'itau', 'nzn', 'netshoes']"
    />
    <HeroBand
      kind="title-band"
      size="large"
      eyebrow="Cache"
      title="Deliver content fast, worldwide"
      description="Serve cached content close to users."
      :primary-action="{ label: 'Start for free', href: '/signup' }"
      :secondary-action="{ label: 'Docs', href: '/docs', trailing: true }"
    />
    <HeroBand
      kind="pixel-floor"
      eyebrow="AI Inference"
      title="Build and deploy AI agents and applications in seconds"
      description="Run AI inference close to users on Azion’s distributed infrastructure."
      :primary-action="{ label: 'Start for free', href: '/signup' }"
      :secondary-action="{ label: 'Talk to a specialist', href: '/contact' }"
      carousel-label="Trusted by teams running critical workloads"
      :carousel-marks="['global-fashion-group', 'herospark', 'itau', 'nzn', 'netshoes']"
    />
    <HeroBand
      kind="copy-beside-art"
      eyebrow="AWS Alternative Comparison"
      title="AWS sells services. Your team becomes the integrator."
      description="Azion delivers one platform, distributed by default."
      :primary-action="{ label: 'Talk to a specialist', href: '/contact', trailing: true }"
      illustration="global-network"
      illustration-aria-label="A global network of Azion data centers"
      carousel-label="Trusted by teams running critical workloads"
      :carousel-marks="['agibank', 'radware', 'america-movil', 'gpa', 'fourbank']"
    />
  </div>
</template>
```

### Bands

```vue
<script setup>
  import HeroBand from '@aziontech/webkit/hero-band'
  import SectionCommand from '@aziontech/webkit/section-command'
</script>

<template>
  <div class="flex flex-col">
    <HeroBand
      kind="centered-band"
      eyebrow="Pricing"
      title="Pay for what runs, not for what waits"
      description="Start free and grow without changing plans."
      :primary-action="{ label: 'Start for free', href: '/signup' }"
    />
    <HeroBand
      kind="compact-band"
      eyebrow="Changelog"
      title="What shipped this month across the platform, the console and the CLI"
      title-length="long"
      description="New features and fixes, newest first."
    />
    <HeroBand
      kind="centered"
      plain
      title="Ship from your terminal"
      description="One command creates, builds and deploys a project."
    >
      <template #bottom>
        <SectionCommand value="npm create azion@latest" />
      </template>
    </HeroBand>
  </div>
</template>
```
