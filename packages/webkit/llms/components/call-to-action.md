# Call To Action

> The closing ask of a marketing page: a headline, a supporting sentence and the actions that follow from them, set apart from the surrounding copy by its own surface. It is a panel, not a section header — `section-title` opens a section, `call-to-action` closes one. Four registers. `panel` sets the copy and its controls on one surface, as a row from `md` up. `split` divides the band in two at a 7fr/3fr ratio: a raised lead cell carrying the headline and the primary action, and an aside carrying the supporting line and the secondary one — each cell pushing its control to the band's floor, so the two actions share a baseline at any height. `split` is the register a product page closes on, where the ask has a primary and a secondary path and the headline turns on a second, muted line. `lead` is that lead cell standing alone: the same raised surface, the same two-tone headline, with the supporting line moved under it and every control in one row on the band's floor. It is the register for a close that has no second, quieter path to describe — the band states the ask once and offers its actions together, rather than dividing them across two cells of unequal weight. `primary` is the loud close: one centred ask standing alone as a billboard, on the page canvas lit from above by the brand. The texture composed into the band — a pixelated layer whose two waves travel across it in the primary colour — is lit by its waves alone and carries the band's colour, so the ground stays the canvas and the copy keeps its ordinary ink. The texture is composed in through the `background` slot and the strip along the floor through `bottom`, so the band owns the light and the page owns what is drawn on it.

- Import: `import CallToAction from '@aziontech/webkit/call-to-action'`
- Category: marketing · Surface: marketing · Structure: monolithic
- API as JSON: [call-to-action.json](https://github.com/aziontech/webkit/blob/main/.specs/call-to-action.json)

## When to use

- At the end of a marketing page or section, to carry the reader into signup, docs or sales.
- Whenever a page needs one visually separated block whose whole job is the action.
- Between two sections, as a mid-page ask that should not read as a new section header.
- In `split`, when the ask has two paths of unequal weight — a primary one to start and a secondary one to talk to someone.
- In `primary`, when the page ends on a single ask and the close should be the most lit band on the page, with benefits or proof running along its floor.
- In `lead`, when the band's actions are peers and belong in one row, so an aside cell would have nothing of its own to carry.

## Do

- framed` decides who draws the rule. On, the band draws its own registration frame — vertical rules handed back to the column, a tick at its floor. Off, the rule and the corner marks belong to the `section-module` or `frame-box` the page assembles it into, so a band placed in an already-framed column never lands a second hairline on the column's own.
- Keep `title` to one line and one ask. A panel that poses two questions gets neither answered.
- Put the controls in the `actions` slot; the panel lays them out as a row beside the copy from `md` up and stacks them full-width below it.
- Lead with the primary action and keep secondary ones `outlined` or `text`, so the panel has one obvious target.
- Use `eyebrow` only when the panel needs naming out of context; the headline usually carries the ask on its own.
- In `split`, `title` states the claim and `title-muted` states its consequence — one sentence in two tones, not two headlines. The band renders them as two spans of a single `h2`, so a screen reader reads one heading.
- In `split`, put the primary control in `actions` and the secondary one in `aside`; each cell floors its own control, which is what gives the two a shared baseline. `actions` stretches its child full-width below `md`; `aside` stretches its child at every width, so a control drawn to size to its own content goes in a wrapper there.
- In `lead`, every control goes in `actions` — they lay out as one row from `md` up and stack full-width below it. The copy column is capped at `--container-2xl` so the headline keeps a readable measure however wide the band runs.
- lead` sets the copy-to-actions gap at `--spacing-xl`, not the `--spacing-xxl` the other two use. In `split` that larger number is the *floor* of a stretched cell — what pushes the control onto the band's bottom edge — and in `panel` the controls sit beside the copy from `md` up. In `lead` nothing stretches and nothing sits beside, so `--spacing-xxl` stops reading as a floor and starts reading as a hole.
- In `primary`, the band is centred and carries `title` and `description` only; `eyebrow` and `titleMuted` are not drawn, so the headline stands alone over the texture.
- In `primary`, compose one `texture-material` into `background` — `pixelate` at `small` with `fade="bottom"` — and a `ticker` into `bottom`. The band moves the pixelate's resting pools out of frame and runs its two waves at triple gain and double pace, so the travelling bands carry the light instead of a still glow; keep the headline clear of the densest cells by leaving the band's own padding alone.
- In `primary`, give the ticker enough claims that the loop never repeats inside one screen, and let the pass derive itself: an item pass runs three times slower per claim than a mark pass, because a claim is read.
- Leave `framed` on when the band stands in a section column of its own, and off when the page already wraps it in a `frame-box` — two frames draw two hairlines on the same edge.

## Don’t

- To open a section with a headline and optional actions → use `section-title`, which draws a header rule rather than a panel.
- For the page's leading statement and primary CTAs → use `hero`, whose `Hero.Title` owns the `h1`.
- For a dismissible or time-bound announcement → use `message`.
- For a close that sits quietly in the column → use `split` or `panel`; `primary` fills a whole brand-coloured band and should appear once per page.
- For a plan's call to action inside pricing → use `card-pricing`, which owns its own action row.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [section-title](section-title.md) — opens a section with a header rule; this closes one with a panel.
- [hero](hero.md) — the page's leading band; its `Hero.Title` owns the statement and the `h1`.
- [frame-box](frame-box.md) — the registration frame the band draws when `framed` is on, and the one the page supplies around it when off.
- [button](button.md) — the controls composed into the `actions` and `aside-actions` slots.
- [overline](overline.md) — the `//`-prefixed eyebrow the band renders above the headline.
- [texture-material](texture-material.md) — the pixelated, waving texture composed into `background` in `primary`.
- [ticker](ticker.md) — the strip of benefits composed into `bottom` in `primary`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `—` | true | Headline of the band, rendered as its `h2`. |
| `titleMuted` | `string` | `''` | false | Second line of the headline, set in muted ink; rendered as a second span of the same `h2`. |
| `description` | `string` | `''` | false | Supporting sentence — under the headline in `panel` and `lead`, in the aside cell in `split`; overridden by the default slot. |
| `eyebrow` | `string` | `''` | false | Short uppercase overline rendered above the headline. |
| `kind` | `CallToActionKind` | `'panel'` | false | Layout of the band: `panel` sets the copy and its controls on one surface, `split` divides it into a raised lead cell and an aside that each floor their own control, `lead` is that lead cell standing alone with every control in it, `primary` is a centred ask on the canvas lit by a pixelated, waving primary texture, with a floor. |
| `framed` | `boolean` | `false` | false | Draw the band's own registration frame. Turn it off when the page already wraps the band in a frame. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Description body; replaces the `description` prop when provided. |
| `actions` | — | The controls the band exists to offer; in `split`, the lead cell's primary control. |
| `aside` | — | The aside cell's control in `split`; ignored in `panel`, `lead` and `primary`, where every control belongs in `actions`. |
| `background` | — | Decoration drawn behind the copy in `primary`, such as a `texture-material`; ignored in the other registers. |
| `bottom` | — | The strip that floors the band in `primary`, such as a `ticker`, under a hairline; ignored in the other registers. |

## States

- Visual states: `default`
- Register: `data-kind="panel" | "split" | "lead" | "primary"` on the root
- The band holds no state of its own; controls composed into `actions` / `aside` keep theirs

## Accessibility

- Visible focus: not applicable to the panel itself; controls composed into `actions` keep their own `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` ring.
- Keyboard map: none of its own — `Tab` reaches only the controls placed in the `actions` slot, in DOM order.
- ARIA: the headline is a real `h2` — rendered by the composed `section-title` in `panel`, and by the band itself in `split` and `lead`, where `title` and `title-muted` are two spans of that one heading so it is announced as a single string. The band is a `<section>` named by its `title`, reachable as a landmark with a name; no `role` is added.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): in `primary` the copy is ordinary ink on `var(--bg-canvas)`, so the pair is the same as `panel`'s. The headline is `var(--text-default)` on `var(--bg-surface)`; the description uses `var(--text-muted)`, which clears AA on the dark canvas and is a known theme-level shortfall on the light one (see `big-numbers`).
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the panel is static.
- Touch target ≥40×40 px — both action slots stretch their children to full width below the breakpoint, so slotted buttons keep their own target size.

