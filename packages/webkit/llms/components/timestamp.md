# Timestamp

> Timestamp shows one moment — when a request ran, a deployment finished, a key was created — in the form the reader needs: the local date and time, the same in UTC, or a relative phrase (`5 minutes ago`) that updates every minute. Activating it opens a small panel that lists the moment as UTC (ISO 8601), local time with its time zone, the reader's browser time when the app's time zone differs from it, the relative phrase and the raw value it was given, each with a copy button, so an operator can paste the exact value into a query or a ticket. It accepts a `Date`, an epoch in milliseconds or microseconds, or an ISO string, and reads the app-wide time zone from the nearest `ConfigProvider` (`time-zone`), so an app-level time zone picker changes every timestamp at once. Use it anywhere outside a table: log details, cards, side panels, activity lines. `TableCellTime` keeps its own author-plus-relative-time layout and shares the parsing and the relative phrasing with Timestamp.

- Import: `import Timestamp from '@aziontech/webkit/timestamp'`
- Category: content · Surface: app · Structure: monolithic
- API as JSON: [timestamp.json](timestamp.json)

## When to use

- Use Timestamp to display a moment in time in the app's time zone, copyable; to pick a date use DatePicker or DateRangePicker.
- A detail panel, card or log line shows when something happened and people may need the exact or UTC value.
- An app lets people pick a display time zone and every absolute time must follow it.
- A list outside `Table` shows relative times that should stay current.

## Do

- Pass the value from your data as it comes (`'2026-11-14T12:04:31Z'`, `1794657871000`, or the microseconds a log store returns); do not pre-format it.
- Set the app's time zone once on `ConfigProvider` (`time-zone`) rather than on each Timestamp; use the `time-zone` prop only for a value that belongs to another zone (a schedule in the customer's zone).
- Use `format="relative"` for recent activity, `local` for audit records and logs, `utc` for values people compare across teams.
- In an example, a test or a server render, fix `now` on the provider and give a time zone, so the text does not depend on when or where it renders.

## Don’t

- A table column of modification times with the author → use `TableCellTime` in a `#cell-<id>` slot.
- A date the person edits → use `date-picker` (one date) or `date-range-picker` (a range).
- A duration (`1.2 s`, `3 days`) → plain text formatted with `useLocale().formatNumber`; Timestamp is a point in time.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [config-provider](config-provider.md) — `time-zone` sets the zone every Timestamp below it reads; `now` fixes the reference time of relative phrases.
- [table](table.md) — `TableCellTime` is the table preset for modification times; it shares Timestamp's parsing and relative phrasing.
- [copy-button](copy-button.md) — the copy control on every row of the panel.
- [popover](popover.md) — the panel Timestamp opens.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string \| number \| Date` | `undefined` | false | The moment: a `Date`, an epoch in milliseconds (microseconds when the number has 15 digits or more), a numeric string, or an ISO string. Empty or unparseable renders a muted dash with no panel. |
| `format` | `'relative' \| 'local' \| 'utc'` | `'local'` | false | What the text shows: the relative phrase that updates every minute, the date and time in the time zone, or the date and time in UTC. The panel always lists every form. |
| `timeZone` | `string` | `''` | false | IANA time zone of the local time (`America/New_York`). Empty reads the nearest `ConfigProvider`'s `time-zone`, then the browser's zone. |

## States

- `data-format` on the root mirrors `format`.
- `data-state` on the root: `open` while the panel shows, `closed` otherwise (from `Popover`).
- Invalid or empty `value`: the root shows a muted dash, renders no trigger and no panel, and carries `data-invalid`.
- Before mount, with no time zone from the prop or the provider, the text renders in UTC so the server and the first client render agree; after mount it switches to the browser's zone. With a time zone, server and client render the same text.
- The relative phrase reads the provider's `now` when set, else a shared clock that ticks each minute; under 45 seconds it reads `just now`, under an hour in minutes, beyond that in the largest whole unit.
- An unknown time zone name falls back to UTC instead of throwing.
- The browser row appears only after mount and only when the effective time zone differs from the browser's.

## Accessibility

- The text is a native `button` wrapping a `time` element whose `datetime` is the ISO 8601 UTC value; the button has `aria-haspopup="dialog"` and `aria-expanded` (from `PopoverTrigger`).
- Keyboard map: `Tab` focuses the trigger; `Enter` or `Space` opens the panel; inside the panel `Tab` moves between the copy buttons and wraps back to the trigger; `Esc` closes the panel and returns focus to the trigger.
- The panel is a non-modal `dialog` named by a visually hidden title (`Timestamp details`); the rows are a description list (`dl`), so each value is read with its label.
- Every copy button is named after its row (`Copy UTC`, `Copy Local`); the copied state is announced by `CopyButton`.
- Visible focus: the trigger and the copy buttons draw the ring token.
- Contrast: `var(--text-default)` and `var(--text-muted)` on `var(--bg-surface-raised)` are theme-guaranteed.
- `motion-reduce:*`: the panel and the hover colour transition both pair with a reduced-motion fallback.
- Touch target: the copy buttons use the `small` `IconButton` size with the row padding around them; the trigger is inline text and grows with the text it sits in; on a coarse pointer an invisible layer (`data-slot="touch-target"`) extends its hit area to 40 px tall, the WebKit floor, without moving the text.

## Right-to-left

- Layout: logical utilities only (`ps-`/`pe-`, `gap`, `text-start`), so the panel rows mirror under `dir="rtl"`.
- Icons: the copy glyph does not mirror.
- Keyboard: no horizontal arrow-key logic.
- User data: the ISO, local, browser and raw values render `dir="ltr"` so digits and separators keep their order; the trigger text is isolated with `dir="auto"`.

## Internationalization

| Key                  | English source      | Override prop |
| -------------------- | ------------------- | ------------- |
| `timestamp.title`    | `Timestamp details` | —             |
| `timestamp.utc`      | `UTC`               | —             |
| `timestamp.local`    | `Local`             | —             |
| `timestamp.browser`  | `Your browser`      | —             |
| `timestamp.relative` | `Relative`          | —             |
| `timestamp.raw`      | `Raw value`         | —             |
| `timestamp.copy`     | `Copy {label}`      | —             |
| `timestamp.justNow`  | `just now`          | —             |

- Dates, times and relative phrases are formatted with `Intl` in the provider's locale (`useLocale().formatDate` and `formatRelativeTime`), with Latin digits.
- The UTC row is ISO 8601 and the raw row is the value as given; neither is translated.

## Responsive

- Container queries: none.
- Narrow: the trigger wraps with the surrounding text; the panel is at most `--container-xs` wide and long values wrap (`break-all`) instead of overflowing at 320 px.
- Touch: the trigger opens on tap, through a 40 px tall hit area on `pointer: coarse`; the panel closes on outside tap.
- Reflow: no horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import ConfigProvider from '@aziontech/webkit/config-provider'
  import Timestamp from '@aziontech/webkit/timestamp'

  const NOW = Date.UTC(2026, 10, 14, 12, 10)
  const VALUE = '2026-11-14T12:04:31Z'
</script>

<template>
  <ConfigProvider
    :now="NOW"
    time-zone="America/New_York"
  >
    <dl
      class="grid grid-cols-[auto_1fr] items-baseline gap-x-(--spacing-md) gap-y-(--spacing-sm) text-body-sm text-(--text-default)"
    >
      <dt class="text-label-sm text-(--text-muted)">Local</dt>
      <dd><Timestamp :value="VALUE" /></dd>
      <dt class="text-label-sm text-(--text-muted)">UTC</dt>
      <dd>
        <Timestamp
          :value="VALUE"
          format="utc"
        />
      </dd>
      <dt class="text-label-sm text-(--text-muted)">Relative</dt>
      <dd>
        <Timestamp
          :value="VALUE"
          format="relative"
        />
      </dd>
    </dl>
  </ConfigProvider>
</template>
```

