# Invocations

The page a user opens to understand one run of a function: did it work, how long did it take, where did the time go, and what did the code print. It reads top to bottom from the answer to the evidence: the invocation summary, the path the request travelled, the trace that measured each step, and the logs on the same clock. It is a page body for `ConsoleLayout`: the layout owns the rail, the header with the breadcrumb (Functions › the function › Invocations) and the `main`.

## When to use

- A function has run and the user needs one invocation end to end: its status, duration, request and outcome.
- The user arrives from a function's list of runs, from an alert, or from a failed request in an event log.
- Several services touch the request and the user must see which hop spent the time or failed.

## When not to use

- Testing code you are still editing: use the TestRun variant of `platform/edit/code-editor`.
- Searching many requests or events across products: use an event log table, e.g. `platform/view/table-view`.
- The overview of the function itself, its versions or deployments: use `platform/detail/details-page`.
- Following a deployment as it builds: use `platform/detail/deployment-logs`.

## Building blocks

### A. Page heading — `PageHeader` (required)

A medium `PageHeader` titled Invocation, singular because the page is one run, with one sentence on what the page shows. The list of runs is the Recent switcher on this page, and the full list lives in Real-Time Events. The function is in the breadcrumb, never repeated as a heading.

### B. Invocation summary — `Card`, `Link`, `Tooltip`, `CopyButton`, `StatusIndicator`, `Button`, `DropdownMenu`, `IconButton` (required)

`Card :padded="false"` with three bands. The subject band holds the function `Link` (its `Tooltip` says where it goes), the invocation ID in code type with a `CopyButton`, and the run's `StatusIndicator` (loading while it runs); then Replay as a secondary `Button` (disabled while the run is still going), the Recent switcher, an outlined medium `Button` with the history glyph inside `DropdownMenu.Trigger` (its `Tooltip` inside the trigger, like the actions menu) that opens a `DropdownMenu` of the recent invocations with their status and start that swaps the page to the picked run, and the Invocation actions `IconButton` menu with Open in Real-Time Events and Function settings. The facts band lists Started, Completed, Duration and Location. The state band, on the canvas fill, shows the request that triggered the run with a `CopyButton` and its outcome, in danger color when it failed.

### C. Request path — `SectionHeader`, `Flow`, `Tag` (required)

A small `SectionHeader`, then a horizontally scrolling surface holding a `Flow` with one unstyled `Flow.Node` per hop: service, resource, function and origin, the last one `terminal`. Each node card has an eyebrow with its glyph and a status `Tag`, its name, and a short list of facts ending on the time spent there. A node measured by a span carries an outlined small `IconButton` named "Show <name> in the trace" that selects that span and scrolls the trace into view, honoring reduced motion.

### D. Trace — `Trace` (required)

A small `SectionHeader` over the `Trace` waterfall of the run, its spans nested by `parentId` with a service word and glyph, bound with `v-model:selected` so a node of the request path and a row of the waterfall are one selection. A failed span carries `status: 'error'` and its `message`; a span still going carries `status: 'running'`.

### E. Logs — `SectionHeader`, `StatusIndicator`, `LogView`, `LogViewContent` (required)

A small `SectionHeader` over a copyable `LogView` whose lines are timed from the run's zero (+16 ms), the same clock as the trace. Warnings and errors use the warning line type and keep the level word in the message; the last line of a completed run is a success line. While the run is going the lines printed so far stay on screen and a loading `StatusIndicator` reading Streaming sits in the section header; the view shows its own loading state only while no line has arrived yet, and `LogViewContent` holds the empty text.

## Do

- Lead with the outcome: the status and the outcome line come before any chart.
- Keep one clock for the trace and the logs, so a line and a span can be read against each other.
- Let a request path node jump to its span; never make the user search the waterfall for it.
- Keep the run switcher in the summary, so the user moves between invocations without leaving the page.
- Disable Replay while a run is still going, and report Replay through `toast`.

## Don't

- Don't color the outcome without words; the status and the outcome sentence carry the meaning.
- Don't put Replay or the run switcher in the page heading.
- Don't scroll smoothly when the user prefers reduced motion.
- Don't show raw stack traces in the summary; they belong in the failing span and the logs.

## Copy

- **Heading:** "Invocation", with "One run of this function, end to end: the path the request took and what each step cost."
- **Facts:** "Started", "Completed" ("Not yet" while running), "Duration", "Location".
- **Durations:** milliseconds under a second ("412 ms"), seconds with two decimals above ("1.24 s"); log times relative ("+16 ms").
- **Outcome:** the status code and one sentence, e.g. "502, the origin did not answer within the 1 s budget."
- **Node actions:** "Show <name> in the trace".
- **Menu:** "Open in Real-Time Events", "Function settings"; switcher "Recent", group "Recent invocations".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- The body renders no landmark of its own; the Request path, Trace and Logs are sections named by their headings.
- The invocation ID and the request each have a `CopyButton` with an `aria-label` that names what is copied.
- Status uses `StatusIndicator` and `Tag` with words, never color alone; decorative glyphs are `aria-hidden`.
- The request path node facts are a description list; each jump `IconButton` has an `aria-label` and a matching `Tooltip`.
- The trace is the `Trace` grid, named "Trace of <id>", operable with the keyboard; selecting from the path moves its selection, and the scroll respects `prefers-reduced-motion`.

## States

- Completed: a run that served its response, every node tagged Active or Answered, the trace with no error and the logs ending on a success line.
- Failed: a run the origin timed out, the danger status and outcome, the function and origin nodes failed, the origin-response span selected with its message, and warning lines in the logs.
- Running: a run in progress, the loading status, Replay disabled, Completed reading Not yet, running spans, and the lines printed so far with a Streaming indicator in the Logs header.

## Related

- `platform/edit/code-editor` — its TestRun variant runs the function before it ships, with the same trace and logs.
- `platform/detail/details-page` — its Invocation variant is the summary card on its own.
- `platform/detail/deployment-logs` — the step logs of a deployment.
- `shells/console` — the `ConsoleLayout` this page body renders in; see `skills/webkit-layout`.
