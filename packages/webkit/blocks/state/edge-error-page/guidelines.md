# Edge error page

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
