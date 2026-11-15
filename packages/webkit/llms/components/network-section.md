# Network Section

> The infrastructure band of a marketing page: a tall framed panel with the world network map drawn behind a small start-aligned title, a claims eyebrow and a row of claim chips, closed by a floor of client outcomes (a quote with its highlights and, when given, the client's mark), benefits (a topic each) or stats (headline figures). It is a page section — the site places it from a `{ _id: 'network-section', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `network-map`, `section-title`, `card-grid`, `quote`, `topic` and `big-numbers`. `variant` picks the floor only: `outcomes` renders the quotes on one column per entry — two at least, four at most; `benefits` renders the topics on up to three columns, balanced so every row is full; `stats` renders the figures as a `big-numbers` row. The band above is the same.

- Import: `import NetworkSection from '@aziontech/webkit/network-section'`
- Category: sections · Surface: site · Structure: monolithic
- API as JSON: [network-section.json](https://github.com/aziontech/webkit/blob/main/.specs/network-section.json)

## When to use

- To state the network's reach with figures and back it with client results, product benefits or headline figures.

## Do

- Four short `claims`; they are chips, not sentences. Give a claim as `{ label, mobile: false }` to keep it to the medium breakpoint and up when the phone band has room for fewer chips.
- Two to four `outcomes`: the floor sets one column per entry, so it closes the grid; a fifth entry wraps to a second row.
- Three `benefits` (or six), each a short `title`, a `description` and an optional `icon`; each renders as a topic with its title as an `h3`.
- Four `stats` on the `stats` floor, each a `value` and a `label`, with an optional `prefix` and `suffix`.
- Give the band an `anchor` when a page links to it with a `#hash`.
- Leave `logo` out of an outcome when the site shows the figure alone; the cell then renders no mark row.
- Use `logoTreatment: 'monochrome'` for a dark mark that must invert in the dark theme; leave `color` for a colour mark.

## Don’t

- For figures alone, without the map band → use `stats-band`.
- For a logo wall with one quote → use `logo-wall-quote`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [network-map](network-map.md) — the animated map behind the copy.
- [quote](quote.md) / `topic` — the cell types of the `outcomes` and `benefits` floors.
- [big-numbers](big-numbers.md) — the row the `stats` floor renders.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `NetworkSectionVariant` | `'outcomes'` | false | Which floor closes the band: `outcomes` renders the client quotes, `benefits` the benefit topics on up to three columns, `stats` the headline figures. |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `eyebrow` | `string` | `''` | false | Overline above the headline. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the small section title as its `h2`; the band renders nothing when empty. |
| `claimsEyebrow` | `string` | `''` | false | Overline-set line above the claims. |
| `claims` | `(string \| NetworkSectionClaim)[]` | `[]` | false | Short figures rendered as chips under the claims eyebrow, in order; each is a string or `{ label, mobile? }`, where `mobile: false` hides the chip below the medium breakpoint. |
| `outcomes` | `NetworkSectionOutcome[]` | `[]` | false | Client results for the `outcomes` floor, in order, one column each up to four; each is `{ logo?, logoAlt?, logoTreatment?, text, highlights? }` where `logo` is the mark URL (the cell renders no mark without it), `logoAlt` names the client, `logoTreatment` is `'monochrome'` or `'color'` (`LogoTreatment` without `knockout`), and `highlights` are the phrases of `text` set in the accent. |
| `benefits` | `NetworkSectionBenefit[]` | `[]` | false | Topics for the `benefits` floor, in order, on up to three columns balanced so every row is full; each is `{ title, description, icon? }`, rendered as a topic whose title is an `h3`. |
| `stats` | `NetworkSectionStat[]` | `[]` | false | Figures for the `stats` floor, in order, rendered by `big-numbers`; each is `{ value, label, prefix?, suffix? }`. |

## States

- Visual states: `default`
- `data-variant` mirrors the `variant` prop and selects the floor (`outcomes`, `benefits` or `stats`)
- Empty: when `title` is empty the band renders nothing; when the selected floor's array is empty the band renders without a floor
- An outcome without `logo` renders its quote with no mark row
- The `benefits` floor is `card-grid`'s `balanced` layout with `columns: 3`, so three benefits fill one row and four split 2 × 2; every benefit is a `topic` with an `h3`, led by its glyph when it has an `icon`
- The `stats` floor is a `big-numbers` row under a rule; `big-numbers` picks its own column count so no cell is left empty
- Claims: a chip is `h-6` with `text-label-sm` below the small breakpoint and `h-7` with `text-label-md` from it; a claim with `mobile: false` carries `data-mobile="hidden"` and is hidden below the medium breakpoint
- Anchor: the root carries `id` = `anchor` when set, with a scroll margin so a `#hash` jump clears a sticky header
- The map renders twice: a faded top-right world from the medium breakpoint up, a centered masked world below it, framed close on the network (`scale` 3.3); both are `network-map`'s own animation

## Accessibility

- Visible focus: nothing in the band is interactive.
- Keyboard map: none.
- ARIA: the band is a `<section>` named by its title (`aria-label`); the headline is the section title's `h2`; the claims are a real list; the maps are decorative and hidden from assistive technology by `network-map`; each outcome's mark carries the client name as `alt`; benefit topics are `h3`s; the `stats` floor is `big-numbers`, one `figure` per stat with its label as the caption. A claim hidden below the medium breakpoint is `display: none` there, so assistive technology skips it too.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): claims eyebrow `var(--text-muted)`, claims `var(--text-default)` on a tinted canvas; the map sits at low opacity behind the copy and never under the text column on large screens.
- `motion-reduce:transition-none motion-reduce:transform-none` — the map animation belongs to `network-map`, which carries its own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — not applicable, nothing is interactive.

## Right-to-left

- Layout: logical utilities and the composed components' own mirroring, so the network map, title, chips and floor fill from the inline start.
- Icons: action chevrons mirror (owned by `button`).
- Keyboard: unchanged.

## Internationalization

- No built-in strings: every visible string arrives through props.

## Responsive

- Below medium the map is drawn as a strip under the copy (the full-height map column is hidden); from medium the map sits behind the copy, its fade widened between medium and large.
- The floor follows `card-grid`: outcomes take one column per entry, benefits up to three, stats the `big-numbers` row.
- No horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import dafitiExtendedMono from '@aziontech/webkit/assets/dafiti-extended-mono.svg'
  import fourbankExtendedReversed from '@aziontech/webkit/assets/fourbank-extended-reversed.svg'
  import madeiramadeiraExtendedReversed from '@aziontech/webkit/assets/madeiramadeira-extended-reversed.svg'
  import rennerExtendedColor from '@aziontech/webkit/assets/renner-extended-color.svg'
  import NetworkSection from '@aziontech/webkit/network-section'
</script>

<template>
  <NetworkSection
    variant="outcomes"
    eyebrow="Region: Earth."
    title="One distributed infrastructure without the complexity of managing, securing and scaling it"
    claims-eyebrow="Built around your users. Distributed around your data."
    :claims="[
      '100+ data centers',
      '100+ Tbps network capacity',
      '30 ms median latency',
      '100% availability'
    ]"
    :outcomes="[
      {
        logo: dafitiExtendedMono,
        logoAlt: 'Dafiti',
        logoTreatment: 'monochrome',
        text: '86% faster load times, with a 45% cost reduction in data transfer.',
        highlights: ['86% faster load times', '45% cost reduction']
      },
      {
        logo: madeiramadeiraExtendedReversed,
        logoAlt: 'MadeiraMadeira',
        logoTreatment: 'color',
        text: '90% lower cloud costs and faster applications at scale.',
        highlights: ['90% lower cloud costs']
      },
      {
        logo: rennerExtendedColor,
        logoAlt: 'Renner',
        logoTreatment: 'color',
        text: '67% saved on data transfer, even during massive traffic spikes.',
        highlights: ['67% saved']
      },
      {
        logo: fourbankExtendedReversed,
        logoAlt: 'Fourbank',
        logoTreatment: 'monochrome',
        text: 'DDoS mitigated on applications and APIs, with a programmable security layer.',
        highlights: ['DDoS mitigated']
      }
    ]"
  />