### Time zone

```vue
<script setup>
  import ConfigProvider from '@aziontech/webkit/config-provider'
  import Select from '@aziontech/webkit/select'
  import Timestamp from '@aziontech/webkit/timestamp'
  import { ref } from 'vue'

  const NOW = Date.UTC(2026, 10, 14, 12, 10)
  const zone = ref('UTC')
  const zones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/Los_Angeles', label: 'Los Angeles' },
    { value: 'America/New_York', label: 'New York' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Asia/Tokyo', label: 'Tokyo' }
  ]
  const events = [
    { id: 'e1', label: 'Deployment finished', at: '2026-11-14T12:04:31Z' },
    { id: 'e2', label: 'Certificate renewed', at: '2026-11-14T03:15:00Z' },
    { id: 'e3', label: 'API key created', at: 1794524400000000 }
  ]
</script>

<template>
  <ConfigProvider
    :now="NOW"
    :time-zone="zone"
  >
    <div class="flex max-w-(--container-sm) flex-col gap-(--spacing-md)">
      <Select
        v-model="zone"
        aria-label="Time zone"
        size="medium"
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Item
            v-for="option in zones"
            :key="option.value"
            :value="option.value"
            >{{ option.label }}</Select.Item
          >
        </Select.Content>
      </Select>
      <ul class="flex flex-col gap-(--spacing-xs) text-body-sm text-(--text-default)">
        <li
          v-for="event in events"
          :key="event.id"
          class="flex flex-wrap items-baseline justify-between gap-(--spacing-sm)"
        >
          <span>{{ event.label }}</span>
          <Timestamp :value="event.at" />
        </li>
      </ul>
    </div>
  </ConfigProvider>
</template>
```

### Log details

```vue
<script setup>
  import ConfigProvider from '@aziontech/webkit/config-provider'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import StatusCode from '@aziontech/webkit/status-code'
  import Timestamp from '@aziontech/webkit/timestamp'

  const NOW = Date.UTC(2026, 10, 14, 12, 10)
</script>

<template>
  <ConfigProvider
    :now="NOW"
    time-zone="UTC"
  >
    <KeyValueList aria-label="Request details">
      <KeyValueList.Item label="Request">
        <StatusCode
          :code="503"
          method="POST"
        />
      </KeyValueList.Item>
      <KeyValueList.Item label="Path">/api/orders</KeyValueList.Item>
      <KeyValueList.Item label="Started">
        <Timestamp :value="1794657871204000" />
      </KeyValueList.Item>
      <KeyValueList.Item label="Received">
        <Timestamp
          value="2026-11-14T12:04:31.204Z"
          format="relative"
        />
      </KeyValueList.Item>
      <KeyValueList.Item label="Host">app.example.com</KeyValueList.Item>
    </KeyValueList>
  </ConfigProvider>
</template>
```
