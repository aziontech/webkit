# Hero Copy On Top Art

> The opening band of a product page whose copy sits centered on top of a topology scene: the page `h1` with its overline, sentence and up to two actions over columns of status cards wired left to right. It is a page section — the site places it from a `{ _id: 'hero-copy-on-top-art', props }` entry and binds `props` straight onto it — and it composes `hero`, `hero-title`, `button`, `flow` and `tag`. It is a separate section from `hero-band` because the scene is a data model of its own: levels of cards, each with a status and an optional focus.

- Import: `import HeroCopyOnTopArt from '@aziontech/webkit/hero-copy-on-top-art'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [hero-copy-on-top-art.json](https://github.com/aziontech/webkit/blob/main/.specs/hero-copy-on-top-art.json)

## When to use

- To open a product page whose object is best shown as a small topology (domains feeding a workload that binds an application and a firewall).

## Do

- Keep three levels of one or two cards so the scene fits the column on a tablet.
- Mark exactly one card `lit`, the focus of the scene.

## Don’t

- For an opening band with no scene → use `hero-band`.
- For an opening band followed by a grid of arguments → use `hero-with-opening`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [hero-band](hero-band.md) — the sibling opening band with the same copy and actions and no scene.
- [flow](flow.md) — the diagram primitive the scene is rendered with.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `eyebrow` | `string` | `''` | false | Short overline above the headline. |
| `highlight` | `string` | `''` | false | Opening words of the headline, painted in the brand accent; reads as one sentence with `title`. |
| `title` | `string` | `''` | false | Page headline, rendered as the page `h1`; the band renders nothing when empty. |
| `description` | `string` | `''` | false | Sentence under the headline. |
| `primaryAction` | `HeroCopyOnTopArtAction` | `undefined` | false | First button under the headline; `{ label, href, trailing?, target? }`. Shown only with a label and a link. |
| `secondaryAction` | `HeroCopyOnTopArtAction` | `undefined` | false | Second, outlined button beside the first; `{ label, href, trailing?, target? }`. Shown only with a label and a link. |
| `levels` | `HeroCopyOnTopArtLevel[]` | `[]` | false | The columns of the topology, left to right; each is `{ nodes }`, the cards top to bottom, each `{ eyebrow, icon, title, label, severity, lit? }`. A card without `title` is skipped, and the scene renders only when a level has a card. |

## States

- Visual states: `default`
- A card with `lit` carries `data-lit` and is drawn as the focus of the scene, with the brand border and glow
- Empty: when `title` is empty the band renders nothing but its root; when no level has a card the scene is omitted
- Each action renders only with a label and a link

## Accessibility

- Visible focus: owned by `button`; the cards are not interactive.
- Keyboard map: `Tab` moves through the actions.
- ARIA: the hero `<section>` is named by the full headline (`aria-label`); the headline is the page `h1`; card icons are `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `hero-title`, `button` and `tag`; card text uses `--text-default` and `--text-muted`.
- `motion-reduce:transition-none motion-reduce:animate-none` on every motion-bearing class.
- Touch target ≥40×40 px — the large buttons meet it.

## Examples

### Default

```vue
<script setup>
  import HeroCopyOnTopArt from '@aziontech/webkit/hero-copy-on-top-art'
</script>

<template>
  <HeroCopyOnTopArt
    eyebrow="Workloads"
    title="Put your application close to users in seconds"
    description="A workload is the hostname, the certificate and the routing that make an application reachable. Create one and it is live in every Azion data center — no servers to size, no regions to pick."
    :primary-action="{ label: 'Start for free', href: 'https://console.azion.com/signup' }"
    :secondary-action="{
      label: 'Docs',
      href: 'https://www.azion.com/en/documentation/',
      trailing: true
    }"
    :levels="[
      {
        nodes: [
          {
            eyebrow: 'Domain',
            icon: 'ai ai-domains',
            title: 'shop.example.com',
            label: 'Public',
            severity: 'info'
          },
          {
            eyebrow: 'Domain',
            icon: 'ai ai-domains',
            title: 'api.example.com',
            label: 'Public',
            severity: 'info'
          }
        ]
      },
      {
        nodes: [
          {
            eyebrow: 'Workload',
            icon: 'ai ai-workloads',
            title: 'shop-prod',
            label: 'Live',
            severity: 'success',
            lit: true
          }
        ]
      },
      {
        nodes: [
          {
            eyebrow: 'Application',
            icon: 'ai ai-edge-application',
            title: 'storefront',
            label: 'Active',
            severity: 'success'
          },
          {
            eyebrow: 'Firewall',
            icon: 'ai ai-edge-firewall',
            title: 'shop-rules',
            label: 'Active',
            severity: 'success'
          }
        ]
      }
    ]"
  />
</template>
```
