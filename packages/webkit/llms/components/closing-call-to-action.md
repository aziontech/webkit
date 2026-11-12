# Closing Call To Action

> The last ask at the end of a landing page, followed by a hatched closing frame with no rules of its own, because the site footer under it opens with one. It is a page section — the site places it from a `{ _id: 'closing-call-to-action', props }` entry and binds `props` straight onto it — and it composes `section-module`, `call-to-action`, `button`, `frame-box` and `texture-material`. `kind` picks the layout only: `split` sets the headline and the primary action in a raised lead cell beside an aside cell carrying the description and the secondary action, over a tall closing frame; `panel` sets the copy and its actions on one surface, over a short closing frame; `primary` is the loud close, one centred ask on the canvas under a pixelated texture whose waves keep travelling, over a tall closing frame. All three take the same copy and the same two actions.

- Import: `import ClosingCallToAction from '@aziontech/webkit/closing-call-to-action'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [closing-call-to-action.json](https://github.com/aziontech/webkit/blob/main/.specs/closing-call-to-action.json)

## When to use

- To close a solution or product page on its one or two asks (`split`), or a page such as Careers on one action (`panel`), or a page that ends on its one loud ask (`primary`).

## Do

- Place it last on the page, right above `site-footer`, after a hatched `section-gap`.
- Set `anchor: 'contact'` so the page's contact links scroll to the close.
- In `split`, keep `title` and `titleMuted` to one short line each; `panel` and `primary` do not draw `titleMuted`, and `primary` does not draw `eyebrow`.

## Don’t

- For a newsletter sign-up close → use `closing-call-to-action-newsletter`.
- For an ask in the middle of a page → compose `call-to-action` directly.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [call-to-action](call-to-action.md) — the framed band this section renders.
- [closing-call-to-action-newsletter](closing-call-to-action-newsletter.md) — the closing band whose ask is a subscribe form.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `kind` | `ClosingCallToActionKind` | `'split'` | false | Layout of the band: `split` is a raised lead cell beside an aside cell over a tall closing frame, `panel` one surface over a short closing frame, `primary` a centred ask under a pixelated texture over a tall closing frame. |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `eyebrow` | `string` | `''` | false | Short overline above the headline; not drawn in `primary`. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the call to action as its `h2`; the band renders nothing when empty. |
| `titleMuted` | `string` | `''` | false | Second line of the headline in muted ink; drawn in `split` only. |
| `description` | `string` | `''` | false | Supporting sentence: in the aside cell in `split`, under the headline in `panel`. |
| `primaryAction` | `ClosingCallToActionAction` | `undefined` | false | The white button of the band, under the headline in `split`; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent. |
| `secondaryAction` | `ClosingCallToActionAction` | `undefined` | false | The outlined button of the band, in the aside cell in `split` and beside the primary one in `panel` and `primary`; `{ label, href, trailing? }`. Omitted when absent. |

## States

- Visual states: `default`
- `data-kind` mirrors the `kind` prop and drives the call-to-action layout and the closing frame height
- `primary`: the call to action takes its `primary` register with a pixelated `texture-material` in its `background` slot; its waves stop under reduced motion (owned by `texture-material`)
- Empty: when `title` is empty the band renders nothing but its root
- Each action renders only when given

## Accessibility

- Visible focus: owned by the composed buttons.
- Keyboard map: `Tab` reaches the primary then the secondary action; `Enter` follows it.
- ARIA: the `call-to-action` renders the band's `<section>` named by its title; the root is a plain `div` so the band has one landmark. The closing frame is decorative.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `call-to-action` and `button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the texture and the buttons carry their own fallback.
- Touch target ≥40×40 px — the actions are large buttons.

## Examples

### Default

```vue
<script setup>
  import ClosingCallToAction from '@aziontech/webkit/closing-call-to-action'

  const primaryAction = {
    label: 'Start for free',
    href: 'https://console.azion.com/signup?tck=build_cta'
  }

  const secondaryAction = {
    label: 'Talk to a specialist',
    href: 'https://www.azion.com/en/contact/',
    trailing: true
  }
</script>

<template>
  <ClosingCallToAction
    kind="split"
    anchor="contact"
    eyebrow="Build"
    title="Build once."
    title-muted="Run everywhere."
    description="Get a faster path to launch, lower latency, and less infrastructure overhead."
    :primary-action="primaryAction"
    :secondary-action="secondaryAction"
  />
</template>
```

### Types

```vue
<script setup>
  import ClosingCallToAction from '@aziontech/webkit/closing-call-to-action'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <ClosingCallToAction
      kind="split"
      anchor="contact"
      eyebrow="Build"
      title="Build once."
      title-muted="Run everywhere."
      description="Get a faster path to launch, lower latency, and less infrastructure overhead."
      :primary-action="{
        label: 'Start for free',
        href: 'https://console.azion.com/signup?tck=build_cta'
      }"
      :secondary-action="{
        label: 'Talk to a specialist',
        href: 'https://www.azion.com/en/contact/',
        trailing: true
      }"
    />
    <ClosingCallToAction
      kind="panel"
      title="Ready to join us?"
      description="See our open positions and find the right fit."
      :primary-action="{ label: 'See open roles', href: '/en/careers/jobs/', trailing: true }"
    />
    <ClosingCallToAction
      kind="primary"
      title="Build, run, and protect applications everywhere."
      description="Get faster launches, lower latency, and less infrastructure overhead from day one."
      :primary-action="{ label: 'Start for free', href: '/signup' }"
      :secondary-action="{ label: 'Docs', href: '/docs', trailing: true }"
    />
  </div>
</template>
```
