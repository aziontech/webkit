# Doc On This Page

> The "On this page" rail: the page's own headings, the active one lit, nested headings indented under their parent — followed by the rail's complementary groups (the repository, the community). The rail is a single path that bends inward as the outline nests, and the active marker is a dash cut from that same path, so moving between headings slides the marker **along** the line, through the bends, rather than jumping a separate bar between two positions.

- Import: `import DocOnThisPage from '@aziontech/webkit/doc-on-this-page'`
- Category: documentation · Surface: docs · Structure: monolithic
- API as JSON: [doc-on-this-page.json](https://github.com/aziontech/webkit/blob/main/.specs/doc-on-this-page.json)

## When to use

- Beside the body of a long documentation page, as in-page navigation over its `h2`/`h3` outline.
- To carry a page's peer links (repository, community) under the outline, each as its own named group.

## Do

- Feed it depth 2 and 3 only; the rail indents each level by 8px and a third level reads as noise.
- Own the active heading in the page (a scroll-spy) and pass it down; do not expect the rail to guess.
- Keep the complementary groups to peers of the page, never sections of it — a reader must not read "Join us on Discord" as part of what they are reading.

## Don’t

- Expecting it to track scroll. It is presentation only: `activeId` is a prop, because the page owns the scroll container and therefore owns which heading is active.
- For navigation _between_ pages — that is `DocPagination` at the foot, or the sidebar.
- For an outline deeper than a couple of levels; the indent is legible for two, not for five.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- DocPageHeader` — the masthead above the body, whose `h1` is chrome, so the outline starts at `h2`.
- DocPagination` — navigation between documents, where this is navigation within one.
- use-heading-nav` — the composable a page uses to receive a rail activation and scroll its own container.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `DocTocItem[]` | `[]` | false | The headings, in document order. |
| `activeId` | `string` | `''` | false | The id of the heading currently in view. |
| `title` | `string` | `''` | false | The rail's own heading. Empty uses the locale catalog (`On this page`). |
| `groups` | `DocTocGroup[]` | `[]` | false | Complementary groups rendered below the outline, in order. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `select` | `(event: MouseEvent, item: DocTocItem)` | Fired when a rail entry is activated; the page decides what scrolling means. Event first, per `event-payloads.md`. |

## States

- Visual states: `default`, `hover` (a morphing highlight follows the pointer), and the active entry
- The active entry carries `aria-current="location"`; the marker is a dash cut from the rail path, positioned by measured length rather than by an index
- The complementary groups are deliberately drawn as peers: no rail, no indent, no active marker

## Accessibility

- Visible focus: each entry takes the focus ring on `focus-visible`.
- Keyboard map: `Tab` moves through the entries and then through each group's links; `Enter` activates. The rail owns no arrow-key model — it is a list of links, not a widget.
- ARIA: the outline is a `nav` named by `title`, and **each complementary group is its own named `nav`**, so the three read as three landmarks rather than one long list. Entries are `li` children of a `ul` (the axe `list` rule requires that), and the active entry carries `aria-current="location"`. The rail path and the group glyphs are decorative (`aria-hidden`). Under `dir="rtl"` the rail svg is mirrored (`rtl:-scale-x-100`), so its depth bends step toward the inline end like the entries they follow.
- The marker is never the only signal: the active entry also changes ink and carries `aria-current`, so the state does not depend on seeing the dash.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons).
- Touch target: entries are padded rows; the rail itself is not interactive.

## Examples

### Default

```vue
<script setup>
  import DocOnThisPage from '@aziontech/webkit/doc-on-this-page'
</script>

<template>
  <DocOnThisPage
    :items="[
      { id: 'deploy', text: 'Deploy an application', depth: 2 },
      { id: 'what-you-get', text: 'What you get', depth: 3 },
      { id: 'build-command', text: 'Build command', depth: 3 },
      { id: 'bind-a-domain', text: 'Bind a domain', depth: 2 }
    ]"
    active-id="what-you-get"
    :groups="[
      {
        label: 'Repository',
        links: [
          { label: 'View source', href: 'https://github.com/aziontech', icon: 'pi pi-github' }
        ]
      }
    ]"
    @select="(event, item) => scrollToHeading(item.id)"
  />
</template>
```

### Nesting

```vue
<script setup>
  import DocOnThisPage from '@aziontech/webkit/doc-on-this-page'
</script>

<template>
  <div class="max-w-64">
    <DocOnThisPage
      :items="[
        { id: 'overview', text: 'Overview', depth: 2 },
        { id: 'templates', text: 'Templates', depth: 3 },
        { id: 'presets', text: 'Framework presets', depth: 3 },
        { id: 'domains', text: 'Domains', depth: 2 },
        { id: 'certificates', text: 'Certificates', depth: 3 }
      ]"
      active-id="presets"
      :groups="[
        {
          label: 'Repository',
          links: [
            { label: 'View source', href: 'https://github.com/aziontech', icon: 'pi pi-github' }
          ]
        },
        {
          label: 'Community',
          links: [
            { label: 'Discord', href: 'https://discord.gg', icon: 'pi pi-comments' },
            { label: 'Forum', href: 'https://forum.example', icon: 'pi pi-users' }
          ]
        }
      ]"
    />
  </div>
</template>
```
