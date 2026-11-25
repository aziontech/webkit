---
name: timestamp
category: content
structure: monolithic
status: implemented
spec_version: 4
template: 2
checksum: 0172307347dc663c473586aacf8554269b25a2c39d2d5496647f4e8cb5604b65
created: 2026-11-14
last_updated: 2026-11-25
---

# Timestamp — Component Spec

## Purpose

Timestamp shows one moment — when a request ran, a deployment finished, a key was created — in the form the reader needs: the local date and time, the same in UTC, or a relative phrase (`5 minutes ago`) that updates every minute. Activating it opens a small panel that lists the moment as UTC (ISO 8601), local time with its time zone, the reader's browser time when the app's time zone differs from it, the relative phrase and the raw value it was given, each with a copy button, so an operator can paste the exact value into a query or a ticket. It accepts a `Date`, an epoch in milliseconds or microseconds, or an ISO string, and reads the app-wide time zone from the nearest `ConfigProvider` (`time-zone`), so an app-level time zone picker changes every timestamp at once. Use it anywhere outside a table: log details, cards, side panels, activity lines. `TableCellTime` keeps its own author-plus-relative-time layout and shares the parsing and the relative phrasing with Timestamp.

## When to use

- Use Timestamp to display a moment in time in the app's time zone, copyable; to pick a date use DatePicker or DateRangePicker.
- A detail panel, card or log line shows when something happened and people may need the exact or UTC value.
- An app lets people pick a display time zone and every absolute time must follow it.
- A list outside `Table` shows relative times that should stay current.

## When NOT to use

- A table column of modification times with the author → use `TableCellTime` in a `#cell-<id>` slot.
- A date the person edits → use `date-picker` (one date) or `date-range-picker` (a range).
- A duration (`1.2 s`, `3 days`) → plain text formatted with `useLocale().formatNumber`; Timestamp is a point in time.

## Related

- `config-provider` — `time-zone` sets the zone every Timestamp below it reads; `now` fixes the reference time of relative phrases.
- `table` — `TableCellTime` is the table preset for modification times; it shares Timestamp's parsing and relative phrasing.
- `copy-button` — the copy control on every row of the panel.
- `popover` — the panel Timestamp opens.

## Best practices

- Pass the value from your data as it comes (`'2026-11-14T12:04:31Z'`, `1794657871000`, or the microseconds a log store returns); do not pre-format it.
- Set the app's time zone once on `ConfigProvider` (`time-zone`) rather than on each Timestamp; use the `time-zone` prop only for a value that belongs to another zone (a schedule in the customer's zone).
- Use `format="relative"` for recent activity, `local` for audit records and logs, `utc` for values people compare across teams, and `time` for a row under a header that already names the day (a timeline grouped by date), so the row reads `8:20 AM` instead of repeating the date.
- In an example, a test or a server render, fix `now` on the provider and give a time zone, so the text does not depend on when or where it renders.

## Usage

```vue
<script setup>
  import Timestamp from '@aziontech/webkit/timestamp'
  import ConfigProvider from '@aziontech/webkit/config-provider'
</script>

<template>
  <ConfigProvider time-zone="America/New_York">
    <Timestamp value="2026-11-14T12:04:31Z" />
    <Timestamp
      :value="1794657871000000"
      format="relative"
    />
  </ConfigProvider>
</template>
```

## Props

