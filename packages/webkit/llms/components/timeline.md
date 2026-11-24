# Timeline

> Use Timeline for the history of one record: a vertical list of dated events joined by a line, newest or oldest first, such as the activity of a ticket (status changed, assigned, SLA breached, merged), the audit trail of one resource or the deployment history of an application. Each event is a `Timeline.Item`: a marker (a dot or an icon in its severity's `-mark` colour, or any small component the app puts in its `marker` slot), a title that says what happened, an optional description, who did it, when it happened (a `Timestamp`) and any content the app adds under it (a quoted comment, a diff summary, a link). `Timeline.Group` gathers the events of one day (or any period) under a label. It is read-only and has no current position: unlike `Stepper` it does not move anyone through steps, unlike `Trace` it does not place spans on a clock, and unlike `LogViewer` it does not stream lines.

- Import: `import TimelineRoot from '@aziontech/webkit/timeline-root'`
- Compound import (dot notation, not tree-shakeable): `import Timeline from '@aziontech/webkit/timeline'`
- Category: content · Surface: app · Structure: composition
- Stability: preview. The API may still change in a minor release, named in the changelog, until the owner marks it GA.
- API as JSON: [timeline.json](timeline.json)

## When to use

- Show the activity history of one ticket, order or incident: who changed the status, who it was assigned to, when an SLA was breached, when it was merged or closed.
- Show the audit trail of one resource on its detail page: created, settings changed, key rotated, deleted.
- Show the deployment or version history of one application, each deploy with its outcome and who started it.
- Group a long history by day ("Today", "November 21, 2026") so a reader finds when something happened.

## Do

- The title says what happened in plain words, past tense, with the changed value ("Status changed to Solved", "Assigned to Sam Lee"). Colour and icon only reinforce it; a reader who cannot see them still knows what happened.
- Pick the severity from what the event means for the reader: `danger` for a breach or a failed deploy, `warning` for something that needs attention soon, `success` for a resolved or merged event, `info` for a notable but neutral change, `neutral` (the default) for routine changes. Most events are `neutral`, so the few coloured ones stand out.
- Keep one order per timeline (newest first for activity people check often, oldest first for a history read as a story) and say which in the surrounding heading or copy when it is not obvious.
- Use `Timeline.Group` for histories longer than a screen; format its `label` in the app with `useLocale` (a date, "Today", "Yesterday").
- Put long content (a full comment, a diff) in the default slot, short and quoted; link to the full record rather than rendering it all.
- `size="small"` is for a side panel or a drawer; the page body uses `medium`.
- When the history is empty, render an `EmptyState` in place of the timeline, not a timeline with no items.

## Don’t

- A searchable, sortable log of many records or a whole account (filter by user, export as CSV) → use `data-table` (the `account/account-activity-history` block).
- Moving the reader through the ordered steps of a task, with a current step → use `stepper`.
- The timed spans of one request or invocation → use `trace`.
- Streaming build or runtime log lines with levels → use `log-viewer` (`log-viewer-steps` for known steps).
- The state of a service across many periods at a glance (uptime) → use `tracker`.
- The current state of one resource → use `status-indicator`.
- The messages of an AI conversation → use `chat-message`; a timeline lists events about a record, not the messages themselves.
- An agent's progress while it works → use `agent-activity`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [timestamp](timestamp.md) — every item's `time` renders through it, so the reader can open the exact UTC and local value and copy it.
- [status-indicator](status-indicator.md) — the current state of the record, usually in the detail header above its timeline.
- [outcome-icon](outcome-icon.md) — a small outcome mark the app can put in an item's `marker` slot when an event is a finished run.
- [avatar](avatar.md) — the actor's picture, in an item's `marker` slot, when the people matter more than the event type.
- [stepper](stepper.md) — the look-alike: a vertical rail of dots too, but for steps the reader moves through.
- [empty-state](empty-state.md) — what the page shows instead of a timeline that has no events.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `size` | `'small' \| 'medium'` | `'medium'` | false | Density of every item: `small` for a side panel or drawer, `medium` for a page body. |
| `timeFormat` | `'relative' \| 'local' \| 'utc'` | `'local'` | false | How every item's `time` reads, passed to `Timestamp` as its `format`. |
| `loading` | `boolean` | `false` | false | Renders three placeholder items in place of the slot while the history loads; sets `aria-busy`. |
| `loadingLabel` | `string` | `''` | false | What a screen reader hears while loading. Empty uses the locale catalog (`Loading activity`). |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list. Empty uses the locale catalog (`Activity`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | `Timeline.Item` children, or `Timeline.Group` children, in display order. Hidden while `loading`. |

## Sub-component imports

- `@aziontech/webkit/timeline-item`
- `@aziontech/webkit/timeline-group`

## Sub-components

The root ships a **compound API**: `index.ts` attaches `Item` and `Group` to the root so `<Timeline.Item>` and `<Timeline.Group>` resolve from one import. The timeline has no open/closed state, so there is no `Trigger` / `Content`; `Item` and `Group` are the closed-list part words for what the parts are. The root provides a read-only context (`injection-key.ts`, `TimelineInjectionKey = Symbol('Timeline')`) holding `size` and `timeFormat`; `composables/use-timeline-context.ts` exports `useTimelineContext` and the `TimelineContext` type (`CODE_QUALITY.md` § 3.5) and throws a clear error outside `<Timeline>`. No part registers itself or reads its slot: the line under the last item is hidden by CSS (`:last-child`).

Markup: the root is an `<ol>`. An Item is an `<li>`. A Group is an `<li>` holding its label and a nested `<ol>` of Items, named by that label (`aria-labelledby`).

- `timeline-item/timeline-item.vue` — one event: `<li data-slot="timeline-item">` → the marker column (`data-slot="timeline-marker"`, `aria-hidden="true"`, then the connector line `data-slot="timeline-connector"` running down to the next item) and the content column (title, then a meta line with the actor and the `Timestamp`, then the description, then the default slot in `data-slot="timeline-body"`).
  - Props:

    | Prop          | Type                                                        | Default     | Required | JSDoc                                                                                                                               |
    | ------------- | ----------------------------------------------------------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
    | `title`       | `string`                                                    | `''`        | false    | What happened, in plain words ("Status changed to Solved").                                                                         |
    | `description` | `string`                                                    | `''`        | false    | One or two lines of detail under the title.                                                                                         |
    | `actor`       | `string`                                                    | `''`        | false    | Who did it (a person, a team or a system); shown before the time.                                                                    |
    | `time`        | `string \| number \| Date`                                  | `undefined` | false    | When it happened, rendered by `Timestamp` in the root's `timeFormat`; a `Date`, an epoch or an ISO string. Absent renders no time. |
    | `severity`    | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | false    | What the event means for the reader; colours the marker with its `-mark` token.                                                     |
    | `icon`        | `string`                                                    | `''`        | false    | Icon class (`az az-clock`) drawn as the marker instead of the dot.                                                       |

  - Events: _none_.
  - Slots: `default` — content under the description (a quoted comment, a link, a small key-value list); `marker` — replaces the dot or icon (an `Avatar`, an `OutcomeIcon`), sized by the app to the marker box.
  - Marker precedence: the `marker` slot, then `icon`, then the dot.
  - `data-testid` fallback `timeline-item`; inner `${testId}__title`, `${testId}__marker`. A consumer `data-testid` wins.
- `timeline-group/timeline-group.vue` — the events of one period: `<li data-slot="timeline-group">` → the label (`data-slot="timeline-group-label"`, with an id from `useId()`) and an `<ol aria-labelledby="<that id>">` holding the Items.
  - Props:

    | Prop    | Type     | Default | Required | JSDoc                                                        |
    | ------- | -------- | ------- | -------- | ------------------------------------------------------------ |
    | `label` | `string` | `''`    | false    | The period's header ("Today", "November 21, 2026"), formatted by the app. |

  - Events: _none_.
  - Slots: `default` — the `Timeline.Item` children of this period.
  - The line joins the items of one group; a group's label starts a new run of the line.
  - `data-testid` fallback `timeline-group`; inner `${testId}__label`. A consumer `data-testid` wins.

Resulting layout:

```
packages/webkit/src/components/content/timeline/
├── timeline.vue
├── timeline.test.ts
├── index.ts
├── injection-key.ts
├── composables/
│   └── use-timeline-context.ts
├── timeline-item/
│   └── timeline-item.vue
└── timeline-group/
    └── timeline-group.vue
```

Exports (flat; run `pnpm --filter @aziontech/webkit build:exports` after adding them):

```jsonc
"./timeline": "./src/components/content/timeline/index.ts",
"./timeline-root": "./src/components/content/timeline/timeline.vue",
"./timeline-item": "./src/components/content/timeline/timeline-item/timeline-item.vue",
"./timeline-group": "./src/components/content/timeline/timeline-group/timeline-group.vue"
```

The same change rewrites the `timeline` entry of `packages/webkit/src/cli/migrations/v6.json` (`legacy.manual`) to "PrimeVue Timeline; use Timeline with Timeline.Item and Timeline.Group (different API)", so `webkit migrate` points v3 apps at the new export.

`./timeline` and `./timeline-root` export `TimelineProps`, `TimelineSize`, `TimelineTimeFormat`; `./timeline-item` exports `TimelineItemProps` and `TimelineItemSeverity` (derived from `Severity`); `./timeline-group` exports `TimelineGroupProps`; `./timeline` also exports `useTimelineContext` and `TimelineContext`.

## States

- Visual states: `default`, `loading`. No hover, focus, selection or disabled state of its own: only the `Timestamp` and slotted content are interactive. No `readonly` or `invalid` state either: it is display-only, with no field and no validation.
- `data-size` on the root mirrors `size`; items read it from the context and carry their own `data-size`.
- `data-loading` on the root mirrors `loading`; `aria-busy="true"` while loading. The placeholders are three `aria-hidden` `<li>` with a circle `Skeleton` as the marker and two line `Skeleton`s as the content, plus one visually hidden `<li>` with the loading label.
- `data-severity` on each Item mirrors `severity`; the marker colour switches on it.
- `data-marker="dot" | "icon" | "custom"` on each Item says which marker renders.
- Part markers: `data-slot="timeline"`, `timeline-item`, `timeline-marker`, `timeline-connector`, `timeline-title`, `timeline-meta`, `timeline-description`, `timeline-body`, `timeline-group`, `timeline-group-label`.
- `data-orientation="vertical"` on the root.
- Empty: the app renders `EmptyState` instead of the timeline; the component does not inspect its slot (`CODE_QUALITY.md` § 3.6). Error: the page's `Alert` with Retry; the component fetches nothing.

## Accessibility

- Visible focus: the timeline adds no focusable element; the `Timestamp` buttons and slotted controls keep their own ring (`focus-visible:ring-(--ring-color)`).
- Keyboard map: `Tab` moves through each item's `Timestamp` and any interactive slotted content, in reading order. No roving focus and no arrow keys: it is a list, not a widget.
- ARIA: the root is an `<ol>` named by `aria-label` (default `Activity`), so a screen reader announces "list, N items". Each Group is an `<li>` with a nested `<ol aria-labelledby>` pointing at its label. Markers and the connector are `aria-hidden="true"`; the severity is carried by the title text, never by colour alone (WCAG 1.4.1). While `loading`, the root has `aria-busy="true"` and a visually hidden item reads the loading label.
- Contrast: text uses `--text-default` / `--text-muted` on the canvas or surface; markers use the documented `-mark` tokens (OI-02) and `--text-muted`, which meet 3:1 for graphics and APCA Lc 30 for marks; the connector is a border (`--border-default`, Lc 15) and carries no meaning.
- Motion: none of its own; `Skeleton` honours `motion-reduce`.
- Touch target: no target of its own; `Timestamp` owns its 44 px coarse-pointer hit area.

## Right-to-left

- Layout: logical utilities only; the marker column and the line sit on the inline-start side and move to the right under `dir="rtl"`, the content column follows on the inline-end side.
- Icons: marker icons are not mirrored unless they are directional (the stylesheet mirrors the `DIRECTIONAL_ICONS` set itself; the component never adds `rtl:rotate-180`).
- Keyboard: no arrow-key handling, so nothing changes.
- User data: `actor` renders in a `<bdi>` so a name in another script does not reorder the meta line; `Timestamp` isolates its own text.

## Internationalization

| Key                | English source     | Override prop  |
| ------------------ | ------------------ | -------------- |
| `timeline.label`   | `Activity`         | `ariaLabel`    |
| `timeline.loading` | `Loading activity` | `loadingLabel` |

- Both keys are added to `en.ts`, `pt-BR.ts` and `es.ts`.
- Formatting: times go through `Timestamp` (`Intl.DateTimeFormat` and `Intl.RelativeTimeFormat` with the `ConfigProvider` locale and time zone). Titles, descriptions, actors and group labels are the app's text, already translated.

## Responsive

- Container queries: none. The two columns (marker, content) hold at every width.
- Narrow: no breakpoint and no query. The title and the meta line (actor and time) sit in one `flex-wrap` row, so the meta line wraps under the title on its own when the row is too narrow; long titles and descriptions wrap (`break-words`), never truncate.
- Touch: nothing hover-only; `Timestamp` keeps its own coarse-pointer target.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; slotted content is the app's to keep narrow.

## Examples

### Default

```vue
<script setup>
  import Timeline from '@aziontech/webkit/timeline'
</script>

<template>
  <Timeline aria-label="Ticket activity">
    <Timeline.Item
      title="SLA breached"
      description="First response was due 2 hours after the ticket was opened."
      severity="danger"
      icon="az az-clock"
      actor="System"
      time="2026-11-21T15:30:00Z"
    />
    <Timeline.Item
      title="Status changed to Pending"
      actor="Sam Lee"
      time="2026-11-21T14:05:00Z"
    />
    <Timeline.Item
      title="Assigned to Sam Lee"
      actor="Jane Doe"
      time="2026-11-21T13:10:00Z"
      icon="az az-user-plus"
    >
      Moved from the Billing queue: the customer asks about a refund for a duplicate charge.
    </Timeline.Item>
    <Timeline.Item
      title="Ticket opened"
      description="Duplicate charge on the November invoice."
      actor="Alex Morgan"
      time="2026-11-21T13:00:00Z"
    />
  </Timeline>
</template>
```

### Groups

```vue
<script setup>
  import Timeline from '@aziontech/webkit/timeline'
</script>

<template>
  <Timeline aria-label="Deployment history of acme-store">
    <Timeline.Group label="November 21, 2026">
      <Timeline.Item
        title="Deployed to production"
        description="Release 2.4.1 is live on app.example.com."
        severity="success"
        icon="az az-circle-check"
        actor="Priya Patel"
        time="2026-11-21T16:20:00Z"
      />
      <Timeline.Item
        title="Deploy to production failed"
        description="The build step exited with code 1."
        severity="danger"
        icon="az az-circle-x"
        actor="Priya Patel"
        time="2026-11-21T15:45:00Z"
      />
    </Timeline.Group>
    <Timeline.Group label="November 20, 2026">
      <Timeline.Item
        title="Deployed to staging"
        description="Release 2.4.1 is ready to review on staging.example.com."
        severity="info"
        icon="az az-git-merge"
        actor="John Smith"
        time="2026-11-20T18:02:00Z"
      />
      <Timeline.Item
        title="Environment variable changed"
        description="API_BASE_URL now points to https://api.example.com."
        actor="John Smith"
        time="2026-11-20T17:40:00Z"
      />
    </Timeline.Group>
  </Timeline>
</template>
```

### Severities

```vue
<script setup>
  import Timeline from '@aziontech/webkit/timeline'
</script>

<template>
  <div class="grid w-full gap-(--spacing-lg) md:grid-cols-2">
    <Timeline aria-label="Severities with dot markers">
      <Timeline.Item
        title="Tag added: billing"
        severity="neutral"
        time="2026-11-21T13:00:00Z"
      />
      <Timeline.Item
        title="Priority raised to high"
        severity="info"
        time="2026-11-21T13:10:00Z"
      />
      <Timeline.Item
        title="Ticket solved"
        severity="success"
        time="2026-11-21T13:20:00Z"
      />
      <Timeline.Item
        title="SLA due in 30 minutes"
        severity="warning"
        time="2026-11-21T13:30:00Z"
      />
      <Timeline.Item
        title="SLA breached"
        severity="danger"
        time="2026-11-21T13:40:00Z"
      />
    </Timeline>
    <Timeline aria-label="Severities with icon markers">
      <Timeline.Item
        title="Tag added: billing"
        severity="neutral"
        icon="az az-tag"
        time="2026-11-21T13:00:00Z"
      />
      <Timeline.Item
        title="Priority raised to high"
        severity="info"
        icon="az az-info"
        time="2026-11-21T13:10:00Z"
      />
      <Timeline.Item
        title="Ticket solved"
        severity="success"
        icon="az az-circle-check"
        time="2026-11-21T13:20:00Z"
      />
      <Timeline.Item
        title="SLA due in 30 minutes"
        severity="warning"
        icon="az az-triangle-alert"
        time="2026-11-21T13:30:00Z"
      />
      <Timeline.Item
        title="SLA breached"
        severity="danger"
        icon="az az-circle-x"
        time="2026-11-21T13:40:00Z"
      />
    </Timeline>
  </div>
</template>
```
