# Edge error page

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

Under them, two `Button`s at most. The first is Try again (reloads the address) when waiting can fix it (5xx, 429), or Go to home page (the site's root) when it cannot (403, 404), a secondary button, never primary: an error page carries no orange button; the second is always Go back. Both emit an event first (`retry`, `back`); call `preventDefault` to handle them yourself.

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
| `recovery`  | `'retry' \| 'home'`      | The first button: Try again, or Go to home page.                                                  |

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
