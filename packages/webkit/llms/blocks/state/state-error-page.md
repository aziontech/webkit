# StateErrorPage (`state/state-error-page`)

> The error page of Azion's own surfaces (Console, the site, the docs) when a page cannot show what the user asked for. Quiet and traceable: one centred `EmptyState` column with the HTTP code as a `StatusCode` in its figure, a title in plain words, one sentence, at most two `Button`s, and a reference line with the error code, the request ID (with `CopyButton`) and the time (`Timestamp`, UTC) for support. A visually hidden h1 names the code. The primary is the 404 (Go to home and Docs); variants cover 401 (session expired, Sign in), 403 (Request access, Switch account), 429 (Try again, About rate limits), 500 (Retry, System status), 503 (scheduled maintenance) and a missing record inside the console (Back to services). A page body: render it in the default slot of ConsoleLayout (or the site and docs shells); the 401 renders signed out, without the rail. The pages Azion's edge serves to visitors of customer sites use `state/state-edge-error-page` instead.

- Surface: app
- Source: `blocks/state/state-error-page/state-error-page.vue` in `@aziontech/webkit`
- MCP: `get_block("state/state-error-page")`
- Components: [Button](../../components/button.md), [CopyButton](../../components/copy-button.md), [EmptyState](../../components/empty-state.md), [StatusCode](../../components/status-code.md), [Timestamp](../../components/timestamp.md)
- Skills: `webkit-ui-states`, `webkit-errors`, `webkit-microcopy`

## Asked as

404 page; not found page; page not found; 401 session expired page; sign in required page; 403 forbidden page; access denied page; 429 too many requests page; 500 error page; server error page; 503 maintenance page; error page; console error page; resource not found; página não encontrada; página de erro; acesso negado; sessão expirada; erro 404; erro 500

The page Azion's own surfaces (Console, the site, the docs) render when they cannot show what the user asked for: the address leads nowhere (404), the session ended (401), the user's role does not include the page (403), the account sent too many requests (429), the server failed (500) or the console is in maintenance (503). The reader is an Azion user. Their job is to understand, in one sentence, that the problem is the address, the access or Azion and not their work, to get somewhere useful in one click, and to have the reference support will ask for. Every state has the same quiet, centred shape; only the code, the words and the two buttons change.

Two error page families, one per audience:

- **Console, site and docs** (this block, `surface: app`): Azion's users on Azion's pages. Quiet and centred, inside the product shell, with the account actions an Azion user needs.
- **Edge** (`state/state-edge-error-page`, `surface: edge`): the visitors of Azion customers' sites. Diagnostic, standalone, with the request path and no account actions.

The block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), or of the site and docs shells, which own the navigation, the header and the `main`. SessionExpired renders signed out, without the rail.

## When to use

- A route that matches nothing: the catch-all route renders the primary (404).
- A session that ended while the user was away: SessionExpired (401). Never for a first visit with no session; that goes straight to sign-in with no notice.
- A route the user's role does not include: Forbidden (403), instead of hiding the page or sending them home.
- A request the API refused for the rate limit: RateLimited (429).
- A page whose server request failed as a whole: ServerError (500).
- Scheduled maintenance or an overloaded console: Maintenance (503).
- A valid route whose record does not exist (a deleted service, a stale link): ResourceNotFound.

## When not to use

- The page a visitor of a customer's site sees when Azion's edge cannot serve it: use `state/state-edge-error-page`.
- One region of a page failed to render while the rest works: wrap the region in `ErrorBoundary`; it shows a danger `Alert` with Try again in its place.
- A list with no items yet: use `state/state-first-use`. A list whose filter matched nothing: use the no-match state of `view/view-table`.
- A form the server rejected: use `state/state-form-validation` (SectionRejected).
- A build or deploy that failed: use `state/state-async-submit`.
- The sign-in screens themselves: see `auth/auth-sign-in`.

## Building blocks

### A. Code — `StatusCode`

The HTTP status as a `StatusCode` (4xx warning, 5xx danger) in the `EmptyState` figure, the only figure on the page. The figure is decorative to assistive tech; the hidden `h1` names the code.

### B. Message — `EmptyState`

The title says what happened in the user's words (`Page not found`, `Your session expired`); the description says why and what to do, in one sentence. Centred in the content region, at most `--container-md` wide.

### C. Actions — `Button`

Two at most, side by side, wrapping on narrow screens. The way out is primary (`Go to home`, `Sign in`, `Request access`, `Retry`, `Back to services`); the help is outlined (`Docs`, `Switch account`, `About rate limits`, `System status`, `Status page`). Links that leave the app open in a new tab. The primary renders Go to home and Docs; a variant passes its own buttons in the `actions` slot.

