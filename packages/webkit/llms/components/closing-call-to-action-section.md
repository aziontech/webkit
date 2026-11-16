# Closing Call To Action Section

> The last ask at the end of a landing page, followed by a hatched closing frame with no rules of its own, because the site footer under it opens with one. It is a page section — the site places it from a `{ _id: 'closing-call-to-action-section', props }` entry and binds `props` straight onto it — and it composes `section-module`, `call-to-action`, `button`, `registration-frame` and `texture`. `variant` picks the layout only: `panel` (the default) sets the copy and its actions on one surface, over a short closing frame; `primary` is the loud close, one centred ask on the canvas under a pixelated texture whose waves keep travelling, over a tall closing frame. Both take the same copy, the same two actions and an optional copyable shell `command` set before the actions. `frame` draws the closing frame alone, with no ask: the close of a page whose last band already carries its own action. `hatch` turns the closing frame off when another closing band stacks directly below and draws the shared one (`site-page` sets it for stacked closings). In `primary`, `audiences` turns the ask into a switch between ways in (a person or an agent): each audience swaps in its own copyable line and actions, and a typed line (`typedLead` + `typedWords`) loops under them; the switch block loads on demand, only when `audiences` is set.

- Import: `import ClosingCallToActionSection from '@aziontech/webkit/closing-call-to-action-section'`
- Category: section · Surface: site · Structure: monolithic
- API as JSON: [closing-call-to-action-section.json](closing-call-to-action-section.json)

## When to use

- Use ClosingCallToActionSection for the last band before the site footer that asks for one action, with links or a command.
- Rendering page JSON, or you need a whole band with no custom content → this section. Building an SFC by hand, needing slots, or nesting inside another band → the `call-to-action` primitive.
- In `primary` with `audiences`, to close a page whose reader may be a person or an agent, each with its own way in.
- To close a solution or product page on its one or two asks, or a page such as Careers on one action (`panel`), or a page that ends on its one loud ask (`primary`).

## Do

- Place it last on the page, right above `site-footer-section`, after a hatched `section-gap`. It draws the hatched closing frame itself, so nothing follows it inside the page column: no trailing `SectionGap` and no closing `RegistrationFrame` + `Texture` (the `shell/site` close is for a page that ends on any other band). `webkit/no-gap-after-closing-section` flags the doubled close.
- Set `anchor: 'contact'` so the page's contact links scroll to the close.
- Use `variant: 'frame'` (no copy) to close a page that ends on a band with its own actions (a listing, a legal page); `site-page` draws no gap before it.
- Turn `hatch` off only on a closing band that another closing band follows directly; the last one keeps the frame.
- Give `command` a short shell line (`npm create azion@latest`); it is copied as written and reads as a command, with the `$` prompt.
- Give `audiences` two or more entries so the switch renders; set `audiencesAriaLabel` and `lineAriaLabel` so the switch and the copyable field are named. With `audiences` set, `description` is the closing sentence under the typed line, and `command` and the two actions are not drawn.
- Mark a command line with `copy.shell` so it draws the `$` prompt; leave a prompt meant for an agent bare.
- Keep `title` to one short line; `primary` does not draw `eyebrow`.

## Don’t

- For a newsletter sign-up close → use `newsletter-section`.
- For a close that lists deployable templates → use `template-gallery-section` with `closing`.
- For an ask in the middle of a page → compose `call-to-action` directly.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [call-to-action](call-to-action.md) — the framed band this section renders.
- [newsletter-section](newsletter-section.md) — the closing band whose ask is a subscribe form.
- [template-gallery-section](template-gallery-section.md) — with `closing`, the closing band that lists deployable templates.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `ClosingCallToActionSectionVariant` | `'panel'` | false | Layout of the band: `panel` is one surface over a short closing frame, `primary` a centred ask under a pixelated texture over a tall closing frame, `frame` the tall closing frame alone. |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `eyebrow` | `string` | `''` | false | Short overline above the headline; not drawn in `primary`. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the call to action as its `h2`; the band renders nothing when empty. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `primaryAction` | `SectionTitleAction` | `undefined` | false | The white button of the band, under the headline; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent. |
| `secondaryAction` | `SectionTitleAction` | `undefined` | false | The outlined button of the band, beside the primary one; `{ label, href, trailing? }`. Omitted when absent. |
| `command` | `string` | `''` | false | Shell command on a copyable line before the actions, copied as written; drawn in `panel` and `primary`. |
| `hatch` | `boolean` | `true` | false | Draws the hatched closing frame under the band; turn it off when another closing band stacks directly below and draws the shared frame. |
| `audiences` | `ClosingCallToActionSectionAudience[]` | `[]` | false | The ways in of the `primary` close, in switch order; each is `{ value, label, copy?, actions? }` (`copy` is `{ label, text, shell? }`, `shell` drawing the `$` prompt; an action is `{ label, href, variant?, trailing? }`) and the first one opens. Replaces the command and the two actions; the switch renders only with two or more. |
| `typedLead` | `string` | `''` | false | Fixed opening of the typed line under the audiences, before the typed word. |
| `typedWords` | `string[]` | `[]` | false | Words typed, held, erased and typed again in order after `typedLead`; the typed line renders only with `audiences` and words. |
| `audiencesAriaLabel` | `string` | `''` | false | Accessible name of the audience switch. |
| `lineAriaLabel` | `string` | `''` | false | Accessible name of the read-only field that shows an audience's copyable line. |

