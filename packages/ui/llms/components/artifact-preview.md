# Artifact Preview

> A card for something the assistant generated — a file, a code snippet, a table, a configuration (Cloudscape artifact previews, AI Elements Artifact). The header names it (title, description, metadata such as size or format, a file-type icon) and carries its actions: Copy (when `copyValue` is set), Download (when `downloadHref` is set) and Open (when `openable`, emitting `open` so the owner shows the full artifact in a side panel — Cloudscape's canvas preview). The body holds a short inline preview (Cloudscape's inline preview): the first lines of code, the first rows of a table.

- Import: `import ArtifactPreview from '@aziontech/ui/artifact-preview'`
- Category: ai · Surface: app · Structure: monolithic
- API as JSON: [artifact-preview.json](artifact-preview.json)

## When to use

- The assistant produced an artifact the reader may copy, download or open: a rules file, a CSV export, a command, a generated function.

## Do

- Stack artifacts below the message text, one card each; do not nest them in the bubble.
- Keep artifact actions in the card and message actions in `ChatMessage.Actions`.
- Express sizes in KB, MB or GB in `meta`.
- Long or editable content opens (canvas); the inline body stays a preview.

## Don’t

- Short code inside the prose of a response → fenced code in `StreamingResponse` (rendered as `CodeBlock`).
- A resource that already exists in the product → link to its page; this card is for generated content.
- Uploads the reader attached → `file-dropzone` items or chips in `PromptInput`'s attachments.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [code-block](code-block.md) — the usual inline preview body.
- [drawer](drawer.md) — where an `open` artifact is shown in full.
- [chat-message](chat-message.md) — artifacts stack under the response, not inside its bubble.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `—` | true | File name or title of what was generated (`cache-rules.json`). |
| `description` | `string` | `''` | false | One line on what it is or does. |
| `meta` | `string` | `''` | false | Facts that help recognize it: size, rows, language (`2.4 KB · JSON`). |
| `icon` | `string` | `'az az-file'` | false | Icon class for the file type. |
| `copyValue` | `string` | `''` | false | Text the Copy control puts on the clipboard. Empty hides Copy. |
| `downloadHref` | `string` | `''` | false | URL of the file for the Download control. Empty hides Download. |
| `openable` | `boolean` | `false` | false | Shows Open, which emits `open` so the owner shows the full artifact in a side panel or page (a canvas preview). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `open` | `(event: MouseEvent)` |  |
| `copy` | `(event: MouseEvent, value: string)` |  |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The inline preview; scrolls inside a 20 rem body. |
| `actions` | — | Extra icon actions, placed before Copy and Download. |

## Assets

- Icons: every valid name is in [icons.md](../foundations/icons.md) (MCP `list_assets({ kind: "icons" })`). An unknown class renders nothing.

## Sub-components

_None. Exports: `"./artifact-preview"`. Composed DS components: `button` (Open), `copy-button`,
`icon-button` (Download)._

## States

- `data-openable`; body rendered only when the default slot is used.

## Accessibility

- Visible focus: controls carry their own rings; the scrollable body is focusable with an inset ring.
- Keyboard map: `Tab` through the header actions, then into the body.
- ARIA: `<article aria-labelledby>` its `h3` title; Copy, Download and Open are named with the title (`Copy cache-rules.json`); the icon tile is `aria-hidden`; the visible `Open` text is contained in its accessible name.

## Right-to-left

- Layout: logical utilities; actions at the inline end.
- Icons: maximize (Open, which opens the in-page canvas, not a new tab) and download are not mirrored.
- Keyboard: none.
- User data: the title text (a file name) is isolated in `bdi`; the heading follows the page direction, so it stays beside the icon in right-to-left.

## Internationalization

| Key                         | English source     | Override prop |
| --------------------------- | ------------------ | ------------- |
| `artifactPreview.open`      | `Open`             | —             |
| `artifactPreview.openLabel` | `Open {title}`     | —             |
| `artifactPreview.copy`      | `Copy {title}`     | —             |
| `artifactPreview.download`  | `Download {title}` | —             |

- Formatting: the owner formats `meta` (sizes with `Intl.NumberFormat`).

## Responsive

- Container queries: none.
- Narrow: title and description truncate; actions stay.
- Touch: actions are `IconButton` / small `Button` (44 px on coarse pointers).
- Reflow: the body scrolls inside the card.

## Examples

### Default

```vue
<script setup>
  import ArtifactPreview from '@aziontech/ui/artifact-preview'
  import CodeBlock from '@aziontech/ui/code-block'
  import { ref } from 'vue'

  const opened = ref(false)
  const rules = JSON.stringify(
    {
      cache_by_query_string: 'allowlist',
      query_string_fields: ['page', 'lang'],
      browser_cache_ttl: 3600,
      edge_cache_ttl: 86400
    },
    null,
    2
  )
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-sm)">
    <ArtifactPreview
      title="cache-rules.json"
      description="Cache settings for storefront"
      meta="1 KB · JSON"
      icon="az az-code"
      :copy-value="rules"
      openable
      @open="opened = true"
    >
      <CodeBlock
        :tabs="[{ label: 'JSON', value: 'json', code: rules, language: 'json' }]"
        :show-line-numbers="false"
        :copyable="false"
        :bordered="false"
      />
    </ArtifactPreview>
    <p
      v-if="opened"
      class="text-body-sm text-(--text-muted)"
    >
      The full file opens in a side panel here.
    </p>
  </div>
</template>
```

### Table

```vue
<script setup>
  import ArtifactPreview from '@aziontech/ui/artifact-preview'
  import Table from '@aziontech/ui/table'

  const rows = [
    { country: 'United States', requests: '1,204,330', hit: '92%' },
    { country: 'United Kingdom', requests: '884,102', hit: '89%' },
    { country: 'Portugal', requests: '120,448', hit: '95%' }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <ArtifactPreview
      title="cache-hits-by-country.csv"
      description="Last 7 days"
      meta="48 KB · 212 rows"
      icon="az az-table"
      download-href="data:text/csv;charset=utf-8,country,requests,hit"
    >
      <Table density="compact">
        <Table.Header>
          <Table.Row>
            <Table.HeadCell principal>Country</Table.HeadCell>
            <Table.HeadCell align="end">Requests</Table.HeadCell>
            <Table.HeadCell align="end">Hit ratio</Table.HeadCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row
            v-for="row in rows"
            :key="row.country"
          >
            <Table.Cell principal>{{ row.country }}</Table.Cell>
            <Table.Cell align="end"
              ><span class="tabular-nums">{{ row.requests }}</span></Table.Cell
            >
            <Table.Cell align="end"
              ><span class="tabular-nums">{{ row.hit }}</span></Table.Cell
            >
          </Table.Row>
        </Table.Body>
      </Table>
    </ArtifactPreview>
  </div>
</template>
```
