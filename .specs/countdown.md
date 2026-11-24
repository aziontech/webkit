---
name: countdown
category: content
structure: monolithic
status: implemented
stability: preview
spec_version: 1
template: 2
checksum: 6ccfc82ffd7514e1eac00e9ffac6f5562a9029f628c6419eb768a9856e29d614
created: 2026-11-23
last_updated: 2026-11-23
---

# Countdown — Component Spec

## Purpose

Countdown shows the time left until a deadline as a compact tag: the SLA badge of a support ticket (`Due in 2h 15m`, `Due tomorrow`, `Overdue by 15m`), or the time before a certificate or a trial expires (`Expires in 30 days`, `Expired yesterday`). It turns from neutral to warning when the time left falls under a threshold and to danger once the deadline has passed, and every step changes the icon and the words as well as the colour. It can show a paused SLA (waiting on the customer). It parses the deadline like `Timestamp`, reads the reference clock from the nearest `ConfigProvider` (`now`) and updates once a minute on the clock every Timestamp shares. It differs from `Timestamp`, which shows a moment without urgency, and from `Tag`, which it renders through: Countdown owns the time phrase and picks the tag's severity from it.

## When to use

- A ticket list or a ticket header shows how long the agent has before the first reply or the resolution is due, and when it is overdue.
- A support or task tool shows a due date that must stand out as it gets close and once it is missed.
- A settings or billing page shows how long until a certificate, an API key or a trial expires.
- A row of an SLA policy shows that the clock is paused while the ticket waits on the customer.
- An SLA timer or a due-date badge has to turn amber as the date gets close and red once it is overdue, with words and an icon, not colour alone.

## When NOT to use

- A moment in the past or future with no urgency (created at, last deployed) → use `timestamp` (`format="relative"`).
- A generic status or category label → use `tag`.
- A count on an icon or a tab → use `badge`.
- The severity of a security finding → use `severity-tag`.
- The status of a running job or deployment → use `status-indicator`.
- A date the person picks → use `date-picker`.

## Related

- `timestamp` — the same parsing and relative phrasing for a moment with no deadline; pair them when people need the exact due date beside the countdown.
- `tag` — Countdown renders through Tag (`severity` neutral, warning or danger, with an icon); use Tag directly for a label that does not depend on time.
- `config-provider` — `now` fixes the reference time (examples, tests, server render); `locale` sets the language of the phrase.
- Look-alikes: Countdown imports `Tag` and the Timestamp parsing, so `check:look-alikes` reads it as reuse of both, not as a second tag or a second timestamp; `badge` (a count) and `severity-tag` (a findings scale) share no job with it.

## Best practices

- Pass the deadline from your data as it comes (`'2026-11-24T17:00:00Z'`, an epoch in milliseconds, a `Date`); do not pre-format it.
- Name what is due with `label` when a row shows more than one deadline (`First reply`, `Resolution`); a single SLA column can leave it empty.
- Set `warning-threshold` to the policy's warning window (one hour by default); `0` keeps it neutral until it is overdue.
- Use `type="expiry"` for something that ends (a certificate, a key, a trial), so the words say `Expires` and `Expired` instead of `Due` and `Overdue`.
- Set `paused` while the SLA clock is stopped (ticket pending on the customer); the badge then says `Paused` and stops counting.
- In an example, a test or a server render, fix `now` on the `ConfigProvider`, so the phrase does not depend on when it renders.

## Usage

```vue
<script setup>
  import ConfigProvider from '@aziontech/webkit/config-provider'
  import Countdown from '@aziontech/webkit/countdown'
</script>

<template>
  <ConfigProvider :now="Date.UTC(2026, 10, 24, 14, 45)">
    <Countdown
      deadline="2026-11-24T17:00:00Z"
      label="First reply"
    />
    <Countdown
      deadline="2026-12-24T00:00:00Z"
      type="expiry"
      label="Certificate"
    />
  </ConfigProvider>
</template>
```

## Props

| Prop               | Type                       | Default     | Required | JSDoc                                                                                                                                                                                 |
| ------------------ | -------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `deadline`         | `string \| number \| Date` | `undefined` | false    | The deadline: a `Date`, an epoch in milliseconds (microseconds when the number has 15 digits or more), a numeric string, or an ISO string. Empty or unparseable renders a muted dash. |
| `warningThreshold` | `number`                   | `3600000`   | false    | Time left, in milliseconds, at or under which the countdown turns to warning. `0` stays neutral until the deadline passes.                                                            |
| `label`            | `string`                   | `''`        | false    | Name of what is due (`First reply`, `Certificate`), shown before the phrase. Empty shows the phrase alone.                                                                            |
| `type`             | `'due' \| 'expiry'`        | `'due'`     | false    | The words of the phrase: `due` says `Due in` and `Overdue by` (a task, an SLA); `expiry` says `Expires in` and `Expired` (a certificate, a key, a trial).                             |
| `paused`           | `boolean`                  | `false`     | false    | The clock is stopped (an SLA waiting on the customer): the countdown says `Paused` with a pause icon, stays neutral and stops counting.                                               |
| `size`             | `'small' \| 'medium'`      | `'medium'`  | false    | Size token of the tag; `medium` is 24px tall, `small` is 20px.                                                                                                                        |

