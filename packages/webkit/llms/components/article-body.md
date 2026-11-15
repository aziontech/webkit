# Article Body

> The reading page of an article. A brand banner sits over a three-column grid: the share, community and copy-page rail on the left; the breadcrumb, headline, byline and prose down the middle at a reading measure; and the "On this page" outline on the right. Both rails stick under the header and fold away below `lg`, leaving the column alone. The section opens the page itself, so it carries its own `section-container` instead of sitting in the page column. The prose arrives as markdown: `##` / `###` headings (each with an id slugged from its text, feeding the outline), fenced code blocks, `-` and numbered lists and paragraphs, with inline links, `**strong**`, `*emphasis*` and `` `code` `` inside paragraphs and list items. The outline follows the reader: the heading last scrolled past is active, and choosing an entry scrolls to it (smoothly unless reduced motion is set) and writes its hash to the address. The byline can carry the writers' names and their photos as overlapping avatars. It is a page section — the site places it from a `{ _id: 'article-body', props }` entry and binds `props` straight onto it — and it composes `section-container`, `section-module`, `registration-frame`, `breadcrumb`, `hero-title`, `divider`, `doc-prose`, `tooltip`, `icon-button`, `split-button`, `avatar` and `doc-on-this-page`; copying to the clipboard is local behaviour, confirmed by a toast.