### D. Reference line — `CopyButton`, `Timestamp`

Under the actions, in muted text: `Code` and the machine-readable error code, `ID` and the request ID with a `CopyButton`, and under them the time as a `Timestamp` in UTC. It is what support asks for, on every state.

## Data

The block shows no records and fetches nothing: the app passes the copy, the codes and the reference.

| Prop          | Type     | What it does                                               |
| ------------- | -------- | ---------------------------------------------------------- |
| `code`        | `number` | HTTP status in the `StatusCode` and the hidden `h1`.       |
| `errorCode`   | `string` | Machine-readable code in the reference line (`NOT_FOUND`). |
| `title`       | `string` | The `EmptyState` title (`Page not found`).                 |
| `description` | `string` | The sentence under it: why, and what to do.                |
| `requestId`   | `string` | The request ID, with its copy button.                      |
| `time`        | `string` | When the request failed, ISO 8601, shown in UTC.           |
| `homeHref`    | `string` | Where Go to home goes (`/`).                               |
| `docsHref`    | `string` | Where Docs goes, in a new tab.                             |

| Slot      | What it does                                       |
| --------- | -------------------------------------------------- |
| `actions` | Replaces Go to home and Docs; two buttons at most. |

| Event  | Payload   | When                                                                   |
| ------ | --------- | ---------------------------------------------------------------------- |
| `home` | `(event)` | Go to home was clicked; call `preventDefault` to route inside the app. |

```vue
<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import StateErrorPage from './state-error-page.vue'

  const router = useRouter()
  const goHome = (event: MouseEvent) => {
    event.preventDefault()
    router.push('/')
  }
</script>

<template>
  <StateErrorPage
    request-id="req_7f3c91ab"
    time="2026-11-18T14:02:11Z"
    @home="goHome"
  />
</template>
```

## Do

- Render the block on the address the user asked for; do not redirect to `/404`, so reloading tries the real address again.
- Answer with the matching HTTP status when the server renders the page.
- Keep the shell around every state but SessionExpired, so the user can move on without the back button.
- Log the same request ID and error code on the server that the page shows.
- On 403, say who can grant access (an account admin) and offer Switch account when the user belongs to more than one account.

## Don't

- Don't blame the user or show a stack trace, a raw status line or an exception message.
- Don't hide a 403 behind a 404 inside the product; use 404 only where revealing that the page exists would leak information.
- Don't add a third button, a search box or a list of popular pages.
- Don't auto-redirect after a countdown; the user decides where to go.
- Don't put the code in the visible title; the `StatusCode` already shows it.
- Don't use this block for the pages the edge serves to customers' visitors; those have no Azion account to act on.

## Copy

- **Title:** what happened, sentence case, no code: `Page not found`, `Your session expired`, `You don't have access to this page`, `Too many requests`, `Something went wrong on our side`, `Back soon: scheduled maintenance`.
- **Description:** why, and what to do, in one sentence; on a 5xx, reassure: `Nothing you saved was lost.`
- **Actions:** where it goes (`Go to home`, `Back to services`) or what it does (`Sign in`, `Request access`, `Retry`).
- **Reference line:** `Code NOT_FOUND · ID req_7f3c91ab` with the time in UTC on the line below, codes in `text-label-code-sm` inside `<bdi>`, with a `CopyButton` (`Copy the request ID`).

## Accessibility

- Each state has exactly one `h1` (visually hidden) naming the error code, so the page has a heading and the code is announced even though the figure is decorative.
- Every state is a body inside the layout's `main`, with no `main` of its own.
- The `EmptyState` is `role="status"`, so a client-side route change to this page is announced.
- Retry shows the `Button` loading state while the page reloads; the button keeps its label.
- Buttons that open a new tab carry an icon; do not rely on colour.

## States

- Default: 404 Page not found, Go to home (`homeHref`) and Docs (`docsHref`).
- SessionExpired: 401 Your session expired, Sign in; rendered signed out.
- Forbidden: 403 You don't have access to this page, Request access and Switch account.
- RateLimited: 429 Too many requests, Try again and About rate limits.
- ServerError: 500 Something went wrong on our side, Retry and System status.
- Maintenance: 503 Back soon: scheduled maintenance, Retry and Status page.
- ResourceNotFound: 404 for a missing record, naming the service and its ID, with Back to services.

## Related

- `state/state-edge-error-page` — the error pages Azion's edge serves to visitors of customer sites.
- `shell/shell-console` — the shell around every state but SessionExpired.
- `state/state-first-use` — an empty list, which is not an error.
- `state/state-form-validation` (SectionRejected) — a server rejection scoped to a form section.
- `state/state-async-submit` — the outcome of a build or deploy.
- `auth/auth-sign-in` — the sign-in screens.

