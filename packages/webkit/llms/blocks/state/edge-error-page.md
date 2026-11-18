# EdgeErrorPage (`state/edge-error-page`)

> The page Azion's edge serves to a visitor of a customer's site when a request fails: a standalone page, no Azion product chrome, no account actions. Left-aligned and diagnostic: the `StatusCode` with its reason phrase, a title in plain words, the request path You → Azion edge → Origin drawn with `FlowDiagram` `uniform` (every hop the same width and height, each with a `StatusIndicator`; stacked boxes of the same size on a phone), What happened? and What can I do? side by side, Try again or Go to home page with Go back, then the request details in a `KeyValueList` (request ID with `CopyButton`, `Timestamp` in UTC, edge location, host) and a Served by `Brand` footer. The primary is the 502 (origin unreachable); variants cover 504, 500, 503, 403 (blocked by the site's firewall), 429 and 404. Azion's own console, site and docs use `state/error-page` instead.

- Surface: edge
- Source: `blocks/state/edge-error-page/edge-error-page.vue` in `@aziontech/webkit`
- MCP: `get_block("state/edge-error-page")`
- Components: [Brand](../../components/brand.md), [Button](../../components/button.md), [CopyButton](../../components/copy-button.md), [FlowDiagram](../../components/flow-diagram.md), [KeyValueList](../../components/key-value-list.md), [StatusCode](../../components/status-code.md), [StatusIndicator](../../components/status-indicator.md), [Timestamp](../../components/timestamp.md)
- Skills: `webkit-errors`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

edge error page; 502 bad gateway page; 504 gateway timeout page; origin unreachable page; origin error page; 503 service unavailable page; firewall blocked page; waf blocked request page; rate limited page; 429 page for visitors; error page for site visitors; custom error page; página de erro do edge; origem indisponível; requisição bloqueada pelo firewall; página de error del edge

The page Azion's edge serves to a visitor of a customer's site when the request fails: the site's server is down or slow, it answered with an error, the site's firewall blocked the request, or the visitor sent too many requests. The reader is not an Azion user: it is anyone on the internet who opened `www.example.com`. Their job is to learn, in one look, whose side the problem is on (their connection, Azion's edge or the site's server), what they can do about it, and what to quote to the site owner. The page stands alone: it has no Azion product chrome, no navigation and nothing that needs an Azion account.

Two error page families, one per audience:

- **Edge** (this block, `surface: edge`): the visitors of your customers' sites. Diagnostic, left-aligned, with the request path.
- **Console, site and docs** (`state/error-page`, `surface: app`): Azion's own users on Azion's own pages. Quiet and centred, inside the product shell.

## When to use

- The default error pages an edge application serves when the origin cannot answer: 502 (origin unreachable, the primary), 504 (origin timeout), 500 (origin error) and 503 (origin unavailable).
- A request a firewall or WAF rule on the edge blocked (Blocked, 403) or rate limited (RateLimited, 429).
- A 404 the edge serves for the site when the origin has no page and the site has no page of its own (NotFound).
- As the starting point of a customer's own custom error page: the customer replaces the copy and keeps the structure.

## When not to use

- Any page of Azion Console, the Azion site or the docs: use `state/error-page`, which carries the account actions an Azion user needs (Sign in, Request access, Switch account) and sits in the product shell.
- An error inside a page that otherwise works: use `ErrorBoundary` or an `Alert` in the region that failed.
- A failed deploy or build: use `state/async-submit`.

## Building blocks

### A. Status line — `StatusCode`

The HTTP code as a `StatusCode` (4xx warning, 5xx danger) followed by the reason phrase (`Bad gateway`) in muted text. The code is the fact a visitor can search for or quote; the reason phrase says it in words.

### B. Request path — `FlowDiagram`, `StatusIndicator`

Three hops, always in this order: You (the browser), Azion edge (the location code that answered) and Origin (the site's host). Each hop shows its name, a second line and its state as a `StatusIndicator` (Working, Error, Timed out, Unavailable, Blocked, Rate limited, Not reached, Not found). On wide screens the hops are `FlowDiagram.Node`s in a `FlowDiagram` with `uniform`, so every box has the same width and height whatever its text; on a phone they stack as full-width boxes of the same height joined by a dashed line. The path answers "whose fault is it" before the visitor reads a word.

### C. Next steps — `Button`

What happened? and What can I do? sit side by side (stacked on a phone), each an `h2` and one or two sentences. What can I do? only offers what a visitor can do: try again, wait, go back, go to the site's home page, contact the site owner with the request ID.

Under them, two `Button`s at most. The primary is Try again (reloads the address) when waiting can fix it (5xx, 429), or Go to home page (the site's root) when it cannot (403, 404); the second is always Go back. Both emit an event first (`retry`, `back`); call `preventDefault` to handle them yourself.

### D. Request details — `KeyValueList`, `CopyButton`, `Timestamp`

Four facts in a two-column `KeyValueList` (one column on a phone): the request ID with a `CopyButton`, the time as a `Timestamp` in UTC, the edge location and the host. These are what the site owner needs to find the request in their logs.

### E. Footer — `Brand`

`Served by` and the Azion `Brand`, small, centred at the bottom, the only Azion mark on the page.

## Data

The block fetches nothing: the edge fills the props from the request it failed to serve.

| Prop        | Type                | What it does                                                      |
| ----------- | ------------------- | ----------------------------------------------------------------- |
| `code`      | `number`            | HTTP status (`502`).                                              |
| `reason`    | `string`            | Reason phrase beside the code (`Bad gateway`).                    |
| `title`     | `string`            | What happened, in the visitor's words; the page's `h1`.           |
| `cause`     | `string`            | The answer to What happened?                                      |
| `advice`    | `string`            | The answer to What can I do?; never an account action.            |
| `host`      | `string`            | The host the visitor asked for; the Origin hop and the Host fact. |
| `requestId` | `string`            | The request ID to quote.                                          |
| `time`      | `string`            | When the request was answered, ISO 8601.                          |
| `location`  | `string`            | The edge location code (`IAD`); the edge hop and its fact.        |
| `path`      | `EdgeErrorPagePath` | `{ visitor, edge, origin }`, each `{ status, severity }`.         |
| `recovery`  | `'retry' \| 'home'` | The primary button: Try again, or Go to home page.                |

| Event   | Payload   | When                                                                         |
| ------- | --------- | ---------------------------------------------------------------------------- |
| `retry` | `(event)` | Try again was clicked; the page reloads unless the handler prevents default. |
| `back`  | `(event)` | Go back was clicked; the browser goes back unless the handler prevents it.   |

## Do

- Answer with the real status code (502, 504, 500, 503, 403, 429, 404), so browsers, crawlers and monitors see it.
- Keep the three hops in every state, with the hop that failed marked, so every error reads the same way.
- Give every hop the same box size: `uniform` on `FlowDiagram` does it on wide screens, and the stacked boxes on a phone share one structure.
- Show the request ID and the time on every state; log the same ID on the edge so the site owner can find the request.
- Say plainly when the problem is not the visitor's fault (`nothing you did caused this`).

## Don't

- Don't offer Sign in, Switch account, Request access or any other account action: the visitor has no Azion account, and the site owner's account is not theirs.
- Don't show Azion Console links, the product navigation, an internal hostname, a stack trace or the origin's IP address.
- Don't blame the visitor, and don't name Azion as the culprit when the origin failed: the path shows which hop it was.
- Don't auto-redirect or auto-reload in a loop; Try again is the visitor's choice.
- Don't drop the path on a phone; stack it instead.

## Copy

- **Title:** what happened, from the visitor's side, no code: `The site's server could not be reached`, `This site's firewall blocked your request`, `Too many requests from your connection`.
- **What happened?:** one or two sentences naming the hop: `Azion's edge received your request, but the server that hosts this site did not accept the connection.`
- **What can I do?:** what the visitor can do now: `Try again in a few minutes. If it keeps happening, let the site owner know and quote the request ID below.`
- **Hop states:** one or two words: `Working`, `Error`, `Timed out`, `Unavailable`, `Blocked`, `Rate limited`, `Not reached`, `Not found`.
- **Actions:** `Try again`, `Go to home page`, `Go back`.
- **Facts:** `Request ID`, `Time`, `Edge location`, `Host`; the request ID in `text-label-code-sm` inside `<bdi>`.

## Accessibility

- The block is the whole page: it owns the single `main`, one `h1` (the title) and an `h2` for each section (Request path, What happened?, What can I do?).
- The request path is a list (`FlowDiagram` is `role="list"`, the phone layout an `ol`); each hop reads as its name, its second line and its state. The connectors are decorative.
- Severity is never colour alone: every `StatusIndicator` has its label.
- Long hosts truncate on a phone and wrap in the details; hosts and IDs sit in `<bdi>` so they keep their order on right-to-left pages.
- The phone and wide layouts of the path are the same content; the hidden one is `display: none`, so a screen reader hears it once.

## States

- Default: 502 Bad gateway, the origin could not be reached; the origin hop reads Error; Try again and Go back.
- OriginTimeout: 504 Gateway timeout; the origin hop reads Timed out.
- OriginError: 500 Internal server error; the origin answered with an error.
- OriginUnavailable: 503 Service unavailable; the origin hop reads Unavailable.
- Blocked: 403 Forbidden; the site's firewall matched the request, the edge hop reads Blocked and the origin Not reached; Go to home page.
- RateLimited: 429 Too many requests; the edge hop reads Rate limited and the origin Not reached.
- NotFound: 404 Not found; every hop worked and the origin reads Not found; Go to home page.

## Related

- `state/error-page` — the error pages of Azion's own console, site and docs.
- `FlowDiagram` — the request path, with `uniform` for equal boxes.
- `state/async-submit` — a failed build or deploy inside the console.

## Variants

- `Default` — primary (the code below)
- `OriginTimeout` — 504: the edge reached the origin, but it did not answer in time. The origin hop reads Timed out; Try again and Go back.
- `OriginError` — 500: the origin answered with an error while building the page. The origin hop reads Error; Try again and Go back.
- `OriginUnavailable` — 503: the origin is down for maintenance or too busy. The origin hop reads Unavailable; the copy says the site usually comes back on its own.
- `Blocked` — 403: a firewall or WAF rule the site owner set on the edge matched the request, so it never reached the origin. The edge hop reads Blocked and the origin Not reached; Go to home page and Go back, and the advice is to contact the site owner with the request ID.
- `RateLimited` — 429: the visitor's connection sent more requests than the site allows. The edge hop reads Rate limited and the origin Not reached; wait a minute, then Try again.
- `NotFound` — 404: the origin has no page at the address. Every hop worked and the origin reads Not found; Go to home page and Go back.

Each variant is the same screen in another state: `get_block("state/edge-error-page", { variant })`, or the file under `blocks/state/edge-error-page/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import CopyButton from '@aziontech/webkit/copy-button'
  import FlowDiagram from '@aziontech/webkit/flow-diagram'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import StatusCode from '@aziontech/webkit/status-code'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import Timestamp from '@aziontech/webkit/timestamp'
  import { computed, useId } from 'vue'

  /** The way back the primary button offers: reload the address, or open the site's home page. */
  export type EdgeErrorPageRecovery = 'retry' | 'home'

  /** The state of one hop of the request path. */
  export interface EdgeErrorPageHopState {
    /** The status label, in a word or two (Working, Error, Blocked). */
    status: string
    /** The colour of the status dot. */
    severity: StatusIndicatorSeverity
  }

  /** The state of the three hops a request crosses: the visitor, Azion's edge and the site's origin server. */
  export interface EdgeErrorPagePath {
    /** The visitor's browser. */
    visitor: EdgeErrorPageHopState
    /** The Azion edge location that answered. */
    edge: EdgeErrorPageHopState
    /** The site's own server. */
    origin: EdgeErrorPageHopState
  }

  export interface EdgeErrorPageProps {
    /** HTTP status code of the response. */
    code?: number
    /** The status reason phrase shown beside the code (Bad gateway). */
    reason?: string
    /** What happened, in the visitor's words. */
    title?: string
    /** The answer to What happened. */
    cause?: string
    /** The answer to What can I do; never an account action, the visitor has no account. */
    advice?: string
    /** The host the visitor asked for. */
    host?: string
    /** The ID of the request, to quote to the site owner. */
    requestId?: string
    /** When the request was answered, as an ISO string. */
    time?: string
    /** The code of the Azion edge location that answered (IAD). */
    location?: string
    /** The state of each hop of the request path. */
    path?: EdgeErrorPagePath
    /** The primary way back: Try again reloads the address, Go to home page opens the site's root. */
    recovery?: EdgeErrorPageRecovery
  }

  const props = withDefaults(defineProps<EdgeErrorPageProps>(), {
    code: 502,
    reason: 'Bad gateway',
    title: "The site's server could not be reached",
    cause:
      "Azion's edge received your request, but the server that hosts this site did not accept the connection.",
    advice:
      'Try again in a few minutes. If it keeps happening, let the site owner know and quote the request ID below.',
    host: 'www.example.com',
    requestId: '8f3c91ab2e4d7a10',
    time: '2026-11-18T14:02:11Z',
    location: 'IAD',
    path: () => ({
      visitor: { status: 'Working', severity: 'success' },
      edge: { status: 'Working', severity: 'success' },
      origin: { status: 'Error', severity: 'danger' }
    }),
    recovery: 'retry'
  })

  const emit = defineEmits<{
    retry: [event: MouseEvent]
    back: [event: MouseEvent]
  }>()

  const pathId = useId()

  const hops = computed(() => [
    { key: 'visitor', name: 'You', detail: 'Browser', ...props.path.visitor },
    { key: 'edge', name: 'Azion edge', detail: props.location, ...props.path.edge },
    { key: 'origin', name: 'Origin', detail: props.host, ...props.path.origin }
  ])

  const homeHref = computed(() => `https://${props.host}/`)

  const onRetry = (event: MouseEvent) => {
    emit('retry', event)
    if (!event.defaultPrevented) globalThis.location.reload()
  }

  const onBack = (event: MouseEvent) => {
    emit('back', event)
    if (!event.defaultPrevented) globalThis.history.back()
  }
</script>

<template>
  <div class="flex min-h-dvh w-full flex-col bg-(--bg-canvas) text-(--text-default)">
    <main
      class="mx-auto flex w-full max-w-(--container-4xl) flex-1 flex-col gap-(--spacing-xl) px-(--spacing-md) py-(--spacing-2xl) md:px-(--spacing-xl)"
    >
      <header class="flex flex-col items-start gap-(--spacing-sm)">
        <p class="m-0 flex flex-wrap items-center gap-(--spacing-xs)">
          <StatusCode :code="code" />
          <span class="text-label-md text-(--text-muted)">{{ reason }}</span>
        </p>
        <h1 class="m-0 text-heading-lg text-(--text-default)">{{ title }}</h1>
      </header>

      <section
        :aria-labelledby="pathId"
        class="flex flex-col gap-(--spacing-sm)"
      >
        <h2
          :id="pathId"
          class="m-0 text-label-md text-(--text-muted)"
        >
          Request path
        </h2>
        <div class="-mx-(--spacing-md) hidden md:block">
          <FlowDiagram uniform>
            <FlowDiagram.Node
              v-for="hop in hops"
              :key="hop.key"
            >
              <span
                :data-hop="hop.key"
                class="flex w-full min-w-0 flex-col items-start gap-(--spacing-2xs)"
              >
                <span class="text-label-md text-(--text-default)">{{ hop.name }}</span>
                <bdi class="text-body-xs text-(--text-muted)">{{ hop.detail }}</bdi>
                <StatusIndicator
                  :severity="hop.severity"
                  :label="hop.status"
                />
              </span>
            </FlowDiagram.Node>
          </FlowDiagram>
        </div>
        <ol class="m-0 flex list-none flex-col p-0 md:hidden">
          <li
            v-for="(hop, index) in hops"
            :key="hop.key"
            class="flex flex-col"
          >
            <span
              v-if="index > 0"
              aria-hidden="true"
              class="ms-(--spacing-lg) h-(--spacing-md) w-px border-s border-dashed border-(--accent)"
            />
            <span
              :data-hop="hop.key"
              class="flex items-center justify-between gap-(--spacing-sm) rounded-(--shape-button) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-md) py-(--spacing-sm) shadow-(--shadow-xs)"
            >
              <span class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                <span class="text-label-md text-(--text-default)">{{ hop.name }}</span>
                <bdi class="truncate text-body-xs text-(--text-muted)">{{ hop.detail }}</bdi>
              </span>
              <StatusIndicator
                :severity="hop.severity"
                :label="hop.status"
              />
            </span>
          </li>
        </ol>
      </section>

      <div class="grid gap-(--spacing-lg) md:grid-cols-2">
        <section class="flex flex-col gap-(--spacing-xs)">
          <h2 class="m-0 text-heading-2xs text-(--text-default)">What happened?</h2>
          <p class="m-0 text-body-sm text-(--text-muted)">{{ cause }}</p>
        </section>
        <section class="flex flex-col gap-(--spacing-xs)">
          <h2 class="m-0 text-heading-2xs text-(--text-default)">What can I do?</h2>
          <p class="m-0 text-body-sm text-(--text-muted)">{{ advice }}</p>
        </section>
      </div>

      <div class="flex flex-wrap items-center gap-(--spacing-xs)">
        <Button
          key="retry"
          v-if="recovery === 'retry'"
          label="Try again"
          variant="primary"
          size="medium"
          icon="az az-refresh"
          @click="onRetry"
        />
        <Button
          key="home"
          v-else
          label="Go to home page"
          variant="primary"
          size="medium"
          icon="az az-home"
          :href="homeHref"
        />
        <Button
          label="Go back"
          variant="outline"
          size="medium"
          icon="az az-arrow-left"
          @click="onBack"
        />
      </div>

      <div class="border-t border-(--border-default) pt-(--spacing-lg)">
        <KeyValueList
          :columns="2"
          aria-label="Request details"
        >
          <KeyValueList.Item label="Request ID">
            <bdi class="text-label-code-sm text-(--text-default)">{{ requestId }}</bdi>
            <CopyButton
              :value="requestId"
              aria-label="Copy the request ID"
              copied-label="Request ID copied"
              size="small"
            />
          </KeyValueList.Item>
          <KeyValueList.Item label="Time">
            <Timestamp
              :value="time"
              format="utc"
            />
          </KeyValueList.Item>
          <KeyValueList.Item label="Edge location">{{ location }}</KeyValueList.Item>
          <KeyValueList.Item label="Host">
            <bdi>{{ host }}</bdi>
          </KeyValueList.Item>
        </KeyValueList>
      </div>
    </main>
    <footer
      class="flex items-center justify-center gap-(--spacing-xs) border-t border-(--border-default) px-(--spacing-md) py-(--spacing-md) text-body-xs text-(--text-muted)"
    >
      Served by
      <Brand size="small" />
    </footer>
  </div>
</template>
```
