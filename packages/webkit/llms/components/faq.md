# Faq

> The frequently-asked-questions band of a marketing page: a two-column panel with the section's heading on the left and the answers as a disclosure list on the right. It is the page-level band, not the disclosure primitive — it composes `accordion`, which remains the right choice anywhere a bare expandable list is wanted. The band is drawn in the hairline register: the two columns and every row are separated by a one-pixel gap over a rule fill, so the seams are the grid's own gaps rather than borders on the cells. The rule under a row is held at the item's edge and drawn only while that item is open, which keeps exactly one rule per row in either state; the last row draws none, because it sits on the band's own floor. A single `--accordion-inset` hook, re-declared per breakpoint, puts the heading, every question and every answer on one content column.

- Import: `import Faq from '@aziontech/webkit/faq'`
- Category: marketing · Surface: marketing · Structure: monolithic
- API as JSON: [faq.json](https://github.com/aziontech/webkit/blob/main/.specs/faq.json)

## When to use

- As the FAQ band near the end of a marketing or pricing page.
- Whenever a page must answer a known set of objections without sending the reader to docs.
- When the answers are short enough to read in place rather than link out to.

## Do

- framed` decides who draws the rule. On, the band draws its own registration frame. Off, the rule and the corner marks belong to the `section-module` or `frame-box` the page assembles it into, so a band placed in an already-framed column never lands a second hairline on the column's own.
- Keep the band to the questions a reader actually asks before buying; a FAQ is objection handling, not a manual.
- Write each `question` as the reader would ask it, in their words rather than the product's.
- Keep answers to a couple of sentences and link out for the rest — use the `answer` slot when an answer needs a link or richer content.
- Give every item a stable `value`. It is the accordion's open-state key, so a reordered or re-keyed list loses whatever the reader had open.
- Leave the first item closed. An open answer on load pushes the rest of the list down and hides the range of questions.

## Don’t

- For a bare expandable list anywhere else → use `accordion` directly.
- For long-form reference content that belongs in documentation → use `doc-prose` and link to it.
- For a single expandable aside inside a section → use `accordion` with one item.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [accordion](accordion.md) — the disclosure primitive this band renders its answers through.
- [section-title](section-title.md) — the header for a section whose body is not a question list.
- [frame-box](frame-box.md) — the frame the band is drawn with, applied by whatever assembles the page; the band draws none of its own.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | false | Headline of the band, rendered as its `h2` in the left column. |
| `items` | `FaqItem[]` | `[]` | false | The questions and their answers, in order; each item is `{ value, question, answer }` where `value` is the item's stable key. |
| `framed` | `boolean` | `false` | false | Draw the band's own registration frame. Turn it off when the page already wraps the band in a frame. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `answer` | { item: FaqItem } | Replaces the rendered answer for every item, so an answer can carry a link or richer content. |

## States

- Visual states: `default`
- Each answer is closed on load; open state is owned by the composed `accordion`
- Empty: when `items` is empty the band renders no answer list and no frame

## Accessibility

- Visible focus: owned by the composed `accordion`, whose triggers carry the `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` ring.
- Keyboard map: delegated to `accordion` — `Tab` moves between questions, `Enter` / `Space` opens and closes the focused one.
- ARIA: the headline is a real `h2` and the band is a `<section>` labelled by it; the disclosure semantics (`aria-expanded`, the trigger/panel association) belong to `accordion` and are not re-declared here.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the headline is `var(--text-default)`; the question and answer colours are the composed `accordion`'s.
- `motion-reduce:transition-none motion-reduce:transform-none` — the open/close transition belongs to `accordion`, which carries its own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — the accordion trigger spans the column width and keeps its own target height.

## Examples

### Default

```vue
<script setup>
  import Faq from '@aziontech/webkit/faq'
</script>

<template>
  <Faq
    title="Frequently asked questions"
    :items="[
      {
        value: 'pricing',
        question: 'How does pricing work?',
        answer:
          'You pay for what you use — requests, data transfer and compute time — with no seats and no upfront commitment. Usage is metered and billed monthly.'
      },
      {
        value: 'free-tier',
        question: 'Is there a free tier?',
        answer:
          'Yes. Every core product has a monthly free allowance, and billing starts only once you pass it.'
      },
      {
        value: 'migration',
        question: 'How much work is it to migrate?',
        answer:
          'Most teams move a first workload in a day. Point the domain at us, keep the origin where it is, and cut traffic over once the numbers look right.'
      },
      {
        value: 'compliance',
        question: 'Where does my data run, and are you compliant?',
        answer:
          'You choose the regions a workload and its data are allowed in. Current audit reports and certifications are available on request.'
      },
      {
        value: 'support',
        question: 'What support do I get?',
        answer:
          'Every account has documentation, community and email support. Paid plans add a 24/7 incident channel and a named engineer.'
      }
    ]"
  />
</template>
```
