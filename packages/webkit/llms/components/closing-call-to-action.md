# Closing Call To Action

> The last ask at the end of a landing page, followed by a hatched closing frame with no rules of its own, because the site footer under it opens with one. It is a page section — the site places it from a `{ _id: 'closing-call-to-action', props }` entry and binds `props` straight onto it — and it composes `section-module`, `call-to-action`, `button`, `frame-box` and `texture-material`. `kind` picks the layout only: `split` sets the headline and the primary action in a raised lead cell beside an aside cell carrying the description and the secondary action, over a tall closing frame; `panel` sets the copy and its actions on one surface, over a short closing frame; `primary` is the loud close, one centred ask on the canvas under a pixelated texture whose waves keep travelling, over a tall closing frame. All three take the same copy, the same two actions and an optional copyable shell `command` set before the actions. `frame` draws the closing frame alone, with no ask: the close of a page whose last band already carries its own action. `hatch` turns the closing frame off when another closing band stacks directly below and draws the shared one (`site-page` sets it for stacked closings).

- Import: `import ClosingCallToAction from '@aziontech/webkit/closing-call-to-action'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [closing-call-to-action.json](https://github.com/aziontech/webkit/blob/main/.specs/closing-call-to-action.json)

## When to use

- To close a solution or product page on its one or two asks (`split`), or a page such as Careers on one action (`panel`), or a page that ends on its one loud ask (`primary`).

## Do

- Place it last on the page, right above `site-footer`, after a hatched `section-gap`. It draws the hatched closing frame itself, so nothing follows it inside the page column: no trailing `SectionGap` and no closing `FrameBox` + `TextureMaterial` (the `shells/website` close is for a page that ends on any other band). `webkit/no-gap-after-closing-section` flags the doubled close.
- Set `anchor: 'contact'` so the page's contact links scroll to the close.
- Use `kind: 'frame'` (no copy) to close a page that ends on a band with its own actions (a listing, a legal page); `site-page` draws no gap before it.
- Turn `hatch` off only on a closing band that another closing band follows directly; the last one keeps the frame.
- Give `command` a short shell line (`npm create azion@latest`); it is copied as written and reads as a command, with the `$` prompt.
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
| `kind` | `ClosingCallToActionKind` | `'split'` | false | Layout of the band: `split` is a raised lead cell beside an aside cell over a tall closing frame, `panel` one surface over a short closing frame, `primary` a centred ask under a pixelated texture over a tall closing frame, `frame` the tall closing frame alone. |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `eyebrow` | `string` | `''` | false | Short overline above the headline; not drawn in `primary`. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the call to action as its `h2`; the band renders nothing when empty. |
| `titleMuted` | `string` | `''` | false | Second line of the headline in muted ink; drawn in `split` only. |
| `description` | `string` | `''` | false | Supporting sentence: in the aside cell in `split`, under the headline in `panel`. |
| `primaryAction` | `ClosingCallToActionAction` | `undefined` | false | The white button of the band, under the headline in `split`; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent. |
| `secondaryAction` | `ClosingCallToActionAction` | `undefined` | false | The outlined button of the band, in the aside cell in `split` and beside the primary one in `panel` and `primary`; `{ label, href, trailing? }`. Omitted when absent. |
| `command` | `string` | `''` | false | Shell command on a copyable line before the actions, copied as written; drawn in `split`, `panel` and `primary`. |
| `hatch` | `boolean` | `true` | false | Draws the hatched closing frame under the band; turn it off when another closing band stacks directly below and draws the shared frame. |

## States

- Visual states: `default`
- `data-kind` mirrors the `kind` prop and drives the call-to-action layout and the closing frame height
- `primary`: the call to action takes its `primary` register with a pixelated `texture-material` in its `background` slot; its waves stop under reduced motion (owned by `texture-material`)
- `frame`: only the tall closing frame renders, whatever the copy; `hatch` does not apply
- `hatch` off: the band renders without its closing frame
- Empty: when `title` is empty the band renders nothing but its root (except in `frame`)
- Each action and the command line render only when given

## Accessibility

- Visible focus: owned by the composed buttons.
- Keyboard map: `Tab` reaches the command line and its copy button, then the primary and the secondary action; `Enter` follows an action.
- ARIA: the `call-to-action` renders the band's `<section>` named by its title; the root is a plain `div` so the band has one landmark. The closing frame is decorative.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `call-to-action` and `button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the texture and the buttons carry their own fallback.
- Touch target ≥40×40 px — the actions are large buttons.

## Right-to-left

- Layout: logical utilities only; the split cells mirror as `call-to-action` lays them out.
- Icons: the trailing chevron on an action mirrors with `button`; the texture is not mirrored.
- Keyboard: no arrow-key handling.
- User data: the command line renders `dir="ltr"` (owned by `section-command`).

## Internationalization

No built-in strings of its own: every visible text is a prop from the page JSON. The command line's field and copy button names come from `section-command` (`sectionCommand.command`, `sectionCommand.copyCommand`).

- Formatting: none.

## Responsive

- Container queries: none of its own; `call-to-action` stacks the split cells below `lg`.
- Narrow (below `lg`): the lead and aside cells stack; the command line takes the full width above the actions.
- Touch: the actions are large buttons and the copy button is large; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; a long command scrolls inside its field.

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

### Command

```vue
<script setup>
  import ClosingCallToAction from '@aziontech/webkit/closing-call-to-action'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <ClosingCallToAction
      kind="primary"
      anchor="contact"
      title="Start your first project from the terminal."
      description="One command scaffolds a project and deploys it to every data center."
      command="npm create azion@latest"
      :primary-action="{ label: 'Start for free', href: '/signup' }"
      :secondary-action="{ label: 'Docs', href: '/docs', trailing: true }"
    />
  </SectionContainer>
</template>
```