## Events

_none_

## Slots

_none_

## States

The root is a `Tag`; its `data-severity` and `data-size` come from Tag.

| State     | Condition                          | `data-severity` | Icon                   | Phrase (`type="due"` / `type="expiry"`)                                                                  |
| --------- | ---------------------------------- | --------------- | ---------------------- | -------------------------------------------------------------------------------------------------------- |
| remaining | time left above `warningThreshold` | `neutral`       | `az az-clock`          | `Due in 2h 15m` / `Expires in 2h 15m`; from 24 h: `Due tomorrow`, `Due in 3 days` / `Expires in 30 days` |
| warning   | 0 < time left ≤ `warningThreshold` | `warning`       | `az az-triangle-alert` | `Due in 45m` / `Expires in 45m`                                                                          |
| overdue   | deadline reached or passed         | `danger`        | `az az-circle-alert`   | `Overdue by 15m`, `Overdue by 2d 3h` / `Expired 15 minutes ago`, `Expired yesterday`                     |
| paused    | `paused` is true (any deadline)    | `neutral`       | `az az-circle-pause`   | `Paused`                                                                                                 |
| invalid   | `deadline` empty or unparseable    | —               | —                      | a muted dash, no tag                                                                                     |

- `invalid` wins over `paused`: an empty or unparseable deadline renders the dash even when `paused` is set. `invalid` means an unparseable deadline, as in Timestamp, not form validation.
- `loading`, `empty`, `error`, `disabled` and `readonly` do not apply: the deadline is a prop the consumer passes, the component holds no async state and is not interactive.
- Test ids: Countdown passes `data-testid` to Tag with the fallback `countdown` (a consumer `data-testid` wins); the parts are `countdown__icon` (from Tag), `countdown__label` and `countdown__text`. Countdown renders its text in Tag's default slot and never passes `label` to Tag, so it isolates the label itself (`dir="auto"`).

- Root data attributes: `data-type` mirrors `type`; `data-overdue` while the deadline has passed and the countdown is not paused; `data-paused` while `paused`; `data-invalid` on the dash.
- Durations under 24 h are written in whole minutes rounded up (2 h 14 m 30 s left reads `2h 15m`, 20 s left reads `1m`), with the two largest non-zero units (`2d 3h`, `2h 15m`, `45m`), so it never says overdue early. When the rounded time left reaches 24 h (1,440 minutes) the relative day phrase takes over. Two units are joined by the `countdown.duration` message, so the order and the separator come from the locale. From 24 h left the phrase is the relative day phrase of `Timestamp` (`tomorrow`, `in 3 days`, `in 2 months`).
- Overdue for `type="due"` is a duration since the deadline, rounded up to the minute (at least `1m`); expired for `type="expiry"` is the relative phrase of `Timestamp` (`just now`, `15 minutes ago`, `yesterday`).
- Clock: the reference time is the provider's `now` when set, else the shared `useMinuteClock` that every Countdown, Timestamp and `TableCellTime` on the page reads, ticking once a minute. This work extends that composable (`src/composables/use-minute-clock/use-minute-clock.ts`, with its own test): while the document is hidden it clears its interval; when the document shows again it reads the time at once and restarts the interval; its `visibilitychange` listener is added with the first subscriber and removed with the last (unsubscribe runs in `onScopeDispose`). Timestamp and TableCellTime get the same pause. The crossing into warning or overdue therefore shows within a minute; SLA targets are counted in minutes, and one shared timer keeps a list of a thousand tickets at one interval.
- Before mount, the server and the first client render may differ by the time between them; the phrase is marked `data-allow-mismatch="text"`. With `now` on the provider both render the same text.
- Live announcements: none. The phrase is not a live region: a list of tickets would interrupt a screen reader every minute, and an app that must alert an agent about a breach does it once with a `Toast`. The current phrase is read when the reader reaches the countdown.

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
| ------- | ---------------------- | ----- | ----------------------- |
| _none_  | —                      | —     | —                       |

## Tokens

