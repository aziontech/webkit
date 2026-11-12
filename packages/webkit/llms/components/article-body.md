# Article Body

> The reading page of an article. A brand banner sits over a three-column grid: the share, community and copy-page rail on the left; the breadcrumb, headline, byline and prose down the middle at a reading measure; and the "On this page" outline on the right. Both rails stick under the header and fold away below `lg`, leaving the column alone. The section opens the page itself, so it carries its own `section-container` instead of sitting in the page column. The prose arrives as markdown: blank-line separated blocks render as `##` / `###` headings (each with an id slugged from its text, feeding the outline), `-` lists and paragraphs. It is a page section — the site places it from a `{ _id: 'article-body', props }` entry and binds `props` straight onto it — and it composes `section-container`, `section-module`, `frame-box`, `breadcrumb`, `hero-title`, `divider`, `doc-prose`, `tooltip`, `icon-button`, `split-button` and `doc-on-this-page`; copying to the clipboard is local behaviour.

- Import: `import ArticleBody from '@aziontech/webkit/article-body'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [article-body.json](https://github.com/aziontech/webkit/blob/main/.specs/article-body.json)

## When to use

- To open every blog post and every success story page.

## Do

- Write the body as plain blocks — headings, paragraphs and `-` lists separated by blank lines; inline markdown is rendered as text.
- Mark the last breadcrumb entry `current`.

## Don’t

- For a list of articles → use `article-index-blog`.
- For a closing row of related articles → use `article-cards`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [doc-prose](doc-prose.md) — the reading-measure typography the body renders in.
- [doc-on-this-page](doc-on-this-page.md) — the outline rail fed by the body's headings.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `eyebrow` | `string` | `''` | false | Overline above the headline. |
| `article` | `ArticleBodyArticle` | `—` | true | The piece being read: its `title` (the page h1), `description`, `date`, `readTime` and canonical `href`. |
| `trail` | `ArticleBodyCrumb[]` | `[]` | false | The breadcrumb over the headline, each a `label` and an `href`, the last one marked `current`. |
| `body` | `string` | `''` | false | The article as markdown; its `##` and `###` headings feed the outline. |
| `banner` | `string` | `''` | false | URL of the image over the masthead; the banner frame is omitted when empty. |
| `share` | `ArticleBodyShare` | `undefined` | false | Labels of the share group: its `title`, `copyLink`, `shareX` and `shareLinkedIn`; the group is omitted when absent. |
| `community` | `ArticleBodyCommunity` | `undefined` | false | The community group: a `title` and `links`, each a `label`, an `href` and an `icon`; omitted when absent. |
| `copyPage` | `ArticleBodyCopyPage` | `undefined` | false | The copy-page split button: its `label` and a `menu` of entries, each a `value`, a `label` and an `icon`; omitted when absent. |

## States

- Visual states: `default`, `hover` and `focus-visible` on every link and button
- The outline lists the body's headings, the first one active; it is omitted when the body has none
- The left rail renders only the groups that are set, and is omitted when none is
- Copying: the copy-link button and the `link` menu entry copy `article.href`; the split button's main action copies the body; a failed clipboard write is ignored

## Accessibility

- Visible focus: every link and button shows a `focus-visible` ring.
- Keyboard map: `Tab` moves through the breadcrumb, the rails and the prose links; the split button owns its menu keyboard map.
- ARIA: the root is a plain `div` so the page keeps its own landmarks; the headline is the page `h1` (from `hero-title`); the prose is an `article`; the two rails are `aside` landmarks, the left one named by the share title, the right one by the outline's own navigation; the share and community groups are named `section`s; icon-only share buttons are named by their labels and carry a tooltip; the banner is decorative (`aria-hidden`, `alt=""`); heading ids are slugged from their text.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text uses `--text-default` / `--text-muted`.
- `motion-reduce:transition-none` on every transition.
- Touch target ≥40×40 px — owned by `icon-button` and `split-button`.

## Examples

### Default

```vue
<script setup>
  import ArticleBody from '@aziontech/webkit/article-body'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
</script>

<template>
  <ArticleBody
    eyebrow="Blog"
    :banner="placeholderImage"
    body="## Challenge&#10;&#10;Magalu is the most innovative retail company in LATAM.&#10;&#10;## Solution&#10;&#10;Magalu counts on Azion’s platform to evolve its security posture.&#10;&#10;## Results and Impact&#10;&#10;Magalu simplified security operations by blocking millions of threats per year."
    :article="{
      title: 'Magalu Ensures High Availability at Scale with Azion',
      description:
        'Explore how Magalu enhances cybersecurity with Azion’s Firewall and WAF, improving threat intelligence and bot management in retail.',
      date: 'FEB 4, 2022',
      readTime: '5 min read',
      href: 'https://www.azion.com/en/success-case/magalu/'
    }"
    :trail="[
      { label: 'Success cases', href: '/success-cases' },
      { label: 'Retail', href: '/success-cases?industry=Retail' },
      { label: 'Magalu Ensures High Availability at Scale with Azion', current: true }
    ]"
    :share="{
      title: 'Share this article',
      copyLink: 'Copy link',
      shareX: 'Share on X',
      shareLinkedIn: 'Share on LinkedIn'
    }"
    :community="{
      title: 'Community',
      links: [
        {
          label: 'Join us on Discord',
          href: 'https://discord.com/invite/Yp9N7RMVZy',
          icon: 'pi pi-discord'
        },
        { label: 'Read our blog posts', href: '/blog', icon: 'pi pi-comment' },
        { label: 'Follow us on X', href: 'https://twitter.com/aziontech', icon: 'ai ai-x' }
      ]
    }"
    :copy-page="{
      label: 'Copy page',
      menu: [
        { value: 'link', label: 'Get page link', icon: 'pi pi-link' },
        { value: 'markdown', label: 'View page as markdown', icon: 'pi pi-eye' }
      ]
    }"
  />
</template>
```