| Prop       | Type                             | Default     | Required | JSDoc                                                                                                                                                                                             |
| ---------- | -------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`    | `string \| number \| Date`       | `undefined` | false    | The moment: a `Date`, an epoch in milliseconds (microseconds when the number has 15 digits or more), a numeric string, or an ISO string. Empty or unparseable renders a muted dash with no panel. |
| `format`   | `'relative' \| 'local' \| 'utc' \| 'time'` | `'local'`   | false    | What the text shows: the relative phrase that updates every minute, the date and time in the time zone, the date and time in UTC, or only the hour and minute in the time zone (for a row under a date header). The panel always lists every form. |
| `timeZone` | `string`                         | `''`        | false    | IANA time zone of the local time (`America/New_York`). Empty reads the nearest `ConfigProvider`'s `time-zone`, then the browser's zone.                                                           |

## Events

_none_

## Slots

_none_

## States

- `data-format` on the root mirrors `format`.
- `data-state` on the root: `open` while the panel shows, `closed` otherwise (from `Popover`).
- Invalid or empty `value`: the root shows a muted dash, renders no trigger and no panel, and carries `data-invalid`.
- Before mount, with no time zone from the prop or the provider, the text renders in UTC so the server and the first client render agree; after mount it switches to the browser's zone. With a time zone, server and client render the same text.
- The relative phrase reads the provider's `now` when set, else a shared clock that ticks each minute; under 45 seconds it reads `just now`, under an hour in minutes, beyond that in the largest whole unit.
- `time` reads only the hour and the minute in the effective time zone (`Intl` `hour: numeric`, `minute: 2-digit`: `8:20 AM`, `08:20`), with no date, seconds or zone name; the `time` element keeps the full ISO value in `datetime` and the panel lists every form, so nothing is lost.
- An unknown time zone name falls back to UTC instead of throwing.
- The browser row appears only after mount and only when the effective time zone differs from the browser's.

## Motion & Animations

| Trigger            | Animation / Transition                                            | Token                       | Reduced-motion fallback                           |
| ------------------ | ----------------------------------------------------------------- | --------------------------- | ------------------------------------------------- |
| panel open / close | the scale-in and scale-out of `PopoverContent` (owned by Popover) | semantic animations catalog | reduced-motion fallback owned by `PopoverContent` |
| trigger hover      | `transition-colors duration-150 ease-out`                         | —                           | `motion-reduce:transition-none`                   |

## Tokens

| Region             | Token (DESIGN.md)                                                        |
| ------------------ | ------------------------------------------------------------------------ |
| trigger text       | inherits the surrounding typography and colour                           |
| trigger underline  | `decoration-dotted`, `var(--border-strong)`; hover `var(--text-default)` |
| trigger focus ring | `var(--ring-color)` (from `PopoverTrigger`)                              |
| invalid dash       | `var(--text-muted)`                                                      |
| panel surface      | `PopoverContent` tokens                                                  |
| row label          | `.text-label-sm`, `var(--text-muted)`                                    |
| row value          | `.text-label-code-sm`, `var(--text-default)`                             |
| zone name          | `.text-body-xs`, `var(--text-muted)`                                     |
| row padding, gaps  | `var(--spacing-xs)`, `var(--spacing-sm)`                                 |
| row divider        | `var(--border-default)`, `var(--border-width-default)`                   |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The text is a native `button` wrapping a `time` element whose `datetime` is the ISO 8601 UTC value; the button has `aria-haspopup="dialog"` and `aria-expanded` (from `PopoverTrigger`).
- Keyboard map: `Tab` focuses the trigger; `Enter` or `Space` opens the panel; inside the panel `Tab` moves between the copy buttons and wraps back to the trigger; `Esc` closes the panel and returns focus to the trigger.
- The panel is a non-modal `dialog` named by a visually hidden title (`Timestamp details`); the rows are a description list (`dl`), so each value is read with its label.
- Every copy button is named after its row (`Copy UTC`, `Copy Local`); the copied state is announced by `CopyButton`.
- Visible focus: the trigger and the copy buttons draw the ring token.
- Contrast: `var(--text-default)` and `var(--text-muted)` on `var(--bg-surface-raised)` are theme-guaranteed.
- `motion-reduce:*`: the panel and the hover colour transition both pair with a reduced-motion fallback.
- Touch target: the copy buttons use the `small` `IconButton` size with the row padding around them; the trigger is inline text and grows with the text it sits in; on a coarse pointer an invisible layer (`data-slot="touch-target"`) extends its hit area to 40 px tall, the WebKit floor, without moving the text.

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

## Right-to-left

- Layout: logical utilities only (`ps-`/`pe-`, `gap`, `text-start`), so the panel rows mirror under `dir="rtl"`.
- Icons: the copy glyph does not mirror.
- Keyboard: no horizontal arrow-key logic.
- User data: the ISO, local, browser and raw values render `dir="ltr"` so digits and separators keep their order; the trigger text is isolated with `dir="auto"`.

## Responsive

- Container queries: none.
- Narrow: the trigger wraps with the surrounding text; the panel is at most `--container-xs` wide and long values wrap (`break-all`) instead of overflowing at 320 px.
- Touch: the trigger opens on tap, through a 40 px tall hit area on `pointer: coarse`; the panel closes on outside tap.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: 17.5 KB gzip for `./timestamp` in `.size-limit.json` (Popover, CopyButton and the locale formatters; `Intl` formatters are cached per locale and options).
- Runtime budget: until first activated a timestamp is a plain button with the same look and ARIA, and the Popover with its panel mounts on the first click, then stays; every instance shares one minute clock; 1,000 timestamps mount and change time zone within the `timestamp-1k` scenario of `perf-budgets.json` (520 ms / 100 ms; about 130 ms / 25 ms measured).
- Heavy parts: none; no dependency beyond Vue.

## Examples

- Default — one timestamp in each format, with a fixed `now` and time zone on the provider.
- Time zone — a `Select` of time zones bound to the provider's `time-zone` above a few timestamps; changing the zone changes every local time at once. Justified addition: the app-wide time zone is the component's second job and only a composed picker shows it.
- Log details — Timestamp inside a `KeyValueList` panel of one request, next to a `StatusCode`, where people copy the UTC value into a query. Justified addition: it shows the copyable panel in the context it is built for.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