| Region            | Token (DESIGN.md)                                                                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| tag surface, text | `Tag` tokens: neutral `var(--bg-canvas)` + `var(--border-default)` + `var(--text-default)`; warning `var(--warning)` + `var(--warning-foreground)`; danger `var(--danger)` + `var(--danger-foreground)` |
| tag typography    | `Tag` (`.text-tag-md`, `.text-tag-sm`)                                                                                                                                                                  |
| icon              | `Tag` icon slot, the tag's text colour                                                                                                                                                                  |
| label             | inherits the tag text                                                                                                                                                                                   |
| invalid dash      | `var(--text-muted)`                                                                                                                                                                                     |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not focusable; Countdown is static text inside the row or header that holds it.
- Keyboard map: none (no interactive element).
- ARIA: no role and no `aria-label`. The visible phrase with narrow units (`Due in 2h 15m`) is `aria-hidden`, and beside it a visually hidden (`sr-only`) span carries the same phrase with long units (`unitDisplay: 'long'`: `Due in 2 hours 15 minutes`), so a screen reader never reads `m` as meters; a relative phrase (`Due tomorrow`) and `Paused` are the same in both. A screen reader hears `First reply: Due in 2 hours 15 minutes`. The icon is `aria-hidden`. Both spans sit in a `time` element whose `datetime` is the ISO 8601 UTC deadline.
- Never colour only: each state changes the icon (clock, triangle, circle alert, pause) and the words (`Due in`, `Overdue by`, `Paused`), so it reads in forced colours and for colour-blind people.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons): `Tag`'s neutral, warning and danger pairs are documented token pairs (`rules/webkit-tokens.md` § Contrast).
- `motion-reduce:*`: no motion.
- Touch target: not interactive.

## Internationalization

| Key                   | English source          | Override prop |
| --------------------- | ----------------------- | ------------- |
| `countdown.label`     | `{label}:`              | —             |
| `countdown.dueIn`     | `Due in {duration}`     | —             |
| `countdown.due`       | `Due {relative}`        | —             |
| `countdown.overdue`   | `Overdue by {duration}` | —             |
| `countdown.duration`  | `{major} {minor}`       | —             |
| `countdown.expiresIn` | `Expires in {duration}` | —             |
| `countdown.expires`   | `Expires {relative}`    | —             |
| `countdown.expired`   | `Expired {relative}`    | —             |
| `countdown.paused`    | `Paused`                | —             |

- Formatting: durations with `Intl.NumberFormat` units in their narrow form (`useLocale().formatNumber`, `style: 'unit'`, `unitDisplay: 'narrow'` for the visible text, `2h 15m` in English and `2h 15min` in Portuguese, and `unitDisplay: 'long'` for the screen-reader text), two units joined by `countdown.duration`; relative phrases with `Intl.RelativeTimeFormat` (`useLocale().formatRelativeTime`, `numeric: 'auto'`), through the relative phrasing of `Timestamp`; `just now` is `timestamp.justNow`.

## Right-to-left

- Layout: inherits `Tag` (gap, no physical side); the icon leads and the label comes before the phrase in the reading order.
- Icons: clock, triangle, circle alert and pause are not directional and do not mirror.
- Keyboard: no keyboard logic.
- User data: the label is isolated with `dir="auto"`; the phrase is locale text.

## Responsive

- Container queries: none: fixed height, the width follows the text.
- Narrow: the tag does not wrap (`whitespace-nowrap` on Countdown's text wrapper, since Tag sets none); a long `label` is the consumer's to shorten.
- Touch: not interactive.
- Reflow: no horizontal scroll at 320 px with the phrases above.

## Performance

- Bundle budget: 4.3 KB gzip for `./countdown` in `.size-limit.json` (Tag, the Timestamp parsing and the locale helpers; 4.16 KB measured).
- Runtime budget: every Countdown shares one minute clock; no per-instance timer; the phrase is a computed over the clock.
- Heavy parts: none; no dependency beyond Vue.

## Examples

- Default — the three states side by side with a fixed `now`: remaining (`Due in 5h`), warning (`Due in 45m`) and overdue (`Overdue by 15m`), each labelled `First reply`.
- Paused — a paused SLA next to a running one, as a ticket header shows it while it waits on the customer.
- Expiry — `type="expiry"` for a certificate, an API key and a trial: `Expires in 30 days`, `Expires tomorrow`, `Expired yesterday`.
- Sizes — `small` and `medium`.
- Ticket list — Countdown in a small table of tickets (Acme sample data) with the first-reply SLA per row. Justified addition: the SLA column is the job it is built for, and only a composed list shows several states at once.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

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