</template>
```

### Variants

```vue
<script setup>
  import dafitiExtendedMono from '@aziontech/webkit/assets/dafiti-extended-mono.svg'
  import fourbankExtendedReversed from '@aziontech/webkit/assets/fourbank-extended-reversed.svg'
  import madeiramadeiraExtendedReversed from '@aziontech/webkit/assets/madeiramadeira-extended-reversed.svg'
  import rennerExtendedColor from '@aziontech/webkit/assets/renner-extended-color.svg'
  import NetworkSection from '@aziontech/webkit/network-section'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <NetworkSection
      variant="outcomes"
      eyebrow="Region: Earth."
      title="One distributed infrastructure without the complexity of managing, securing and scaling it"
      claims-eyebrow="Built around your users. Distributed around your data."
      :claims="[
        '100+ data centers',
        '100+ Tbps network capacity',
        '30 ms median latency',
        '100% availability'
      ]"
      :outcomes="[
        {
          logo: dafitiExtendedMono,
          logoAlt: 'Dafiti',
          logoTreatment: 'monochrome',
          text: '86% faster load times, with a 45% cost reduction in data transfer.',
          highlights: ['86% faster load times', '45% cost reduction']
        },
        {
          logo: madeiramadeiraExtendedReversed,
          logoAlt: 'MadeiraMadeira',
          logoTreatment: 'color',
          text: '90% lower cloud costs and faster applications at scale.',
          highlights: ['90% lower cloud costs']
        },
        {
          logo: rennerExtendedColor,
          logoAlt: 'Renner',
          logoTreatment: 'color',
          text: '67% saved on data transfer, even during massive traffic spikes.',
          highlights: ['67% saved']
        },
        {
          logo: fourbankExtendedReversed,
          logoAlt: 'Fourbank',
          logoTreatment: 'monochrome',
          text: 'DDoS mitigated on applications and APIs, with a programmable security layer.',
          highlights: ['DDoS mitigated']
        }
      ]"
    />
    <NetworkSection
      variant="benefits"
      eyebrow="Region: Earth."
      title="One distributed infrastructure without the complexity of managing, securing and scaling it"
      claims-eyebrow="Built around your users. Distributed around your data."
      :claims="[
        '100+ data centers',
        '100+ Tbps network capacity',
        '30 ms median latency',
        '100% availability'
      ]"
      :benefits="[
        {
          title: 'Global resilience beyond anycast',
          description:
            'Azion\'s software-defined global router steers traffic around failures and network degradation faster than BGP can reconverge. Always-on DDoS protection across 100+ data centers worldwide.'
        },
        {
          title: 'Low latency everywhere',
          description:
            'Compute, AI, databases, and security run in every data center, close to your users. Median global latency stays under 30 ms, with a built-in CDN and tiered caching for every app.'
        },
        {
          title: 'Zero-ops autoscaling and failover',
          description:
            'Absorbs any traffic spike with no cold starts, instantly scaling from zero to millions. No capacity planning, no provisioning. Scale-to-zero with no idle costs: you pay only for what you run.'
        }
      ]"
    />
    <NetworkSection
      variant="stats"
      anchor="network-figures"
      eyebrow="Region: Earth."
      title="One distributed infrastructure without the complexity of managing, securing and scaling it"
      claims-eyebrow="Built around your users. Distributed around your data."
      :claims="[
        '100+ data centers',
        '100+ Tbps network capacity',
        '30 ms median latency',
        { label: '100% availability', mobile: false }
      ]"
      :stats="[
        { value: '7', suffix: 'x', label: 'faster pages' },
        { value: '90', suffix: '%', label: 'lower cloud costs' },
        { value: '40', suffix: 'x', label: 'more simultaneous connections' },
        { value: '100', suffix: '%', label: 'OWASP Top 10 mitigation' }
      ]"
    />
  </div>