- Import: `import ArticleBody from '@aziontech/webkit/article-body'`
- Category: section · Surface: site · Structure: monolithic
- API as JSON: [article-body.json](https://github.com/aziontech/webkit/blob/main/.specs/article-body.json)

## When to use

- To open every blog post and every success story page.

## Do

- Write the body as plain blocks — headings, paragraphs and `-` lists separated by blank lines; inline markdown is rendered as text.
- Mark the last breadcrumb entry `active` (it renders `aria-current="page"`).

## Don’t

- For a list of articles → use `article-index`.
- For a closing row of related articles → use `article-cards`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [doc-prose](doc-prose.md) — the reading-measure typography the body renders in.
- [doc-on-this-page](doc-on-this-page.md) — the outline rail fed by the body's headings.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `eyebrow` | `string` | `''` | false | Eyebrow above the headline. |
| `article` | `ArticleBodyArticle` | `—` | true | The piece being read: its `title` (the page h1), `description`, `date`, `readTime`, canonical `href`, and optionally `author` (the writers' names) and `authors` (each a `name` and an `avatar` photo URL). |
| `trail` | `BreadcrumbItemData[]` | `[]` | false | The breadcrumb over the headline, each a `label` and an `href`, the last one marked `active`. |
| `body` | `string` | `''` | false | The article as markdown; its `##` and `###` headings feed the outline. |
| `banner` | `string` | `''` | false | URL of the image over the masthead; the banner frame is omitted when empty. |
| `share` | `ArticleBodyShare` | `undefined` | false | Labels of the share group: its `title`, `copyLink`, `shareX` and `shareLinkedIn`, optional `copyFeed` with the `feed` URL it copies, and optional toast messages `copiedLink`, `copiedFeed` and `copiedPage`; the group is omitted when absent. |
| `community` | `ArticleBodyCommunity` | `undefined` | false | The community group: a `title` and `links`, each a `label`, an `href` and an `icon`; omitted when absent. |
| `copyPage` | `ArticleBodyCopyPage` | `undefined` | false | The copy-page split button: its `label` and a `menu` of entries, each a `value`, a `label` and an `icon`; omitted when absent. |
| `assistants` | `Record<string, string>` | `{}` | false | URL templates of the assistants the copy-page menu opens, keyed by menu `value`; `{prompt}` in a template is replaced by the encoded prompt to read the article. |
| `anchor` | `string` | `''` | false | In-page id set on the band so a hash link can target it. |

## States

- Visual states: `default`, `hover` and `focus-visible` on every link and button
- The outline lists the body's headings; it is omitted when the body has none
- Scroll-spy: the first heading is active on the server and on load; after mount the active heading is the last one whose top has scrolled above the header line (120 px), updated on scroll; choosing an outline entry scrolls its heading into view (`smooth`, or instant under reduced motion), makes it active and replaces the address hash
- The left rail renders only the groups that are set, and is omitted when none is
- Copying: the copy-link button and the `link` menu entry copy the current page URL (`article.href` when there is none); the copy-feed button (when `share.copyFeed` and `share.feed` are set) copies `share.feed`; the split button's main action copies the page as markdown (headline, deck, body); each success raises a success toast (`share.copiedLink` / `copiedFeed` / `copiedPage`, or the locale default), and a failed clipboard write raises an error toast. Toasts render where the page mounts a `Toaster`
- Copy-page menu: the `link` entry copies the URL; the `markdown` entry opens the page as plain-text markdown in a new tab; an entry whose `value` is a key of `assistants` opens that template in a new tab with `{prompt}` replaced by the encoded prompt `Read <article.href> so I can ask questions about it.`
- Byline: with `authors`, overlapping large avatars (photo, or initials without one) lead the byline; with `author`, the names sit above the date and read time
- Prose: fenced code blocks render as `pre`/`code`; numbered lists as `ol`; a full `http` link opens in a new tab

## Accessibility

- Visible focus: every link and button shows a `focus-visible` ring.
- Feedback: copy results are announced by the `Toaster`'s live region; the outline's active entry carries `aria-current` (owned by `doc-on-this-page`).
- Keyboard map: `Tab` moves through the breadcrumb, the rails and the prose links; the split button owns its menu keyboard map.
- ARIA: the root is a plain `div` so the page keeps its own landmarks; the headline is the page `h1` (from `hero-title`); the prose is an `article`; the two rails are `aside` landmarks, the left one named by the share title, the right one by the outline's own navigation; the share and community groups are named `section`s; icon-only share buttons are named by their labels and carry a tooltip; the banner is decorative (`aria-hidden`, `alt=""`); heading ids are slugged from their text.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text uses `--text-default` / `--text-muted`.
- `motion-reduce:transition-none` on every transition.
- Touch target ≥40×40 px — owned by `icon-button` and `split-button`.

## Right-to-left

- Layout: logical utilities only; the rails swap sides with the grid under `rtl`.
- Icons: share and copy glyphs and brand marks do not mirror.
- Keyboard: unchanged; the split button owns its menu map.
- User data: code blocks keep `dir="ltr"`.

## Internationalization

| Key                           | English source                                | Override prop      |
| ----------------------------- | --------------------------------------------- | ------------------ |
| `articleBody.linkCopied`      | `Link copied`                                 | `share.copiedLink` |
| `articleBody.copiedFeed`      | `Feed link copied`                            | `share.copiedFeed` |
| `articleBody.copiedPage`      | `Page copied as markdown`                     | `share.copiedPage` |
| `articleBody.copyFailed`      | `Could not copy`                              | —                  |
| `articleBody.copyFailedHint`  | `Your browser blocked clipboard access.`      | —                  |
| `articleBody.assistantPrompt` | `Read {url} so I can ask questions about it.` | —                  |

- Every other string (labels, trail, the article) arrives through props.
- Formatting: none; the date and read time arrive pre-formatted.

## Responsive

- Container queries: none; from `lg` the grid has three columns with sticky rails.
- Narrow (< `lg`): both rails fold away and the column stands alone; code blocks scroll sideways inside themselves.
- Touch: owned by `icon-button` and `split-button`.
- Reflow: no horizontal page scroll at 320 px; only a code block scrolls.

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
      href: 'https://www.azion.com/en/success-case/magalu/',
      author: 'Jane Doe',
      authors: [{ name: 'Jane Doe' }]
    }"
    :trail="[
      { label: 'Success cases', href: '/success-cases' },
      { label: 'Retail', href: '/success-cases?industry=Retail' },
      { label: 'Magalu Ensures High Availability at Scale with Azion', active: true }
    ]"
    :share="{
      title: 'Share this article',
      copyLink: 'Copy link',
      copyFeed: 'Copy RSS feed',
      feed: 'https://example.com/blog/feed.xml',
      shareX: 'Share on X',
      shareLinkedIn: 'Share on LinkedIn'
    }"
    :community="{
      title: 'Community',
      links: [
        {
          label: 'Join us on Discord',
          href: 'https://discord.com/invite/Yp9N7RMVZy',
          icon: 'ai ai-discord'
        },
        { label: 'Read our blog posts', href: '/blog', icon: 'ai ai-comment' },
        { label: 'Follow us on X', href: 'https://twitter.com/aziontech', icon: 'ai ai-x-brand' }
      ]
    }"
    :copy-page="{
      label: 'Copy page',
      menu: [
        { value: 'link', label: 'Get page link', icon: 'ai ai-link' },
        { value: 'markdown', label: 'View page as markdown', icon: 'ai ai-eye' }
      ]
    }"
  />
</template>
```
