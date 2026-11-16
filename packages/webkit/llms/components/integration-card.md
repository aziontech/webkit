# Integration Card

> Use IntegrationCard for one tile of a catalog of integrations, extensions or plugins; for a bordered box of related content use Card, and for a collection of resource records shown as cards use CardList. A catalog tile laid out from props: a logo mark, the item name, its vendor, a short description, badges, the installed state and one action. The name is the tile's single target: a link when `href` is set, otherwise a button that emits `select`, stretched over the whole tile. `featured` gives the centred, raised layout used for a short row of picks above the full catalog. It was the `integration` variant of `Card` until 6.0, split out because a tile shares neither the header nor the footer of a content card.

- Import: `import IntegrationCard from '@aziontech/webkit/integration-card'`
- Category: content · Surface: app · Structure: monolithic
- API as JSON: [integration-card.json](integration-card.json)

## When to use

- A catalog tile for an integration, an extension or a plugin: the logo, the name, the vendor, a short description, badges, the installed state and one action.
- A short row of highlighted integrations above the full catalog (Featured): add `featured` for the centred, raised layout with the badges in the corner.
- A starter template or next-step tile that carries a mark, a name and a short description and links somewhere.

## Do

- The tile is laid out from props: `title`, `logo` (or the `logo` slot), `vendor`, `description`, `badges` and `installed`. The title becomes a link when `href` is set, otherwise a button that emits `select`, and it stretches over the whole tile so the tile is one target. Put a single action (Install, Configure) in the `actions` slot; it sits above the stretched target and stays reachable on its own.
- Keep the description to one or two sentences; the tile clamps it to three lines.
- Show at most two badges (category, context, plan). The installed state is a prop, not a badge, so it reads the same everywhere.
- Tiles sit under a section heading, so their title is an `h3`.
- `featured` centres the mark, the name, the vendor and the description on a raised surface with a primary glow at the top, and moves the badges to the top end corner, where a badge without `severity` is `primary`. Use it for a row of at most three or four picks above the full catalog, never for every tile; the full catalog keeps the plain tile.

## Don’t

- A bordered box of related content with a title, a body and a footer → use `card`.
- One record of a resource list shown as cards, with selection and fields → use `card-list` (with `useCollection`).
- One tier of a pricing comparison → use `pricing-card`.
- A single row of title, description, media and actions → use `item`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [card](card.md) — the content box this tile was split from; shares its surface tokens.
- [tag](tag.md) — renders the badges and the Installed state.
- [card-list](card-list.md) — the resource list in card form, with selection.
- `view/marketplace` — the block that lays these tiles out in a filtered grid.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | false | The item name; the tile's single target. |
| `logo` | `string` | `''` | false | Icon class for the logo mark. The `logo` slot takes an image instead. |
| `vendor` | `string` | `''` | false | Who publishes the item, shown as "by {vendor}". |
| `description` | `string` | `''` | false | One or two sentences on what the item does. |
| `badges` | `IntegrationCardBadge[]` | `[]` | false | Small tags such as the category or the context (`{ label, variant?, severity? }`, `variant` a `TagVariant` and `severity` a `TagSeverity` (`IntegrationCardBadgeVariant` and `IntegrationCardBadgeSeverity`); a badge with neither is `info`, a featured badge with neither is the `primary` variant). |
| `installed` | `boolean` | `false` | false | Shows the Installed tag. |
| `href` | `string` | `''` | false | The title links here; without it the title is a button that emits `select`. |
| `featured` | `boolean` | `false` | false | The featured layout, centred on a raised surface with a primary glow at the top and the badges in the top end corner. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `select` | `event: MouseEvent` | Without `href`: the title (the whole tile) was activated. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Extra content under the description. |
| `logo` | — | Replaces the logo mark, for an `img` with an empty `alt`. |
| `actions` | — | One action at the end of the tile, above the stretched title target. |

## States

- Visual states: `default`, `hover`, `focus-visible`
- `hover` shades the surface, `focus-visible` rings the whole tile (the ring sits on the stretched title target), `installed` adds the success Installed tag.
- Featured (`featured`): the surface is raised; `hover` strengthens the border and brightens the top glow instead of shading the surface; the layout is centred and the badges sit in the top end corner. `data-featured` on the root drives the styles.
- Test ids: `integration-card` on the root, with `__logo`, `__title`, `__vendor`, `__installed`, `__actions`, and `__glow` and `__badges` when featured.

## Accessibility