## States

- Visual states: `default`
- `data-variant` mirrors the `variant` prop and drives the call-to-action layout and the closing frame height
- `primary`: the call to action takes its `primary` register with a pixelated `texture` in its `background` slot; its waves stop under reduced motion (owned by `texture`)
- `frame`: only the tall closing frame renders, whatever the copy; `hatch` does not apply
- `hatch` off: the band renders without its closing frame
- Empty: when `title` is empty the band renders nothing but its root (except in `frame`)
- Each action and the command line render only when given
- `audiences` (in `primary`): picking an audience swaps the copyable line and the actions; the swapped row sits in a polite live region and fades in. After mount the typed words are typed (90 ms a character), held (1.8 s), erased (45 ms a character) and the next one typed (after 270 ms), in a loop; the timer is cleared on scope dispose. Under reduced motion every word shows at once, joined by commas, and the cursor is hidden

## Accessibility

- Visible focus: owned by the composed buttons.
- Keyboard map: `Tab` reaches the command line and its copy button, then the primary and the secondary action; `Enter` follows an action. With `audiences`, `Tab` reaches the switch (arrow keys move it, owned by `toggle-group`), the copy button and each action.
- With `audiences`: the switch is a `radiogroup` named by `audiencesAriaLabel`; the swapped row is `aria-live="polite"`; the read-only field is named by `lineAriaLabel` and the copy button by the audience's `copy.label`. The typed line reads its whole sentence from a visually hidden copy while the animated letters are `aria-hidden`.
- ARIA: the `call-to-action` renders the band's `<section>` named by its title; the root is a plain `div` so the band has one landmark. The closing frame is decorative.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `call-to-action` and `button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — see the Motion table; under reduced motion nothing types or blinks, and the texture and the buttons carry their own fallback.
- Touch target ≥40×40 px — the actions are large buttons.

## Right-to-left

- Layout: logical utilities only (`ms-px` on the typed-line cursor); the panel mirrors as `call-to-action` lays it out.
- Icons: the trailing chevron on an action mirrors with `button`; the texture is not mirrored.
- Keyboard: the audience switch's arrow keys follow the direction (owned by `toggle-group`); nothing else handles arrows.
- User data: the command line renders `dir="ltr"` (owned by `copy-command-section`).

## Internationalization

No built-in strings of its own: every visible text is a prop from the page JSON, including the switch, field and copy-button names of `audiences` (`audiencesAriaLabel`, `lineAriaLabel`, `copy.label`). The command line's field and copy button names come from `copy-command-section` (`copyCommandSection.command`, `copyCommandSection.copyCommandSection`).

- Formatting: none.

## Responsive

- Container queries: none of its own; `call-to-action` lays out the panel.
- Narrow (below `lg`): the command line takes the full width above the actions.
- Touch: the actions are large buttons and the copy button is large; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; a long command scrolls inside its field.

## Examples

### Default

```vue
<script setup>
  import ClosingCallToActionSection from '@aziontech/webkit/closing-call-to-action-section'

  const primaryAction = {
    label: 'Start for free',
    href: 'https://console.azion.com/signup?tck=build_cta'
  }

  const secondaryAction = {
    label: 'Talk to sales',
    href: 'https://www.azion.com/en/contact/',
    trailing: true
  }
</script>

<template>
  <ClosingCallToActionSection
    variant="panel"
    anchor="contact"
    eyebrow="Build"
    title="Build once. Run everywhere."
    description="Get a faster path to launch, lower latency, and less infrastructure overhead."
    :primary-action="primaryAction"
    :secondary-action="secondaryAction"
  />
</template>
```

### Variants

```vue
<script setup>
  import ClosingCallToActionSection from '@aziontech/webkit/closing-call-to-action-section'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <ClosingCallToActionSection
      variant="panel"
      anchor="contact"
      eyebrow="Build"
      title="Build once. Run everywhere."
      description="Get a faster path to launch, lower latency, and less infrastructure overhead."
      :primary-action="{
        label: 'Start for free',
        href: 'https://console.azion.com/signup?tck=build_cta'
      }"
      :secondary-action="{
        label: 'Talk to sales',
        href: 'https://www.azion.com/en/contact/',
        trailing: true
      }"
    />
    <ClosingCallToActionSection
      variant="panel"
      title="Ready to join us?"
      description="See our open positions and find the right fit."
      :primary-action="{ label: 'See open roles', href: '/en/careers/jobs/', trailing: true }"
    />
    <ClosingCallToActionSection
      variant="primary"
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
  import ClosingCallToActionSection from '@aziontech/webkit/closing-call-to-action-section'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <ClosingCallToActionSection
      variant="primary"
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
