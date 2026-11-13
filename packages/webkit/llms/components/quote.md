# Quote

> A single customer testimonial: the quotation, who said it, and optionally the mark of the company they said it for. It is the smallest unit of social proof on a marketing page, and it is deliberately one quote — a wall of them is a layout built from several of these, not a prop on one. Three registers, one component. `inline` is the quiet unit that sits inside a cell of a larger band — the mark on a fixed band above the words, the quotation at the smallest heading size, and no quotation glyph, so a row of them reads as a row of claims. `signed` is the card-sized register a client sentence or an analyst report takes: the mark above, the quotation glyph, the quotation in body type, and the attribution stacked as the speaker (or the report) in the accent over their role (or its date). `highlight` is the featured register — the quotation set largest beside the company mark, which is given its own column at the quotation's first line; the speaker's likeness is drawn beside the attribution only when a `photo` is given. Every register attributes the same way: the name in the accent and the role in the muted ink, both in overline type, one over the other. The register changes the weight and the arrangement, never the anatomy: every register is one `figure` holding one `blockquote` and one `figcaption`, so the quotation and its attribution stay paired at the depth HTML requires.

- Import: `import Quote from '@aziontech/webkit/quote'`
- Category: marketing · Surface: marketing · Structure: monolithic
- API as JSON: [quote.json](https://github.com/aziontech/webkit/blob/main/.specs/quote.json)

## When to use

- To carry one customer statement inside a marketing section.
- Whenever a claim the page makes is better made by the customer who verified it.
- As the repeated unit of a testimonial row or grid, one instance per quote — in `inline`, where every cell carries equal weight.
- In `signed`, as a product page's own client sentence, usually beside that page's client marks.
- In `highlight`, for the one quotation a page features above the others.

## Do

- Keep `text` to one or two sentences. A testimonial that needs a paragraph is a case study, and belongs behind a link.
- Give `name` the speaker and `job-title` their title and company — or, for an analyst report, the report and its date. The two lines are set in different inks, so passing one joined string collapses that distinction.
- Quote verbatim. Do not add quotation marks to `text` — `signed` and `highlight` open on the component's own quotation glyph, sized to that register's measure, so a typed `"` doubles it; `inline` carries no glyph, because its unit is a claim inside a larger band.
- Give `logo` a company mark only. A person's likeness is `photo`, which only `highlight` draws.
- Give `logo` a mark that carries its own contrast. It is drawn as-is — no filter, one URL, no per-theme swap — so a mark drawn in a single ink reads on one theme and disappears on the other. Use the `mark` slot instead when the mark is a component that owns its own theming.
- Use `highlights` to lift the measured claim out of a quotation — the figure and what it measured (`86% faster load times`), not a whole clause. Every phrase must appear in `text` verbatim; the rest of the sentence recedes to the muted ink, so a quotation that highlights most of itself highlights nothing.
- Put a trailing control in `actions` rather than beside the quote. The band floors it, which is what keeps a row of quotes aligned on their controls whatever each quotation's length.

## Don’t

- For a measured figure rather than a statement → use `big-numbers`.
- For an inline aside or callout inside documentation → use `doc-callout`.
- For a dismissible or status message → use `message`.
- For a logo row with no quotation → compose the marks directly; a `quote` without `text` is not a logo wall.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [big-numbers](big-numbers.md) — the numeric form of the same proof band.
- [card-grid](card-grid.md) — the uniform grid a row of peer quotes is laid out on; `bento-grid` when one quote is given more weight than its neighbours.
- [avatar](avatar.md) — the person's likeness, composed by the `highlight` register when a `photo` is given.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `text` | `string` | `—` | true | The quotation itself, rendered as the `blockquote` body; overridden by the default slot. |
| `name` | `string` | `''` | false | Who said it — the attribution's lead, set in the accent. |
| `jobTitle` | `string` | `''` | false | Their role and company, as one line — the attribution's second part. Named `jobTitle`, not `role`, because `role` is the ARIA attribute and a prop of that name reads as one to both tooling and the consumer. |
| `photo` | `string` | `''` | false | URL of the person's likeness, drawn beside the attribution by `highlight`; without one the attribution stands alone. |
| `logo` | `string` | `''` | false | URL of the company mark; ignored when the `mark` slot is filled. |
| `logoAlt` | `string` | `''` | false | Alternative text for the mark; falls back to `jobTitle` when empty. |
| `highlights` | `string[]` | `[]` | false | Phrases of `text` kept in the default ink while the rest of the quotation recedes to the muted one; each is matched verbatim, and an empty list leaves the whole quotation in the default ink. Ignored when the default slot is filled. |
| `kind` | `QuoteKind` | `'inline'` | false | Register of the quote: `inline` is the quiet unit inside a larger band, `signed` the band-sized client sentence, `highlight` the featured one. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Quotation body; replaces the `text` prop when provided. |
| `mark` | — | The company mark; replaces the image built from `logo`, for a mark that owns its own theming. |
| `actions` | — | A trailing control under the attribution, floored so a row of quotes aligns on it. |

## States

- Visual states: `default`
- Register: `data-kind="inline" | "signed" | "highlight"` on the root
- No mark is rendered when neither `logo` nor the `mark` slot is given, and the quotation moves up to lead the block
- No `figcaption` is rendered when neither `name` nor `jobTitle` is given
- Highlighted: when `highlights` matches at least one phrase of `text`, the `blockquote` carries `data-highlighted` and its text recedes to the muted ink; each matched phrase is a `data-highlight` span in the default ink. A phrase absent from `text` is skipped, and when none match the quotation renders unhighlighted
- In `highlight`, the likeness is drawn only when `photo` is given; there is no initials fallback
- In `highlight`, the mark takes its own column beside the quotation from `md` up, and leads the block above it below `md`
- In `highlight`, a quote stretched taller than its content by the band holding it gives the slack to the quotation: the attribution and the `actions` area floor at the bottom, so quotations of different lengths share one line for both
- `signed` and `highlight` lead with the quotation glyph; it is decorative and `aria-hidden`, so the `blockquote`'s accessible text stays the quotation alone. `inline` draws none

## Accessibility

- Visible focus: not applicable — the quote is static copy and holds no interactive control.
- Keyboard map: none of its own; the block contains no focusable element and is skipped by `Tab`.
- ARIA: the quotation is a real `blockquote` inside a `figure`, and the attribution is its `figcaption`, so the statement and its source are announced as one unit; the mark carries `logoAlt`, falling back to `jobTitle`, and is never left with an empty accessible name while it conveys the company.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the quotation is `var(--text-default)` — or, with `highlights`, `var(--text-muted)` around phrases in `var(--text-default)`; the attribution uses `var(--text-muted)`, which clears AA on the dark canvas and is a known theme-level shortfall on the light one (see `big-numbers`).
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the block is static.
- Touch target ≥40×40 px — not applicable, no interactive target.

## Examples

### Default

```vue
<script setup>
  import magaluLogo from '@aziontech/webkit/assets/magalu-extended-color.svg'
  import Quote from '@aziontech/webkit/quote'
</script>

<template>
  <Quote
    text="Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks."
    name="Allan Monteiro"
    job-title="CISO & Head of Technology at Magalu"
    :logo="magaluLogo"
  />
</template>
```

### Types

```vue
<script setup>
  import magaluLogo from '@aziontech/webkit/assets/magalu-extended-color.svg'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
  import Quote from '@aziontech/webkit/quote'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xxl)">
    <Quote
      kind="inline"
      text="Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks."
      name="Allan Monteiro"
      job-title="CISO & Head of Technology at Magalu"
      :logo="magaluLogo"
    />
    <Quote
      kind="signed"
      text="Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks."
      name="Allan Monteiro"
      job-title="CISO & Head of Technology at Magalu"
      :logo="magaluLogo"
    />
    <Quote
      kind="highlight"
      text="Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks."
      name="Allan Monteiro"
      job-title="CISO & Head of Technology at Magalu"
      :photo="placeholderImage"
      :logo="magaluLogo"
    />
  </div>
</template>
```

### WithoutLogo

```vue
<script setup>
  import Quote from '@aziontech/webkit/quote'
</script>

<template>
  <Quote
    text="Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks."
    name="Allan Monteiro"
    job-title="CISO & Head of Technology at Magalu"
  />
</template>
```
