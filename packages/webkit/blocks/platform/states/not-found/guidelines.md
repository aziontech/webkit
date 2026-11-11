# Not found

The page an app renders when it cannot show the address the user asked for: the address leads nowhere (404), the user may not see it (403), or the server failed to build it (500). The user's job is to understand, in one sentence, that the problem is the address or the access and not their work, and to get somewhere useful in one click. The block keeps the error code out of the headline (it is in the figure and in a hidden `h1`) and says what happened in plain words.

## When to use

- A route that matches nothing: the catch-all route of the app renders the primary.
- A route the user's role does not include: render Forbidden instead of hiding the page silently or sending them to the home page.
- A page whose server request failed as a whole (the data the page needs did not arrive and nothing on it can render): render ServerError.
- A valid route whose record does not exist (a deleted service, a stale link with an old ID): render ResourceNotFound inside the console shell.

## When not to use

- One region of a page failed to render while the rest works: wrap the region in `ErrorBoundary`; it shows a danger `Alert` with Try again in the region's place.
- A list with no items yet: use `platform/states/first-use`. A list whose filter matched nothing: use the no-match state of `platform/view/table-view`.
- A form the server rejected: use `platform/states/form-error`.
- A build or deploy that failed: use `platform/states/async-submit`; its toast and page `Alert` carry Edit and Redeploy.
- The account itself could not load after sign-in: that is an auth screen; see `platform/auth`.

## Building blocks

### A. Figure — `Error404` (`@aziontech/webkit/svg/error-404`)

The large numeral art in the `EmptyState` icon slot, 192 px wide on phones and 256 px from `sm`. It is decorative: the `EmptyState` icon wrapper is `aria-hidden`, and the hidden `h1` names the code. Forbidden uses `Error403`. ServerError and ResourceNotFound use the `EmptyState` icon tile (`pi pi-exclamation-triangle`, `pi pi-search`) because no numeral art exists for them.

### B. Message — `EmptyState` (required)

The title says what happened in the user's words (`Page not found`, `You don't have access to this page`); the description says why it may have happened and what to do next, in one or two sentences. Full-page variants centre it on the canvas, at most `--container-md` wide; ResourceNotFound uses `bordered` inside the content column, since the shell is still around it.

### C. Actions — `Button` (required)

Two at most, side by side, wrapping on narrow screens. The way out is primary (`Go to home`, `Try again`, `Back to services`); the help is outlined (`Docs`, `Switch account`, `System status`). Links that leave the app open in a new tab (`target="_blank"`).

## Do

- Render the block on the address the user asked for; do not redirect to `/404`, so reloading tries the real address again and the browser history stays honest.
- Answer with the matching HTTP status when the server renders the page (404, 403, 500), so crawlers and monitoring see it.
- Keep the shell (navigation, header) around ResourceNotFound and around a 403 inside the console, so the user can move on without the back button.
- Give a 500 an error reference the user can quote to support, and log the same reference on the server.
- On 403, say who can grant access (an account admin) and offer the switch when the user belongs to more than one account.

## Don't

- Don't blame the user (`You typed a wrong URL`) or show a stack trace, a raw status line or an exception message.
- Don't hide a 403 behind a 404 inside the product: a user who followed a link from a teammate needs to know to ask for access. Use 404 for a 403 only where revealing that the page exists would leak information.
- Don't add a search box, a sitemap or a list of popular pages; two actions are enough.
- Don't auto-redirect after a countdown; the user decides where to go.
- Don't put the error code in the visible title; the figure already shows it.

## Copy

- **Title:** what happened, sentence case, no code: `Page not found`, `You don't have access to this page`, `Something went wrong on our side`, `Service 4821 not found`.
- **Description:** why, and what to do: `There is nothing deployed at this address. Check the URL or head back to the start.` On a 500, reassure: `Nothing you saved was lost.`
- **Primary action:** where it goes: `Go to home`, `Back to services`; or what it does: `Try again`.
- **Secondary action:** `Docs`, `Switch account`, `System status`.
- **Reference:** `Error reference: req_7f3c91ab`, in monospace, wrapped in `<bdi>` so it keeps its order in right-to-left pages.

## Accessibility

- Each variant has exactly one `h1` (visually hidden) naming the error code, so the page has a heading and the code is announced even though the figure is decorative.
- The full-page variants are the `main` landmark; ResourceNotFound sits in the shell's content column and renders its own `main` only as a stand-alone page.
- The figure is `aria-hidden` (inside the `EmptyState` icon wrapper); never put the only statement of the error in the art.
- The `EmptyState` is `role="status"`, so a client-side route change to this page is announced.
- Try again shows the `Button` loading state while the page reloads; the button keeps its label.
- Buttons that open a new tab carry an icon; do not rely on colour.

## States

- Default: 404, the 404 numeral art, Page not found, Go to home and Docs.
- Forbidden: 403, the 403 numeral art, You don't have access to this page, Go to home and Switch account.
- ServerError: 500, the warning icon tile, Something went wrong on our side, Try again, System status and the error reference.
- ResourceNotFound: a bordered EmptyState in the console's content column naming the missing service and its ID, with Back to services.

## Related

- `shells/console` — the shell that frames ResourceNotFound and a 403 inside the product.
- `platform/states/first-use` — an empty list, which is not an error.
- `platform/states/form-error` — a server rejection scoped to a form section.
- `platform/states/async-submit` — the outcome of a build or deploy, with Edit and Redeploy.
- `platform/auth` — the sign-in screens, including the account that could not load.
