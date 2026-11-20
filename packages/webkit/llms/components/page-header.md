# Page Header

> The heading that opens a console page: an h1 whose `size` picks the heading token by page level, a one-line description, and the actions the page owns on the right. When the row runs out of room the actions move below the copy together; on a phone they stack, each at full width. Four optional regions complete a detail page's header without local markup: a `breadcrumbs` trail above the title, an `icon` before it, `meta` (a status tag, a version) beside it, and `tabs` across the bottom. It replaces the header markup every list, detail, settings and create page used to copy by hand.

- Import: `import PageHeader from '@aziontech/webkit/page-header'`
- Category: layout · Surface: app · Structure: monolithic
- API as JSON: [page-header.json](page-header.json)

## When to use

- Use PageHeader once per console page for the h1, description and page actions; a band inside the page uses Subheader.
- The top of any console page: a first-level list (`medium`), a detail tab or settings sub-page (`small`), a creation hub headline (`large`).
- A page that owns actions (Documentation, a create action) that belong next to its title.
- A resource detail page whose header carries the trail back to the list, the resource's icon, its status and the tabs of its sections (`breadcrumbs`, `icon`, `meta`, `tabs`).

## Do

- One PageHeader per page; it renders the page's only h1.
- Put the Documentation link first and the create action on the outer edge. Every action is `size="medium"`, so the row keeps one height; the create action is `variant="primary"`, Documentation and the others `variant="outline"` (`webkit/consistent-header-action-size`).
- Do not set `class="w-full"` on the action buttons; the header makes them full width on a phone.
- Set `titleId` when a form or landmark names itself with `aria-labelledby`.
- `breadcrumbs`: pass a `Breadcrumb` with `items`; its last entry is the current page and should match the title.
- `icon`: one decorative glyph or a square `Avatar`, at most 32 px; it is `aria-hidden` by default, since the title already names the page.
- `meta`: one or two small `Tag`s (status, environment). Longer facts (owner, created date) belong in the page body, not the header.
- `tabs`: a `Tabs` row of the page's sections. A page that already shows `PageTabs` above the header leaves this slot empty; never both.

## Don’t

- The heading of one band inside a page → use `subheader`.
- A settings band with a Hint and a card of rows → use `settings-group`.
- A documentation page heading → use `doc-page-header`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [subheader](subheader.md) — the h2 band heading inside a page.
- [page-tabs](page-tabs.md) — the second-level navigation strip that sits above a detail page's header; a header-local tab row goes in the `tabs` slot.
- [breadcrumb](breadcrumb.md) — the usual content of the `breadcrumbs` slot.
- [tag](tag.md) — the usual content of the `meta` slot (a status, an environment, a version).
- [button](button.md) — the usual content of the `actions` slot (`size="medium"`; the create action primary, the others outlined).

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `—` | true | The page title, rendered as the page h1. |
| `description` | `string` | `''` | false | One sentence under the title that says what the page is for. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Heading scale of the title. |
| `titleId` | `string` | `''` | false | Id set on the h1, so a landmark or form can name itself with aria-labelledby. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `description` | — | Rich description content (links, inline buttons); replaces the `description` prop. |
| `actions` | — | The actions the page owns, Documentation first and the create action on the outer edge. |
| `breadcrumbs` | — | The trail back to the parent pages, above the title row; usually a `Breadcrumb` with `items`. |
| `icon` | — | A leading glyph or square avatar before the title, decorative (`aria-hidden`). |
| `meta` | — | Short facts beside the title, such as a status `Tag`; wraps under the title when the row is narrow. |
| `tabs` | — | The tabs of the page's sections, across the full width under the title and actions. |

## States

- Visual states: `default`
- `data-size` mirrors the `size` prop on the root and the h1
- Each region renders only when its slot is filled: `__breadcrumbs` (a full-width row above the title row), `__icon` (before the h1, `aria-hidden`), `__meta` (after the h1 on the same line, wrapping under it), `__tabs` (a full-width row after the copy and the actions). With no region slot the header renders exactly as before.
- Responsive: the root is the `@container/page-header`. Below `@md` of its own box the actions drop under the copy and each one stretches to the full width; from `@md` they sit beside the title at their own width. A header inside a drawer or a split view lays out for that box, not the window.

## Accessibility

- Visible focus: owned by the controls in the `actions` slot.
- Keyboard map: `Tab` moves through the actions in DOM order; the header itself is not interactive.
- ARIA: the root is a `header` element and the title is the page's only `h1`. The `h1` carries `tabindex="-1"` and no focus ring (`outline-none`): it is not a tab stop, but a router or a page can move focus to it on navigation so a screen reader announces the page (the console keyboard standard, `rules/webkit-keyboard.md`); it is a heading, not a control, so it draws no ring; `titleId` lets a form or landmark reference it with `aria-labelledby`. The breadcrumb comes first in reading order (its own `nav` landmark), then the h1, the meta, the description, the actions and the tabs. The icon wrapper is `aria-hidden`.
- Keyboard map with regions: `Tab` reaches the breadcrumb links, then the actions, then the tabs (which own their arrow-key model).
- Contrast ≥4.5:1 for the title and the muted description.
- Touch target: the actions keep the Button sizes; on a phone they stretch to full width.

## Right-to-left

- Layout: flex order and logical utilities only, so the icon leads the title and the actions trail under `dir="rtl"`.
- Icons: the `icon` region is consumer content; the header mirrors nothing itself.
- Keyboard: no arrow-key logic in the header; the tabs in the `tabs` slot own theirs.
- User data: the title is consumer text; a resource name in another script can be wrapped in `bdi` by the consumer.

## Internationalization

No built-in strings: the title, description and every region come from the consumer.

- Formatting: none

## Responsive

- Container queries: the root is `@container/page-header`; below `@md` the actions drop under the copy at full width.
- Narrow (≤ 640 px or a narrow container): the meta wraps under the title; the breadcrumb collapses on its own (`Breadcrumb` `items` mode); the tabs row scrolls inside `Tabs`.
- Touch: the actions keep the Button sizes; no hover-only affordance.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### ListPage

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import PageHeader from '@aziontech/webkit/page-header'
</script>

<template>
  <PageHeader
    title="Resources"
    description="View and manage your resources."
  >
    <template #actions>
      <Button
        label="Documentation"
        icon="az az-book"
        variant="outline"
        size="medium"
        href="https://example.com/docs/resources"
        target="_blank"
      />
      <Button
        label="Create Resource"
        icon="az az-plus"
        variant="primary"
        size="medium"
      />
    </template>
  </PageHeader>
</template>
```

### SettingsPage

```vue
<script setup>
  import PageHeader from '@aziontech/webkit/page-header'
</script>

<template>
  <PageHeader
    title="Settings"
    description="Core configuration for this resource."
    size="small"
  />
</template>
```

### Sizes

```vue
<script setup>
  import PageHeader from '@aziontech/webkit/page-header'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <PageHeader
      title="Start a new project"
      description="Start from a repository or use a framework template."
      size="large"
    />
    <PageHeader
      title="Resources"
      description="View and manage your resources."
    />
    <PageHeader
      title="Settings"
      description="Core configuration for this resource."
      size="small"
    />
  </div>
</template>
```
