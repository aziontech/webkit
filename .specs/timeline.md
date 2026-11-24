---
name: timeline
category: content
structure: composition
status: implemented
stability: preview
spec_version: 1
template: 2
checksum: ed5854328e953c52b2ba5ff49af94ebd7eaf7a05ae52fa0e08820672db49cd76
created: 2026-11-23
last_updated: 2026-11-23
---

# Timeline — Component Spec

## Purpose

Use Timeline for the history of one record: a vertical list of dated events joined by a line, newest or oldest first, such as the activity of a ticket (status changed, assigned, SLA breached, merged), the audit trail of one resource or the deployment history of an application. Each event is a `Timeline.Item`: a marker (a dot or an icon in its severity's `-mark` colour, or any small component the app puts in its `marker` slot), a title that says what happened, an optional description, who did it, when it happened (a `Timestamp`) and any content the app adds under it (a quoted comment, a diff summary, a link). `Timeline.Group` gathers the events of one day (or any period) under a label.

It is read-only and has no current position: unlike `Stepper` it does not move anyone through steps, unlike `Trace` it does not place spans on a clock, and unlike `LogViewer` it does not stream lines.

## When to use

- Show the activity history of one ticket, order or incident: who changed the status, who it was assigned to, when an SLA was breached, when it was merged or closed.
- Show the audit trail of one resource on its detail page: created, settings changed, key rotated, deleted.
- Show the deployment or version history of one application, each deploy with its outcome and who started it.
- Group a long history by day ("Today", "November 21, 2026") so a reader finds when something happened.

## When NOT to use

- A searchable, sortable log of many records or a whole account (filter by user, export as CSV) → use `data-table` (the `account/account-activity-history` block).
- Moving the reader through the ordered steps of a task, with a current step → use `stepper`.
- The timed spans of one request or invocation → use `trace`.
- Streaming build or runtime log lines with levels → use `log-viewer` (`log-viewer-steps` for known steps).
- The state of a service across many periods at a glance (uptime) → use `tracker`.
- The current state of one resource → use `status-indicator`.
- The messages of an AI conversation → use `chat-message`; a timeline lists events about a record, not the messages themselves.
- An agent's progress while it works → use `agent-activity`.

## Related

- `timestamp` — every item's `time` renders through it, so the reader can open the exact UTC and local value and copy it.
- `status-indicator` — the current state of the record, usually in the detail header above its timeline.
- `outcome-icon` — a small outcome mark the app can put in an item's `marker` slot when an event is a finished run.
- `avatar` — the actor's picture, in an item's `marker` slot, when the people matter more than the event type.
- `stepper` — the look-alike: a vertical rail of dots too, but for steps the reader moves through.
- `empty-state` — what the page shows instead of a timeline that has no events.

## Best practices

- The title says what happened in plain words, past tense, with the changed value ("Status changed to Solved", "Assigned to Sam Lee"). Colour and icon only reinforce it; a reader who cannot see them still knows what happened.
- Pick the severity from what the event means for the reader: `danger` for a breach or a failed deploy, `warning` for something that needs attention soon, `success` for a resolved or merged event, `info` for a notable but neutral change, `neutral` (the default) for routine changes. Most events are `neutral`, so the few coloured ones stand out.
- Keep one order per timeline (newest first for activity people check often, oldest first for a history read as a story) and say which in the surrounding heading or copy when it is not obvious.
- Use `Timeline.Group` for histories longer than a screen; format its `label` in the app with `useLocale` (a date, "Today", "Yesterday").
- Put long content (a full comment, a diff) in the default slot, short and quoted; link to the full record rather than rendering it all.
- `size="small"` is for a side panel or a drawer; the page body uses `medium`.
- When the history is empty, render an `EmptyState` in place of the timeline, not a timeline with no items.

## Usage

```vue
<script setup>
import Timeline from '@aziontech/webkit/timeline'
</script>

<template>
  <Timeline aria-label="Ticket activity">
    <Timeline.Group label="November 21, 2026">
      <Timeline.Item
        title="SLA breached"
        description="First response was due 2 hours after the ticket was opened."
        severity="danger"
        icon="az az-clock"
        time="2026-11-21T15:30:00Z"
      />
      <Timeline.Item
        title="Assigned to Sam Lee"
        actor="Jane Doe"
        time="2026-11-21T13:10:00Z"
      >
        Moved from the Billing queue.
      </Timeline.Item>
    </Timeline.Group>
  </Timeline>
</template>
```

Tree-shaking alternative — the standalone root and each part from its own entry:

```vue
<script setup>
import Timeline from '@aziontech/webkit/timeline-root'
import TimelineGroup from '@aziontech/webkit/timeline-group'
import TimelineItem from '@aziontech/webkit/timeline-item'
</script>
```

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

## Props

| Prop           | Type                             | Default    | Required | JSDoc                                                                                                   |
| -------------- | -------------------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `size`         | `'small' \| 'medium'`            | `'medium'` | false    | Density of every item: `small` for a side panel or drawer, `medium` for a page body.                    |
| `timeFormat`   | `'relative' \| 'local' \| 'utc'` | `'local'`  | false    | How every item's `time` reads, passed to `Timestamp` as its `format`.                                  |
| `loading`      | `boolean`                        | `false`    | false    | Renders three placeholder items in place of the slot while the history loads; sets `aria-busy`.         |
| `loadingLabel` | `string`                         | `''`       | false    | What a screen reader hears while loading. Empty uses the locale catalog (`Loading activity`).          |
| `ariaLabel`    | `string`                         | `''`       | false    | Accessible name of the list. Empty uses the locale catalog (`Activity`).                                |

## Events

| _none_ | — | — |

Read-only display; a `Timestamp` and any content in the slots emit their own events.

## Slots

| Slot      | Scope | Notes                                                                                          |
| --------- | ----- | ---------------------------------------------------------------------------------------------- |
| `default` | —     | `Timeline.Item` children, or `Timeline.Group` children, in display order. Hidden while `loading`. |

## States

- Visual states: `default`, `loading`. No hover, focus, selection or disabled state of its own: only the `Timestamp` and slotted content are interactive. No `readonly` or `invalid` state either: it is display-only, with no field and no validation.
- `data-size` on the root mirrors `size`; items read it from the context and carry their own `data-size`.
- `data-loading` on the root mirrors `loading`; `aria-busy="true"` while loading. The placeholders are three `aria-hidden` `<li>` with a circle `Skeleton` as the marker and two line `Skeleton`s as the content, plus one visually hidden `<li>` with the loading label.
- `data-severity` on each Item mirrors `severity`; the marker colour switches on it.
- `data-marker="dot" | "icon" | "custom"` on each Item says which marker renders.
- Part markers: `data-slot="timeline"`, `timeline-item`, `timeline-marker`, `timeline-connector`, `timeline-title`, `timeline-meta`, `timeline-description`, `timeline-body`, `timeline-group`, `timeline-group-label`.
- `data-orientation="vertical"` on the root.
- Empty: the app renders `EmptyState` instead of the timeline; the component does not inspect its slot (`CODE_QUALITY.md` § 3.6). Error: the page's `Alert` with Retry; the component fetches nothing.

## Motion & Animations

_none_ — the timeline is static. The loading placeholders use `Skeleton`'s own shimmer, which is suppressed under reduced motion.

## Tokens

| Region                                | Token (DESIGN.md)                      |
| ------------------------------------- | -------------------------------------- |
| typography (title, medium)            | `.text-label-md`                       |
| typography (title, small)             | `.text-label-sm`                       |
| typography (meta, description, body, medium) | `.text-body-sm`                  |
| typography (meta, description, body, small)  | `.text-body-xs`                  |
| typography (group label)              | `.text-label-sm`                       |
| title ink                             | `var(--text-default)`                  |
| meta, description and group label ink | `var(--text-muted)`                    |
| body ink                              | `var(--text-default)`                  |
| marker (neutral)                      | `var(--text-muted)`                    |
| marker (info)                         | `var(--info-mark)`                     |
| marker (success)                      | `var(--success-mark)`                  |
| marker (warning)                      | `var(--warning-mark)`                  |
| marker (danger)                       | `var(--danger-mark)`                   |
| connector line                        | `var(--border-default)`                |
| spacing between items (medium)        | `var(--spacing-md)`                    |
| spacing between items (small)         | `var(--spacing-sm)`                    |
| spacing marker to content (medium)    | `var(--spacing-sm)`                    |
| spacing marker to content (small)     | `var(--spacing-xs)`                    |
| spacing title to meta and body        | `var(--spacing-2xs)`                   |
| spacing above a group label           | `var(--spacing-md)`                    |

The marker box is 1.5rem square at `medium` and 1.25rem at `small`, the height of the title line, so the title centres on its marker; the dot is 0.625rem (small 0.5rem); an icon is `text-label-md` (small `text-label-sm`). The dot is a circle (`rounded-full`), as in `StatusIndicator`.

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| — (no Figma frame; every region maps to a DESIGN.md token) | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the timeline adds no focusable element; the `Timestamp` buttons and slotted controls keep their own ring (`focus-visible:ring-(--ring-color)`).
- Keyboard map: `Tab` moves through each item's `Timestamp` and any interactive slotted content, in reading order. No roving focus and no arrow keys: it is a list, not a widget.
- ARIA: the root is an `<ol>` named by `aria-label` (default `Activity`), so a screen reader announces "list, N items". Each Group is an `<li>` with a nested `<ol aria-labelledby>` pointing at its label. Markers and the connector are `aria-hidden="true"`; the severity is carried by the title text, never by colour alone (WCAG 1.4.1). While `loading`, the root has `aria-busy="true"` and a visually hidden item reads the loading label.
- Contrast: text uses `--text-default` / `--text-muted` on the canvas or surface; markers use the documented `-mark` tokens (OI-02) and `--text-muted`, which meet 3:1 for graphics and APCA Lc 30 for marks; the connector is a border (`--border-default`, Lc 15) and carries no meaning.
- Motion: none of its own; `Skeleton` honours `motion-reduce`.
- Touch target: no target of its own; `Timestamp` owns its 44 px coarse-pointer hit area.

## Internationalization

| Key                | English source     | Override prop  |
| ------------------ | ------------------ | -------------- |
| `timeline.label`   | `Activity`         | `ariaLabel`    |
| `timeline.loading` | `Loading activity` | `loadingLabel` |

- Both keys are added to `en.ts`, `pt-BR.ts` and `es.ts`.
- Formatting: times go through `Timestamp` (`Intl.DateTimeFormat` and `Intl.RelativeTimeFormat` with the `ConfigProvider` locale and time zone). Titles, descriptions, actors and group labels are the app's text, already translated.

## Right-to-left

- Layout: logical utilities only; the marker column and the line sit on the inline-start side and move to the right under `dir="rtl"`, the content column follows on the inline-end side.
- Icons: marker icons are not mirrored unless they are directional (the stylesheet mirrors the `DIRECTIONAL_ICONS` set itself; the component never adds `rtl:rotate-180`).
- Keyboard: no arrow-key handling, so nothing changes.
- User data: `actor` renders in a `<bdi>` so a name in another script does not reorder the meta line; `Timestamp` isolates its own text.

## Responsive

- Container queries: none. The two columns (marker, content) hold at every width.
- Narrow: no breakpoint and no query. The title and the meta line (actor and time) sit in one `flex-wrap` row, so the meta line wraps under the title on its own when the row is too narrow; long titles and descriptions wrap (`break-words`), never truncate.
- Touch: nothing hover-only; `Timestamp` keeps its own coarse-pointer target.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; slotted content is the app's to keep narrow.

## Performance

- Bundle budget: `timeline-root` 2.5 KB gzip (the list, the context and the translation of two strings; `Skeleton` included); `timeline-item` 21.5 KB gzip, almost all of it `Timestamp`, which a page with a timeline shows anyway; `timeline-group` 1 KB; the compound `timeline` 23.5 KB. Measured at build and set to the measure plus a small headroom in `.size-limit.json`.
- Runtime budget: 200 items render in under 50 ms; every item is static markup plus one `Timestamp`, and every `Timestamp` shares the one page-wide minute clock (`useMinuteClock`).
- Heavy parts: none lazy-loaded; a history of hundreds of events is paged by the app ("Show older activity"), not virtualised.

## Examples

- Default — the activity of one support ticket, newest first: SLA breached (danger, icon), status changed, assigned to an agent with a note in the default slot, ticket opened by the customer. File `default.vue`.
- Groups — a deployment history grouped by day with `Timeline.Group`, each deploy's outcome as its severity. File `groups.vue`.
- Severities — composite example, one item per `severity` value, dot and icon markers side by side. File `severities.vue`.
- Sizes — composite example, the same three events at `small` and `medium`. File `sizes.vue`.
- Loading — the placeholder items while the history loads. File `loading.vue`.
- With marker — the `marker` slot holding an `Avatar` of each actor (an audit trail where the people matter). File `with-marker.vue`. Justified: the slot is the only way to show a picture or an `OutcomeIcon` as the marker, and it is not visible in any other example.

## Constraints — DO NOT

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/primitives/animations/animate.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Variants + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Variants/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
