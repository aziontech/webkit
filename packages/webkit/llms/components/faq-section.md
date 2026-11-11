# Faq Section

> The frequently asked questions band near the end of a landing page: the heading in the left column and the questions on the right, each answer closed until the reader opens it, one at a time. It is a page section — the site places it from a `{ _id: 'faq-section', props }` entry and binds `props` straight onto it — and it composes `section-module` and `faq`. An answer is a markdown string, so it can run to several paragraphs (split by a blank line) and `- ` bullet lists, and a sentence can carry a link, bold or italic text, all without a slot or `v-html`.

- Import: `import FaqSection from '@aziontech/webkit/faq-section'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [faq-section.json](https://github.com/aziontech/webkit/blob/main/.specs/faq-section.json)

## When to use

- To answer the handful of questions a reader still has before the closing call to action.

## Do

- Use one FAQ section per page and give it `anchor: 'faq'` so a page can link straight to it.
- Keep an answer short; links use `[label](https://github.com/aziontech/webkit/blob/main/.specs/href)`, bold `**text**` and italic `*text*`.
- Separate paragraphs with a blank line; start each bullet with `- ` and keep the list in its own block.
- Absolute `https://` links open in a new tab; site-relative links stay in the tab.

## Don’t

- For answers that need content beyond paragraphs, bullet lists and inline links (tables, images, code) → compose `faq` with its `answer` slot.
- For a single highlighted question with an action → use `call-to-action`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [faq](faq.md) — the framed accordion band this section renders.
- [closing-call-to-action](closing-call-to-action.md) — the band that usually follows it.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the FAQ as its `h2` in the left column. |
| `items` | `FaqSectionItem[]` | `[]` | false | The questions in display order; each is `{ question, answer }` where `answer` is markdown carrying paragraphs, bullet lists, links, bold and italic text. |

## States

- Visual states: `default`, `open` (one answer at a time, owned by the composed accordion)
- Empty: when `items` is empty the band renders nothing but its root
- An answer renders `[label](https://github.com/aziontech/webkit/blob/main/.specs/href)` as a link, `**text**` as bold and `*text*` as italic; any other text is shown as written
- An answer with a blank line or `- ` lines renders as stacked paragraphs and an ARIA list (`role="list"` / `listitem`, inside the accordion's paragraph); a single-paragraph answer renders as inline text, as before

## Accessibility

- Visible focus: owned by the composed accordion triggers and the answer links.
- Keyboard map: `Tab` moves between the questions and the links of an open answer; `Enter` / `Space` toggles a question.
- ARIA: the `faq` renders the band's `<section>` labelled by its `h2`; the root is a plain `div` so the band has one landmark. A link that opens a new tab carries `rel="noopener noreferrer"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `faq`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the accordion carries its own fallback.
- Touch target ≥40×40 px — owned by the accordion triggers.

## Examples

### Default

```vue
<script setup>
  import FaqSection from '@aziontech/webkit/faq-section'
</script>

<template>
  <FaqSection
    anchor="faq"
    title="Frequently asked questions"
    :items="[
      {
        question: 'What types of storefronts can I build and deploy on Azion?',
        answer:
          'You can build and deploy storefronts, marketplaces, campaign pages, and supporting retail apps. Any web app or website runs on Azion. The platform also covers much of the backend, for static and dynamic workloads on a distributed architecture.'
      },
      {
        question: 'Which frameworks are compatible?',
        answer:
          'Azion is compatible with modern frameworks such as Next.js, React, Vue, Astro, Angular, Nuxt, Svelte, and others, so you can reuse your current stack without a full rewrite. See the full [frameworks compatibility list](https://github.com/aziontech/webkit/blob/main/.specs/en/documentation/products/devtools/azion-edge-runtime/frameworks-compatibility/).'
      },
      {
        question: 'How do preview deployments work?',
        answer:
          'You can validate storefront changes in preview environments before release, share results across teams, and promote approved versions to production with a controlled workflow.'
      }
    ]"
  />
</template>
```