</template>
```

### Columns

```vue
<script setup>
  import dafitiExtendedMono from '@aziontech/webkit/assets/dafiti-extended-mono.svg'
  import fourbankExtendedReversed from '@aziontech/webkit/assets/fourbank-extended-reversed.svg'
  import madeiramadeiraExtendedReversed from '@aziontech/webkit/assets/madeiramadeira-extended-reversed.svg'
  import rennerExtendedColor from '@aziontech/webkit/assets/renner-extended-color.svg'
  import NetworkSection from '@aziontech/webkit/network-section'

  const claims = [
    '100+ data centers',
    '100+ Tbps network capacity',
    '30 ms median latency',
    '100% availability'
  ]

  const outcomes = [
    {
      logo: dafitiExtendedMono,
      logoAlt: 'Dafiti',
      logoTreatment: 'monochrome',
      text: '86% faster load times, with a 45% cost reduction in data transfer.',
      highlights: ['86% faster load times', '45% cost reduction']
    },
    {
      logo: madeiramadeiraExtendedReversed,
      logoAlt: 'MadeiraMadeira',
      logoTreatment: 'color',
      text: '90% lower cloud costs and faster applications at scale.',
      highlights: ['90% lower cloud costs']
    },
    {
      logo: rennerExtendedColor,
      logoAlt: 'Renner',
      logoTreatment: 'color',
      text: '67% saved on data transfer, even during massive traffic spikes.',
      highlights: ['67% saved']
    },
    {
      logo: fourbankExtendedReversed,
      logoAlt: 'Fourbank',
      logoTreatment: 'monochrome',
      text: 'DDoS mitigated on applications and APIs, with a programmable security layer.',
      highlights: ['DDoS mitigated']
    }
  ]

  const benefits = [
    {
      title: 'Global resilience beyond anycast',
      description:
        'Traffic is steered around failures and network degradation faster than BGP can reconverge.'
    },
    {
      title: 'Low latency everywhere',
      description:
        'Compute, AI, databases, and security run in every data center, close to your users.'
    },
    {
      title: 'Zero-ops autoscaling and failover',
      description:
        'Absorbs any traffic spike with no cold starts, no capacity planning and no provisioning.'
    },
    {
      title: 'Always-on protection',
      description:
        'DDoS mitigation and a programmable security layer run in front of every application.'
    }
  ]

  const counts = [2, 3, 4]

  const benefitCounts = [3, 4]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <NetworkSection
      v-for="count in counts"
      :key="`outcomes-${count}`"
      variant="outcomes"
      eyebrow="Region: Earth."
      :title="`${count} outcomes set the floor in ${count} columns`"
      claims-eyebrow="Built around your users. Distributed around your data."
      :claims="claims"
      :outcomes="outcomes.slice(0, count)"
    />
    <NetworkSection
      v-for="count in benefitCounts"
      :key="`benefits-${count}`"
      variant="benefits"
      eyebrow="Region: Earth."
      :title="`${count} benefits balanced on up to three columns`"
      claims-eyebrow="Built around your users. Distributed around your data."
      :claims="claims"
      :benefits="benefits.slice(0, count)"
    />
  </div>
</template>
```
