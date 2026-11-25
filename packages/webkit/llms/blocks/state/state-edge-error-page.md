# StateEdgeErrorPage (`state/state-edge-error-page`)

> The page Azion serves to a visitor of a customer's site when a request fails: a standalone page, no Azion product chrome, no account actions. Left-aligned and diagnostic: the `StatusCode` with its reason phrase, a title in plain words, the request path You → Azion → Application drawn with `FlowDiagram` (one data card per hop, `uniform` so every card has the same width and height, each with its status dot and text; one `orientation="responsive"` diagram, side by side when the row fits and stacked when it does not), What happened? and What can I do? side by side, Try again or Go to home page with Go back, then the request details in a `KeyValueList` (request ID with `CopyButton`, `Timestamp` in UTC, data center, host) and a Served by `Brand` footer. Azion here is Azion's infrastructure; the Application is the site's application, on Azion's infrastructure or on the customer's own servers. The primary is the 502 (application unreachable); variants cover 504, 500, 503, 403 (blocked by the site's firewall), 429 and 404. Azion's own console, site and docs use `state/state-error-page` instead.

- Surface: edge
- Source: `blocks/state/state-edge-error-page/state-edge-error-page.vue` in `@aziontech/webkit`
- MCP: `get_block("state/state-edge-error-page")`
- Components: [Brand](../../components/brand.md), [Button](../../components/button.md), [CopyButton](../../components/copy-button.md), [FlowDiagram](../../components/flow-diagram.md), [KeyValueList](../../components/key-value-list.md), [StatusCode](../../components/status-code.md), [Timestamp](../../components/timestamp.md)
- Skills: `webkit-errors`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

edge error page; 502 bad gateway page; 504 gateway timeout page; application unreachable page; application error page; origin unreachable page; 503 service unavailable page; firewall blocked page; waf blocked request page; rate limited page; 429 page for visitors; error page for site visitors; custom error page; página de erro do edge; aplicação indisponível; requisição bloqueada pelo firewall; página de error del edge

The page Azion serves to a visitor of a customer's site when the request fails: the site's application is down or slow, it answered with an error, the site's firewall blocked the request, or the visitor sent too many requests. The reader is not an Azion user: it is anyone on the internet who opened `www.example.com`. Their job is to learn, in one look, whose side the problem is on (their connection, Azion's infrastructure or the site's application), what they can do about it, and what to quote to the site owner. The page stands alone: it has no Azion product chrome, no navigation and nothing that needs an Azion account.

Two error page families, one per audience:

- **Edge** (this block, `surface: edge`): the visitors of your customers' sites. Diagnostic, left-aligned, with the request path.

- **Console, site and docs** (`state/state-error-page`, `surface: app`): Azion's own users on Azion's own pages. Quiet and centred, inside the product shell.

Words: the docs say **Azion's infrastructure**; the page itself says just **Azion**. The third hop is the **Application**, never "origin": the site's application may run on Azion's distributed infrastructure or on the customer's own servers, and the visitor does not need to know which.

## When to use

- The default error pages Azion serves when the site's application cannot answer: 502 (application unreachable, the primary), 504 (application timeout), 500 (application error) and 503 (application unavailable).
- A request a firewall or WAF rule on Azion blocked (Blocked, 403) or rate limited (RateLimited, 429).
- A 404 Azion serves for the site when the application has no page and the site has no page of its own (NotFound).
- As the starting point of a customer's own custom error page: the customer replaces the copy and keeps the structure.

## When not to use

- Any page of Azion Console, the Azion site or the docs: use `state/state-error-page`, which carries the account actions an Azion user needs (Sign in, Request access, Switch account) and sits in the product shell.
- An error inside a page that otherwise works: use `ErrorBoundary` or an `Alert` in the region that failed.
- A failed deploy or build: use `state/state-async-submit`.

## Building blocks

### A. Status line — `StatusCode`

The HTTP code as a `StatusCode` (4xx warning, 5xx danger) followed by the reason phrase (`Bad gateway`) in muted text. The code is the fact a visitor can search for or quote; the reason phrase says it in words.