- Visible focus: the stretched title target draws an inset `focus-visible:after:ring-2 focus-visible:after:ring-(--ring-color)` around the whole tile, so `overflow-clip` on the tile never cuts it.
- Keyboard map: `Tab` reaches the title (a link or a button) and then the action; `Enter` activates the title (`Space` too when it is a button).
- ARIA: the root is a `section`; the title is an `h3` holding the link or the button; the logo mark is `aria-hidden`; the featured glow is `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons).
- `motion-reduce:transition-none` on the hover and glow transitions.
- Touch target: the whole tile is the title's target; the action is a regular `Button`.

## Right-to-left

- Layout: logical utilities only; the logo sits at the start, the badges and the action at the end. Featured: the content is centred and the badges sit in the top end corner (`end-*`), so they move to the left under `dir="rtl"`.
- Icons: the logo is not mirrored.
- Keyboard: no arrow-key navigation of its own.
- User data: the vendor and the title render in `<bdi>`.

## Internationalization

| Key                         | English source | Override prop |
| --------------------------- | -------------- | ------------- |
| `integrationCard.byVendor`  | by {vendor}    | —             |
| `integrationCard.installed` | Installed      | —             |

- Formatting: none.

## Responsive

- The layout does not change with width; the description wraps and clamps to three lines.
- Narrow (≤ 640 px or a narrow grid track): the badges wrap under the title row; the action stays at the end of its own row. Featured: the corner badges keep their place and the centred block reserves the top inset for them.
- Touch: the whole tile is the target; the action is a regular `Button`.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import IntegrationCard from '@aziontech/webkit/integration-card'
  import { ref } from 'vue'

  const opened = ref('')
</script>

<template>
  <div class="flex w-full max-w-[400px] flex-col gap-(--spacing-sm)">
    <IntegrationCard
      title="Request Signer"
      vendor="Acme Inc."
      logo="ai ai-key"
      description="Sign every request at the edge with a rotating key, so the origin only answers traffic that passed through."
      :badges="[{ label: 'Firewall' }]"
      @select="opened = 'Request Signer'"
    >
      <template #actions>
        <Button
          label="Install"
          variant="outline"
          size="small"
        />
      </template>
    </IntegrationCard>
    <p
      class="m-0 text-body-xs text-(--text-muted)"
      role="status"
    >
      {{ opened ? `Opened ${opened}` : '' }}
    </p>
  </div>
</template>
```

### Installed

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import IntegrationCard from '@aziontech/webkit/integration-card'
</script>

<template>
  <IntegrationCard
    class="w-full max-w-[400px]"
    title="Waiting Room"
    vendor="Tidewater"
    logo="ai ai-hourglass"
    description="Queue visitors during a traffic surge and let them in as capacity frees up."
    :badges="[{ label: 'Application' }]"
    installed
    href="#waiting-room"
  >
    <template #actions>
      <Button
        label="Configure"
        variant="outline"
        size="small"
        icon="ai ai-settings"
      />
    </template>
  </IntegrationCard>
</template>
```

### Featured

```vue
<script setup>
  import IntegrationCard from '@aziontech/webkit/integration-card'
  import { ref } from 'vue'

  const opened = ref('')

  const featured = [
    {
      id: 'split-testing',
      name: 'Split Testing',
      vendor: 'Acme Inc.',
      logo: 'ai ai-percentage',
      context: 'Application',
      description: 'Send a share of the traffic to a second version and compare the results.'
    },
    {
      id: 'bot-shield',
      name: 'Bot Shield',
      vendor: 'Acme Inc.',
      logo: 'ai ai-shield',
      context: 'Firewall',
      description:
        'Score every request and block the automated traffic before it reaches the origin.'
    },
    {
      id: 'request-signer',
      name: 'Request Signer',
      vendor: 'Acme Inc.',
      logo: 'ai ai-key',
      context: 'Firewall',
      description:
        'Sign every request with a rotating key, so the origin only answers signed traffic.'
    }
  ]
</script>

<template>
  <section
    class="flex w-full flex-col gap-(--spacing-sm)"
    aria-labelledby="card-featured-heading"
  >
    <h2
      id="card-featured-heading"
      class="text-heading-2xs text-(--text-default)"
    >
      Featured
    </h2>
    <ul class="m-0 grid list-none grid-cols-1 gap-(--spacing-md) p-0 sm:grid-cols-3">
      <li
        v-for="item in featured"
        :key="item.id"
        class="flex min-w-0"
      >
        <IntegrationCard
          class="w-full"
          featured
          :title="item.name"
          :vendor="item.vendor"
          :logo="item.logo"
          :description="item.description"
          :badges="[{ label: item.context }]"
          @select="opened = item.name"
        />
      </li>
    </ul>
    <p
      class="m-0 text-body-xs text-(--text-muted)"
      role="status"
    >
      {{ opened ? `Opened ${opened}` : '' }}
    </p>
  </section>
</template>
```
