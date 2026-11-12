# Page Header

> The heading that opens a console page: an h1 whose `size` picks the heading token by page level, a one-line description, and the actions the page owns on the right. When the row runs out of room the actions move below the copy together; on a phone they stack, each at full width. It replaces the header markup every list, detail, settings and create page used to copy by hand.

- Import: `import PageHeader from '@aziontech/webkit/page-header'`
- Category: layout · Surface: product · Structure: monolithic
- API as JSON: [page-header.json](https://github.com/aziontech/webkit/blob/main/.specs/page-header.json)

## When to use

- The top of any console page: a first-level list (`medium`), a detail tab or settings sub-page (`small`), a creation hub headline (`large`).
- A page that owns actions (Documentation, a create action) that belong next to its title.

## Do

- One PageHeader per page; it renders the page's only h1.
- Put the Documentation link first and the create action on the outer edge, both outlined at the medium size.
- Do not set `class="w-full"` on the action buttons; the header makes them full width on a phone.
- Set `titleId` when a form or landmark names itself with `aria-labelledby`.

## Don’t

- The heading of one band inside a page → use `section-header`.
- A settings band with a Hint and a card of rows → use `settings-section`.
- A documentation page heading → use `doc-page-header`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [section-header](section-header.md) — the h2 band heading inside a page.
- [page-tabs](page-tabs.md) — the second-level navigation strip that sits above a detail page's header.
- [button](button.md) — the usual content of the `actions` slot (outlined, `size="medium"`).

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

## States

- Visual states: `default`
- `data-size` mirrors the `size` prop on the root and the h1
- Responsive: the root is the `@container/page-header`. Below `@md` of its own box the actions drop under the copy and each one stretches to the full width; from `@md` they sit beside the title at their own width. A header inside a drawer or a split view lays out for that box, not the window.

## Accessibility

- Visible focus: owned by the controls in the `actions` slot.
- Keyboard map: `Tab` moves through the actions in DOM order; the header itself is not interactive.
- ARIA: the root is a `header` element and the title is the page's only `h1`; `titleId` lets a form or landmark reference it with `aria-labelledby`.
- Contrast ≥4.5:1 for the title and the muted description.
- Touch target: the actions keep the Button sizes; on a phone they stretch to full width.

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
        icon="pi pi-book"
        kind="outlined"
        size="medium"
        href="https://example.com/docs/resources"
        target="_blank"
      />
      <Button
        label="Create Resource"
        icon="pi pi-plus"
        kind="outlined"
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
