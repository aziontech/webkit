# Hero With Opening

> The opening band of a product page followed straight by its arguments: a large centered title band with the page `h1`, overline, sentence and up to two actions, then a frame grid of three-column argument cells in the page column, closed by a hatched gap. It is a page section — the site places it from a `{ _id: 'hero-with-opening', props }` entry and binds `props` straight onto it — and it composes `hero`, `hero-title`, `button`, `section-container`, `section-module`, `frame-box`, `card-grid`, `topic` and `section-gap`. The grid starts at the hero floor with no gap, so the arguments read as the second half of the hero.

- Import: `import HeroWithOpening from '@aziontech/webkit/hero-with-opening'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [hero-with-opening.json](https://github.com/aziontech/webkit/blob/main/.specs/hero-with-opening.json)

## When to use

- To open a product page that argues on three or six claims right under its headline.

## Do

- Use three or six items so every row of the grid is full.
- Keep each item to a short title and one sentence.
- A title longer than 45 characters widens the headline column so it breaks into two lines instead of three.

## Don’t

- For an opening band with no arguments → use `hero-band`.
- For a reasons band further down the page → use `feature-tiles` or `use-cases`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [hero-band](hero-band.md) — the opening band without the argument grid.
- [topic](topic.md) — the icon, heading and sentence each argument is rendered with.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `eyebrow` | `string` | `''` | false | Short overline above the headline. |
| `title` | `string` | `''` | false | Page headline, rendered as the page `h1`; the band renders nothing when empty. A title longer than 45 characters widens the headline column. |
| `description` | `string` | `''` | false | Sentence under the headline. |
| `primaryAction` | `HeroWithOpeningAction` | `undefined` | false | First button under the headline; `{ label, href, trailing?, target? }`. Shown only with a label and a link. |
| `secondaryAction` | `HeroWithOpeningAction` | `undefined` | false | Second, outlined button beside the first; `{ label, href, trailing?, target? }`. Shown only with a label and a link. |
| `items` | `HeroWithOpeningItem[]` | `[]` | false | The arguments in reading order, three to a row; each is `{ icon, title, description }`. The grid renders only when there are items. |

## Assets

- Brand marks: every valid name is in [brand-marks.md](../foundations/brand-marks.md) (MCP `list_assets({ kind: "brandMarks" })`). An unknown name is not drawn as a mark: `Ticker` prints it as a typographic wordmark, the quote components show no mark.

## States

- Visual states: `default`
- The headline column is `xl` wide for a title of up to 45 characters and `4xl` wide for a longer one
- Empty: when `title` is empty the band renders nothing but its root; when `items` is empty the grid and its closing gap are omitted
- Each action renders only with a label and a link

## Accessibility

- Visible focus: owned by `button`.
- Keyboard map: `Tab` moves through the actions.
- ARIA: the hero `<section>` is named by the headline (`aria-label`); the headline is the page `h1` and each argument's heading is an `h2` from `topic`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `hero-title`, `button` and `topic`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion.
- Touch target ≥40×40 px — the large buttons meet it.

## Examples

### Default

```vue
<script setup>
  import HeroWithOpening from '@aziontech/webkit/hero-with-opening'
</script>

<template>
  <HeroWithOpening
    eyebrow="Firewall"
    title="Programmable firewall for distributed applications"
    description="Protect users, applications, and networks with rules you program, from layer 3 to layer 7."
    :primary-action="{ label: 'Start for free', href: 'https://console.azion.com/signup/' }"
    :secondary-action="{
      label: 'Docs',
      href: 'https://www.azion.com/en/documentation/',
      trailing: true
    }"
    :items="[
      {
        icon: 'pi pi-shield',
        title: 'Programmable rule engine',
        description:
          'Define custom rules and behaviors across OSI layers L3-L7 to control traffic before it reaches your applications.'
      },
      {
        icon: 'pi pi-code',
        title: 'Extensible with Functions',
        description:
          'Run custom JavaScript security code and marketplace integrations on Azion’s distributed infrastructure.'
      },
      {
        icon: 'pi pi-sync',
        title: 'Real-time synchronization',
        description:
          'Rules sync automatically across every data center. SIEM integration keeps threat intelligence flowing.'
      }
    ]"
  />
</template>
```
