# Network Section

> The infrastructure band of a marketing page: a tall framed panel with the world network map drawn behind a small left-aligned title, a lead line and a row of claim chips, closed by a floor of either client outcomes (a quote with its highlights and, when given, the client's mark) or benefits (a bold lead-in sentence running into its explanation, as on azion.com). It is a page section — the site places it from a `{ _id: 'network-section', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `network-map`, `section-title`, `card-grid`, `quote` and `topic`. `kind` picks the floor only: `outcomes` renders the quotes on one column per entry — two at least, four at most; `benefits` renders the topics on a fixed four-column floor from `lg` (two from `sm`, one on a phone) whose trailing cells stay empty, as the site's three-benefit floor does. The band above is the same.

- Import: `import NetworkSection from '@aziontech/webkit/network-section'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [network-section.json](https://github.com/aziontech/webkit/blob/main/.specs/network-section.json)

## When to use

- To state the network's reach with figures and back it with either client results or product benefits.

## Do

- Four short `claims`; they are chips, not sentences.
- Two to four `outcomes`: the floor sets one column per entry, so it closes the grid; a fifth entry wraps to a second row.
- Three or four `benefits`, each a `title` written as a short sentence ending in a full stop ("Low latency everywhere.") and a `description` that continues it: the title is set bold and runs into the description, like azion.com. Leave `icon` out to match the site; an `icon` turns the benefit into an icon-led topic with its own `h3`.
- Leave `logo` out of an outcome when the site shows the figure alone; the cell then renders no mark row.
- Use `logoTreatment: 'monochrome'` for a dark mark that must invert in the dark theme; leave `as-is` for a colour mark.

## Don’t

- For figures alone → use `stats-band`.
- For a logo wall with one quote → use `logo-wall-quote`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [network-map](network-map.md) — the animated map behind the copy.
- [quote](quote.md) / `topic` — the two cell types the floor renders.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `kind` | `NetworkSectionKind` | `'outcomes'` | false | Which floor closes the band: `outcomes` renders the client quotes, `benefits` the run-in benefit topics on a four-column floor. |
| `eyebrow` | `string` | `''` | false | Overline above the headline. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the small section title as its `h2`; the band renders nothing when empty. |
| `lead` | `string` | `''` | false | Overline-set line above the claims. |
| `claims` | `string[]` | `[]` | false | Short figures rendered as chips under the lead, in order. |
| `outcomes` | `NetworkSectionOutcome[]` | `[]` | false | Client results for the `outcomes` floor, in order, one column each up to four; each is `{ logo?, logoAlt?, logoTreatment?, text, highlights? }` where `logo` is the mark URL (the cell renders no mark without it), `logoAlt` names the client, `logoTreatment` is `'monochrome'` or `'as-is'`, and `highlights` are the phrases of `text` set in the accent. |
| `benefits` | `NetworkSectionBenefit[]` | `[]` | false | Topics for the `benefits` floor, in order, on four columns from the large breakpoint; each is `{ title, description, icon? }` where `title` is set bold and runs into `description`, and an `icon` turns the topic into an icon-led one with its own heading. |

## States

- Visual states: `default`
- `data-kind` mirrors the `kind` prop and selects the floor
- Empty: when `title` is empty the band renders nothing; when the selected floor's array is empty the band renders without a floor
- An outcome without `logo` renders its quote with no mark row
- The `benefits` floor is `card-grid`'s `fixed` layout with `columns: 4`, so three benefits leave the fourth cell empty from `lg`; a benefit without `icon` is one paragraph whose bold title runs into its description, a benefit with `icon` is a `topic` with an `h3`
- The map renders twice: a faded top-right world from the medium breakpoint up, a centered masked world below it; both are `network-map`'s own animation

## Accessibility

- Visible focus: nothing in the band is interactive.
- Keyboard map: none.
- ARIA: the band is a `<section>` named by its title (`aria-label`); the headline is the section title's `h2`; the claims are a real list; the maps are decorative and hidden from assistive technology by `network-map`; each outcome's mark carries the client name as `alt`; benefit topics are `h3`s.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): lead `var(--text-muted)`, claims `var(--text-default)` on a tinted canvas; the map sits at low opacity behind the copy and never under the text column on large screens.
- `motion-reduce:transition-none motion-reduce:transform-none` — the map animation belongs to `network-map`, which carries its own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — not applicable, nothing is interactive.

## Examples

### Default

```vue
<script setup>
  import NetworkSection from '@aziontech/webkit/network-section'
  import dafitiExtendedMono from '@aziontech/webkit/assets/dafiti-extended-mono.svg'
  import fourbankExtendedReversed from '@aziontech/webkit/assets/fourbank-extended-reversed.svg'
  import madeiramadeiraExtendedReversed from '@aziontech/webkit/assets/madeiramadeira-extended-reversed.svg'
  import rennerExtendedColor from '@aziontech/webkit/assets/renner-extended-color.svg'
</script>

<template>
  <NetworkSection
    kind="outcomes"
    eyebrow="Region: Earth."
    title="One distributed infrastructure without the complexity of managing, securing and scaling it"
    lead="Built around your users. Distributed around your data."
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
        logoTreatment: 'as-is',
        text: '90% lower cloud costs and faster applications at scale.',
        highlights: ['90% lower cloud costs']
      },
      {
        logo: rennerExtendedColor,
        logoAlt: 'Renner',
        logoTreatment: 'as-is',
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

### Types

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
      kind="outcomes"
      eyebrow="Region: Earth."
      title="One distributed infrastructure without the complexity of managing, securing and scaling it"
      lead="Built around your users. Distributed around your data."
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
          logoTreatment: 'as-is',
          text: '90% lower cloud costs and faster applications at scale.',
          highlights: ['90% lower cloud costs']
        },
        {
          logo: rennerExtendedColor,
          logoAlt: 'Renner',
          logoTreatment: 'as-is',
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
      kind="benefits"
      eyebrow="Region: Earth."
      title="One distributed infrastructure without the complexity of managing, securing and scaling it"
      lead="Built around your users. Distributed around your data."
      :claims="[
        '100+ data centers',
        '100+ Tbps network capacity',
        '30 ms median latency',
        '100% availability'
      ]"
      :benefits="[
        {
          title: 'Global resilience beyond anycast.',
          description:
            'Azion\'s software-defined global router steers traffic around failures and network degradation faster than BGP can reconverge. Always-on DDoS protection across 100+ data centers worldwide.'
        },
        {
          title: 'Low latency everywhere.',
          description:
            'Compute, AI, databases, and security run in every data center, close to your users. Median global latency stays under 30 ms, with a built-in CDN and tiered caching for every app.'
        },
        {
          title: 'Zero-ops autoscaling and failover.',
          description:
            'Absorbs any traffic spike with no cold starts, instantly scaling from zero to millions. No capacity planning, no provisioning. Scale-to-zero with no idle costs: you pay only for what you run.'
        }
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
      logoTreatment: 'as-is',
      text: '90% lower cloud costs and faster applications at scale.',
      highlights: ['90% lower cloud costs']
    },
    {
      logo: rennerExtendedColor,
      logoAlt: 'Renner',
      logoTreatment: 'as-is',
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
      title: 'Global resilience beyond anycast.',
      description:
        'Traffic is steered around failures and network degradation faster than BGP can reconverge.'
    },
    {
      title: 'Low latency everywhere.',
      description:
        'Compute, AI, databases, and security run in every data center, close to your users.'
    },
    {
      title: 'Zero-ops autoscaling and failover.',
      description:
        'Absorbs any traffic spike with no cold starts, no capacity planning and no provisioning.'
    },
    {
      title: 'Always-on protection.',
      description:
        'DDoS mitigation and a programmable security layer run in front of every application.'
    }
  ]

  const counts = [2, 3, 4]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <NetworkSection
      v-for="count in counts"
      :key="`outcomes-${count}`"
      kind="outcomes"
      eyebrow="Region: Earth."
      :title="`${count} outcomes set the floor in ${count} columns`"
      lead="Built around your users. Distributed around your data."
      :claims="claims"
      :outcomes="outcomes.slice(0, count)"
    />
    <NetworkSection
      v-for="count in counts"
      :key="`benefits-${count}`"
      kind="benefits"
      eyebrow="Region: Earth."
      :title="`${count} benefits on the four-column floor`"
      lead="Built around your users. Distributed around your data."
      :claims="claims"
      :benefits="benefits.slice(0, count)"
    />
  </div>
</template>
```
