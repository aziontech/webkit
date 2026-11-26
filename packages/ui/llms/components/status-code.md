# Status Code

> Use StatusCode only for an HTTP status code or method (200, 404, GET); for resource state use StatusIndicator, and for any other word use Tag. StatusCode shows the HTTP status of a request, optionally preceded by its method, as one compact monospace pill whose colour comes from the status class: informational, success and redirect responses (1xx, 2xx, 3xx) stay neutral, client errors (4xx) take the warning colour and server errors (5xx) the danger colour, so failures stand out in a long request log without every successful row competing for attention. Anything that is not a status from 100 to 599 renders muted, as written. It composes `Tag` for the surface, so its sizes, shape and colours are the tag's; the component owns only the mapping from status to colour and the method plus code layout that every logs table would otherwise repeat.

- Import: `import StatusCode from '@aziontech/ui/status-code'`
- Category: content · Surface: app · Structure: monolithic
- API as JSON: [status-code.json](status-code.json)

## When to use

- A request log, an invocation list or a trace detail shows the HTTP status of each request (`GET 200`, `POST 503`).
- A detail panel summarizes the response of one request next to its timing and size.

## Do

- Pass the status as it comes from the log (`404` or `'404'`); the component derives the colour, so do not pick a colour per row.
- Pass `method` only when the list mixes methods; a list of `GET` requests reads better with the code alone.
- Keep the column narrow: the pill never wraps and is at most `GET` plus three digits wide for real traffic.

## Don’t

- The status is a resource lifecycle (`Active`, `Pending`, `Failed`) → use `tag` or `TableCellStatus`.
- The value is a security or incident level → use `severity-tag`.
- A dot that says whether a service is up → use `status-indicator`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [tag](tag.md) — the surface StatusCode composes; use it directly for statuses that are not HTTP codes.
- [table](table.md) — place StatusCode inside a `#cell-<id>` slot of a request log.
- [severity-tag](severity-tag.md) — ordered severity levels with a bar glyph.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `code` | `number \| string` | `''` | false | HTTP status, as a number or a string (`404`, `'404'`). 1xx to 3xx render neutral, 4xx warning, 5xx danger; anything else renders muted as written, empty a dash. |
| `method` | `string` | `''` | false | Request method shown before the code (`GET`, `POST`), upper-cased. Empty shows the code alone. |
| `size` | `'small' \| 'medium'` | `'medium'` | false | Size token forwarded to `Tag`; `medium` is 24px tall, `small` is 20px. |

## States

- `data-status-class` on the root: `informational` (1xx), `success` (2xx), `redirect` (3xx), `client-error` (4xx), `server-error` (5xx) or `invalid` (anything else, including empty).
- `data-size` mirrors `size` (set by `Tag`).
- The `Tag` severity follows the class: `neutral` for 1xx to 3xx and `invalid`, `warning` for 4xx, `danger` for 5xx.
- `invalid` mutes the text; an empty `code` shows a dash, any other invalid value shows as written.
- Non-interactive: no hover, focus, active or disabled state.

## Accessibility

- Visible focus: not applicable — StatusCode is non-interactive.
- Keyboard map: none.
- ARIA: plain text inside a `span`; the status number carries the meaning, so the colour is never the only cue (WCAG 1.4.1). Screen readers read `POST 503`.
- Contrast ≥4.5:1: the `Tag` severity pairs (`--warning` / `--warning-foreground`, `--danger` / `--danger-foreground`, `--text-default` on `--bg-canvas`) and `--text-muted` on `--bg-canvas` are theme-guaranteed in light and dark.
- `motion-reduce:*`: not applicable — no motion.
- Touch target: not applicable — non-interactive.

## Right-to-left

- Layout: the pill renders `dir="ltr"` so `GET 404` keeps its order inside right-to-left text; it uses logical gap only.
- Icons: none.
- Keyboard: none.
- User data: the method and code are Latin protocol tokens, isolated with `dir="ltr"`.

## Internationalization

_none_ — the method and the code are data and are never translated; the component has no built-in strings.

## Responsive

- Container queries: none.
- Narrow: `whitespace-nowrap` and `shrink-0`; at most about 9 characters wide, so it fits a 320 px column and a narrow table cell.
- Touch: not interactive.
- Reflow: no horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import StatusCode from '@aziontech/ui/status-code'
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-sm)">
    <StatusCode
      :code="101"
      method="GET"
    />
    <StatusCode
      :code="200"
      method="GET"
    />
    <StatusCode
      :code="301"
      method="GET"
    />
    <StatusCode
      :code="404"
      method="POST"
    />
    <StatusCode
      :code="503"
      method="PUT"
    />
    <StatusCode :code="201" />
    <StatusCode code="n/a" />
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import StatusCode from '@aziontech/ui/status-code'
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-sm)">
    <StatusCode
      :code="429"
      method="POST"
      size="small"
    />
    <StatusCode
      :code="429"
      method="POST"
      size="medium"
    />
  </div>
</template>
```

### Request log

```vue
<script setup>
  import DataTable from '@aziontech/ui/data-table'
  import StatusCode from '@aziontech/ui/status-code'

  const rows = [
    { id: 'r1', time: '12:04:31', method: 'GET', status: 200, path: '/', duration: '38 ms' },
    {
      id: 'r2',
      time: '12:04:29',
      method: 'GET',
      status: 304,
      path: '/assets/app.js',
      duration: '4 ms'
    },
    {
      id: 'r3',
      time: '12:04:27',
      method: 'POST',
      status: 503,
      path: '/api/orders',
      duration: '1.2 s'
    },
    {
      id: 'r4',
      time: '12:04:22',
      method: 'GET',
      status: 200,
      path: '/api/products',
      duration: '61 ms'
    },
    {
      id: 'r5',
      time: '12:04:19',
      method: 'DELETE',
      status: 404,
      path: '/api/carts/42',
      duration: '12 ms'
    },
    { id: 'r6', time: '12:04:15', method: 'GET', status: 200, path: '/docs', duration: '45 ms' }
  ]

  const columns = [
    { accessorKey: 'time', header: 'Time', minWidth: 96 },
    { accessorKey: 'status', header: 'Status', minWidth: 120 },
    { accessorKey: 'path', header: 'Path', grow: 3, principal: true },
    { accessorKey: 'duration', header: 'Duration', minWidth: 96, align: 'end' }
  ]
</script>

<template>
  <DataTable
    :data="rows"
    :columns="columns"
    density="compact"
    aria-label="Requests to app.example.com"
  >
    <template #cell-status="{ row }">
      <StatusCode
        :code="row.status"
        :method="row.method"
      />
    </template>
  </DataTable>
</template>
```