### B. Request path — `FlowDiagram`

Three hops, always in this order: You (the browser), Azion (the data center that answered: its place, then its code, Ashburn, US (IAD)) and Application (the site's host). Each hop is a `FlowDiagram` data card: an icon and the hop's name in the header with its state as a status dot and text (Working, Error, Timed out, Unavailable, Blocked, Rate limited, Not reached, Not found), the browser, data center or host as the card's name, and a one-line explanation of the hop when the card is opened. The edges give one node per column and `uniform` gives every card the same width and height. One `FlowDiagram` with `orientation="responsive"` draws it: the cards sit side by side joined by dashed connectors when the whole row fits (the editor port squares are hidden: a visitor has nothing to connect), and stack at full width joined by a dashed rail when it does not, so the path never scrolls sideways and the page mounts the diagram once. The path answers "whose fault is it" before the visitor reads a word.

### C. Next steps — `Button`

What happened? and What can I do? sit side by side (stacked on a phone), each an `h2` and one or two sentences. What can I do? only offers what a visitor can do: try again, wait, go back, go to the site's home page, contact the site owner with the request ID.

Under them, two `Button`s at most. The primary is Try again (reloads the address) when waiting can fix it (5xx, 429), or Go to home page (the site's root) when it cannot (403, 404); the second is always Go back. Both emit an event first (`retry`, `back`); call `preventDefault` to handle them yourself.

### D. Request details — `KeyValueList`, `CopyButton`, `Timestamp`

Four facts in a two-column `KeyValueList` (one column on a phone): the request ID with a `CopyButton`, the time as a `Timestamp` in UTC, the Azion data center and the host. These are what the site owner needs to find the request in their logs.

### E. Footer — `Brand`

`Served by` and the Azion `Brand`, small, centred at the bottom, the only Azion mark on the page.

## Data

The block fetches nothing: Azion fills the props from the request it failed to serve.

| Prop        | Type                     | What it does                                                                                      |
| ----------- | ------------------------ | ------------------------------------------------------------------------------------------------- |
| `code`      | `number`                 | HTTP status (`502`).                                                                              |
| `reason`    | `string`                 | Reason phrase beside the code (`Bad gateway`).                                                    |
| `title`     | `string`                 | What happened, in the visitor's words; the page's `h1`.                                           |
| `cause`     | `string`                 | The answer to What happened?                                                                      |
| `advice`    | `string`                 | The answer to What can I do?; never an account action.                                            |
| `host`      | `string`                 | The host the visitor asked for; the Application hop and the Host fact.                            |
| `requestId` | `string`                 | The request ID to quote.                                                                          |
| `time`      | `string`                 | When the request was answered, ISO 8601.                                                          |
| `location`  | `string`                 | The Azion data center, its place then its code (`Ashburn, US (IAD)`); the Azion hop and its fact. |
| `path`      | `StateEdgeErrorPagePath` | `{ visitor, azion, application }`, each `{ status, severity }`.                                   |
| `recovery`  | `'retry' \| 'home'`      | The primary button: Try again, or Go to home page.                                                |

| Event   | Payload   | When                                                                         |
| ------- | --------- | ---------------------------------------------------------------------------- |
| `retry` | `(event)` | Try again was clicked; the page reloads unless the handler prevents default. |
| `back`  | `(event)` | Go back was clicked; the browser goes back unless the handler prevents it.   |

## Do

- Answer with the real status code (502, 504, 500, 503, 403, 429, 404), so browsers, crawlers and monitors see it.
- Keep the three hops in every state, with the hop that failed marked, so every error reads the same way.
- Give every hop the same card size: one node per level and the same parts (type, status, name) on every card.
- Show the request ID and the time on every state; log the same ID on Azion so the site owner can find the request.
- Say plainly when the problem is not the visitor's fault (`nothing you did caused this`).

## Don't

- Don't offer Sign in, Switch account, Request access or any other account action: the visitor has no Azion account, and the site owner's account is not theirs.
- Don't show Azion Console links, the product navigation, an internal hostname, a stack trace or the application's IP address.
- Don't blame the visitor, and don't name Azion as the culprit when the application failed: the path shows which hop it was.
- Don't auto-redirect or auto-reload in a loop; Try again is the visitor's choice.
- Don't drop the path on a phone; stack it instead.
- Don't write "edge" or "origin" on the page: the visitor reads Azion and Application.

## Copy

- **Title:** what happened, from the visitor's side, no code: `The site's application could not be reached`, `This site's firewall blocked your request`, `Too many requests from your connection`.
- **What happened?:** one or two sentences naming the hop: `Azion received your request, but the application that serves this site did not accept the connection.`
- **What can I do?:** what the visitor can do now: `Try again in a few minutes. If it keeps happening, let the site owner know and quote the request ID below.`
- **Hop states:** one or two words: `Working`, `Error`, `Timed out`, `Unavailable`, `Blocked`, `Rate limited`, `Not reached`, `Not found`.
- **Actions:** `Try again`, `Go to home page`, `Go back`.
- **Facts:** `Request ID`, `Time`, `Data center`, `Host`; the request ID in `text-label-code-sm` inside `<bdi>`.

## Accessibility

- The block is the whole page: it owns the single `main`, one `h1` (the title) and an `h2` for each section (Request path, What happened?, What can I do?).
- The request path is a `FlowDiagram` (`role="group"`) named by the Request path heading (`aria-labelledby`), holding a list of hops; each card's Details button opens its explanation (`aria-expanded`). The connectors are decorative, and a hidden list reads the connections.
- Severity is never colour alone: every status dot has its label.
- Long hosts truncate on a phone and wrap in the details; hosts and IDs sit in `<bdi>` so they keep their order on right-to-left pages.
- The phone and wide layouts of the path are the same content; the hidden one is `display: none`, so a screen reader hears it once.

## States

- Default: 502 Bad gateway, the application could not be reached; the Application hop reads Error; Try again and Go back.
- ApplicationTimeout: 504 Gateway timeout; the Application hop reads Timed out.
- ApplicationError: 500 Internal server error; the application answered with an error.
- ApplicationUnavailable: 503 Service unavailable; the Application hop reads Unavailable.
- Blocked: 403 Forbidden; the site's firewall matched the request, the Azion hop reads Blocked and the Application Not reached; Go to home page.
- RateLimited: 429 Too many requests; the Azion hop reads Rate limited and the Application Not reached.
- NotFound: 404 Not found; every hop worked and the Application reads Not found; Go to home page.

## Related

- `state/state-error-page` — the error pages of Azion's own console, site and docs.
- `FlowDiagram` — the request path (`nodes` + `edges`, `uniform`, `orientation="responsive"`).
- `state/state-async-submit` — a failed build or deploy inside the console.

## Variants

- `Default` — primary (the code below)
- `ApplicationTimeout` — 504: Azion reached the application, but it did not answer in time. The Application hop reads Timed out; Try again and Go back.
- `ApplicationError` — 500: the application answered with an error while building the page. The Application hop reads Error; Try again and Go back.
- `ApplicationUnavailable` — 503: the application is down for maintenance or too busy. The Application hop reads Unavailable; the copy says the site usually comes back on its own.
- `Blocked` — 403: a firewall or WAF rule the site owner set on Azion matched the request, so it never reached the application. The Azion hop reads Blocked and the Application Not reached; Go to home page and Go back, and the advice is to contact the site owner with the request ID.
- `RateLimited` — 429: the visitor's connection sent more requests than the site allows. The Azion hop reads Rate limited and the Application Not reached; wait a minute, then Try again.
- `NotFound` — 404: the application has no page at the address. Every hop worked and the Application reads Not found; Go to home page and Go back.

Each variant is the same screen in another state: `get_block("state/state-edge-error-page", { variant })`, or the file under `blocks/state/state-edge-error-page/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import CopyButton from '@aziontech/webkit/copy-button'
  import type {
    FlowDiagramEdgeData,
    FlowDiagramNodeData,
    FlowDiagramSeverity
  } from '@aziontech/webkit/flow-diagram-root'
  import FlowDiagram from '@aziontech/webkit/flow-diagram-root'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import StatusCode from '@aziontech/webkit/status-code'
  import Timestamp from '@aziontech/webkit/timestamp'
  import { computed, useId } from 'vue'

  /** The way back the primary button offers: reload the address, or open the site's home page. */
  export type StateEdgeErrorPageRecovery = 'retry' | 'home'

  /** The state of one hop of the request path. */
  export interface StateEdgeErrorPageHopState {
    /** The status label, in a word or two (Working, Error, Blocked). */
    status: string
    /** The colour of the status dot. */
    severity: FlowDiagramSeverity
  }

  /** The state of the three hops a request crosses: the visitor, Azion's infrastructure and the site's application. */
  export interface StateEdgeErrorPagePath {
    /** The visitor's browser. */
    visitor: StateEdgeErrorPageHopState
    /** The Azion data center that answered. */
    azion: StateEdgeErrorPageHopState
    /** The site's application, on Azion's infrastructure or on the site's own servers. */
    application: StateEdgeErrorPageHopState
  }

  export interface StateEdgeErrorPageProps {
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
    /** The Azion data center that answered: its place, then its code (Ashburn, US (IAD)). */
    location?: string
    /** The state of each hop of the request path. */
    path?: StateEdgeErrorPagePath
    /** The primary way back: Try again reloads the address, Go to home page opens the site's root. */
    recovery?: StateEdgeErrorPageRecovery
  }

  const props = withDefaults(defineProps<StateEdgeErrorPageProps>(), {
    code: 502,
    reason: 'Bad gateway',
    title: "The site's application could not be reached",
    cause:
      'Azion received your request, but the application that serves this site did not accept the connection.',
    advice:
      'Try again in a few minutes. If it keeps happening, let the site owner know and quote the request ID below.',
    host: 'www.example.com',
    requestId: '8f3c91ab2e4d7a10',
    time: '2026-11-18T14:02:11Z',
    location: 'Ashburn, US (IAD)',
    path: () => ({
      visitor: { status: 'Working', severity: 'success' },
      azion: { status: 'Working', severity: 'success' },
      application: { status: 'Error', severity: 'danger' }
    }),
    recovery: 'retry'
  })

  const emit = defineEmits<{
    retry: [event: MouseEvent]
    back: [event: MouseEvent]
  }>()

  const pathId = useId()

  const hops = computed(() => [
    {
      key: 'visitor',
      type: 'You',
      icon: 'az az-user',
      name: 'Browser',
      message: 'Your browser, where the request started.',
      ...props.path.visitor
    },
    {
      key: 'azion',
      type: 'Azion',
      icon: 'az az-azion',
      name: props.location,
      message: 'The Azion data center that received your request and answered with this page.',
      ...props.path.azion
    },
    {
      key: 'application',
      type: 'Application',
      icon: 'az az-applications',
      name: props.host,
      message:
        "The application that serves this site, on Azion's infrastructure or on the site's own servers.",
      ...props.path.application
    }
  ])

  const nodes = computed<FlowDiagramNodeData[]>(() =>
    hops.value.map(({ key, type, name, ...hop }) => ({
      id: key,
      eyebrow: type,
      title: name,
      ...hop
    }))
  )

  const edges: FlowDiagramEdgeData[] = [
    { from: 'visitor', to: 'azion' },
    { from: 'azion', to: 'application' }
  ]

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

      <div class="flex flex-col gap-(--spacing-sm)">
        <h2
          :id="pathId"
          class="m-0 text-label-md text-(--text-muted)"
        >
          Request path
        </h2>
        <div class="-mx-(--spacing-md)">
          <FlowDiagram
            :nodes="nodes"
            :edges="edges"
            orientation="responsive"
            uniform
            :show-ports="false"
            :aria-labelledby="pathId"
            data-testid="state-edge-error-page__path"
          />
        </div>
      </div>

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
          <KeyValueList.Item label="Data center">{{ location }}</KeyValueList.Item>
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
