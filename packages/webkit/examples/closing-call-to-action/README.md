# ClosingCallToAction

The last ask at the end of a landing page, after a hatched gap. A closing frame follows it, with no rules of its own, because the site footer under it opens with one.

Almost every page ends with the split form, and only its copy changes per page. Careers ends with the single-action panel. The primary form is the loud close, for a page that ends on its one ask.

The split, panel and primary forms are the `ClosingCallToAction` component from `@aziontech/webkit/closing-call-to-action`; it composes `SectionModule`, `CallToAction`, `Button` and `FrameBox`, with `TextureMaterial` on the closing frame (and behind the copy in `primary`), and `kind` picks the form (`split`, `panel` or `primary`). The newsletter form is its own component, `ClosingCallToActionNewsletter` from `@aziontech/webkit/closing-call-to-action-newsletter`, since its ask is a subscribe form. The agents form is its own component too, `ClosingCallToActionAgents` from `@aziontech/webkit/closing-call-to-action-agents`, since it carries an audience switch and a typed line; it composes `CallToAction` in its `primary` register with `ToggleGroup`, `InputGroup`, `CopyButton` and `Button`. The templates form is its own component as well, `ClosingCallToActionTemplates` from `@aziontech/webkit/closing-call-to-action-templates`, since it splits the `primary` ask and a scrolling grid of deployable templates side by side; it composes `SectionTitle`, `ScrollArea`, `CardGrid`, `TextureMaterial` and `Button`.

## Examples

### Split

The solution pages close. `Start for free` sits under the headline and `Talk to a specialist` in the side cell, then a tall closing frame. The band carries the `contact` anchor, so the page contact links scroll to it.

Example: [`site-split.vue`](./site-split.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `kind` is `split`; `anchor` is the band's id for in-page links, `contact` by convention.
- `eyebrow` is a short overline, such as Build.
- `title` is the first line of the headline, and `titleMuted` the second line, in muted ink.
- `description` is the sentence in the side cell.
- `primaryAction` is the white button under the headline, and `secondaryAction` the outlined button in the side cell. Each takes a `label`, an `href` and `trailing` for the chevron.

Example:

Site JSON: [`site-split.json`](./site-split.json)

<hr
  style={{
    margin: 'var(--spacing-xxl) 0 var(--spacing-lg)',
    border: 0,
    borderTop: '1px solid var(--border-default)'
  }}
/>

### Panel

The Careers close. A panel with one action to the job listing, then a short closing frame.

Example: [`site-panel.vue`](./site-panel.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `kind` is `panel`.
- `title` is the headline of the panel, and `description` the sentence under it. `eyebrow` is drawn above the headline; `titleMuted` is not drawn.
- `primaryAction` is the panel button, with a `label`, an `href` and `trailing` for the chevron. A `secondaryAction` sits beside it as an outlined button.

Example:

Site JSON: [`site-panel.json`](./site-panel.json)

<hr
  style={{
    margin: 'var(--spacing-xxl) 0 var(--spacing-lg)',
    border: 0,
    borderTop: '1px solid var(--border-default)'
  }}
/>

### Primary

The loud close. One centred ask on the canvas, under a pixelated `TextureMaterial` whose two waves keep travelling across it. The closing frame follows. The waves stop under reduced motion.

Example: [`site-primary.vue`](./site-primary.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `kind` is `primary`; `anchor` is the band's id for in-page links, `contact` by convention.
- `title` is the headline and `description` the sentence under it. `eyebrow` and `titleMuted` are not drawn, so the headline stands alone over the texture.
- `primaryAction` is the white button and `secondaryAction` the outlined one beside it. Each takes a `label`, an `href` and `trailing` for the chevron.
- `command` is an optional shell line set before the actions, with the `$` prompt and a copy button; `split` and `panel` take it too. See [`command.vue`](./command.vue).

Example:

Site JSON: [`site-primary.json`](./site-primary.json)

<hr
  style={{
    margin: 'var(--spacing-xxl) 0 var(--spacing-lg)',
    border: 0,
    borderTop: '1px solid var(--border-default)'
  }}
/>

### Stacked closings and the bare frame

Every closing band draws the hatched closing frame under itself. When two closings stack, the upper one sets `hatch: false` so the page closes once; `SitePage` does it for you. A page that ends on a band with its own actions closes on `{ "_id": "closing-call-to-action", "props": { "kind": "frame" } }`, the frame alone, with no gap before it.

Example: [`stacked.vue`](./stacked.vue)