## Variants

- `Default` — primary (the code below)
- `SessionExpired` — 401: the session ended. Your session expired, why (signed out after 12 hours for security), and Sign in, which brings the user back to the same address. Rendered signed out, without the console rail.
- `Forbidden` — 403: the address exists but the user's role does not include it. You don't have access to this page, who can grant it, and Request access with Switch account.
- `RateLimited` — 429: the account sent more requests than the limit allows. Too many requests, nothing was lost, and Try again with About rate limits.
- `ServerError` — 500: the page failed on the server. Something went wrong on our side, nothing saved was lost, Retry (which shows its loading state while the page reloads) and System status in a new tab.
- `Maintenance` — 503: scheduled maintenance. Back soon, until when, that the applications keep serving traffic, and Retry with Status page.
- `ResourceNotFound` — Inside the console: the route is valid but the record is not (deleted, or a stale link). The 404 names the resource and its ID and offers Back to services.

Each variant is the same screen in another state: `get_block("state/state-error-page", { variant })`, or the file under `blocks/state/state-error-page/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CopyButton from '@aziontech/webkit/copy-button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import StatusCode from '@aziontech/webkit/status-code'
  import Timestamp from '@aziontech/webkit/timestamp'

  export interface StateErrorPageProps {
    /** HTTP status code the page answers with. */
    code?: number
    /** Machine-readable error code shown in the reference line (NOT_FOUND). */
    errorCode?: string
    /** What happened, in the user's words. */
    title?: string
    /** Why it may have happened and what to do next, in one sentence. */
    description?: string
    /** The ID of the failed request, to quote to support. */
    requestId?: string
    /** When the request failed, as an ISO string. */
    time?: string
    /** Where Go to home goes. */
    homeHref?: string
    /** Where Docs goes; it opens in a new tab. */
    docsHref?: string
  }

  withDefaults(defineProps<StateErrorPageProps>(), {
    code: 404,
    errorCode: 'NOT_FOUND',
    title: 'Page not found',
    description: 'There is nothing at this address. Check the URL or head back to the start.',
    requestId: 'req_7f3c91ab',
    time: '2026-11-18T14:02:11Z',
    homeHref: '/',
    docsHref: 'https://example.com/docs'
  })

  const emit = defineEmits<{
    home: [event: MouseEvent]
  }>()

  defineSlots<{
    /** Replaces Go to home and Docs; two buttons at most. */
    actions(): unknown
  }>()
</script>

<template>
  <div
    class="flex w-full flex-1 flex-col items-center justify-center px-(--spacing-md) py-(--spacing-xl)"
  >
    <h1 class="sr-only">Error {{ code }}</h1>
    <div class="w-full max-w-(--container-md)">
      <EmptyState
        :title="title"
        :description="description"
      >
        <template #icon>
          <StatusCode :code="code" />
        </template>
        <template #actions>
          <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
            <slot name="actions">
              <Button
                label="Go to home"
                variant="primary"
                size="medium"
                icon="az az-home"
                :href="homeHref"
                @click="(event: MouseEvent) => emit('home', event)"
              />
              <Button
                label="Docs"
                aria-label="Docs (opens in a new tab)"
                variant="outline"
                icon="az az-book"
                size="medium"
                :href="docsHref"
                target="_blank"
              />
            </slot>
          </div>
          <div
            class="flex flex-col items-center gap-(--spacing-2xs) text-body-xs text-(--text-muted)"
          >
            <p
              class="m-0 flex flex-col items-center justify-center gap-x-(--spacing-xs) gap-y-(--spacing-2xs) sm:flex-row sm:flex-wrap"
              data-testid="state-error-page__reference"
            >
              <span>
                Code <bdi class="text-label-code-sm text-(--text-default)">{{ errorCode }}</bdi>
              </span>
              <span
                aria-hidden="true"
                class="hidden sm:inline"
                data-testid="state-error-page__separator"
                >·</span
              >
              <span class="inline-flex items-center gap-(--spacing-2xs)">
                ID <bdi class="text-label-code-sm text-(--text-default)">{{ requestId }}</bdi>
                <CopyButton
                  :value="requestId"
                  aria-label="Copy the request ID"
                  copied-label="Request ID copied"
                  size="small"
                />
              </span>
            </p>
            <Timestamp
              :value="time"
              format="utc"
            />
          </div>
        </template>
      </EmptyState>
    </div>
  </div>
</template>
```