## Examples

### Default

```vue
<script setup>
  import CallToAction from '@aziontech/webkit/call-to-action'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <CallToAction
    title="Run your first application at the edge today."
    description="Deploy once and it runs in every location on the network — no servers to size, no credit card to start."
  >
    <template #actions>
      <Button label="Start for free" />
      <Button
        kind="outlined"
        label="Talk to a specialist"
      />
    </template>
  </CallToAction>
</template>
```

### WithEyebrow

```vue
<script setup>
  import CallToAction from '@aziontech/webkit/call-to-action'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <CallToAction
    eyebrow="Get started"
    title="Run your first application at the edge today."
    description="Deploy once and it runs in every location on the network — no servers to size, no credit card to start."
  >
    <template #actions>
      <Button label="Start for free" />
      <Button
        kind="outlined"
        label="Talk to a specialist"
      />
    </template>
  </CallToAction>
</template>
```

### Types

```vue
<script setup>
  import CallToAction from '@aziontech/webkit/call-to-action'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xxl)">
    <CallToAction
      eyebrow="Get started"
      title="Run your first application at the edge today."
      description="Deploy once and it runs in every location on the network."
    >
      <template #actions>
        <Button label="Start for free" />
        <Button
          kind="outlined"
          label="Talk to a specialist"
        />
      </template>
    </CallToAction>

    <CallToAction
      kind="split"
      eyebrow="Build"
      title="Build once."
      title-muted="Run anywhere."
      description="Get a faster path to launch, less latency, and less infrastructure overhead."
    >
      <template #actions>
        <Button
          kind="secondary"
          label="Start for free"
        />
      </template>
      <template #aside>
        <Button
          kind="outlined"
          label="Talk to our team"
        />
      </template>
    </CallToAction>

    <CallToAction
      kind="lead"
      eyebrow="Build"
      title="Built by you,"
      title-muted="or your agents."
      description="Same CLI, same docs over MCP, same deploy — whether you run it or your agent does."
    >
      <template #actions>
        <Button
          kind="secondary"
          label="Deploy now"
        />
        <Button
          kind="outlined"
          label="Docs"
        />
      </template>
    </CallToAction>
  </div>
</template>
```
