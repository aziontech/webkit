# ClosingCallToActionSection

The last ask at the end of a landing page, after a hatched gap. A closing frame follows it, with no rules of its own, because the site footer under it opens with one.

Most pages end with the panel form, with one or two actions, and only its copy changes per page; Careers ends with the single-action panel. The primary form is the loud close, for a page that ends on its one ask.

The panel and primary forms are the `ClosingCallToActionSection` component from `@aziontech/webkit/closing-call-to-action-section`; it composes `SectionModule`, `CallToAction`, `Button` and `RegistrationFrame`, with `Texture` on the closing frame (and behind the copy in `primary`), and `variant` picks the form (`panel` or `primary`). The newsletter form is its own component, `NewsletterSection` from `@aziontech/webkit/newsletter-section`, since its ask is a subscribe form. The agents form is the `primary` form with `audiences`: a switch between ways in (a person or an agent), each with its own copyable line and actions, and a typed line under them; it loads `ToggleGroup`, `InputGroup` and `CopyButton` only when `audiences` is set. The templates close is `TemplateGallerySection` from `@aziontech/webkit/template-gallery-section` with `closing` set, which draws the closing frame under its scrolling grid of deployable templates.

## Examples

### Panel

The Careers close. A panel with one action to the job listing, then a short closing frame.

Example: [`site-panel.vue`](./site-panel.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `variant` is `panel`.
- `title` is the headline of the panel, and `description` the sentence under it. `eyebrow` is drawn above the headline.
- `primaryAction` is the panel button, with a `label`, an `href` and `trailing` for the chevron. A `secondaryAction` sits beside it as an outlined button.

Example:

Site JSON: [`site-panel.json`](./site-panel.json)

<hr
  style={{
    margin: 'var(--spacing-2xl) 0 var(--spacing-lg)',
    border: 0,
    borderTop: '1px solid var(--border-default)'
  }}
/>

### Primary

The loud close. One centred ask on the canvas, under a pixelated `Texture` whose two waves keep travelling across it. The closing frame follows. The waves stop under reduced motion.

Example: [`site-primary.vue`](./site-primary.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `variant` is `primary`; `anchor` is the band's id for in-page links, `contact` by convention.
- `title` is the headline and `description` the sentence under it. `eyebrow` is not drawn, so the headline stands alone over the texture.
- `primaryAction` is the white button and `secondaryAction` the outlined one beside it. Each takes a `label`, an `href` and `trailing` for the chevron.
- `command` is an optional shell line set before the actions, with the `$` prompt and a copy button; `panel` takes it too. See [`command.vue`](./command.vue).

Example:

Site JSON: [`site-primary.json`](./site-primary.json)

### Audiences

The close for a reader who may be a person or an agent: the `primary` form with `audiences`. A small `ToggleGroup` under the title switches the way in: For humans offers the sign-up and a specialist, For agents hands over a prompt that connects the Azion MCP server. Each way carries an optional copyable line and its actions, then two lines that are the same for every audience, so the band keeps its height when the switch changes. The swapped row sits in a polite live region and fades in, with no motion under reduced motion.

Example: [`site-audiences.vue`](./site-audiences.vue)

##### Use it on the site

Add this entry to the `sections` array of the page JSON. `_id` picks the block and `props` fill it:

- `variant` is `primary`; `anchor` is the band's id for in-page links, `contact` by convention; `title` is the headline.
- `audiences` are the ways in, each a `value` and a `label` for the switch; the first one opens. `copy` is an optional line to copy: `text` is what the field shows and the button copies, `label` names the copy button, `shell` draws the `$` prompt before a command. `actions` are the buttons beside it, each a `label`, an `href`, a `variant` (`secondary` for the white pill, `outline` by default) and `trailing` for the chevron. With `audiences` set, `command`, `primaryAction` and `secondaryAction` are not drawn.
- `typedLead` and `typedWords` make the first line under the row. The lead stays put, and the words are typed, held, erased and typed again, in order, behind a blinking cursor. Screen readers get the whole sentence at once, and reduced motion shows every word at once with no cursor. `description` is the line under it.
- `audiencesAriaLabel` names the switch and `lineAriaLabel` the copyable field for assistive tech.

Example:

Site JSON: [`site-audiences.json`](./site-audiences.json)

<hr
  style={{
    margin: 'var(--spacing-2xl) 0 var(--spacing-lg)',
    border: 0,
    borderTop: '1px solid var(--border-default)'
  }}
/>

### Stacked closings and the bare frame

Every closing band draws the hatched closing frame under itself. When two closings stack, the upper one sets `hatch: false` so the page closes once; `SitePage` does it for you. A page that ends on a band with its own actions closes on `{ "_id": "closing-call-to-action-section", "props": { "kind": "frame" } }`, the frame alone, with no gap before it.

Example: [`stacked.vue`](./stacked.vue)
